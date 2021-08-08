import mock from '../../__mocks__/mockData';
import { defaultUser, getParticipants } from '../relatedUsers';

let users = mock.users;
let ids = mock.users.map(({ id }) => id);
let myUser = mock.users[0];
let lastPoster = mock.users[2];

it('should return 1 participant', () => {
  let { participants, participantsToShow } = getParticipants(
    ids.slice(1, 2),
    users,
    myUser.username,
    myUser.username,
  );

  expect(participants.length).toBe(1);
  expect(participants[0].id).toBe(users[1].id);
  expect(participantsToShow).toEqual(participants);
});

it('should return the other 2 participants', () => {
  let { participants, participantsToShow } = getParticipants(
    ids.slice(1, 3),
    users,
    myUser.username,
    myUser.username,
  );

  expect(participants.length).toBe(2);
  expect(participants[0].id).toBe(users[1].id);
  expect(participants[1].id).toBe(users[2].id);
  expect(participantsToShow).toEqual(participants);
});

it('should return 2 participants with different order', () => {
  let { participants, participantsToShow } = getParticipants(
    ids.slice(1, 3),
    users,
    myUser.username,
    lastPoster.username,
  );

  expect(participants.length).toBe(2);
  expect(participantsToShow[0]).toEqual(lastPoster);
  expect(participantsToShow[1]).toEqual(participants[0]);
});

it('should return 3 participants', () => {
  let { participants, participantsToShow } = getParticipants(
    ids.slice(1, 4),
    users,
    myUser.username,
    myUser.username,
  );

  expect(participants.length).toBe(3);
  expect(participants).toEqual(expect.arrayContaining(participantsToShow));
  expect(participantsToShow.length).toBe(2);
  expect(participantsToShow[0]).toEqual(participants[0]);
  expect(participantsToShow[1]).toEqual(participants[1]);
});

it('should return 3 participants with different order', () => {
  let { participants, participantsToShow } = getParticipants(
    ids.slice(1, 4),
    users,
    myUser.username,
    lastPoster.username,
  );

  expect(participants.length).toBe(3);
  expect(participantsToShow.length).toBe(2);
  expect(participants).toEqual(expect.arrayContaining(participantsToShow));
  expect(participantsToShow[0]).toEqual(lastPoster);
  expect(participantsToShow[1]).toEqual(participants[0]);
});

it('should return 3 participants with different order', () => {
  lastPoster = mock.users[1];
  let { participants, participantsToShow } = getParticipants(
    ids.slice(1, 4),
    users,
    myUser.username,
    lastPoster.username,
  );

  expect(participants[0]).toEqual(lastPoster);
  expect(participantsToShow[0]).toEqual(lastPoster);
  expect(participantsToShow[1]).toEqual(participants[1]);
});

it('should return real user and default users', () => {
  let { participants } = getParticipants(
    [100, -20, ids[1]],
    users,
    myUser.username,
    'Nat',
  );

  expect(participants.length).toBe(3);
  expect(participants[0]).toEqual(users[1]);
  expect(participants[1]).toEqual(defaultUser);
  expect(participants[2]).toEqual(defaultUser);
});

it(`should return a default user when there's no participant`, () => {
  let { participants, participantsToShow } = getParticipants(
    [],
    users,
    myUser.username,
    myUser.username,
  );

  expect(participants.length).toBe(1);
  expect(participantsToShow[0].username).toEqual(defaultUser.username);
});
