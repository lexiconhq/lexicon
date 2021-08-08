export type FilterInput = {
  sort: 'TOP' | 'LATEST';
  topPeriod?:
    | 'ALL'
    | 'DAILY'
    | 'MONTHLY'
    | 'QUATERLY'
    | 'WEEKLY'
    | 'YEARLY'
    | null;
  tag?: string | null;
  categoryId?: number | null;
};

let parseTopicUrl = ({ sort, topPeriod, tag, categoryId }: FilterInput) => {
  let sortBy = sort.toLowerCase();
  if (sort === 'TOP' && topPeriod && !tag) {
    sortBy = `${sortBy}/${topPeriod.toLowerCase()}`;
  }
  if (categoryId) {
    if (tag) {
      sortBy = `tags/c/${categoryId}/${tag}/l/${sortBy}`;
    } else {
      sortBy = `c/${categoryId}/l/${sortBy}`;
    }
  } else {
    if (tag) {
      sortBy = `tag/${tag}/l/${sortBy}`;
    }
  }
  return sortBy;
};

export { parseTopicUrl };
