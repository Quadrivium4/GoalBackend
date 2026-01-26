import mongoose from "mongoose"
import { TFile } from "../utils/files.js"

export type TLike = {
    progressId: string,
    userId: string,
    username: string,
    profileImg: TFile
}

const LikeSchema = new mongoose.Schema({
    progressId: {
        type: String
    },
    userId: {
        type: String
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
