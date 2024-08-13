import { objectType } from 'nexus';

/**
 * Deprecated type TopicPoster
 * Which will Union for topic poster
 */

export let TopicPoster = objectType({
  name: 'TopicPoster',
  definition(t) {
    t.nullable.string('extras');
    t.string('description');
    t.nullable.int('userId');
    t.nullable.field('user', { type: 'UserIcon' });
  },
});

export let TopicPosterNewUnion = objectType({
  name: 'TopicPosterNewUnion',
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
