import { PROSE_DISCOURSE_HOST } from '../../constants';
import {
  getNormalizedUrlTemplate,
  NormalizedUrlTemplateVariant,
} from '../../resolvers/utils';

describe('getNormalizedUrlTemplate', () => {
  const tests: Array<[string, NormalizedUrlTemplateVariant]> = [
    ['avatarTemplate', 'regularAvatar'],
    ['actingAvatarTemplate', 'actingAvatar'],
    ['systemAvatarTemplate', 'systemAvatar'],
    ['url', 'url'],
  ];

  tests.forEach(([property, variant]) => {
    /**
     * Helper function to make Typescript happy. Without this, it complains
     * about the object not containing at least one of the expected keys.
     *
     * This occurs even if we annote tests like:
     * ```
     * type TemplateField = 'avatarTemplate' | 'actingAvatarTemplate' | ...;
     * const tests: [TemplateField, NormalizedUrlTemplateVariant][] = [ ... ];
     * ```
     *
     * So instead, we check each case and fallback to the last case of `url` if
     * none of the others matched.
     */
    function getParameter(url: string) {
      if (property === 'avatarTemplate') {
        return { avatarTemplate: url };
      }

      if (property === 'actingAvatarTemplate') {
        return { actingAvatarTemplate: url };
      }

      if (property === 'systemAvatarTemplate') {
        return { systemAvatarTemplate: url };
      }

      return { url };
    }

    describe(property, () => {
      it('does not append host when http is already present', () => {
        const input = 'https://discourse.host/site/images/1.jpg';
        const parameter = getParameter(input);

        const result = getNormalizedUrlTemplate(parameter, variant);
        expect(result).toStrictEqual(input);
      });

      it('appends host when http is not present', () => {
        const input = '/thumbnails/32x32/user-5.jpg';
        const parameter = getParameter(input);

        const result = getNormalizedUrlTemplate(parameter, variant);

        expect(result).toStrictEqual(`${PROSE_DISCOURSE_HOST}${input}`);
      });
    });
  });

  it('returns an empty URL when no URL field was provided', () => {
    // Justification: ignore the fact that TS won't let us pass an empty
    // object just to double-check how it behaves.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = getNormalizedUrlTemplate({}, 'url');
    expect(result).toStrictEqual('');
  });

  it('returns an empty URL when an empty URL was provided', () => {
    const result = getNormalizedUrlTemplate({ url: '' }, 'url');
    expect(result).toStrictEqual('');
  });

  it('returns an empty URL when the variant does not match the URL field', () => {
    const input = '/images/1.jpg';
    const result = getNormalizedUrlTemplate(
      { systemAvatarTemplate: input },
      'actingAvatar',
    );
    expect(result).toStrictEqual('');
  });

  it('defaults the variant to regularAvatar when no variant is provided', () => {
    const input = '/images/1.jpg';
    const result = getNormalizedUrlTemplate({ avatarTemplate: input });
    expect(result).toStrictEqual(`${PROSE_DISCOURSE_HOST}${input}`);
  });

  /** PRURLS (Protocol-relative URLs) allow specifying a URL without the protocol.
   * For example, https://google.com might be specified as `//google.com`. It is a
   * method for linking to a website that offers both HTTP and HTTPS.
   *
   * The test below tests for what is basically a bug. If we later want to
   * support these URLs, we should revamp the function to support checking for
   * PRURLs as well. For now, this just serves as an example of how it would
   * behave if we encountered one.
   */
  it('poorly appends the path for PRURLs', () => {
    const result = getNormalizedUrlTemplate(
      { url: '//discourse.host/site/images/1.jpg' },
      'url',
    );
    expect(result).toStrictEqual(
      'https://meta.discourse.org//discourse.host/site/images/1.jpg',
    );
  });

  it('handles http:// as expected', () => {
    const avatarTemplate = 'http://meta.discourse.org/site/images/1.png';
    const result = getNormalizedUrlTemplate({ avatarTemplate });

    expect(result).toStrictEqual(avatarTemplate);
  });
});
