import fs from 'fs';
import path from 'path';

import { device } from 'detox';

const appJsonPath = path.join(__dirname, '../../../frontend/app.json');

type RedirectArgs = {
  type: 'post' | 'message' | 'chat' | 'thread';
  content: string;
};

export async function redirectToApp({ type, content }: RedirectArgs) {
  const appJson = fs.readFileSync(appJsonPath, 'utf8');
  const { expo } = JSON.parse(appJson);
  const scheme = expo.scheme;

  let link = `${scheme}://`;

  switch (type) {
    case 'post':
      link += `post-detail/${content}`;
      break;
    case 'message':
      link += `message-detail/${content}`;
      break;
    case 'chat':
      link += `chat-detail/${content}`;
      break;
    case 'thread':
      link += `thread-detail/${content}`;
      break;
  }

  await device.launchApp({
    newInstance: false,
    url: link,
  });
}
