import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export type WithUrlTemplate =
  | { avatarTemplate: string }
  | { actingAvatarTemplate: string }
  | { systemAvatarTemplate: string }
  | { url: string };

export type NormalizedUrlTemplateVariant =
  | 'regularAvatar'
  | 'actingAvatar'
  | 'systemAvatar'
  | 'url';

export function getNormalizedUrlTemplate(
  instance: WithUrlTemplate,
  variant: NormalizedUrlTemplateVariant = 'regularAvatar',
) {
  let urlTemplate = '';

  if (variant === 'regularAvatar') {
    if ('avatarTemplate' in instance) {
      urlTemplate = instance.avatarTemplate;
    }
  } else if (variant === 'actingAvatar') {
    if ('actingAvatarTemplate' in instance) {
      urlTemplate = instance.actingAvatarTemplate;
    }
  } else if (variant === 'url') {
    if ('url' in instance) {
      urlTemplate = instance.url;
    }
  } else {
    if ('systemAvatarTemplate' in instance) {
      urlTemplate = instance.systemAvatarTemplate;
    }
  }

  if (!urlTemplate) {
    // TODO: #764 Add a Basic Logger
    // console.debug('url template was empty for instance', instance);
    return '';
  }

  return urlTemplate.includes('http')
    ? urlTemplate
    : PROSE_DISCOURSE_UPLOAD_HOST.concat(urlTemplate);
}
