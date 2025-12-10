function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import Day from "../models/day.js";
import User from "../models/user.js";
import { ObjectId } from "mongodb";
import { queryDate } from "../functions/days.js";
import { queryDayDate } from "./goals.js";
export var getLastSunday = function(date) {
    date = new Date(date);
    date.setDate(date.getDate() - date.getDay());
    return date;
};
export var getLastMonday = function(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (date.getDay() + 6) % 7);
    return date;
};
export var aggregateDays = function(date, userId) {
    return [
        {
            $match: /**
       * query: The query in MQL.
       */ {
                userId: userId.toString(),
                history: {
                    $exists: true,
                    $type: 'array',
                    $ne: []
                },
                $or: [
                    {
                        $and: [
                            {
                                "goal.frequency": {
                                    $eq: "daily"
                                }
                            },
                            {
                                date: {
                                    $gte: date
                                }
                            }
                        ]
                    },
                    {
                        $and: [
                            {
                                "goal.frequency": {
                                    $eq: "weekly"
                                }
                            },
                            {
                                date: {
                                    $gte: getLastMonday(date).getTime()
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            $sort: {
                "date": -1
            }
        },
        {
            $group: /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */ {
                _id: "$goal._id",
                title: {
                    $last: "$goal.title"
                },
                amount: {
                    $last: "$goal.amount"
                },
                frequency: {
                    $last: "$goal.frequency"
                },
                type: {
                    $last: "$goal.type"
                },
                history: {
                    $push: {
                        _id: "$_id",
                        history: "$history",
                        date: "$date",
                        goal: "$goal"
                    }
                }
            }
        }
    ];
};
var getDays = function(req, res) {
    return _async_to_generator(function() {
        var user, timestamp, date, days;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (typeof req.query.timestamp == 'string') timestamp = parseInt(req.query.timestamp, 10);
                    if (!req.query.id) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        User.findById(req.query.id)
                    ];
                case 1:
                    user = _state.sent();
                    _state.label = 2;
                case 2:
                    if (!user) user = req.user;
                    //console.log({timestamp}, req.query)
                    date = new Date(timestamp);
                    date.setHours(0, 0, 0, 0);
                    return [
                        4,
                        Day.aggregate(aggregateDays(date.getTime(), user.id))
                    ];
                case 3:
                    days = _state.sent();
                    console.log("found days: ", days.length, {
                        days: days
                    }, {
                        goals: user.goals
                    }, date, getLastMonday(date), date.getDay());
                    if (days.length < user.goals.length) {
                        user.goals.map(function(goal) {
                            var alreadyExists = days.find(function(day) {
                                return day._id.toString() === goal._id.toString();
                            });
                            if (!alreadyExists) days.push(_object_spread_props(_object_spread({}, goal), {
                                history: []
                            }));
                        });
                    }
                    return [
                        2,
                        res.send(days)
                    ];
            }
        });
    })();
};
var getStats = function(req, res) {
    return _async_to_generator(function() {
        var userId, user, promises, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    userId = req.params.userId;
                    console.log(req.params);
                    if (!userId) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        User.findById(userId)
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        3,
                        3
                    ];
                case 2:
                    user = req.user;
                    _state.label = 3;
                case 3:
                    promises = [];
                    user.goals.map(function(goal) {
                        var promise = function() {
                            return _async_to_generator(function() {
                                var days;
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Day.find({
                                                    userId: user.id,
                                                    "goal._id": new ObjectId(goal._id),
                                                    history: {
                                                        $exists: true,
                                                        $type: 'array',
                                                        $ne: []
                                                    }
                                                }).sort({
                                                    date: 1
                                                })
                                            ];
                                        case 1:
                                            days = _state.sent();
                                            return [
                                                2,
                                                _object_spread_props(_object_spread({}, goal), {
                                                    days: days
                                                })
                                            ];
                                    }
                                });
                            })();
                        };
                        promises.push(promise());
                    });
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 4:
                    result = _state.sent();
                    return [
                        2,
                        res.send(result)
                    ];
            }
        });
    })();
};
var postProgress = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, date, goalId, progress, notes, progressDate, day, historyEvent, goal, totalProgress, historyEvent1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, date = _req_body.date, goalId = _req_body.goalId, progress = _req_body.progress, notes = _req_body.notes;
                    progressDate = new Date(date);
                    progressDate.setHours(0, 0, 0, 0);
                    return [
                        4,
                        Day.findOne({
                            $and: [
                                {
                                    "goal._id": new ObjectId(goalId)
                                },
                                queryDayDate(progressDate.getTime())
                            ]
                        })
                    ];
                case 1:
                    day = _state.sent();
                    if (!!day) return [
                        3,
                        3
                    ];
                    console.log("old day post progress");
                    historyEvent = {
                        date: date,
                        progress: progress,
                        notes: notes,
                        likes: []
                    };
                    goal = req.user.goals.find(function(goal) {
                        return goalId === goal._id.toString();
                    });
                    console.log({
                        goal: goal
                    });
                    return [
                        4,
                        Day.create({
                            goal: goal,
                            date: date,
                            progress: progress,
                            userId: req.user._id,
                            history: [
                                historyEvent
                            ]
                        })
                    ];
                case 2:
                    day = _state.sent();
                    return [
                        2,
                        res.send(day)
                    ];
                case 3:
                    totalProgress = day.progress + progress;
                    historyEvent1 = {
                        date: date,
                        progress: progress,
                        notes: notes,
                        likes: []
                    };
                    return [
                        4,
                        Day.findByIdAndUpdate(day.id, {
                            progress: totalProgress,
                            $push: {
                                history: historyEvent1
                            }
                        }, {
                            new: true
                        })
                    ];
                case 4:
                    day = _state.sent();
                    console.log({
                        day: day,
                        totalProgress: totalProgress
                    });
                    return [
                        2,
                        res.send(day)
                    ];
            }
        });
    })();
};
var getLastDayGoal = function(date, goalId) {
    return _async_to_generator(function() {
        var lastDay;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Day.findOne({
                            $and: [
                                {
                                    date: {
                                        $lte: date
                                    }
                                },
                                {
                                    "goal._id": new ObjectId(goalId)
                                }
                            ]
                        }, {}, {
                            $sort: {
                                date: -1
                            }
                        })
                    ];
                case 1:
                    lastDay = _state.sent();
                    console.log("last day", lastDay);
                    return [
                        2,
                        lastDay.goal
                    ];
            }
        });
    })();
};
var updateProgress = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, date, id, progress, notes, newDate, oldDay, newDateObj, dateObj, day, historyEvent, goal;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, date = _req_body.date, id = _req_body.id, progress = _req_body.progress, notes = _req_body.notes, newDate = _req_body.newDate;
                    return [
                        4,
                        Day.findById(id)
                    ];
                case 1:
                    oldDay = _state.sent();
                    newDateObj = new Date(newDate);
                    dateObj = new Date(oldDay.date);
                    dateObj.setHours(0, 0, 0, 0);
                    newDateObj.setHours(0, 0, 0, 0);
                    if (!(newDateObj.getTime() == dateObj.getTime())) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        Day.findOneAndUpdate({
                            _id: new ObjectId(id),
                            "history.date": date
                        }, {
                            $set: {
                                "history.$.progress": progress,
                                "history.$.notes": notes,
                                "history.$.date": newDate
                            }
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    day = _state.sent();
                    return [
                        3,
                        8
                    ];
                case 3:
                    historyEvent = {
                        date: newDate,
                        progress: progress,
                        notes: notes,
                        likes: []
                    };
                    // Remove old progress from day
                    return [
                        4,
                        Day.findOneAndUpdate({
                            _id: new ObjectId(id),
                            "history.date": date
                        }, {
                            $pull: {
                                history: {
                                    date: date
                                }
                            }
                        }, {
                            new: true
                        })
                    ];
                case 4:
                    _state.sent();
                    // Add progress to the new day if exists
                    console.log(queryDate(newDateObj.getTime()), oldDay.goal);
                    return [
                        4,
                        Day.findOneAndUpdate({
                            $and: [
                                queryDayDate(newDateObj.getTime()),
                                {
                                    userId: req.user.id,
                                    "goal._id": new ObjectId(oldDay.goal._id)
                                }
                            ]
                        }, {
                            $push: {
                                history: historyEvent
                            }
                        }, {
                            new: true
                        })
                    ];
                case 5:
                    day = _state.sent();
                    console.log("updated day", day);
                    return [
                        4,
                        getLastDayGoal(date, oldDay.goal._id)
                    ];
                case 6:
                    goal = _state.sent();
                    if (!!day) return [
                        3,
                        8
                    ];
                    console.log("update progress creating new day");
                    return [
                        4,
                        Day.create({
                            goal: goal,
                            date: newDateObj.getTime(),
                            progress: 0,
                            userId: req.user.id,
                            history: [
                                historyEvent
                            ]
                        })
                    ];
                case 7:
                    day = _state.sent();
                    _state.label = 8;
                case 8:
                    console.log(day);
                    res.send(day);
                    return [
                        2
                    ];
            }
        });
    })();
};
var deleteProgress = function(req, res) {
    return _async_to_generator(function() {
        var _req_query, date, id, dateNumber, day;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.query);
                    _req_query = req.query, date = _req_query.date, id = _req_query.id;
                    dateNumber = parseInt(date, 10);
                    return [
                        4,
                        Day.findOneAndUpdate({
                            _id: new ObjectId(id)
                        }, {
                            $pull: {
                                history: {
                                    date: dateNumber
                                }
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    day = _state.sent();
                    console.log(day);
                    res.send(day);
                    return [
                        2
                    ];
            }
        });
    })();
};
export { getDays, postProgress, getStats, updateProgress, deleteProgress };
