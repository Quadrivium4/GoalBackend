import mongoose from "mongoose"
import { TLike } from "./likes.js";


export type TProgress = {
    userId: string,
    date: number,
    amount: number,
    notes: string,
    likes: TLike[],
    likesCount: number,
    goalId: string,
    goalAmount: number
}

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: String
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
    likes: [],
    likesCount: {
        type: Number
    },
    goalId: {
        type: String
    },
    goalAmount: {
        type: Number
    }
})
const Progress = mongoose.model<TProgress>("Progress", ProgressSchema);
export default Progress