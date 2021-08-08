import { objectType } from '@nexus/schema';

export let ActionPostNotification = objectType({
  name: 'ActionPostNotification',
  definition(t) {
    t.string('topicTitle');
    t.int('originalPostId');
    t.int('originalPostType', { nullable: true });
    t.string('originalUsername');
    t.int('revisionNumber', { nullable: true });
    t.string('displayUsername');
    t.string('count', { nullable: true });
  },
});
