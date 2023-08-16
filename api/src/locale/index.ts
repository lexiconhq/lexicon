import {
  FrequentPoster,
  MostRecentPoster,
  OriginalPoster,
  PosterType,
} from '../types';

// source: github.com:discourse/discourse -> config/locales/server.en.yml
// source: github.com:discourse/discourse -> config/locales/server.zh_TW.yml
// key: `poster_description_joiner`
export const i18nSeparatorsRegex = /,|、/;

const i18nPosterTypes = {
  // source: github.com:discourse/discourse -> config/locales/server.en.yml
  en: {
    'original poster': OriginalPoster.value,
    'most recent poster': MostRecentPoster.value,
    'frequent poster': FrequentPoster.value,
  },
  // source: github.com:discourse/discourse -> config/locales/server.zh_TW.yml
  zh: {
    原始作者: OriginalPoster.value,
    當前大部分貼文作者: MostRecentPoster.value,
    頻繁發文者: FrequentPoster.value,
  },
};

const posterTypeMap: Record<string, PosterType> = {
  ...i18nPosterTypes.en,
  ...i18nPosterTypes.zh,
};

export const getPosterType = (type: string): PosterType | undefined => {
  return posterTypeMap[type];
};
