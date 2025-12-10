import mongoose from "mongoose";
var NotificationSchema = new mongoose.Schema({
    date: {
        type: Number
    },
    content: {
        type: String
    },
    type: String,
    from: {
        name: {
            type: String
        },
        userId: {
            type: String
        }
    },
    status: {
        type: String
    }
});
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true
    },
    googleLogin: {
        type: Boolean
    },
    tokens: [],
    goals: [],
    friends: [],
    bio: {
        type: String,
        trim: true
    },
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    profileImg: {
        public_id: String,
        url: String,
        name: String
    },
    deletionToken: {
        type: String
    },
    notifications: [
        NotificationSchema
    ],
    followers: [],
    following: []
});
var User = mongoose.model("User", UserSchema);
export default User;
