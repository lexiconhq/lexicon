import { objectType } from 'nexus';

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
    t.nullable.string('title');
    t.nullable.boolean('grantTrustLevel');
    t.nullable.string('flairUrl');
    t.nullable.string('flairBgColor');
    t.nullable.string('bioCooked');
    t.nullable.string('flairColor');
    t.nullable.string('bioExcerpt');
    t.boolean('publicAdmission');
    t.boolean('publicExit');
    t.boolean('allowMembershipRequests');
    t.nullable.string('fullName');
    t.int('defaultNotificationLevel');
    t.nullable.string('membershipRequestTemplate');
    t.int('membersVisibilityLevel');
    t.boolean('canSeeMembers');
    t.boolean('publishReadState');
    t.nullable.boolean('hasMessages');
  },
});
