import { by, element } from 'detox';

export async function createPollOptions() {
  await element(by.id('NewPoll:TextInput:Options'))
    .atIndex(0)
    .replaceText('Apple');
  await element(by.id('NewPoll:Button:AddOption')).multiTap(2);
  await element(by.id('NewPoll:TextInput:Options'))
    .atIndex(1)
    .replaceText('Banana');
  await element(by.id('NewPoll:Button:AddOption')).multiTap(2);
  await element(by.id('NewPoll:TextInput:Options'))
    .atIndex(2)
    .typeText('Mango\n');
}
