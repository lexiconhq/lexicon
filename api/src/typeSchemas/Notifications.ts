import { objectType } from '@nexus/schema';

export let Notifications = objectType({
  name: 'Notifications',
  definition(t) {
    t.field('notifications', {
      type: 'NotificationDetail',
      list: true,
      nullable: true,
    });
    t.int('totalRowsNotifications', { nullable: true });
    t.int('seenNotificationId', { nullable: true });
    t.string('loadMoreNotifications', { nullable: true });
  },
});
