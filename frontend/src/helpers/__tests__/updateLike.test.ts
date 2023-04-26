import {
  getUpdatedLikeCount,
  getUpdatedSummaryOnToggleLike,
  firstLikeActivitySummary,
  PostActionsSummary,
} from '../updateLike';
import { ActionsSummaryType } from '../postDetailContentHandler';

describe('Get updated like props', () => {
  it('should return the value of previousCount -1 when liked value is false', () => {
    const previousCount = 2;
    expect(getUpdatedLikeCount({ liked: false, previousCount })).toEqual(
      previousCount - 1,
    );
  });
  it('should return the value of previousCount +1 when liked value is true', () => {
    const previousCount = 2;
    expect(getUpdatedLikeCount({ liked: true, previousCount })).toEqual(
      previousCount + 1,
    );
  });
  it('should return 0 when liked value is false and previous count is less than 1', () => {
    expect(getUpdatedLikeCount({ liked: false, previousCount: 0 })).toEqual(0);
    expect(getUpdatedLikeCount({ liked: false, previousCount: -9 })).toEqual(0);
  });
});

describe('Get updated summary on toggle like', () => {
  it('should only return firstLikeActivity when action summary is not found', () => {
    const previousCount = 10;
    const expectedActionsSummary = [firstLikeActivitySummary];
    expect(
      getUpdatedSummaryOnToggleLike({
        cachedActionsSummary: null,
        liked: true,
        previousCount,
      }),
    ).toEqual(expectedActionsSummary);
    expect(
      getUpdatedSummaryOnToggleLike({
        cachedActionsSummary: null,
        liked: false,
      }),
    ).toEqual(expectedActionsSummary);
  });

  it('should only return existing activity with firstLikeActivity when like action is not found', () => {
    const mockedActionsSummary: PostActionsSummary = [
      {
        __typename: 'ActionSummary',
        id: ActionsSummaryType.Bookmark,
        acted: true,
      },
    ];
    const expectedActionsSummary = [
      ...mockedActionsSummary,
      firstLikeActivitySummary,
    ];
    expect(
      getUpdatedSummaryOnToggleLike({
        cachedActionsSummary: mockedActionsSummary,
        liked: true,
      }),
    ).toEqual(expectedActionsSummary);

    expect(
      getUpdatedSummaryOnToggleLike({
        cachedActionsSummary: mockedActionsSummary,
        liked: false,
      }),
    ).toEqual(expectedActionsSummary);
  });

  describe('should return existing activity with modified like activity when like action is found', () => {
    const count = 5;
    const previousCount = 10;

    const mockedActionsSummary: PostActionsSummary = [
      { ...firstLikeActivitySummary, count },
    ];

    const likeAction = { ...firstLikeActivitySummary, acted: true, count };
    const unlikeAction = { ...firstLikeActivitySummary, acted: false, count };

    it('should calculate likeCount based on previousCount params when previousCount is defined', () => {
      const likeActionResult = { ...likeAction, count: previousCount + 1 };
      const unlikeActionResult = { ...unlikeAction, count: previousCount - 1 };

      expect(
        getUpdatedSummaryOnToggleLike({
          cachedActionsSummary: mockedActionsSummary,
          liked: true,
          previousCount,
        }),
      ).toEqual([likeActionResult]);

      expect(
        getUpdatedSummaryOnToggleLike({
          cachedActionsSummary: mockedActionsSummary,
          liked: false,
          previousCount,
        }),
      ).toEqual([unlikeActionResult]);
    });

    it('should calculate likeCount based on count prop in Actions Summary when previousCount is undefined', () => {
      const likeActionResult = { ...likeAction, count: count + 1 };
      const unlikeActionResult = { ...unlikeAction, count: count - 1 };

      expect(
        getUpdatedSummaryOnToggleLike({
          cachedActionsSummary: mockedActionsSummary,
          liked: true,
        }),
      ).toEqual([likeActionResult]);

      expect(
        getUpdatedSummaryOnToggleLike({
          cachedActionsSummary: mockedActionsSummary,
          liked: false,
        }),
      ).toEqual([unlikeActionResult]);
    });
  });
});
