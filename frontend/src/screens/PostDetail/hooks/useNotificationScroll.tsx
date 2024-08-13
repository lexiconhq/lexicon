import { useEffect, useRef } from 'react';

import { CustomFlatlistRefType } from '../../../components';

type Params = {
  virtualizedListRef: React.RefObject<CustomFlatlistRefType>;
  index?: number;
  shouldScroll?: boolean;
};

export default function useNotificationScroll({
  virtualizedListRef,
  index,
  shouldScroll = true,
}: Params) {
  let alreadyScrolled = useRef(false);

  useEffect(() => {
    if (
      !alreadyScrolled.current &&
      index &&
      shouldScroll &&
      virtualizedListRef?.current
    ) {
      setTimeout(() => {
        alreadyScrolled.current = true;
        virtualizedListRef?.current?.scrollToIndex({
          index,
          animated: true,
        });
      }, 200);
    }
  }, [virtualizedListRef, index, shouldScroll]);
}
