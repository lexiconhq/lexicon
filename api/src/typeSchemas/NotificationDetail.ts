import { objectType } from '@nexus/schema';

export let NotificationDetail = objectType({
  name: 'NotificationDetail',
  definition(t) {
    t.int('id');
    t.int('notificationType', { nullable: true });
    t.boolean('read');
    t.string('createdAt');
    t.int('postNumber', { nullable: true });
    t.int('topicId', { nullable: true });
    t.string('fancyTitle', { nullable: true });
    t.string('slug');
    t.field('data', { type: 'NotificationDataType' });
  },
});
