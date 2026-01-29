import mongoose from "mongoose";
import { ObjectId } from "mongodb";
var LikeSchema = new mongoose.Schema({
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
    }
});
var Like = mongoose.model("Day", LikeSchema);
export default Like;
