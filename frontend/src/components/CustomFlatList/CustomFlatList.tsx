import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  RefreshControl,
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  LayoutChangeEvent,
} from 'react-native';

/**
 * generic forward ref hack https://fettblog.eu/typescript-react-generic-forward-refs/
 */
declare module 'react' {
  function forwardRef<T, P = unknown>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type RenderItemCustomOption = {
  isItemLoading: boolean;
  onLayout: (params: { event: LayoutChangeEvent }) => void;
};

type Props<ItemType> = Omit<
  FlatListProps<ItemType>,
  'renderItem' | 'refreshControl'
> & {
  renderItem: (
    info: ListRenderItemInfo<ItemType>,
    customOption: RenderItemCustomOption,
  ) => ReactElement;
  refreshControlTintColor?: string;
  paginationSize?: number;
};

type CustomFlatlistRefType = {
  scrollToIndex: FlatList['scrollToIndex'];
  scrollToEnd: FlatList['scrollToEnd'];
};

type ScrollToIndexParams = Parameters<FlatList['scrollToIndex']>[0];

const DEFAULT_INITIAL_NUM_TO_RENDER = 10;
const DEFAULT_WINDOW_SIZE = 21;

const DEFAULT_PAGINATION_SIZE = 5;

/**
 * Custom flatlist to support scroll to any index
 * It will internally manage pagination and show correct data on scroll
 *
 * Notes:
 * - Required to put onLayout for items rendered as the scroll depend
 * on items layout finished
 * - To make illusion of scrolling we wrapped the child in loading state
 * it's not required but suggested to do as otherwise it will feel janky
 * - Currently to load earlier data in the list we need to pull to refresh
 * this limitation is design decision as automatically
 * adding data to start of the list (ex: using onStartReached)
 * would scroll the list to top on android(https://github.com/facebook/react-native/pull/29466)
 *
 * TODO:
 * - Refactor to auto load earlier data once RN fix mvcp for android (https://github.com/kodefox/lexicon/issues/793)
 */

function BaseCustomFlatList<ItemType>(
  props: Props<ItemType>,
  ref: ForwardedRef<CustomFlatlistRefType>,
) {
  const {
    data: propsItemData = [],
    initialNumToRender,
    windowSize,
    renderItem,
    onEndReached,
    onScroll,
    onRefresh,
    refreshing = false,
    refreshControlTintColor,
    paginationSize = DEFAULT_PAGINATION_SIZE,
    ...flatListProps
  } = props;
  const safePropsItemData = useMemo(() => {
    return propsItemData ?? [];
  }, [propsItemData]);
  const [startIndex, setStartIndex] = useState<number>();
  const [lastIndex, setLastIndex] = useState<number>();

  // use to show loading on all items
  const [itemsLoading, setItemsLoading] = useState(false);

  const baseFlatListRef = useRef<FlatList<ItemType>>(null);

  const scrollToIndexParam = useRef<ScrollToIndexParams>();
  const shouldInternalScroll = useRef<boolean>();
  const itemRenderCount = useRef<number>(0);

  const internalOnEndReached = () => {
    /**
     * Compare our internal latestIndex with data props length
     * if less load rest of our data from props
     * if equal means our props runs out of data, trigger onEndReach
     */
    if (
      lastIndex !== undefined &&
      safePropsItemData &&
      lastIndex !== safePropsItemData.length
    ) {
      setLastIndex(safePropsItemData.length);
    }
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollToIndex: (params) => {
          const initialWindow = Math.max(
            initialNumToRender || DEFAULT_INITIAL_NUM_TO_RENDER,
            windowSize || DEFAULT_WINDOW_SIZE,
          );
          const halfInitialWindow = Math.floor(initialWindow / 2);

          // Handle default behavior
          if (params.index < initialWindow) {
            return baseFlatListRef.current?.scrollToIndex(params);
          }

          /**
           * Scroll illusion
           * 1. turned on loading for all item
           * 2. replace with sliced item
           * 3. scroll to specific item
           */
          setItemsLoading(true);
          const newStartIndex = params.index - halfInitialWindow;
          const newLastIndex = params.index + halfInitialWindow;
          setStartIndex(newStartIndex);
          setLastIndex(newLastIndex);
          // set param for the scrollToIndex called
          itemRenderCount.current = 0;
          scrollToIndexParam.current = {
            ...params,
            index: halfInitialWindow,
          };
          shouldInternalScroll.current = true;
        },
        scrollToEnd: (params) => {
          baseFlatListRef.current?.scrollToEnd(params);
        },
      };
    },
    [initialNumToRender, windowSize],
  );

  // debounced scroll to happened after new data layout finished
  const internalScroll = () => {
    itemRenderCount.current += 1;
    if (!shouldInternalScroll.current) {
      return;
    }
    if (!scrollToIndexParam.current) {
      return;
    }
    if (itemRenderCount.current < scrollToIndexParam.current.index + 1) {
      return;
    }

    shouldInternalScroll.current = false;
    // This setTimeout call is an imperfect fix that makes the scrolling transition smoother. We might need to adjust this later after we improve the render latency.
    setTimeout(() => {
      setItemsLoading(false);
    }, 500);
    // SetTimeout below needed because even after last item onLayout the scrollToIndex still using old calculation
    setTimeout(() => {
      scrollToIndexParam.current &&
        baseFlatListRef.current?.scrollToIndex(scrollToIndexParam.current);
    });
  };

  const internalOnRefresh = () => {
    if (propsItemData && startIndex) {
      const newStartIndex = Math.max(startIndex - paginationSize, 0);
      setStartIndex(newStartIndex);
    } else {
      onRefresh && onRefresh();
      // removing internal window on true refresh to just pass all data
      setStartIndex(undefined);
      setLastIndex(undefined);
    }
  };

  const slicedFlatListData = safePropsItemData.slice(
    startIndex !== undefined ? startIndex : 0,
    lastIndex !== undefined ? lastIndex : safePropsItemData.length,
  );

  return (
    <FlatList
      ref={baseFlatListRef}
      data={slicedFlatListData}
      renderItem={(params) => {
        const customOptions: RenderItemCustomOption = {
          isItemLoading: itemsLoading,
          onLayout: internalScroll,
        };
        return renderItem({ ...params }, customOptions);
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing ?? false}
          onRefresh={internalOnRefresh}
        />
      }
      onEndReached={(info) => {
        internalOnEndReached();
        if (
          (lastIndex === safePropsItemData.length || lastIndex === undefined) &&
          onEndReached
        ) {
          onEndReached(info);
          /**
           * removing internal window on true on end reach
           * to get all data from current start to the end
           */
          setLastIndex(undefined);
        }
      }}
      {...flatListProps}
    />
  );
}
const CustomFlatList = forwardRef(BaseCustomFlatList);

export { CustomFlatlistRefType, CustomFlatList };
