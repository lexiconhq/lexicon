import { objectType } from 'nexus';

export let NotificationDetail = objectType({
  name: 'NotificationDetail',
  definition(t) {
    t.int('id');
    t.nullable.int('notificationType');
    t.boolean('read');
    t.string('createdAt');
    t.nullable.int('postNumber');
    t.nullable.int('topicId');
    t.nullable.string('fancyTitle');
    t.string('slug');
    t.field('data', { type: 'NotificationDataType' });
  },
});
