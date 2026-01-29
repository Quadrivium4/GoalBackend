import mongoose from "mongoose"
import { TLike } from "./likes.js";
import {ObjectId} from "mongodb"

export type TProgress = {
    userId: ObjectId,
    date: number,
    amount: number,
    notes: string,
    likes: TLike[],
    likesCount: number,
    goalId: ObjectId,
    goalAmount: number
}

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: ObjectId
    },
    date: {
        type: Number
    },
    amount: {
        type: Number
    },
    notes: {
        type: String,
    },
    likes: [{
        profileImg: {
            public_id: String,
            url: String,
            name: String
        },
        userId: ObjectId,
        username: String
    }],
    likesCount: {
        type: Number
    },
    goalId: {
        type: ObjectId
    },
    goalAmount: {
        type: Number
    }
})
const Progress = mongoose.model<TProgress>("Progress", ProgressSchema);
export default Progress