import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import {
  FieldResolver,
  mutationField,
  arg,
  intArg,
  stringArg,
  nullable,
} from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';
import { changeUsernameResolver } from '../user/changeUsernameMutation';

import { saveProfilePictureResolver } from './saveProfilePictureMutation';
import { userProfileQueryResolver } from './userProfileQuery';

export let editProfileMutation: FieldResolver<
  'Mutation',
  'editProfile'
> = async (
  _,
  { editProfileInput, username, newUsername, uploadId },
  context: Context,
  info,
) => {
  if (newUsername) {
    let usernameData = await changeUsernameResolver(
      _,
      { newUsername, oldUsername: username },
      context,
      info,
    );
    username = await usernameData.username;
  }

  if (uploadId) {
    await saveProfilePictureResolver(_, { uploadId, username }, context, info);
  }

  if (editProfileInput) {
    let editProfile = snakecaseKey(editProfileInput);
    const config = {
      headers: {
        'Accept-Language': ACCEPTED_LANGUAGE,
        'Content-Type': CONTENT_JSON,
      },
    };
    try {
      let { data } = await context.client.put(
        `/users/${username}.json`,
        editProfile,
        config,
      );
      let user = data.user;

      return camelcaseKey(user, { deep: true });
    } catch (e) {
      errorHandler(e);
    }
  }
  let { user } = await userProfileQueryResolver(_, { username }, context, info);
  return user;
};

export let editProfile = mutationField('editProfile', {
  type: 'UserDetail',
  args: {
    editProfileInput: nullable(arg({ type: 'EditProfileInput' })),
    username: stringArg(),
    newUsername: nullable(stringArg()),
    uploadId: nullable(intArg()),
  },
  resolve: editProfileMutation,
});
