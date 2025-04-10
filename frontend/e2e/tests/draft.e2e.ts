import { by, element, expect } from 'detox';

import {
  createPollOptions,
  openToolTipMessageReply,
  redirectNewPrivateMessage,
  redirectNewTopic,
  redirectPostDetail,
  redirectToMessageDetail,
  waitTabProfile,
} from '../helpers';
import {
  mockEditNewTopicDraft,
  mockListPostDrafts,
  mockNewPrivateMessageDraft,
  mockNewTopicDraft,
  mockPostReplyDraft,
  mockPrivateMessageReplyDraft,
} from '../rest-mock/data';

const backButton = element(by.id('HeaderBackButton'));
const buttonSaveDraft = element(by.label('Save as Draft')).atIndex(0);

async function continueFromDraft() {
  const continueFromDraft = element(by.label('Continue from Draft')).atIndex(0);
  await expect(continueFromDraft).toBeVisible();
  await continueFromDraft.tap();
}

async function saveDraft() {
  await expect(backButton).toBeVisible();
  await backButton.tap();

  await expect(buttonSaveDraft).toBeVisible();
  await buttonSaveDraft.tap();
}

async function createPoll() {
  await expect(element(by.id('NewPoll:SafeAreaView'))).toBeVisible();

  await createPollOptions();

  await element(by.text('Done')).tap();
}

async function deleteDraftAction() {
  const buttonDeleteAction = element(by.label('Delete Draft')).atIndex(0);
  await expect(buttonDeleteAction).toBeVisible();
  await buttonDeleteAction.tap();
}

async function removeAllDrafts() {
  for (let draft of mockListPostDrafts) {
    await element(by.id(`PostDraft:IconMore:${draft.title}`)).tap();
    // delete private message reply draft from list
    await deleteDraftAction();
  }
}

describe('Draft Topic', () => {
  const postDetailReplyButton = element(by.id('PostDetail:Button:Reply'));
  const postReplyTextArea = element(by.id('PostReply:TextArea'));

  it('it should create new topic draft', async () => {
    await waitTabProfile();
    await redirectNewTopic();

    // add title and content topic
    const titleTextInput = element(by.id('NewPost:TextInput:Title'));
    await expect(titleTextInput).toBeVisible();
    await titleTextInput.typeText(mockNewTopicDraft.title);

    await expect(element(by.id('NewPost:Button:Channel'))).toBeVisible();
    await element(by.id('NewPost:Button:Channel')).tap();
    await element(by.text('Lexicon UAT')).atIndex(0).tap();

    const contentTextArea = element(by.id('NewPost:TextArea'));
    await contentTextArea.replaceText(mockNewTopicDraft.content);

    // Save new topic as draft

    await saveDraft();
  });
  it('it should create new post reply draft', async () => {
    await redirectPostDetail();

    await expect(postDetailReplyButton).toBeVisible();
    await postDetailReplyButton.tap();

    await expect(postReplyTextArea).toBeVisible();

    await postReplyTextArea.replaceText(mockPostReplyDraft.content);

    // save post reply as draft
    await saveDraft();
    await expect(element(by.id('PostDetail:List'))).toBeVisible();

    // Check draft post reply is created
    await expect(postDetailReplyButton).toBeVisible();
    await postDetailReplyButton.tap();
    await continueFromDraft();

    await expect(postReplyTextArea).toBeVisible();

    await expect(postReplyTextArea).toHaveText(mockPostReplyDraft.content);
  });

  it('it should delete post reply draft', async () => {
    await expect(backButton).toBeVisible();

    // discard draft
    await postReplyTextArea.typeText('test');

    await backButton.tap();

    const discardPostReplyDraft = element(by.label('Discard Changes')).atIndex(
      0,
    );
    await waitFor(discardPostReplyDraft).toBeVisible().withTimeout(3000);
    await discardPostReplyDraft.tap();

    // Check is draft already deleted

    await expect(element(by.id('PostDetail:List'))).toBeVisible();

    await postDetailReplyButton.tap();

    await waitFor(postReplyTextArea).toBeVisible().withTimeout(3000);
    await expect(postReplyTextArea).toHaveText('');

    // Back to Home Scene from Post reply scene
    await backButton.tap();
    await backButton.tap();
  });
});

