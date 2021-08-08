import { unionType } from '@nexus/schema';

export let UserUnion = unionType({
  name: 'UserUnion',
  definition(t) {
    t.members('UserLite', 'UserDetail');
    t.resolveType((item) => {
      if (item.hasOwnProperty('email')) {
        return 'UserDetail';
      }
      return 'UserLite';
    });
  },
});
