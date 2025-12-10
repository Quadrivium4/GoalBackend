import sendMail from "../utils/sendMail.js"
import { comparePassword, createRandomToken, createTokens, extractBearerToken, validateEmail } from "../utils.js";
import User from "../models/user.js";
import { createUnverifiedUser, createUser, verifyUser, findUser, deleteUser, logoutUser, createResetPasswordUser } from "../functions/user.js";
import { deleteFile, saveFile } from "../utils/files.js";
import { OAuth2Client } from "google-auth-library";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import { deleteOldNotifications } from "../functions/friends.js";
import { ProtectedReq } from "../routes.js";
import { ObjectId } from "mongodb";

export const GOOGLE_LOGIN = "google-login"
const client = new OAuth2Client();
const register = async(req, res) =>{
    console.log(req.body)
    const { name, email, password } = req.body;
    const user = await createUnverifiedUser(name, email, password);
    const link = `${process.env.CLIENT_URL}/verify/${user.id}/${user.token}`;
    console.log({link})
    await sendMail({
        to: user.email,
        subject: "Confirm your email",
        body:  `<h1>Confirmation email: </h1>
                <a href="${link}">verify</a>`
    })
    res.send(user);
}

// const signInWithGoogle = async (req, res) => {
//     console.log("logging with google...")
//     const token = extractBearerToken(req);
//     if (!token) throw new AppError(1, 403, "Invalid Token");
//     const { user, aToken } = await createOrLoginUserFromGoogle(token);
//     console.log({user, aToken})
//     res.send({user, aToken});
// }
const verify = async (req, res) => {
    console.log(req.body)
    const {id,  token } = req.body;
    const {name, email, password}= await verifyUser(id, token);
    console.log({name, email, password})
    const { user, aToken } = await createUser(name, email, password);
    console.log({user, aToken})
    res.send({ user, aToken });
}
const login = async(req, res) =>{
    const {email, password} = req.body;
    
    const {user, aToken} = await findUser(email, password);
    
    res.send({ user, aToken });
}
const verifyResetPassword = async(req, res)=>{
    console.log("verifying reset password", req.body)
    const {id,  token } = req.body;
    const {name, email, password}= await verifyUser(id, token);
    console.log({name, email, password})
    let user = await User.findOneAndUpdate({email}, {password }, {new: true});
        
    const { aToken } = createTokens(user.id, email);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...user.tokens, aToken]
        }, { new: true });

    console.log({user, aToken})
    res.send({ user, aToken });
}
const resetPassword = async(req, res) =>{
    console.log("resetting password", req.body);
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new AppError(1002,404, "User with that email not found");
    const unverifiedUser = await createResetPasswordUser(user.name, user.email, password);
    

    //const token = crypto.randomBytes(32).toString("hex");
    const link = `${process.env.CLIENT_URL}/verify-password/${unverifiedUser.id}/${unverifiedUser.token}`;
    console.log({link})
    let result = await sendMail({
        to: user.email,
        subject: "Confirm your email",
        body:  `<h1>Confirmation email: </h1>
                <a href="${link}">verify</a>`
    })
    console.log(result);
    res.send({user, result});
}
const googleLogin = async(req, res) =>{
    //const {credential, client_id} = req.body;
    const {token} = req.body;
    const googleUser = await fetch("https://www.googleapis.com/userinfo/v2/me", { headers: { Authorization: `Bearer ${token}` }}).then(res => res.json());
    console.log(googleUser)
    if(googleUser.error) throw new AppError(1, 500, "error google")
    //const ticket = await client.verifyIdToken({idToken: credential, audience: client_id})
    //console.log(ticket)
    const payload = googleUser;//ticket.getPayload()
    let alreadyExistingUser = await User.findOne({email: payload.email});
    if (alreadyExistingUser && !alreadyExistingUser.googleLogin) throw new AppError(1, 401, "A user with that email, not logged with google already exists");
    if (alreadyExistingUser && alreadyExistingUser.googleLogin) {
        const {aToken} = createTokens(alreadyExistingUser.id, alreadyExistingUser.email);
        let user = await User.findByIdAndUpdate(alreadyExistingUser.id,
        {
            tokens: [...alreadyExistingUser.tokens, aToken]
        }, { new: true });
        return res.send({user, aToken})
    }
    
    const { user, aToken } = await createUser(payload.name, payload.email, "", true);
    console.log({user, aToken})
    res.send({ user, aToken });
}

const profileImgUpload = async(req, res) =>{
    console.log(req.files)
    const fileId = await saveFile(req.files.image);
    if(req.user.profileImg) deleteFile(req.user.profileImg);
    const user = await User.findByIdAndUpdate(req.user.id,{
        profileImg: fileId
    },{new: true})
    console.log("profile image updated",{ user})
    res.send(fileId)
}

