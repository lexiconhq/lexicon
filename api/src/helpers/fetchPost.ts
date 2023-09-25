import { AxiosInstance } from 'axios';
import camelcaseKeys from 'camelcase-keys';

import { ACCEPTED_LANGUAGE } from '../constants';

type Params = {
  client: AxiosInstance;
  postId: number;
};

const config = {
  headers: { 'Accept-Language': ACCEPTED_LANGUAGE },
  params: { include_raw: true },
};

export async function fetchPost(params: Params) {
  const { client, postId } = params;
  let url = `/posts/${postId}.json`;
  let { data } = await client.get(url, config);
  return camelcaseKeys(data, { deep: true });
}
