import { EXIT_CODE_UNCAUGHT_FATAL_EXCEPTION } from './constants';
import { run } from './server';

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('\n\n', error.message, '\n');
  process.exit(EXIT_CODE_UNCAUGHT_FATAL_EXCEPTION);
});
