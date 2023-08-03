# Authentication

## Overview
Lexicon have few different cases of different state of authentication that need to be handled. This document will explain how to handle each case.

## Ingredients
### Session Token
We save session token in async storage. When booting our app, we will load the token from async storage to state. We also use token state to determine whether user is logged in or not. We currently implement this in `AuthProvider` component. The token are in the form of a apollo ReactiveVar because we need to update it in our apollo client and it be hard to update React state from apollo client.

### SiteSettings Query
SiteSettings query are utilized to determine whether a discourse instance is a private instance where we cannot register new user freely ora public instance where we can register new user freely. In case of public discourse this endpoint should be able to be accessed without authentication.

## Authentication flow

1. Load token from async storage to state (inside auth provider)
2. Hit SiteSettings endpoint, several result also depending on token availability would determine where we redirect our user to
3. Redirect user to a page based on combination of token availability and SiteSettings result

| Token | SiteSettings | Result |
| --- | --- | --- |
| No | Error | Redirect to login |
| No | Success | Redirect to Home|
| Yes | Error | Clean session |
| Yes | Success | Redirect to Home |




