import { gql } from '@apollo/client';

export const BASE_POST_DRAFT_FRAGMENT = gql`
  fragment BasePostDraftFragment on BasePostDraft {
    __typename
    content
    tags
    archetypeId
    action
  }
`;

export const CHECK_POST_DRAFT = gql`
  ${BASE_POST_DRAFT_FRAGMENT}
  query CheckPostDraft($draftKey: String!) {
    checkPostDraft(draftKey: $draftKey)
      @rest(
        type: "CheckPostDraftResult"
        path: "/drafts/{args.draftKey}.json"
      ) {
      draft {
        __typename
        ... on NewPostDraft {
          ...BasePostDraftFragment
          title
          categoryId
        }

        ... on PostReplyDraft {
          ...BasePostDraftFragment
          categoryId
          postId
        }

        ... on NewPrivateMessageDraft {
          ...BasePostDraftFragment
          recipients {
            recipientData {
              username
              name
              avatarTemplate
              id
            }
            recipient
          }
          title
        }
        ... on PrivateMessageReplyDraft {
          ...BasePostDraftFragment
        }
      }
      sequence
    }
  }
`;

export const CREATE_AND_UPDATE_POST_DRAFT_REST = gql`
  mutation CreateAndUpdatePostDraftRest(
    $createAndUpdatePostDraftInputRest: CreateAndUpdatePostDraftInputRest!
  ) {
    createAndUpdatePostDraftRest(
      createAndUpdatePostDraftInputRest: $createAndUpdatePostDraftInputRest
    )
      @rest(
        type: "CreateAndUpdatePostDraftResult"
        path: "/drafts.json"
        method: "POST"
        bodyKey: "createAndUpdatePostDraftInputRest"
      ) {
      draftSequence
      success
    }
  }
`;

export const CREATE_AND_UPDATE_POST_DRAFT = gql`
  mutation CreateAndUpdatePostDraft(
    $draftData: CreatePostDraftDataInput!
    $sequence: Int!
    $draftKey: String
  ) {
    createAndUpdatePostDraft(
      draftData: $draftData
      sequence: $sequence
      draftKey: $draftKey
    ) @client {
      success
      draftSequence
      draftKey
    }
  }
`;

export const DELETE_POST_DRAFT = gql`
  mutation DeletePostDraft(
    $draftKey: String!
    $sequence: Int!
    $deletePostDraftPath: PathBuilder
  ) {
    deletePostDraft(draftKey: $draftKey, sequence: $sequence)
      @rest(
        type: "DeletePostDraftOutput"
        method: "DELETE"
        path: ""
        pathBuilder: $deletePostDraftPath
      )
  }
`;

export const LIST_POST_DRAFT = gql`
  ${BASE_POST_DRAFT_FRAGMENT}
  query ListPostDrafts($page: Int!, $postDraftPath: PathBuilder) {
    listPostDrafts(page: $page)
      @rest(
        type: "ListPostDraftsResult"
        path: ""
        pathBuilder: $postDraftPath
      ) {
      draft {
        ... on NewPostDraft {
          ...BasePostDraftFragment
          title
          categoryId
        }

        ... on PostReplyDraft {
          ...BasePostDraftFragment
          categoryId
          postId
        }

        ... on NewPrivateMessageDraft {
          ...BasePostDraftFragment
          title
          recipients {
            recipientData {
              username
              name
              avatarTemplate
              id
            }
            recipient
          }
        }

        ... on PrivateMessageReplyDraft {
          ...BasePostDraftFragment
        }
      }
      archetype
      avatarTemplate
      excerpt
      createdAt
      draftKey
      sequence
      draftUsername
      username
      userId
      topicId
      title
    }
  }
`;
