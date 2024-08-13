import { z } from 'zod';

export const NumericString = z.string().transform((val, ctx) => {
  const parseNumber = parseInt(val, 10);
  if (isNaN(parseNumber)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Not a number',
    });
    return z.NEVER;
  }
  return parseNumber;
});
