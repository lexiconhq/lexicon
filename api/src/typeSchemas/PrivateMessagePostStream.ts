import { objectType } from 'nexus';

export let PrivateMessagePostStream = objectType({
  name: 'PrivateMessagePostStream',
  definition(t) {
    t.list.field('posts', { type: 'Post' });
    t.nullable.list.int('stream');
  },
});
