import { objectType } from 'nexus';

export let SiteSetting = objectType({
  name: 'SiteSetting',
  definition(t) {
    t.boolean('canCreateTag');
    t.boolean('canTagTopics');
    t.boolean('canSignUp');
    t.string('authorizedExtensions');
    t.nullable.int('uncategorizedCategoryId');
    t.int('minSearchLength');
    t.boolean('taggingEnabled');
    t.int('maxTagLength');
    t.int('maxTagsPerTopic');
    t.int('maxUsernameLength');
    t.int('minUsernameLength');
    t.int('minPasswordLength');
    t.boolean('fullNameRequired');
    t.list.field('topicFlagTypes', {
      type: 'TopicFlagTypes',
    });
    t.list.field('postActionTypes', {
      type: 'TopicFlagTypes',
    });
  },
});
