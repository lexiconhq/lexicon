import { gql } from '@apollo/client';

export const ABOUT = gql`
  query About {
    about @rest(type: "About", path: "/about.json") {
      topicCount
      postCount
    }
  }
`;
