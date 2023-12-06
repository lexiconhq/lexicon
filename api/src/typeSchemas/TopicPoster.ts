import { objectType } from 'nexus';

export let TopicPoster = objectType({
  name: 'TopicPoster',
  definition(t) {
    t.nullable.string('extras');
    t.string('description');
    t.int('userId');
    t.field('user', { type: 'UserIcon' });
  },
});

export let SuggestionTopicPoster = objectType({
  name: 'SuggestionTopicPoster',
  definition(t) {
    t.nullable.string('extras');
    t.string('description');
    t.field('user', { type: 'UserIcon' });
  },
});
