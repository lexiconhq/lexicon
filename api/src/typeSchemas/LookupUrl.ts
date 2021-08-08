import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let LookupUrl = objectType({
  name: 'LookupUrl',
  definition(t) {
    t.string('shortUrl');
    t.string('url', (lookup) => {
      let { url } = 'url' in lookup ? lookup : { url: '' };
      return PROSE_DISCOURSE_UPLOAD_HOST + url;
    });
    t.string('shortPath');
  },
});
