import { inputObjectType } from 'nexus';

export let ReplyInput = inputObjectType({
  name: 'ReplyInput',
  definition(t) {
    t.string('raw');
    t.int('topicId');
    t.nullable.int('replyToPostNumber');
  },
});

export let NewPrivateMessageInput = inputObjectType({
  name: 'NewPrivateMessageInput',
  definition(t) {
    t.string('raw');
    t.nullable.int('category');
    t.list.string('targetRecipients');
    t.string('title');
  },
});

export let NewTopicInput = inputObjectType({
  name: 'NewTopicInput',
  definition(t) {
    t.string('raw');
    t.nullable.int('category');
    t.string('title');
    t.nullable.list.string('tags');
  },
});
