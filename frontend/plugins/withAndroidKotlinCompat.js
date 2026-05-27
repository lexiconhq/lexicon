const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * @config-plugins/detox injects a buildscript classpath that references
 * $kotlinVersion before buildscript.ext is populated (Expo SDK 54+).
 * The versioned classpath is redundant with Expo's kotlin-gradle-plugin entry.
 *
 * Must be listed first in app.json plugins so this mod runs after Detox
 * (Expo applies projectBuildGradle mods in reverse registration order).
 */
const DETOX_KOTLIN_CLASSPATH =
  'classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"';

function withAndroidKotlinCompat(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      return config;
    }

    let { contents } = config.modResults;
    if (contents.includes(DETOX_KOTLIN_CLASSPATH)) {
      contents = contents.replace(
        /\s*classpath "org\.jetbrains\.kotlin:kotlin-gradle-plugin:\$kotlinVersion"\n/g,
        '\n'
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAndroidKotlinCompat;
