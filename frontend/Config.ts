/**
 * This configuration file allows you to specify the configuration for developing against,
 * as well as building and releasing the Lexicon Mobile App.
 * Currently, there is only one important config value, which is `discourseUrl`.
 */

import * as Updates from 'expo-updates';

/**
 * Modify this `config` object to specify the configuration for the Lexicon Mobile App by scenario.
 */
const config: Config = {
  /*
   * `localDevelopment` is used in local development. It has one extra key, `inferDevelopmentHost`,
   * which you can read about in the documentation.
   * `localDevelopment` is also used as a fallback configuration if an unknown build channel is provided
   * to EAS Build.
   */
  localDevelopment: {
    discourseUrl: 'http://localhost:4200',
    inferDevelopmentHost: true, // Specific to local development with Expo Go & the Android simulator. See docs.
  },
  /**
   * `buildChannels` refers to channels within Expo's EAS Build service, which are defined in
   * `eas.json`. These can be named anything you'd like, but the conventional channel names are
   * `preview` and `production`.
   *
   * Make sure you specify the valid, reachable URL of your discourse server before running `eas build`
   * for a particular build channel.
   * By default, running `eas build` will attempt to use the values in `buildChannels.production`.
   *
   * If you create a new build profile / channel, be sure to add an entry for it here in `buildChannels`.
   */
  buildChannels: {
    preview: {
      discourseUrl: 'http://PLACEHOLDER.change.this.to.your.discourse.url',
    },
    production: {
      discourseUrl: 'http://PLACEHOLDER.change.this.to.your.discourse.url',
    },
    test: {
      discourseUrl: 'http://localhost:4200',
    },
  },
};

/** `getConfig` contains the minimal business logic for retrieving the config for a given channel,
 * and otherwise falling back to the `localDevelopment` config.
 */
function getConfig(): RequiredConfig | LocalConfig {
  if (!Updates.channel) {
    return config.localDevelopment;
  }

  const matchedConfig = config.buildChannels[Updates.channel];
  if (!matchedConfig) {
    return config.localDevelopment;
  }

  return matchedConfig;
}

/* Type definitions for the `config` object */
export type RequiredConfig = {
  discourseUrl: `${'http' | 'https'}://${string}`;
};
export type LocalConfig = RequiredConfig & {
  inferDevelopmentHost?: boolean;
};
type Config = {
  localDevelopment: LocalConfig;
  buildChannels: Record<string, RequiredConfig>;
};

export default getConfig();
