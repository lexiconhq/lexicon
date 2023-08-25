import { isValidExperienceId } from '../experienceId';

it('should valid experience id', () => {
  expect(isValidExperienceId('@kfox/<insert-project-name>')).toBeTruthy();
  expect(isValidExperienceId('@username/lexicon-project')).toBeTruthy();
  expect(isValidExperienceId('@anonymous/<insert-project-name>')).toBeTruthy();
});

it('should invalid experience id', () => {
  expect(isValidExperienceId('kfox/<insert-project-name>')).toBeFalsy();
  expect(isValidExperienceId('@kfox/<insert project name>')).toBeFalsy();
  expect(isValidExperienceId('@kfox/KF.Lounge')).toBeFalsy();
});
