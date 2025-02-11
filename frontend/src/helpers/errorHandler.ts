import { ApolloError } from '@apollo/client';
import { Alert } from 'react-native';

import { ERROR_413, ERROR_HANDLED_BY_LINK } from '../constants';
import { StackNavProp } from '../types';

import {
  ChangeUsernameError,
  EditPostError,
  LoginError,
  UsedTitleError,
} from './errorMessage';
import { stripHTML } from './stripHTML';

/** `isNotFoundError` accepts any object that has a string-based `message`
 * field. This includes `Error`, `ApolloError`, and `GraphQLError`.
 *
 * It then searches for the well-known text, `'could not be found'`, which
 * is what our GraphQL server returns when a particular query was not found.
 */
export function isNotFoundError(error: string) {
  return error.toLowerCase().includes('could not be found');
}

export function errorHandler(
  error: ApolloError,
  shouldMaskError = false,
  singularEntityName = '',
): string {
  let message = error.message;
  if (error.networkError) {
    const networkError = error.networkError;
    if (
      'result' in networkError &&
      'errors' in networkError.result &&
      Array.isArray(networkError.result.errors) &&
      networkError.result.errors.length > 0
    ) {
      message = networkError.result.errors[0];
    } else if (
      'response' in networkError &&
      'status' in networkError.response &&
      networkError.response.status === 413
    ) {
      message = ERROR_413;
    }
  }

  if (isNotFoundError(message)) {
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

  return message;
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
          onPress: () => (navigate ? navigate('Welcome') : undefined),
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
  Alert.alert(alertTitle, stripHTML(errorMsg), [{ text: t('Got it') }]);
}
