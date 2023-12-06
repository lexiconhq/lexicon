export function getListNumberStep({
  min,
  max,
  step,
}: {
  min: number;
  max: number;
  step: number;
}) {
  if (step <= 0) {
    return [];
  }

  return Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, index) => min + index * step,
  );
}

export function changeListNumberOption(listNumber: Array<number>) {
  return listNumber.map((data) => {
    return { option: data.toString() };
  });
}
