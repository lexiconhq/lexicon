---
title: 'Optimal Experience'
---

If you're planning to make use of the Lexicon Mobile App, there are a few adjustments you should make to your Discourse instance to provide the best in-app experience to your users.

## Install the Lexicon Discourse Plugin

The Lexicon Discourse plugin enhances the native mobile experience for your users in two key ways:

- Adds support for push notifications
- Adds support for email deep linking.

You can read more about the plugin and how to set it up [here](./discourse-plugin.md).

## Enable Topic Excerpts

We have designed the Mobile App so that users can easily see the first few sentences of a topic as they scroll through the topics list.

However, by default, Discourse does not return excerpts when listing topics.

Fortunately, there is a secret setting that enables this.

It just takes a bit of additional configuration to enable.

While Discourse does enable opting into this behavior as part of a [Theme Component](https://meta.discourse.org/t/topic-list-excerpts-theme-component/151520), we wanted to guide you through the option of toggling the setting itself.

Should you prefer to enable it using the above theme component, you're free to do so.

Enabling this setting involves gaining access to the server and changing a setting.

### Instructions

The original instructions can be found [here](https://meta.discourse.org/t/discourse-as-a-simple-personal-blog-engine/138244/4).

Once you've gained access to your server, enter into the running Discourse app.

```sh
$ /var/discourse/launcher enter app
```

Next, enter the Rails CLI:

```sh
$ rails c
```

Finally, set the setting to true:

```sh
$ SiteSetting.always_include_topic_excerpts = true
```

After that, you can exit, and excerpts should now be displaying in the app.

## Enable Topic Tagging

The Lexicon Mobile App was designed with the ability to tag topics in mind.

This allows users to view and manage tags on topics, which is a popular feature on many Discourse servers.

Unfortunately, this is not enabled by default.

### Instructions

In order to enable it, you can take the following steps:

- Navigate to the Admin Site Settings page at `/admin/site_settings`
- Use the search bar to search for the setting `tagging enabled`
- Ensure that it is checked
- If you made a change, click the green checkbox button to apply it

Topics should now be taggable, and viewable in the app.

## Configure Upload Extensions

Discourse provides a security feature that allows Discourse admins to specify a whitelist of file extensions that their users can upload.
For example, most admins would choose to restrict uploading of `.exe` files.
In order to be compatible with the settings of your Discourse instance, the Lexicon Mobile App simply requests the list of allowed extensions and uses it to enforce allowed extensions in the app.
Out of the box, most Discourse instances support this default list of extensions:

- `.jpg`
- `.jpeg`
- `.png`
- `.gif`
- `.heic`
- `.heif`

If you'd like to adjust the list of extensions in your Discourse instance, you can do so by following the instructions below.

### Adjusting Allowed Extensions in Discourse

- Navigate to the Admin Site Settings page at `/admin/site_settings`
- Use the search bar to search for the setting `extensions`
- Find the setting labeled `authorized extensions`.
- Adjust the list as you see fit to include the file extensions you'd like your users to be able to upload.
- When you are done making changes, click the green checkbox to apply them.
- The Lexicon Mobile App will receive the updated list of extensions from your site settings and begin enforcing it for your users.
