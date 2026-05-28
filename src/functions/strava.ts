import dotenv from "dotenv"; 
dotenv.config()
import { TStravaTokens } from "../models/user.js";

const stravaOAuthTokenUrl = "https://www.strava.com/oauth/token";
const stravaSubscriptionUrl = "https://www.strava.com/api/v3/push_subscriptions";
const exchangeCodeForTokensStrava = async (code: string):Promise<TStravaTokens> =>{
    const url = new URL(stravaOAuthTokenUrl);
    const params = {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            grant_type: "authorization_code",
            code
    }
    for(const [key, value] of Object.entries(params)){
        url.searchParams.append(key, value);
    }
    
    let res = await fetch(url, {
        method: "POST"
    }).then(res =>res.json());
    console.log(res);
    const {refresh_token, access_token, expires_at, athlete} = res;
    
    return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expirationDate: expires_at,
        athleteId: athlete
    }
}
const createStravaWebhookSubscription = async() =>{
    let alreadySubscribed = await checkStravaSubscription();
    if(alreadySubscribed) return;
    const url = new URL(stravaSubscriptionUrl);
    const form = new URLSearchParams()
    const params = {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            callback_url: process.env.API_PRODUCTION_URL + "/strava-webhooks",
            verify_token: process.env.STRAVA_VERIFY_TOKEN
    }
    for(const [key, value] of Object.entries(params)){
        form.append(key, value);
    }
    console.log(form, params);
    let res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form
    }).then(res =>res.json());
    console.log("Strava subscription created...", res)

}
const checkStravaSubscription = async() =>{
    const url = new URL(stravaSubscriptionUrl);
    const params = {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
    }
    for(const [key, value] of Object.entries(params)){
        url.searchParams.append(key, value);
    }
    let res = await fetch(url, {
        method: "GET",
    }).then(res =>res.json());
    console.log("Strava subscriptions:", res);
    if(res.length > 0) return true
    return false
}

export {
    exchangeCodeForTokensStrava,
    createStravaWebhookSubscription
}