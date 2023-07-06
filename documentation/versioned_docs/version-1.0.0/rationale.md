---
title: Background & Motivation
---

### Discourse's Approach to a Mobile Experience

Discourse is a phenomenal, battle-tested piece of software that facilitates thoughtful discussions in countless communities around the globe. It's no secret that we are big fans of it.

The Discourse core team's strategy for mobile devices was to implement their product as a responsive website, and optimize for mobile use cases. This allowed mobile users to simply go to the same Discourse site as they would have on devices with larger screens— enabling them to view and write posts from their mobile devices.

However, over time, interest in a dedicated Discourse mobile app grew. The core team addressed this need by building a native mobile app. They chose to reuse their existing work by having the app simply wrap a webview containing the mobile site.

This was a nice improvement, as it allowed the mobile app to integrate with native SDKs and provide some additional features to Discourse mobile users.

Overall, their approach to solving this problem was both efficient and well-done.

However, it is still evident to many users that they're interacting with an embedded web browser, and it's clear that it's not a mobile-_first_ experience.

For many users and site-owners, what the Discourse team has provided is more than enough, and it solves all of their problems.

In our case, we were looking for a very specific type of experience.

### Who We Are

The Lexicon Team is part of [KodeFox](https://www.kodefox.com/), a software studio comprised of passionate software engineers, designers, and product managers who regularly build world-class software for our customers.

Interested in custom software development with a personal touch? Drop us a line at [hello@kodefox.com](mailto:hello@kodefox.com).

### Enter Lexicon

Lexicon was formed out of the desire to further leverage many of the great features that the Discourse team had worked hard to build.

In our consulting projects, we found that many of our clients were regularly asking for solutions that Discourse already provides out of the box.

However, our clients wanted a seamless, native mobile experience, tailored to the brand that their users were already familiar with.

After digging into the Discourse API documentation, we felt that it was worthy investment to build a mobile-first Discourse experience which also faciliated customizability.

We were already advocates of the elegant development process provided by React Native and Expo, so we forged ahead, implementing the entire mobile app with these technologies.

This allowed us to achieve a high ratio of code reuse across iOS and Android, making feature implementations and bug fixes a much simpler process in most cases.

In integrating with Discourse's API, we also noticed that the API documentation contains a disclaimer which encourages reverse-engineering to understand it.

While we can appreciate the sentiment of figuring things out yourself, we wanted to provide an API experience that makes it easy for developers to dig into interactive documentation and quickly grasp the concepts.

For this reason, we also chose to build Prose, our GraphQL API layer on top of the Discourse RESTful API. Another motivating factor was our existing fluency with GraphQL.

This allowed us to quickly implement the mobile app with an intuitive API paradigm that we were already very familiar with.

#### How Lexicon can help you

For starters, if you already run an existing Discourse site and want a native mobile experience for your users, you can very quickly point Lexicon at your site and browse it in real-time from your device.

Check out the [Quick Start](quick-start) page to see a rapid example of spinning up a mobile app for Discourse's own [Meta site](https://meta.discourse.org).

But beyond that, Lexicon is an open source pre-built mobile app. This means that you can customize it to fit your brand.

You can think of it like a template that you can use to build your own mobile app for your community.

If you're interested in customizing the Lexicon Mobile app, you can learn more about that in the [White Labeling](white-labeling) section.

And when you're finished, you can publish it to the Apple App Store or Google Play Store, which we cover in [Publishing your App](app-store).

### FOSS Mindset

Finally, while this project will benefit us and our clients in the future, we also wanted it to be a gift to the community.

We recognize and support the culture of free and open-source software. That's why we're delighted to give back to the community in this way, just as the Discourse team originally did when they chose to open-source their hard work.

So please engage with us on Github, and don't be shy about opening a new issue or even a PR.

We look forward to working with you!
