---
title: Concepts and Architecture
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Discourse through GraphQL

It is worth acknowledging upfront that Discourse already provides a traditional, RESTful API for developers out of the box.

However, [the official documentation](https://docs.discourse.org/) for this API points out that it is incomplete, effectively serving as a starting point.

> Note: For any endpoints not listed you can follow the reverse engineer the Discourse API guide to figure out how to use an API endpoint.
>
> —**Discourse API Documentation**

The core team, as well as members of the [support forum](https://meta.discourse.org), regularly respond to questions about the API by [encouraging developers to reverse-engineer the API](https://meta.discourse.org/t/how-to-reverse-engineer-the-discourse-api/20576). As of this writing, the topic for how to reverse engineer the API has been linked to from nearly 200 other topics on the support forum.

To simplify the process of working with the Discourse API in the Lexicon mobile app, we use [Apollo Rest Link](https://www.apollographql.com/docs/react/api/link/apollo-link-rest/) to seamlessly map REST endpoints to GraphQL queries. This approach allows developers to leverage the intuitive GraphQL query structure while interacting with Discourse's REST API directly, without requiring an additional backend layer for API normalization.

By converting RESTful data into GraphQL using this method, we aim to streamline development, save time, and provide a more cohesive developer experience as you build on top of Discourse.

#### Apollo Rest Link

With Apollo Rest Link, developers can seamlessly translate Discourse's REST API into GraphQL. This eliminates the need for maintaining a separate backend service or GraphQL schema. Instead, the Lexicon mobile app uses Apollo Rest Link directly to define and manage mappings between REST endpoints and GraphQL queries.

This approach offers several benefits:

- **Simplified Querying**: Developers can use GraphQL to fetch data with familiar query structures, improving readability and reducing complexity.
- **No Additional Layer**: Unlike the previous implementation, the app now directly interacts with REST endpoints using GraphQL queries, making the process more efficient.
- **Integrated Debugging**: Apollo Rest Link supports the use of tools like Apollo DevTools to debug and inspect queries, helping developers identify issues quickly during development.

By using Apollo Rest Link, developers can focus on building features without the overhead of managing a separate backend or dealing directly with RESTful complexities.

#### Why GraphQL?

There is no shortage of articles about both the [benefits](https://www.howtographql.com/basics/1-graphql-is-the-better-rest) and [tradeoffs](https://lwhorton.github.io/2019/08/24/graphql-tradeoffs.html) of GraphQL.

We're well aware that GraphQL isn't some magical solution that solves all the problems of other API paradigms.

Having said that, we chose to build Lexicon with it for two primary reasons.

1. Our team is familiar and fluent with GraphQL, and deeply enjoys working with it.

2. The tooling, libraries, and auto-generated documentation provide out-of-the box benefits which we can pass onto others with no additional effort.

#### Why Expo?

[Expo](https://docs.expo.io/) is both a framework and a platform for building universal React applications. In particular, it provides a superior development experience when building mobile apps with React Native.

We find that Expo makes us much more effective as developers, and also provides excellent services to facilitate the entire process of building and publishing React Native apps.

In particular, Discourse sites that leverage the [Lexicon Discourse Plugin](./discourse-plugin.md) get the benefit of [push notifications](./push-notifications) through Expo's [push notifications service](https://docs.expo.dev/push-notifications/overview/), which abstracts away Google and Apple's push services into a simple interface.

## Lexicon Architecture {#architecture-of-the-lexicon-stack}

The Lexicon Stack is fairly simple, and only consists of 2 major pieces:

- The Lexicon Mobile App
- A running, accessible Discourse instance
- Optionally, you can install our [Discourse Plugin](./discourse-plugin.md) to enable additional features.

Below is a diagram illustrating the typical architecture for a Lexicon-powered mobile app.

<img alt="Lexicon Architecture" style={{borderRadius: '25px'}} src={useBaseUrl('/img/version-3.0.0/new-lexicon-architecture.svg')}/>

As indicated above, the mobile app makes requests to a deployed Discourse instance.

If the [Lexicon Discourse Plugin](./discourse-plugin.md) is installed, additional endpoints will be exposed which App already knows how to communicate with.
