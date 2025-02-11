import { Platform } from 'react-native';

import { getDiscourseEndpoint } from '../app';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios', // Default value
  },
}));
it('should error when no URL is set', () => {
  expect(() => {
    getDiscourseEndpoint();
  }).toThrow('discourseUrl must be set.');
});

it('should error when the value does not start with http or https', () => {
  let discourseUrl = 'htp://127.0.0.1:8080';

  expect(() => {
    getDiscourseEndpoint(discourseUrl);
  }).toThrow('discourseUrl must start with http:// or https://');
});

it('should be valid when no port or subpath is provided', () => {
  let discourseUrl = 'http://127.0.0.1';

  expect(getDiscourseEndpoint(discourseUrl)).toEqual('http://127.0.0.1');
});

it('should be valid when a port number is included', () => {
  let discourseUrl = 'http://127.0.0.1:8080';

  expect(getDiscourseEndpoint(discourseUrl)).toEqual('http://127.0.0.1:8080');
});

it('should be valid when a subpath is included', () => {
  let discourseUrl = 'http://127.0.0.1/test';

  expect(getDiscourseEndpoint(discourseUrl)).toEqual('http://127.0.0.1/test');
});

it('should be valid when both a port number and subpath are included', () => {
  let discourseUrl = 'http://127.0.0.1:8080/test';

  expect(getDiscourseEndpoint(discourseUrl)).toEqual(
    'http://127.0.0.1:8080/test',
  );
});

it('should return Android development endpoint with port when inferDevelopmentHost is true', () => {
  Platform.OS = 'android'; // Simulate Android environment
  const discourseUrl = 'http://127.0.0.1:8080';

  expect(getDiscourseEndpoint(discourseUrl, true)).toEqual(
    'http://10.0.2.2:8080',
  );
});
