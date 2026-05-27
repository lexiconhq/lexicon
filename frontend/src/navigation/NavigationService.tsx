import {
  createNavigationContainerRef,
  NavigationState,
  PartialState,
} from '@react-navigation/native';

import { RootStackParamList, RootStackRouteName } from '../types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(
  screen: RootStackRouteName,
  params?: RootStackParamList[RootStackRouteName],
) {
  if (!navigationRef.isReady()) {
    return;
  }

  if (params !== undefined) {
    navigationRef.navigate(screen, params);
    return;
  }

  navigationRef.navigate(screen);
}

export function reset(
  params:
    | PartialState<NavigationState<RootStackParamList>>
    | NavigationState<RootStackParamList>,
) {
  if (navigationRef.isReady()) {
    navigationRef.reset(params);
  }
}
