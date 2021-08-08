declare global {
  export { t } from '../helpers/translate';
  export const global: typeof globalThis;
}

export {};
