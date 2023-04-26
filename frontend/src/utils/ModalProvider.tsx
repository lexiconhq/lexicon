import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ContextValue = {
  modal: boolean;
  setModal: (modal: boolean) => void;
};

const Context = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function ModalProvider({ children }: Props) {
  const [modal, setModalState] = useState<boolean>(true);

  const setModal = useCallback((modal: boolean) => {
    setModalState(modal);
  }, []);

  const value = useMemo(() => ({ modal, setModal }), [modal, setModal]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useModal() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useModal must be inside a ModalProvider');
  }

  return context;
}
