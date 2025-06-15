import { Request, Response, NextFunction } from "express";
const DEFAULT_MESSAGE = '"Internal Server Error"';

export const errorHandler = (
  err: { status?: number; message?: string; details?: any },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || DEFAULT_MESSAGE;

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details && { details: err.details }),
  });
};
