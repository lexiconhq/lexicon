import { Boolean, Literal, Number, Record, String } from 'runtypes';

import { ChannelList } from '../types';

import { createCachedStorage } from './createCachedStorage';

let ColorScheme = Literal('light')
  .Or(Literal('dark'))
  .Or(Literal('no-preference'));

let Aesthetic = Literal('ios').Or(Literal('android'));

export let User = Record({
  id: Number,
  name: String,
  username: String,
  avatar: String,
});

export let PushNotificationsPreferences = Record({
  shouldShowAlert: Boolean,
  shouldPlaySound: Boolean,
  shouldSetBadge: Boolean,
});

export let SelectedHomeChannelId = Number;

let [StorageProvider, useStorage] = createCachedStorage(
  {
    colorScheme: (value) => ColorScheme.check(value),
    aesthetic: (value) => Aesthetic.check(value),
    user: (value) => User.check(value),
    expoPushToken: (value) => String.check(value),
    channels: (value) => ChannelList.check(value),
    pushNotifications: (value) => PushNotificationsPreferences.check(value),
    homeChannelId: (value) => SelectedHomeChannelId.check(value),
  },
  '@Cached/',
);

export { StorageProvider, useStorage };
