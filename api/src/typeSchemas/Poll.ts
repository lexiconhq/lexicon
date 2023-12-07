import { objectType } from 'nexus';

import { BaseUserIcon } from './UserIcon';

export let Poll = objectType({
  name: 'Poll',
  definition(t) {
    t.string('name');
    t.field('type', { type: 'PollType' });
    t.field('status', { type: 'PollStatus' });
    t.field('results', { type: 'PollResult' });
    t.list.field('options', { type: 'PollOption' });
    t.int('voters');
    t.field('chartType', { type: 'PollChartType' });
    t.nullable.string('title');
    t.nullable.string('groups');
    t.nullable.boolean('public');
    t.nullable.int('min');
    t.nullable.int('max');
    t.nullable.int('step');
    t.nullable.string('close');
    t.nullable.list.field('preloadedVoters', {
      type: 'PreloadedVoters',
    });
  },
});

export let PreloadedVoters = objectType({
  name: 'PreloadedVoters',
  definition(t) {
    t.string('pollOptionId');
    t.list.field('users', { type: 'UserVoter' });
  },
});

export let UserVoter = objectType({
  name: 'UserVoter',
  definition(t) {
    t.implements(BaseUserIcon);
    t.nullable.string('title');
  },
});

export let PollsVotes = objectType({
  name: 'PollsVotes',
  definition(t) {
    t.string('pollName');
    t.list.string('pollOptionIds');
  },
});
