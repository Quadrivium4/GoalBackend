import mongoose from "mongoose";
var ProgressSchema = new mongoose.Schema({
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
        type: String
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
});
var Progress = mongoose.model("Progress", ProgressSchema);
export default Progress;
