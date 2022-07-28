import { UserIcon } from '../../types';

export default function createUser(options: Partial<UserIcon> = {}): UserIcon {
  return {
    id: 0,
    username: 'current-user',
    name: '',
    avatarTemplate: 'https://avatars.site/current-user',
    ...options,
  };
}
