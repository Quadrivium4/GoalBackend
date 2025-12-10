import mongoose from "mongoose";
import { TGoal } from "./user.js";
import { TFile } from "../utils/files.js";

export type TLike = {
    userId: string,
    username: string,
    profileImg: TFile
}
export type THistoryEvent = {
    progress: number,
    date: number,
    notes: string,
    likes: TLike[]
}
export type TDay = {
    userId: string,
    date: number,
    goal: TGoal,
    progress: number,
    history: THistoryEvent[],
    status: "completed" | "in progress" | "unfinished"
}
const DaySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        trim: true,
        required: true
    },
    goal: {
        type: Object,
        trim: true,
        required: true
    },
    progress: {
        type: Number,
        trim: true,
        default: 0
    },
    history: {
        type: Array, 
        default: []
    },
    status: {
        type: String
    },
    utcDate: {
        type: Date
    }
});

const Day = mongoose.model<TDay>("Day", DaySchema);
export default Day