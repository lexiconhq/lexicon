import { objectType } from 'nexus';

export let MessageParticipant = objectType({
  name: 'MessageParticipant',
  definition(t) {
    t.int('userId');
    t.nullable.string('extras');
    t.nullable.string('description');
    t.nullable.int('primaryGroupid');
  },
});
