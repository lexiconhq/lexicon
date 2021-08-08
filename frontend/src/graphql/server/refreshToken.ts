import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
  query RefreshToken {
    refreshToken {
      id
      username
      name
      token
    }
  }
`;
