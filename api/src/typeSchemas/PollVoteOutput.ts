import { objectType } from 'nexus';

export let PollVoteOutput = objectType({
  name: 'PollVoteOutput',
  definition(t) {
    t.field('poll', { type: 'Poll' });
    t.nullable.list.string('vote');
  },
});
