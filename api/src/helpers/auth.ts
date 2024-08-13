import { stringify } from 'querystring';

import { AxiosInstance } from 'axios';
import camelcaseKey from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import { discourseClient } from '../client';
import {
  ACCEPTED_LANGUAGE,
  CONTENT_FORM_URLENCODED,
  CONTENT_JSON,
} from '../constants';

import { cookiesStringify } from './cookiesStringify';
import { SessionExpiredError } from './customErrors';
import { getSiteDataLexiconPlugin } from './siteSettings';

async function getCsrfSession(cookies?: string) {
  let {
    data: { csrf },
    headers,
  } = await discourseClient.get('/session/csrf.json', {
    headers: {
      Cookie: cookies ? cookies : '',
    },
    withCredentials: true,
  });
  let initialSessionCookie = cookiesStringify(headers['set-cookie']);
  return { csrf, initialSessionCookie };
}

type Credentials = {
  login: string;
  password: string;
  secondFactorToken?: string | null;
};
type CsrfSession = { csrf: string; initialSessionCookie: string };
type HpSession = {
  initialSessionCookie: string;
  passwordConfirmation: string;
  challenge: string;
};
type AuthRequest = Credentials & CsrfSession & { client: AxiosInstance };
type AppleAuthRequest = { identityToken: string } & CsrfSession & {
    client: AxiosInstance;
  };
type LoginLinkRequest = { emailToken: string } & CsrfSession & {
    client: AxiosInstance;
  };

type ActivateAccountRequest = { emailToken: string } & CsrfSession &
  HpSession & {
    client: AxiosInstance;
  };

function generateToken(cookies: string) {
  const buffer = Buffer.from(cookies);
  const token = buffer.toString('base64');

  return token;
}

function decodeToken(token: string | null) {
  if (!token) {
    return '';
  }
  const base64TokenRegex =
    /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  let isValidToken = base64TokenRegex.test(token);
  if (!isValidToken) {
    return '';
  }

  const buffer = Buffer.from(token, 'base64');
  const cookies = buffer.toString('utf8');

  return cookies;
}

async function authenticate(authRequest: AuthRequest) {
  let {
    csrf,
    initialSessionCookie,
    login,
    password,
    secondFactorToken,
    client,
  } = authRequest;

  let config = {
    headers: {
      'x-csrf-token': csrf,
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
    withCredentials: true,
    Cookie: initialSessionCookie,
  };
  let secondFactorLogin = {};
  if (secondFactorToken) {
    secondFactorLogin = snakecaseKeys({
      secondFactorToken,
      secondFactorMethod: 1,
    });
  }
  let body = stringify({ login, password, ...secondFactorLogin });

  let { data, headers } = await client.post('/session.json', body, config);
  let { error, failed } = data;
  if (failed) {
    return {
      ...camelcaseKey(data, { deep: true }),
      secondFactorRequired: true,
    };
  }
  if (error) {
    throw new Error(error);
  }
  let stringCookie = cookiesStringify(headers['set-cookie']);
  let token = generateToken(stringCookie);

  let siteData = await getSiteDataLexiconPlugin({
    client,
    cookies: headers['set-cookie'],
  });

  return {
    ...camelcaseKey(data, { deep: true }),
    token,
    enableLexiconPushNotifications: siteData.enableLexiconPushNotifications,
  };
}

async function getHpChallenge(csrfSession: CsrfSession) {
  let { csrf, initialSessionCookie } = csrfSession;

  let config = {
    headers: {
      'x-csrf-token': csrf,
      withCredentials: true,
      Cookie: initialSessionCookie,
    },
    validateStatus: () => true, // This make request not catch error so we can handle it.
  };
  let data;
  let headers;
  let { data: oldVersionData, headers: oldVersionHeaders } =
    await discourseClient.get('/users/hp.json', config);
  let { errors: oldVersionErrors, error_type: oldVersionErrorType } =
    oldVersionData;
  if (
    oldVersionErrors &&
    (oldVersionErrorType === 'not_found' ||
      oldVersionErrorType === 'not_logged_in')
  ) {
    let { data: newVersionData, headers: newVersionHeaders } =
      await discourseClient.get('/session/hp.json', config);
    data = newVersionData;
    headers = newVersionHeaders;
  } else {
    data = oldVersionData;
    headers = oldVersionHeaders;
  }
  let { errors } = data;
  if (errors) {
    throw new Error(errors);
  }
  let { value, challenge } = data;

  return {
    passwordConfirmation: value,
    challenge: challenge.split('').reverse().join(''),
    cookies: cookiesStringify(headers['set-cookie']),
  };
}

async function checkSession(authClient: AxiosInstance) {
  let sessionCookie: string = authClient.defaults.headers.Cookie;
  if (!sessionCookie) {
    throw new SessionExpiredError();
  }
  try {
    let { data, headers } = await authClient.get('/session/current.json');
    let stringCookie = '';
    if (headers['set-cookie'] && headers['set-cookie'].length) {
      if (headers['set-cookie'].length === 1) {
        // This only replace _t= token
        const tRegex = /\b_t=.+?Secure\b/;
        stringCookie = sessionCookie.replace(tRegex, headers['set-cookie'][0]);
      } else {
        stringCookie = cookiesStringify(headers['set-cookie']);
      }
    } else {
      stringCookie = sessionCookie;
    }
    let token = generateToken(stringCookie);
    return {
      ...camelcaseKey(data.current_user),
      token,
    };
  } catch (e) {
    throw new SessionExpiredError();
  }
}

async function authenticateApple(appleAuthRequest: AppleAuthRequest) {
  let { csrf, initialSessionCookie, identityToken, client } = appleAuthRequest;

  let config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
      'x-csrf-token': csrf,
    },
    withCredentials: true,
    Cookie: initialSessionCookie,
  };

  let { data, headers } = await client.post(
    '/lexicon/auth/apple/login.json',
    {
      id_token: identityToken,
    },
    config,
  );
  let { error } = data;
  if (error) {
    throw new Error(error);
  }
  let stringCookie = cookiesStringify(headers['set-cookie']);
  let token = generateToken(stringCookie);

  let siteData = await getSiteDataLexiconPlugin({
    client,
    cookies: headers['set-cookie'],
  });

  return {
    ...camelcaseKey(data, { deep: true }),
    token,
    enableLexiconPushNotifications: siteData.enableLexiconPushNotifications,
  };
}

