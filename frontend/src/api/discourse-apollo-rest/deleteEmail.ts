import { gql } from '@apollo/client';

export const DELETE_EMAIL = gql`
  mutation DeleteEmail(
    $email: String!
    $username: String!
    $deleteEmailPath: PathBuilder
  ) {
    deleteEmail(email: $email, username: $username)
      @rest(
        type: "DeleteEmailOutput"
        method: "DELETE"
        path: ""
        pathBuilder: $deleteEmailPath
      )
  }
`;
