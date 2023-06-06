import { FlatList } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFlatList(list: any): list is FlatList {
  if (!list) {
    return false;
  }
  return typeof list?.scrollToIndex === 'function';
}
