import { http, HttpResponse } from 'msw';

import {
  ChangeUsernameInput,
  EditProfileInput,
} from '../../../src/generatedAPI/server';
import { mockUsers } from '../data';
import { KeysToSnakeCase } from '../utils';

type UsernameParams = {
  username: string;
};

export const profileHandler = [
  http.get('/users/:username', (req) => {
    const { username } = req.params;
    if (!username) {
      return HttpResponse.json({ user: null });
    }

    return HttpResponse.json({
      user: {
        avatarTemplate: mockUsers[0].avatarTemplate,
        username: mockUsers[0].username,
        name: mockUsers[0].name,
        websiteName: null,
        bioRaw: null,
        location: null,
        dateOfBirth: null,
        email: 'johndoe@test.com',
        secondaryEmails: [],
        unconfirmedEmails: [],
        canEditUsername: true,
        admin: true,
        status: mockUsers[0].status,
      },
    });
  }),

  /**
   * Change Username REST API
   *
   * The input request body should use `snake_case`.
   */

  http.put<UsernameParams, KeysToSnakeCase<ChangeUsernameInput>>(
    '/u/:username/preferences/username.json',
    async (req) => {
      const { username } = req.params;
      const { new_username } = await req.request.json();
      if (!username || !new_username) {
        return HttpResponse.json({ username: null });
      }

      mockUsers[0].username = new_username;

      return HttpResponse.json({
        username: new_username,
      });
    },
  ),

  // edit profile data
  http.put<UsernameParams, EditProfileInput>(
    '/users/:username.json',
    async (req) => {
      const { username } = req.params;
      if (!username) {
        return HttpResponse.json({ user: null });
      }

      return HttpResponse.json({
        user: {
          id: mockUsers[0].id,
          avatarTemplate: mockUsers[0].avatarTemplate,
          username: mockUsers[0].username,
          name: mockUsers[0].name,
          websiteName: null,
          bioRaw: null,
          location: null,
          dateOfBirth: null,
        },
      });
    },
  ),
];
