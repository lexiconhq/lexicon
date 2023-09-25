const mobileDevices = ['Android', 'Mobile', 'iPad', 'iPhone', 'iPod'];

/**
 * Returns a string for the `User Agent` header.
 * Discourse uses the `User Agent` header to log recently used
 * devices in the Discourse web app. The `User Agent` header
 * contains information about the browser, the OS, and the device.
 * We set the browser default fallback to `DiscourseHub`, because
 * it isn't provided when a request is received from the mobile app.
 * `DiscourseHub` is chosen because it is what Discourse's mobile app
 * uses, and it is the closest `User Agent` string supported by Discourse.
 *
 * @param originalUserAgent - The original `User Agent` value from the request header
 * @returns Modified `User Agent`
 */

export function getModifiedUserAgent(originalUserAgent?: string) {
  if (!originalUserAgent) {
    return '';
  }

  let isMobile = mobileDevices.some((device) =>
    originalUserAgent?.includes(device),
  );
  return `${originalUserAgent} ${isMobile ? 'DiscourseHub' : ''}`;
}
