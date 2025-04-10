import {
  ChangeProfileDocument,
  ChangeProfileMutationVariables,
  ChangeProfileMutation as ChangeProfileType,
  ChangeUsernameDocument,
  ChangeUsernameMutationVariables,
  ChangeUsernameMutation as ChangeUsernameType,
  EditProfileMutationVariables,
  ProfileDocument,
  ProfileQueryVariables,
  ProfileQuery as ProfileType,
  SaveProfilePictureDocument,
  SaveProfilePictureMutationVariables,
  SaveProfilePictureMutation as SaveProfilePictureType,
} from '../../../generatedAPI/server';
import { Apollo } from '../../../types';

export let editProfileResolver = async (
  _: Record<string, unknown>,
  {
    editProfileInput,
    username,
    newUsername,
    uploadId,
  }: EditProfileMutationVariables,
  { client }: { client: Apollo },
) => {
  if (newUsername) {
    let { data: usernameData } = await client.mutate<
      ChangeUsernameType,
      ChangeUsernameMutationVariables
    >({
      mutation: ChangeUsernameDocument,
      variables: {
        changeUsernameInput: {
          newUsername,
        },
        oldUsername: username,
      },
    });

    username = usernameData?.changeUsername.username || '';
  }

  if (uploadId) {
    await client.mutate<
      SaveProfilePictureType,
      SaveProfilePictureMutationVariables
    >({
      mutation: SaveProfilePictureDocument,
      variables: {
        saveProfilePictureInput: { uploadId, type: 'uploaded' },
        username,
      },
    });
  }

  if (editProfileInput) {
    let { data } = await client.mutate<
      ChangeProfileType,
      ChangeProfileMutationVariables
    >({
      mutation: ChangeProfileDocument,
      variables: {
        editProfileInput,
        username,
      },
    });
    let user = data?.changeProfile.user;

    return user;
  }

  let { data: profileData } = await client.query<
    ProfileType,
    ProfileQueryVariables
  >({
    query: ProfileDocument,
    variables: {
      username,
    },
  });

  return profileData.profile.user;
};
