import { getTopicPostPath, validateTopicDetailOptionalArgs } from '..';

describe('getTopicPostPath', () => {
  it('should return an empty string when input is undefined', () => {
    expect(getTopicPostPath()).toBe('');
  });

  it('should return a path with a single post number', () => {
    const postNumber = 123;
    expect(getTopicPostPath(postNumber)).toBe('/123');
  });

  it('should return a path for multiple posts when input is an array', () => {
    const postIds = [456, 789];
    expect(getTopicPostPath(postIds)).toBe('/posts');
  });

  it('should return an empty string when input is undefined', () => {
    expect(getTopicPostPath(undefined)).toBe('');
  });
});

describe('validateTopicDetailOptionalArgs', () => {
  it('should return an error to only provide post id or number', () => {
    const args = {
      postIds: [1],
      postNumber: 1,
    };
    expect(() => validateTopicDetailOptionalArgs(args)).toThrowError(
      'Please provide either only the post IDs or the post number',
    );
  });

  it('should return an error to only provide includeFirstPost', () => {
    const args = {
      postIds: [1],
      includeFirstPost: true,
    };
    expect(() => validateTopicDetailOptionalArgs(args)).toThrowError(
      'The first post cannot be included when post IDs are provided',
    );
  });

  it('should not return error', () => {
    const args = {};
    const args1 = { postIds: [1, 2] };
    const args2 = { postNumber: 123 };
    expect(() => validateTopicDetailOptionalArgs(args)).not.toThrow();
    expect(() => validateTopicDetailOptionalArgs(args1)).not.toThrow();
    expect(() => validateTopicDetailOptionalArgs(args2)).not.toThrow();
  });
});
