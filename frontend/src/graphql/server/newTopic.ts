import { gql } from '@apollo/client';

export const NEW_TOPIC = gql`
  mutation NewTopic($newTopicInput: NewTopicInput!) {
    newTopic(newTopicInput: $newTopicInput) {
      topicId
    }
  }
`;