const getUser = async(req, res) =>{
    const {id} = req.query;
    console.log("getting user", {id})
    if(!id) return res.send(req.user);
    const user = await User.findById(id);
    return res.send({
        _id: user.id,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg,
        bio: user.bio,
        goals: user.goals
    })
}
const changeEmail = async(req, res) =>{
    const {email, password} = req.body;
    
    if(!validateEmail(email)) throw new AppError(1, 401, "Invalid Email");
    const user = await User.findOne({email})
    if(user) throw new AppError(1, 401, "User with that email already exists")
    if(req.user.googleLogin) throw new AppError(1, 401, "cannot change email of google account");
    const passwordsCheck =  await comparePassword(password, req.user.password);
    if(!passwordsCheck) throw new AppError(1003, 401, "Invalid Password");
    const newUser = await User.findByIdAndUpdate(req.user.id, {email}, {new: true});

    return res.send(newUser)
}
const editUser = async(req, res) =>{
    const { name,  bio} = req.body;
    const newUser = await User.findByIdAndUpdate(req.user.id, {name, bio}, {new: true})
    return res.send(newUser)
}
const arrayToOids =  (array: string[]) =>{
    return array.map(str => new ObjectId(str))
}
const getUsers = async(req, res) =>{
    let {search, index, offset, filter: flt} = req.query;
    if(!index) index = 0;
    if(!offset) offset = 20;
    console.log("get users query: ", req.query);
    let filter: any = {
        _id: {$ne: req.user._id}
    };
    if(flt === "followers"){
        filter._id = {$in: arrayToOids(req.user.followers)}
    }else if(flt === "following"){
        filter._id = {$in: arrayToOids(req.user.following)}
    }

    if(search){
        filter.name =  { $regex: "(?i)^" + search }

        
    }
    console.log(filter)
    const users = await User.find(filter).skip(index * offset).limit(offset);
    return res.send(users)
}
const updateUser = async(req, res) =>{

}
const getNotifications = async(req: ProtectedReq<{},{} ,{} , {timestamp: number}>, res) =>{
    console.log(req.query)
    let timestamp: number;
    if(typeof req.query.timestamp == 'string' ) timestamp = parseInt(req.query.timestamp, 10);
    //console.log({timestamp}, req.query)
    const date = new Date(timestamp);
    date.setHours(0,0,0,0);

    
    const user = await deleteOldNotifications(req.user.id, timestamp );
    res.send(user.notifications)


}
const readNotifications = async(req: ProtectedReq, res) =>{
    console.log(req.body)
    const {ids} = req.body;
    const newNotifications = req.user.notifications.map(not =>{
        console.log({_id: not._id, ids})
        if(ids.includes(not._id.toString())){
            console.log("changing read status");
            not.status = 'read';
        }
        return not
    })
    console.log({newNotifications});
    const user = await User.findByIdAndUpdate(req.user.id, {notifications: newNotifications }, {new: true});
    res.send(user.notifications)

}
// const profileImgUpload = async(req, res) =>{
//     const fileId = await saveFile(req.files.image);
//     if(req.user.profileImg) deleteFile(req.user.profileImg);
//     const user = await User.findByIdAndUpdate(req.user.id,{
//         profileImg: fileId
//     },{new: true})
//     console.log("profile image updated",{ user})
//     res.send(fileId)
// }
const deleteAccountRequest = async(req, res) =>{
    const token = createRandomToken();
    const user = await User.findByIdAndUpdate(req.user.id, {deletionToken: token});
    const link = `${process.env.CLIENT_URL}/delete-account/${req.user.id}/${token}`;
    await sendMail({
        to: req.user.email, 
        subject: "Confirm Account Deletion", 
        body: `
            Do you want to delete permanently your account?\n 
            the action is irreversible: <a href="${link}">confirm</>`
    })
    res.send({message: "we sent you a confirmation email"})
}
const deleteAccount = async(req, res) =>{
    const {id, token} = req.body;
    if(!isValidObjectId(id)) throw new AppError(1, 401, "invalid id");
    const user = await User.findById(id);
    if(!user) throw new AppError(1, 401, "invalid id");
    if(user.deletionToken !== token) throw new AppError(1, 401, "invalid token");
    const deletedUser = await deleteUser(id);
    res.send(deletedUser)
}
const logout = async(req, res) =>{
    console.log("logging out");
    const user = await logoutUser(req.user, req.token);
    res.send({msg: "Successfully logged out!"});
}
export {
    register,
    resetPassword,
    verifyResetPassword,
    deleteAccount,
    deleteAccountRequest,
    deleteUser,
    getUser,
    getUsers,
    login,
    logout,
    logoutUser,
    verify,
    profileImgUpload,
    googleLogin,
    changeEmail,
    editUser,
    getNotifications,
    readNotifications
}