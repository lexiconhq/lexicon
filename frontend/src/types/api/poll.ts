import { z } from 'zod';

const PollOption = z.object({
  id: z.string(),
  html: z.string(),
  votes: z.number(),
});
export type PollOption = z.infer<typeof PollOption>;

const PreloadedVotersUser = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  avatarTemplate: z.string(),
  title: z.optional(z.nullable(z.string())),
});

const PreloadedVoters = z.record(z.array(PreloadedVotersUser));
const PreloadedVotersNumber = z.array(PreloadedVotersUser);
const PreloaderUnion = z.union([PreloadedVoters, PreloadedVotersNumber]);
export type PreloaderUnion = z.infer<typeof PreloaderUnion>;

export const PollsVotes = z.record(z.string(), z.array(z.string()));
export type PollsVotes = z.infer<typeof PollsVotes>;

export const POLL_TYPE = ['regular', 'multiple', 'number'] as const;
export const POLL_RESULTS = ['always', 'on_vote', 'on_close'] as const;
export const POLL_STATUS = ['open', 'closed'] as const;
export const POLL_CHART_TYPE = ['bar', 'pie'] as const;

export const Poll = z.object({
  name: z.string(),
  type: z.enum(POLL_TYPE),
  status: z.enum(POLL_STATUS),
  public: z.boolean(),
  results: z.enum(POLL_RESULTS),
  options: z.array(PollOption),
  voters: z.number(),
  preloadedVoters: PreloaderUnion,
  chartType: z.enum(POLL_CHART_TYPE),
  groups: z.optional(z.nullable(z.string())),
  title: z.optional(z.nullable(z.string())),
  close: z.optional(z.nullable(z.string())),
  min: z.optional(z.nullable(z.number())),
  max: z.optional(z.nullable(z.number())),
  step: z.optional(z.nullable(z.number())),
});
export type Poll = z.infer<typeof Poll>;
