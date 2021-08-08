import axios, { AxiosResponse } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import { PROSE_DISCOURSE_HOST } from './constants';
import { getCsrfSession } from './helpers/auth';

export const discourseClient = axios.create({
  baseURL: PROSE_DISCOURSE_HOST,
  xsrfHeaderName: 'x-csrf-token',
});

axiosCookieJarSupport(discourseClient);
discourseClient.defaults.jar = new CookieJar();

export async function getClient(cookies?: string) {
  let client = discourseClient;
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
      'x-csrf-token': csrf,
      withCredentials: true,
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
