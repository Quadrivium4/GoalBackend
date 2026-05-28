function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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
import dotenv from "dotenv";
dotenv.config();
var stravaOAuthTokenUrl = "https://www.strava.com/oauth/token";
var stravaSubscriptionUrl = "https://www.strava.com/api/v3/push_subscriptions";
var exchangeCodeForTokensStrava = function(code) {
    return _async_to_generator(function() {
        var url, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, key, value, res, refresh_token, access_token, expires_at, athlete;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = new URL(stravaOAuthTokenUrl);
                    params = {
                        client_id: process.env.STRAVA_CLIENT_ID,
                        client_secret: process.env.STRAVA_CLIENT_SECRET,
                        grant_type: "authorization_code",
                        code: code
                    };
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = Object.entries(params)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
                            url.searchParams.append(key, value);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    return [
                        4,
                        fetch(url, {
                            method: "POST"
                        }).then(function(res) {
                            return res.json();
                        })
                    ];
                case 1:
                    res = _state.sent();
                    console.log(res);
                    refresh_token = res.refresh_token, access_token = res.access_token, expires_at = res.expires_at, athlete = res.athlete;
                    return [
                        2,
                        {
                            accessToken: access_token,
                            refreshToken: refresh_token,
                            expirationDate: expires_at,
                            athleteId: athlete
                        }
                    ];
            }
        });
    })();
};
var createStravaWebhookSubscription = function() {
    return _async_to_generator(function() {
        var alreadySubscribed, url, form, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, key, value, res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        checkStravaSubscription()
                    ];
                case 1:
                    alreadySubscribed = _state.sent();
                    if (alreadySubscribed) return [
                        2
                    ];
                    url = new URL(stravaSubscriptionUrl);
                    form = new URLSearchParams();
                    params = {
                        client_id: process.env.STRAVA_CLIENT_ID,
                        client_secret: process.env.STRAVA_CLIENT_SECRET,
                        callback_url: process.env.API_PRODUCTION_URL + "/strava-webhooks",
                        verify_token: process.env.STRAVA_VERIFY_TOKEN
                    };
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = Object.entries(params)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
                            form.append(key, value);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    console.log(form, params);
                    return [
                        4,
                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: form
                        }).then(function(res) {
                            return res.json();
                        })
                    ];
                case 2:
                    res = _state.sent();
                    console.log("Strava subscription created...", res);
                    return [
                        2
                    ];
            }
        });
    })();
};
var checkStravaSubscription = function() {
    return _async_to_generator(function() {
        var url, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, key, value, res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = new URL(stravaSubscriptionUrl);
                    params = {
                        client_id: process.env.STRAVA_CLIENT_ID,
                        client_secret: process.env.STRAVA_CLIENT_SECRET
                    };
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = Object.entries(params)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
                            url.searchParams.append(key, value);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    return [
                        4,
                        fetch(url, {
                            method: "GET"
                        }).then(function(res) {
                            return res.json();
                        })
                    ];
                case 1:
                    res = _state.sent();
                    console.log("Strava subscriptions:", res);
                    if (res.length > 0) return [
                        2,
                        true
                    ];
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
};
export { exchangeCodeForTokensStrava, createStravaWebhookSubscription };
