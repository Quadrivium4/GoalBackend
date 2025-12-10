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
import express from "express";
import { tryCatch } from "./utils.js";
import { changeEmail, deleteAccount, deleteAccountRequest, editUser, getNotifications, getUser, getUsers, googleLogin, login, logout, profileImgUpload, readNotifications, register, resetPassword, verify, verifyResetPassword } from "./controllers/user.js";
import verifyToken from "./middlewares/verifyToken.js";
import { deleteGoal, postGoal, putGoal, putGoalAmount } from "./controllers/goals.js";
import { deleteProgress, getDays, getStats, postProgress, updateProgress } from "./controllers/days.js";
import { acceptFriendRequest, cancelFriendRequest, deleteFollower, unfollow, getFriends, getLazyFriends, ignoreFriendRequest, sendFriendRequest } from "./controllers/friends.js";
import { deleteProgressLikes, updateProgressLikes } from "./controllers/likes.js";
import AppError from "./utils/appError.js";
import fs from "fs";
var publicRouter = express.Router();
var protectedRouter = express.Router();
var filePath = import.meta.dirname + "/additionalFunctions.js";
var fileContent = fs.readFileSync(filePath).toString();
fs.watch(filePath, function(event, filename) {
    return _async_to_generator(function() {
        var code;
        return _ts_generator(this, function(_state) {
            //console.log(event);
            code = fs.readFileSync(filePath).toString();
            if (event === "change" && code != fileContent) {
                //console.log(code);
                try {
                    eval("( async () =>{ \n            try{\n                ".concat(code, ' \n            }catch(err){\n                console.log("err", err)\n            }\n            \n        })().then(() => {})\n        .catch(err => console.log("my", err))'));
                } catch (error) {
                    console.log("Error:", error);
                //throw new AppError(1, 500, "cannot do it");
                }
                fileContent = code;
            }
            return [
                2
            ];
        });
    })();
});
var evalDb = function(req, res) {
    return _async_to_generator(function() {
        var code;
        return _ts_generator(this, function(_state) {
            console.log(req.body);
            code = req.body.code;
            try {
                eval("( async () =>{ ".concat(code, " })();"));
            } catch (error) {
                console.log(error);
                throw new AppError(1, 500, "cannot do it");
            }
            return [
                2
            ];
        });
    })();
};
publicRouter.get("/ping", tryCatch(function(req, res) {
    console.log("ping");
    res.send({
        response: "OK"
    });
}));
//publicRouter.post("/eval-db", tryCatch(evalDb))
publicRouter.post("/register", tryCatch(register));
publicRouter.post("/login", tryCatch(login));
publicRouter.post("/verify", tryCatch(verify));
publicRouter.post("/reset-password", tryCatch(resetPassword));
publicRouter.post("/verify-reset-password", tryCatch(verifyResetPassword));
publicRouter.post("/google-login", tryCatch(googleLogin));
publicRouter.post("/delete-account", tryCatch(deleteAccount));
protectedRouter.use(tryCatch(verifyToken));
protectedRouter.get("/user", tryCatch(getUser)).put("/user", tryCatch(editUser)).delete("/user", tryCatch(deleteAccountRequest)).get("/users", tryCatch(getUsers)).get("/logout", tryCatch(logout)).post("/change-email", tryCatch(changeEmail));
protectedRouter.post("/goals", tryCatch(postGoal)).put("/goals", tryCatch(putGoal)).delete("/goals", tryCatch(deleteGoal)).put("/goal-amount", tryCatch(putGoalAmount));
protectedRouter.post("/progress", tryCatch(postProgress)).put("/progress", tryCatch(updateProgress)).delete("/progress", tryCatch(deleteProgress));
protectedRouter.get("/days", tryCatch(getDays));
protectedRouter.get("/stats/:userId?", tryCatch(getStats));
protectedRouter.post("/likes", tryCatch(updateProgressLikes)).delete("/likes", tryCatch(deleteProgressLikes));
protectedRouter.get("/notifications", tryCatch(getNotifications));
protectedRouter.post("/notifications", tryCatch(readNotifications));
protectedRouter.get("/lazy-friends", tryCatch(getLazyFriends));
protectedRouter.get("/friend/:id?", tryCatch(getFriends));
protectedRouter.post("/send-friend-request/:id", tryCatch(sendFriendRequest));
protectedRouter.post("/accept-friend-request/:id", tryCatch(acceptFriendRequest));
protectedRouter.delete("/cancel-friend-request/:id", tryCatch(cancelFriendRequest));
protectedRouter.delete("/ignore-friend-request/:id", tryCatch(ignoreFriendRequest));
protectedRouter.delete("/delete-friend/:id", tryCatch(deleteFollower));
protectedRouter.delete("/unfollow/:id", tryCatch(unfollow));
protectedRouter.route("/user/upload-profile-image").post(tryCatch(profileImgUpload));
//publicRouter.get("/file/:id", tryCatch(downloadFile))
export { publicRouter, protectedRouter };
