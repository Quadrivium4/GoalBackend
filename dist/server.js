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
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import { protectedRouter, publicRouter } from "./routes.js";
import Day from "./models/day.js";
import User from "./models/user.js";
import fileUpload from "express-fileupload";
import errorHandler from "./middlewares/errorHandler.js";
var app = express();
var port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(publicRouter);
app.use("/protected", protectedRouter);
app.listen(port, function() {
    return _async_to_generator(function() {
        var err;
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
                        connectDB(process.env.MONGO_URI)
                    ];
                case 1:
                    _state.sent();
                    //await updateUsersDb()
                    console.log("Server listening on port ".concat(port));
                    return [
                        3,
                        3
                    ];
                case 2:
                    err = _state.sent();
                    console.log("Cannot start server:", err);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
});
var updateDaysDb = function() {
    return _async_to_generator(function() {
        var days, promises;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Day.find({})
                    ];
                case 1:
                    days = _state.sent();
                    promises = [];
                    days.forEach(function(day) {
                    // promises.push(Day.findByIdAndUpdate(day.id, {"goal._id":  new mongoose.Types.ObjectId(day.goal.id)}))
                    });
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
};
var updateUsersDb = function() {
    return _async_to_generator(function() {
        var users, promises;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        User.find({})
                    ];
                case 1:
                    users = _state.sent();
                    promises = [];
                    users.forEach(function(user) {
                        user.goals.forEach(function(goal) {
                        //promises.push(User.findOneAndUpdate({_id: user._id, 'goals._id': goal._id}, {"goals.$._id":  new mongoose.Types.ObjectId(goal.id)}))
                        });
                    });
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
};
app.use(errorHandler);
