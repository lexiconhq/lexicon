import { objectType } from 'nexus';

export let AssociatedAccounts = objectType({
  name: 'AssociatedAccounts',
  definition(t) {
    t.string('name');
    t.string('description');
  },
});
