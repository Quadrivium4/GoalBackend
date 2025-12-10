import dotenv  from "dotenv";
import  User from "../models/user.js";
import { extractBearerToken } from "../utils.js"
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const verifyToken = async(req, res, next) =>{
    const token = extractBearerToken(req);
    if(!token) throw new AppError(1, 403, "Invalid Token");
    console.log({token})
    try {
        const {id, email}= jwt.verify(token, process.env.JWT_A_TOKEN_KEY) as  {id: string, email: string} ;
        console.log({id, email});
        const user = await User.findById(id);
        if (!user) throw new AppError(1, 403, "Invalid Token");
        req.user = user;
        req.token = token;
    } catch (error) {
        throw new AppError(1, 403, "Invalid Token");
    }

    next();
}
export default verifyToken;