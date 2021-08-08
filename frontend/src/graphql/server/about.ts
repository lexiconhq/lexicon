import { gql } from '@apollo/client';

export const ABOUT = gql`
  query About {
    about {
      topicCount
    }
  }
`;
