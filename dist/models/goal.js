// import mongoose, { Types } from "mongoose";
// export interface TGoal extends mongoose.Document {
//     _id: Types.ObjectId,
//     name: string,
//     type: "time" | "distance" | "number",
//     frequency: "daily" | "weekly" | "monthly",
//     description: string,
//     amount: number
// }
// const GoalSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     type: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     frequency: {
//         type: String,
//         trim: true,
//     },
//     description: {
//         type: String
//     },
//     amount: {
//         type: Number
//     }
// });
// const Goal = mongoose.model<TGoal>("Goal", GoalSchema);
// export default Goal
