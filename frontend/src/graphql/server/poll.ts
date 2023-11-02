import { gql } from '@apollo/client';

export const POLL_FRAGMENT = gql`
  fragment PollFragment on Poll {
    name
    type
    status
    results
    options {
      id
      html
      votes
    }
    voters
    chartType
    title
    groups
    public
    min
    max
    step
    close
    preloadedVoters {
      pollOptionId
      users {
        id
        username
        name
        avatarTemplate
        title
      }
    }
  }
`;

export const VOTE_POLL = gql`
  mutation VotePoll($postId: Int!, $pollName: String!, $options: [String!]!) {
    votePoll(postId: $postId, pollName: $pollName, options: $options) {
      poll {
        ...PollFragment
      }
      vote
    }
  }
`;

export const UNDO_VOTE_POLL = gql`
  mutation UndoVotePoll($postId: Int!, $pollName: String!) {
    undoVotePoll(postId: $postId, pollName: $pollName) {
      ...PollFragment
    }
  }
`;

export const TOGGLE_POLL_STATUS = gql`
  mutation TogglePollStatus(
    $postId: Int!
    $pollName: String!
    $status: PollStatus!
  ) {
    togglePollStatus(postId: $postId, pollName: $pollName, status: $status) {
      ...PollFragment
    }
  }
`;
