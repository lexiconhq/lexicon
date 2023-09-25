/* eslint-disable no-underscore-dangle */
import { Reference } from '@apollo/client';

export function handleDuplicateRef<T extends Reference>(
  firstArray: Array<T> | null,
  secondArray: Array<T> | null,
): Array<T> {
  if (!secondArray || !firstArray) {
    return secondArray || firstArray || [];
  }

  const firstArrayIds = firstArray.map(({ __ref }) => __ref);

  const filteredSecondArray = secondArray.filter(
    (item) => !firstArrayIds.includes(item.__ref),
  );

  return [...firstArray, ...filteredSecondArray];
}

export function handleDuplicates<T extends Reference>(params: {
  newArray: Array<T> | null;
  oldArray: Array<T> | null;
  newArrayIs: 'prepended' | 'appended';
}) {
  const { newArray, oldArray, newArrayIs } = params;
  if (!oldArray || !newArray) {
    return oldArray || newArray || [];
  }
  const newArrayIds = newArray.map(({ __ref }) => __ref);
  const filteredOldArray = oldArray.filter((item) => {
    return !newArrayIds.includes(item.__ref);
  });
  if (newArrayIs === 'prepended') {
    return [...newArray, ...filteredOldArray];
  } else {
    return [...filteredOldArray, ...newArray];
  }
}
