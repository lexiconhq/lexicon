import { FieldResolver, mutationField, intArg, stringArg } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let saveProfilePictureResolver: FieldResolver<
  'Mutation',
  'saveProfilePicture'
> = async (_, { uploadId, username }, context: Context) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  let body = {
    upload_id: uploadId,
    type: 'uploaded',
  };
  try {
    await context.client.put(
      `/u/${username}/preferences/avatar/pick.json`,
      body,
      config,
    );
    return 'success';
  } catch (error) {
    throw errorHandler(error);
  }
};

export let saveProfilePictureMutation = mutationField('saveProfilePicture', {
  type: 'String',
  args: {
    uploadId: intArg(),
    username: stringArg(),
  },
  resolve: saveProfilePictureResolver,
});
