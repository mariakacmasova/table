import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiError, VALIDATION_FAILED } from '../utils/errors';

type Constructor<T> = {new(): T};

export function validate<T extends object>(type: Constructor<T>, body: any): T {
  const validator = new Validator();
  const input = plainToClass(type, body);
  const errors = validator.validateSync(input);
  if (errors.length > 0) {
    throw new ApiError(VALIDATION_FAILED, { message: `request body is incorrect`, errors });
  }
  return input;
}