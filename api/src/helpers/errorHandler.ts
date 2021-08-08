import { AxiosError } from 'axios';

import { ChangeUsernameError, EditPostError } from '../constants';

export function errorHandler(e: AxiosError) {
  let status = e.response?.status;
  let errors = e.response?.data?.errors;
  let failed = e.response?.data?.failed;

  if (errors) {
    if (errors === EditPostError) {
      throw new Error(
        'This post can no longer be edited because it was created more than 30 days ago.',
      );
    }
    if (Array.isArray(errors) && errors[0] === ChangeUsernameError) {
      throw new Error('This username is already taken');
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
