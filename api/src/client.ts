import axios, { AxiosResponse } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import { PROSE_DISCOURSE_HOST } from './constants';
import { getCsrfSession, getModifiedUserAgent } from './helpers';

export const discourseClient = axios.create({
  baseURL: PROSE_DISCOURSE_HOST,
  xsrfHeaderName: 'x-csrf-token',
});

axiosCookieJarSupport(discourseClient);
discourseClient.defaults.jar = new CookieJar();

type GetClientParams = {
  cookies?: string;
  userAgent?: string;
};

export async function getClient(params: GetClientParams) {
  const { cookies, userAgent } = params;
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

      return response;
    },
  );
  return client;
}
