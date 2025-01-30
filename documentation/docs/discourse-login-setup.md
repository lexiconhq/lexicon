---
title: Discourse Login Setup
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## New Changes

Starting with Lexicon version 3.0.0, additional setup is required to enable login and registration through the Lexicon mobile app. All login and authentication processes are now managed via the Discourse web view.

This update transitions the mobile app's authorization from a cookie-based implementation to the **User API Key** system provided by Discourse. This change enhances the security of the Lexicon mobile app and ensures it interacts with Discourse APIs using API keys instead of cookies, following Discourse's recommendations.

For more detailed information about **User API Keys**, refer to the [official Discourse documentation on User API Keys](https://meta.discourse.org/t/user-api-keys-specification/48536).

## Require Discourse Setup

To enable login on the Lexicon mobile app, the following configurations are necessary:

1. Max limit request **User Api Keys**
2. `auth_redirect` url to redirect back to with the generated token

### Increasing **User API Keys** Request Limits

Discourse imposes rate limits on **User API Keys** requests per minute and per day. Exceeding these limits will result in an error:

`You’ve performed this action too many times. Please wait 1 minute before trying again.`.

The default value for max limit User Api Keys request is

```
max_user_api_reqs_per_minute = 20
max_user_api_reqs_per_day = 2880
```

Discourse allow to change max limit request. There are two way change this value based on development or production.

#### Development

To adjust the request limit for **User API Keys** on your local Discourse instance, modify the `discourse/config/discourse_defaults.conf` file. Locate the following section:

```plaintext
### rate limits apply to all sites
max_user_api_reqs_per_minute = 20
max_user_api_reqs_per_day = 2880
```

Update the values based on the limits you want to set:

```plaintext
### rate limits apply to all sites
max_user_api_reqs_per_minute = 2000
max_user_api_reqs_per_day = 288000
```

This will increase the request limits accordingly.

#### Production

To modify the maximum request limits for **User API Keys** on your Discourse server, you need to update the `app.yml` file located in the `var/discourse/containers` directory.

Follow these steps:

1. **Connect to your Discourse server**  
   Log in to your server via SSH:

   ```bash
   ssh root@<ip_address>
   ```

2. **Navigate to the containers directory**  
   Change to the directory where the configuration file is located:

   ```bash
   cd /var/discourse/containers
   ```

3. **Edit the `app.yml` file**  
   Open the file using a text editor:

   ```bash
   nano app.yml
   ```

4. **Update the environment variables**  
   Under the `env` section of the file, add or modify the following values to set the desired request limits:

   ```yml
   DISCOURSE_MAX_USER_API_REQS_PER_MINUTE: 200
   DISCOURSE_MAX_USER_API_REQS_PER_DAY: 28800
   ```

5. **Rebuild the Discourse container**  
   After saving the changes, rebuild the container to apply the updates:
   ```bash
   cd ..
   ./launcher rebuild app
   ```

### Auth Redirect Token

The `auth_redirect` parameter is required when generating links for **User API Keys**, as explained in the [Discourse Official Documentation on User API Keys](https://meta.discourse.org/t/user-api-keys-specification/48536#p-215345-api-key-generation-flow-7).

Discourse uses the `auth_redirect` URL to redirect users after they authorize their account. The URL will return the User API Key payload, for example: `{discourse_url}/auth_redirect?payload={Api_key}`. This payload is used to authorize the user when using the Lexicon mobile app.

Here’s how to set up your own `auth_redirect`:

1. **Access your Discourse Admin Dashboard**  
   As an admin user, log in to your Discourse admin panel.

2. **Navigate to the Settings Tab**  
   In the admin dashboard, go to the **Settings** tab.

3. **Search for "Allowed User API Auth Redirects"**  
   Use the search function to find `Allowed user API auth redirects`.

   <img loading="eager" alt="Auth Redirect Admin Settings" src={useBaseUrl('/img/screenshot/user-api-keys/Discourse-Settings-Auth-Redirect.png')}/>

4. **Add the URL**  
   Add the new URL based on the **`authRedirect`** constant defined in the file `frontend/src/screens/AuthenticationWebView.tsx`. By default, the base URL used is `discourseHost` from `frontend/Config.ts`, and the **path** is `/auth_redirect`. You can customize this path as needed.

   Ensure that the URL registered in Discourse under **Allowed User API auth redirects** matches the `authRedirect` URL.

   <img loading="eager" alt="Edit Auth Redirects Admin Settings" src={useBaseUrl('/img/screenshot/user-api-keys/Discourse-Settings-New-Auth-Redirect.png')}/>

5. **Test the Login**  
   After adding the URL, try logging in using the Lexicon mobile app.

## New Login Flow for Lexicon Mobile App

The new login process in the Lexicon mobile app is handled through a Discourse login web view. When a user attempts to log in, the app will open a web view that directs the user to a new URL, generating a **User API Key**. After entering their username and password and clicking "Authorize," the user will receive a new **User API Key** that grants access to all features of the Lexicon mobile app.

Follow these steps to complete the new login flow in the Lexicon mobile app:

1. **Open the Lexicon Mobile App**  
   Upon opening the app, the first page displayed will be the `Welcome` page.

  <div className="image-container-center">
      <img loading="eager" alt="Mobile Welcome" src={useBaseUrl('/img/screenshot/user-api-keys/Mobile-Welcome-Page.png')} className="image-container-resize"/>
   </div>

2. **Click the "Get Started" Button**  
   Tap the `Get Started` button to initiate the Discourse login web view.

  <div className="image-container-center">
      <img loading="eager" alt="Mobile Discourse Login" src={useBaseUrl('/img/screenshot/user-api-keys/Mobile-Discourse-Login.png')} className="image-container-resize"/>
   </div>

3. **Enter Your Credentials**  
   On the Discourse login page, enter your username and password, then click the `Log In` button.

4. **Authorize Your Account**  
   After a successful login, you'll be redirected to a page asking you to `authorize` your account to access the app.

  <div className="image-container-center">
      <img loading="eager" alt="Mobile Authorize Account" src={useBaseUrl('/img/screenshot/user-api-keys/Mobile-Authorize.png')} className="image-container-resize"/>
   </div>

5. **Click "Authorize"**  
   Tap the `Authorize` button to generate your new **User API Key**. Afterward, you will be redirected to the `Home` page of the Lexicon mobile app, where you can begin using all available features.

## Checking and Revoking Your **User API Key**

You can check if the **User API Key** was successfully created and revoke it if needed. To do this, you’ll need to access your Discourse Profile Settings.

Follow these steps to view and manage your **User API Key**:

1. **Log in to Your Discourse Account**  
   Go to the Discourse website and log in to your account.

2. **Access Profile Settings**  
   Open the `Profile -> Preferences -> Security` tab.

  <div className="image-container-center">
      <img loading="eager" alt="Profile Security Page" src={useBaseUrl('/img/screenshot/user-api-keys/Discourse-Profile-Security-Settings.png')} className="image-container-resize"/>
   </div>

3. **Scroll to the "App" Section**  
   Scroll down to the bottom of the page until you see the `App` section. Here, you will see a list of all **User API Keys** generated for your account. You can revoke any of these keys, which will automatically log you out of the Lexicon mobile app.

  <div className="image-container-center">
       <img loading="eager" alt="Profile App Page" src={useBaseUrl('/img/screenshot/user-api-keys/Discourse-App-Settings.png')} className="image-container-resize"/>
   </div>

:::note  
The implementation of **User API Keys** in the Lexicon mobile app is based on the Discourse mobile app. You can review the relevant code in this [GitHub file](https://github.com/discourse/DiscourseMobile/blob/2e0b8a4d9d98d144b7a654d26cc3202bbce31793/js/site_manager.js#L423).  
:::
