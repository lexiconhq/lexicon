import { getTopicPostPath } from '../helpers';

it('Have input post and pointer', () => {
  const inputPost = [2, 3, 4];
  const postPointer = 2;
  const expectedOutput = '/posts';
  let topicUrl = getTopicPostPath(inputPost, postPointer);
  expect(topicUrl).toEqual(expectedOutput);
});

it('Have input post without pointer', () => {
  const inputPost = [2, 3, 4];
  const postPointer = undefined;
  const expectedOutput = '/posts';
  let topicUrl = getTopicPostPath(inputPost, postPointer);
  expect(topicUrl).toEqual(expectedOutput);
});

it('Have input post pointer', () => {
  const inputPost = undefined;
  const postPointer = 2;
  const expectedOutput = '/2';
  let topicUrl = getTopicPostPath(inputPost, postPointer);
  expect(topicUrl).toEqual(expectedOutput);
});

it('Does not have input', () => {
  const inputPost = undefined;
  const postPointer = undefined;
  const expectedOutput = '';
  let topicUrl = getTopicPostPath(inputPost, postPointer);
  expect(topicUrl).toEqual(expectedOutput);
});
