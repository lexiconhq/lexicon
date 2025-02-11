import {
  FrequentPoster,
  MostRecentPoster,
  OriginalPoster,
  PosterType,
} from '../../../types/api';

// source: github.com:discourse/discourse -> config/locales/server.en.yml
// source: github.com:discourse/discourse -> config/locales/server.zh_CN.yml
// key: `poster_description_joiner`
export const i18nSeparatorsRegex = /,|、/;

const i18nPosterTypes = {
  // source: github.com:discourse/discourse -> config/locales/server.en.yml
  en: {
    'original poster': OriginalPoster.value,
    'most recent poster': MostRecentPoster.value,
    'frequent poster': FrequentPoster.value,
  },
  // source: github.com:discourse/discourse -> config/locales/server.zh_CN.yml
  zh: {
    原始发帖人: OriginalPoster.value,
    最新发帖人: MostRecentPoster.value,
    频繁发帖人: FrequentPoster.value,
  },
  zh_cn: {
    原始发帖人: OriginalPoster.value,
    最新发帖人: MostRecentPoster.value,
    频繁发帖人: FrequentPoster.value,
  },
  // source: github.com:discourse/discourse -> config/locales/server.zh_TW.yml
  zh_tw: {
    原始作者: OriginalPoster.value,
    當前大部分貼文作者: MostRecentPoster.value,
    頻繁發文者: FrequentPoster.value,
  },
};

const posterTypeMap: Record<string, PosterType> = {
  ...i18nPosterTypes.en,
  ...i18nPosterTypes.zh,
  ...i18nPosterTypes.zh_cn,
  ...i18nPosterTypes.zh_tw,
};

export const getPosterType = (type: string): PosterType | undefined => {
  return posterTypeMap[type];
};
