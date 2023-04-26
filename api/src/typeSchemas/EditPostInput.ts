import { inputObjectType } from 'nexus';

export let EditPostInput = inputObjectType({
  name: 'EditPostInput',
  definition(t) {
    t.string('raw');
    t.nullable.string('rawOld');
    t.nullable.string('editReason');
  },
});
