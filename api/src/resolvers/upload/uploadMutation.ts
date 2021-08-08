import camelcaseKeys from 'camelcase-keys';
import FormData from 'form-data';
import { FieldResolver, mutationField, arg, intArg } from '@nexus/schema';

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
  let { createReadStream } = await file;
  let fileStream = createReadStream();
  form.append('files[]', fileStream);
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
    file: arg({ type: 'Upload', required: true }),
    type: arg({ type: 'UploadTypeEnum', required: true }),
    userId: intArg(),
    token: intArg(),
  },
  resolve: uploadResolver,
});
