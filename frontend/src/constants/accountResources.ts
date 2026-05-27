export const ACCOUNT_PREFERENCES_URL =
  'https://biohacking.forum/my/preferences/account';

export const DISCORD_INVITE_URL = 'https://discord.gg/AzMUwtugVg';
export const TELEGRAM_COMMUNITY_URL = 'https://t.me/biohackerlounge';

export type AdditionalResourceType = 'accountDeletion' | 'requestData';

export const ADDITIONAL_RESOURCE_TYPES: AdditionalResourceType[] = [
  'accountDeletion',
  'requestData',
];

export const ADDITIONAL_RESOURCES: Record<
  AdditionalResourceType,
  {
    title: () => string;
    message: () => string;
    steps: () => string;
    iconName: 'Delete' | 'Folder';
  }
> = {
  accountDeletion: {
    title: () => t('Account Deletion'),
    message: () =>
      t(
        'To delete your account, and all associated data, you must do so on the website and login.',
      ),
    steps: () => t('Go to Account Preferences > Delete.'),
    iconName: 'Delete',
  },
  requestData: {
    title: () => t('Request Data'),
    message: () =>
      t(
        'To request a copy of your data, you must do so on the website and login.',
      ),
    steps: () => t('Go to Account Preferences > Request Archive.'),
    iconName: 'Folder',
  },
};
