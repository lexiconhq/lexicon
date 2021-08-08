import { inputObjectType } from '@nexus/schema';

export let UpdateProfile = inputObjectType({
  name: 'UpdateProfile',
  definition(t) {
    t.string('name');
    t.string('title', { nullable: true });
    t.int('primaryGroupId', { nullable: true });
  },
});
