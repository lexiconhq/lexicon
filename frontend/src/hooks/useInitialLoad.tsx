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

  const loading = fontsLoading || useAuthResults.isLoading;
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
