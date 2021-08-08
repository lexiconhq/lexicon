/* eslint-disable no-console */
import axios, { AxiosResponse } from 'axios';

import {
  PROSE_DISCOURSE_HOST,
  SHOULD_VALIDATE_DISCOURSE,
  EXIT_CODE_INVALID_ARGUMENT,
} from '../constants';

export async function checkDiscourseReachability() {
  if (!SHOULD_VALIDATE_DISCOURSE) {
    return;
  }

  console.log(
    `\nAttempting to reach your Discourse instance at ${PROSE_DISCOURSE_HOST}...`,
  );

  let response: AxiosResponse;
  try {
    response = await axios.get(PROSE_DISCOURSE_HOST);
  } catch (error) {
    console.error(`\n\nERROR: ${PROSE_DISCOURSE_HOST}`);

    console.error('Your provided Discourse Host was not reachable.');
    console.error(
      '\n',
      'Double-check that the URL is correct and is reachable from this host.',
      '\n\n',
    );

    process.exit(EXIT_CODE_INVALID_ARGUMENT);
  }

  if (response.status >= 400) {
    console.error(`\n\nERROR: ${PROSE_DISCOURSE_HOST}`);
    console.error(
      'Your provided Discourse Host returned an error when we attempted to reach it.',
    );
    console.error(
      '\n',
      'Double-check that the URL is correct and is reachable from this host.',
      '\n\n',
    );
    process.exit(EXIT_CODE_INVALID_ARGUMENT);
  }

  const hasDiscourseHeader = Object.keys(response.headers).find((key) =>
    key.startsWith('x-discourse'),
  );
  if (!hasDiscourseHeader) {
    console.error(`\nWARNING: ${PROSE_DISCOURSE_HOST}`);
    console.warn(
      'Your provided Discourse Host was reachable, but we were not able to verify that it is a valid Discourse server.',
    );
    console.warn(
      '\nIf you are positive this is not an issue, you can ignore this message.',
      '\n\n',
    );
  } else {
    console.log('Your Discourse instance was reachable and valid.\n');
  }
}
