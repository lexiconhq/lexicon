import camelcaseKeys from 'camelcase-keys';
import FormData from 'form-data';
import { FieldResolver, mutationField, arg, intArg, nullable } from 'nexus';
import sharp from 'sharp';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let uploadResolver: FieldResolver<'Mutation', 'upload'> = async (
  _,
  { file, type, userId, token },
  context: Context,
) => {
  if (type === 'avatar' && !userId) {
    throw new Error('Upload avatar must include user id.');
  }
  const form = new FormData();

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  let resizedImageBuffer = fileBuffer;

  /**
   * This condition to optimize file image if more than 1 Mb to use sharp which will resize file size to be optimal
   */
  if (file.size > 1000000 && type === 'avatar') {
    resizedImageBuffer = await sharp(fileBuffer).toBuffer();
  }

  form.append('files[]', resizedImageBuffer, file.name);
  form.append('type', type);
  if (userId) {
    form.append('user_id', userId);
  }

  const config = {
    headers: {
      ...form.getHeaders(),
    },
  };

  const url = `/uploads.json`;
  try {
    let { data } = await context.client.post(url, form, config);
    data = { ...data, token };
    return camelcaseKeys(data, { deep: true });
  } catch (e) {
    throw errorHandler(e);
  }
};

export let uploadMutation = mutationField('upload', {
  type: 'UploadOutput',
  args: {
    file: arg({ type: 'File' }),
    type: arg({ type: 'UploadTypeEnum' }),
    userId: nullable(intArg()),
    token: nullable(intArg()),
  },
  resolve: uploadResolver,
});
