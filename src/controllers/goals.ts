import { queryDate, queryWeek } from "../functions/days.js";
import Day from "../models/day.js";
import User, { TGoal, TUser } from "../models/user.js";
import { ObjectId } from "mongodb";
import { ProtectedReq } from "../routes.js";
import { Response } from "express";
import { eqOid } from "../utils.js";
import AppError from "../utils/appError.js";
import { getLastMonday } from "./days.js";

const postGoal = async(req, res) =>{
    let {goalForm, date} = req.body;
    //const goal = await Goal.create(goalForm);
    let objectId = new ObjectId();
    const goal: TGoal = {
        _id: objectId,
        ...goalForm
    }
    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: {goals: goal}
    })
    // let latestDay = await Day.findOne({userId: user.id}, null, {sort: {date: -1}})
    // if(!latestDay) {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }
    // else if(latestDay.date < date) {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }else {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }
    let day = await Day.create({goal: goal, date: date, userId: user.id});
    return res.send(day)
}
export const queryDayDate = (date: number | Date) =>{
    date = new Date(date);
    date.setHours(0,0,0,0);
    return queryDate(date.getTime());
}
export const queryWeekDate = (date: number | Date) =>{
    const lastMonday = getLastMonday(date);
    return queryWeek(lastMonday.getTime());
}
const putGoalAmount = async(req: ProtectedReq, res: Response) =>{
    const {amount, _id, date} = req.body;
    let goal = req.user.goals.find(goal => goal._id == _id);
    if(!goal) throw new AppError(1, 404, "goal not found");
    if(goal.frequency == 'daily')  await Day.findOneAndUpdate({$and: [{"goal._id": new ObjectId(_id)}, queryDayDate(date)]}, {"goal.amount": amount}, {new: true});
    else if(goal.frequency == "weekly") await Day.updateMany({$and: [{"goal._id": new ObjectId(_id)}, queryWeekDate(date)]}, {"goal.amount": amount}, {new: true})

    const promises = [];
    req.user.goals.map(goal =>{
        let promise = async() => {
         // let days = await Day.find({userId: req.user.id, "goal._id": new ObjectId(goal._id)}).sort({date: 1});
        let days = await Day.find({userId: req.user.id, "goal._id": new ObjectId(goal._id), history: {$exists: true, $type: 'array', $ne: []}}).sort({date: 1})
          return {...goal, days}
        }
        promises.push(promise());
    })
    const result = await Promise.all(promises);
    res.send(result)
}
    
const putGoal = async(req: ProtectedReq, res: Response) =>{
    
    const {title, amount, frequency, _id, date} = req.body;
    console.log(req.body, queryDate(date))
    let newGoal: TGoal;
    const newGoals = req.user.goals.map(goal =>{
        if(eqOid(goal._id, _id)){
            newGoal = {...goal, title, amount, frequency}
            return newGoal
        }
        return goal
    })
    console.log(newGoal);
    const newUser = await User.findByIdAndUpdate(req.user.id, {goals: newGoals}, {new: true});
    if(!newGoal) throw new AppError(1, 401, "invalid id");
    // Change Today with new Goal
    let day = await Day.findOneAndUpdate({$and: [{"goal._id": new ObjectId(newGoal._id)}, queryDayDate(date)]}, {goal: newGoal}, {new: true});
    console.log("day updated", day)
    if(!day) {
        console.log("creating new day put goal")
        day = await Day.create({goal: newGoal, date: date, userId: req.user.id })
    }
    res.send(day)

}
const completeGoal = async(req, res) =>{
    
}
interface IQuery {
    id: string
}

const deleteGoal = async(req: ProtectedReq<{},{},{}, IQuery>, res: Response) =>{
    const {id}= req.query;

    await Day.deleteMany({"goal._id": new ObjectId(id)});
    let newGoals = req.user.goals.filter(goal => !eqOid(goal._id, id));

    let user = await User.findByIdAndUpdate(req.user.id, {goals: newGoals}, {new: true})
    res.send(user)
}
let controller = {
    postGoal,
    putGoal,
    putGoalAmount,
    deleteGoal
}
export {
    postGoal,
    putGoal,
    putGoalAmount,
    deleteGoal
}
export default controller