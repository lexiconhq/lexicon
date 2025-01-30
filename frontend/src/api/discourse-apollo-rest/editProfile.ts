import { gql } from '@apollo/client';

export const SAVE_PROFILE_PICTURE = gql`
  mutation SaveProfilePicture(
    $username: String!
    $saveProfilePictureInput: SaveProfilePictureInput!
  ) {
    saveProfilePicture(
      username: $username
      saveProfilePictureInput: $saveProfilePictureInput
    )
      @rest(
        type: "String"
        path: "/u/{args.username}/preferences/avatar/pick.json"
        method: "PUT"
        bodyKey: "saveProfilePictureInput"
      )
  }
`;

export const CHANGE_USERNAME = gql`
  mutation ChangeUsername(
    $changeUsernameInput: ChangeUsernameInput!
    $oldUsername: String!
  ) {
    changeUsername(
      changeUsernameInput: $changeUsernameInput
      oldUsername: $oldUsername
    )
      @rest(
        type: "ChangeUsernameOutput"
        path: "/u/{args.oldUsername}/preferences/username.json"
        method: "PUT"
        bodyKey: "changeUsernameInput"
      ) {
      username
    }
  }
`;

export const CHANGE_PROFILE = gql`
  mutation ChangeProfile(
    $editProfileInput: EditProfileInput!
    $username: String!
  ) {
    changeProfile(editProfileInput: $editProfileInput, username: $username)
      @rest(
        type: "ChangeProfileOutput"
        path: "/users/{args.username}.json"
        method: "PUT"
        bodyKey: "editProfileInput"
      ) {
      user {
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
  }
`;

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
    ) @client {
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
