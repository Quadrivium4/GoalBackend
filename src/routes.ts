import express, {Request, Response as ExpressResponse} from "express"
import { tryCatch } from "./utils.js";
import { addPasswordToLogin, changeEmail, deleteAccount, deleteAccountRequest, editUser, generateCloudinarySignature, getNotifications, getProfile, getUser, getUsers, googleLogin, login, logout, profileImgUpdate, profileImgUpload, readNotifications, register, resetPassword, verify, verifyResetPassword } from "./controllers/user.js";
import verifyToken from "./middlewares/verifyToken.js";
import { deleteGoal, postGoal, putGoal, putGoalAmount } from "./controllers/goals.js";
import {acceptFriendRequest, cancelFriendRequest, deleteFollower, unfollow, getFriends, getLazyFriends, ignoreFriendRequest, sendFriendRequest, getLazyProgress } from "./controllers/friends.js"
import { TUser } from "./models/user.js";
import { deleteProgressLikes, updateProgressLikes } from "./controllers/likes.js";
import { ParamsDictionary, Query, Request as CoreRequest } from "express-serve-static-core";
import AppError from "./utils/appError.js";
import fs from "fs";
import { ObjectId } from "mongodb";
import { deleteProgress, getProgresses, getStats, postProgress, updateProgress } from "./controllers/progress.js";
export interface ProtectedReq<
        P = ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = Query,
        Locals extends Record<string, any> = Record<string, any>,
    > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
        user: TUser
    };

export type Response = ExpressResponse;
const publicRouter = express.Router();
const protectedRouter = express.Router();
//const filePath = import.meta.dirname + "/additionalFunctions.js";
// let fileContent = fs.readFileSync(filePath).toString();
// fs.watch(filePath, async(event, filename) => {
//     // console.log(event);
//     let code = fs.readFileSync(filePath).toString();
//     if(event === "change" && code != fileContent){
//         // console.log(code);
//         try {
//             eval(`( async () =>{ 
//             try{
//                 ${code} 
//             }catch(err){
//                  console.log("err", err)
//             }
            
//         })().then(() => {})
//         .catch(err =>  console.log("my", err))`);
        
//         }
//         catch (error) {
//              console.log("Error:", error);
//             //throw new AppError(1, 500, "cannot do it");
//         }
//         fileContent = code;
//     }
   
// });
const evalDb = async(req, res) =>{
     console.log(req.body);
    const {code} = req.body;
    try {
        eval(`( async () =>{ ${code} })();`)
    } catch (error) {
         console.log(error)
        throw new AppError(1, 500, "cannot do it")
    }
    
}
publicRouter.get("/ping", tryCatch((req, res)=>{ res.send({response: "OK"})}))
//publicRouter.post("/eval-db", tryCatch(evalDb))
publicRouter.post("/register", tryCatch(register));
publicRouter.post("/login", tryCatch(login));
publicRouter.post("/verify", tryCatch(verify));
publicRouter.post("/reset-password", tryCatch(resetPassword));
publicRouter.post("/verify-reset-password", tryCatch(verifyResetPassword));
publicRouter.post("/google-login", tryCatch(googleLogin))
publicRouter.post("/delete-account", tryCatch(deleteAccount))


protectedRouter.post("/add-password", tryCatch(addPasswordToLogin));
protectedRouter.use(tryCatch(verifyToken))
protectedRouter
    .get("/profile", tryCatch(getProfile))
protectedRouter
    .get("/user", tryCatch(getUser))
    .put("/user", tryCatch(editUser))
    .delete("/user",tryCatch(deleteAccountRequest) )
    .get("/users", tryCatch(getUsers))
    .get("/logout", tryCatch(logout))
    .post("/change-email", tryCatch(changeEmail))
protectedRouter
    .post("/goals", tryCatch(postGoal))
    .put("/goals", tryCatch(putGoal) )
    .delete("/goals", tryCatch(deleteGoal))
    .put("/goal-amount", tryCatch(putGoalAmount))
protectedRouter
    .get("/progress", tryCatch(getProgresses))
    .post("/progress", tryCatch(postProgress))
    .put("/progress", tryCatch(updateProgress))
    .delete("/progress", tryCatch(deleteProgress))
//protectedRouter.get("/days", tryCatch(getDays))
protectedRouter.get("/stats/:userId?", tryCatch(getStats))

protectedRouter
    .post("/likes", tryCatch(updateProgressLikes))
    .delete("/likes", tryCatch(deleteProgressLikes))

protectedRouter.get("/notifications", tryCatch(getNotifications));
protectedRouter.post("/notifications", tryCatch(readNotifications));

protectedRouter.get("/lazy-friends", tryCatch(getLazyFriends))
protectedRouter.get("/lazy-progress", tryCatch(getLazyProgress))
protectedRouter.get("/friend/:id?", tryCatch(getFriends))
protectedRouter.post("/send-friend-request/:id", tryCatch(sendFriendRequest))
protectedRouter.post("/accept-friend-request/:id", tryCatch(acceptFriendRequest))

protectedRouter.delete("/cancel-friend-request/:id", tryCatch(cancelFriendRequest))
protectedRouter.delete("/ignore-friend-request/:id", tryCatch(ignoreFriendRequest))
protectedRouter.delete("/delete-friend/:id", tryCatch(deleteFollower))
protectedRouter.delete("/unfollow/:id", tryCatch(unfollow))

protectedRouter.route("/user/upload-profile-image")
    .post(tryCatch(profileImgUpload))

protectedRouter.route("/user/update-img")
    .post(tryCatch(profileImgUpdate))
protectedRouter.route("/cloudinary-signature")
    .get(tryCatch(generateCloudinarySignature))
//publicRouter.get("/file/:id", tryCatch(downloadFile))


export {publicRouter, protectedRouter}