import { unionType } from 'nexus';

export let PosterOutputUnion = unionType({
  name: 'PosterOutputUnion',
  definition(t) {
    t.members('TopicPoster', 'SuggestionTopicPoster');
  },
  resolveType: (item) => {
    if (item.hasOwnProperty('userId')) {
      return 'TopicPoster';
    }
    return 'SuggestionTopicPoster';
  },
});
