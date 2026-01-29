import mongoose from "mongoose"
import {ObjectId} from "mongodb"
import { TFile } from "../utils/files.js"

export type TLike = {
    progressId: ObjectId,
    userId: ObjectId,
    username: string,
    profileImg: TFile
}

const LikeSchema = new mongoose.Schema({
    progressId: {
        type: String
    },
    userId: {
        type: ObjectId
    },
    username: {
        type: String
    },
    profileImg: {
        public_id: String,
        url: String,
        name: String,
        lastModified: Number
    },
})

const Like = mongoose.model<TLike>("Day", LikeSchema);
export default Like
