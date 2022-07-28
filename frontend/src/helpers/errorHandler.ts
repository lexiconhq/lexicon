import { Alert } from 'react-native';
import { ApolloError } from '@apollo/client';

import { StackNavProp } from '../types';

import {
  ChangeUsernameError,
  EditPostError,
  LoginError,
  UsedTitleError,
} from './errorMessage';

export function errorHandler(
  error: ApolloError,
  isFiltered = false,
  isTranslated = true,
): string {
  let errorMsg: string;

  if (error.networkError) {
    errorMsg = 'Please connect to a network';
  } else if (error.message === 'Not found or private.') {
    errorMsg = 'Not found or private';
  } else {
    errorMsg = isFiltered
      ? 'Something unexpected happened. Please try again'
      : error.message;
  }

  return isTranslated ? t('{errorMsg}', { errorMsg }) : errorMsg;
}

export function errorHandlerAlert(
  error: ApolloError | string,
  navigate?: StackNavProp<'PostDetail'>['navigate'],
  isFiltered = false,
) {
  let errorMsg;

  if (typeof error === 'string') {
    errorMsg = error;
  } else {
    errorMsg = errorHandler(error, isFiltered, false);
  }

  let errorMsgi8n = t('{errorMsg}', { errorMsg });

  switch (errorMsg) {
    case LoginError:
      Alert.alert(t('Please Log In'), errorMsgi8n, [
        { text: t('Close') },
        {
          text: t('Log In'),
          onPress: () => (navigate ? navigate('Login') : undefined),
        },
      ]);
      break;
    case UsedTitleError:
      Alert.alert(
        t('Title Already Exists'),
        t(
          'A Post with this title has already been created. Please use a different title.',
        ),
        [{ text: t('Got it') }],
      );
      break;
    case EditPostError:
      Alert.alert(t('Unable to Edit'), errorMsgi8n, [{ text: t('Got it') }]);
      break;
    case ChangeUsernameError:
      Alert.alert(t('Username Unavailable'), errorMsgi8n, [
        { text: t('Got it') },
      ]);
      break;
    default:
      Alert.alert(t('Error'), errorMsgi8n, [{ text: t('Got it') }]);
  }
}
