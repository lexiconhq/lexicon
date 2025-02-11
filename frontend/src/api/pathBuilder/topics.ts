import { RestLink } from 'apollo-link-rest';

import { parseTopicUrl } from './helper';

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

export function topicsPathBuilder({ args }: RestLink.PathBuilderProps) {
  const { page, sort, topPeriod, tag, categoryId } = args;

  const filterInput: FilterInput = { sort, topPeriod, tag, categoryId };

  const queryParams = new URLSearchParams();

  queryParams.append('page', page || 0);

  return `/${parseTopicUrl(filterInput)}.json?${queryParams.toString()}`;
}
