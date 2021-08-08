import { gql } from '@apollo/client';

export const SINGLE_BADGE = gql`
  query SingleBadge($id: Int!) {
    singleBadge(id: $id) {
      badgeTypes {
        id
        name
        sortOrder
      }
      badge {
        id
        name
        description
      }
    }
  }
`;
