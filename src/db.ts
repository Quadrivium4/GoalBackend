
import mongoose from "mongoose";
export const DB = {
    files: null
}
const connectDB = (url: string) =>{
    mongoose.set("strictQuery", false);
    mongoose.connection.on("open", () => {
        let db = mongoose.connections[0].db;
        DB.files = new mongoose.mongo.GridFSBucket(db);
        //mongoose.files = new mongoose.mongo.GridFSBucket(db);
    })
    return mongoose.connect(url);
}
export default connectDB