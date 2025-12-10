import mongoose, { mongo } from "mongoose";
import { ObjectId } from "mongodb";
import Day from "../models/day.js";
import User, { TNotification } from "../models/user.js";
import AppError from "../utils/appError.js";
import express, { Express, Request, Response } from "express";
import { addNotification, deleteRequestsNotification, getUserFriends, removeRequestAndNotification } from "../functions/friends.js";
import { dayInMilliseconds } from "../utils.js";
import { getLastMonday, getLastSunday } from "./days.js";
import { ProtectedReq } from "../routes.js";
const week = 7 * dayInMilliseconds
const aggregateFriendDays = (userId: string, date: number,  skip: number, limit: number):mongoose.PipelineStage[] => [
  {
    $match: {
      _id: new ObjectId(userId),
    },
  },
  {
    $unwind: "$following",
  },
  {
    $lookup: {
      from: "days",
      localField: "following",
      foreignField: "userId",
      as: "goals",
      pipeline: [
        {
          $match: {
               $or: [
          {
            date: {
              $gte: date,
            },
          },
          {
            $and: [
              {
                "goal.frequency": {
                  $eq: "weekly",
                },
              },
              {
                date: {
                  $gte: getLastMonday(date).getTime(),
                },
              },
            ],
          },
        ],
          },
        },
        {$group: {
          "_id": "$goal._id",
          "title": {$first: "$goal.title"},
          "type": {$first: "$goal.type"},
          "amount": {$first: "$goal.amount"},
          "date": {$first: "$date"},
          "history": {$push: "$$ROOT"},
          "userId": {$first: "$userId"}
        }
      },
      ],
    },
  },
  {
    $project:
      {
        _id: {
          $toObjectId: "$following",
        },
        goals: 1,
      },
  },
  {
    $lookup:
      {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
  },
  {
    $unwind: "$user",
  },
  {
    $project: {
      _id: 1,
      name: "$user.name",
      goals: 1,
      profileImg: "$user.profileImg",
      goalsInfo: "$user.goals"
    },
  },
]
const aggregateDayFriends = [
  {
    $addFields:
      {
        userObjectId: {
          $toObjectId: "$userId",
        },
      },
  },
  {
    $lookup:
      {
        from: "users",
        localField: "userObjectId",
        foreignField: "_id",
        as: "user",
      },
  },
  {
    $unwind: "$user",
  },
]

const getLazyFriends = async(req, res) =>{
    const offset = 20;
    const {index, timestamp} = req.query;
    const date = new Date(parseInt(timestamp, 10));
    date.setHours(0,0,0,0);

    console.log({offset, index, date})
    //const friends = await getUserFriends(req.user);
    const response = await User.aggregate(aggregateFriendDays(req.user.id, date.getTime(), index * offset, offset));
    
    console.log("hey", response)
    res.send(response)
}
const getFriends = async (req, res) => {
    const {id} = req.params;
    if(id){
        console.log("getting friend", { id })
        //let isFriend = req.user.friends.find(friend => friend.id == id);
        //if(!isFriend) throw new AppError(1, 400, "is not your friend")
        const friend = await User.findById(id);
        return res.send({
            id: friend.id,
            name: friend.name,
            profileImg: friend.profileImg,
            goals: friend.goals
        })
    }else{
        console.log("getFriends...")
        let promises = [
            User.find({_id: {$in: req.user.followers}}), 
            User.find({_id: {$in: req.user.incomingFriendRequests}}), 
            User.find({_id: {$in: req.user.outgoingFriendRequests}}), 
            Day.find({userId: {$in: req.user.following}}).sort({date: -1}).limit(20)
        ];
        // let friendsPromises = req.user.friends.map(friend =>{
        //     return User.findById(friend);
        // })
        // promises.push(fr)
        // let incomingFriendsPromises = req.user.incomingFriendRequests.map(friend =>{
        //     return User.findById(friend);
        // })

        // let outgoingFriendsPromises = req.user.outgoingFriendRequests.map(friend =>{
        //     return User.findById(friend);
        // })
        // let friendGoalsPromises = req.user.friends.map(friend =>{

        // })
        // let [friends, incomingFriendRequests, outgoingFriendRequests] = await Promise.all([Promise.all(friendsPromises),Promise.all(incomingFriendsPromises), Promise.all(outgoingFriendsPromises)]);
        let [followers, incomingFriendRequests, outgoingFriendRequests, friendDays] = await Promise.all(promises);
        
        
        //console.log({friends, incomingFriendRequests, outgoingFriendRequests, friendDays})
        return res.send({followers, incomingFriendRequests, outgoingFriendRequests, friendDays})
    }
    
}
const sendFriendRequest = async(req, res) =>{
    const {id} = req.params;
    const friend = await User.findById(id);
    if(friend.followers.find(id =>id == req.user.id)) throw new AppError(1, 400, `You are already following ${friend.name} `);
    if(friend.incomingFriendRequests.includes(req.user.id)) throw new AppError(1, 400, `You already sent a friend request to ${friend.name}`);
    await addNotification(friend.id, {
      date: Date.now(),
      content: "new follower request",
      from: {
        userId: req.user.id,
        name: req.user.name,
      },
      type: "incoming request",
      status: "unread"
    })
    const result = await User.findByIdAndUpdate(id, {
        $push: {
            incomingFriendRequests: req.user.id
        }
    }, {new: true})
    const user = await User.findByIdAndUpdate(req.user.id,{
        $push: {
            outgoingFriendRequests: id
        }
    }, {new: true})
    console.log("send friend request", {
        user, friend
    })
    res.send(user)

}
const acceptedFriendNotification = (name: string, id: string) : TNotification=> ({
  type: "accepted request",
  date: Date.now(),
  _id: new ObjectId().toHexString(),
  content: "you are now following...",
  from:{
    userId: id,
    name: name
  },
  status: "unread"
})
const newFollowerNotification = (name: string, id: string): TNotification => ({
  type: "new follower",
  date: Date.now(),
  _id: new ObjectId().toHexString(),
  content: `${name} is now following you!`,
  from:{
    userId: id,
    name: name
  },
  status: "unread"
})
const acceptFriendRequest = async(req: ProtectedReq, res) =>{
    const { id } = req.params;
    if(!req.user.incomingFriendRequests.includes(id)) throw new AppError(1, 400, "This person didn't send you any following request!")
    const friend = await User.findByIdAndUpdate(id, {
        $push: {
            following: req.user.id,
            notifications: acceptedFriendNotification(req.user.name, req.user.id)
        },
        $pull: {
            outgoingFriendRequests: req.user.id
        }
    }, {new: true})
    console.log(friend._id.toString());

    let newUserNotifications = req.user.notifications.filter(not =>{
      return !(not.type == "incoming request" && not.from.userId == friend.id.toString())
    })
    newUserNotifications.push(newFollowerNotification(friend.name, friend.id.toString()));
    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            followers: friend.id,
            },
        $pull: {
            incomingFriendRequests: id,
  
        }, $set: {
          notifications: newUserNotifications
        }
    }, {new: true});

    
    res.send(user)

}
const ignoreFriendRequest = async (req, res) => {
    const { id } = req.params;
    console.log("ignoring friend request", {id})
    //if (!req.user.incomingFriendRequests.includes(id)) throw new AppError(1, 400, `No friend request found from him`);
    const user = await removeRequestAndNotification(id, req.user.id);
    // console.log("cancel friend request", {
    //     user,
    // })
    res.send(user)
    
}
const cancelFriendRequest = async (req, res) => {
    const { id } = req.params;
    console.log("canceling friend request", {id})
    //if (!req.user.outgoingFriendRequests.includes(id)) throw new AppError(1, 400, `You didn't send any friend request to him!`);
    const friend = await User.findById(id)
    const user = await removeRequestAndNotification(req.user.id, id)

    // console.log("cancel friend request", {
    //     user, friend
    // })
    res.send(user)
    

}
const deleteFollower = async(req, res) =>{
    const {id} = req.params;
    const friend = await User.findByIdAndUpdate(id, {
        $pull: {
            following: req.user.id

        },

    }, { new: true })
    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            followers: id
        },
    }, { new: true })
    console.log("follower deleted", {
        user, friend
    })
    res.send(user)
}
const unfollow = async(req: ProtectedReq, res) =>{
   const {id} = req.params;
    const friend = await User.findByIdAndUpdate(id, {
        $pull: {
            followers: req.user.id

        },

    }, { new: true })
    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            following: id
        },
    }, { new: true })
    console.log("unfollowed", {
        user, friend
    })
    res.send(user)
}
export  {
    getFriends,
    getLazyFriends,
    acceptFriendRequest,
    sendFriendRequest,
    cancelFriendRequest,
    ignoreFriendRequest,
    deleteFollower,
    unfollow
}
