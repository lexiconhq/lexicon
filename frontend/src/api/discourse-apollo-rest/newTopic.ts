import { gql } from '@apollo/client';

/**
 * Adds a new `archetype` field to `NewTopicInput`, which will always have the value 'regular' for `newTopic`.
 * In the previous implementation, the `archetype` was added to the payload body in prose.
 */
export const NEW_TOPIC = gql`
  mutation NewTopic($newTopicInput: NewTopicInput!) {
    newTopic(newTopicInput: $newTopicInput)
      @rest(
        type: "Post"
        path: "/posts.json"
        method: "POST"
        bodyKey: "newTopicInput"
      ) {
      topicId
    }
  }
`;
