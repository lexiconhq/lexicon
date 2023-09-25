import { objectType } from 'nexus';

export let PostStream = objectType({
  name: 'PostStream',
  definition(t) {
    t.list.field('posts', { type: 'Post' });
    t.nullable.list.int('stream');
    t.nullable.field('firstPost', { type: 'Post' });
  },
});
