import { RestLink } from 'apollo-link-rest';

export const categoryListPatcher: RestLink.FunctionalTypePatcher = (data) => {
  return {
    __typename: 'CategoryList',
    canCreateCategory: data.categoryList.canCreateCategory,
    canCreateTopic: data.categoryList.canCreateTopic,
    categories: data.categoryList.categories,
  };
};
