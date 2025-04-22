import {
  extractPathname,
  getValidChatDetailParams,
  getValidDetailParams,
  isRouteBesidePost,
} from '../linking';

jest.mock('expo-linking');

it('should extract post ID and number and convert it to number', () => {
  const detailParams = getValidDetailParams(['t', 'slug', '12', '15']);
  expect(detailParams?.topicId).toBe(12);
  expect(detailParams?.postNumber).toBe(15);

  expect(getValidDetailParams(['t', 'slug', 'a', '12'])).toBeFalsy();

  expect(getValidDetailParams(['t', 'slug', '12', 'post'])?.postNumber).toBe(1);

  expect(getValidDetailParams([])).toBeFalsy();
});

it('should extract pathname from URL and check the format', () => {
  const url1 = 'https://test.com';
  const url2 = 'https://test.com/12/15';
  const url3 = 'https://test.com/t/12/15';
  const url4 = 'https://test.com/t/test/12/15';
  const url5 = 'https://test.com/c/general/4';

  expect(extractPathname(url1)).toBeFalsy();

  expect(extractPathname(url2)).toBeFalsy();

  expect(extractPathname(url3)).toBeFalsy();

  expect(extractPathname(url4)).toBe('t/test/12/15');

  expect(extractPathname(url5)).toBeFalsy();
});

it('should check is route post detail or not', () => {
  expect(isRouteBesidePost('post-detail')).toBeFalsy();

  expect(isRouteBesidePost('message-detail')).toBeTruthy();

  expect(isRouteBesidePost('random-detail')).toBeTruthy();
});

describe('getValidChatDetailParams', () => {
  it('should return channelId and messageId for valid 2-segment URLs', () => {
    expect(getValidChatDetailParams(['c', '12', '34'])).toEqual({
      channelId: 12,
      messageId: 34,
    });
  });

  it('should return channelId, threadId, and messageId for valid 3-segment URLs', () => {
    expect(getValidChatDetailParams(['c', '12', '56', '78'])).toEqual({
      channelId: 12,
      threadId: 56,
      messageId: 78,
    });
  });

  it('should return undefined for invalid numbers', () => {
    expect(getValidChatDetailParams(['c', 'abc', '34'])).toBeFalsy();
    expect(getValidChatDetailParams(['c', '-1', '34'])).toBeFalsy();
  });

  it('should return undefined for missing parameters', () => {
    expect(getValidChatDetailParams(['c', '12'])).toBeFalsy();
    expect(getValidChatDetailParams(['c'])).toBeFalsy();
    expect(getValidChatDetailParams([])).toBeFalsy();
  });

  it('should return undefined for too many parameters', () => {
    expect(getValidChatDetailParams(['c', '12', '34', '56', '78'])).toBeFalsy();
  });

  it('should return undefined if any parameter is NaN', () => {
    expect(getValidChatDetailParams(['c', '12', 'notANumber'])).toBeFalsy();
    expect(getValidChatDetailParams(['c', '12', '34', 'NaN'])).toBeFalsy();
  });
});
