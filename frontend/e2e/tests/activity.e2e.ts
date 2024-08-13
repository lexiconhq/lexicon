import { by, expect, element } from 'detox';

import { waitTabProfile } from '../helpers';

describe('Activity', () => {
  it("should correctly show the user's activity", async () => {
    await waitTabProfile();
    await expect(element(by.id('Home:PostList'))).toBeVisible();

    await expect(element(by.id('Author:Avatar')).atIndex(0)).toBeVisible();
    await element(by.id('Author:Avatar')).atIndex(0).tap();

    await expect(element(by.id('UserInformation:PostList'))).toBeVisible();
    await element(by.text('Detox Test')).atIndex(0).tap();
    await expect(element(by.id('PostDetail:List'))).toBeVisible();
  });
});
