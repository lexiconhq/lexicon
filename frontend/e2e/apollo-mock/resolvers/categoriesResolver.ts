import { mockCategories } from '../data';

export const categoriesResolvers = {
  Query: {
    category: () => {
      return {
        categories: mockCategories,
      };
    },
  },
};
