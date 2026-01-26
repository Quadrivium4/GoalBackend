import { dataform } from "googleapis/build/src/apis/dataform/index.js";
import Day, { THistoryEvent } from "../models/day.js";
import { dayInMilliseconds, isOldDay } from "../utils.js";
import { TUser } from "../models/user.js";
import { ProtectedReq, Response } from "../routes.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { addNotification } from "../functions/friends.js";
import Progress from "../models/progress.js";
import Like, { TLike } from "../models/likes.js";

const updateProgressLikes = async(req: ProtectedReq, res: Response) =>{
     console.log(req.body)
    const { id} = req.body;
    const like: TLike = {
        userId: req.user.id,
        progressId: id,
        profileImg: req.user.profileImg,
        username: req.user.name
    }
    let progress = await Progress.findByIdAndUpdate(id, {
        $inc: {
            likesCount: 1
        },
        $push: {
            likes: like
        }
    },{new: true});

   

    addNotification(progress.userId, {
        type: "like",
        from: {
            profileImg: req.user.profileImg,
            userId: req.user.id,
            name: req.user.name,

        },
        status: "unread",
        date: Date.now(),
        content: req.user.name + " liked your activity"
    });
     console.log({progress});
    res.send(progress);
}
const deleteProgressLikes = async(req: ProtectedReq, res: Response) =>{
     console.log(req.query)
    let {timestamp, id} = req.query;
    let date = parseInt(timestamp as string, 10)
     console.log(date)
    const day = await Progress.findByIdAndUpdate(id, {$pull: { likes : {userId: req.user._id.toString()}}, $inc: {likesCount: -1}},{new: true});
     console.log(day)
    res.send(day)
}
export {
    updateProgressLikes,
    deleteProgressLikes
}