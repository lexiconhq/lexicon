import { gql } from '@apollo/client';

export const EDIT_PROFILE = gql`
  mutation EditProfile(
    $username: String!
    $editProfileInput: EditProfileInput
    $newUsername: String
    $uploadId: Int
  ) {
    editProfile(
      username: $username
      editProfileInput: $editProfileInput
      newUsername: $newUsername
      uploadId: $uploadId
    ) {
      id
      username
      avatar: avatarTemplate
      name
      websiteName
      bioRaw
      location
      dateOfBirth
    }
  }
`;
