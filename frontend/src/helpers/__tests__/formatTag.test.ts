import { formatTag } from '../formatTag';

describe('format tag', () => {
  it('should return empty string', () => {
    expect(formatTag('')).toEqual('');
  });

  it('should return empty string', () => {
    expect(formatTag('     ')).toEqual('');
  });

  it('should return original tag', () => {
    expect(formatTag('lexicon')).toEqual('lexicon');
  });

  it('should return lowercased tag', () => {
    expect(formatTag('LeXiCoN')).toEqual('lexicon');
  });

  it('should return trimmed and concatted multiwords tags', () => {
    expect(formatTag('  front trimmed')).toEqual('front-trimmed');
    expect(formatTag('back trimmed  ')).toEqual('back-trimmed');
    expect(formatTag('  middle  trimmed  ')).toEqual('middle-trimmed');
  });

  it('should return normalized tag', () => {
    expect(formatTag('???cool??programmer12_3?')).toEqual(
      'cool-programmer12-3',
    );
    expect(formatTag('<script>alert("abc")</script>')).toEqual(
      'script-alert-abc-script',
    );
  });

  it('should trim tag', () => {
    expect(formatTag('this is a really long tag', 6)).toEqual('this-i');
  });
});
