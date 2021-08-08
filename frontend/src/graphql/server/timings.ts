import { gql } from '@apollo/client';

export const TIMINGS = gql`
  mutation Timings($postNumbers: [Int!]!, $topicId: Int!) {
    timings(postNumbers: $postNumbers, topicId: $topicId)
  }
`;
