import { by, element, expect } from 'detox';

import { createPost, waitTabProfile } from '../helpers';
import { mockNewTopicWithCollapsible } from '../rest-mock/data';

describe('Collapsible', () => {
  it('should create a new post with collapsible', async () => {
    await waitTabProfile();
    await expect(element(by.id('Home:PostList'))).toBeVisible();

    if (device.getPlatform() === 'android') {
      await expect(element(by.id('FloatingButton'))).toBeVisible();
      await element(by.id('FloatingButton')).tap();
    } else {
      await expect(element(by.id('HomeNavBar:Icon:Add'))).toBeVisible();
      await element(by.id('HomeNavBar:Icon:Add')).tap();
    }

    await expect(element(by.id('NewPost:TextInput:Title'))).toBeVisible();
    await element(by.id('NewPost:TextInput:Title')).typeText(
      mockNewTopicWithCollapsible.title,
    );

    await expect(element(by.id('NewPost:Button:Channel'))).toBeVisible();
    await element(by.id('NewPost:Button:Channel')).tap();
    await element(by.text('Lexicon UAT')).atIndex(0).tap();

    const textArea = element(by.id('NewPost:TextArea'));
    await expect(textArea).toBeVisible();
    await textArea.tap();
    await textArea.replaceText(
      '[details="Outer collapsible"]\n' +
        '[details="Inner collapsible"]\n' +
        '[details="Summary"]\n' +
        '[Link](https://www.youtube.com)\n' +
        '[/details]\n' +
        '[details="Summary"]\n' +
        'test\n' +
        '[/details]\n' +
        '[/details]\n' +
        '[/details]\n\n',
    );

    await createPost();

    await expect(element(by.id('PostDetail:List'))).toBeVisible();

    await expect(element(by.text('Outer collapsible'))).toBeVisible();
    await element(by.text('Outer collapsible')).tap();
    await expect(element(by.text('Inner collapsible'))).toBeVisible();
    await element(by.text('Inner collapsible')).tap();
    await expect(element(by.text('Summary')).atIndex(1)).toBeVisible();
    await element(by.text('Summary')).atIndex(1).tap();
    await expect(element(by.text('Summary')).atIndex(0)).toBeVisible();
    await element(by.text('Summary')).atIndex(0).tap();
  });

  it('should be able to edit poll', async () => {
    await element(by.id('HeaderItem:IconOnly')).tap();
    await element(by.text('Edit Post')).tap();
    await expect(element(by.id('NewPost:SafeAreaView'))).toBeVisible();

    const textArea = element(by.id('NewPost:TextArea'));
    await expect(textArea).toBeVisible();
    await textArea.tap();

    await expect(element(by.id('BottomMenu:IconCollapsible'))).toBeVisible();
    await element(by.id('BottomMenu:IconCollapsible')).atIndex(0).tap();

    await textArea.typeText(' ');

    await createPost();
    await expect(element(by.id('PostDetail:List'))).toBeVisible();

    await expect(element(by.text('Summary'))).toBeVisible();
  });
});
