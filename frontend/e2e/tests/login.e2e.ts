import { by, expect, element, waitFor } from 'detox';

import { loginWithAccount, logout } from '../helpers';

describe('Login Screen', () => {
  it('should have error in login screen', async () => {
    await logout();

    await expect(element(by.text('Log In')).atIndex(0)).toBeVisible();
    await expect(element(by.text('Log In')).atIndex(1)).toBeVisible();
    await expect(element(by.id('Login:Button:Login'))).toBeVisible();

    await expect(element(by.id('Login:TextInput:Email'))).toBeVisible();
    await element(by.id('Login:TextInput:Email')).typeText(
      'wrong@example.com\n',
    );
    await expect(element(by.id('Login:TextInput:Email'))).toHaveText(
      'wrong@example.com',
    );

    await expect(element(by.id('Login:TextInput:Password'))).toBeVisible();
    await element(by.id('Login:TextInput:Password')).typeText(
      'wrong password\n',
    );
    await expect(element(by.id('Login:TextInput:Password'))).toHaveText(
      'wrong password',
    );

    await waitFor(element(by.id('Login:Button:Login')))
      .toBeVisible()
      .withTimeout(1000);
    await element(by.id('Login:Button:Login')).tap();

    await expect(
      element(by.text('Incorrect username, email or password')),
    ).toBeVisible();
  });

  it('should login with account', async () => {
    // clear the text input without using reload
    await element(by.id('Login:TextInput:Email')).clearText();
    await element(by.id('Login:TextInput:Password')).clearText();
    await loginWithAccount();
  });
});
