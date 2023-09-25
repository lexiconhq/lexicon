# Basic Logger

Last updated: 2023/08/28

## Motivation

The Prose API needs a proper logging solution so that users of Lexicon who deploy it can monitor the service for issues. Based on our research, we decided to use Winston for our logger. Winston logger offers a versatile and efficient solution for logging. With support for multiple transport options, customizable log formatting, and different log levels, Winston provides developers with the flexibility to tailor their logging to specific needs.

## Setup

Winston is just a single dependency with the package name [winston](https://github.com/winstonjs/winston), so we added it to the project with `yarn add winston` from within the `api/` directory.

## Transports

In logging, a transport is a destination where logs are stored or displayed, such as a file, console, database, etc. In our logging setup, we mainly use the file transport. But during development, we also add the console transport. We chose the file transport because it offers a simple setup that logs directly into a file. We chose this over transports like [Http and Stream](https://github.com/winstonjs/winston/blob/master/docs/transports.md#built-in-to-winston) because server logs can sometimes contains sensitive information, so we don't want expose the logs on the open internet.

We set up the file transport using a library called [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file), which rotates the log file based on time. In addition to configuring the rotation frequency, we can also specify the maximum file size, the maximum number of files to retain, the number of days to keep files, and more.

Referring to the guidance provided by the [OWASP Logging Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), there are some important points to consider when storing logs in a file system:

1. It is preferable to use a separate partition than those used by the operating system, other application files and user generated content.
2. Apply strict permissions concerning which users can access the directories, and the permissions of files within the directories.
3. In web applications, the logs should not be exposed in web-accessible locations, and if done so, should have restricted access and be configured with a plain text MIME type (not HTML).

## Approach

We make logging easier by directly connecting the logger to the `GraphQL Yoga` instance using a plugin called `useLogger`, which helps us keep all log calls in one central place.

```
useLogger({
    logFn: (eventName, events) => {
        // Event could be `execute-start` / `execute-end` / `subscribe-start` / `subscribe-end`
        // `args` will include the arguments passed to execute/subscribe (in case of "start" event)
        // and additional result in case of "end" event.
        switch (eventName) {
            case 'execute-end':
            case 'subscribe-end':
                // Do logging
                break;
        }
    },
})
```

We categorize our logs into two distinct files, one exclusively for 'error' level logs, and the other for a compilation of logs across all levels.

## Future Improvement

At the moment, our loggers are mainly used to catch any GraphQL errors that are thrown on the server side. But in the future, we're thinking about logging additional types of server errors, like runtime or network issues.
