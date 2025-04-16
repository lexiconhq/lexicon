import { by, element, expect } from 'detox';

export async function openToolTipMessageReply() {
  const buttonToolTip = element(by.id('ToolTip:AddIcon'));
  await expect(buttonToolTip).toBeVisible();
  await buttonToolTip.tap();
}
