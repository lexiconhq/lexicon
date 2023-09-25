import { objectType } from 'nexus';

export let AdminMessageNotification = objectType({
  name: 'AdminMessageNotification',
  definition(t) {
    t.int('groupId');
    t.string('groupName');
    t.int('inboxCount');
    t.string('username');
  },
});
