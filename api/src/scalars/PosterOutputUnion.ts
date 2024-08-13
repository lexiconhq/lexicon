import { unionType } from 'nexus';

export let PosterOutputUnion = unionType({
  name: 'PosterOutputUnion',
  definition(t) {
    t.members('TopicPosterNewUnion', 'SuggestionTopicPoster');
  },
  resolveType: (item) => {
    if (item.hasOwnProperty('userId')) {
      return 'TopicPosterNewUnion';
    }
    return 'SuggestionTopicPoster';
  },
});
