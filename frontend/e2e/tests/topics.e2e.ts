import { by, expect, element } from 'detox';

import {
  createPost,
  waitTabProfile,
  redirectPostDetail,
  hyperLinkScene,
} from '../helpers';
import {
  mockSearchTopics,
  siteSetting,
  mockPostsReplies,
} from '../apollo-mock/data';

async function fontFormattingTest(
  postReplyTextArea: Detox.IndexableNativeElement,
) {
  await postReplyTextArea.typeText('Test Bold');

  const buttonBold = element(by.id('BottomMenu:IconBold'));
  await expect(buttonBold).toBeVisible();
  await buttonBold.tap();

  await expect(postReplyTextArea).toHaveText(`Test Bold**Change Text**`);

  await postReplyTextArea.clearText();

  const buttonItalic = element(by.id('BottomMenu:IconItalic'));

  await expect(buttonItalic).toBeVisible();
  await buttonItalic.tap();

  await expect(postReplyTextArea).toHaveText(`*Change Text*`);

  await postReplyTextArea.clearText();
  await postReplyTextArea.typeText('Test Quote');
  const buttonQuote = element(by.id('BottomMenu:IconQuote'));

  await expect(buttonQuote).toBeVisible();
  await buttonQuote.tap();

  await expect(postReplyTextArea).toHaveText(`Test Quote\n\n> Quote Text`);

  await postReplyTextArea.clearText();
  await postReplyTextArea.typeText('Test Bullet List');

  const buttonBullet = element(by.id('BottomMenu:IconBulletList'));

  await expect(buttonBullet).toBeVisible();
  await buttonBullet.tap();

  await expect(postReplyTextArea).toHaveText(`Test Bullet List\n\n- List Item`);

  await postReplyTextArea.clearText();
  await postReplyTextArea.typeText('Test Number List');
  const buttonNumber = element(by.id('BottomMenu:IconNumberList'));

  await expect(buttonNumber).toBeVisible();
  await buttonNumber.tap();

  await expect(postReplyTextArea).toHaveText(
    `Test Number List\n\n1. List Item`,
  );
}

const linkButtonBar = async () => {
  if (device.getPlatform() === 'android') {
    await element(by.id('BottomMenu:ScrollView')).scrollToIndex(6);
  } else {
    await element(by.id('BottomMenu:ScrollView')).scrollTo('right');
  }
  await element(by.id('BottomMenu:Link')).tap();

  await hyperLinkScene();
};

describe('Home Screen', () => {
  it('should show Search Topic', async () => {
    await waitTabProfile();
    await expect(element(by.id('Home:PostList'))).toBeVisible();
    await element(by.id('Home:Button:SearchTopic')).tap();

    /**
     * Search Scene
     */
    const searchTextInput = element(by.id('Search:TextInput:Query'));
    await expect(searchTextInput).toBeVisible();

    await searchTextInput.replaceText('welcome');

    await expect(element(by.id('Search:SearchPostList'))).toBeVisible();
    await expect(
      element(by.id(`Search:SearchPostItem:${mockSearchTopics.topics[0].id}`)),
    ).toBeVisible();

    const searchDeleteButton = element(by.id('Search:Button:Delete'));
    await searchDeleteButton.tap();
    await expect(searchTextInput).toHaveText('');

    /**
     * Start new search with error
     */

    await searchTextInput.typeText('a');

    await expect(
      element(
        by.text(
          `Your query must be at least ${siteSetting.minSearchLength} characters long`,
        ),
      ).atIndex(0),
    ).toBeVisible();

    await searchTextInput.replaceText('why');
    await expect(
      element(by.text(`No results found for `)).atIndex(0),
    ).toBeVisible();

    /**
     * Back into Home scene
     */
    const backButton = element(
      by.id(
        device.getPlatform() === 'android'
          ? 'Search:Button:HeaderBackButton'
          : 'Search:Button:Delete',
      ),
    );
    await expect(backButton).toBeVisible();
    await backButton.tap();
  });

  it('should show post list in Home screen', async () => {
    await expect(element(by.id('Home:PostList'))).toBeVisible();
    await element(by.id('HomeNavBar:Button:SelectChannel')).tap();
    await element(by.text('Lexicon UAT')).atIndex(0).tap();
    await expect(element(by.id('Home:PostList'))).toBeVisible();

    await redirectPostDetail();
  });

  it('should reply to a post with font formatting test and link', async () => {
    await expect(element(by.id('PostDetail:Button:Reply'))).toBeVisible();
    await element(by.id('PostDetail:Button:Reply')).tap();

    const replyText = 'Sending a reply.';
    const postReplyTextArea = element(by.id('PostReply:TextArea'));
    await expect(postReplyTextArea).toBeVisible();

    await fontFormattingTest(postReplyTextArea);

    await postReplyTextArea.clearText();
    await postReplyTextArea.replaceText(replyText);
    await linkButtonBar();

    await expect(postReplyTextArea).toBeVisible();

    await expect(postReplyTextArea).toHaveText(
      `${replyText} [test url](https://www.google.com)`,
    );

    await createPost();

    await expect(element(by.id('PostDetail:List'))).toBeVisible();
  });

  it('should edit a post', async () => {
    await element(by.id('HeaderItem:IconOnly')).tap();
    await element(by.text('Edit Post')).tap();

    const postReplyTextArea = element(by.id('NewPost:TextArea'));
    await postReplyTextArea.typeText('. Edit this reply.');

    await createPost();

    await expect(element(by.id('PostDetail:List'))).toBeVisible();
  });

  it('should quote reply to a comment', async () => {
    await element(by.id('Metrics:Replies')).atIndex(1).tap();

    const postReplyTextArea = element(by.id('PostReply:TextArea'));
    const repliedText = mockPostsReplies[2].markdownContent;
    await postReplyTextArea.replaceText(repliedText);

    await createPost();

    await expect(element(by.id('PostDetail:List'))).toBeVisible();

    await element(by.id('PostDetail:List')).scrollTo('bottom');
    await expect(element(by.text(repliedText))).toBeVisible();
  });
});
