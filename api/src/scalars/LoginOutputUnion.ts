import { unionType } from 'nexus';

export let LoginOutputUnion = unionType({
  name: 'LoginOutputUnion',
  definition(t) {
    t.members('LoginOutput', 'SecondFactorRequired');
  },
  resolveType: (item) => {
    if (item.hasOwnProperty('secondFactorRequired')) {
      return 'SecondFactorRequired';
    }
    return 'LoginOutput';
  },
});
