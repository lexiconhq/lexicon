import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export * from './ContentState';
export * from './DiscourseNotification';
export * from './ErrorSchema';
export * from './Form';
export * from './Hook';
export * from './Navigation';
export * from './NumericString';
export * from './pagination';
export * from './Post';
export * from './Theme';
export * from './Types';

export type ObjectValues<T> = T[keyof T];
export type Apollo = ApolloClient<NormalizedCacheObject>;
