import path from "path"

// Error.stackTraceLimit = 1;
// Error.prepareStackTrace = (_, callSites) => {
//     console.log(_)
//     let stack = []
//     callSites.forEach(call => {
//         stack.push({
//             file: path.basename(call.getFileName()),
//             function: call.getFunctionName(),
//             line: call.getLineNumber(),
//             path: call.getFileName(),
//         })
//         console.log(call.getFileName())
//     })
//     return stack
// }
class AppError extends Error {
        public errorCode: number;
        public statusCode: number;
        public message: string;
        constructor(errorCode: number, statusCode: number, message:string){
            super(message)
            this.errorCode = errorCode,
            this.statusCode = statusCode,
            this.message = message
        }
    }
export default AppError