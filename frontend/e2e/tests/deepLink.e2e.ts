import { by, element, expect } from 'detox';

import { redirectToApp, waitTabProfile } from '../helpers';

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
});
