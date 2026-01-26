import { getLastMonday } from "../controllers/progress.js";
import Day from "../models/day.js";
var queryGoalDays = function(goal, userId) {
    var fromDate = goal.frequency == "daily" ? new Date() : getLastMonday(new Date());
    var query = goal.frequency == "daily" ? queryDate(fromDate.getTime()) : queryWeek(fromDate.getTime());
    var days = Day.find({
        userId: userId,
        query: query
    });
    return days;
};
var queryDate = function(date) {
    var date1 = new Date(date);
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 1);
    return {
        $and: [
            {
                date: {
                    $gte: date1.getTime()
                }
            },
            {
                date: {
                    $lt: date2.getTime()
                }
            }
        ]
    };
};
var queryWeek = function(date) {
    var date1 = new Date(date);
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 7);
    return {
        $and: [
            {
                date: {
                    $gte: date1.getTime()
                }
            },
            {
                date: {
                    $lt: date2.getTime()
                }
            }
        ]
    };
};
export { queryDate, queryWeek, queryGoalDays };
