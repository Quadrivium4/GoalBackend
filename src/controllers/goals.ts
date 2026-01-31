import { queryDate, queryWeek } from "../functions/days.js";
import Day from "../models/day.js";
import User, { TGoal, TUser } from "../models/user.js";
import { ObjectId } from "mongodb";
import { ProtectedReq } from "../routes.js";
import { Response } from "express";
import { eqOid } from "../utils.js";
import AppError from "../utils/appError.js";
import { getLastMonday } from "./days.js";
import Progress from "../models/progress.js";
import { isValidObjectId } from "mongoose";
import { isValidGoal, isValidGoalAmount } from "../functions/goal.js";


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

    return res.send(goal)
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
    
    const {title, amount, frequency, _id, date, type} = req.body;
     if(!isValidObjectId(_id)) throw new AppError(1, 401, "Invalid goal id");
     if(title.length > 50) throw new AppError(1, 401, "Goal title too long");
     if(!isValidGoal({title, amount, frequency, _id,  type})) throw new AppError(1, 401, "Invalid goal fields");
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
     if(!newGoal) throw new AppError(1, 401, "invalid id");
     let query = newGoal.frequency == "daily" ? queryDayDate(date) : queryWeekDate(date);
    const userPromise = User.findByIdAndUpdate(req.user.id, {goals: newGoals}, {new: true});
    const progressUpdatePromise = Progress.updateMany({$and: [{"goalId": newGoal._id}, query]}, {goalAmount: newGoal.amount}, {new: true});
    
    let result = await Promise.all([userPromise, progressUpdatePromise])
    let progresses = await Progress.find({$and: [{"goalId": newGoal._id}, query]}).sort({date: -1});
    console.log(result, {progresses})
    res.send({goal: newGoal, progresses})

}
const completeGoal = async(req, res) =>{
    
}
interface IQuery {
    id: string
}

const deleteGoal = async(req: ProtectedReq<{},{},{}, IQuery>, res: Response) =>{
    const {id}= req.query;
    if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid goal id");
    await Progress.deleteMany({"goalId": new ObjectId(id)});
    let newGoals = req.user.goals.filter(goal => !goal._id.equals(id));

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