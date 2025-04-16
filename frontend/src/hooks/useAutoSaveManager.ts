import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { draftSaveManager } from '../constants';

/**
 * This hook handle to make sure auto save draft canSave value to false when navigate
 */
export function useAutoSaveManager() {
  useFocusEffect(
    useCallback(() => {
      draftSaveManager.canStartAutoSaving();

      return () => {
        draftSaveManager.disableCanStartAutoSaving();
      };
    }, []),
  );
}
