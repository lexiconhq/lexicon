import { getPosterTypeDetails } from '../getPosterTypeDetails';

describe('getPosterTypeDetails', () => {
  describe('English', () => {
    it('handles a string where original poster is not first', () => {
      const result = getPosterTypeDetails('Frequent Poster, Original Poster');
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: false,
      });
    });
    it('handles uppercase', () => {
      const result = getPosterTypeDetails('ORIGINAL POSTER');
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: false,
        isMostRecentPoster: false,
      });
    });
    it('handles lowercase', () => {
      const result = getPosterTypeDetails(
        'original poster, most recent poster',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: false,
        isMostRecentPoster: true,
      });
    });
    it('handles empty string', () => {
      const result = getPosterTypeDetails('');
      expect(result).toEqual({
        isAuthor: false,
        isFrequentPoster: false,
        isMostRecentPoster: false,
      });
    });
    it('handles all three types', () => {
      const result = getPosterTypeDetails(
        'original poster, most recent poster, frequent poster',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: true,
      });
    });
    it('handles multiple spaces between entries', () => {
      const result = getPosterTypeDetails(
        '    original poster,    most recent poster,   frequent poster   ',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: true,
      });
    });

    it('handles empty string', () => {
      const result = getPosterTypeDetails('');
      expect(result).toEqual({
        isAuthor: false,
        isFrequentPoster: false,
        isMostRecentPoster: false,
      });
    });
  });
  describe('Simplified Chinese', () => {
    it('handles a string where original poster is not first', () => {
      const result = getPosterTypeDetails('频繁发帖人、原始发帖人');

      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: false,
      });
    });

    it('handles all three types', () => {
      const result = getPosterTypeDetails(
        '原始发帖人、 最新发帖人、 频繁发帖人',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: true,
      });
    });
    it('handles multiple spaces between entries', () => {
      const result = getPosterTypeDetails(
        '    原始发帖人、    最新发帖人、   频繁发帖人   ',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: true,
      });
    });
  });
  describe('Traditional Chinese', () => {
    it('handles a string where original poster is not first', () => {
      const result = getPosterTypeDetails('頻繁發文者、原始作者');

      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: false,
      });
    });

    it('handles all three types', () => {
      const result = getPosterTypeDetails(
        '原始作者、 當前大部分貼文作者、 頻繁發文者',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: true,
      });
    });
    it('handles multiple spaces between entries', () => {
      const result = getPosterTypeDetails(
        '    原始作者、    當前大部分貼文作者、   頻繁發文者   ',
      );
      expect(result).toEqual({
        isAuthor: true,
        isFrequentPoster: true,
        isMostRecentPoster: true,
      });
    });
  });
});
