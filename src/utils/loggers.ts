import {pino} from "pino";
import {pinoHttp} from "pino-http";

export const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss"
        }
    }
})
export const httpLogger = pinoHttp({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss"
        }
    }
})


