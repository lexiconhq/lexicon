import { unionType } from '@nexus/schema';

export let LoginOutputUnion = unionType({
  name: 'LoginOutputUnion',
  definition(t) {
    t.members('LoginOutput', 'SecondFactorRequired');
    t.resolveType((item) => {
      if (item.hasOwnProperty('secondFactorRequired')) {
        return 'SecondFactorRequired';
      }
      return 'LoginOutput';
    });
  },
});
