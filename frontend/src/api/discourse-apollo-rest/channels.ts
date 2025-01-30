import { gql } from '@apollo/client';

export const GET_CHANNELS = gql`
  query GetChannels {
    category @rest(type: "CategoryList", path: "/categories.json") {
      categories @type(name: "Categories") {
        id
        color
        name
        descriptionText
      }
    }
  }
`;
