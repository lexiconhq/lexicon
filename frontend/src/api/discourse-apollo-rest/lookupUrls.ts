import { gql } from '@apollo/client';

export const LOOKUP_URLS = gql`
  query LookupUrls($lookupUrlInput: LookupUrlInput!) {
    lookupUrls(lookupUrlInput: $lookupUrlInput)
      @rest(
        type: "LookupUrl"
        path: "/uploads/lookup-urls.json"
        method: "POST"
        bodyKey: "lookupUrlInput"
      ) {
      shortUrl
      url
    }
  }
`;
