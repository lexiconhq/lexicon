import { EmailAddress, Notification, Post } from '../types';

const MOCK_IMG = 'https://dummyimage.com/600x400/000/fff';

const MOCK_CONTENT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ';

const MOCK_USERS = [
  {
    id: 1,
    username: 'JohnDoe',
    name: 'John Doe',
    avatar: MOCK_IMG,
  },
  {
    id: 2,
    username: 'Jeanne',
    name: 'Jeanne',
    avatar: MOCK_IMG,
  },
  {
    id: 3,
    username: 'JackandJill',
    name: 'Jack and Jill',
    avatar: MOCK_IMG,
  },
  {
    id: 4,
    username: 'russelthewolves',
    name: 'Russel Mark',
    avatar: MOCK_IMG,
  },
  {
    id: 5,
    username: 'rudy_1982',
    name: 'Rudy Martini',
    avatar: MOCK_IMG,
  },
  {
    id: 6,
    username: 'rufinannexx',
    name: 'Rufina Anne',
    avatar: MOCK_IMG,
  },
];

const MOCK_TAGS = ['video', 'ted', 'lexicon'];

const MOCK_CHANNELS = [
  {
    id: 0,
    color: '#285bd4',
    name: 'All Channels',
    description: `Showing all posts from all available channel on this site.`,
  },
  {
    id: 1,
    color: '#b99aff',
    name: 'Technology',
    description: `Topics about technology: computers, gadgets, phones, cameras, the Intertubes, or any other IT aspects of the world.`,
  },
  {
    id: 2,
    color: '#bc544b',
    name: 'Education',
    description: `Channel about school, learning, and general education. How can you get your pudding if you don't eat any meat?`,
  },
  {
    id: 3,
    color: '#fc46aa',
    name: 'Pets',
    description: `Channel about our furry, scaly, feathery and/or slimy animal friends. That'll do, LOLCat. That'll do.`,
  },
  {
    id: 4,
    color: '#00e600',
    name: 'Movies',
    description: `Channel about movies and televisions, including reviews, news, commentary and other discussion.`,
  },
];

const MOCK_POSTS: Array<Post> = [
  {
    id: 0,
    topicId: 0,
    title: 'Example',
    content: MOCK_CONTENT,
    hidden: false,
    username: MOCK_USERS[0].username,
    avatar: MOCK_IMG,
    replyCount: 3010,
    likeCount: 300,
    viewCount: 299,
    isLiked: false,
    channel: MOCK_CHANNELS[1],
    tags: MOCK_TAGS,
    createdAt: '2020-08-19T17:15:15.634Z',
    freqPosters: MOCK_USERS,
  },
  {
    id: 1,
    topicId: 1,
    title: 'Example1',
    content: MOCK_CONTENT,
    hidden: false,
    username: MOCK_USERS[0].username,
    avatar: MOCK_IMG,
    replyCount: 3,
    likeCount: 3,
    viewCount: 2,
    isLiked: true,
    channel: MOCK_CHANNELS[0],
    tags: [MOCK_TAGS[0]],
    createdAt: '2020-08-20T17:15:15.634Z',
    freqPosters: [MOCK_USERS[0]],
  },
  {
    id: 2,
    topicId: 2,
    title: 'Example2',
    content: MOCK_CONTENT,
    hidden: false,
    username: MOCK_USERS[1].username,
    avatar: MOCK_IMG,
    replyCount: 3,
    likeCount: 3,
    viewCount: 2,
    isLiked: false,
    channel: MOCK_CHANNELS[2],
    tags: MOCK_TAGS,
    createdAt: '2020-08-20T17:15:15.634Z',
    freqPosters: MOCK_USERS,
  },
  {
    id: 3,
    topicId: 3,
    title: 'KodeFox',
    content: MOCK_CONTENT,
    hidden: false,
    username: MOCK_USERS[1].username,
    avatar: MOCK_IMG,
    replyCount: 3,
    likeCount: 3,
    viewCount: 2,
    isLiked: true,
    channel: MOCK_CHANNELS[3],
    tags: [MOCK_TAGS[0]],
    createdAt: '2020-08-20T17:15:15.634Z',
    freqPosters: [MOCK_USERS[0]],
  },
];

const MOCK_NOTIFICATIONS: Array<Notification> = [
  {
    id: 1,
    name: 'Natasha Williams',
    message: 'Hello, Internet Citizen!',
    createdAt: '2020-09-11T01:15:15.634Z',
    hasIcon: true,
    seen: false,
    notificationType: 1,
    onPress: () => {},
  },
  {
    id: 2,
    name: 'Jacobs Anderson',
    message: 'Like your post on Best Game 2020',
    createdAt: '2020-09-11T01:15:15.634Z',
    hasIcon: false,
    seen: false,
    notificationType: 2,
    onPress: () => {},
  },
  {
    id: 3,
    name: 'Jacobs Anderson',
    message: 'Reply to your post on Best Game 2020',
    createdAt: '2020-09-11T01:15:15.634Z',
    hasIcon: false,
    seen: true,
    notificationType: 3,
    onPress: () => {},
  },
  {
    id: 4,
    name: 'Michael Andrews',
    message: 'Best Game 2020',
    createdAt: '2020-09-11T01:15:15.634Z',
    hasIcon: true,
    seen: true,
    notificationType: 1,
    onPress: () => {},
  },
];

const MOCK_EMAIL_ADDRESS: Array<EmailAddress> = [
  {
    emailAddress: 'aaronanderson@gmail.com',
    type: 'PRIMARY',
  },
  {
    emailAddress: 'aaron2@gmail.com',
    type: 'SECONDARY',
  },
];

const MOCK_MESSAGES = [
  {
    participant: [1, 2, 3],
    message: 'Hello, Internet Citizen!',
    date: '2020-09-16T23:00:00-04:00',
    markRead: false,
  },
  {
    participant: [2],
    message: 'Greetings!',
    date: '2020-09-17T02:00:00-04:00',
    markRead: false,
  },
  {
    participant: [3],
    message: 'No Man Sky Review',
    date: '2020-09-17T05:00:00-04:00',
    markRead: true,
  },
];

export default {
  posts: MOCK_POSTS,
  channels: MOCK_CHANNELS,
  image: MOCK_IMG,
  content: MOCK_CONTENT,
  users: MOCK_USERS,
  tags: MOCK_TAGS,
  notifications: MOCK_NOTIFICATIONS,
  emailAddress: MOCK_EMAIL_ADDRESS,
  messages: MOCK_MESSAGES,
};
