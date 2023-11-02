---
title: Theming
---

:::note
This section will involve reading and modifying Typescript. If you get stuck, reach out to us.
:::

Lexicon allows you to customize the default theme that the Mobile App provides.

You can accomplish this by modifying the values in `frontend/src/constants/theme`, or in `frontend/src/theme`.

There is a difference between the two, and they work in conjunction with one another.

`frontend/src/constants/theme` defines the underlying base values of the theme.

`frontend/src/theme` then imports those values, and uses them to compose the actual theme object used throughout the rest of the Mobile App.

## Colors

### Adjusting Base & Functional Colors

There are 2 types of colors in the Mobile App: base colors and functional colors.

Base colors are the underlying palette of the theme, whereas functional colors define specific use-cases of the base colors.

For example, you might have noticed that the Mobile App features a nice, eye-catching Royal Blue color as its primary color.

This is defined in the base colors as:

```ts
// ...
royalBlue: '#2B6AFF',
// ...
```

Then, the functional colors make use of this for particular components in the app.

To continue with the example, the `royalBlue` base color is referenced in the functional colors as:

```ts
// ...
activeTab: BASE_COLORS.royalBlue,
// ...
primary: BASE_COLORS.royalBlue,
// ...
```

Now, any component can reference the functional colors' `primary` value, and it will be `royalBlue`.

However, if you wanted a different theme with a new color, such as, `BASE_COLORS.lightningYellow`, then you could adjust it to:

```ts
// ...
activeTab: BASE_COLORS.lightningYellow,
// ...
primary: BASE_COLORS.lightningYellow,
// ...
```

And the Mobile App would replace the Royal Blue with the value you've defined for Lightning Yellow.

For this reason, if you want to add more colors, you'll need to add base color values first, and then access them within the functional colors.

This approach keeps a clean separation of concerns, which allows theme changes to seamlessly propagate throughout the Mobile App.

### Color Scheme (Dark Mode and Light Mode)

The theme allows you to control how the user can adjust the app's color scheme, if at all.

There are three choices for this: `dark`, `light`, `no-preference`.

- Dark: force the color scheme to remain dark
- Light: force the color scheme to remain light
- No Preference (default): allow your users to specify a preference for color scheme

Note that if you specify `dark` or `light`, your users **will not** have the option of selecting a preference for color scheme.

This manifests in the Mobile App by hiding the Dark Mode button which normally appears in the Preferences Scene.

## Fonts

The theme's fonts are declared in `frontend/src/constants/theme/fonts`.

Inside of that file, you'll find multiple aspects of the fonts that can be adjusted:

- Font Variants
- Font Sizes
- Heading Font Sizes

### Font Variants

Used to classify multiple font weights into named variants. It supports the following values:

| Variants | Default font weight |
| -------- | ------------------- |
| bold     | 700                 |
| semiBold | 600                 |
| normal   | 400                 |

### Font Sizes

Used to set a font size scale that is consistent throughout the app. It supports the following values:

| Variants         | Default size |
| ---------------- | ------------ |
| xl (extra large) | 24           |
| l (large)        | 18           |
| m (medium)       | 16           |
| s (small)        | 14           |
| xs (extra small) | 12           |

### Heading Font Sizes

Used to classify multiple font sizes for heading elements, such as `h1`, `h2`, etc.

These values are primarily used for rendering the content of posts and messages from Discourse.

This is because Discourse posts are written in Markdown, and users will often leverage heading elements to format their posts.

| Variants       | Default size |
| -------------- | ------------ |
| h1 (Heading 1) | 32           |
| h2 (Heading 2) | 24           |
| h3 (Heading 3) | 22           |
| h4 (Heading 4) | 20           |
| h5 (Heading 5) | 18           |
| h6 (Heading 6) | 17           |

## Icons

The `icons` theme file is used to store icon-related constants.

Currently, the ‘icons’ file only contains a constant which declares the icon sizes scale.

| Variants         | Default size |
| ---------------- | ------------ |
| xl (extra large) | 28           |
| l (large)        | 24           |
| m (medium)       | 20           |
| s (small)        | 18           |
| xs (extra small) | 16           |

## Images

The `images` theme file is used to store theme constants used in rendering images.

Currently, this file declares the following theme values:

- Avatar Icon Size
- Avatar Letter Size
- Avatar Image Size

Avatars are used throughout the app to display relevant info about a post or message.

As such, it is typically the user's photo.

However, when a photo is not provided, we also compose a letter-based avatar based on the user's initials.

### Avatar Icon Size

| Variants         | Default size |
| ---------------- | ------------ |
| l (large)        | 96           |
| m (medium)       | 52           |
| s (small)        | 40           |
| xs (extra small) | 28           |

### Avatar Letter Size

| Variants         | Default size |
| ---------------- | ------------ |
| l (large)        | 72           |
| m (medium)       | 36           |
| s (small)        | 28           |
| xs (extra small) | 16           |

### Avatar Image Size

This defines the quality of the image used for avatars.

| Variants         | Default size |
| ---------------- | ------------ |
| xl (extra large) | 450          |
| l (large)        | 150          |
| m (medium)       | 100          |
| s (small)        | 50           |

## Spacing

The `spacing` theme file defines spacing constants used throughout the Mobile App for padding and margins.

| Variants                  | Default size |
| ------------------------- | ------------ |
| xxxl (triple extra large) | 36           |
| xxl (double extra large)  | 24           |
| xl (extra large)          | 16           |
| l (large)                 | 12           |
| m (medium)                | 8            |
| s (small)                 | 4            |
| xs (extra small)          | 2            |

## Advanced Customization

While the above adjustments are generally fairly simple, you can really customize the Mobile App to your heart's content (based on your skill level).

Here are some additional aexamples.

### Custom Fonts

#### Create a folder for the Custom Fonts

To keep the codebase organized, create a folder named `fonts` inside of `frontend/assets`.

You can then move your custom font assets into this folder.

#### Install & Use the `expo-font` Package

This package eases the process of adding custom fonts into an Expo-based app.

In particular, you'll want to use the `loadAsync` function from it, which will map your font assets to their variant names throughout the Mobile App.

While we won't get into too much technical detail here, their [documentation](https://docs.expo.dev/versions/latest/sdk/font/) can guide you through the process.

### Error Messages

It is possible to customize both the error messages and the means through which they are presented to the user.

In order to do this, you should first be aware of two files.

#### `frontend/src/helpers/errorMessage.ts`

The Prose GraphQL API forwards on error messages from Discourse.

This file declares the specific text of those messages as constants so that they can easily be compared in `errorHandler.ts`.

If you observe any additional error messages that are not being caught, you'll want to add them to this file, and then adjust `errorHandler.ts` below accordingly.

#### `frontend/src/helpers/errorHandler.ts`

This file imports from the above `errorMessage.ts`.

It then defines exactly how errors should be handled, including the above messages, when they are encountered.

Currently, the default approach is to display the errors using an Alert to the user.

However, if you wanted to integrate snackbars, you would adjust the code in `errorHandler.ts` to replace the invocations of `Alert.alert`.
