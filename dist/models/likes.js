import mongoose from "mongoose";
var LikeSchema = new mongoose.Schema({
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
    }
});
var Like = mongoose.model("Day", LikeSchema);
export default Like;
