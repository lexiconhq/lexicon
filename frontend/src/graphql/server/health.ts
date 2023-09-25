import { gql } from '@apollo/client';

export const ABOUT = gql`
  query Health {
    health {
      isDiscourseReachable
      discourseHost
      discourseError
    }
  }
`;
