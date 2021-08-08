import { objectType } from '@nexus/schema';

export let SiteSetting = objectType({
  name: 'SiteSetting',
  definition(t) {
    t.boolean('canCreateTag');
    t.boolean('canTagTopics');
    t.boolean('canSignUp');
    t.string('authorizedExtensions');
    t.int('uncategorizedCategoryId', { nullable: true });
    t.int('minSearchLength');
    t.boolean('taggingEnabled');
    t.int('maxTagLength');
    t.int('maxTagsPerTopic');
    t.int('maxUsernameLength');
    t.int('minUsernameLength');
    t.int('minPasswordLength');
    t.boolean('fullNameRequired');
    t.field('topicFlagTypes', {
      type: 'TopicFlagTypes',
      list: true,
    });
    t.field('postActionTypes', {
      type: 'TopicFlagTypes',
      list: true,
    });
  },
});
