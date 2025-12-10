import mongoose from "mongoose";
export var DB = {
    files: null
};
var connectDB = function(url) {
    mongoose.set("strictQuery", false);
    mongoose.connection.on("open", function() {
        var db = mongoose.connections[0].db;
        DB.files = new mongoose.mongo.GridFSBucket(db);
    //mongoose.files = new mongoose.mongo.GridFSBucket(db);
    });
    return mongoose.connect(url);
};
export default connectDB;
