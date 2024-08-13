import { by, expect, element } from 'detox';

import { waitTabProfile } from '../helpers';

describe('Profile Tab', () => {
  it('should successfully change username', async () => {
    await waitTabProfile();
    await element(by.id('Tab:Profile')).tap();

    await element(by.id('Profile:Button:EditProfile')).tap();
    await expect(element(by.id('EditProlfie:ScrollView'))).toBeVisible();

    const usernameTextInput = element(by.id('EditProfile:TextInput:Username'));
    await expect(usernameTextInput).toBeVisible();
    await expect(usernameTextInput).toHaveText('johndoe');
    await usernameTextInput.typeText('19');
    await expect(usernameTextInput).toHaveText('johndoe19');

    await element(by.text('Save')).atIndex(0).tap();

    await expect(element(by.text('Got it')).atIndex(0)).toBeVisible();
    await element(by.text('Got it')).atIndex(0).tap();
  });
});
