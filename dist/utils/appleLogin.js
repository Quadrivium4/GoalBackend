function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "./appError.js";
import crypto from "crypto";
dotenv.config();
var appleUrl = 'https://appleid.apple.com';
var appleKeysUrl = appleUrl + "/auth/keys";
var getApplePublicKey = function(kid) {
    return _async_to_generator(function() {
        var keys, publicKey, i, pemKey;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch(appleKeysUrl)
                    ];
                case 1:
                    return [
                        4,
                        _state.sent().json()
                    ];
                case 2:
                    keys = _state.sent().keys;
                    console.log(keys);
                    for(i = 0; i < keys.length; i++){
                        if (keys[i].kid == kid) publicKey = keys[i];
                    }
                    if (!publicKey) throw new AppError(404, 500, "Apple key id (KID) invalid, not found in apple servers");
                    pemKey = crypto.createPublicKey({
                        key: publicKey,
                        format: "jwk"
                    });
                    console.log({
                        pemKey: pemKey
                    });
                    return [
                        2,
                        pemKey
                    ];
            }
        });
    })();
};
var generateAppleClientSecret = function() {
    var claims = {
        iss: process.env.APPLE_TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        aud: "https://appleid.apple.com",
        sub: process.env.APPLE_CLIENT_ID
    };
    var privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // Handle newlines in the private key
    var clientSecret = jwt.sign(claims, privateKey, {
        algorithm: 'ES256',
        keyid: process.env.APPLE_KEY_ID
    });
    return clientSecret;
};
var getAppleToken = function(code) {
    return _async_to_generator(function() {
        var clientSecret, payload, res, resJson, decoded;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    clientSecret = generateAppleClientSecret();
                    payload = {
                        client_id: process.env.APPLE_CLIENT_ID,
                        client_secret: clientSecret,
                        code: code,
                        grant_type: "authorization_code",
                        redirect_uri: process.env.APPLE_REDIRECT_URI
                    };
                    return [
                        4,
                        fetch("https://appleid.apple.com/auth/token", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        })
                    ];
                case 1:
                    res = _state.sent();
                    return [
                        4,
                        res.json()
                    ];
                case 2:
                    resJson = _state.sent();
                    console.log("Apple token response", resJson);
                    decoded = jwt.decode(resJson.id_token);
                    console.log("Decoded Apple ID token", decoded);
                    return [
                        2,
                        decoded
                    ];
            }
        });
    })();
};
export { getAppleToken, getApplePublicKey };
