import { getLastMonday } from "../controllers/days.js";
import Day from "../models/day.js";
import { TGoal } from "../models/user.js";

const queryGoalDays = (goal: TGoal, userId: string) =>{
  let fromDate = goal.frequency == "daily" ? new Date() : getLastMonday(new Date());
  let query = goal.frequency == "daily" ? queryDate(fromDate.getTime()) : queryWeek(fromDate.getTime())
  const days = Day.find({userId: userId, query});
  return days;
}
const queryDate = (date:number) =>{
  let date1 = new Date(date);
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() + 1);
  return {
    $and: [{date: {$gte: date1.getTime()}}, {date: {$lt: date2.getTime()}}]
  }
}
const queryWeek =  (date:number) =>{
  let date1 = new Date(date);
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() + 7);
  return {
    $and: [{date: {$gte: date1.getTime()}}, {date: {$lt: date2.getTime()}}]
  }
}
export  {
    queryDate,
    queryWeek,
    queryGoalDays
}