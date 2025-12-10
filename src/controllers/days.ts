import { dataform } from "googleapis/build/src/apis/dataform/index.js";
import Day, { TDay, THistoryEvent } from "../models/day.js";
import { dayInMilliseconds, isOldDay } from "../utils.js";
import User, { TUser } from "../models/user.js";
import {  Response } from "../routes.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import { queryDate } from "../functions/days.js";
import { ProtectedReq } from "../routes.js";
import { queryDayDate } from "./goals.js";
export const getLastSunday = (date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() - date.getDay());
  return date;
}
export const getLastMonday = (date: number | Date) =>{
  date = new Date(date);
  date.setHours(0,0,0,0);
  date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  return date;
}
export const aggregateDays = (date: number, userId: string | ObjectId):mongoose.PipelineStage[] =>[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        userId: userId.toString(),
        history: {$exists: true, $type: 'array', $ne: []},
        $or: [
          {
            $and: [
              {
                "goal.frequency": {
                  $eq: "daily",
                },
              },
              {
                date: {
                  $gte: date
                }
              }]
          },
          {
            $and: [
              {
                "goal.frequency": {
                  $eq: "weekly",
                },
              },
              {
                date: {
                  $gte: getLastMonday(date).getTime(),
                },
              },
            ],
          },
        ],
      },
  },
  {
    $sort: {
      "date": -1
    }
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$goal._id",
        title: {$last: "$goal.title"},
        amount: {$last: "$goal.amount"},
        frequency: {$last: "$goal.frequency"},
        type: {$last: "$goal.type"},
        history: {
          $push: {
            _id: "$_id",
            history: "$history",
            date: "$date",
            goal: "$goal",
          },
        },
      },
  },
]
const getDays = async(req: ProtectedReq, res) =>{
    let user: TUser;
    let timestamp: number;
    if(typeof req.query.timestamp == 'string' ) timestamp = parseInt(req.query.timestamp, 10);
    if(req.query.id) user = await User.findById(req.query.id);
    if(!user) user = req.user;
    //console.log({timestamp}, req.query)
    const date = new Date(timestamp);
    date.setHours(0,0,0,0);
    
    //const days = await Day.find({userId: req.user.id, $or: [{date: {$gte: date.getTime()}}, {$and: [{"goal.frequency":{$eq: "weekly"} }, {date: {$gte: date.getTime() - week}}]}]});
    const days = await Day.aggregate(aggregateDays(date.getTime(), user.id));
    console.log("found days: ", days.length, {days}, {goals: user.goals}, date, getLastMonday(date), date.getDay())

    if(days.length <user.goals.length){
      user.goals.map(goal =>{
        let alreadyExists = days.find(day => day._id.toString() === goal._id.toString());
        if(!alreadyExists) days.push({...goal, history: []})
      })
    }
    return res.send(days)
}
const getStats = async(req: ProtectedReq, res: Response) =>{
    let {userId} = req.params;
    console.log(req.params)
    let user: TUser;
    if(userId) user = await User.findById(userId);
    else user = req.user;

    const promises = [];
    user.goals.map(goal =>{
        let promise = async() => {
          let days = await Day.find({userId: user.id, "goal._id": new ObjectId(goal._id), history: {$exists: true, $type: 'array', $ne: []}}).sort({date: 1})
          return {...goal, days}
        }
        promises.push(promise());
    })
    const result = await Promise.all(promises);
    return res.send(result)
}
const postProgress = async(req: ProtectedReq, res: Response) =>{
    console.log(req.body)
    const {date, goalId, progress, notes} = req.body;
    let progressDate = new Date(date);
    progressDate.setHours(0,0,0,0)
    let day = await Day.findOne({$and: [{"goal._id":  new ObjectId(goalId)}, queryDayDate(progressDate.getTime())] });
    if(!day ){
        console.log("old day post progress");
        let historyEvent: THistoryEvent = {date, progress,notes, likes: []};
        let goal = req.user.goals.find(goal => goalId === goal._id.toString())
        console.log({goal})
        day = await Day.create({goal, date, progress, userId: req.user._id, history: [historyEvent]})
        return res.send(day)
    }
    let totalProgress = day.progress + progress;
    let historyEvent: THistoryEvent = {date, progress,notes, likes: []}
    day = await Day.findByIdAndUpdate(day.id, {
        progress: totalProgress,
        $push: {history: historyEvent}
    },{new: true})
    console.log({day, totalProgress})
    return res.send(day)
}
const getLastDayGoal = async(date, goalId) =>{
    const lastDay = await Day.findOne({$and: [{date: {$lte: date}}, {"goal._id": new ObjectId(goalId)}]},{},{$sort: {date: -1}})
    console.log("last day", lastDay)
    return lastDay.goal;
}
const updateProgress = async(req: ProtectedReq, res: Response) =>{
    console.log(req.body)
    const {date, id, progress, notes, newDate} = req.body;
    let oldDay = await Day.findById(id);
    let newDateObj = new Date(newDate);
    let dateObj = new Date(oldDay.date);
    dateObj.setHours(0,0,0,0);
    newDateObj.setHours(0,0,0,0);
    let day: TDay;
    if(newDateObj.getTime() == dateObj.getTime()){
      day = await Day.findOneAndUpdate({_id: new ObjectId(id), "history.date": date}, {$set: {"history.$.progress": progress, "history.$.notes": notes, "history.$.date": newDate}},{new: true});
    }else{
      let historyEvent: THistoryEvent = {date: newDate, progress,notes, likes: []};
      // Remove old progress from day
      await Day.findOneAndUpdate({_id: new ObjectId(id), "history.date": date}, {$pull: {history: {date}}},{new: true});

      // Add progress to the new day if exists
      console.log(queryDate(newDateObj.getTime()), oldDay.goal)
      day= await Day.findOneAndUpdate({$and: [queryDayDate(newDateObj.getTime()), {userId: req.user.id, "goal._id": new ObjectId(oldDay.goal._id)}]}, {$push: {history: historyEvent}},{new: true} )
      console.log("updated day", day)
      let goal = await getLastDayGoal(date, oldDay.goal._id)
      // Create another day if it doesn't 
      if(!day){
        console.log("update progress creating new day");
        day = await Day.create({goal: goal, date: newDateObj.getTime(), progress: 0, userId: req.user.id, history: [historyEvent]})
      } 
    }
    console.log(day)
    res.send(day)
}
const deleteProgress = async(req: ProtectedReq, res: Response) =>{
    console.log(req.query)
    let {date, id} = req.query;
    let dateNumber = parseInt(date as string, 10);
    const day = await Day.findOneAndUpdate({_id: new ObjectId(id as string)}, {$pull: {history: {date: dateNumber}}},{new: true});
    console.log(day)
    res.send(day)
}
export {
    getDays,
    postProgress,
    getStats,
    updateProgress,
    deleteProgress
}