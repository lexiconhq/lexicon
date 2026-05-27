import { gql } from '@apollo/client';

export const IGNORE_USER = gql`
  mutation IgnoreUser(
    $username: String!
    $ignoreUserInput: IgnoreUserInput!
    $ignoreUserBodyBuilder: BodyBuilder
  ) {
    ignoreUser(username: $username, ignoreUserInput: $ignoreUserInput)
      @rest(
        type: "IgnoreUserOutput"
        path: "/u/{args.username}/notification_level.json"
        method: "PUT"
        bodyKey: "ignoreUserInput"
        bodyBuilder: $ignoreUserBodyBuilder
      ) {
      success
    }
  }
`;
