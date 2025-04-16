import { by, expect, element, device } from 'detox';

export async function redirectNewPrivateMessage() {
  if (device.getPlatform() === 'android') {
    await expect(element(by.id('FloatingButton'))).toBeVisible();
    await element(by.id('FloatingButton')).tap();
  } else {
    await expect(element(by.id('HeaderItem:IconOnly'))).toBeVisible();
    await element(by.id('HeaderItem:IconOnly')).tap();
  }
}

export const redirectToMessageDetail = async () => {
  const message = element(by.text('Testing new message')).atIndex(0);
  await message.tap();
};
