import { Alert } from 'react-native';

export type ErrorAlert =
  | {
      type: 'NETWORK' | 'EMPTY_FIELD' | 'UNKNOWN';
    }
  | {
      type: 'WRONG_INPUT';
      message: string;
    };

export const showErrorFormAlert = (
  error: ErrorAlert = { type: 'EMPTY_FIELD' },
) => {
  let errorMessage: string;

  switch (error.type) {
    case 'NETWORK': {
      errorMessage = t('Please connect to a network');
      break;
    }
    case 'EMPTY_FIELD': {
      errorMessage = t('Please fill required input to proceed');
      break;
    }
    case 'UNKNOWN': {
      errorMessage = t('Unknown error occured');
      break;
    }
    case 'WRONG_INPUT': {
      errorMessage = error.message
        ? error.message
        : t('Incorrect username and / or password. Please try again');
    }
  }

  Alert.alert('Error', errorMessage, [{ text: t('Got it') }]);
};
