import { by, expect, element } from 'detox';

export async function hyperLinkScene() {
  await expect(element(by.text('Insert Hyperlink')).atIndex(0)).toBeVisible();

  const textInputUrl = element(by.id('Hyperlink:TextInput:URL'));
  await expect(textInputUrl).toBeVisible();
  await textInputUrl.replaceText('www.google.com');

  const textInputTitle = element(by.id('Hyperlink:TextInput:Title'));
  await textInputTitle.replaceText('test url');

  const textDone = device.getPlatform() === 'android' ? 'Add' : 'Done';
  await expect(element(by.text(textDone)).atIndex(0)).toBeVisible();
  await element(by.text(textDone)).atIndex(0).tap();
}
