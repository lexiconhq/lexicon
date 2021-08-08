import { objectType } from '@nexus/schema';

export let MessageParticipant = objectType({
  name: 'MessageParticipant',
  definition(t) {
    t.int('userId');
    t.string('extras', { nullable: true });
    t.string('description', { nullable: true });
    t.int('primaryGroupid', { nullable: true });
  },
});
