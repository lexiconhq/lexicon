import {
  ActionsSummary,
  ActionsSummaryHandler,
} from '../postDetailContentHandler';

jest.mock('expo-linking');

describe('actions summary handler', () => {
  let actionsSummary: Array<ActionsSummary>;
  it('should return default when param is null', () => {
    expect(ActionsSummaryHandler(null)).toEqual({
      likeCount: 0,
      isLiked: false,
      canFlag: true,
    });
  });

  it('should return canFlag is false when actionsSummary contains flag ids with acted is true', () => {
    actionsSummary = [
      { id: 3, count: null, acted: true },
      { id: 4, count: null, acted: true },
      { id: 7, count: null, acted: true },
      { id: 8, count: null, acted: true },
    ];
    expect(ActionsSummaryHandler([actionsSummary[0]]).canFlag).toBe(false);
    expect(ActionsSummaryHandler([actionsSummary[1]]).canFlag).toBe(false);
    expect(ActionsSummaryHandler([actionsSummary[2]]).canFlag).toBe(false);
    expect(ActionsSummaryHandler([actionsSummary[3]]).canFlag).toBe(false);
    expect(ActionsSummaryHandler(actionsSummary).canFlag).toBe(false);

    actionsSummary = [
      { id: 3, count: null, acted: false },
      { id: 4, count: null, acted: true },
      { id: 7, count: null, acted: false },
      { id: 8, count: null, acted: false },
    ];
    expect(ActionsSummaryHandler(actionsSummary).canFlag).toBe(false);
  });

  it('should return canFlag is true when actionsSummary contains flag ids with acted props is falsy', () => {
    actionsSummary = [
      { id: 1, count: null, acted: true },
      { id: 2, count: null, acted: true },
      { id: 3, count: null, acted: false },
      { id: 4, count: null, acted: null },
      { id: 6, count: null, acted: true },
    ];
    expect(ActionsSummaryHandler(actionsSummary.slice(1, 2)).canFlag).toBe(
      true,
    );
    expect(ActionsSummaryHandler(actionsSummary).canFlag).toBe(true);
  });

  it('should return likeCount and isLiked based on given params', () => {
    actionsSummary = [
      { id: 2, count: 10, acted: true },
      { id: 2, count: 8, acted: true },
    ];
    let result = ActionsSummaryHandler(actionsSummary);
    expect(result.isLiked).toBe(true);
    expect(result.likeCount).toBe(8);

    actionsSummary = [
      { id: 1, count: 10, acted: true },
      { id: 2, count: 5, acted: false },
    ];
    result = ActionsSummaryHandler(actionsSummary);
    expect(result.isLiked).toBe(false);
    expect(result.likeCount).toBe(5);
  });
});
