---
title: Receiving Updates from Lexicon
---

Due to the nature of this project, the best way to synchronize bugfixes, updates, and other changes to the Lexicon Mobile App is to treat your app like a fork of our repository.

In the process of customizing the Lexicon Mobile App for your needs, you might make any number of changes to the theme or assets.

However, the underlying codebase should be—for the most part—untouched.

When we release a bugfix or new feature on the `master` branch, you'll be able to pull down our changes, resolve any conflicts with your changes, and have an updated version of your app ready to republish.

It is worth acknowledging that this approach, which effectively uses Git to solve this problem in a fairly simple way, could be improved.

Provided that there's enough interest, we might later decide to shape Lexicon into more of a standalone SDK package that you can import and receive updates to via npm.

If you're interested in making that a reality, please reach out to us!
