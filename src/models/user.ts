import mongoose,  {  Schema, Types }  from "mongoose";
import {ObjectId} from "mongodb"
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
    _id: ObjectId,
    date: number,
    content: string,
    type: "like" | "incoming request" | "accepted request" | "comment" | "new follower", 
    from: {
        name: string,
        userId: ObjectId,
        profileImg?: TFile,
    }
    status: "read" | "unread"
}
export type TProfileType = "public" | "private";

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
    _id: ObjectId,
    name: string,
    email: string,
    password: string,
    tokens: string[],
    profileImg: TFile,
    goals: TGoal[],
    bio: string,
    googleLogin?: boolean,
    outgoingFriendRequests: ObjectId[],
    incomingFriendRequests: ObjectId[],
    followers: ObjectId[],
    following: ObjectId[],
    deletionToken?: string,
    changeEmailToken?: string,
    notifications: TNotification[],
    profileType: TProfileType,
    pro: boolean
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
    //friends: [],
    bio: {
        type: String,
        trim: true
    },
    incomingFriendRequests: [ObjectId],
    outgoingFriendRequests: [ObjectId],
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
    notifications: [NotificationSchema],
    followers: [ObjectId],
    following: [ObjectId],
    profileType: {
        type: String,
    
    },
    pro: {
        type: Boolean
    }
});

const User = mongoose.model<TUser>("User", UserSchema);
export default User