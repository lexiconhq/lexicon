import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { LoadingOrError } from '../components';
import { useSiteSettings } from '../hooks';
import { StackNavProp } from '../types';

export default function Loading() {
  const { reset } = useNavigation<StackNavProp<'Login'>>();

  const { canSignUp, loading, error } = useSiteSettings();

  useEffect(() => {
    if (!loading) {
      if (!error || canSignUp) {
        reset({ index: 0, routes: [{ name: 'TabNav' }] });
      } else {
        reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    }
  }, [loading, error, canSignUp, reset]);

  return <>{loading && <LoadingOrError loading />}</>;
}
