import React, { forwardRef, RefObject } from 'react';
import {
  ScaledSize,
  VirtualizedList,
  VirtualizedListProps,
} from 'react-native';

import { useDevice } from '../../../utils';

type Props<T> = VirtualizedListProps<T> & {
  textInputFocused: boolean; // Indicates whether a text input is focused. If true, the keyboard is shown (on mobile devices).
  screen: ScaledSize; // The screen size, obtained using Dimensions.get("screen").
  refreshing?: boolean; // Indicates whether the list is currently refreshing.
  onRefresh?: () => void; // Callback function triggered during the refresh action.
};

function BaseChatList<T>(props: Props<T>, ref: RefObject<VirtualizedList<T>>) {
  const {
    textInputFocused,
    screen,
    refreshing,
    onRefresh,
    ...virtualizeProps
  } = props;

  const { isTabletLandscape, isTablet } = useDevice();

  const getItem = (data: Array<T>, index: number) => data[index];
  const getItemCount = (data: Array<T>) => data?.length;

  return (
    <VirtualizedList
      ref={ref}
      getItem={getItem}
      getItemCount={getItemCount}
      onEndReachedThreshold={0.1}
      contentInset={{
        bottom: textInputFocused
          ? ((isTablet ? (isTabletLandscape ? 55 : 30) : 35) * screen.height) /
            100
          : 0,
        top: textInputFocused
          ? (((isTablet && !isTabletLandscape ? 2 : 7) * screen.height) / 100) *
            -1
          : 0,
      }}
      initialScrollIndex={0}
      {...virtualizeProps}
    />
  );
}

const ChatList = forwardRef(BaseChatList);
export { ChatList };
