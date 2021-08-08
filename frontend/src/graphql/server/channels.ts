import { gql } from '@apollo/client';

export const GET_CHANNELS = gql`
  query GetChannels {
    category {
      categories {
        id
        color
        name
        descriptionText
      }
    }
  }
`;
