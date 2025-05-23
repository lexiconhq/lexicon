import { Apollo } from '../../types';

import { changePasswordOutputResponseTransformer } from './changePasswordOutput';
import { checkPostDraftResultResponseTransformer } from './CheckPostDraftResult';
import { joinLeaveChannelOutputResponseTransform } from './JoinLeaveChannelOutput';
import { listPostDraftsResultResponseTransformer } from './ListPostDraftsResult';
import { postCookedResponseTransform, postRawResponseTransform } from './Post';
import { replyingToOutputResponseTransform } from './ReplyingToOutput';
import { searchTagOutputResponseTransform } from './searchTagOutput';
import {
  stringResponseTransform,
  successResponseTransform,
} from './stringOutput';
import { userActionsResponseTransform } from './userActions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseTransformer = (data: any, typeName: string, client: Apollo) => any;

const convertData = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  type: 'json' | 'text',
) => {
  let newData;
  if (type === 'json' && data?.json) {
    newData = await data?.json();
  } else if (data?.text) {
    newData = await data?.text();
  }

  return newData;
};

/**
 * This higher-order function generates a response transformer
 * based on the provided transformer function and data type.
 *
 * It returns a function that takes the client response data
 * as an argument, converts it to the specified type (either JSON
 * or text), and then applies the transformer to the converted data.
 *
 * @param transformer - A function that transforms the response data
 *                      based on the specified typeName.
 * @param type - The type of data to convert to, either 'json' or 'text'.
 * @param ignoreResponse- if we want ignore response data. it will be used for String type.
 * @returns A function that processes the response data after conversion.
 */

const createResponseTransformer = <T>(
  transformer: (data: T, typeName: string, client: Apollo) => unknown,
  type: 'json' | 'text',
  ignoreResponse?: boolean,
) => {
  return async (data: T, typeName: string, client: Apollo) => {
    const convertedData = ignoreResponse ? '' : await convertData(data, type);
    return transformer(convertedData, typeName, client);
  };
};

/**
 * Root variable defining a record with names as keys and response transformers as values.
 */
export const responseTransformers: Record<string, ResponseTransformer> = {
  ReplyingToOutput: createResponseTransformer(
    replyingToOutputResponseTransform,
    'json',
  ),
  PostRaw: createResponseTransformer(postRawResponseTransform, 'text'),
  PostCooked: createResponseTransformer(postCookedResponseTransform, 'text'),
  SetPrimaryEmailOutput: createResponseTransformer(
    successResponseTransform,
    'json',
  ),
  DeleteEmailOutput: createResponseTransformer(
    successResponseTransform,
    'json',
  ),
  ChangePasswordOutput: createResponseTransformer(
    changePasswordOutputResponseTransformer,
    'json',
  ),
  String: createResponseTransformer(stringResponseTransform, 'json', true),
  UserActions: createResponseTransformer(userActionsResponseTransform, 'json'),
  SearchTagOutput: createResponseTransformer(
    searchTagOutputResponseTransform,
    'json',
  ),
  JoinLeaveChannelOutput: createResponseTransformer(
    joinLeaveChannelOutputResponseTransform,
    'json',
  ),
  MarkReadChatOutput: createResponseTransformer(
    successResponseTransform,
    'json',
  ),
  CheckPostDraftResult: createResponseTransformer(
    checkPostDraftResultResponseTransformer,
    'json',
  ),
  DeletePostDraftOutput: createResponseTransformer(
    successResponseTransform,
    'json',
  ),
  ListPostDraftsResult: createResponseTransformer(
    listPostDraftsResultResponseTransformer,
    'json',
  ),
};
