import React, { createContext, useContext, useMemo, useState } from 'react';

type LikeData = {
  liked?: boolean;
  likeCount: number;
};
type OngoingLikedTopicId = Record<number, LikeData>;
type OngoingLikedTopicContext = {
  likedTopics: OngoingLikedTopicId;
  addOngoingLikedTopic: (key: number, value: LikeData) => void;
  removeOngoingLikedTopic: (key: number) => void;
};

const Context = createContext<OngoingLikedTopicContext | null>(null);

type Props = {
  children: React.ReactNode;
};
export function OngoingLikedTopicProvider({ children }: Props) {
  const [data, setData] = useState<OngoingLikedTopicId>({});
  const addOngoingLikedTopic = (key: number, value: LikeData) => {
    setData((data) => ({
      ...data,
      [key]: value,
    }));
  };
  const removeOngoingLikedTopic = (key: number) => {
    setData((data) => {
      const { [key]: _, ...updatedData } = data;
      return updatedData;
    });
  };

  const value = useMemo(
    () => ({
      likedTopics: data,
      addOngoingLikedTopic,
      removeOngoingLikedTopic,
    }),
    [data],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useOngoingLikedTopic() {
  let context = useContext(Context);
  if (!context) {
    throw new Error(
      'useOngoingLikedTopic must be used within a OngoingLikedTopicProvider',
    );
  }
  return context;
}
