import User, { TNotification, TUser } from "../models/user.js"
import { ObjectId } from "mongodb";
// const getUserFriends = async(user: TUser) =>{
//     const friends = await User.find({id: {$in: user.friends}});
//     return friends;
// }
const createNotification = (part: Omit<TNotification, "_id">): TNotification => ({
    ...part,
    _id: new ObjectId()
})
const addNotification = async(userId: ObjectId, part: Omit<TNotification, "_id">) =>{
    let notification: TNotification = {
        ...part,
        _id: new ObjectId()
    };
    const user = await User.findByIdAndUpdate(userId,{$push: {notifications: notification}});
    return user;
}
const deleteRequestsNotification = (notifications: TNotification[], requestUserId: ObjectId ) =>{
    const newNotifications = [];
    for(let notification of notifications){
      if(!(notification.type == "incoming request" && notification.from.userId == requestUserId))  {
        newNotifications.push(notification);
      }
    }
    return newNotifications
}
const removeRequestAndNotification = async(requestingId: ObjectId, receivingId: ObjectId):Promise<TUser> =>{
     console.log({requestingId, receivingId})
    const friend = await User.findByIdAndUpdate(requestingId, {
        $pull: {
            outgoingFriendRequests: receivingId
        },
    }, { new: true })

     console.log(typeof requestingId)
    const user = await User.findByIdAndUpdate(receivingId, {
        $pull: {
            incomingFriendRequests: requestingId,
            notifications: {
                type: "incoming request",
                "from.userId": requestingId
            }
        }
    }, { new: true });
     console.log("not length", user.notifications.length)
    return user;
}
const deleteOldNotifications = async(userId: string, date: number | Date) =>{
    // console.log("deleting old notifications");
    date = new Date(date);
    date.setHours(0,0,0,0);
    // const user = await User.find({"notifications.date": {$lte: date.getTime()}});
    //  console.log(user, date.getTime())
     console.log(date.getTime(), "deleting notifications");
    const user =  await User.findByIdAndUpdate(userId,{$pull: {notifications: { date: {$lte: date.getTime()}, status: "read", type: {$nin: ["incoming request", "outgoing request"]}}}},{new: true});

    return user;
}
export {
   // getUserFriends,
    addNotification,
    deleteOldNotifications,
    deleteRequestsNotification,
    removeRequestAndNotification,
    createNotification
}