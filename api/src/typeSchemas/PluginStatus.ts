import { objectType } from 'nexus';

export let PluginStatus = objectType({
  name: 'PluginStatus',
  definition(t) {
    t.boolean('appleLoginEnabled');
    t.boolean('loginLinkEnabled');
  },
});
