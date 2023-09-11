---
title: Plugin Installation
slug: discourse-plugin/setup
---

Before you can start using the Lexicon Discourse Plugin, there are a few prerequisites and installation steps you need to follow. This documentation will guide you through the process, ensuring a smooth setup of the plugin on your site.

## Prerequisites

In order to use this plugin, you must have access to your Discourse server in a way which allows you to modify the server's `app.yml`. If a hosting provider is managing Discourse for you, you will have to contact them to request that they install the plugin on your behalf.

Specifically, you will need the ability to install plugins, which means directly modifying `/var/discourse/containers/app.yml` to include the [Lexicon Discourse plugin](https://github.com/lexiconhq/discourse-lexicon-plugin.git), and then rebuilding your site.

## Plugin Installation Steps

### Access your Server

Login to your underlying Discourse host server via SSH.

This is specific to each hosting setup, but typically you will need to use a terminal application such as Terminal on macOS or PuTTY on Windows.

### Open the Discourse `app.yml` file

Feel free to use your terminal editor of choice (vim, emacs, nano, etc.).

:::note
You may need `sudo` access to edit the file, but it depends on how the server was configured.
:::

```bash
vim /var/discourse/containers/app.yml
```

### Get the Plugin’s Git Clone URL

Discourse plugins are referenced by their reachable Git clone URLs, which typically end with `.git`.

The Git clone URL for the [Lexicon Discourse plugin](https://github.com/lexiconhq/discourse-lexicon-plugin) can be found below:

```
https://github.com/lexiconhq/discourse-lexicon-plugin.git
```

Copy it to your clipboard for use in the next step.

### Add the plugin’s repository URL to your container’s `app.yml` file:

Add the plugin’s Git clone url to the section below.

```
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/lexiconhq/discourse-lexicon-plugin.git
```

### Rebuild the container, with caution

:::caution
Please be aware that rebuilding your site will result in your site going offline for a period of time, typically between 5 to 30 minutes. We advise proceeding carefully and taking precautions outlined below.
:::

#### Precautionary Measures

1. Before installing the plugin or performing any site rebuild, it is highly recommended to create a backup of your Discourse site.
1. It is advisable to upgrade your Discourse installation and all existing plugins to their latest versions before attempting to install this plugin.
1. Although rare, there may be situations where the site does not come back online after the rebuilding process, and requires further troubleshooting to revive.
   - This is always a risk when installing a plugin or performing any task that requires rebuilding the app.
   - We recommend that you perform these changes at a time that minimizes the users affected and that you have a well-defined contingency plan in place if something goes wrong.

#### Run Rebuild Command

```bash
cd /var/discourse
./launcher rebuild app
```

### How to Uninstall the Plugin

To remove the plugin, simply remove the Git clone URL line from your `app.yml` file and rebuild your site. Please keep in mind that rebuilding your site will will result in your site going offline for a period of time, and poses the same risks that come with rebuilding the app.
