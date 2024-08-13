import { getModifiedUserAgent } from '..';

it('Should check mobile and not mobile agent', () => {
  const notMobileAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) AltairGraphQLClient/6.3.1 Chrome/116.0.5845.190 Electron/26.2.2 Safari/537.36';
  let mobileAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

  expect(getModifiedUserAgent(notMobileAgent)).toEqual(`${notMobileAgent} `);
  expect(getModifiedUserAgent(mobileAgent)).toEqual(
    `${mobileAgent} DiscourseHub`,
  );
});
