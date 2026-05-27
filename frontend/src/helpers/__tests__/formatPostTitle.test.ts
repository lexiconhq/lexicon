import { formatPostTitle } from '../formatPostTitle';

describe('formatPostTitle', () => {
  it('replaces discourse emoji shortcodes with unicode', () => {
    expect(
      formatPostTitle('Welcome to Biohacking Forums! :wave:'),
    ).toBe('Welcome to Biohacking Forums! 👋');
  });

  it('replaces skin-toned shortcodes', () => {
    expect(formatPostTitle('Hello :wave:t5:')).toBe('Hello 👋🏾');
  });

  it('replaces emoji img tags from cooked titles', () => {
    expect(
      formatPostTitle(
        'Hi <img src="/images/emoji/twitter/wave.png" class="emoji" alt=":wave:">',
      ),
    ).toBe('Hi 👋');
  });

  it('unescapes HTML entities', () => {
    expect(formatPostTitle('Fish &amp; Chips :smile:')).toBe(
      'Fish & Chips 😄',
    );
  });

  it('leaves unknown shortcodes unchanged', () => {
    expect(formatPostTitle('Test :not_a_real_emoji:')).toBe(
      'Test :not_a_real_emoji:',
    );
  });
});
