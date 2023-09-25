import { ERROR_PAGINATION } from '../../constants';
import { getLatestApolloId, mergeReferenceData } from '../paginationHandler';

it('should be latest get post Id from apollo cache merge', () => {
  const listPosts = [
    { __ref: 'Post:598854' },
    { __ref: 'Post:612147' },
    { __ref: 'Post:620179' },
    { __ref: 'Post:620200' },
    { __ref: 'Post:647845' },
    { __ref: 'Post:651859' },
    { __ref: 'Post:675239' },
    { __ref: 'Post:675375' },
    { __ref: 'Post:682963' },
    { __ref: 'Post:700793' },
  ];

  const IncorrectFormatListPosts = [
    { __ref: 'Post133332' },
    { __ref: 'Post612147' },
    { __ref: 'Post620179' },
    { __ref: 'Post620200' },
    { __ref: 'Post647845' },
    { __ref: 'Post651859' },
    { __ref: 'Post675239' },
    { __ref: 'Post675375' },
    { __ref: 'Post682963' },
    { __ref: 'Post700793' },
  ];

  expect(getLatestApolloId(listPosts)).toBe(700793);

  expect(getLatestApolloId(IncorrectFormatListPosts)).toBe(undefined);
});

describe('mergeReferenceData', () => {
  it('should append incoming data if last existing post ID is less than last incoming post ID', () => {
    const existing = [{ __ref: 'Post:1' }, { __ref: 'Post:2' }];
    const incoming = [{ __ref: 'Post:3' }, { __ref: 'Post:4' }];
    const lastExisting = 2;
    const lastIncoming = 4;

    const merged = mergeReferenceData({
      existing,
      incoming,
      lastExisting,
      lastIncoming,
    });

    expect(merged).toEqual([...existing, ...incoming]);
  });

  it('should prepend incoming data if last existing post ID is greater than last incoming post ID', () => {
    const existing = [{ __ref: 'Post:3' }, { __ref: 'Post:4' }];
    const incoming = [{ __ref: 'Post:1' }, { __ref: 'Post:2' }];
    const lastExisting = 4;
    const lastIncoming = 2;

    const merged = mergeReferenceData({
      existing,
      incoming,
      lastExisting,
      lastIncoming,
    });

    expect(merged).toEqual([...incoming, ...existing]);
  });
  it('should show alert when compare string id', () => {
    const existing = [{ __ref: 'Post:A1' }, { __ref: 'Post:A2' }];
    const incoming = [{ __ref: 'Post:A3' }, { __ref: 'Post:A4' }];
    const lastExisting = undefined;
    const lastIncoming = undefined;
    const mockAlert = jest.fn();

    mergeReferenceData({
      existing,
      incoming,
      lastExisting,
      lastIncoming,
      mockAlert,
    });
    expect(mockAlert).toBeCalled();
    expect(mockAlert).toBeCalledWith(ERROR_PAGINATION);
  });

  it('should show alert when compare cuid', () => {
    const existing = [
      { __ref: 'Post:cl9s74pg500051iqsvqmqrbzu' },
      { __ref: 'Post:clhfy59y8000008md9bfe32vh' },
    ];
    const incoming = [
      { __ref: 'Post:clhfzwvoy000008lfcdvf1utb' },
      { __ref: 'Post:clhfzx0wr000108lffymmbsi0' },
    ];
    const lastExisting = undefined;
    const lastIncoming = undefined;
    const mockAlert = jest.fn();
    mergeReferenceData({
      existing,
      incoming,
      lastExisting,
      lastIncoming,
      mockAlert,
    });
    expect(mockAlert).toBeCalled();
    expect(mockAlert).toBeCalledWith(ERROR_PAGINATION);
  });
});
