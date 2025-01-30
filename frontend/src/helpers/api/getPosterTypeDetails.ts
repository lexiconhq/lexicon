import { z } from 'zod';

import { getPosterType, i18nSeparatorsRegex } from '../../api/resolver/locale';
import {
  FrequentPoster,
  MostRecentPoster,
  OriginalPoster,
  UnknownPosterType,
} from '../../types/api';

export const PosterTypeDetails = z.object({
  isAuthor: z.boolean(),
  isFrequentPoster: z.boolean(),
  isMostRecentPoster: z.boolean(),
});
export type PosterTypeDetails = z.infer<typeof PosterTypeDetails>;

export function getPosterTypeDetails(description: string): PosterTypeDetails {
  if (!description) {
    return {
      isAuthor: false,
      isFrequentPoster: false,
      isMostRecentPoster: false,
    };
  }

  const items = description.split(i18nSeparatorsRegex);

  const posterTypes = items.map((item) => {
    const lowercased = item.toLowerCase().trim();
    const knownMatch = getPosterType(lowercased);

    return knownMatch ?? UnknownPosterType.value;
  });

  return {
    isAuthor: posterTypes.includes(OriginalPoster.value),
    isFrequentPoster: posterTypes.includes(FrequentPoster.value),
    isMostRecentPoster: posterTypes.includes(MostRecentPoster.value),
  };
}
