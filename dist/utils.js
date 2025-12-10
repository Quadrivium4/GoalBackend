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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Day from "./models/day.js";
import { ObjectId } from "mongodb";
import { queryDayDate } from "./controllers/goals.js";
export var dayInMilliseconds = 1000 * 60 * 60 * 24;
import crypto from "crypto";
var validateEmail = function(email) {
    var expression = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/i;
    return expression.test(String(email).toLowerCase());
};
var tryCatch = function(controller) {
    return function(req, res, next) {
        return _async_to_generator(function() {
            var error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            controller(req, res, next)
                        ];
                    case 1:
                        _state.sent();
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        console.log("error in try catch");
                        return [
                            2,
                            next(error)
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
};
var hashPassword = function(password) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
};
var comparePassword = function(password, hashedPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hashedPassword, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
};
var createTokens = function(id, email) {
    var aToken = jwt.sign({
        email: email,
        id: id
    }, process.env.JWT_A_TOKEN_KEY);
    var rToken = jwt.sign({
        email: email,
        id: id
    }, process.env.JWT_R_TOKEN_KEY);
    return {
        aToken: aToken,
        rToken: rToken
    };
};
function extractBearerToken(req) {
    if (!req.headers.authorization) return false;
    if (!req.headers.authorization.startsWith("Bearer ")) return false;
    var token = req.headers.authorization.split(" ")[1];
    return token;
}
function isOldDay(dayDate, date) {
    console.log("is Old day?", {
        dayDate: dayDate
    }, date);
    var date1 = new Date(dayDate);
    var date2 = new Date(date);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    if (date1.getTime() < date2.getTime()) {
        console.log("yes");
        return true;
    }
    console.log("false");
    return false;
}
function eqOid(id1, id2) {
    id1 = new ObjectId(id1);
    id2 = new ObjectId(id2);
    return id1.toString() === id2.toString();
}
function deleteAllDaysInDate(date) {
    return _async_to_generator(function() {
        var deleted;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Day.deleteMany(queryDayDate(date))
                    ];
                case 1:
                    deleted = _state.sent();
                    console.log({
                        deleted: deleted
                    });
                    return [
                        2
                    ];
            }
        });
    })();
}
function createRandomToken() {
    return crypto.randomBytes(32).toString("hex");
}
export { validateEmail, tryCatch, hashPassword, comparePassword, createTokens, extractBearerToken, isOldDay, eqOid, deleteAllDaysInDate, createRandomToken };
