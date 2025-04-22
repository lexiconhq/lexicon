import { z } from 'zod';

import { NumericString } from './NumericString';

export const DiscourseNotificationData = z
  .object({
    type: NumericString,
    discourse_url: z.string(),
    is_pm: z.boolean().nullable().optional(),
    is_chat: z.boolean().nullable().optional(),
    is_thread: z.boolean().nullable().optional(),
  })
  // more info https://zod.dev/?id=refine
  .refine(
    (data) =>
      (data.is_pm != null && data.is_pm !== undefined) !==
      (data.is_chat != null &&
        data.is_chat !== undefined &&
        data.is_thread != null &&
        data.is_thread !== undefined),
    {
      message:
        "If 'is_pm' is set, 'is_chat' and 'is_thread' must be null or undefined, and vice versa.",
    },
  );
