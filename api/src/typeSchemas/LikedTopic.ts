import { objectType } from 'nexus';

export let LikedTopic = objectType({
  name: 'LikedTopic',
  definition(t) {
    t.int('id');
    t.int('postId');
    t.int('topicId');
    t.int('likeCount');
    t.boolean('liked');
  },
});
