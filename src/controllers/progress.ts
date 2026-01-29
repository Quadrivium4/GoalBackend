import { dataform } from "googleapis/build/src/apis/dataform/index.js";
import Day, { TDay, THistoryEvent } from "../models/day.js";
import { dayInMilliseconds, isOldDay } from "../utils.js";
import User, { TGoal, TUser } from "../models/user.js";
import {  Response } from "../routes.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import { queryDate, queryGoalDays } from "../functions/days.js";
import { ProtectedReq } from "../routes.js";
import { queryDayDate } from "./goals.js";
import AppError from "../utils/appError.js";
import Progress, { TProgress } from "../models/progress.js";
export const getLastSunday = (date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() - date.getDay());
  return date;
}
export const getLastMonday = (date: number | Date) =>{
  date = new Date(date);
  date.setHours(0,0,0,0);
  date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  console.log("last monday date", date.getTime())
  return date;
}
const getP = async (searchDate: Date, goal: TGoal) => {
            let progress = await Progress.find({date: {$gt: searchDate.getTime()}, goalId: goal._id}).sort({date: 1})
            return {
                ...goal,
                history: progress
            }
        }
const getProgresses = async(req: ProtectedReq, res) =>{
  
    let user: TUser;
    let timestamp: number;
    if(typeof req.query.timestamp == 'string' ) timestamp = parseInt(req.query.timestamp, 10);
    if(req.query.id) user = await User.findById(req.query.id);
    if(!user) user = req.user;
    if(user.id != req.user.id && user.profileType != "public" && !user.followers.includes(req.user.id.toString())){
      throw new AppError(1, 401, "This profile is private, you cannot get information");
    }
     console.log("getting days:", user)
    // console.log({timestamp}, req.query)
    const date = new Date(timestamp);
    date.setHours(0,0,0,0);
    
    //const days = await Day.find({userId: req.user.id, $or: [{date: {$gte: date.getTime()}}, {$and: [{"goal.frequency":{$eq: "weekly"} }, {date: {$gte: date.getTime() - week}}]}]});
    const promises = user.goals.map(goal => {
        let searchDate = goal.frequency  === "daily" ? date : getLastMonday(date);
        return getP(searchDate, goal);

    })
    const days = await Promise.all(promises);
    console.log("found days: ", days.length, {days, promises}, {goals: user.goals}, date, getLastMonday(date), date.getDay())

    return res.send(days)
}
const getStats = async(req: ProtectedReq, res: Response) =>{
    let {userId} = req.params;
     console.log(req.params)
    let user: TUser;
    if(userId) user = await User.findById(userId);
    if(!user ) {
      user = req.user
    }
  

    const promises = [];
    user.goals.map(goal =>{
        let promise = async() => {
          let days = await Progress.find({userId: user.id, goalId: goal._id}).sort({date: 1})
          return {...goal, days}
        }
        promises.push(promise());
    })
    const result = await Promise.all(promises);
    return res.send(result)
}
const postProgress = async(req: ProtectedReq, res: Response) =>{
     console.log(req.body)
    const {date, goalId, amount, notes} = req.body;
    const goal = req.user.goals.find(goal => goal._id.equals(goalId));
    const newProgress: TProgress = {
        date,
        userId: req.user._id,
        goalId: goal._id,
        goalAmount: goal.amount, 
        amount,
        notes,
        likesCount: 0,
        likes: []
    }
    const progress = await Progress.create(newProgress);
    res.send(progress);
   
}

const updateProgress = async(req: ProtectedReq, res: Response) =>{
     console.log(req.body)
    const {date, _id, amount, notes, } = req.body;
    const updatedProgress: TProgress = await Progress.findByIdAndUpdate(_id, {
        notes,
        amount,
        date
    },{new: true});
    console.log({updatedProgress});
    res.send(updatedProgress)
}
const deleteProgress = async(req: ProtectedReq, res: Response) =>{
    let {id} = req.query;
    const deletedProgress = await Progress.findByIdAndDelete(id);
     console.log({deletedProgress})
    res.send(deletedProgress)
}
export {
    getProgresses,
    postProgress,
    getStats,
    updateProgress,
    deleteProgress
}