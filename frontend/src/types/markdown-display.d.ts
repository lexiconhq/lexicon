import React from 'react';

declare module 'react-native-markdown-display' {
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  interface MarkdownProps {
    children?: React.ReactNode;
  }
}
