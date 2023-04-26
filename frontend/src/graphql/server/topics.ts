import { gql } from '@apollo/client';

export const TOPICS = gql`
  query Topics(
    $sort: TopicsSortEnum!
    $page: Int
    $topPeriod: TopPeriodEnum
    $tag: String
    $categoryId: Int
    $username: String
  ) {
    topics(
      sort: $sort
      page: $page
      topPeriod: $topPeriod
      tag: $tag
      categoryId: $categoryId
      username: $username
    ) {
      users {
        id
        username
        name
        avatar: avatarTemplate
      }
      topicList {
        tags {
          id
          name
        }
        topics {
          id
          title
          imageUrl
          postsCount
          replyCount
          createdAt
          bumpedAt
          excerpt
          visible
          liked
          tags
          views
          likeCount
          categoryId
          posters {
            userId
            description
            user {
              id
              username
              name
              avatar: avatarTemplate
            }
          }
          authorUserId
          frequentPosterUserId
          pinned
        }
      }
    }
  }
`;

export const LOOKUP_URLS = gql`
  query LookupUrls($shortUrls: [String!]!) {
    lookupUrls(shortUrls: $shortUrls) {
      shortUrl
      url
    }
  }
`;
