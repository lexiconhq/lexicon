---
title: Enabling login with Apple
---

import useBaseUrl from '@docusaurus/useBaseUrl';

This guide will walk you through the necessary steps to activate login with Apple at lexicon app on your Discourse site.

## Steps

1. Access your Discourse admin dashboard.

2. Navigate to the `Plugins` section.

<img src={useBaseUrl('/img/screenshot/plugins/Discourse-Plugin-Settings.png')} />

3. Locate the `discourse-lexicon-plugin` and click on the `Settings` button.

4. Fill in the `lexicon apple client id` setting with your app bundle ID. The app bundle ID is required to enable login with Apple. If you haven't register an app bundle ID, you can follow the instructions in this [tutorial](../../app-store#register-a-new-bundle-id) to do so.

<div style={{textAlign: 'center'}}>
   <img width="700" src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-Login-With-Apple-App-ID.png')} />
</div>

5. Check the `lexicon apple login enabled` box in the Lexicon settings section and save your changes.

<img src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-Login-With-Apple.png')} />

Once the login with Apple feature is enabled, you will be able to utilize its functionality in your Discourse instance.
