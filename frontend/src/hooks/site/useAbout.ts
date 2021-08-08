import { LazyQueryHookOptions } from '@apollo/client';

import { About as AboutType } from '../../generated/server/About';
import { ABOUT } from '../../graphql/server/about';
import { ErrorAlertOptionType } from '../../types';
import { useLazyQuery } from '../../utils';

export function useAbout(
  options?: LazyQueryHookOptions<AboutType>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getAbout, { error }] = useLazyQuery<AboutType>(
    ABOUT,
    {
      ...options,
    },
    errorAlert,
  );

  return { getAbout, error };
}
