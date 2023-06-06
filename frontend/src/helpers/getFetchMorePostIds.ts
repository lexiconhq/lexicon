type Params = { stream: Array<number> } & (
  | { type: 'older'; firstLoadedPostIndex: number }
  | { type: 'newer'; lastLoadedPostIndex: number }
);

const LOAD_MORE_POST_COUNT = 10;
const START_INDEX = 0;

export function getFetchMorePostIds(params: Params) {
  const { stream } = params;
  const totalPostCount = stream.length;
  let nextFirstLoadedPostIndex;
  let nextLastLoadedPostIndex;

  // Index range to fetch newer posts
  if (params.type === 'newer') {
    const { lastLoadedPostIndex } = params;
    nextFirstLoadedPostIndex = lastLoadedPostIndex + 1;
    let newDataCount = Math.min(
      LOAD_MORE_POST_COUNT,
      totalPostCount - nextFirstLoadedPostIndex,
    );
    nextLastLoadedPostIndex = nextFirstLoadedPostIndex + newDataCount;
  } else {
    // Index range to fetch older posts
    const { firstLoadedPostIndex } = params;
    nextLastLoadedPostIndex = firstLoadedPostIndex;
    let newDataCount = Math.min(
      LOAD_MORE_POST_COUNT,
      totalPostCount - nextLastLoadedPostIndex,
    );
    nextFirstLoadedPostIndex = Math.max(
      START_INDEX,
      nextLastLoadedPostIndex - newDataCount,
    );
  }

  let postIds = stream.slice(nextFirstLoadedPostIndex, nextLastLoadedPostIndex);
  /**
   * The last index is not included in Array.slice(), so
   * we need to substract 1 from nextLastLoadedPostIndex
   */
  nextLastLoadedPostIndex -= 1;
  return { nextFirstLoadedPostIndex, nextLastLoadedPostIndex, postIds };
}
