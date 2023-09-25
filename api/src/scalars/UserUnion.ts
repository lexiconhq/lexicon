import { unionType } from 'nexus';

export let UserUnion = unionType({
  name: 'UserUnion',
  definition(t) {
    t.members('UserLite', 'UserDetail');
  },
  resolveType: (item) => {
    if (item.hasOwnProperty('email')) {
      return 'UserDetail';
    }
    return 'UserLite';
  },
});
