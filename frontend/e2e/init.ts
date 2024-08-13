import { device } from 'detox';
import { config } from 'detox/internals';

import { MockServerContext, startMockServer } from './apollo-mock/server';

let mockServer: MockServerContext;
// Set the default timeout
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;
jest.setTimeout(DEFAULT_TIMEOUT_MS);

beforeAll(async () => {
  mockServer = await startMockServer();

  if (config.behavior.init?.reinstallApp === false) {
    await device.installApp();
  }

  return device.launchApp();
});

afterAll(() => {
  mockServer.stop();
});
