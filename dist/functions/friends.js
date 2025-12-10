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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import { ObjectId } from "mongodb";
var getUserFriends = function(user) {
    return _async_to_generator(function() {
        var friends;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        User.find({
                            id: {
                                $in: user.friends
                            }
                        })
                    ];
                case 1:
                    friends = _state.sent();
                    return [
                        2,
                        friends
                    ];
            }
        });
    })();
};
var createNotification = function(part) {
    return _object_spread_props(_object_spread({}, part), {
        _id: new ObjectId().toHexString()
    });
};
var addNotification = function(userId, part) {
    return _async_to_generator(function() {
        var notification, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    notification = _object_spread_props(_object_spread({}, part), {
                        _id: new ObjectId().toHexString()
                    });
                    return [
                        4,
                        User.findByIdAndUpdate(userId, {
                            $push: {
                                notifications: notification
                            }
                        })
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        2,
                        user
                    ];
            }
        });
    })();
};
var deleteRequestsNotification = function(notifications, requestUserId) {
    var newNotifications = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = notifications[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var notification = _step.value;
            if (!(notification.type == "incoming request" && notification.from.userId == requestUserId)) {
                newNotifications.push(notification);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return newNotifications;
};
var removeRequestAndNotification = function(requestingId, receivingId) {
    return _async_to_generator(function() {
        var friend, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log({
                        requestingId: requestingId,
                        receivingId: receivingId
                    });
                    return [
                        4,
                        User.findByIdAndUpdate(requestingId, {
                            $pull: {
                                outgoingFriendRequests: receivingId
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    friend = _state.sent();
                    console.log(typeof requestingId === "undefined" ? "undefined" : _type_of(requestingId));
                    return [
                        4,
                        User.findByIdAndUpdate(receivingId, {
                            $pull: {
                                incomingFriendRequests: requestingId,
                                notifications: {
                                    type: "incoming request",
                                    "from.userId": requestingId.toString()
                                }
                            }
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    console.log("not length", user.notifications.length);
                    return [
                        2,
                        user
                    ];
            }
        });
    })();
};
var deleteOldNotifications = function(userId, date) {
    return _async_to_generator(function() {
        var user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    //console.log("deleting old notifications");
                    date = new Date(date);
                    date.setHours(0, 0, 0, 0);
                    // const user = await User.find({"notifications.date": {$lte: date.getTime()}});
                    // console.log(user, date.getTime())
                    console.log(date.getTime(), "deleting notifications");
                    return [
                        4,
                        User.findByIdAndUpdate(userId, {
                            $pull: {
                                notifications: {
                                    date: {
                                        $lte: date.getTime()
                                    },
                                    status: "read",
                                    type: {
                                        $nin: [
                                            "incoming request",
                                            "outgoing request"
                                        ]
                                    }
                                }
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        2,
                        user
                    ];
            }
        });
    })();
};
export { getUserFriends, addNotification, deleteOldNotifications, deleteRequestsNotification, removeRequestAndNotification, createNotification };
