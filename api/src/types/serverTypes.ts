import { AxiosInstance } from 'axios';

export type Root = object | undefined;

export type Context = {
  client: AxiosInstance;
  isAuth: boolean;
};
