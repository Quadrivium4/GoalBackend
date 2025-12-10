import dotenv from "dotenv"
dotenv.config();
import express from "express";
import connectDB from "./db.js"
import cors from "cors"
import { protectedRouter, publicRouter } from "./routes.js";
import Day, { TDay } from "./models/day.js";
import mongoose from "mongoose";
import User, { TUser } from "./models/user.js";
import fileUpload from "express-fileupload";
import errorHandler from "./middlewares/errorHandler.js"
import { deleteAllDaysInDate } from "./utils.js";

const app = express();
const port = process.env.PORT;
app.use(express.json())
app.use(cors());
app.use(fileUpload())
app.use(publicRouter)
app.use("/protected", protectedRouter)
app.listen(port, async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        
    //await updateUsersDb()
        console.log(`Server listening on port ${port}`)
        //await deleteAllDaysInDate(1744359051162)
    }catch(err){
        console.log("Cannot start server:", err)
    }
})
const updateDaysDb = async() =>{
    let days = await Day.find({});
    let promises = [];
    days.forEach(day =>{
       // promises.push(Day.findByIdAndUpdate(day.id, {"goal._id":  new mongoose.Types.ObjectId(day.goal.id)}))
    })
    await Promise.all(promises);
}
const updateUsersDb = async() =>{
    let users = await User.find({});
    let promises = [];
    users.forEach(user =>{
        user.goals.forEach(goal =>{
            //promises.push(User.findOneAndUpdate({_id: user._id, 'goals._id': goal._id}, {"goals.$._id":  new mongoose.Types.ObjectId(goal.id)}))
        })
        
    })
    await Promise.all(promises);
}
app.use(errorHandler)