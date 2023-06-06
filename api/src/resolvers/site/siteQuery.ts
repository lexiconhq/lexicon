import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let siteResolver: FieldResolver<'Query', 'site'> = async (
  _,
  __,
  context: Context,
) => {
  try {
    let siteUrl = `/site.json`;
    let {
      data: {
        can_create_tag: canCreateTag,
        can_tag_topics: canTagTopics,
        topic_flag_types: topicFlagTypes,
        post_action_types: postActionTypes,
        ...siteData
      },
    } = await context.client.get(siteUrl);

    topicFlagTypes = camelcaseKey(topicFlagTypes, { deep: true });

    topicFlagTypes = topicFlagTypes.filter(
      (flag: { id: string; nameKey: string }) =>
        flag.id != null && flag.nameKey != null,
    );

    postActionTypes = camelcaseKey(postActionTypes, { deep: true });

    postActionTypes = postActionTypes.filter(
      (flag: { id: string; nameKey: string }) =>
        flag.id != null && flag.nameKey != null,
    );

    let siteSettingsUrl = '/site/settings.json';
    let {
      data: {
        invite_only: inviteOnly = false,
        allow_new_registrations: allowNewRegistrations = true,
        enable_sso: enableSso = false,
        authorized_extensions: authorizedExtensions = '',
        min_search_term_length: minSearchLength = 0,
        tagging_enabled: taggingEnabled = false,
        max_tags_per_topic: maxTagsPerTopic = 0,
        max_tag_length: maxTagLength = 0,
        max_username_length: maxUsernameLength = 0,
        min_username_length: minUsernameLength = 0,
        min_password_length: minPasswordLength = 0,
        full_name_required: fullNameRequired = false,
      },
    } = await context.client.get(siteSettingsUrl);

    return {
      canCreateTag: canCreateTag || false,
      canTagTopics: canTagTopics || false,
      canSignUp: !inviteOnly && allowNewRegistrations && !enableSso,
      authorizedExtensions,
      minSearchLength,
      taggingEnabled,
      maxTagsPerTopic,
      maxTagLength,
      maxUsernameLength,
      minUsernameLength,
      minPasswordLength,
      fullNameRequired,
      topicFlagTypes,
      postActionTypes,
      ...camelcaseKey(siteData, { deep: true }),
    };
  } catch (error) {
    throw errorHandler(error);
  }
};

let siteQuery = queryField('site', {
  type: 'SiteSetting',
  resolve: siteResolver,
});

export { siteQuery };
