import { stringify } from 'querystring';

import FormData from 'form-data';
import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, arg, intArg, nullable } from 'nexus';

import { CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let replyResolver: FieldResolver<'Mutation', 'reply'> = async (
  _,
  { replyInput, file, type, userId },
  context: Context,
) => {
  let replyInputSnake = snakecaseKey({ ...replyInput, archetype: 'regular' });
  const config = {
    headers: { 'Content-Type': CONTENT_FORM_URLENCODED },
  };

  try {
    if (file) {
      if (type === 'avatar' && !userId) {
        throw new Error('Upload avatar must include user id.');
      }
      const form = new FormData();

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      form.append('files[]', fileBuffer, file.name);
      form.append('type', type);
      if (userId) {
        form.append('user_id', userId);
      }

      const config = {
        headers: form.getHeaders(),
      };
      let url = `/uploads.json`;
      let { data } = await context.client.post(url, form, config);
      let {
        originalFilename: name,
        width,
        height,
        shortUrl,
      } = camelcaseKey(data, { deep: true });
      let image = `![${name}|${width} x ${height}](${shortUrl})`;

      replyInputSnake.raw = image + '\n' + replyInputSnake.raw;
    }

    let { data } = await context.client.post(
      '/posts.json',
      stringify(replyInputSnake),
      config,
    );
    return camelcaseKey(data, { deep: true });
  } catch (e) {
    throw errorHandler(e);
  }
};

export let replyMutation = mutationField('reply', {
  type: 'Post',
  args: {
    replyInput: arg({ type: 'ReplyInput' }),
    file: nullable(arg({ type: 'File' })),
    type: nullable(arg({ type: 'UploadTypeEnum' })),
    userId: nullable(intArg()),
  },
  resolve: replyResolver,
});
