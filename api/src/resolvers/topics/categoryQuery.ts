import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let catergoryQueryResolver: FieldResolver<'Query', 'category'> = async (
  _,
  __,
  context: Context,
) => {
  try {
    let url = '/categories.json';
    let { data: categoryResult } = await context.client.get(url);

    let categoryList = categoryResult.category_list;

    return camelcaseKeys(categoryList, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let categoryQuery = queryField('category', {
  type: 'CategoryList',
  resolve: catergoryQueryResolver,
});

export { categoryQuery };
