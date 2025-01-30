import { gql } from '@apollo/client';

export const TIMINGS = gql`
  mutation Timings(
    $postNumbers: [Int!]!
    $topicId: Int!
    $timingsBodyBuilder: BodyBuilder
  ) {
    timings(postNumbers: $postNumbers, topicId: $topicId)
      @rest(
        type: "String"
        path: "/topics/timings.json"
        method: "POST"
        bodyBuilder: $timingsBodyBuilder
      )
  }
`;
