function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
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
import sendMail from "../utils/sendMail.js";
import { comparePassword, createRandomToken, createTokens, validateEmail } from "../utils.js";
import User from "../models/user.js";
import { createUnverifiedUser, createUser, verifyUser, findUser, deleteUser, logoutUser, createResetPasswordUser } from "../functions/user.js";
import { deleteFile, saveFile } from "../utils/files.js";
import { OAuth2Client } from "google-auth-library";
import AppError from "../utils/appError.js";
import { isValidObjectId } from "mongoose";
import { deleteOldNotifications } from "../functions/friends.js";
import { ObjectId } from "mongodb";
export var GOOGLE_LOGIN = "google-login";
var client = new OAuth2Client();
var register = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, name, email, password, user, link;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, name = _req_body.name, email = _req_body.email, password = _req_body.password;
                    return [
                        4,
                        createUnverifiedUser(name, email, password)
                    ];
                case 1:
                    user = _state.sent();
                    link = "".concat(process.env.CLIENT_URL, "/verify/").concat(user.id, "/").concat(user.token);
                    console.log({
                        link: link
                    });
                    return [
                        4,
                        sendMail({
                            to: user.email,
                            subject: "Confirm your email",
                            body: '<h1>Confirmation email: </h1>\n                <a href="'.concat(link, '">verify</a>')
                        })
                    ];
                case 2:
                    _state.sent();
                    res.send(user);
                    return [
                        2
                    ];
            }
        });
    })();
};
// const signInWithGoogle = async (req, res) => {
//     console.log("logging with google...")
//     const token = extractBearerToken(req);
//     if (!token) throw new AppError(1, 403, "Invalid Token");
//     const { user, aToken } = await createOrLoginUserFromGoogle(token);
//     console.log({user, aToken})
//     res.send({user, aToken});
// }
var verify = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, id, token, _ref, name, email, password, _ref1, user, aToken;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, id = _req_body.id, token = _req_body.token;
                    return [
                        4,
                        verifyUser(id, token)
                    ];
                case 1:
                    _ref = _state.sent(), name = _ref.name, email = _ref.email, password = _ref.password;
                    console.log({
                        name: name,
                        email: email,
                        password: password
                    });
                    return [
                        4,
                        createUser(name, email, password)
                    ];
                case 2:
                    _ref1 = _state.sent(), user = _ref1.user, aToken = _ref1.aToken;
                    console.log({
                        user: user,
                        aToken: aToken
                    });
                    res.send({
                        user: user,
                        aToken: aToken
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
var login = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, email, password, _ref, user, aToken;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, email = _req_body.email, password = _req_body.password;
                    return [
                        4,
                        findUser(email, password)
                    ];
                case 1:
                    _ref = _state.sent(), user = _ref.user, aToken = _ref.aToken;
                    res.send({
                        user: user,
                        aToken: aToken
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
var verifyResetPassword = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, id, token, _ref, name, email, password, user, aToken;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log("verifying reset password", req.body);
                    _req_body = req.body, id = _req_body.id, token = _req_body.token;
                    return [
                        4,
                        verifyUser(id, token)
                    ];
                case 1:
                    _ref = _state.sent(), name = _ref.name, email = _ref.email, password = _ref.password;
                    console.log({
                        name: name,
                        email: email,
                        password: password
                    });
                    return [
                        4,
                        User.findOneAndUpdate({
                            email: email
                        }, {
                            password: password
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    aToken = createTokens(user.id, email).aToken;
                    return [
                        4,
                        User.findByIdAndUpdate(user.id, {
                            tokens: _to_consumable_array(user.tokens).concat([
                                aToken
                            ])
                        }, {
                            new: true
                        })
                    ];
                case 3:
                    user = _state.sent();
                    console.log({
                        user: user,
                        aToken: aToken
                    });
                    res.send({
                        user: user,
                        aToken: aToken
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
var resetPassword = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, email, password, user, unverifiedUser, link, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log("resetting password", req.body);
                    _req_body = req.body, email = _req_body.email, password = _req_body.password;
                    return [
                        4,
                        User.findOne({
                            email: email
                        })
                    ];
                case 1:
                    user = _state.sent();
                    if (!user) throw new AppError(1002, 404, "User with that email not found");
                    return [
                        4,
                        createResetPasswordUser(user.name, user.email, password)
                    ];
                case 2:
                    unverifiedUser = _state.sent();
                    //const token = crypto.randomBytes(32).toString("hex");
                    link = "".concat(process.env.CLIENT_URL, "/verify-password/").concat(unverifiedUser.id, "/").concat(unverifiedUser.token);
                    console.log({
                        link: link
                    });
                    return [
                        4,
                        sendMail({
                            to: user.email,
                            subject: "Confirm your email",
                            body: '<h1>Confirmation email: </h1>\n                <a href="'.concat(link, '">verify</a>')
                        })
                    ];
                case 3:
                    result = _state.sent();
                    console.log(result);
                    res.send({
                        user: user,
                        result: result
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
var googleLogin = function(req, res) {
    return _async_to_generator(function() {
        var token, googleUser, payload, alreadyExistingUser, aToken, user, _ref, user1, aToken1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    //const {credential, client_id} = req.body;
                    token = req.body.token;
                    return [
                        4,
                        fetch("https://www.googleapis.com/userinfo/v2/me", {
                            headers: {
                                Authorization: "Bearer ".concat(token)
                            }
                        }).then(function(res) {
                            return res.json();
                        })
                    ];
                case 1:
                    googleUser = _state.sent();
                    console.log(googleUser);
                    if (googleUser.error) throw new AppError(1, 500, "error google");
                    //const ticket = await client.verifyIdToken({idToken: credential, audience: client_id})
                    //console.log(ticket)
                    payload = googleUser; //ticket.getPayload()
                    return [
                        4,
                        User.findOne({
                            email: payload.email
                        })
                    ];
                case 2:
                    alreadyExistingUser = _state.sent();
                    if (alreadyExistingUser && !alreadyExistingUser.googleLogin) throw new AppError(1, 401, "A user with that email, not logged with google already exists");
                    if (!(alreadyExistingUser && alreadyExistingUser.googleLogin)) return [
                        3,
                        4
                    ];
                    aToken = createTokens(alreadyExistingUser.id, alreadyExistingUser.email).aToken;
                    return [
                        4,
                        User.findByIdAndUpdate(alreadyExistingUser.id, {
                            tokens: _to_consumable_array(alreadyExistingUser.tokens).concat([
                                aToken
                            ])
                        }, {
                            new: true
                        })
                    ];
                case 3:
                    user = _state.sent();
                    return [
                        2,
                        res.send({
                            user: user,
                            aToken: aToken
                        })
                    ];
                case 4:
                    return [
                        4,
                        createUser(payload.name, payload.email, "", true)
                    ];
                case 5:
                    _ref = _state.sent(), user1 = _ref.user, aToken1 = _ref.aToken;
                    console.log({
                        user: user1,
                        aToken: aToken1
                    });
                    res.send({
                        user: user1,
                        aToken: aToken1
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
var profileImgUpload = function(req, res) {
    return _async_to_generator(function() {
        var fileId, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.files);
                    return [
                        4,
                        saveFile(req.files.image)
                    ];
                case 1:
                    fileId = _state.sent();
                    if (req.user.profileImg) deleteFile(req.user.profileImg);
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            profileImg: fileId
                        }, {
                            new: true
                        })
                    ];
                case 2:
                    user = _state.sent();
                    console.log("profile image updated", {
                        user: user
                    });
                    res.send(fileId);
                    return [
                        2
                    ];
            }
        });
    })();
};
var getUser = function(req, res) {
    return _async_to_generator(function() {
        var id, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.query.id;
                    console.log("getting user", {
                        id: id
                    });
                    if (!id) return [
                        2,
                        res.send(req.user)
                    ];
                    return [
                        4,
                        User.findById(id)
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        2,
                        res.send({
                            _id: user.id,
                            name: user.name,
                            email: user.email,
                            profileImg: user.profileImg,
                            bio: user.bio,
                            goals: user.goals
                        })
                    ];
            }
        });
    })();
};
var changeEmail = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, email, password, user, passwordsCheck, newUser;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, email = _req_body.email, password = _req_body.password;
                    if (!validateEmail(email)) throw new AppError(1, 401, "Invalid Email");
                    return [
                        4,
                        User.findOne({
                            email: email
                        })
                    ];
                case 1:
                    user = _state.sent();
                    if (user) throw new AppError(1, 401, "User with that email already exists");
                    if (req.user.googleLogin) throw new AppError(1, 401, "cannot change email of google account");
                    return [
                        4,
                        comparePassword(password, req.user.password)
                    ];
                case 2:
                    passwordsCheck = _state.sent();
                    if (!passwordsCheck) throw new AppError(1003, 401, "Invalid Password");
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            email: email
                        }, {
                            new: true
                        })
                    ];
                case 3:
                    newUser = _state.sent();
                    return [
                        2,
                        res.send(newUser)
                    ];
            }
        });
    })();
};
var editUser = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, name, bio, newUser;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, name = _req_body.name, bio = _req_body.bio;
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            name: name,
                            bio: bio
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    newUser = _state.sent();
                    return [
                        2,
                        res.send(newUser)
                    ];
            }
        });
    })();
};
var arrayToOids = function(array) {
    return array.map(function(str) {
        return new ObjectId(str);
    });
};
var getUsers = function(req, res) {
    return _async_to_generator(function() {
        var _req_query, search, index, offset, flt, filter, users;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_query = req.query, search = _req_query.search, index = _req_query.index, offset = _req_query.offset, flt = _req_query.filter;
                    if (!index) index = 0;
                    if (!offset) offset = 20;
                    console.log("get users query: ", req.query);
                    filter = {
                        _id: {
                            $ne: req.user._id
                        }
                    };
                    if (flt === "followers") {
                        filter._id = {
                            $in: arrayToOids(req.user.followers)
                        };
                    } else if (flt === "following") {
                        filter._id = {
                            $in: arrayToOids(req.user.following)
                        };
                    }
                    if (search) {
                        filter.name = {
                            $regex: "(?i)^" + search
                        };
                    }
                    console.log(filter);
                    return [
                        4,
                        User.find(filter).skip(index * offset).limit(offset)
                    ];
                case 1:
                    users = _state.sent();
                    return [
                        2,
                        res.send(users)
                    ];
            }
        });
    })();
};
var updateUser = function(req, res) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    })();
};
var getNotifications = function(req, res) {
    return _async_to_generator(function() {
        var timestamp, date, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.query);
                    if (typeof req.query.timestamp == 'string') timestamp = parseInt(req.query.timestamp, 10);
                    //console.log({timestamp}, req.query)
                    date = new Date(timestamp);
                    date.setHours(0, 0, 0, 0);
                    return [
                        4,
                        deleteOldNotifications(req.user.id, timestamp)
                    ];
                case 1:
                    user = _state.sent();
                    res.send(user.notifications);
                    return [
                        2
                    ];
            }
        });
    })();
};
var readNotifications = function(req, res) {
    return _async_to_generator(function() {
        var ids, newNotifications, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    ids = req.body.ids;
                    newNotifications = req.user.notifications.map(function(not) {
                        console.log({
                            _id: not._id,
                            ids: ids
                        });
                        if (ids.includes(not._id.toString())) {
                            console.log("changing read status");
                            not.status = 'read';
                        }
                        return not;
                    });
                    console.log({
                        newNotifications: newNotifications
                    });
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            notifications: newNotifications
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    user = _state.sent();
                    res.send(user.notifications);
                    return [
                        2
                    ];
            }
        });
    })();
};
// const profileImgUpload = async(req, res) =>{
//     const fileId = await saveFile(req.files.image);
//     if(req.user.profileImg) deleteFile(req.user.profileImg);
//     const user = await User.findByIdAndUpdate(req.user.id,{
//         profileImg: fileId
//     },{new: true})
//     console.log("profile image updated",{ user})
//     res.send(fileId)
// }
var deleteAccountRequest = function(req, res) {
    return _async_to_generator(function() {
        var token, user, link;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    token = createRandomToken();
                    return [
                        4,
                        User.findByIdAndUpdate(req.user.id, {
                            deletionToken: token
                        })
                    ];
                case 1:
                    user = _state.sent();
                    link = "".concat(process.env.CLIENT_URL, "/delete-account/").concat(req.user.id, "/").concat(token);
                    return [
                        4,
                        sendMail({
                            to: req.user.email,
                            subject: "Confirm Account Deletion",
                            body: '\n            Do you want to delete permanently your account?\n \n            the action is irreversible: <a href="'.concat(link, '">confirm</>')
                        })
                    ];
                case 2:
                    _state.sent();
                    res.send({
                        message: "we sent you a confirmation email"
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
var deleteAccount = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, id, token, user, deletedUser;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, id = _req_body.id, token = _req_body.token;
                    if (!isValidObjectId(id)) throw new AppError(1, 401, "invalid id");
                    return [
                        4,
                        User.findById(id)
                    ];
                case 1:
                    user = _state.sent();
                    if (!user) throw new AppError(1, 401, "invalid id");
                    if (user.deletionToken !== token) throw new AppError(1, 401, "invalid token");
                    return [
                        4,
                        deleteUser(id)
                    ];
                case 2:
                    deletedUser = _state.sent();
                    res.send(deletedUser);
                    return [
                        2
                    ];
            }
        });
    })();
};
var logout = function(req, res) {
    return _async_to_generator(function() {
        var user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log("logging out");
                    return [
                        4,
                        logoutUser(req.user, req.token)
                    ];
                case 1:
                    user = _state.sent();
                    res.send({
                        msg: "Successfully logged out!"
                    });
                    return [
                        2
                    ];
            }
        });
    })();
};
export { register, resetPassword, verifyResetPassword, deleteAccount, deleteAccountRequest, deleteUser, getUser, getUsers, login, logout, logoutUser, verify, profileImgUpload, googleLogin, changeEmail, editUser, getNotifications, readNotifications };
