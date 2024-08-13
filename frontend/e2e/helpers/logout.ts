import { by, element } from 'detox';

import { waitTabProfile } from './tab';

export async function logout() {
  await waitTabProfile();

  await element(by.id('Tab:Profile')).tap();

  await element(by.id('Profile:ScrollView')).scrollTo('bottom');
  await element(by.id('Profile:MenuItem:Logout')).tap();
}
