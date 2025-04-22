import { by, element, expect } from 'detox';

import { redirectToApp, waitTabProfile } from '../helpers';
import {
  mockChatChannelMessages,
  mockChatChannels,
  mockThreads,
} from '../rest-mock/data';

describe('Deep link', () => {
  it('should handle URL successfully into post detail', async () => {
    await waitTabProfile();
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

  it('should redirect to channel list scene if invalid link', async () => {
    await redirectToApp({ type: 'chat', content: 'randomLink' });

    await expect(element(by.text('All'))).toBeVisible();
  });

  it('should handle URL successfully chat link', async () => {
    const chatMessage = mockChatChannelMessages[0];
    await redirectToApp({
      type: 'chat',
      content: `c/${mockChatChannels[1].id}/${chatMessage.id}`,
    });

    await expect(element(by.text(chatMessage.message))).toBeVisible();
  });

  it('should handle URL successfully thread link', async () => {
    const threadMessage = mockThreads[0];
    await redirectToApp({
      type: 'thread',
      content: `c/${mockChatChannels[1].id}/${mockChatChannelMessages[1].threadId}/${threadMessage.id}`,
    });

    await expect(element(by.text(threadMessage.message))).toBeVisible();
  });
});
