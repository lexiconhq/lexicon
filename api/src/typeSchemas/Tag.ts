import { objectType } from '@nexus/schema';

export let Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.int('count');
    t.string('id');
    t.int('pmCount');
    t.boolean('targetTag', { nullable: true });
    t.string('text');
  },
});
