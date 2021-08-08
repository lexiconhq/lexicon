import { objectType } from '@nexus/schema';

export let Group = objectType({
  name: 'Group',
  definition(t) {
    t.int('id');
    t.boolean('automatic');
    t.string('name');
    t.string('displayName');
    t.int('userCount');
    t.int('mentionableLevel');
    t.int('messageableLevel');
    t.int('visibilityLevel');
    t.boolean('primaryGroup');
    t.string('title', { nullable: true });
    t.boolean('grantTrustLevel', { nullable: true });
    t.string('flairUrl', { nullable: true });
    t.string('flairBgColor', { nullable: true });
    t.string('bioCooked', { nullable: true });
    t.string('flairColor', { nullable: true });
    t.string('bioExcerpt', { nullable: true });
    t.boolean('publicAdmission');
    t.boolean('publicExit');
    t.boolean('allowMembershipRequests');
    t.string('fullName', { nullable: true });
    t.int('defaultNotificationLevel');
    t.string('membershipRequestTemplate', { nullable: true });
    t.int('membersVisibilityLevel');
    t.boolean('canSeeMembers');
    t.boolean('publishReadState');
    t.boolean('hasMessages', { nullable: true });
  },
});
