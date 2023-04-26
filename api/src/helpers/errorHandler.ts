import { AxiosError } from 'axios';

import { ChangeUsernameError, EditPostError, errorTypes } from '../constants';

import { AuthorizationError, SessionExpiredError } from './customErrors';

export function errorHandler(unknownError: unknown) {
  const e = unknownError as AxiosError;
  let status = e.response?.status;
  let errors = e.response?.data?.errors;
  let errorType = e.response?.data?.error_type;
  let failed = e.response?.data?.failed;
  let cookie = e.response?.config.headers.Cookie;

  if (errors) {
    if (errors[0] === EditPostError) {
      throw new Error("You've passed the time limit to edit this post.");
    }
    if (Array.isArray(errors) && errors[0] === ChangeUsernameError) {
      throw new Error('This username is already taken');
    }
    const { invalidAccess, unauthenticatedAccess } = errorTypes;
    if (errorType === unauthenticatedAccess || errorType === invalidAccess) {
      // If the token was provided and we encountered one of these errors, it means the token was invalid
      if (cookie?.includes('_t=')) {
        throw new SessionExpiredError();
      }
      throw new AuthorizationError();
    }
    throw new Error(errors);
  }
  if (failed) {
    // For failed example: trying to delete primaryEmail
    throw new Error(failed);
  }
  if (status === 403) {
    // For bad csrf
    throw new Error(e.response?.data);
  }
  if (status === 413) {
    //for uncompatible image size
    throw new Error(
      'The file size of your image exceeds the maximum allowed file size.',
    );
  }
  throw new Error(e.message);
}
