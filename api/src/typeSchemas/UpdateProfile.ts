import { inputObjectType } from 'nexus';

export let UpdateProfile = inputObjectType({
  name: 'UpdateProfile',
  definition(t) {
    t.nullable.string('name');
    t.nullable.string('title');
    t.nullable.int('primaryGroupId');
  },
});
