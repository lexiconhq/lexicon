import setCookie from 'set-cookie-parser';

/**
 * This function converts a cookie into the "name=value;" format.
 * It is used based on header cookies at the Discourse website,
 * where it only shows the cookie's name and value without other data.
 *
 * @param cookie - The string of the cookie.
 * @returns A string representing the cookie in the new format to be used at Lexicon.
 */

function joinCookieString(cookie: string): string {
  let cookies = setCookie.parse(cookie, { decodeValues: false })[0];

  let newCookie = cookies.name + '=' + cookies.value + ';';

  return newCookie;
}

export function cookiesStringify(cookies: Array<string> | string) {
  let cookieString = '';
  if (Array.isArray(cookies)) {
    for (let cookie of cookies) {
      cookieString += joinCookieString(cookie);
    }
  }
  if (typeof cookies === 'string') {
    cookieString = joinCookieString(cookies);
  }
  return cookieString;
}

/**
 * This function is used to replace and add new cookies when there are newCookies.
 *
 * When there is no value of _t in oldCookies or newCookies is undefined, it will return an empty string.
 *
 * It parses the oldCookies and newCookies, merges the new cookies into the old ones,
 * and returns the resulting merged cookie string.
 *
 * @param {Object} param The parameters object contains:
 *                       - {string|undefined} oldCookies: The old cookies string
 *                       - {Array<string>|undefined} newCookies: list of cookies which can get from response[set-cookies]
 *
 * @returns {string} The merged cookies string or an empty string if conditions are not met.
 */
export function mergeCookies({
  oldCookies,
  newCookies,
}: {
  oldCookies?: string;
  newCookies?: Array<string>;
}) {
  // example old cookies format '_t=value;_forum=session;'
  let parseOldCookie = oldCookies
    ? setCookie.parse(oldCookies.split(';'), {
        map: true,
        decodeValues: false,
      })
    : {};

  // eslint-disable-next-line no-underscore-dangle
  if (!oldCookies || !parseOldCookie._t || !newCookies) {
    return '';
  }
  const parsedNewCookies = setCookie.parse(newCookies, {
    decodeValues: false,
  });

  // Replaces the old cookie value with the new cookie value if the same cookie name exists.
  // Creates a new cookie entry if the new cookie name is not found in the old cookies.

  parsedNewCookies.forEach((newCookie) => {
    parseOldCookie[newCookie.name] = {
      name: newCookie.name,
      value: newCookie.value,
    };
  });

  return Object.entries(parseOldCookie)
    .map(([key, { value }]) => `${key}=${value};`)
    .join('');
}
