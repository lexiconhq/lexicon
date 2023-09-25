import { objectType } from 'nexus';

export let BookmarkOutput = objectType({
  name: 'BookmarkOutput',
  definition(t) {
    t.string('success');
    t.int('id');
  },
});
