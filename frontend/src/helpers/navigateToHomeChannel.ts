import { navigationRef } from '../navigation/NavigationService';

export function navigateToHomeChannel(channelId: number) {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate('TabNav', {
    screen: 'Home',
    params: { channelId },
  });
}
