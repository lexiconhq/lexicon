import { objectType } from 'nexus';

import { BaseTopicDetailOutput } from './TopicDetailOutput';

export let PrivateMessageDetailOutput = objectType({
  name: 'PrivateMessageDetailOutput',
  definition(t) {
    t.implements(BaseTopicDetailOutput);
  },
});
