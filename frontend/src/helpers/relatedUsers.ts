import { MessageParticipants, User } from '../types';

export let defaultUser: User = {
  id: -404, // in try.discourse, the bot will have negative value id.
  username: 'User',
  avatar: '',
};

// Will return a group of users to display in Message Scene.
export function getParticipants(
  ids: Array<number>,
  users: Array<User>,
  myUsername: string,
  lastPosterUsername: string,
): MessageParticipants {
  // Get users based on given ids.
  let participants = users.filter(({ id }) => ids.includes(id));
  let participantsToShow: Array<User>;

  // if the id is not found or no participant is provided, then it will add default user to participants
  while (ids.length > participants.length || participants.length <= 0) {
    participants.push(defaultUser);
  }

  // if there are more than 1 poster (other than current user)
  // it will decide which 2 users to display.
  // because the app will only display 2 avatars and a username in this situation.
  if (participants.length > 1) {
    // the default will return the first and second participants to display.
    participantsToShow = participants.slice(0, 2);

    // If the last poster is not the current user and his/her username is found,
    // then it will return the last poster and another poster.
    if (lastPosterUsername !== myUsername) {
      let lastPosterIdx = participants.findIndex(
        ({ username }) => username === lastPosterUsername,
      );

      if (lastPosterIdx !== -1) {
        participantsToShow = [participants[lastPosterIdx]];
        participantsToShow.push(participants[lastPosterIdx === 0 ? 1 : 0]);
      }
    }
  } else {
    // if there's only 1 poster, then that's also the only poster to display
    participantsToShow = participants;
  }

  return { participants, participantsToShow };
}
