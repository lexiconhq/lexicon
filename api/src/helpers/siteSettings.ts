import { AxiosInstance } from 'axios';

type GetSiteDataLexiconParams = {
  client: AxiosInstance;
  cookies: string;
};
export async function getSiteDataLexiconPlugin(
  params: GetSiteDataLexiconParams,
) {
  const { client, cookies } = params;
  let config = {
    withCredentials: true,
    Cookie: cookies,
  };

  let siteUrl = `/site.json`;

  let { data } = await client.get(siteUrl, config);

  return {
    enableLexiconPushNotifications:
      data?.lexicon?.settings.lexicon_push_notifications_enabled || false,
  };
}
