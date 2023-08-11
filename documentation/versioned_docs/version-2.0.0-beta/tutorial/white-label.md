---
title: White Label your App
---

## Customize the Splash Screen and App Icon

In order to customize the app for your own brand, you will likely want to provide your own assets for the **Splash Screen** and the **App Icon**.

The **Splash Screen** - sometimes also referred to as the Launch Screen - is what appears while the app is launching. Some apps also display this to help conceal private information when the app is put into background mode.

The **App Icon** is what is used to represent the app on the user's device, such as on the home screen and when listing it in the device's settings.

Both of these assets often contain your logo in one form or another. For example, the App Icon for the Gmail app is the multi-colored outline of an envelope. Then, when launching the Gmail app, you will notice that the Splash Screen includes a larger version of the App Icon.

### Customizing the Splash Screen

:::info
Expo does not currently support dark mode for splash screens.
:::

The assets used for the splash screen in the Mobile App are located at `frontend/assets/images/splash.png` and `frontend/assets/images/splashDark.png`.

Above, we mention splash screen assets for both Dark Mode and Light Mode.

However, unfortunately at this time, Expo does not support Dark Mode for Splash Screens. We have only included both so that they're ready when Expo finally does support this.

In the meantime, you're free to adjust `splash.png` to influce what asset appears.

In order to change it, you can simply replace the existing file with your own `splash.png`.

To find out more about the Splash Screen image size and other details, please see the [Expo Splash Screen Guide](https://docs.expo.io/guides/splash-screens/).

#### Futher Configuration

To resize the Splash Screen image and change its background color, first open `frontend/app.json` and locate the `"splash"` field within it.

As illustrated by the excerpt below, there are multiple fields that can be used to further adjust the Splash Screen:

```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#FFFFFF"
},
```

**image**

The `image` field is fairly self-explanatory - it allows you to adjust what path will be used to locate the Splash Screen image.

**resizeMode**

The `resizeMode` field allows you to manage how the Splash Screen image will be resized to maintain its aspect ratio:

- `contain` - Resize the image to make sure the whole image is visible. This is the default setting.
- `cover` - Resize the image to cover the entire container (in this case the whole screen) by either stretching or cropping the image as needed.

Further details of how `contain` and `cover` behave are covered in the previously mentioned [Expo Splash Screen guide](https://docs.expo.io/guides/splash-screens/). For an even more detailed explanation, you can read [this post](http://blog.vjeux.com/2013/image/css-container-and-cover.html).

**backgroundColor**

The `backgroundColor` field enables you to specify the color of the background behind the Splash Screen image. Removing this value will result in usage of the default value, which is a white background color.

### Customizing the App Icon

Customizing the App Icon in Lexicon is nearly the same process as customizing the Splash Screen.

The image asset for the Mobile App's icon is located at `frontend/assets/icon.png`. To customize it, simply overwrite that file with your own `icon.png`.

## Further Customization

We get into more detail about how to white label your app in the [White Labeling](../white-labeling) section of the documentation.

In particular, this includes customizing and extending the theme's color palette, icons, and even fonts.

Should you wish to customize anything not covered in that section, get in touch with us, and we'll see how we can help you make it a reality.

## Awesome Work

Your app looks cool now 😎. However, it's only accessible to you.

Next, we'll cover how you can actually [build your app](building), so you can share it with the world.
