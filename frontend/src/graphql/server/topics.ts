import { gql } from '@apollo/client';

export const TOPICS = gql`
  query Topics(
    $sort: TopicsSortEnum!
    $page: Int
    $topPeriod: TopPeriodEnum
    $tag: String
    $categoryId: Int
  ) {
    topics(
      sort: $sort
      page: $page
      topPeriod: $topPeriod
      tag: $tag
      categoryId: $categoryId
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

export const REPLY_TOPIC = gql`
  mutation ReplyTopic($raw: String!, $topicId: Int!, $replyToPostNumber: Int) {
    reply(
      replyInput: {
        raw: $raw
        topicId: $topicId
        replyToPostNumber: $replyToPostNumber
      }
    ) {
      commentId: id
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
