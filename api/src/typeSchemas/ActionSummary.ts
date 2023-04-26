import { objectType } from 'nexus';

export let ActionSummary = objectType({
  name: 'ActionSummary',
  definition(t) {
    t.int('id');
    t.nullable.boolean('hidden');
    t.nullable.int('count');
    t.nullable.boolean('canAct');
    t.nullable.boolean('acted');
    t.nullable.boolean('canUndo');
  },
});
