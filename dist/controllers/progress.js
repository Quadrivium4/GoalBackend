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
import User from "../models/user.js";
import AppError from "../utils/appError.js";
import Progress from "../models/progress.js";
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
var getP = function(searchDate, goal) {
    return _async_to_generator(function() {
        var progress;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Progress.find({
                            date: {
                                $gt: searchDate.getTime()
                            },
                            goalId: goal._id.toString()
                        }).sort({
                            date: 1
                        })
                    ];
                case 1:
                    progress = _state.sent();
                    return [
                        2,
                        _object_spread_props(_object_spread({}, goal), {
                            history: progress
                        })
                    ];
            }
        });
    })();
};
var getProgresses = function(req, res) {
    return _async_to_generator(function() {
        var user, timestamp, date, promises, days;
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
                    if (user.id != req.user.id && user.profileType != "public" && !user.followers.includes(req.user.id.toString())) {
                        throw new AppError(1, 401, "This profile is private, you cannot get information");
                    }
                    console.log("getting days:", user);
                    // console.log({timestamp}, req.query)
                    date = new Date(timestamp);
                    date.setHours(0, 0, 0, 0);
                    //const days = await Day.find({userId: req.user.id, $or: [{date: {$gte: date.getTime()}}, {$and: [{"goal.frequency":{$eq: "weekly"} }, {date: {$gte: date.getTime() - week}}]}]});
                    promises = user.goals.map(function(goal) {
                        var searchDate = goal.frequency === "daily" ? date : getLastMonday(date);
                        return getP(searchDate, goal);
                        return function() {
                            return _async_to_generator(function() {
                                var progress;
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Progress.find({
                                                    date: {
                                                        $gt: searchDate.getTime()
                                                    },
                                                    goalId: goal._id.toString()
                                                })
                                            ];
                                        case 1:
                                            progress = _state.sent();
                                            return [
                                                2,
                                                _object_spread_props(_object_spread({}, goal), {
                                                    history: progress
                                                })
                                            ];
                                    }
                                });
                            })();
                        };
                    });
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 3:
                    days = _state.sent();
                    console.log("found days: ", days.length, {
                        days: days,
                        promises: promises
                    }, {
                        goals: user.goals
                    }, date, getLastMonday(date), date.getDay());
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
                    _state.label = 2;
                case 2:
                    if (!user) {
                        user = req.user;
                    }
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
                                                Progress.find({
                                                    userId: user.id,
                                                    goalId: goal._id.toString()
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
                case 3:
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
        var _req_body, date, goalId, amount, notes, goal, newProgress, progress;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, date = _req_body.date, goalId = _req_body.goalId, amount = _req_body.amount, notes = _req_body.notes;
                    goal = req.user.goals.find(function(goal) {
                        return goal._id.toString() === goalId;
                    });
                    newProgress = {
                        date: date,
                        userId: req.user.id,
                        goalId: goalId,
                        goalAmount: goal.amount,
                        amount: amount,
                        notes: notes,
                        likesCount: 0,
                        likes: []
                    };
                    return [
                        4,
                        Progress.create(newProgress)
                    ];
                case 1:
                    progress = _state.sent();
                    res.send(progress);
                    return [
                        2
                    ];
            }
        });
    })();
};
var updateProgress = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, date, _id, amount, notes, updatedProgress;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, date = _req_body.date, _id = _req_body._id, amount = _req_body.amount, notes = _req_body.notes;
                    return [
                        4,
                        Progress.findByIdAndUpdate(_id, {
                            notes: notes,
                            amount: amount,
                            date: date
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    updatedProgress = _state.sent();
                    console.log({
                        updatedProgress: updatedProgress
                    });
                    res.send(updatedProgress);
                    return [
                        2
                    ];
            }
        });
    })();
};
var deleteProgress = function(req, res) {
    return _async_to_generator(function() {
        var id, deletedProgress;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.query.id;
                    return [
                        4,
                        Progress.findByIdAndDelete(id)
                    ];
                case 1:
                    deletedProgress = _state.sent();
                    console.log({
                        deletedProgress: deletedProgress
                    });
                    res.send(deletedProgress);
                    return [
                        2
                    ];
            }
        });
    })();
};
export { getProgresses, postProgress, getStats, updateProgress, deleteProgress };
