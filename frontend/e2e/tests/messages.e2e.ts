import { by, expect, element, waitFor } from 'detox';

import { hyperLinkScene, waitTabProfile } from '../helpers';
import { mockMessageReplies, mockNewMessageTopic } from '../apollo-mock/data';

const redirectToMessageDetail = async () => {
  const message = element(by.text('Testing new message')).atIndex(0);
  await message.tap();
};

const linkButtonBarMessage = async () => {
  const buttonToolTip = element(by.id('ToolTip:AddIcon'));
  await expect(buttonToolTip).toBeVisible();
  await buttonToolTip.tap();

  const buttonAddLink = element(by.text('Add Link')).atIndex(0);
  await expect(buttonAddLink).toBeVisible();
  await buttonAddLink.tap();

  await hyperLinkScene();
};

describe('Message Screen', () => {
  it('should show message list in Messages screen', async () => {
    await waitTabProfile();
    await element(by.id('Tab:Profile')).tap();

    await expect(element(by.id('Profile:MenuItem:Messages'))).toBeVisible();
    await element(by.id('Profile:MenuItem:Messages')).tap();

    await expect(element(by.id('Messages:List'))).toBeVisible();
    await redirectToMessageDetail();
  });

  it('should reply to a message', async () => {
    const replyMessage = mockMessageReplies[1].markdownContent;
    await expect(element(by.id('ReplyInputField:TextInput'))).toBeVisible();
    await element(by.id('ReplyInputField:TextInput')).typeText(replyMessage);

    await expect(element(by.id('ReplyInputField:Icon:Reply'))).toBeVisible();
    await element(by.id('ReplyInputField:Icon:Reply')).tap();
    await expect(element(by.text(replyMessage)).atIndex(0)).toBeVisible();
  });

  it('should reply to a message With Link', async () => {
    await expect(element(by.id('ReplyInputField:TextInput'))).toBeVisible();

    await linkButtonBarMessage();

    await expect(element(by.id('ReplyInputField:TextInput'))).toHaveText(
      mockMessageReplies[2].markdownContent,
    );

    await expect(element(by.id('ReplyInputField:Icon:Reply'))).toBeVisible();
    await element(by.id('ReplyInputField:Icon:Reply')).tap();
    await expect(
      element(by.text('https://www.google.com')).atIndex(0),
    ).toBeVisible();

    await element(by.id('HeaderBackButton')).tap();
  });

  it('should create a new message', async () => {
    if (device.getPlatform() === 'android') {
      await expect(element(by.id('FloatingButton'))).toBeVisible();
      await element(by.id('FloatingButton')).tap();
    } else {
      await expect(element(by.id('HeaderItem:IconOnly'))).toBeVisible();
      await element(by.id('HeaderItem:IconOnly')).tap();
    }

    await expect(element(by.id('NewMessage:TextArea'))).toBeVisible();
    await element(by.id('NewMessage:TextArea')).typeText(
      mockNewMessageTopic.excerpt,
    );

    await expect(element(by.id('NewMessage:TextInput:Title'))).toBeVisible();
    await element(by.id('NewMessage:TextInput:Title')).typeText(
      mockNewMessageTopic.title,
    );

    await element(by.id('NewMessage:Button:SelectUser')).tap();
    await expect(element(by.id('SelectUser:SafeAreaView'))).toBeVisible();

    await expect(
      element(by.id('UserItem:Author:SelectUser')).atIndex(0),
    ).toBeVisible();
    await element(by.id('UserItem:Author:SelectUser')).atIndex(0).tap();
    await element(by.text('Done')).tap();

    await expect(element(by.text('Send')).atIndex(0)).toBeVisible();
    await element(by.text('Send')).atIndex(0).tap();

    await expect(element(by.id('Messages:List'))).toBeVisible();
    await expect(
      element(by.text(mockNewMessageTopic.title)).atIndex(0),
    ).toBeVisible();
  });

  it('should leave Messages screen', async () => {
    await expect(element(by.id('Messages:List'))).toBeVisible();

    await redirectToMessageDetail();

    const actionSheet = element(by.id('HeaderItem:IconOnly'));
    await expect(actionSheet).toBeVisible();
    await actionSheet.tap();

    const leaveActionSheetOption = element(by.text('Leave Message')).atIndex(0);
    await expect(leaveActionSheetOption).toBeVisible();
    await leaveActionSheetOption.tap();

    /**
     * Should show pop up to confirmation leave private message
     */

    const leaveAlert = element(
      by.text(device.getPlatform() === 'android' ? 'LEAVE' : 'Leave'),
    ).atIndex(0);
    await expect(leaveAlert).toBeVisible();
    await leaveAlert.tap();

    /**
     * It will redirect to the messageList scene, where the leave message will be removed from the list.
     */

    await waitFor(element(by.id('Messages:List')))
      .toBeVisible()
      .withTimeout(2000);

    await expect(element(by.id('MessageList:MessageCard:6'))).not.toBeVisible();
  });
});