describe('Draft private message', () => {
  const messageList = element(by.id('Messages:List'));
  const newMessageTextArea = element(by.id('NewMessage:TextArea'));
  const newMessageTextInputTitle = element(by.id('NewMessage:TextInput:Title'));

  const privateMessageReplyTextInput = element(
    by.id('ReplyInputField:TextInput'),
  );

  it('create draft for new private message', async () => {
    await waitTabProfile();
    // Navigate to Message List
    await element(by.id('Tab:Profile')).tap();

    await expect(element(by.id('Profile:MenuItem:Messages'))).toBeVisible();
    await element(by.id('Profile:MenuItem:Messages')).tap();

    await expect(messageList).toBeVisible();

    // Create New Private Message Draft

    await redirectNewPrivateMessage();

    await expect(newMessageTextArea).toBeVisible();

    await newMessageTextArea.replaceText(mockNewPrivateMessageDraft.content);

    await newMessageTextInputTitle.replaceText(
      mockNewPrivateMessageDraft.title,
    );

    await element(by.id('NewMessage:Button:SelectUser')).tap();
    await expect(element(by.id('SelectUser:SafeAreaView'))).toBeVisible();

    await expect(
      element(by.id('UserItem:Author:SelectUser')).atIndex(0),
    ).toBeVisible();
    await element(by.id('UserItem:Author:SelectUser')).atIndex(0).tap();
    await element(by.text('Done')).tap();

    // Save Draft
    await saveDraft();

    await expect(messageList).toBeVisible();
  });

  it('it should create draft for private message reply', async () => {
    await expect(messageList).toBeVisible();
    await redirectToMessageDetail();

    // Create private message reply text
    await expect(privateMessageReplyTextInput).toBeVisible();

    await privateMessageReplyTextInput.replaceText(
      mockPrivateMessageReplyDraft.content,
    );

    // Create Poll
    await openToolTipMessageReply();

    const buttonAddPoll = element(by.id('ToolTip:MenuItem:Poll'));
    await expect(buttonAddPoll).toBeVisible();
    await buttonAddPoll.tap();

    await createPoll();

    const pollCardView = element(by.id('PollChoiceCard:View'));
    await expect(pollCardView).toBeVisible();
    const pollCardTitle = element(by.text('Single Choice')).atIndex(0);
    await expect(pollCardTitle).toBeVisible();
    const pollCardOptions = element(by.text('3 options')).atIndex(0);
    await expect(pollCardOptions).toBeVisible();

    // Save private message reply draft
    await saveDraft();

    // Check private message reply draft is contain text and poll
    await redirectToMessageDetail();

    await expect(privateMessageReplyTextInput).toBeVisible();
    await expect(privateMessageReplyTextInput).toHaveText(
      mockPrivateMessageReplyDraft.content,
    );
    await expect(pollCardTitle).toBeVisible();
    await expect(pollCardOptions).toBeVisible();

    // back to profile scene from message detail
    await backButton.tap();
    await backButton.tap();
  });
});

describe('List Post Draft', () => {
  it('show list post draft', async () => {
    const draftTab = element(by.id('Tab:Draft'));

    // should click draft tab icon and redirect to draft list
    await expect(draftTab).toBeVisible();
    await draftTab.tap();

    // at draft scene should show list draft new topic and private message reply
    await expect(element(by.id('PostDraft:List'))).toBeVisible();
    await expect(
      element(by.text(mockNewPrivateMessageDraft.title)).atIndex(0),
    ).toBeVisible();
    await expect(
      element(by.text(mockNewTopicDraft.title)).atIndex(0),
    ).toBeVisible();
  });

  it('should edit post draft', async () => {
    // Should click menu icon at new topic draft
    const buttonMoreNewPostDraft = element(
      by.id(`PostDraft:IconMore:${mockNewTopicDraft.title}`),
    );
    await buttonMoreNewPostDraft.tap();

    // click edit button
    const buttonEditAction = element(by.label('Edit Draft')).atIndex(0);
    await expect(buttonEditAction).toBeVisible();
    await buttonEditAction.tap();

    // navigate into new topic scene and show draft of new topic
    const titleTextInput = element(by.id('NewPost:TextInput:Title'));
    await expect(titleTextInput).toBeVisible();

    await expect(titleTextInput).toHaveText(mockNewTopicDraft.title);

    await titleTextInput.replaceText(mockEditNewTopicDraft.title);

    const contentTextArea = element(by.id('NewPost:TextArea'));
    await contentTextArea.replaceText(mockEditNewTopicDraft.content);

    // save Edit new topic Draft
    await saveDraft();

    // Check is draft changes at post draft list after edit
    await expect(
      element(by.text(mockEditNewTopicDraft.title)).atIndex(0),
    ).toBeVisible();

    await expect(
      element(by.text(mockEditNewTopicDraft.content)).atIndex(0),
    ).toBeVisible();
  });

  it('should delete post draft', async () => {
    // Open the menu for the newly edited topic draft
    const buttonMoreNewPostDraft = element(
      by.id(`PostDraft:IconMore:${mockEditNewTopicDraft.title}`),
    );
    await buttonMoreNewPostDraft.tap();

    // Delete the new topic draft from the list
    await deleteDraftAction();

    // Ensure the deleted topic draft is no longer visible in the list
    await expect(
      element(by.text(mockEditNewTopicDraft.title)).atIndex(0),
    ).not.toBeVisible();

    // Open the menu for the private message reply draft
    const buttonMorePostReplyDraft = element(
      by.id(`PostDraft:IconMore:${mockListPostDrafts[0].title}`),
    );

    await expect(buttonMorePostReplyDraft).toBeVisible();
    await buttonMorePostReplyDraft.tap();

    // Delete the private message reply draft from the list
    await deleteDraftAction();

    // Ensure the deleted private message reply draft is no longer visible
    await expect(
      element(by.text(mockPrivateMessageReplyDraft.content)).atIndex(0),
    ).not.toBeVisible();

    // Remove all remaining drafts if any are still present
    if (mockListPostDrafts.length > 0) {
      await removeAllDrafts();
    }

    // Verify that the default empty draft message is displayed
    await expect(
      element(by.text('Drafts Will Appear Here')).atIndex(0),
    ).toBeVisible();
  });
});
