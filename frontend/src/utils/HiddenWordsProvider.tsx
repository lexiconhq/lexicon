import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, AppState } from 'react-native';

import { MAX_HIDDEN_WORDS } from '../constants/hiddenWords';
import {
  normalizeHiddenWord,
  normalizeHiddenWords,
  profileMatchesHiddenWords,
  textContainsHiddenWord,
} from '../helpers/hiddenWords';
import { useStorage } from '../helpers';

const HIDDEN_WORDS_STORAGE_KEY = '@Cached/hiddenWords';

type HiddenWordsContextValue = {
  hiddenWords: Array<string>;
  hiddenWordsList: Array<string>;
  hiddenWordsRevision: number;
  addHiddenWord: (word: string) => boolean;
  removeHiddenWord: (word: string) => void;
  textContainsHiddenWord: (text: string | undefined | null) => boolean;
  profileMatchesHiddenWords: (profile: {
    username?: string | null;
    name?: string | null;
    bioRaw?: string | null;
  }) => boolean;
  isAtLimit: boolean;
  reloadHiddenWords: () => void;
};

const HiddenWordsContext = createContext<HiddenWordsContextValue | undefined>(
  undefined,
);

export function HiddenWordsProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const storage = useStorage();
  const [hiddenWords, setHiddenWords] = useState<Array<string>>([]);
  const [hiddenWordsRevision, setHiddenWordsRevision] = useState(0);
  const hiddenWordsRef = useRef(hiddenWords);
  hiddenWordsRef.current = hiddenWords;

  const persistHiddenWords = useCallback(
    async (words: Array<string>) => {
      const normalized = normalizeHiddenWords(words);
      hiddenWordsRef.current = normalized;
      setHiddenWords((prev) =>
        prev.join('\0') === normalized.join('\0') ? prev : normalized,
      );
      setHiddenWordsRevision((revision) => revision + 1);
      storage.setItem('hiddenWords', normalized);
      await AsyncStorage.setItem(
        HIDDEN_WORDS_STORAGE_KEY,
        JSON.stringify(normalized),
      );
    },
    [storage],
  );

  const reloadHiddenWords = useCallback(() => {
    const stored = storage.getItem('hiddenWords') ?? [];
    const normalized = normalizeHiddenWords(stored);
    hiddenWordsRef.current = normalized;
    setHiddenWords((prev) =>
      prev.join('\0') === normalized.join('\0') ? prev : normalized,
    );
    setHiddenWordsRevision((revision) => revision + 1);
  }, [storage]);

  useEffect(() => {
    reloadHiddenWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        reloadHiddenWords();
      }
    });
    return () => subscription.remove();
  }, [reloadHiddenWords]);

  const addHiddenWord = useCallback(
    (word: string): boolean => {
      const entry = normalizeHiddenWord(word);
      if (entry.length < 2) {
        Alert.alert(
          t('Word too short'),
          t('Hidden words must be at least 2 characters.'),
        );
        return false;
      }

      const current = hiddenWordsRef.current;
      if (current.length >= MAX_HIDDEN_WORDS) {
        Alert.alert(
          t('Limit reached'),
          t('You can add up to {count} hidden words.', {
            count: MAX_HIDDEN_WORDS,
          }),
        );
        return false;
      }

      if (current.includes(entry)) {
        Alert.alert(
          t('Already added'),
          t('That word is already on your hidden words list.'),
        );
        return false;
      }

      void persistHiddenWords([...current, entry]);
      return true;
    },
    [persistHiddenWords],
  );

  const removeHiddenWord = useCallback(
    (word: string) => {
      const entry = normalizeHiddenWord(word);
      const current = hiddenWordsRef.current;
      void persistHiddenWords(current.filter((item) => item !== entry));
    },
    [persistHiddenWords],
  );

  const matchesText = useCallback(
    (text: string | undefined | null) =>
      textContainsHiddenWord(text, hiddenWords),
    [hiddenWords],
  );

  const matchesProfile = useCallback(
    (profile: {
      username?: string | null;
      name?: string | null;
      bioRaw?: string | null;
    }) => profileMatchesHiddenWords(profile, hiddenWords),
    [hiddenWords],
  );

  const hiddenWordsList = useMemo(
    () => [...hiddenWords].sort((a, b) => a.localeCompare(b)),
    [hiddenWords],
  );

  const value = useMemo(
    () => ({
      hiddenWords,
      hiddenWordsList,
      hiddenWordsRevision,
      addHiddenWord,
      removeHiddenWord,
      textContainsHiddenWord: matchesText,
      profileMatchesHiddenWords: matchesProfile,
      isAtLimit: hiddenWords.length >= MAX_HIDDEN_WORDS,
      reloadHiddenWords,
    }),
    [
      addHiddenWord,
      hiddenWords,
      hiddenWordsList,
      hiddenWordsRevision,
      matchesProfile,
      matchesText,
      reloadHiddenWords,
      removeHiddenWord,
    ],
  );

  return (
    <HiddenWordsContext.Provider value={value}>
      {children}
    </HiddenWordsContext.Provider>
  );
}

export function useHiddenWords() {
  const context = useContext(HiddenWordsContext);
  if (!context) {
    throw new Error('useHiddenWords must be used within HiddenWordsProvider');
  }
  return context;
}
