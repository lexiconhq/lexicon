import * as Localization from 'expo-localization';

export const LOCALE = Localization.locale;

type ParamsObject = {
  [key: string]: unknown;
};

// This matches words inside curly braces.
const PLACEHOLDER = /\{(\w+)\}/g;

// This function doesn't currently do anything besides string interpolation,
// since we're not yet implementing support for other locales.
export function t(input: string, params?: ParamsObject): string {
  if (params) {
    return input.replace(PLACEHOLDER, (match: string, word: string) => {
      return params[word] != null ? String(params[word]) : match;
    });
  } else {
    return input;
  }
}
