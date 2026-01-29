import mongoose from "mongoose";
import { ObjectId } from "mongodb";
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
            type: ObjectId
        },
        profileImg: {
            public_id: String,
            name: String,
            url: String
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
    //friends: [],
    bio: {
        type: String,
        trim: true
    },
    incomingFriendRequests: [
        ObjectId
    ],
    outgoingFriendRequests: [
        ObjectId
    ],
    profileImg: {
        public_id: String,
        url: String,
        name: String,
        lastModified: Number
    },
    deletionToken: {
        type: String
    },
    changeEmailToken: {
        type: String
    },
    notifications: [
        NotificationSchema
    ],
    followers: [
        ObjectId
    ],
    following: [
        ObjectId
    ],
    profileType: {
        type: String
    },
    pro: {
        type: Boolean
    }
});
var User = mongoose.model("User", UserSchema);
export default User;
