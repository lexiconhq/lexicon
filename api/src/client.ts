import { ServerResponse } from 'http';

import axios, { AxiosResponse } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import { CUSTOM_HEADER_TOKEN, PROSE_DISCOURSE_HOST } from './constants';
import {
  generateToken,
  getCsrfSession,
  getModifiedUserAgent,
  mergeCookies,
} from './helpers';

export const discourseClient = axios.create({
  baseURL: PROSE_DISCOURSE_HOST,
  xsrfHeaderName: 'x-csrf-token',
});

axiosCookieJarSupport(discourseClient);
discourseClient.defaults.jar = new CookieJar();

type GetClientParams = {
  cookies?: string;
  userAgent?: string;
  context: {
    request: Request;
    response: ServerResponse;
  };
};

export async function getClient(params: GetClientParams) {
  const { cookies, userAgent, context } = params;
  let client = discourseClient;
  client.defaults.headers = {
    'User-Agent': getModifiedUserAgent(userAgent),
  };

  if (cookies) {
    let { csrf } = await getCsrfSession(cookies);
    client = axios.create({
      baseURL: PROSE_DISCOURSE_HOST,
      xsrfHeaderName: 'x-csrf-token',
    });

    axiosCookieJarSupport(client);
    client.defaults.jar = new CookieJar();
    client.defaults.headers = {
      Cookie: cookies,
      withCredentials: true,
      'User-Agent': getModifiedUserAgent(userAgent),
      'x-csrf-token': csrf,
    };
  }

  client.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: AxiosResponse<any>) => {
      const contentType = response.headers['content-type'];
      if (contentType.includes('text/html')) {
        throw new Error('Not found or private.');
      }

      let newCookies = response.headers['set-cookie'];

      let resultMerge = mergeCookies({ oldCookies: cookies, newCookies });

      /**
       * This condition checks if there is a valid cookie.
       * To refresh the cookie, it must contain an `_t` cookie in the old cookies, indicating that the user is already logged in.
       * It also checks for new cookies and ensures the cookie format is correct, excluding cookies from the login API,
       * which uses the `session.json` endpoint.
       */

      if (resultMerge && !response.request.path.includes('session.json')) {
        let token = generateToken(resultMerge);

        if (!context.response.headersSent) {
          context.response.setHeader(CUSTOM_HEADER_TOKEN, token);
        }
      }
      return response;
    },
  );
  return client;
}
