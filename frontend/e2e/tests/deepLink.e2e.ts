import { device, by, expect, element } from 'detox';

import { logout, redirectToApp } from '../helpers';
import { emailToken } from '../apollo-mock/data';

const openNewInstanceLogin = async () => {
  await device.launchApp({
    newInstance: true,
  });
  await logout();
};

describe('Deep link', () => {
  it('should handle URL successfully into post detail', async () => {
    await redirectToApp({ type: 'post', content: 't/Detox-test/3' });

    await expect(element(by.id('PostDetail:List'))).toBeVisible();
    await expect(element(by.text('Detox Test')).atIndex(0)).toBeVisible();
  });

  it('should handle URL successfully into message detail', async () => {
    await redirectToApp({
      type: 'message',
      content: 't/Testing-new-message/6',
    });
    await expect(element(by.id('ReplyInputField:TextInput'))).toBeVisible();
    await expect(
      element(by.text('Testing new message')).atIndex(0),
    ).toBeVisible();
  });

  it('should show error not valid link', async () => {
    await openNewInstanceLogin();

    await redirectToApp({ type: 'login', content: 'random-token' });

    await expect(element(by.text('Sorry link is not valid'))).toBeVisible();
    await element(by.text('Got it')).tap();
  });

  it('should handle URL successfully login link', async () => {
    await redirectToApp({ type: 'login', content: emailToken });

    await expect(element(by.text('Home'))).toBeVisible();
  });

  it('should handle URL successfully activate account and login into home', async () => {
    await openNewInstanceLogin();
    await redirectToApp({ type: 'activate', content: emailToken });

    await expect(
      element(by.text('Your new account is confirmed')),
    ).toBeVisible();
    const gotItButton = element(by.text('Got it'));
    await expect(gotItButton).toBeVisible();
    await gotItButton.tap();
    await expect(element(by.text('Home'))).toBeVisible();
  });
});
