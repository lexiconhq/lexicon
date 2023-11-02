import { generatePollMarkdown } from '../generatePollMarkdown';

function removeLineBreaks(text: string) {
  return text.replace(/\r?\n|\r/g, '');
}

it('should generate the right makdown format based on poll settings', () => {
  let regularPoll = generatePollMarkdown({
    chartType: 'bar',
    options: ['Banana', 'Apple'],
    type: 'regular',
    results: 'always',
    index: 1,
  });

  expect(removeLineBreaks(regularPoll)).toBe(
    '[poll name=poll1 type=regular results=always chartType=bar]' +
      '- Banana' +
      '- Apple' +
      '[/poll]',
  );

  let multipleChoicePoll = generatePollMarkdown({
    chartType: 'bar',
    options: ['Banana', 'Apple', 'Mango'],
    type: 'multiple',
    results: 'always',
    minChoice: 1,
    maxChoice: 2,
    index: 1,
  });

  expect(removeLineBreaks(multipleChoicePoll)).toBe(
    '[poll name=poll1 type=multiple results=always chartType=bar min=1 max=2]' +
      '- Banana' +
      '- Apple' +
      '- Mango' +
      '[/poll]',
  );

  let advancedSettingsPoll = generatePollMarkdown({
    chartType: 'pie',
    options: ['Banana', 'Apple', 'Grape', 'Melon'],
    type: 'regular',
    results: 'on_vote',
    title: 'Fruit',
    closeDateTime: '2023-10-20T12:00:38.000Z',
    groups: ['admins', 'moderators'],
    index: 2,
  });

  expect(removeLineBreaks(advancedSettingsPoll)).toBe(
    '[poll name=poll2 type=regular results=on_vote chartType=pie groups=admins,moderators close=2023-10-20T12:00:38.000Z]' +
      '# Fruit' +
      '- Banana' +
      '- Apple' +
      '- Grape' +
      '- Melon' +
      '[/poll]',
  );

  let numberRatingPoll = generatePollMarkdown({
    chartType: 'bar',
    options: [],
    type: 'number',
    results: 'always',
    minChoice: 1,
    maxChoice: 10,
    step: 2,
    isPublic: true,
    index: 1,
  });

  expect(removeLineBreaks(numberRatingPoll)).toBe(
    '[poll name=poll1 type=number results=always chartType=bar min=1 max=10 step=2 public=true]' +
      '[/poll]',
  );
});
