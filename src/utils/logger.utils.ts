import winston from "winston";
import { LogLevel } from "./logger.types";
import { levels } from "../constant/logger.constant";

export const logger = winston.createLogger({
  level: "info",
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export const log = (level: LogLevel, message: string, meta: unknown = {}) => {
  const hasValidlevel = levels.includes(level);

  if (hasValidlevel)
    return meta ? logger.log(level, message, meta) : logger.log(level, message);

  throw new Error(`Invalid log level: ${level}`);
};
