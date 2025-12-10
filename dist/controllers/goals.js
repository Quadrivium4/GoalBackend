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
import { queryDate, queryWeek } from "../functions/days.js";
import Day from "../models/day.js";
import User from "../models/user.js";
import { ObjectId } from "mongodb";
import { eqOid } from "../utils.js";
import AppError from "../utils/appError.js";
import { getLastMonday } from "./days.js";
var postGoal = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, goalForm, date, objectId, goal, user, day;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, goalForm = _req_body.goalForm, date = _req_body.date;
                    //const goal = await Goal.create(goalForm);
                    objectId = new ObjectId();
                    goal = _object_spread({
                        _id: objectId
                    }, goalForm);
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            $push: {
                                goals: goal
                            }
                        })
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        4,
                        Day.create({
                            goal: goal,
                            date: date,
                            userId: user.id
                        })
                    ];
                case 2:
                    day = _state.sent();
                    return [
                        2,
                        res.send(day)
                    ];
            }
        });
    })();
};
export var queryDayDate = function(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    return queryDate(date.getTime());
};
export var queryWeekDate = function(date) {
    var lastMonday = getLastMonday(date);
    return queryWeek(lastMonday.getTime());
};
var putGoalAmount = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, amount, _id, date, goal, promises, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, amount = _req_body.amount, _id = _req_body._id, date = _req_body.date;
                    goal = req.user.goals.find(function(goal) {
                        return goal._id == _id;
                    });
                    if (!goal) throw new AppError(1, 404, "goal not found");
                    if (!(goal.frequency == 'daily')) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        Day.findOneAndUpdate({
                            $and: [
                                {
                                    "goal._id": new ObjectId(_id)
                                },
                                queryDayDate(date)
                            ]
                        }, {
                            "goal.amount": amount
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 2:
                    if (!(goal.frequency == "weekly")) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        Day.updateMany({
                            $and: [
                                {
                                    "goal._id": new ObjectId(_id)
                                },
                                queryWeekDate(date)
                            ]
                        }, {
                            "goal.amount": amount
                        }, {
                            new: true
                        })
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    promises = [];
                    req.user.goals.map(function(goal) {
                        var promise = function() {
                            return _async_to_generator(function() {
                                var days;
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Day.find({
                                                    userId: req.user.id,
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
                case 5:
                    result = _state.sent();
                    res.send(result);
                    return [
                        2
                    ];
            }
        });
    })();
};
var putGoal = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, title, amount, frequency, _id, date, newGoal, newGoals, newUser, day;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, title = _req_body.title, amount = _req_body.amount, frequency = _req_body.frequency, _id = _req_body._id, date = _req_body.date;
                    console.log(req.body, queryDate(date));
                    newGoals = req.user.goals.map(function(goal) {
                        if (eqOid(goal._id, _id)) {
                            newGoal = _object_spread_props(_object_spread({}, goal), {
                                title: title,
                                amount: amount,
                                frequency: frequency
                            });
                            return newGoal;
                        }
                        return goal;
                    });
                    console.log(newGoal);
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            goals: newGoals
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    newUser = _state.sent();
                    if (!newGoal) throw new AppError(1, 401, "invalid id");
                    return [
                        4,
                        Day.findOneAndUpdate({
                            $and: [
                                {
                                    "goal._id": new ObjectId(newGoal._id)
                                },
                                queryDayDate(date)
                            ]
                        }, {
                            goal: newGoal
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    day = _state.sent();
                    console.log("day updated", day);
                    if (!!day) return [
                        3,
                        4
                    ];
                    console.log("creating new day put goal");
                    return [
                        4,
                        Day.create({
                            goal: newGoal,
                            date: date,
                            userId: req.user.id
                        })
                    ];
                case 3:
                    day = _state.sent();
                    _state.label = 4;
                case 4:
                    res.send(day);
                    return [
                        2
                    ];
            }
        });
    })();
};
var completeGoal = function(req, res) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    })();
};
var deleteGoal = function(req, res) {
    return _async_to_generator(function() {
        var id, newGoals, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.query.id;
                    return [
                        4,
                        Day.deleteMany({
                            "goal._id": new ObjectId(id)
                        })
                    ];
                case 1:
                    _state.sent();
                    newGoals = req.user.goals.filter(function(goal) {
                        return !eqOid(goal._id, id);
                    });
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            goals: newGoals
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
var controller = {
    postGoal: postGoal,
    putGoal: putGoal,
    putGoalAmount: putGoalAmount,
    deleteGoal: deleteGoal
};
export { postGoal, putGoal, putGoalAmount, deleteGoal };
export default controller;
