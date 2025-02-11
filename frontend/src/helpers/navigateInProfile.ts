import { currentScreenVar } from '../constants';
import { navigate } from '../navigation/NavigationService';
import { RootStackParamList, RootStackRouteName } from '../types';

export function navigateInProfile(
  screen: RootStackRouteName,
  params: RootStackParamList[RootStackRouteName],
) {
  currentScreenVar({ screen, params });
  navigate([screen, params]);
}
