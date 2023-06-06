import { replaceQuotesWithMarkdown } from '../replaceQuotesWithMarkdown';

describe('replace quote bb code with blockquote markdown', () => {
  it('should replace quote bb code in string with blockquote markdown', () => {
    expect(
      replaceQuotesWithMarkdown(`[quote="Tristan, post:18, topic:240335, username:Tris20"]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`),
    ).toEqual(
      `> @Tris20
> has there been any investigation into synching this with outlook or ms teams?
> asdasdasdasd


The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`,
    );
  });

  it('should replace multiple quote bb code in string with blockquote markdown', () => {
    expect(
      replaceQuotesWithMarkdown(`[quote="Tristan, post:18, topic:240335, username:Tris20"]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

[quote="post:18, topic:240335"]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

[quote]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`),
    ).toEqual(
      `> @Tris20
> has there been any investigation into synching this with outlook or ms teams?
> asdasdasdasd


> (unknown user)
> has there been any investigation into synching this with outlook or ms teams?
> asdasdasdasd


> has there been any investigation into synching this with outlook or ms teams?
> asdasdasdasd


The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`,
    );
  });

  it('should replace quote bb code without attribute in string with blockquote markdown', () => {
    expect(
      replaceQuotesWithMarkdown(`[quote]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

[quote="Tristan, post:18, topic:240335, username:Tris20"]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`),
    ).toEqual(
      `> has there been any investigation into synching this with outlook or ms teams?
> asdasdasdasd


> @Tris20
> has there been any investigation into synching this with outlook or ms teams?
> asdasdasdasd


The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`,
    );
  });

  it('should replace nested quote bb code', () => {
    expect(
      replaceQuotesWithMarkdown(`[quote="Tristan, post:18, topic:240335, username:Tris20"]
[quote="Tris20"]
[quote]
nested quote 1
[/quote]
nested quote 2
[/quote]
nested quote 3
[/quote]
some comment`),
    ).toEqual(`> @Tris20
> > @Tris20
> > > nested quote 1
> > 
> > nested quote 2
> 
> nested quote 3

some comment`);
  });

  it('should returns the same string if there are no quotes', () => {
    expect(
      replaceQuotesWithMarkdown(`There's no quote here - line 1
There's no quote here - line 2

There's no quote here - line 3`),
    ).toEqual(`There's no quote here - line 1
There's no quote here - line 2

There's no quote here - line 3`);
  });
});
