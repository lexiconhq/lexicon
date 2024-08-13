---
title: Overview
---

As covered in [Concepts and Architecture](concepts#prose-discourse-through-graphql), Prose is Lexicon's GraphQL API layer on top of the traditional RESTful API provided by Discourse.

## Getting Started with Deployment

At this point, you're likely to be digging into this section of the documentation for two reasons:

- You've been developing against a local instance (or container) running Prose, and you're ready to actually deploy your entire Lexicon project to production.

- You want to simplify your development process by pointing the Lexicon Mobile App at a deployed instance of Prose.

In either scenario, the end goal of this section is to have a working Prose server accessible on the open internet.

### 🔐 Note about Access Control

As a brief aside, please note that Prose cannot expose any information from Discourse that Discourse is not already exposing on its own.

If your Discourse instance requires authentication, then Prose will be unable to retrieve most queries unless the required authentication information is provided by the user accessing Prose.

### 🧱 Alternative Deployment Strategies

Initially, we wanted to provide instructions for an integrated deployment strategy. This would have involved deploying Prose on the same host as your Discourse instance, and ideally finding a way to deploy and expose it within the running Docker host that Discourse uses itself.

This is still achieveable. But for now, we have opted to focus solely on deploying Prose as a dedicated instance.

However, should you find yourself preferring a custom deployment of Prose, we would encourage you to do so.

If you do, and you have some questions or challenges you're encountering, please reach out to us.

Ideally we can help you sort things out and work your approach into our documentation so that everyone will benefit going forward.

## Deploying as Dedicated Instance

As mentioned above, the official deployment strategy for Prose is to host it as a dedicated instance.

Like anything, this comes with both benefits and trade-offs, which we have outlined for you below.

### 🚀 Benefits

A dedicated host for Prose will have better performance and reliability because its only resource usage comes from running Prose. i.e., it has exclusive usage of CPU, RAM, disk space, etc.

If, on the other hand, you had managed to deploy Prose on the same host as your Discourse instance, this would mean that both Prose and Discourse need to share the host's allocated resources. If your Discourse instance is already running on a fairly light host, running Prose on it might mean that you would need to upgrade to a host with more resources.

### ⚠️ Possible Trade-offs

#### Increased Cost

Naturally, if you're setting up a dedicated host to run Prose, then that involves additional costs on top of what you're already paying to host Discourse.

Having said that, for most deployments, it is unlikely that you will need to allocate an expensive amount of resources to Prose.

For example, on Digital Ocean, the $5 Shared CPU node is often sufficient.

#### Potential for Increased Latency

By nature, when deploying Prose on a different host from your running Discourse instance, the latency between the mobile app and Discourse increases.

This is because each request has to make two hops:

- The first request is from the client (your Lexicon-powered mobile app) to the Prose GraphQL API
- The second request is from Prose to Discourse

However, the only important questions regarding this point are:

- How much measurable latency is there?
- Is it noticeably slow to myself or my users?

This, of course, can depend on several factors:

- Where your Discourse server is deployed
- Where your Prose server is deployed
- Where your users tend to be
- If the amount of traffic (load) is too much for the system to optimally run both Prose and Discourse.

If you are observing noticeable latency, we would recommend looking into these factors.

Ideally, you'll want to deploy Prose in the same region as your Discourse instance; and it is even better if you can deploy Prose in the same datacenter as your Discourse instance.

## Up Next

With this overview out of the way, we'll start by introducing you to the list of all possible [environment variables](env-prose) that may be necessary or useful when deploying Prose.

Lastly, we'll get into the heart of it, by [preparing your host and deploying Prose](dedicated).
