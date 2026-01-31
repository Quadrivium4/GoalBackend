import { isValidObjectId } from "mongoose";
import { TGoal } from "../models/user.js";

const isValidGoalAmount = (amount: number, type: TGoal["type"], frequency: TGoal["frequency"]) =>{
    if(type == "time"){
        if(
            (frequency == "daily" && amount > 60 * 24) ||
            (frequency == "weekly" && amount > 60 * 24 * 7)
     ){
            return false
        }
    }else if(type == "distance"){
        if(amount > 1000000 * 1000){
            return false
        }
    }else if(type == "number"){
        if(amount > 1000000 * 1000){
            return false
        }
    }
    
    return true;
}
const isValidGoal = (goal: TGoal) =>{
    if(!isValidObjectId(goal._id)) return false;
    if(!goal.title.trim() || goal.title.length > 50) return false;
    if(!isValidGoalAmount(goal.amount, goal.type, goal.frequency)) return false;
    return true
}

export {
    isValidGoalAmount,
    isValidGoal

}