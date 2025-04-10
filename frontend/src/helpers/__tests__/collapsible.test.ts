import {
  extractCollapsibleContent,
  isCollapsible,
  separateCollapsibleInContent,
} from '../collapsible';

describe('collapsible', () => {
  const poll =
    '[poll name=poll1 type=regular results=always chartType=bar]\n' +
    '# This is a poll\n' +
    '- 1\n' +
    '- 2\n' +
    '[/poll]\n';
  const image =
    '![1722242707775.jpg|4032 x 3024](upload://4akgoKitNP3UmnIGIiHylB1xi7T.jpeg)\n';
  const collapsible =
    '[details="This is a collapsible"]\n' +
    'This text will be hidden\n' +
    '[/details]\n';
  const formattedText = '**Bold** *Italic*\n';
  const bulletedList = '- List Item\n';
  const numberedList = '1. List Item\n';
  const link = '[KFLounge](https://www.kflounge-staging.kfox.io/)\n';
  const nestedCollapsible =
    '[details="Outer collapsible"]\n' +
    '[details="Inner collapsible"]\n' +
    'This text will be hidden\n' +
    '[/details]\n' +
    '[/details]\n';

  const content =
    poll +
    image +
    'Text before collapsible\n' +
    collapsible +
    'Text after collapsible\n' +
    formattedText +
    nestedCollapsible +
    bulletedList +
    numberedList +
    link +
    collapsible +
    'Text end';

  const result = [
    `${poll}${image}Text before collapsible`,
    collapsible.trim(),
    `Text after collapsible\n${formattedText.trim()}`,
    nestedCollapsible.trim(),
    `${bulletedList}${numberedList}${link.trim()}`,
    collapsible.trim(),
    'Text end',
  ];

  it('should separate collapsible markdown from other markdown in content', () => {
    expect(separateCollapsibleInContent(content)).toEqual(result);
    expect(separateCollapsibleInContent('')).toEqual(['']);
    expect(separateCollapsibleInContent('Plain text ' + image)).toEqual([
      'Plain text ' + image,
    ]);
  });

  it('should check if the content is a collapsible markdown or not', () => {
    expect(isCollapsible(result[1])).toBe(true);
    expect(isCollapsible(result[0])).toBe(false);
  });

  it('should extract the title and content from a collapsible markdown', () => {
    expect(extractCollapsibleContent(result[1])).toEqual({
      title: 'This is a collapsible',
      details: 'This text will be hidden',
    });

    expect(extractCollapsibleContent(`[details=""]\n[/details]`)).toEqual({
      title: '',
      details: '',
    });
  });
});
