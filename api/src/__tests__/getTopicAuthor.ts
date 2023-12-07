import {
  getTopicAuthor,
  getTopicAuthorUserId,
} from '../helpers/getTopicAuthor';
import { PosterUnion } from '../types';

function getUserWithId(userId: number, description: string): PosterUnion {
  return {
    userId,
    description,
    extras: null,
    user: {
      id: userId,
      name: '',
      username: '',
      avatarTemplate: '',
    },
  };
}

function getUserWithObject(userId: number, description: string): PosterUnion {
  return {
    description,
    extras: null,
    user: {
      id: userId,
      username: 'bill',
      name: 'Bill',
      avatarTemplate: 'avatar.jpg',
    },
  };
}

describe('getTopicAuthor', () => {
  it('returns the author of the topic when present', () => {
    const posters: Array<PosterUnion> = [
      getUserWithId(1, 'Frequent Poster'),
      getUserWithId(2, 'Most Recent Poster'),
      getUserWithId(3, 'Frequent Poster, Original Poster'),
    ];

    expect(getTopicAuthor(posters)).toEqual(posters[2]);
  });

  it('returns the first author when multiple are somehow present', () => {
    const posters: Array<PosterUnion> = [
      getUserWithId(1, 'Original Poster'),
      getUserWithId(2, 'Most Recent Poster'),
      getUserWithId(3, 'Frequent Poster, Original Poster'),
    ];

    expect(getTopicAuthor(posters)).toEqual(posters[0]);
  });

  it('returns undefined when no author is present', () => {
    const posters: Array<PosterUnion> = [
      getUserWithId(1, 'Frequent Poster'),
      getUserWithId(2, 'Frequent Poster'),
      getUserWithId(3, 'Frequent Poster, Most Recent Poster'),
    ];

    expect(getTopicAuthor(posters)).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(getTopicAuthor([])).toBeUndefined();
  });
});

describe('getTopicAuthorUserId', () => {
  it(`returns the author's userId when present`, () => {
    const posters: Array<PosterUnion> = [
      getUserWithId(1, 'Frequent Poster'),
      getUserWithId(2, 'Most Recent Poster'),
      getUserWithId(3, 'Frequent Poster, Original Poster'),
    ];
    expect(getTopicAuthorUserId(posters)).toEqual(3);
  });

  it(`returns the author's user.id when present`, () => {
    const posters: Array<PosterUnion> = [
      getUserWithId(1, 'Frequent Poster'),
      getUserWithId(2, 'Most Recent Poster'),
      getUserWithObject(3, 'Frequent Poster, Original Poster'),
    ];
    expect(getTopicAuthorUserId(posters)).toEqual(3);
  });

  it(`prefers the author's userId when the user object is set too`, () => {
    const posters: Array<PosterUnion> = [
      getUserWithId(1, 'Frequent Poster'),
      getUserWithId(2, 'Most Recent Poster'),
      {
        ...getUserWithObject(
          Number.MAX_VALUE,
          'Frequent Poster, Original Poster',
        ),
        userId: 3,
      },
    ];
    expect(getTopicAuthorUserId(posters)).toEqual(3);
  });
});
