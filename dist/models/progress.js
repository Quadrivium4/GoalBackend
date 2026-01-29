import mongoose from "mongoose";
import { ObjectId } from "mongodb";
var ProgressSchema = new mongoose.Schema({
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
        type: String
    },
    likes: [
        {
            profileImg: {
                public_id: String,
                url: String,
                name: String
            },
            userId: ObjectId,
            username: String
        }
    ],
    likesCount: {
        type: Number
    },
    goalId: {
        type: ObjectId
    },
    goalAmount: {
        type: Number
    }
});
var Progress = mongoose.model("Progress", ProgressSchema);
export default Progress;
