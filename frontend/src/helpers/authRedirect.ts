/** Discourse User API Key redirect: `{discourseHost}/auth_redirect?payload=...` */
export function getAuthRedirectUrl(discourseHost: string): string {
  const base = discourseHost.endsWith('/')
    ? discourseHost.slice(0, -1)
    : discourseHost;
  return `${base}/auth_redirect`;
}

export function isAuthRedirectUrl(url: string, authRedirect: string): boolean {
  const normalizedUrl = url.split('#')[0];
  const normalizedRedirect = authRedirect.split('#')[0];
  return (
    normalizedUrl.startsWith(normalizedRedirect) ||
    normalizedUrl.startsWith(`${normalizedRedirect}?`)
  );
}

export function extractAuthPayload(url: string): string | null {
  try {
    const parsed = new URL(url);
    const payload = parsed.searchParams.get('payload');
    return payload?.length ? payload : null;
  } catch {
    const match = url.match(/[?&]payload=([^&]+)/);
    return match?.[1] ?? null;
  }
}

/**
 * iPad WKWebView can emit auth_redirect navigations before the payload query
 * param is attached. Treat those as in-progress, not failures.
 */
export function isAuthRedirectAwaitingPayload(
  url: string,
  authRedirect: string,
): boolean {
  return (
    isAuthRedirectUrl(url, authRedirect) && extractAuthPayload(url) == null
  );
}
