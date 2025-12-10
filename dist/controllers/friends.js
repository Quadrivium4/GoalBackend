function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
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
import { ObjectId } from "mongodb";
import Day from "../models/day.js";
import User from "../models/user.js";
import AppError from "../utils/appError.js";
import { addNotification, removeRequestAndNotification } from "../functions/friends.js";
import { dayInMilliseconds } from "../utils.js";
import { getLastMonday } from "./days.js";
var week = 7 * dayInMilliseconds;
var aggregateFriendDays = function(userId, date, skip, limit) {
    return [
        {
            $match: {
                _id: new ObjectId(userId)
            }
        },
        {
            $unwind: "$following"
        },
        {
            $lookup: {
                from: "days",
                localField: "following",
                foreignField: "userId",
                as: "goals",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                {
                                    date: {
                                        $gte: date
                                    }
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
                        $group: {
                            "_id": "$goal._id",
                            "title": {
                                $first: "$goal.title"
                            },
                            "type": {
                                $first: "$goal.type"
                            },
                            "amount": {
                                $first: "$goal.amount"
                            },
                            "date": {
                                $first: "$date"
                            },
                            "history": {
                                $push: "$$ROOT"
                            },
                            "userId": {
                                $first: "$userId"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: {
                    $toObjectId: "$following"
                },
                goals: 1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                name: "$user.name",
                goals: 1,
                profileImg: "$user.profileImg",
                goalsInfo: "$user.goals"
            }
        }
    ];
};
var aggregateDayFriends = [
    {
        $addFields: {
            userObjectId: {
                $toObjectId: "$userId"
            }
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "userObjectId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    }
];
var getLazyFriends = function(req, res) {
    return _async_to_generator(function() {
        var offset, _req_query, index, timestamp, date, response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    offset = 20;
                    _req_query = req.query, index = _req_query.index, timestamp = _req_query.timestamp;
                    date = new Date(parseInt(timestamp, 10));
                    date.setHours(0, 0, 0, 0);
                    console.log({
                        offset: offset,
                        index: index,
                        date: date
                    });
                    return [
                        4,
                        User.aggregate(aggregateFriendDays(req.user.id, date.getTime(), index * offset, offset))
                    ];
                case 1:
                    response = _state.sent();
                    console.log("hey", response);
                    res.send(response);
                    return [
                        2
                    ];
            }
        });
    })();
};
var getFriends = function(req, res) {
    return _async_to_generator(function() {
        var id, friend, promises, _ref, followers, incomingFriendRequests, outgoingFriendRequests, friendDays;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    if (!id) return [
                        3,
                        2
                    ];
                    console.log("getting friend", {
                        id: id
                    });
                    return [
                        4,
                        User.findById(id)
                    ];
                case 1:
                    friend = _state.sent();
                    return [
                        2,
                        res.send({
                            id: friend.id,
                            name: friend.name,
                            profileImg: friend.profileImg,
                            goals: friend.goals
                        })
                    ];
                case 2:
                    console.log("getFriends...");
                    promises = [
                        User.find({
                            _id: {
                                $in: req.user.followers
                            }
                        }),
                        User.find({
                            _id: {
                                $in: req.user.incomingFriendRequests
                            }
                        }),
                        User.find({
                            _id: {
                                $in: req.user.outgoingFriendRequests
                            }
                        }),
                        Day.find({
                            userId: {
                                $in: req.user.following
                            }
                        }).sort({
                            date: -1
                        }).limit(20)
                    ];
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 3:
                    _ref = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        4
                    ]), followers = _ref[0], incomingFriendRequests = _ref[1], outgoingFriendRequests = _ref[2], friendDays = _ref[3];
                    //console.log({friends, incomingFriendRequests, outgoingFriendRequests, friendDays})
                    return [
                        2,
                        res.send({
                            followers: followers,
                            incomingFriendRequests: incomingFriendRequests,
                            outgoingFriendRequests: outgoingFriendRequests,
                            friendDays: friendDays
                        })
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
};
var sendFriendRequest = function(req, res) {
    return _async_to_generator(function() {
        var id, friend, result, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    return [
                        4,
                        User.findById(id)
                    ];
                case 1:
                    friend = _state.sent();
                    if (friend.followers.find(function(id) {
                        return id == req.user.id;
                    })) throw new AppError(1, 400, "You are already following ".concat(friend.name, " "));
                    if (friend.incomingFriendRequests.includes(req.user.id)) throw new AppError(1, 400, "You already sent a friend request to ".concat(friend.name));
                    return [
                        4,
                        addNotification(friend.id, {
                            date: Date.now(),
                            content: "new follower request",
                            from: {
                                userId: req.user.id,
                                name: req.user.name
                            },
                            type: "incoming request",
                            status: "unread"
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        User.findByIdAndUpdate(id, {
                            $push: {
                                incomingFriendRequests: req.user.id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 3:
                    result = _state.sent();
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            $push: {
                                outgoingFriendRequests: id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 4:
                    user = _state.sent();
                    console.log("send friend request", {
                        user: user,
                        friend: friend
                    });
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
var acceptedFriendNotification = function(name, id) {
    return {
        type: "accepted request",
        date: Date.now(),
        _id: new ObjectId().toHexString(),
        content: "you are now following...",
        from: {
            userId: id,
            name: name
        },
        status: "unread"
    };
};
var newFollowerNotification = function(name, id) {
    return {
        type: "new follower",
        date: Date.now(),
        _id: new ObjectId().toHexString(),
        content: "".concat(name, " is now following you!"),
        from: {
            userId: id,
            name: name
        },
        status: "unread"
    };
};
var acceptFriendRequest = function(req, res) {
    return _async_to_generator(function() {
        var id, friend, newUserNotifications, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    if (!req.user.incomingFriendRequests.includes(id)) throw new AppError(1, 400, "This person didn't send you any following request!");
                    return [
                        4,
                        User.findByIdAndUpdate(id, {
                            $push: {
                                following: req.user.id,
                                notifications: acceptedFriendNotification(req.user.name, req.user.id)
                            },
                            $pull: {
                                outgoingFriendRequests: req.user.id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    friend = _state.sent();
                    console.log(friend._id.toString());
                    newUserNotifications = req.user.notifications.filter(function(not) {
                        return !(not.type == "incoming request" && not.from.userId == friend.id.toString());
                    });
                    newUserNotifications.push(newFollowerNotification(friend.name, friend.id.toString()));
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            $push: {
                                followers: friend.id
                            },
                            $pull: {
                                incomingFriendRequests: id
                            },
                            $set: {
                                notifications: newUserNotifications
                            }
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
var ignoreFriendRequest = function(req, res) {
    return _async_to_generator(function() {
        var id, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    console.log("ignoring friend request", {
                        id: id
                    });
                    return [
                        4,
                        removeRequestAndNotification(id, req.user.id)
                    ];
                case 1:
                    user = _state.sent();
                    // console.log("cancel friend request", {
                    //     user,
                    // })
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
var cancelFriendRequest = function(req, res) {
    return _async_to_generator(function() {
        var id, friend, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    console.log("canceling friend request", {
                        id: id
                    });
                    return [
                        4,
                        User.findById(id)
                    ];
                case 1:
                    friend = _state.sent();
                    return [
                        4,
                        removeRequestAndNotification(req.user.id, id)
                    ];
                case 2:
                    user = _state.sent();
                    // console.log("cancel friend request", {
                    //     user, friend
                    // })
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
var deleteFollower = function(req, res) {
    return _async_to_generator(function() {
        var id, friend, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    return [
                        4,
                        User.findByIdAndUpdate(id, {
                            $pull: {
                                following: req.user.id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    friend = _state.sent();
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            $pull: {
                                followers: id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    console.log("follower deleted", {
                        user: user,
                        friend: friend
                    });
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
var unfollow = function(req, res) {
    return _async_to_generator(function() {
        var id, friend, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    return [
                        4,
                        User.findByIdAndUpdate(id, {
                            $pull: {
                                followers: req.user.id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    friend = _state.sent();
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            $pull: {
                                following: id
                            }
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    console.log("unfollowed", {
                        user: user,
                        friend: friend
                    });
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
export { getFriends, getLazyFriends, acceptFriendRequest, sendFriendRequest, cancelFriendRequest, ignoreFriendRequest, deleteFollower, unfollow };
