import { FilterInput, parseTopicUrl } from '..';

it('latest', () => {
  const filterInput: FilterInput = {
    sort: 'LATEST',
  };
  const expectedOutput = 'latest';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('top', () => {
  const filterInput: FilterInput = {
    sort: 'TOP',
  };
  const expectedOutput = 'top';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('top daily', () => {
  const filterInput: FilterInput = {
    sort: 'TOP',
    topPeriod: 'DAILY',
  };
  const expectedOutput = 'top/daily';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('top monthly', () => {
  const filterInput: FilterInput = {
    sort: 'TOP',
    topPeriod: 'MONTHLY',
  };
  const expectedOutput = 'top/monthly';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('latest art tag', () => {
  const filterInput: FilterInput = {
    sort: 'LATEST',
    tag: 'art',
  };
  const expectedOutput = 'tag/art/l/latest';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('latest art tag with game category', () => {
  const filterInput: FilterInput = {
    sort: 'LATEST',
    tag: 'art',
    categoryId: 2,
  };
  const expectedOutput = 'tags/c/2/art/l/latest';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('top art tag with game category with no daily because there is tag', () => {
  const filterInput: FilterInput = {
    sort: 'TOP',
    tag: 'art',
    categoryId: 2,
    topPeriod: 'DAILY',
  };
  const expectedOutput = 'tags/c/2/art/l/top';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});

it('latest with game category', () => {
  const filterInput: FilterInput = {
    sort: 'LATEST',
    categoryId: 2,
  };
  const expectedOutput = 'c/2/l/latest';
  let topicUrl = parseTopicUrl(filterInput);
  expect(topicUrl).toEqual(expectedOutput);
});
