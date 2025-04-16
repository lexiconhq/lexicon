import { EventArg, NavigationAction } from '@react-navigation/native';
import { UseFormReset } from 'react-hook-form';
import { Alert } from 'react-native';

import { FORM_DEFAULT_VALUES } from '../constants';
import { NewPostForm, RootStackNavProp } from '../types';

type GoBackAlertInput = {
  navigation: RootStackNavProp<'NewPost' | 'PostReply'>;
  event: EventArg<'beforeRemove', true, { action: NavigationAction }>;
  resetForm: UseFormReset<NewPostForm>;
};

/**
 * this function create to show alert when go back if edit post
 */

export function goBackWithoutSaveDraftAlert({
  navigation,
  event,
  resetForm,
}: GoBackAlertInput) {
  Alert.alert(
    t('Discard Post?'),
    t('Are you sure you want to discard your post?'),
    [
      { text: t('Cancel') },
      {
        text: t('Discard'),
        onPress: () => {
          resetForm(FORM_DEFAULT_VALUES);
          navigation.dispatch(event.data.action);
        },
      },
    ],
  );
}
