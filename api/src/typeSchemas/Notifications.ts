import { objectType } from 'nexus';

export let Notifications = objectType({
  name: 'Notifications',
  definition(t) {
    t.nullable.list.field('notifications', {
      type: 'NotificationDetail',
    });
    t.nullable.int('totalRowsNotifications');
    t.nullable.int('seenNotificationId');
    t.nullable.string('loadMoreNotifications');
  },
});
