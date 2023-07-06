---
title: Contributing
---

Thank you for your interest in contributing! :sparkles:

We greatly appreciate the time and effort you're willing to put forth to make Lexicon even better.

There are several ways to help out.

## Reporting Bugs

The best way to let us know about a bug is by [creating a new issue](https://github.com/lexiconhq/lexicon/issues/new) on [Github](https://github.com/lexiconhq/lexicon).

As always, we recommend searching the existing open and closed issues before opening a new one.

When you create the issue, please be sure to include the following:

- A detailed description of the bug and its behavior

- The behavior you expected instead of the bug

- A list of steps for how to reproduce the bug

- Details about the device(s) and version(s) you're observing the bug on

- Screenshots and screen recordings, while not necessary, are very welcome!

Once we've received your bug report, we will triage it and label it accordingly.

## Contribute to the Project

Want the honor of being listed in our contributors section :clap:?

We'd love to get a PR from you addressing an existing issue, adding a feature, or even just improving the documentation.

To get started contributing, follow the instructions below.

### Instructions

**1. Fork the [official Lexicon repository](https://github.com/lexiconhq/lexicon)**

You probably already know the drill - click on **Fork** button on the upper-right corner.

**2. Clone your Fork of Lexicon**

Be sure to clone **_your_** fork to your development machine (as opposed to cloning the main Lexicon repository).

```
$ git clone https://github.com/YOUR_USERNAME/lexicon.git
```

If you need further guidance with cloning, head over to our [Quick Start](quick-start#installation) section.

Just bear in mind that the Quick Start section walks you through cloning the Lexicon repository. So make sure you change the URL to your username as referenced above.

**3. Run and connect the app with Prose and a Discourse Host**

For a comprehensive walk-through of this step, follow the instructions in the [**Setup**](setup#discourse-host) section.

If you already have a deployed Prose instance that is pointing at a Discourse instance, you can simply configure the Lexicon Mobile App to point at the address of your Prose deployment.

However, if you don't have that, or if you're planning on making adjustments to the Prose server itself, you'll want to ensure the Lexicon Mobile App is configured to point at a Prose server that you have running locally.

**4. Get Started with your Contribution**

At this point, you should be setup to dig in on the main work of your feature, bugfix, or other contribution.

Remember that it's necessary to have the [**ESLint**](https://eslint.org/docs/user-guide/getting-started) and [**Prettier**](https://prettier.io/) plugins installed in your IDE, as those are required in order for the Pull Request checks to pass.

We would recommend working in [VSCode](https://code.visualstudio.com/), since that is what we used to develop Lexicon. However, it is up to you, you only need to ensure that ESLint and Prettier are functioning properly within your IDE.

**5. Run the Test Suite**

Follow these [**steps**](setup#run-the-test-suite) to run the Lexicon test suite.

In order to speed up the feedback cycle, it is recommended that you ensure that all tests are passing locally before pushing, especially if you already have an open PR.

This is primarily because we have configured our Github project to block PRs from being merged if any of the build steps fail.

If the reviewers see that tests are failing, they aren't able to review it as quickly, and will likely request that you resolve any build issues before requesting review again.

**6. Stage, Commit, and Push your Local Changes**

If you're unfamiliar with this process, please take a look at this [great article](https://github.com/git-guides/#learning--mastering-git-commands) from Github to bring you up to speed.

**7. Create a New Pull Request**

Your code is ready to submit! :tada:

Go to the Lexicon [Pull Requests tab](https://github.com/lexiconhq/lexicon/pulls), and compare the changes between your branch and the master branch.

Double-check and make sure you didn't push anything you don't want included in your PR.

Then, go ahead and create a new Pull Request from your forked repository.

Please be sure to follow the Pull Request template, add related labels, and please mention the issue you are addressing to help us keep track of what's being worked on.

## Share Your Thoughts with Us

We'd love to hear your new ideas! Drop them in the [Issues tab](https://github.com/lexiconhq/lexicon/issues).

## Spread the Word

Let others know about your awesome experience using Lexicon on social media, and tag us on Twitter [@GetLexicon](https://twitter.com/GetLexicon).

And if you build your app using Lexicon, please let us know. We'd love to help you spread the word about what you've built!

## Improve the Documentation

As a closing thought, if you find any issues with the Lexicon documentation, or just think you could make it better, you can get started with these brief instructions below.

To generate and run the documentation locally, from the project root, run:

```sh
npm run docs:start
```

Similarly, you can build the documentation using:

```sh
npm run docs:build
```

All documentation is in the `documentation/` directory, and the Markdown pages used to generate this site are under `documentation/docs`.

If you end up making a PR to improve the documentation, please be sure to label your PR with the `Documentation` label.

:::note
Don't hesitate to ask if you have any further questions. We're always happy to help. :smile:
:::
