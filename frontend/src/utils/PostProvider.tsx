import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Post } from '../types';

type ContextValue = {
  topicsData: Array<Post>;
  likedTopic: Array<number>;
  setTopicsData: (topicsData: Array<Post>) => void;
  setLikedTopic: (likedTopic: Array<number>) => void;
  onLikedStatusChanged: (topicId: number, like: boolean) => void;
};

const Context = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function PostProvider({ children }: Props) {
  const [topicsData, setTopicsDataState] = useState<Array<Post>>([]);
  const [likedTopic, setLikedTopicState] = useState<Array<number>>([]);

  const setTopicsData = useCallback(
    (topicsData: Array<Post>) => setTopicsDataState(topicsData),
    [],
  );

  const setLikedTopic = useCallback(
    (likedTopic: Array<number>) => setLikedTopicState(likedTopic),
    [],
  );

  const onLikedStatusChanged = useCallback(
    (topicId: number, like: boolean) => {
      let newTopicsData = [...topicsData];
      let newLikedTopic = [...likedTopic];

      let tempTopicsIndex = newTopicsData?.findIndex(
        (value) => value.id === topicId,
      );
      let likedTopicIndex = likedTopic?.indexOf(topicId);

      if (like) {
        newLikedTopic.push(topicId);
        newTopicsData[tempTopicsIndex] = {
          ...newTopicsData[tempTopicsIndex],
          likeCount: newTopicsData[tempTopicsIndex].likeCount + 1,
        };
      }

      if (likedTopicIndex >= 0) {
        newLikedTopic.splice(likedTopicIndex, 1);
        newTopicsData[tempTopicsIndex] = {
          ...newTopicsData[tempTopicsIndex],
          likeCount: newTopicsData[tempTopicsIndex].likeCount - 1,
        };
      }

      setTopicsData(newTopicsData);
      setLikedTopic(newLikedTopic);
    },
    [topicsData, likedTopic, setTopicsData, setLikedTopic],
  );

  const value = useMemo(
    () => ({
      topicsData,
      likedTopic,
      setTopicsData,
      setLikedTopic,
      onLikedStatusChanged,
    }),
    [
      topicsData,
      likedTopic,
      setTopicsData,
      setLikedTopic,
      onLikedStatusChanged,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePost() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('usePost must be inside an PostProvider');
  }

  return context;
}
