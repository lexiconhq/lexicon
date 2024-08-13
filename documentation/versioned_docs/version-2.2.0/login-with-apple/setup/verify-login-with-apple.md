---
title: Verify Login With Apple
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Below, we'll walk you through how you can validate the functionality of logging in with Apple within your Lexicon-powered mobile app.

:::info
In order to be able test logging in with Apple, **you will need to use Lexicon version 2.2.0** for your Lexicon app.
:::

:::note
Ensure that the Bundle Identifier under iOS section in your `app.json` matches the one in your Discourse's plugin settings.
:::

## Steps

To test logging in with Apple within your Lexicon-powered mobile app, follow these steps:

1. Ensure that you have Lexicon-powered mobile app at your iOS device.
2. On your mobile device, open your Lexicon-powered mobile app.
3. On the login screen, you will see a "Sign in with Apple" button. Click the button and confirm your Apple account.
   - **Note**: Ensure that you have a registered account on Discourse using the same email as your Apple account.

<div style={{textAlign: 'center'}}>
  <img src={useBaseUrl('/img/screenshot/Mobile-LoginWithApple.png')} width="360" />
</div>

And that's it! You will be automatically logged in once your Apple account is confirmed.
