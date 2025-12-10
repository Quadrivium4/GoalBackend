import mongoose from "mongoose";
var UnverifiedUserSchema = new mongoose.Schema({
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
        required: true
    },
    token: {
        type: String,
        required: true
    }
});
var UnverifiedUser = mongoose.model("UnverifiedUser", UnverifiedUserSchema);
export default UnverifiedUser;
