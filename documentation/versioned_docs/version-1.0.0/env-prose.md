---
title: Prose Environment Variables
---

The table below lays out environment variables for the Prose GraphQL API.

If there is a default value indicated, you do not need to set it.

| Environment Variable        | Required | Notes                                                                               | Default Value            | Example Value                        |
| --------------------------- | -------- | ----------------------------------------------------------------------------------- | ------------------------ | ------------------------------------ |
| PROSE_DISCOURSE_HOST        | Yes      | The specific location of your Discourse instance.                                   | -                        | https://discourse.example.com        |
| PROSE_DISCOURSE_UPLOAD_HOST | No       | Instruct Prose to use a different host for file uploads to Discourse.               | `<PROSE_DISCOURSE_HOST>` | https://upload.discourse.example.com |
| PROSE_APP_HOSTNAME          | No       | The **application-level** hostname that Prose will listen on.                       | localhost                | 0.0.0.0                              |
| PROSE_APP_PORT              | No       | The **application-level** port that Prose will listen on.                           | 80                       | 8080                                 |
| SKIP_CHECK_DISCOURSE        | No       | Bypass the startup process of checking the provided Discourse host for reachability | false                    | true                                 |
