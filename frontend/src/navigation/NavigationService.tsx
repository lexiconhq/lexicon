import {
  createNavigationContainerRef,
  NavigationState,
  PartialState,
} from '@react-navigation/native';

import { RootStackParamList, RootStackRouteName } from '../types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(
  params:
    | [screen: RootStackRouteName]
    | [
        screen: RootStackRouteName,
        params: RootStackParamList[RootStackRouteName],
      ],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...params);
  }
}
export function reset(params: PartialState<NavigationState> | NavigationState) {
  if (navigationRef.isReady()) {
    navigationRef.reset(params);
  }
}
