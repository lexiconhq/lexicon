import { objectType, unionType } from '@nexus/schema';

export const UnknownNotification = objectType({
  // This will handle if notif data are unknown
  name: 'UnknownNotification',
  definition(t) {
    t.string('text', { nullable: true });
  },
});

export let NotificationDataType = unionType({
  name: 'NotificationDataType',
  definition(t) {
    t.members(
      'BadgeNotification',
      'ActionPostNotification',
      'AdminMessageNotification',
      'AdminMessageInvitation',
      'InviteeAccept',
      'UnknownNotification',
    );
    t.resolveType((item) => {
      switch (true) {
        case item.hasOwnProperty('badgeId'):
          return 'BadgeNotification';
        case item.hasOwnProperty('originalPostId'):
          return 'ActionPostNotification';
        case item.hasOwnProperty('groupId'):
          return 'AdminMessageNotification';
        case item.hasOwnProperty('topicTitle'):
          return 'AdminMessageInvitation';
        case item.hasOwnProperty('displayUsername'):
          return 'InviteeAccept';
        default:
          return 'UnknownNotification';
      }
    });
  },
});
