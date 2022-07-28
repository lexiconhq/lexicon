import { Topic } from '../../types';

import createTopic, { TopicOptions } from './createTopic';

/**
 * Messages are—to a large extent—just Topics, especially for the
 * purpose of testing.
 */
export default function createMessage(options: TopicOptions = {}): Topic {
  return createTopic({ archetype: 'private_message', ...options });
}
