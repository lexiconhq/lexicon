import { AxiosError } from 'axios';

import { LikableEntity, likeErrorHandler } from '../likeErrorHandler';

const mockAxiosError: AxiosError = {
  name: 'AxiosError',
  message: 'Request failed with status code 403',
  isAxiosError: true,
  config: {},
  response: {
    status: 403,
    data: {},
    statusText: 'Forbidden',
    headers: {},
    config: {},
  },
  toJSON: function () {
    throw new Error('custom json function');
  },
};

const actionsSummary = [
  {
    id: 1,
    hidden: false,
    acted: false,
    canUndo: false,
    canAct: true,
    count: 1,
  },
  {
    id: 2,
    hidden: false,
    acted: true,
    canUndo: false,
    canAct: true,
    count: 1,
  },
  {
    id: 2,
    hidden: false,
    acted: false,
    canUndo: false,
    canAct: true,
    count: 1,
  },
];
const likableEntityPost: LikableEntity = 'post';
const like = false;

describe('likeErrorHandler', () => {
  it('should throw error when like action summary is not provided for the post author', () => {
    expect(() =>
      likeErrorHandler(mockAxiosError, {
        actionsSummary: [actionsSummary[0]],
        likableEntity: likableEntityPost,
        like,
      }),
    ).toThrowError(
      `You're not permitted to do like actions to your own ${likableEntityPost}.`,
    );
  });

  it(`should throw error You've liked this post when like again same post`, () => {
    expect(() =>
      likeErrorHandler(mockAxiosError, {
        actionsSummary,
        likableEntity: likableEntityPost,
        like: !like,
      }),
    ).toThrowError(`You've liked this ${likableEntityPost} before.`);
  });

  it(`should throw error when unlike post which already unlike`, () => {
    expect(() =>
      likeErrorHandler(mockAxiosError, {
        actionsSummary: [actionsSummary[2]],
        likableEntity: likableEntityPost,
        like: like,
      }),
    ).toThrowError(
      `You can't unlike a ${likableEntityPost} you haven't liked before.`,
    );
  });

  it(`should throw error because pass limit unlike`, () => {
    expect(() =>
      likeErrorHandler(mockAxiosError, {
        actionsSummary: [actionsSummary[1]],
        likableEntity: likableEntityPost,
        like: like,
      }),
    ).toThrowError(
      `You've passed the time limit to unlike this ${likableEntityPost}.`,
    );
  });
});
