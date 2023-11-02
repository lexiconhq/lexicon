import { RootStackParamList, User } from '../types';

import { errorHandlerAlert } from './errorHandler';
import { imagePickerHandler } from './imagePickerHandler';

export type BottomMenuNavigationScreens =
  | 'PostImagePreview'
  | 'HyperLink'
  | 'Poll';
export type BottomMenuNavigationParams =
  | RootStackParamList['PostImagePreview']
  | RootStackParamList['HyperLink']
  | RootStackParamList['Poll'];

type BottomMenuParams = {
  isKeyboardShow: boolean;
  user: User | null;
  navigate: (
    screen: BottomMenuNavigationScreens,
    params: BottomMenuNavigationParams,
  ) => void;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage';
  extensions?: Array<string>;
  title?: string;
  topicId?: number;
  postId?: number;
  replyToPostId?: number;
};

export function bottomMenu(params: BottomMenuParams) {
  let {
    isKeyboardShow,
    user,
    navigate,
    prevScreen,
    extensions,
    title,
    topicId,
    replyToPostId,
  } = params;
  const onInsertImage = async () => {
    if (!isKeyboardShow) {
      return;
    }
    try {
      const result = await imagePickerHandler(extensions);
      if (!user || !result || !result.uri) {
        return;
      }
      const imageUri = result.uri;
      navigate('PostImagePreview', {
        imageUri,
        prevScreen,
        title,
      });
    } catch (unknownError) {
      // TODO: Eventually fix this so the type can resolve to ApolloError as well
      errorHandlerAlert(unknownError as string);
    }
    return;
  };

  const onInsertLink = () => {
    if (!isKeyboardShow) {
      return;
    }
    navigate('HyperLink', {
      title,
      id: topicId,
      replyToPostId,
      prevScreen,
    });
  };

  const onInsertPoll = () => {
    if (!isKeyboardShow) {
      return;
    }
    navigate('Poll', { prevScreen });
  };

  return { onInsertImage, onInsertLink, onInsertPoll };
}
