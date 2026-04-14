import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import AppError from "./appError.js";
import crypto from "crypto";
dotenv.config();
const appleUrl = 'https://appleid.apple.com';
const appleKeysUrl = appleUrl + "/auth/keys";

const getApplePublicKey = async (kid: string): Promise<crypto.KeyObject> =>{
    const {keys} = await (await fetch(appleKeysUrl)).json()
    console.log(keys);
    let publicKey;
    for(let i = 0; i< keys.length; i++){
        if(keys[i].kid == kid) publicKey = keys[i];
    }
    if(!publicKey) throw new AppError(404, 500, "Apple key id (KID) invalid, not found in apple servers");
    const pemKey = crypto.createPublicKey({key: publicKey, format: "jwk"});
    console.log({pemKey})
    return pemKey;
}
const generateAppleClientSecret = () => {
    const claims = {
        iss: process.env.APPLE_TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token valid for 1 hour
        aud: "https://appleid.apple.com",
        sub: process.env.APPLE_CLIENT_ID,
    };

    const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // Handle newlines in the private key

    const clientSecret = jwt.sign(claims, privateKey, {
        algorithm: 'ES256',
        keyid: process.env.APPLE_KEY_ID,
    });

    return clientSecret;
}
const getAppleToken = async (code: string) =>{
    const clientSecret = generateAppleClientSecret();
    const payload = {
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.APPLE_REDIRECT_URI
    }
    let res = await fetch("https://appleid.apple.com/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    let resJson = await res.json();
    console.log("Apple token response", resJson);
    let decoded = jwt.decode(resJson.id_token);
    console.log("Decoded Apple ID token", decoded);
    return decoded;
}
export {
    getAppleToken,
    getApplePublicKey
}