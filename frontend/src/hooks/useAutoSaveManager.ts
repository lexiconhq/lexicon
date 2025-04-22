import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { DebouncedState } from 'use-debounce';

import { draftSaveManager } from '../constants';

/**
 * This hook handle to make sure auto save draft canSave value to false when navigate
 */

type inputHookAutoSaveManager = {
  debounceSaveDraft: DebouncedState<() => void>;
};
export function useAutoSaveManager({
  debounceSaveDraft,
}: inputHookAutoSaveManager) {
  useFocusEffect(
    useCallback(() => {
      draftSaveManager.canStartAutoSaving();

      return () => {
        draftSaveManager.disableCanStartAutoSaving();
        debounceSaveDraft.cancel();
      };
    }, [debounceSaveDraft]),
  );
}
