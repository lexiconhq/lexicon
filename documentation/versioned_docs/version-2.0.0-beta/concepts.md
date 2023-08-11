---
title: Concepts and Architecture
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Prose: Discourse through GraphQL

It is worth acknowledging upfront that Discourse already provides a traditional, RESTful API for developers out of the box.

However, [the official documentation](https://docs.discourse.org/) for this API points out that it is incomplete, effectively serving as a starting point.

> Note: For any endpoints not listed you can follow the reverse engineer the Discourse API guide to figure out how to use an API endpoint.
>
> —**Discourse API Documentation**

The core team, as well as members of the [support forum](https://meta.discourse.org), regularly respond to questions about the API by [encouraging developers to reverse-engineer the API](https://meta.discourse.org/t/how-to-reverse-engineer-the-discourse-api/20576). As of this writing, the topic for how to reverse engineer the API has been linked to from nearly 200 other topics on the support forum.

To help you simplify the process for you, Prose strives to normalize a subset of the API. We have done so with the hope that it will save you some time as you develop against Discourse.

#### GraphiQL

Prose's GraphQL implementation includes an [in-browser GraphQL IDE](https://www.graphql-yoga.com/docs/features/graphiql), known as [GraphiQL](https://github.com/graphql/graphiql), which allows developers to easily reference the entire documentation and schema and make queries against a running Discourse instance.

<img alt="" width="900" src={useBaseUrl('/img/screenshot/playground.png')}/>

This means you can rapidly get a clear understanding of how a method behaves—and what parameters it requires—without digging through support posts or reverse-engineering the REST API.

#### Why GraphQL?

There is no shortage of articles about both the [benefits](https://www.howtographql.com/basics/1-graphql-is-the-better-rest) and [tradeoffs](https://lwhorton.github.io/2019/08/24/graphql-tradeoffs.html) of GraphQL.

We're well aware that GraphQL isn't some magical solution that solves all the problems of other API paradigms.

Having said that, we chose to build Lexicon with it for two primary reasons.

1. Our team is familiar and fluent with GraphQL, and deeply enjoys working with it.

2. The tooling, libraries, and auto-generated documentation provide out-of-the box benefits which we can pass onto others with no additional effort.

#### Why Expo?

[Expo](https://docs.expo.io/) is both a framework and a platform for building universal React applications. In particular, it provides a superior development experience when building mobile apps with React Native.

We find that Expo makes us much more effective as developers, and also provides excellent services to facilitate the entire process of building and publishing React Native apps.

## Lexicon Architecture

The Lexicon Stack is fairly simple, and only consists of 3 major pieces:

- The Lexicon Mobile App
- The Prose GraphQL API
- A running, accessible Discourse instance

Below is a diagram illustrating the typical architecture for a Lexicon-powered mobile app.

<img alt="IOS Lexicon Login Page" style={{borderRadius: '25px'}} src={useBaseUrl('/img/lexicon-architecture.png')}/>

As indicated above, the mobile app makes requests to a deployed Prose GraphQL server.

The Prose server has been configured to point at an active Discourse instance of the developer's choice.

Traffic then flows back from Discourse, through Prose, and returns to the mobile app over a GraphQL interface.
