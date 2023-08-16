# Typescript Usage

The Prose GraphQL makes use of Typescript in multiple ways:

- Nexus for schema generation, which generates Typescript types for use in the resolvers
- Manual type definitions
- As of Tuesday, August 15, 2023, we began incrementally adopting usage of [zod](https://github.com/colinhacks/zod) for type definitions and validation
- @ts-reset for additional type safety checks

Generally, this codebase strives to be as type-safe as possible, and we are always improving upon this.

The original implementation was not very careful with types, and as such there are still cases of implicit any, type assertions, and other bad practices.

Our adoption of tools like zod and @ts-reset are intended to help progressively address lingering type saftey issues.
