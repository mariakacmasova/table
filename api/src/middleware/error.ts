import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';
import {
  ApiError, SERVER_ERROR, BAD_REQUEST, ErrorStatusCode, VALIDATION_FAILED, NOT_FOUND
} from '../utils/errors';
import logger from 'npmlog';

export default async function errorHandler(err, req, res, next) {
  let error: ApiError = err;
  let status = 500;
  if (err instanceof ApiError) {
    status = ErrorStatusCode[err.code] || 400;
  } else if (err instanceof QueryFailedError) {
    error = new ApiError(BAD_REQUEST, {
      message: err.message,
    });
  } else if (err instanceof EntityNotFoundError) {
    status = ErrorStatusCode[NOT_FOUND];
    error = new ApiError(NOT_FOUND, {
      message: err.message,
    });
  } else if (err instanceof Array && err[0] instanceof ValidationError) {
    status = ErrorStatusCode[VALIDATION_FAILED];
    error = new ApiError(VALIDATION_FAILED, {
      message: JSON.stringify(err),
    });
  } else {
    error = new ApiError(SERVER_ERROR, { 
      message: err.message 
    });
  }
  logger.error(`${status}: ${error}`);
  res.status(status);
  res.send(error);
}
