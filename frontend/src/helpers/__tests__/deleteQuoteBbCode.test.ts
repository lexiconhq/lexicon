import { deleteQuoteBbCode } from '../deleteQuoteBbCode';

describe('delete quote bb code', () => {
  it('should return string without quote bb code', () => {
    expect(
      deleteQuoteBbCode(`[quote="Tristan, post:18, topic:240335, username:Tris20"]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`),
    ).toEqual(
      "\nThe idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.",
    );
  });

  it('should return string without multiple quote bb code', () => {
    expect(
      deleteQuoteBbCode(`[quote="Tristan, post:18, topic:240335, username:Tris20"]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

[quote]
has there been any investigation into synching this with outlook or ms teams?
asdasdasdasd
[/quote]

The idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.`),
    ).toEqual(
      "\n\nThe idea of integrating it with calendars has come up. We haven't really done much investigation, but expect there may be some complexity around authentication.",
    );
  });

  it('should return string without multiple quote bb code', () => {
    expect(
      deleteQuoteBbCode(`[quote="Tristan, post:18, topic:240335, username:Tris20"]
[quote="Tris20"]
[quote]
nested quote 1
[/quote]
nested quote 2
[/quote]
nested quote 3
[/quote]
some comment`),
    ).toEqual('some comment');
  });

  it('should returns the same string if there are no quotes', () => {
    expect(
      deleteQuoteBbCode(`There's no quote here - line 1
There's no quote here - line 2

There's no quote here - line 3`),
    ).toEqual(`There's no quote here - line 1
There's no quote here - line 2

There's no quote here - line 3`);
  });
});
