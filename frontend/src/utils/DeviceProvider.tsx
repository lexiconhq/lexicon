import * as ScreenOrientation from 'expo-screen-orientation';
import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Dimensions } from 'react-native';

type Device = 'phone' | 'tablet';
type DevicePosition = 'landscape' | 'portrait';

type ContextValue = {
  orientation: DevicePosition;
  isTablet: boolean;
  isPortrait: boolean;
  isTabletLandscape: boolean;
};

const DeviceContext = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export const DeviceProvider = ({ children }: Props) => {
  const [deviceType, setDeviceType] = useState<Device>('phone');
  const [orientation, setOrientation] = useState<DevicePosition>('portrait');

  useEffect(() => {
    /**
     * Lock screen orientation based on device
     * phone only PORTRAIT_UP
     * tablet can be all
     */
    if (deviceType === 'tablet') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    } else {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    }
  }, [deviceType]);
  useEffect(() => {
    const checkDeviceType = async () => {
      const { width, height } = Dimensions.get('window');

      const currentOrientation = await ScreenOrientation.getOrientationAsync();

      /**
       * This calculation is based on the standards provided by Android. For more information, refer to: https://developer.android.com/guide/topics/large-screens/support-different-screen-sizes
       */
      const isTablet = width >= 600 && height >= 600;

      setDeviceType(isTablet ? 'tablet' : 'phone');

      /** Another bug occurs with the dimensions listener, where there is a delay in updating the width and height values. For example, in portrait mode, the height might be 700 and the width 600. On the first rotation, these values might not change immediately, and only after a subsequent rotation do they update to height 600 and width 700, instead of the expected height 700 and width 600. */

      setOrientation(
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? 'landscape'
          : 'portrait',
      );
    };

    /**
     * Change orientation detection to use ScreenOrientation because the dimensions listener has a bug where it doesn't call the listener on the first rotation.
     */
    // Add event listener for dimensions change
    const subscription =
      ScreenOrientation.addOrientationChangeListener(checkDeviceType);

    // Initial check
    checkDeviceType();

    // Cleanup event listener
    return () => {
      subscription.remove();
    };
  }, []);

  const value = {
    orientation,
    isTablet: deviceType === 'tablet',
    isPortrait: orientation === 'portrait',
    isTabletLandscape: deviceType === 'tablet' && orientation === 'landscape',
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export function useDevice() {
  const context = useContext(DeviceContext);

  if (context === undefined) {
    throw new Error('useDevice must be inside a DeviceProvider');
  }

  return context;
}
