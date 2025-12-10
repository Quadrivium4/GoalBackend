
import dotenv from "dotenv";
dotenv.config();
import AppError from "../utils/appError.js"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {validateEmail, hashPassword, comparePassword, createTokens} from "../utils.js"
import User, { TUser } from "../models/user.js";
import UnverifiedUser from "../models/unverifiedUser.js";
import { isValidObjectId } from "mongoose";
import Day from "../models/day.js";
import { ObjectId } from "mongodb";

const createOrLoginUserFromGoogle = async(accessToken) =>{
    const googleUser = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    }).then(res => res.json());
    if (googleUser.error) throw new AppError(1, 401, googleUser.error.message);
    console.log({googleUser})
    let user = await User.findOne({
        email: googleUser.email
    });
    if (!user) {
        user = await User.create({
        name: googleUser.given_name,
        email: googleUser.email
    });
}
    const { aToken } = createTokens(user.id, user.email);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...user.tokens, aToken]
        }, { new: true });
    console.log({user, aToken})
    return { user, aToken };
}

const createUser = async(name:string, email:string, password: string, googleLogin = false) =>{
    let user = await User.create({
        name,
        email,
        password,
        googleLogin,
        goals: []
    });
    const {aToken} = createTokens(user.id, email);
    user = await User.findByIdAndUpdate(user.id, 
        { 
            tokens: [...user.tokens, aToken ]
        }, {new: true});

    return {user, aToken };
}
const createResetPasswordUser = async (name, email, password) => {
    password = password.trim();
    if (password.length < 6 || password.length > 50) throw new AppError(1, 401, "Password must be more than 6 characters long");
    const hashedPassword = await hashPassword(password);
    
    let user = await UnverifiedUser.create({
        name,
        email,
        password: hashedPassword,
        token: crypto.randomBytes(32).toString("hex")
    });
    
    return user
}
const createUnverifiedUser = async (name, email, password) => {
    name = name.trim();
    email = email.trim();
    password = password.trim();
    if (!name || !email || !password) throw new AppError(1, 401, "Invalid Credentials");
    if (!validateEmail(email)) throw new AppError(1, 401, "Invalid Email");
    if (password.length < 6 || password.length > 50) throw new AppError(1, 401, "Password must be more than 6 characters long");
    // There is already a user with that email
    let alreadyExistingUser = await User.findOne({email});
    if (alreadyExistingUser && alreadyExistingUser.googleLogin) throw new AppError(1, 401, "An user with that email already registered with google");
    else if (alreadyExistingUser && !alreadyExistingUser.googleLogin) throw new AppError(1, 401, "An user with that email already exists");
    const hashedPassword = await hashPassword(password);
    
    let user = await UnverifiedUser.create({
        name,
        email,
        password: hashedPassword,
        token: crypto.randomBytes(32).toString("hex")
    });
    
    return user
}
const findUser = async (email, password) => {
    email = email.trim();
    password = password.trim();
    if (!email) throw new AppError(1002, 401, "Invalid Email");
    if (!validateEmail(email)) throw new AppError(1002, 401, "Invalid Email");
    let user = await User.findOne({email});
    if(!user) throw new AppError(1002, 401, "User with Email not found");
    if(user.googleLogin) throw new AppError(1002, 401, "User logged with google");
    if (!password) throw new AppError(1003, 401, "Invalid Password");
    if(!await comparePassword(password, user.password)) throw new AppError(1003, 401, "Invalid Password");
    
    const { aToken } = createTokens(user.id, email);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...user.tokens, aToken]
        }, { new: true });
    return {aToken, user};
}
const verifyUser = async(id, token) =>{
    console.log(id, token)
    if(!isValidObjectId(id)) throw new AppError(1, 401, "Invalid Id");
    const unverifiedUser = await UnverifiedUser.findOneAndDelete({_id: id, token});
    console.log({unverifiedUser})
    if (!unverifiedUser) throw new AppError(1, 401, "Cannot Verify User");
    return unverifiedUser;
}
const deleteUser = async(id: string) =>{
    const deletedUser: TUser = await User.findByIdAndDelete(id);
    const deletedDays = await Day.deleteMany({userId: id});
    const friendOids = deletedUser.friends.map(friendId => new ObjectId(friendId));
    const deletedFriends = await User.updateMany({_id: {$in: friendOids}}, { $pull: {
            friends: deletedUser.id
        }})
    return deletedUser
}
const logoutUser = async(user, token) =>{
    const newTokens = user.tokens.filter(tk=> tk !== token);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...newTokens]
        }, { new: true });
    return user;
}
export {
    createUser,
    createUnverifiedUser,
    createResetPasswordUser,
    findUser,
    logoutUser,
    verifyUser,
    deleteUser,
    createOrLoginUserFromGoogle
}