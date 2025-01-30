import { gql } from '@apollo/client';

export const SET_PRIMARY_EMAIL = gql`
  mutation SetPrimaryEmail($input: SetPrimaryEmailInput!, $username: String!) {
    setPrimaryEmail(input: $input, username: $username)
      @rest(
        type: "SetPrimaryEmailOutput"
        path: "/users/{args.username}/preferences/primary-email.json"
        method: "PUT"
        bodyKey: "input"
      )
  }
`;
