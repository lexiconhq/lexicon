import { SiteSettings } from '../types';

type TextInputRules = Pick<
  SiteSettings,
  | 'maxUsernameLength'
  | 'minUsernameLength'
  | 'minPasswordLength'
  | 'fullNameRequired'
>;

type TextInputRulesParams = {
  [K in keyof TextInputRules]?: TextInputRules[K];
};

export function getTextInputRules({
  maxUsernameLength,
  minUsernameLength,
  minPasswordLength,
  fullNameRequired,
}: TextInputRulesParams) {
  const usernameInputRules = {
    required: true,
    minLength: minUsernameLength && {
      value: minUsernameLength,
      message: t('Username must be at least {minLength} characters', {
        minLength: minUsernameLength,
      }),
    },
    maxLength: maxUsernameLength && {
      value: maxUsernameLength,
      message: t('Username must be less than {maxLength} characters', {
        maxLength: maxUsernameLength,
      }),
    },
    validate: {
      startsWith: (value: string) =>
        /^[a-zA-Z0-9_]/.test(value) ||
        t('Username must begin with a letter, a number or an underscore'),
      endsWith: (value: string) =>
        /[a-zA-Z0-9]$/.test(value) ||
        t('Username must end with a letter or a number'),
      contains: (value: string) =>
        /^[a-zA-Z0-9_][a-zA-Z0-9-_.]*[a-zA-Z0-9]?$/.test(value) ||
        t(
          'Username must must only include numbers, letters, dashes, dots, and underscores',
        ),
    },
  };

  const nameInputRules = { required: fullNameRequired };

  const passwordInputRules = {
    required: true,
    minLength: minPasswordLength && {
      value: minPasswordLength,
      message: t('Password must be at least {minLength} characters', {
        minLength: minPasswordLength,
      }),
    },
  };

  return { usernameInputRules, nameInputRules, passwordInputRules };
}
