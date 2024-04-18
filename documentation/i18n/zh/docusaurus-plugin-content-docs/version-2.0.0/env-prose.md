---
title: Prose 环境变量
---

下表列出了 Prose GraphQL API 的环境变量。

若有默认值指示，无需要的情况下您无需显式设置它。

| Environment Variable        | Required | Notes                                                                               | Default Value          | Example Value                        |
| --------------------------- | -------- | ----------------------------------------------------------------------------------- | ---------------------- | ------------------------------------ |
| PROSE_DISCOURSE_HOST        | Yes      | 需要与 Prose 连接的 Discourse 站点的地址 | -                      | https://discourse.example.com        |
| PROSE_DISCOURSE_UPLOAD_HOST | No       | 为 Prose 配置一个不同于 Discourse 站点的附件服务器.               | <PROSE_DISCOURSE_HOST> | https://upload.discourse.example.com |
| PROSE_APP_HOSTNAME          | No       | Prose 在应用层监听的地址。（Lexicon APP 通过此地址连接到 Prose）            | localhost              | 0.0.0.0                              |
| PROSE_APP_PORT              | No       | Prose 在应用层监听的端口。 Lexicon APP 通过此端口连接到 Prose）| 80                     | 8080                                 |
| SKIP_CHECK_DISCOURSE        | No       | 跳过 Prose 启动时对 Discourse 可访问性的检测。 | false                  | true                                 |
