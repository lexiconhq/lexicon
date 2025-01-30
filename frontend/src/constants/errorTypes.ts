export const ERROR_HANDLED_BY_LINK = 'handledByErrorLink';
export const errorTypes = {
  sessionExpired: 'Session Expired',
  unauthorizedAccess: 'Authorization Failed',
  incorrectCredentials: 'incorrect username, email or password',
  invalidAccess: 'Invalid Access',
  invalidAccessApi: 'invalid_access',
};

export const ERROR_413 =
  'The file size of your image exceeds the maximum allowed file size.';
/**
 * Below are the error messages that are displayed to the user.
 */
export const ERROR_PAGINATION = t(
  'Something unexpected happened when loading items. If this persists, please contact support.',
);

export const ERROR_PRIVATE_POST = {
  title: t('Private Post'),
  content: t(
    "We're sorry, but you don't have permission to access this private post.",
  ),
};

export const ERROR_SETUP_PUSH_NOTIFICATIONS = {
  title: t('Something went wrong'),
  content: t('Failed to setup push notifications'),
};
export const ERROR_REFETCH = t(
  'Something went wrong when logging out. If this persists, please contact support.',
);

export const ERROR_MESSAGE_INVALID_ACCESS = {
  title: t('Permission Denied'),
  content: t(
    "It looks like you don't have permission to check out this message.",
  ),
};

export const ERROR_UNEXPECTED = t('Something went wrong please try again.');
