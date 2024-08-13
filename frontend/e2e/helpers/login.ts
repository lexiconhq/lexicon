import { by, expect, element, waitFor } from 'detox';

export async function loginWithAccount() {
  await waitFor(element(by.id('Login:TextInput:Email')))
    .toBeVisible()
    .withTimeout(9000);
  await expect(element(by.id('Login:TextInput:Email'))).toBeVisible();
  await element(by.id('Login:TextInput:Email')).tap();
  await element(by.id('Login:TextInput:Email')).typeText('test@example.com\n');
  await expect(element(by.id('Login:TextInput:Email'))).toHaveText(
    'test@example.com',
  );

  await expect(element(by.id('Login:TextInput:Password'))).toBeVisible();
  await element(by.id('Login:TextInput:Password')).typeText('password\n');
  await expect(element(by.id('Login:TextInput:Password'))).toHaveText(
    'password',
  );

  await waitFor(element(by.id('Login:Button:Login')))
    .toBeVisible()
    .withTimeout(1000);
  await element(by.id('Login:Button:Login')).tap();

  await expect(element(by.text('Home'))).toBeVisible();
}
