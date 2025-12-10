function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
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
import dotenv from "dotenv";
dotenv.config();
import AppError from "../utils/appError.js";
import crypto from "crypto";
import { validateEmail, hashPassword, comparePassword, createTokens } from "../utils.js";
import User from "../models/user.js";
import UnverifiedUser from "../models/unverifiedUser.js";
import { isValidObjectId } from "mongoose";
import Day from "../models/day.js";
import { ObjectId } from "mongodb";
var createOrLoginUserFromGoogle = function(accessToken) {
    return _async_to_generator(function() {
        var googleUser, user, aToken;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("https://www.googleapis.com/userinfo/v2/me", {
                            headers: {
                                Authorization: "Bearer ".concat(accessToken)
                            }
                        }).then(function(res) {
                            return res.json();
                        })
                    ];
                case 1:
                    googleUser = _state.sent();
                    if (googleUser.error) throw new AppError(1, 401, googleUser.error.message);
                    console.log({
                        googleUser: googleUser
                    });
                    return [
                        4,
                        User.findOne({
                            email: googleUser.email
                        })
                    ];
                case 2:
                    user = _state.sent();
                    if (!!user) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        User.create({
                            name: googleUser.given_name,
                            email: googleUser.email
                        })
                    ];
                case 3:
                    user = _state.sent();
                    _state.label = 4;
                case 4:
                    aToken = createTokens(user.id, user.email).aToken;
                    return [
                        4,
                        User.findByIdAndUpdate(user.id, {
                            tokens: _to_consumable_array(user.tokens).concat([
                                aToken
                            ])
                        }, {
                            new: true
                        })
                    ];
                case 5:
                    user = _state.sent();
                    console.log({
                        user: user,
                        aToken: aToken
                    });
                    return [
                        2,
                        {
                            user: user,
                            aToken: aToken
                        }
                    ];
            }
        });
    })();
};
var createUser = function(name, email, password) {
    var googleLogin = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    return _async_to_generator(function() {
        var user, aToken;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        User.create({
                            name: name,
                            email: email,
                            password: password,
                            googleLogin: googleLogin,
                            goals: []
                        })
                    ];
                case 1:
                    user = _state.sent();
                    aToken = createTokens(user.id, email).aToken;
                    return [
                        4,
                        User.findByIdAndUpdate(user.id, {
                            tokens: _to_consumable_array(user.tokens).concat([
                                aToken
                            ])
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    return [
                        2,
                        {
                            user: user,
                            aToken: aToken
                        }
                    ];
            }
        });
    })();
};
var createResetPasswordUser = function(name, email, password) {
    return _async_to_generator(function() {
        var hashedPassword, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    password = password.trim();
                    if (password.length < 6 || password.length > 50) throw new AppError(1, 401, "Password must be more than 6 characters long");
                    return [
                        4,
                        hashPassword(password)
                    ];
                case 1:
                    hashedPassword = _state.sent();
                    return [
                        4,
                        UnverifiedUser.create({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            token: crypto.randomBytes(32).toString("hex")
                        })
                    ];
                case 2:
                    user = _state.sent();
                    return [
                        2,
                        user
                    ];
            }
        });
    })();
};
var createUnverifiedUser = function(name, email, password) {
    return _async_to_generator(function() {
        var alreadyExistingUser, hashedPassword, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    name = name.trim();
                    email = email.trim();
                    password = password.trim();
                    if (!name || !email || !password) throw new AppError(1, 401, "Invalid Credentials");
                    if (!validateEmail(email)) throw new AppError(1, 401, "Invalid Email");
                    if (password.length < 6 || password.length > 50) throw new AppError(1, 401, "Password must be more than 6 characters long");
                    return [
                        4,
                        User.findOne({
                            email: email
                        })
                    ];
                case 1:
                    alreadyExistingUser = _state.sent();
                    if (alreadyExistingUser && alreadyExistingUser.googleLogin) throw new AppError(1, 401, "An user with that email already registered with google");
                    else if (alreadyExistingUser && !alreadyExistingUser.googleLogin) throw new AppError(1, 401, "An user with that email already exists");
                    return [
                        4,
                        hashPassword(password)
                    ];
                case 2:
                    hashedPassword = _state.sent();
                    return [
                        4,
                        UnverifiedUser.create({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            token: crypto.randomBytes(32).toString("hex")
                        })
                    ];
                case 3:
                    user = _state.sent();
                    return [
                        2,
                        user
                    ];
            }
        });
    })();
};
var findUser = function(email, password) {
    return _async_to_generator(function() {
        var user, aToken;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    email = email.trim();
                    password = password.trim();
                    if (!email) throw new AppError(1002, 401, "Invalid Email");
                    if (!validateEmail(email)) throw new AppError(1002, 401, "Invalid Email");
                    return [
                        4,
                        User.findOne({
                            email: email
                        })
                    ];
                case 1:
                    user = _state.sent();
                    if (!user) throw new AppError(1002, 401, "User with Email not found");
                    if (user.googleLogin) throw new AppError(1002, 401, "User logged with google");
                    if (!password) throw new AppError(1003, 401, "Invalid Password");
                    return [
                        4,
                        comparePassword(password, user.password)
                    ];
                case 2:
                    if (!_state.sent()) throw new AppError(1003, 401, "Invalid Password");
                    aToken = createTokens(user.id, email).aToken;
                    return [
                        4,
                        User.findByIdAndUpdate(user.id, {
                            tokens: _to_consumable_array(user.tokens).concat([
                                aToken
                            ])
                        }, {
                            new: true
                        })
                    ];
                case 3:
                    user = _state.sent();
                    return [
                        2,
                        {
                            aToken: aToken,
                            user: user
                        }
                    ];
            }
        });
    })();
};
var verifyUser = function(id, token) {
    return _async_to_generator(function() {
        var unverifiedUser;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(id, token);
                    if (!isValidObjectId(id)) throw new AppError(1, 401, "Invalid Id");
                    return [
                        4,
                        UnverifiedUser.findOneAndDelete({
                            _id: id,
                            token: token
                        })
                    ];
                case 1:
                    unverifiedUser = _state.sent();
                    console.log({
                        unverifiedUser: unverifiedUser
                    });
                    if (!unverifiedUser) throw new AppError(1, 401, "Cannot Verify User");
                    return [
                        2,
                        unverifiedUser
                    ];
            }
        });
    })();
};
var deleteUser = function(id) {
    return _async_to_generator(function() {
        var deletedUser, deletedDays, friendOids, deletedFriends;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        User.findByIdAndDelete(id)
                    ];
                case 1:
                    deletedUser = _state.sent();
                    return [
                        4,
                        Day.deleteMany({
                            userId: id
                        })
                    ];
                case 2:
                    deletedDays = _state.sent();
                    friendOids = deletedUser.friends.map(function(friendId) {
                        return new ObjectId(friendId);
                    });
                    return [
                        4,
                        User.updateMany({
                            _id: {
                                $in: friendOids
                            }
                        }, {
                            $pull: {
                                friends: deletedUser.id
                            }
                        })
                    ];
                case 3:
                    deletedFriends = _state.sent();
                    return [
                        2,
                        deletedUser
                    ];
            }
        });
    })();
};
var logoutUser = function(user, token) {
    return _async_to_generator(function() {
        var newTokens;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    newTokens = user.tokens.filter(function(tk) {
                        return tk !== token;
                    });
                    return [
                        4,
                        User.findByIdAndUpdate(user.id, {
                            tokens: _to_consumable_array(newTokens)
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
export { createUser, createUnverifiedUser, createResetPasswordUser, findUser, logoutUser, verifyUser, deleteUser, createOrLoginUserFromGoogle };
