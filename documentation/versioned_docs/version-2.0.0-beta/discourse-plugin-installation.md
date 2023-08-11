---
title: Plugin Installation
slug: discourse-plugin/setup
---

Before you can start using the Lexicon Discourse Plugin, there are a few prerequisites and installation steps you need to follow. This documentation will guide you through the process, ensuring a smooth setup of the plugin on your site.

## Prerequisites

Before using this plugin, make sure you have set up your own Discourse server where you can configure the admin settings.

You will also need the ability to install plugins, which means directly modifying `/var/discourse/containers/app.yml` to include the Lexicon Discourse plugin, and then rebuilding your site.

## Plugin Installation Steps for Discourse Server

This documentation provides step-by-step instructions for installing the Lexicon Discourse Plugin on your production Discourse server for development purposes.

### Installation Steps

1. Copy the Git URL for the Lexicon Discourse plugin.

```
https://github.com/kodefox/discourse-expo-pn-plugin.git
```

2. Access your container's `app.yml` file.

Feel free to use your terminal editor of choice (vim, emacs, nano, etc.).

```
cd /var/discourse
vim containers/app.yml
```

3. Add the plugin’s repository URL to your container’s `app.yml` file:

Add the plugin’s Git clone url to the section below.

```
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/kodefox/discourse-expo-pn-plugin.git
```

4. Rebuild the container:

:::caution

Please be aware that when rebuilding your site will result in your site going offline for a period of time, typically between 5 to 30 minutes. We advise proceeding with caution and taking the following precautions:

1. Before installing the plugin or performing any site rebuild, it is highly recommended to create a backup of your Discourse site.

2. It is advisable to upgrade your Discourse installation and all existing plugins to their latest versions before attempting to install this plugin.

3. Although rare, there may be instances where the site does not come back online after the rebuilding process, and requires further troubleshooting to revive. This is always a risk when installing a plugin or performing any task that requires rebuilding the app. We recommend that you perform these changes at a time that minimizes the users affected and that you have a well-defined contingency plan in place if something goes wrong.

:::

```
cd /var/discourse
./launcher rebuild app
```

### How to Uninstall the Plugin

To remove the plugin, simply remove the Git clone URL line from your `app.yml` file and rebuild your site. Please keep in mind that rebuilding your site will will result in your site going offline for a period of time, and poses the same risks that come with rebuilding the app.
