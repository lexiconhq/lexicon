import { isValidExperienceId, getExtraExperienceId } from '../experienceId';

describe('function isValidExperienceId', () => {
  it('should valid experience id', () => {
    expect(isValidExperienceId('@<kfox>/<insert-project-name>')).toBeTruthy();
    expect(isValidExperienceId('@username/lexicon-project')).toBeTruthy();
    expect(
      isValidExperienceId('@anonymous/<insert-project-name>'),
    ).toBeTruthy();
  });

  it('should invalid experience id', () => {
    expect(isValidExperienceId('kfox/<insert-project-name>')).toBeFalsy();
    expect(isValidExperienceId('@kfox/<insert project name>')).toBeFalsy();
    expect(isValidExperienceId('@kfox/KF.Lounge')).toBeFalsy();
  });
});

describe('function getExtraExperienceId', () => {
  it('should return experience id from eas', () => {
    const extra = {
      experienceId: '@username/project-name',
      other: { id: 1, info: 'other information' },
    };

    expect(getExtraExperienceId(extra)).toBe('@username/project-name');
  });

  it('should return empty string experience id', () => {
    const extra = {
      experienceid: '@username/project-name',
      other: { id: 1, info: 'other information' },
    };
    const extra2 = {
      example: 'example empty experienceId',
    };
    const extra3 = {
      experienceId: '',
    };
    expect(getExtraExperienceId(extra)).toBe('');
    expect(getExtraExperienceId(extra2)).toBe('');
    expect(getExtraExperienceId(extra3)).toBe('');
    expect(getExtraExperienceId(undefined)).toBe('');
  });
});
