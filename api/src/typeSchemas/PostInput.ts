import { inputObjectType } from '@nexus/schema';

export let ReplyInput = inputObjectType({
  name: 'ReplyInput',
  definition(t) {
    t.string('raw', { required: true });
    t.int('topicId', { required: true });
    t.int('replyToPostNumber');
  },
});

export let NewPrivateMessageInput = inputObjectType({
  name: 'NewPrivateMessageInput',
  definition(t) {
    t.string('raw', { required: true });
    t.int('category');
    t.string('targetRecipients', { list: true, required: true });
    t.string('title', { required: true });
  },
});

export let NewTopicInput = inputObjectType({
  name: 'NewTopicInput',
  definition(t) {
    t.string('raw', { required: true });
    t.int('category');
    t.string('title', { required: true });
    t.string('tags', { list: true });
  },
});
