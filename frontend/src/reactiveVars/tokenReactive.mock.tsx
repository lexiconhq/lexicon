import { makeVar } from '@apollo/client';

/**
 * We use reactive variable for token state instead of useState because we need to be able to update token state from apollo link
 * Token state is undefined when we are still loading token from storage and null when we are not logged in.
 */
const tokenVar = makeVar<string | null | undefined>('123456789');

/**
 * Logout token hold the last token we have before user logged out
 * We need this to be able to logout user even when token state is already null
 */
const logoutTokenVar = makeVar<string | null | undefined>('123456789');

/**
 * Update token state when successfully logged in
 */
const setTokenState = (token: string | null) => {
  tokenVar(token);
  if (token) {
    logoutTokenVar(token);
  }
};

export { tokenVar, logoutTokenVar, setTokenState };
