import { objectType } from 'nexus';

export const PostRaw = objectType({
  name: 'PostRaw',
  definition: (t) => {
    t.string('raw');
    t.string('markdownContent');
    t.list.string('mentions');
  },
});
