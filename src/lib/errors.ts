import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export class HttpError extends Error {
  status?: number;
  message: string;
  constructor(message: string, status?: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export function catchErrors(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((err: any) => {
      console.log('catching async function');
      return next(err);
    });
  };
}

function validationErrorFormatter(error: ValidationError) {
  const formattedError = {
    status: 400,
    message: `Error: ${error.param} field ${error.msg}`,
  };
  return formattedError;
}

export function handleValidationsErrors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validationErrors = validationResult(req).formatWith(
    validationErrorFormatter
  );
  if (validationErrors.isEmpty()) return next();
  console.log('there are validation errors');

  res.status(400).json({
    error: validationErrors.array()[0],
  });
}

export function handleErrors(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('running final error handler');
  console.log(error);
  const errorDetails = {
    message: error.message,
    status: error.status || 500,
  };
  res.status(errorDetails.status).json({ error: errorDetails });
}
