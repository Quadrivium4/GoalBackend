import { isValidObjectId } from "mongoose";
var isValidGoalAmount = function(amount, type, frequency) {
    if (type == "time") {
        if (frequency == "daily" && amount > 60 * 24 || frequency == "weekly" && amount > 60 * 24 * 7) {
            return false;
        }
    } else if (type == "distance") {
        if (amount > 1000000 * 1000) {
            return false;
        }
    } else if (type == "number") {
        if (amount > 1000000 * 1000) {
            return false;
        }
    }
    return true;
};
var isValidGoal = function(goal) {
    if (!isValidObjectId(goal._id)) return false;
    if (!goal.title.trim() || goal.title.length > 50) return false;
    if (!isValidGoalAmount(goal.amount, goal.type, goal.frequency)) return false;
    return true;
};
export { isValidGoalAmount, isValidGoal };
