import Constants from 'expo-constants';

type ExperienceIdSource =
  | 'manifest2.extra.scopeKey'
  | 'expoConfig.currentFullName';

export type ExperienceIdResult =
  | { success: true; result: string; source: ExperienceIdSource }
  | { success: false; error: 'ExperienceIdMissing' };

export function getExperienceId(): ExperienceIdResult {
  const expoConfigKey = Constants.expoConfig?.currentFullName ?? '';
  if (expoConfigKey) {
    if (!isValidExperienceId(expoConfigKey)) {
      // eslint-disable-next-line no-console
      console.warn('experience id in current full name is not valid');
    } else {
      return {
        success: true,
        result: expoConfigKey,
        source: 'expoConfig.currentFullName',
      };
    }
  }

  const manifest2Key = Constants.manifest2?.extra?.scopeKey ?? '';

  if (manifest2Key) {
    return {
      success: true,
      result: manifest2Key,
      source: 'manifest2.extra.scopeKey',
    };
  }

  return { success: false, error: 'ExperienceIdMissing' };
}

/**
 *
 * @param experienceId
 * @returns boolean
 *
 * this function will check is format of experience id is valid or not where the valid value is @<username>/<project-name-slug>
 */

export function isValidExperienceId(experienceId: string): boolean {
  const regexExperienceIdFormat = /^@[\w.<>-]+\/[\w<>-]+$/g;
  return regexExperienceIdFormat.test(experienceId);
}
