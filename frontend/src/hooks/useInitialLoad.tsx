import { discourseHostVar } from '../constants';
import { useHealthQuery } from '../generated/server';
import { useAuth } from '../utils/AuthProvider';

import useLoadFonts from './useLoadFonts';

type UseInitialLoadResult =
  | {
      loading: true;
    }
  | {
      loading: false;
      isLoggedIn: boolean;
      isPublicDiscourse: boolean;
    };
/**
 * Hook to load fonts and other resources on initial app load.
 * Also determined whether the app is loading or ready
 */
export function useInitialLoad(): UseInitialLoadResult {
  const { loading: fontsLoading } = useLoadFonts();
  const useAuthResults = useAuth();
  let { loading: getHostLoading } = useHealthQuery({
    onCompleted: ({ health }) => {
      if (health.discourseHost) {
        // NOTE: `discourseHostVar` has nothing to do with the health check
        // We needed the Discourse host for In-App Linking (#1012), so we are
        // opportunistically grabbing it when we already have it from the health check.
        discourseHostVar(health.discourseHost);
      }
    },
  });

  const loading = fontsLoading || useAuthResults.isLoading || getHostLoading;
  if (loading) {
    return { loading: true };
  }

  return {
    loading,
    isLoggedIn: !!useAuthResults.token,
    isPublicDiscourse:
      (!useAuthResults.token && !useAuthResults.siteSettingsError) ||
      !!useAuthResults.canSignUp,
  };
}
