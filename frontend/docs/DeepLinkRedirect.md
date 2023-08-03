# Deep Link

## Overview

Lexicon supports deep linking with our plugin discourse-lexicon-plugin. Currently, we have two types of deep links: post and message.

A post deep link will contain information such as the post title and post number. For example: {baseDeepLinkUrl}/post-detail/t/welcome-to-our-community/7.

On the other hand, a message deep link will include the title and message ID. For instance: {baseDeepLinkUrl}/message-detail/t/test/55/1.

## Flow Navigate DeepLink in lexicon app

### Post Detail

This is a flow of diagram of post detail deep link

```mermaid
flowchart TD
    UserClick[/Click DeepLink /] --> conditionDiscourse{Is Public Discourse?}

    conditionDiscourse -- yes --> yesPublicCondition(Redirect To Post Detail Scene)
    yesPublicCondition --> conditionPublicError403{Is GetError 403}

    conditionPublicError403 -- yes --> yes403PublicCondition{Is Already Login}
    conditionPublicError403 -- no --> no403PublicCondition{is Get Other Error}

    no403PublicCondition -- yes --> resultGetOtherErrorPost(show error message `some thing wrong`)
    no403PublicCondition -- no --> resultPost(show the post)


    yes403PublicCondition -- yes --> yesPublicIsLoginCondition(Redirect To Home Scene and Show Alert Private Post)
    yes403PublicCondition -- no --> noPublicIsLoginCondition(Redirect To Login Scene)


    conditionDiscourse -- no --> privateCondition{is Already Login}

    privateCondition -- yes --> yesPublicCondition

    privateCondition -- no --> noPublicIsLoginCondition

    noPublicIsLoginCondition --> afterLogin[\Input Login Account\]

    afterLogin --> yesPublicCondition
```

### Message Detail

This is a flow diagram of message detail deep link

```mermaid
flowchart TD
    UserClick[/Click DeepLink /] --> conditionDiscourse{Is Public Discourse?}

    conditionDiscourse -- yes --> yesPublicCondition(Redirect To Message Detail Scene)

    yesPublicCondition --> ErrorCondition{is Get Error}

    ErrorCondition -- yes --> resultGetOtherErrorPost(show error message `sorry we can't get the message`)
    ErrorCondition -- no --> resultPost(show the message)


    conditionDiscourse -- no --> privateCondition{is Already Login}

    privateCondition -- yes --> yesPublicCondition
    privateCondition -- no --> noPrivateConditionLogin(Redirect To Login Scene)

    noPrivateConditionLogin --> afterLogin[\Input Login Account\]

    afterLogin --> yesPublicCondition
```

## Note

1. We will encounter a 403 error when attempting to make a request to the topicDetail query for private posts. To provide more details on this issue, please refer to PR [#1100](https://github.com/kodefox/lexicon/pull/1100), which offers a more comprehensive description.

2. In our code, we store the deep link path in a hook, which can be found in the file `AppNavigator.tsx`. The code checks if the user is not logged in and then saves the path of the deep link, for example, `t/welcome-to-our-community/7`. This path is handled in the login process, where the user is automatically redirected to the specific route, either the message or post detail scene.
