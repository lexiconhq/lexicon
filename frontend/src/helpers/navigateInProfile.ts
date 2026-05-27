import { currentScreenVar } from '../constants';
import { navigationRef } from '../navigation/NavigationService';
import { isTabletLandscapeVar } from '../utils/DeviceProvider';
import {
  ProfileNavigatorParamList,
  RootStackParamList,
  RootStackRouteName,
} from '../types';

type ProfileTabScreen = keyof ProfileNavigatorParamList;

/** Matches tablet landscape layout (drawer profile, no ProfileScreen route). */
export function isProfileDrawerLayout(): boolean {
  return isTabletLandscapeVar();
}

const PROFILE_TAB_SCREENS = new Set<RootStackRouteName>([
  'ProfileScreen',
  'Notifications',
  'Messages',
  'Activity',
  'ChangePassword',
  'EmailAddress',
  'AddEmail',
  'EditProfile',
  'EditUserStatus',
  'Preferences',
  'BlockedUsers',
  'HiddenWords',
  'AdditionalResources',
  'AdditionalResourceDetail',
]);

export function navigateToProfileTab(
  screen: ProfileTabScreen,
  params?: ProfileNavigatorParamList[ProfileTabScreen],
) {
  if (!navigationRef.isReady()) {
    return;
  }

  // Profile lives in the drawer sidebar on tablet landscape; there is no ProfileScreen route.
  if (screen === 'ProfileScreen' && isProfileDrawerLayout()) {
    navigationRef.navigate('TabNav', { screen: 'Profile' });
    return;
  }

  navigationRef.navigate('TabNav', {
    screen: 'Profile',
    params:
      params !== undefined ? { screen, params } : { screen },
  });
}

export function navigateInProfile(
  screen: RootStackRouteName,
  params: RootStackParamList[RootStackRouteName],
) {
  const resolvedScreen =
    screen === 'ProfileScreen' && isProfileDrawerLayout()
      ? 'Notifications'
      : screen;

  currentScreenVar({ screen: resolvedScreen, params });

  if (PROFILE_TAB_SCREENS.has(screen)) {
    navigateToProfileTab(
      screen as ProfileTabScreen,
      params as ProfileNavigatorParamList[ProfileTabScreen],
    );
    return;
  }

  if (!navigationRef.isReady()) {
    return;
  }

  if (params !== undefined) {
    navigationRef.navigate(screen, params);
  } else {
    navigationRef.navigate(screen);
  }
}
