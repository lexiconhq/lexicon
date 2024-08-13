import { by, expect, element } from 'detox';

import { redirectPostDetail, waitTabProfile } from '../helpers';

describe('User Status', () => {
  it('should Show status in Post Detail', async () => {
    await waitTabProfile();
    await expect(element(by.id('Home:PostList'))).toBeVisible();

    await redirectPostDetail();

    const emojiUserStatusHeader = element(
      by.id('PostDetailHeaderItem:Author:EmojiStatus'),
    );

    await expect(emojiUserStatusHeader).toBeVisible();

    const emojiUserStatusComment = element(
      by.id('PostDetail:NestedComment:Author:EmojiStatus'),
    ).atIndex(0);
    await expect(emojiUserStatusComment).toBeVisible();
    await element(by.id('HeaderBackButton')).tap();
  });

  it('should Show status in Profile', async () => {
    await waitTabProfile();
    await element(by.id('Tab:Profile')).tap();

    const userStatusElement = element(by.id('Profile:UserStatus'));
    await expect(userStatusElement).toBeVisible();
    await expect(userStatusElement).toHaveLabel('Test Status');

    const userStatusEmoji = element(by.id('UserStatus:Emoji:Image'));
    await expect(userStatusEmoji).toBeVisible();
  });

  it('should edit status', async () => {
    const userStatusElement = element(by.id('Profile:UserStatus'));
    await expect(userStatusElement).toBeVisible();

    await userStatusElement.tap();

    /**
     * Edit status scene
     */

    const textInputStatusElement = element(
      by.id('EditUserStatus:TextInput:Status'),
    );
    await expect(textInputStatusElement).toBeVisible();

    const newStatus = 'Change Status';

    await textInputStatusElement.replaceText(newStatus);
    await expect(textInputStatusElement).toHaveText(newStatus);

    const buttonEmojiElement = element(by.id('EditUserStatus:Button:Emoji'));

    await buttonEmojiElement.tap();

    /**
     * Emoji Picker Scene
     */

    const textInputSearchEmojiElement = element(
      by.id('EmojiPicker:TextInput:Search'),
    );

    await expect(textInputSearchEmojiElement).toBeVisible();
    await textInputSearchEmojiElement.typeText('smile');

    const smileEmojiElement = element(by.id('EmojiPicker:Button:Emoji:smile'));
    await waitFor(smileEmojiElement).toBeVisible().withTimeout(3000);

    await smileEmojiElement.tap();

    /**
     * Back to Edit User Status scene after select emoji
     */

    await expect(textInputStatusElement).toBeVisible();

    await expect(element(by.text('Done')).atIndex(0)).toBeVisible();
    await element(by.text('Done')).atIndex(0).tap();

    /**
     * Profile scene after edit status
     */

    await expect(userStatusElement).toBeVisible();
    await expect(userStatusElement).toHaveLabel(newStatus);
  });

  it('should delete user status', async () => {
    const userStatusElement = element(by.id('Profile:UserStatus'));
    await userStatusElement.tap();

    const buttonUserStatusDelete = element(
      by.id('EditUserStatus:Button:DeleteStatus'),
    );
    await expect(buttonUserStatusDelete).toBeVisible();
    await buttonUserStatusDelete.tap();

    const alertDelete = element(by.text('Delete Status?'));

    await expect(alertDelete.atIndex(0)).toBeVisible();

    let deleteButtonAlert;
    if (device.getPlatform() === 'android') {
      deleteButtonAlert = 'DELETE';
    } else {
      deleteButtonAlert = 'Delete';
    }

    await expect(element(by.text(deleteButtonAlert)).atIndex(0)).toBeVisible();
    await element(by.text(deleteButtonAlert)).atIndex(0).tap();

    await expect(userStatusElement).not.toBeVisible();

    const userStatusIconElement = element(by.id('Profile:IconWithLabel'));
    await expect(userStatusIconElement).toBeVisible();
  });
});
