import { objectType } from '@nexus/schema';

export let LinkCount = objectType({
  name: 'LinkCount',
  definition(t) {
    t.int('clicks');
    t.boolean('internal');
    t.boolean('reflection');
    t.string('url');
  },
});
