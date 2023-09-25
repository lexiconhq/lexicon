import { getTopicPostPath } from '../helpers';

it('should return posts when the input is array of numbers', () => {
  expect(getTopicPostPath([2, 3, 4])).toEqual('/posts');
});

it('should return post pointer when the input is number', () => {
  expect(getTopicPostPath(2)).toEqual('/2');
});

it('should return empty string when the input is undefined', () => {
  expect(getTopicPostPath(undefined)).toEqual('');
});
