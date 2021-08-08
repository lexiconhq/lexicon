import { objectType } from '@nexus/schema';

export let ActionSummary = objectType({
  name: 'ActionSummary',
  definition(t) {
    t.int('id');
    t.boolean('hidden', { nullable: true });
    t.int('count', { nullable: true });
    t.boolean('canAct', { nullable: true });
    t.boolean('acted', { nullable: true });
    t.boolean('canUndo', { nullable: true });
  },
});
