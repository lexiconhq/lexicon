import { config } from 'dotenv';

config();

const ACCEPTED_LANGUAGE = 'en-US';
const CONTENT_FORM_URLENCODED = 'application/x-www-form-urlencoded';
const CONTENT_JSON = 'application/json';
const CUSTOM_HEADER_TOKEN = 'X-Prose-Latest-Token';

export {
  ACCEPTED_LANGUAGE,
  CONTENT_FORM_URLENCODED,
  CONTENT_JSON,
  CUSTOM_HEADER_TOKEN,
};
