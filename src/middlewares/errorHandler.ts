import AppError from "../utils/appError.js";
const CONSOLE_COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underline: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m"
    }



}
function logger([...msg], options:any = {}) {
    let color = options.color || "white";
    let background = options.background || "black";
    let underline = options.underline ? CONSOLE_COLORS.underline : "";
    msg.forEach(message => {
        if (typeof message === "string")
            console.log(CONSOLE_COLORS.fg[color] +
                CONSOLE_COLORS.bg[background] +
                underline +
                message +
                "\x1b[0m")
        else {
            console.log(message)
        }
    })

}
const errorHandler = async (err, req, res, next) => {
    console.log("error handler")
    if (err instanceof AppError) {
        //console.log("My Error", err.stack)
        logger(["---- Is Not Your Fault ----", {
            type: err.constructor.name,
            statusCode: err.statusCode,
            errorCode: err.errorCode,
            message: err.message,
            location: err.stack
        }], {
            background: "red",
        })
        return res.status(err.statusCode).send({
            message: err.message,
            errorCode: err.errorCode
        });
    }

    logger(["---- You Are Stupid ----", {
        type: err.constructor.name,
        message: err.message,
        location: err.stack
    }], {
        background: "red",
    })
    //await sendMail("Your Programmer Is Stupid, please contact him to fix the bug!", "miguelgiacobbe@gmail.com", "Server Crashed")
    res.status(500).send("Something went wrong!");
    process.exit(1);
}
export default errorHandler