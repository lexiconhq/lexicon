import { AxiosInstance } from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Root = object | undefined;

export type Context = {
  client: AxiosInstance;
  isAuth: boolean;
};
