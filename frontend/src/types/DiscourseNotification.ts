import { z } from 'zod';

import { NumericString } from './NumericString';

export const DiscourseNotificationData = z.object({
  type: NumericString,
  discourse_url: z.string(),
  is_pm: z.boolean(),
});
