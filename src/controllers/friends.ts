import mongoose, { isValidObjectId, mongo } from "mongoose";
import { ObjectId } from "mongodb";
import Day from "../models/day.js";
import User, { TNotification } from "../models/user.js";
import AppError from "../utils/appError.js";
import express, { Express, Request, Response } from "express";
import { addNotification, deleteRequestsNotification,  removeRequestAndNotification } from "../functions/friends.js";
import { dayInMilliseconds } from "../utils.js";
import { ProtectedReq } from "../routes.js";
import { getLastMonday } from "./progress.js";
import Progress from "../models/progress.js";
import { TFile } from "../utils/files.js";
const week = 7 * dayInMilliseconds
const aggregateFriendDays = (userId: string, date: number,  skip: number, limit: number):mongoose.PipelineStage[] => [
  {
    $match: {
      _id: new ObjectId(userId),
    },
  },
  {
    $unwind: "$following",
  }, {
    $lookup: {
       from: "progresses",
        localField: "following",
        foreignField: "userId",
        as: "goals",
        pipeline: []
    }

  }, 
  {
    $lookup: {
      from: "progresses",
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
          "_id": "$goalId",
         
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

const aggregateFriendDays2 = (following: ObjectId[],  skip: number, limit: number):mongoose.PipelineStage[] => [{
  $match:
    {
      userId: {
        $in: following
      }
    }
},
{
  $sort: {
      date: -1
    }
},{
  $skip: skip
},
 {
  $limit: limit
},
{
  $lookup: 
{
  from: "users",
  localField: "userId",
  foreignField: "_id",
  pipeline: [{
    $project: {
      goals: 1,
      name: 1,
      profileImg: 1
    }
  }],
  as: "user"
}
},{
  $unwind: "$user"
},{
    $addFields:
      {
        goal: {
          $reduce: {
            input: "$user.goals",
            initialValue: null,
            in: {
              $cond: [
                {
                  $eq: ["$$this._id", "$goalId"]
                },
                "$$this",
                "$$value"
              ]
            }
          }
        }
      }
  }
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
const getLazyProgress = async(req: ProtectedReq, res) =>{
    const offset = 20;
    const {index, timestamp} = req.query;
    const date = new Date(parseInt(timestamp.toString(), 10));
    const indexNum = parseInt(index.toString(), 10);
    date.setHours(0,0,0,0);

     console.log({offset, index, date})
    //const friends = await getUserFriends(req.user);
    //const response = await Progress.find({userId: {$in: req.user.following || []}}).sort({date: -1}).skip(index * offset).limit(offset);
    const response = await Progress.aggregate(aggregateFriendDays2(req.user.following, indexNum * offset, offset));
     console.log("hey", response)
    res.send(response)
}
const getFriends = async (req, res) => {
    const {id} = req.params;
     if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid friend id");
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
            Day.find({userId: {$in: req.user.following }}).sort({date: -1}).limit(20)
        ];

        let [followers, incomingFriendRequests, outgoingFriendRequests, friendDays] = await Promise.all(promises);
        
        return res.send({followers, incomingFriendRequests, outgoingFriendRequests, friendDays})
    }
    
}
const sendFriendRequest = async(req: ProtectedReq, res) =>{
    const {id} = req.params;
    if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid friend id");
    const friend = await User.findById(id);
    if(friend.followers.find(id => id.equals(req.user.id))) throw new AppError(1, 400, `You are already following ${friend.name} `);
    if(friend.incomingFriendRequests.find(id => id.equals(req.user.id))) throw new AppError(1, 400, `You already sent a friend request to ${friend.name}`);

    if(friend.profileType == "public"){
      await addNotification(friend.id, newFollowerNotification(req.user.name, req.user._id, req.user.profileImg))
      const result = await User.findByIdAndUpdate(id, {
          $push: {
              followers: req.user.id
          }
      }, {new: true})
      const user = await User.findByIdAndUpdate(req.user.id,{
          $push: {
              following: id
          }
      }, {new: true})
      console.log("friend request automatically accepted", {user, friend})
      res.send(user)
    }else {

    
    await addNotification(friend.id, {
      date: Date.now(),
      content: "new follower request",
      from: {
        userId: req.user.id,
        name: req.user.name,
        profileImg: req.user.profileImg
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
     console.log("send friend request", {user, friend})
    res.send(user)
  }

}
const acceptedFriendNotification = (name: string, id: ObjectId, profileImg: TFile) : TNotification=> ({
  type: "accepted request",
  date: Date.now(),
  _id: new ObjectId(),
  content: `you are now following ${name}`,
  from:{
    userId: id,
    name: name,
    profileImg: profileImg
  },
  status: "unread"
})
const newFollowerNotification = (name: string, id: ObjectId, profileImg: TFile): TNotification => ({
  type: "new follower",
  date: Date.now(),
  _id: new ObjectId(),
  content: `${name} is now following you!`,
  from:{
    userId: id,
    name: name,
    profileImg: profileImg,
  },
  status: "unread"
})
const acceptFriendRequest = async(req: ProtectedReq, res) =>{
    const { id } = req.params;
     if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid friend id");
    if(!req.user.incomingFriendRequests.includes(new ObjectId(id))) throw new AppError(1, 400, "This person didn't send you any following request!")
    const friend = await User.findByIdAndUpdate(id, {
        $push: {
            following: req.user.id,
            notifications: acceptedFriendNotification(req.user.name, req.user.id, req.user.profileImg)
        },
        $pull: {
            outgoingFriendRequests: req.user.id
        }
    }, {new: true})
     console.log(friend._id.toString());

    let newUserNotifications = req.user.notifications.filter(not =>{
      return !(not.type == "incoming request" && not.from.userId == friend.id.toString())
    })
    newUserNotifications.push(newFollowerNotification(friend.name, friend._id, friend.profileImg));
    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            followers: friend._id,
            },
        $pull: {
            incomingFriendRequests: friend._id,
  
        }, $set: {
          notifications: newUserNotifications
        }
    }, {new: true});

    
    res.send(user)

}
const ignoreFriendRequest = async (req: ProtectedReq, res) => {
    const { id } = req.params;
     if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid friend id");
     console.log("ignoring friend request", {id})
    //if (!req.user.incomingFriendRequests.includes(id)) throw new AppError(1, 400, `No friend request found from him`);
    const user = await removeRequestAndNotification(new ObjectId(id), req.user._id);
    //  console.log("cancel friend request", {
    //     user,
    // })
    res.send(user)
    
}
const cancelFriendRequest = async (req: ProtectedReq, res) => {
    const { id } = req.params;
     if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid friend id");
     console.log("canceling friend request", {id})
    //if (!req.user.outgoingFriendRequests.includes(id)) throw new AppError(1, 400, `You didn't send any friend request to him!`);
    const friend = await User.findById(id)
    const user = await removeRequestAndNotification(req.user._id,new ObjectId(id))

    //  console.log("cancel friend request", {
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
     console.log("follower deleted", {user, friend})
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
     console.log("unfollowed", {user, friend})
    res.send(user)
}
export  {
    getFriends,
    getLazyFriends,
    acceptFriendRequest,
    sendFriendRequest,
    cancelFriendRequest,
    ignoreFriendRequest,
    getLazyProgress,
    deleteFollower,
    unfollow
}
