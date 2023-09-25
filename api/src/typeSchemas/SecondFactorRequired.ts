import { objectType } from 'nexus';

export let SecondFactorRequired = objectType({
  name: 'SecondFactorRequired',
  definition(t) {
    t.string('failed');
    t.boolean('ok');
    t.string('error');
    t.string('reason');
    t.boolean('backupEnabled');
    t.boolean('securityKeyEnabled');
    t.boolean('totpEnabled');
    t.boolean('multipleSecondFactorMethods');
    t.boolean('secondFactorRequired');
  },
});
