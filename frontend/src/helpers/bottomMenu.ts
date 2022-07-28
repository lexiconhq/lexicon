import { Post, RootStackParamList, User } from '../types';

import { errorHandlerAlert } from './errorHandler';
import { imagePickerHandler } from './imagePickerHandler';

export function bottomMenu(
  isKeyboardShow: boolean,
  user: User | null,
  navigate: (
    screen: 'PostImagePreview' | 'HyperLink',
    params:
      | RootStackParamList['PostImagePreview']
      | RootStackParamList['HyperLink'],
  ) => void,
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage',
  extensions?: Array<string>,
  title?: string,
  topicId?: number,
  post?: Post,
) {
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
    navigate('HyperLink', { title, id: topicId, post, prevScreen });
  };

  return { onInsertImage, onInsertLink };
}
