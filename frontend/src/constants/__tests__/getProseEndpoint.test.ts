import { getProseEndpoint } from '../app';

it('should error when no URL is set', () => {
  expect(() => {
    getProseEndpoint();
  }).toThrow('proseUrl must be set.');
});

it('should error when the value does not start with http or https', () => {
  let proseUrl = 'htp://127.0.0.1:8080/test';

  expect(() => {
    getProseEndpoint(proseUrl);
  }).toThrow('proseUrl must start with http:// or https://');
});

it('should be valid when no port or subpath is provided', () => {
  let proseUrl = 'http://127.0.0.1';

  expect(getProseEndpoint(proseUrl)).toEqual('http://127.0.0.1');
});

it('should be valid when a port number is included', () => {
  let proseUrl = 'http://127.0.0.1:8080';

  expect(getProseEndpoint(proseUrl)).toEqual('http://127.0.0.1:8080');
});

it('should be valid when a subpath is included', () => {
  let proseUrl = 'http://127.0.0.1/test';

  expect(getProseEndpoint(proseUrl)).toEqual('http://127.0.0.1/test');
});

it('should be valid when both a port number and subpath are included', () => {
  let proseUrl = 'http://127.0.0.1:8080/test';

  expect(getProseEndpoint(proseUrl)).toEqual('http://127.0.0.1:8080/test');
});
