import { Alert } from 'react-native';
import { ApolloError } from '@apollo/client';

import { StackNavProp } from '../types';
import { ERROR_HANDLED_BY_LINK } from '../constants';

import {
  ChangeUsernameError,
  EditPostError,
  LoginError,
  UsedTitleError,
} from './errorMessage';

/** `isNotFoundError` accepts any object that has a string-based `message`
 * field. This includes `Error`, `ApolloError`, and `GraphQLError`.
 *
 * It then searches for the well-known text, `'could not be found'`, which
 * is what our GraphQL server returns when a particular query was not found.
 */
export function isNotFoundError(error: { message: string }) {
  return error.message.toLowerCase().includes('could not be found');
}

export function errorHandler(
  error: ApolloError,
  shouldMaskError = false,
  singularEntityName = '',
): string {
  if (error.networkError) {
    return t('Please connect to a network');
  }

  if (isNotFoundError(error)) {
    let message = t(`Sorry, we couldn't find what you were looking for.`);

    if (singularEntityName) {
      message = t(`Sorry, we couldn't find that {entity} for you.`, {
        entity: singularEntityName,
      });
    }

    return message;
  }

  if (shouldMaskError) {
    return t('Something unexpected happened. Please try again.');
  }

  return error.message;
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
    // This means the error is handled in error link
    if (error?.message === ERROR_HANDLED_BY_LINK) {
      return;
    }
    errorMsg = errorHandler(error, isFiltered);
  }
  let alertTitle;
  switch (errorMsg) {
    case LoginError:
      Alert.alert(t('Please Log In'), errorMsg, [
        { text: t('Close') },
        {
          text: t('Log In'),
          onPress: () => (navigate ? navigate('Login') : undefined),
        },
      ]);
      return;
    case UsedTitleError:
      Alert.alert(
        t('Title Already Exists'),
        t(
          'A Post with this title has already been created. Please use a different title.',
        ),
        [{ text: t('Got it') }],
      );
      return;
    case EditPostError:
      alertTitle = t('Unable to Edit');
      break;
    case ChangeUsernameError:
      alertTitle = t('Username Unavailable');
      break;
    default:
      alertTitle = t('Error');
  }
  Alert.alert(alertTitle, errorMsg, [{ text: t('Got it') }]);
}
