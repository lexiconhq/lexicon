import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

type ContextValue = {
  isScrolled: boolean;
  onStartScroll: () => void;
  onStopScroll: () => void;
};

const Context = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function UserEventProvider({ children }: Props) {
  const isScrolled = useRef(false);

  const onStartScroll = useCallback(() => {
    isScrolled.current = true;
  }, []);

  const onStopScroll = useCallback(() => {
    isScrolled.current = false;
  }, []);

  const value = useMemo(
    () => ({
      isScrolled: isScrolled.current,
      onStartScroll,
      onStopScroll,
    }),
    [isScrolled, onStartScroll, onStopScroll],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useUserEvent() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useUserEvent must be inside an UserEventProvider');
  }

  return context;
}
