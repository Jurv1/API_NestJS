import { Errors } from '../utils/handle.error';

export const myExceptionFactory = (errors) => {
  const errorsForResponse = [];

  errors.map((el) => {
    //errorsForResponse.push({field: });
    const constraintsKeys = Object.keys(el.constraints);
    constraintsKeys.map((ckey) => {
      errorsForResponse.push({
        message: el.constraints[ckey],
        field: el.property,
      });
    });
  });
  throw new Errors.BAD_REQUEST(errorsForResponse);
};
