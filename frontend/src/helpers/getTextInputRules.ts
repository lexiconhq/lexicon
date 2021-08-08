import { Site_site as SiteSettings } from '../generated/server/Site';

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
