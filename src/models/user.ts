import mongoose,  { Types }  from "mongoose";
import { TFile } from "../utils/files.js";
export interface TGoal  {
    _id: Types.ObjectId,
    title: string,
    type: "time" | "distance" | "number",
    frequency: "daily" | "weekly" | "monthly",
    description: string,
    amount: number
}

export interface TNotification {
    _id: string,
    date: number,
    content: string,
    type: "like" | "incoming request" | "accepted request" | "comment" | "new follower", 
    from: {
        name: string,
        userId: string,
        profileImg?: TFile,
    }
    status: "read" | "unread"
}
const NotificationSchema = new mongoose.Schema({
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
        },
    },
    status: {
        type: String
    }
})
// const NotificationSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Number,
//         trim: true,
//         required: true
//     },
//     goal: {
//         type: Object,
//         trim: true,
//         required: true
//     },
//     progress: {
//         type: Number,
//         trim: true,
//         default: 0
//     },
//     history: {
//         type: Array, 
//         default: []
//     },
//     status: {
//         type: String
//     },
//     utcDate: {
//         type: Date
//     }
// });
export interface TUser extends mongoose.Document  {
    name: string,
    email: string,
    password: string,
    tokens: string[],
    profileImg: TFile,
    goals: TGoal[],
    friends: string[],
    bio: string,
    googleLogin?: boolean,
    outgoingFriendRequests: string[],
    incomingFriendRequests: string[],
    followers: string[],
    following: string[],
    deletionToken?: string,
    notifications: TNotification[]
}
const UserSchema = new mongoose.Schema({
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
        trim: true,
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
    notifications: [NotificationSchema],
    followers: [],
    following: []
});

const User = mongoose.model<TUser>("User", UserSchema);
export default User