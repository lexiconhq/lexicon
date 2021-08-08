/**
 * In this file, we define two constants for the exit codes we're currently using with the server.
 * It is useful to the underlying system to receive an accurate exit code.
 *
 * For example, in the event of an error, it would not be correct to use process.exit(0),
 * as this would signify that the process exited successfully, when it did not.
 *
 * More info on exit codes from Node processes: https://nodejs.org/api/process.html#process_exit_codes
 * More info on exit codes in general: https://bash.cyberciti.biz/guide/The_exit_status_of_a_command
 */
export const EXIT_CODE_UNCAUGHT_FATAL_EXCEPTION = 1;
export const EXIT_CODE_INVALID_ARGUMENT = 9;
