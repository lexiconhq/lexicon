export const ERROR_HANDLED_BY_LINK = 'handledByErrorLink';
export const errorTypes = {
  sessionExpired: 'Session Expired',
  unauthorizedAccess: 'Authorization Failed',
  incorrectCredentials: 'incorrect username, email or password',
};

/**
 * Below are the error messages that are displayed to the user.
 */
export const ERROR_PAGINATION =
  'Something unexpected happened when loading items. If this persists, please contact support.';

export const ERROR_PRIVATE_POST = {
  title: 'Private Post',
  content: `We're sorry, but you don't have permission to access this private post.`,
};

export const ERROR_SETUP_PUSH_NOTIFICATIONS = {
  title: 'Something went wrong',
  content: 'Failed to setup push notifications',
};
export const ERROR_REFETCH =
  'Something went wrong when logging out. If this persists, please contact support.';

export const ERROR_MESSAGE_INVALID_ACCESS = {
  title: 'Permission Denied',
  content: `It looks like you don't have permission to check out this message.`,
};
