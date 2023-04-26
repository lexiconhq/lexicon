import { objectType } from 'nexus';

export let Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.int('count');
    t.string('id');
    t.int('pmCount');
    t.nullable.boolean('targetTag');
    t.string('text');
  },
});
