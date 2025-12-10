import mongoose from "mongoose";
var DaySchema = new mongoose.Schema({
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
var Day = mongoose.model("Day", DaySchema);
export default Day;
