import { inputObjectType } from '@nexus/schema';

export let EditPostInput = inputObjectType({
  name: 'EditPostInput',
  definition(t) {
    t.string('raw', { required: true });
    t.string('rawOld');
    t.string('editReason', { nullable: true });
  },
});
