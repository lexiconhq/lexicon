import { by, element, waitFor } from 'detox';

export async function waitTabProfile() {
  await waitFor(element(by.id('Tab:Profile')))
    .toBeVisible()
    .withTimeout(7000);
}
