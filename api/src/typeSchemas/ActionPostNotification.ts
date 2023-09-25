import { objectType } from 'nexus';

export let ActionPostNotification = objectType({
  name: 'ActionPostNotification',
  definition(t) {
    t.string('topicTitle');
    t.int('originalPostId');
    t.nullable.int('originalPostType');
    t.string('originalUsername');
    t.nullable.int('revisionNumber');
    t.string('displayUsername');
    t.nullable.string('count');
  },
});
