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
  ${POLL_FRAGMENT}
  mutation VotePoll(
    $postId: Int!
    $pollName: String!
    $options: [String!]!
    $voteBodyBuilder: BodyBuilder
  ) {
    votePoll(postId: $postId, pollName: $pollName, options: $options)
      @rest(
        type: "PollVoteOutput"
        path: "/polls/vote.json"
        method: "PUT"
        bodyBuilder: $voteBodyBuilder
      ) {
      poll @type(name: "Poll") {
        ...PollFragment
      }
      vote
    }
  }
`;

export const UNDO_VOTE_POLL = gql`
  ${POLL_FRAGMENT}
  mutation UndoVotePoll($postId: Int!, $pollName: String!) {
    undoVotePoll(postId: $postId, pollName: $pollName)
      @rest(
        type: "UndoPollVoteOutput"
        path: "/polls/vote.json?post_id={args.postId}&poll_name={args.pollName}"
        method: "DELETE"
      ) {
      poll @type(name: "Poll") {
        ...PollFragment
      }
    }
  }
`;

export const TOGGLE_POLL_STATUS = gql`
  ${POLL_FRAGMENT}
  mutation TogglePollStatus($input: TogglePollStatusInput!) {
    togglePollStatus(input: $input)
      @rest(
        type: "TogglePollStatusOutput"
        path: "/polls/toggle_status.json"
        method: "PUT"
        bodyKey: "input"
      ) {
      poll @type(name: "Poll") {
        ...PollFragment
      }
    }
  }
`;
