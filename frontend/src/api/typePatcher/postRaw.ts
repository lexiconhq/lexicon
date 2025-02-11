import { RestLink } from 'apollo-link-rest';

import { generateMarkdownContent, getMention } from '../../helpers/api';

export const postRawPatcher: RestLink.FunctionalTypePatcher = (data) => {
  return {
    __typename: 'PostRaw',
    raw: data.raw,
  };
};

export const postCookedPatcher: RestLink.FunctionalTypePatcher = (
  data,
  _,
  __,
  context,
) => {
  const raw = context.resolverParams.root?.raw || '';
  const markdownContent = generateMarkdownContent(raw, data.cooked);
  const mentions = getMention(data.cooked) ?? [];

  return {
    __typename: 'PostCooked',
    markdownContent,
    mentions,
  };
};
