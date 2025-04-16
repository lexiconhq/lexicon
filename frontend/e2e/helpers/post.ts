import { by, device, element, expect } from 'detox';

export async function createPost() {
  await expect(element(by.text('Next'))).toBeVisible();
  await element(by.text('Next')).tap();

  let postButtonTestId = '';
  if (device.getPlatform() === 'android') {
    postButtonTestId = 'HeaderItem:IconOnly';
  } else {
    postButtonTestId = 'HeaderItem:LabelOnly';
  }
  await expect(element(by.id(postButtonTestId))).toBeVisible();
  await element(by.id(postButtonTestId)).tap();
}

export async function redirectPostDetail() {
  const post = element(by.text('Detox Test')).atIndex(0);
  await waitFor(post)
    .toBeVisible()
    .whileElement(by.id('Home:PostList'))
    .scroll(200, 'down');
  await post.tap();
  await expect(element(by.id('PostDetail:List'))).toBeVisible();
}

export async function redirectNewTopic() {
  await expect(element(by.id('Home:PostList'))).toBeVisible();

  if (device.getPlatform() === 'android') {
    await expect(element(by.id('FloatingButton'))).toBeVisible();
    await element(by.id('FloatingButton')).tap();
  } else {
    await expect(element(by.id('HomeNavBar:Icon:Add'))).toBeVisible();
    await element(by.id('HomeNavBar:Icon:Add')).tap();
  }
}
