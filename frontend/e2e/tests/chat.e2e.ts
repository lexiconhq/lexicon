import { by, element, expect } from 'detox';

import { waitTabProfile } from '../helpers';
import {
  mockChatChannelMessages,
  mockNewChat,
  mockNewThread,
} from '../rest-mock/data';

const channelItemById = (id: number) =>
  element(by.id(`Channel:ChannelItem:${id}`));

const channelItemDotUnreadById = (id: number) =>
  element(by.id(`Channel:ChannelItem:Dot:Unread:${id}`));

const threadChatItemById = (id: number) =>
  element(by.id(`ThreadDetail:ChatItem:${id}`));

const threadRepliesMetricButtonById = (id: number) =>
  element(by.id(`Chat:ChatItem:MetricItem:IconWithLabel:${id}`));

const goBack = async () => {
  await element(by.id('HeaderBackButton')).tap();
};

describe('Live Chat', () => {
  it('should correctly display the Channel List', async () => {
    await waitTabProfile();
    await element(by.id('Tab:Chat')).tap();

    await expect(element(by.id('Channel:List'))).toBeVisible();

    // Switch to "Open" status (index 1)
    await element(by.id('Channel:SegmentControl:1')).tap();

    // Channel with ID 4 has a "closed" status, so it should not be visible
    await expect(channelItemById(4)).not.toBeVisible();

    // Switch to "Closed" status (index 2)
    await element(by.id('Channel:SegmentControl:2')).tap();

    // Channel with ID 4 is "closed" and should now be visible
    await expect(channelItemById(4)).toBeVisible();

    // Channel with ID 1 is "open" and should no longer be visible
    await expect(channelItemById(1)).not.toBeVisible();

    // Switch to "All" channels (index 0)
    await element(by.id('Channel:SegmentControl:0')).tap();

    // Search for a channel
    const searchTextInput = element(by.id('Channel:Search:TextInput'));
    await expect(searchTextInput).toBeVisible();

    // Search for a channel with the title "test"
    await searchTextInput.replaceText('test');

    // Channel with ID 2 should be visible
    await expect(channelItemById(2)).toBeVisible();

    // Search for a non-existent channel
    await searchTextInput.replaceText('empty');

    // No matching results, so channel with ID 2 should not be visible
    await expect(channelItemById(2)).not.toBeVisible();

    // Clear the search input
    await searchTextInput.clearText();
  });

  it('should allow joining and leaving a channel', async () => {
    const buttonJoinOrLeave = element(
      by.id('Channel:ChannelItem:Button:JoinOrLeave:3'),
    );

    await expect(buttonJoinOrLeave).toBeVisible();

    // The initial state should display "Join"
    await expect(buttonJoinOrLeave).toHaveLabel('Join');

    // Tap the button to join the channel
    await buttonJoinOrLeave.tap();

    // Ensure navigation to the chat list screen
    await expect(element(by.id('Chat:ChatList'))).toBeVisible();

    // Navigate back to the Channel List
    await goBack();

    // The button should now indicate the user is in the channel ("Leave")
    await expect(buttonJoinOrLeave).toBeVisible();
    await expect(buttonJoinOrLeave).toHaveLabel('Leave');

    // Tap the button to leave the channel
    await buttonJoinOrLeave.tap();

    // The button should return to "Join"
    await expect(buttonJoinOrLeave).toHaveLabel('Join');
  });

  const buttonItem2 = element(by.id('Channel:ChannelItem:Button:Item:2'));

  it('should mark unread messages as read', async () => {
    // Verify unread indicators: only channel ID 2 should have the unread dot
    await expect(channelItemDotUnreadById(3)).not.toBeVisible();
    await expect(channelItemDotUnreadById(1)).not.toBeVisible();
    await expect(channelItemDotUnreadById(2)).toBeVisible();

    // Tap on channel ID 2 to open it
    await buttonItem2.tap();

    // Ensure navigation to the chat channel detail screen
    await expect(element(by.id('Chat:ChatList'))).toBeVisible();

    // Navigate back to the Channel List
    await goBack();

    // Unread indicator for channel ID 2 should now be gone
    await expect(channelItemDotUnreadById(2)).not.toBeVisible();
  });

  const textInputField = element(by.id('ReplyInputField:TextInput'));
  const buttonReply = element(by.id('ReplyInputField:Icon:Reply'));

  it('should open chat channel detail', async () => {
    // Tap on channel ID 2 to open it
    await buttonItem2.tap();

    // Ensure navigation to the chat channel detail screen
    await expect(element(by.id('Chat:ChatList'))).toBeVisible();

    // Reply chat
    await expect(textInputField).toBeVisible();
    await textInputField.tap();
    await textInputField.replaceText(mockNewChat.message);

    await expect(buttonReply).toBeVisible();
    await buttonReply.tap();
  });

  let threadList = element(by.id('ThreadDetail:Chat:List'));

  it('should create a new thread', async () => {
    // Create and navigate to thread
    const threadButton = threadRepliesMetricButtonById(
      mockChatChannelMessages[0].id,
    );
    await expect(threadButton).toBeVisible();
    // tap two times for close keyboard and button tap
    await threadButton.multiTap(2);

    // navigate to thread detail scene
    await expect(threadList).toBeVisible();
    // back to chat detail scene
    await goBack();
  });

  it('should show thread detail scene with thread', async () => {
    const threadButton = threadRepliesMetricButtonById(
      mockChatChannelMessages[1].id,
    );

    // Ensure the thread button is visible before interacting
    await expect(threadButton).toBeVisible();
    await threadButton.tap();

    await expect(threadList).toBeVisible();

    // Check if unsupported markdown message is displayed. it suppose show because at mock thread we add uploads data
    await expect(
      element(by.text(`Unsupported file type.`)).atIndex(0),
    ).toBeVisible();
  });

  it('should reply to a thread', async () => {
    const replyThread = mockNewThread.message;

    // Ensure the text input field is visible
    await expect(textInputField).toBeVisible();

    // Input the reply message
    await textInputField.replaceText(replyThread);

    // Verify that the reply button is visible and send the reply
    await expect(buttonReply).toBeVisible();
    await buttonReply.tap();

    // Ensure the new reply appears in the thread list
    await expect(threadChatItemById(mockNewThread.id)).toBeVisible();
  });
});
