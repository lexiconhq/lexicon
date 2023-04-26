import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let LookupUrl = objectType({
  name: 'LookupUrl',
  definition(t) {
    t.string('shortUrl');
    t.string('url', {
      resolve: (instance) => getNormalizedUrlTemplate(instance, 'url'),
      sourceType: 'string',
    });
    t.string('shortPath');
  },
});