async function authenticateActivateAccount(
  activateAccountRequest: ActivateAccountRequest,
) {
  let { csrf, initialSessionCookie, emailToken, client, ...hpValue } =
    activateAccountRequest;

  let config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_FORM_URLENCODED,
      'x-csrf-token': csrf,
    },
    withCredentials: true,
    Cookie: initialSessionCookie,
  };

  let snakecaseBody = snakecaseKeys({
    token: emailToken,
    ...hpValue,
  });

  let { data, headers } = await client.post(
    `/lexicon/auth/activate_account.json`,
    stringify(snakecaseBody),
    config,
  );
  let { error } = data;
  if (error) {
    throw new Error(error);
  }
  let stringCookie = cookiesStringify(headers['set-cookie']);
  let token = generateToken(stringCookie);

  let siteData = await getSiteDataLexiconPlugin({
    client,
    cookies: headers['set-cookie'],
  });

  return {
    ...camelcaseKey(data, { deep: true }),
    token,
    enableLexiconPushNotifications: siteData.enableLexiconPushNotifications,
  };
}

async function authenticateLoginLink(authRequest: LoginLinkRequest) {
  let { csrf, initialSessionCookie, emailToken, client } = authRequest;

  let config = {
    headers: {
      'x-csrf-token': csrf,
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
    withCredentials: true,
    Cookie: initialSessionCookie,
  };
  let body = stringify({ token: emailToken });

  let { data, headers } = await client.post(
    `/session/email-login/${emailToken}.json`,
    body,
    config,
  );
  let { error, failed } = data;
  if (failed) {
    return {
      ...camelcaseKey(data, { deep: true }),
    };
  }
  if (error) {
    throw new Error(error);
  }
  let stringCookie = cookiesStringify(headers['set-cookie']);
  let token = generateToken(stringCookie);

  let configUser = {
    headers: {
      'x-csrf-token': csrf,
    },
    withCredentials: true,
    Cookie: headers['set-cookie'],
  };
  let { data: userData } = await client.get(
    `/lexicon/auth/user.json`,
    configUser,
  );

  let siteUrl = `/site.json`;
  let {
    data: { lexicon },
  } = await client.get(siteUrl, configUser);

  return {
    ...camelcaseKey(userData, { deep: true }),
    token,
    enableLexiconPushNotifications:
      lexicon?.settings.lexicon_push_notifications_enabled || false,
  };
}

export {
  getCsrfSession,
  authenticate,
  decodeToken,
  generateToken,
  getHpChallenge,
  checkSession,
  authenticateApple,
  authenticateActivateAccount,
  authenticateLoginLink,
};
