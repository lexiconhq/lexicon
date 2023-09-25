import { unionType } from 'nexus';

export const LikeOutputUnion = unionType({
  name: 'LikeOutputUnion',
  definition(t) {
    t.members('LikedTopic', 'Post');
  },
  resolveType: (item) => {
    return item.hasOwnProperty('actionsSummary') ? 'Post' : 'LikedTopic';
  },
});
