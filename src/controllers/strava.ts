import { exchangeCodeForTokensStrava } from "../functions/strava.js";
import User from "../models/user.js";
import { ProtectedReq } from "../routes.js";

const connectStrava = async (req: ProtectedReq, res) =>{
    const {code} = req.body;
    const tokens = await exchangeCodeForTokensStrava(code);
    const user = User.findByIdAndUpdate(req.user.id,{
        strava: tokens
    },{new: true});
    res.send({user})
}
const stravaWebhookChallenge = async(req, res) =>{
     console.log("strava webhook challenge", req.query);
    if(req.query["hub.challenge"]) return res.send({"hub.challenge": req.query["hub.challenge"]});
}
const stravaWebhook = async (req, res) =>{

    console.log("activity or athlete changed", req.body);
    const {owner_id, object_type, object_id} = req.body;

}

export {
    connectStrava,
    stravaWebhook,
    stravaWebhookChallenge
}