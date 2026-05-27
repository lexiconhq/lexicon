type DiscourseTagLike =
  | string
  | {
      id?: string | number;
      name?: string;
      slug?: string;
    };

/**
 * Discourse may return topic tags as strings or as objects ({ id, name, slug }).
 * UI components expect string tag names.
 */
export function normalizeTopicTags(
  tags: Array<DiscourseTagLike> | null | undefined,
): Array<string> {
  if (!tags?.length) {
    return [];
  }

  return tags.map((tag) => {
    if (typeof tag === 'string') {
      return tag;
    }

    if (tag && typeof tag === 'object') {
      if (typeof tag.name === 'string' && tag.name.length > 0) {
        return tag.name;
      }
      if (typeof tag.slug === 'string' && tag.slug.length > 0) {
        return tag.slug;
      }
      if (tag.id != null) {
        return String(tag.id);
      }
    }

    return String(tag);
  });
}
