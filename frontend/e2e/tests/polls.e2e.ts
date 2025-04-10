import { by, element, expect } from 'detox';

import {
  createPollOptions,
  createPost,
  redirectNewTopic,
  waitTabProfile,
} from '../helpers';
import { mockNewTopicWithPoll } from '../rest-mock/data';

async function createPoll() {
  await expect(element(by.id('NewPoll:SafeAreaView'))).toBeVisible();
  await createPollOptions();

  const buttonSetting = element(by.id('NewPoll:Button:AdvancedSettings'));
  await waitFor(buttonSetting).toBeVisible().withTimeout(1000);
  await buttonSetting.tap();
  await element(by.id('NewPoll:ScrollView')).scrollTo('bottom');

  await expect(element(by.id('NewPoll:TextInput:Title'))).toBeVisible();
  await element(by.id('NewPoll:TextInput:Title')).replaceText('Favorite Fruit');
  await element(by.text('Done')).tap();
}

describe('Polls', () => {
  it('should create a new post with poll', async () => {
    await waitTabProfile();

    await redirectNewTopic();

    await expect(element(by.id('NewPost:TextInput:Title'))).toBeVisible();
    await element(by.id('NewPost:TextInput:Title')).typeText(
      mockNewTopicWithPoll.title,
    );

    await expect(element(by.id('NewPost:Button:Channel'))).toBeVisible();
    await element(by.id('NewPost:Button:Channel')).tap();
    await element(by.text('Lexicon UAT')).atIndex(0).tap();

    await expect(element(by.id('NewPost:TextArea'))).toBeVisible();
    await element(by.id('NewPost:TextArea')).tap();

    await element(by.id('BottomMenu:ScrollView')).scrollTo('right');

    await element(by.id('BottomMenu:IconPoll')).atIndex(0).tap();

    await createPoll();
    await expect(element(by.id('PollChoiceCard:View'))).toBeVisible();

    await createPost();
    await expect(element(by.id('PostDetail:List'))).toBeVisible();
  });

  it('should be able to interact with poll', async () => {
    await expect(element(by.id('PollPreview:View'))).toBeVisible();

    // Vote poll
    await element(by.text('Banana')).tap();
    await expect(element(by.id('StackedAvatars:Button'))).toBeVisible();
    await expect(element(by.text('100%'))).toBeVisible();
    await expect(element(by.text('Total: 1 voter'))).toBeVisible();

    // Undo vote poll
    await expect(element(by.text('Undo Vote'))).toBeVisible();
    await element(by.text('Undo Vote')).tap();
    await expect(element(by.text('100%'))).not.toBeVisible();
    await expect(element(by.id('StackedAvatars:Button'))).not.toBeVisible();
    await expect(element(by.text('Total: 0 voter'))).toBeVisible();

    // Close poll
    await expect(element(by.text('Close Poll'))).toBeVisible();
    await element(by.text('Close Poll')).tap();
    await expect(element(by.text('Open Poll'))).toBeVisible();
    await element(by.text('Open Poll')).tap();
  });

  it('should be able to edit poll', async () => {
    await element(by.id('HeaderItem:IconOnly')).tap();
    await element(by.text('Edit Post')).tap();
    await expect(element(by.id('NewPost:SafeAreaView'))).toBeVisible();

    await element(by.id('PollChoiceCard:Icon:Edit')).tap();
    await expect(element(by.id('NewPoll:SafeAreaView'))).toBeVisible();

    await element(by.id('NewPoll:Button:AddOption')).multiTap(2);
    await element(by.id('NewPoll:TextInput:Options'))
      .atIndex(3)
      .replaceText('Grape');
    await element(by.text('Done')).tap();
    await expect(element(by.id('PollChoiceCard:View'))).toBeVisible();

    await createPost();
    await expect(element(by.id('PostDetail:List'))).toBeVisible();

    await expect(element(by.text('Grape'))).toBeVisible();
  });
});
