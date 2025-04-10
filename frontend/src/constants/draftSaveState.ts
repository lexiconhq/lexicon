// global constant to Prevent multiple saves drafts at the same time
export const draftSaveManager = (() => {
  let isSaving = false;

  const startSaving = () => {
    isSaving = true;
  };

  const finishSaving = () => {
    setTimeout(() => {
      isSaving = false;
    }, 500); // Small delay to ensure debounce doesn't immediately re-trigger
  };

  const isDraftSaving = () => isSaving;

  return { startSaving, finishSaving, isDraftSaving };
})();
