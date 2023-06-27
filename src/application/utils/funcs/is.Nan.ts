import { Errors } from '../handle.error';
export function errorIfNan(...ids: string[]) {
  ids.forEach((el) => {
    if (isNaN(+el)) throw new Errors.NOT_FOUND();
  });
}
