// global constant to Prevent multiple saves drafts at the same time
export const draftSaveManager = (() => {
  let isSaving = false;
  let canStartAutoSave = false;

  const startSaving = () => {
    isSaving = true;
  };

  const finishSaving = () => {
    setTimeout(() => {
      isSaving = false;
    }, 500); // Small delay to ensure debounce doesn't immediately re-trigger
  };

  const isDraftSaving = () => isSaving;

  const canStartAutoSaving = () => {
    canStartAutoSave = true;
  };

  const disableCanStartAutoSaving = () => {
    canStartAutoSave = false;
  };

  const isCanStartAutoSave = () => canStartAutoSave;

  return {
    startSaving,
    finishSaving,
    isDraftSaving,
    canStartAutoSaving,
    disableCanStartAutoSaving,
    isCanStartAutoSave,
  };
})();
