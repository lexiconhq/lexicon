import { RestLink } from 'apollo-link-rest';

export const userUnreadNotificationsPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  return {
    __typename: 'UserUnreadNotifications',
    isThereUnreadNotifications: !!data.notifications?.length,
  };
};
