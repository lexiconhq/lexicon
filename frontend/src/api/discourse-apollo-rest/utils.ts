import { discourseHost } from '../../constants';

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

export function getNormalizedUrlTemplate({
  instance,
  variant = 'regularAvatar',
  path,
}: {
  instance?: WithUrlTemplate;
  variant?: NormalizedUrlTemplateVariant;
  path?: string;
}): string {
  let urlTemplate = path || '';

  if (instance && !path) {
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
  }

  if (!urlTemplate) {
    // TODO: #764 Add a Basic Logger
    // console.debug('url template was empty for instance', instance);
    return '';
  }

  return urlTemplate.includes('http')
    ? urlTemplate
    : discourseHost.concat(urlTemplate);
}
