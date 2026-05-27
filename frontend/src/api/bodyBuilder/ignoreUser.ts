import { RestLink } from 'apollo-link-rest';

import {
  DISCOURSE_IGNORE_NOTIFICATION_LEVEL,
  discourseIgnoreExpiringAt,
} from '../../helpers/blockedUsers';

type IgnoreUserBodyArgs = {
  ignoreUserInput: {
    notification_level: string;
    expiring_at?: string;
  };
};

export function ignoreUserBodyBuilder({
  args,
}: RestLink.RestLinkHelperProps<IgnoreUserBodyArgs>) {
  const { notification_level, expiring_at } = args.ignoreUserInput;

  if (notification_level === DISCOURSE_IGNORE_NOTIFICATION_LEVEL) {
    return {
      notification_level,
      expiring_at: expiring_at ?? discourseIgnoreExpiringAt(),
    };
  }

  return {
    notification_level,
  };
}
