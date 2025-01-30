import { gql } from '@apollo/client';

export const ADD_EMAIL_ADDRESS = gql`
  mutation AddEmailAddress($addEmailInput: AddEmailInput!, $username: String!) {
    addEmail(addEmailInput: $addEmailInput, username: $username)
      @rest(
        type: "String"
        path: "/u/{args.username}/preferences/email.json"
        method: "POST"
        bodyKey: "addEmailInput"
      )
  }
`;
