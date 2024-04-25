---
title: App Icon & Other Assets
---

The Lexicon Mobile App contains multiple assets that can be replaced in order to White Label it.

The assets that can be modified are as follows:

## App Logo

Used to show the app logo in the application, such as on the Login, Register, and 2FA Scenes.

The assets are located at `frontend/assets/images/logo.png` and `frontend/assets/images/logoDark.png`. The `logo.png` is used in light color scheme and `logoDark.png` is used in dark color scheme. To customize it, simply replace the existing file with your own `logo.png` and `logoDark.png`.

## Favicon

Used to show the app logo.

The asset is located at `frontend/assets/favicon.png`. To customize it, simply replace the existing file with your own `favicon.png`.

## Image Placeholder

Used to temporarily take an image place when it is loading.

The asset is located at `frontend/assets/images/imagePlaceholder.png`. To customize it, simply replace the existing file with your own `imagePlaceholder.png`.

## Icons

Used to display icons inside the application.

The assets are located in the `frontend/assets/icons` folder. If you want to add more or edit the remaining icons, you need to insert the icons to the `frontend/assets/icons/` folder and import them in `frontend/src/icons.ts`.

There are some standards applied to the icons, such as:

### Uniform Icon Size to Maintain Visual Consistency

The UI is designed around the default base dimensions of 28x28px for icons.

If you adjust this, you may need to modify other aspects of the theme or fonts in order to maintain a clean appearance.

Similarly, if you provide a new icon that does not conform to these dimensions, you may run into visual inconsistencies.

### SVG Icons have their Fill Color Controlled via `currentColor`

If you are adding a new icon that you expect to interact with theme's colors, ensure that its color is not hard-coded, and is instead set to `currentColor`.

If you are unfamiliar with this concept, take a look at the [MDN Specification on SVG color values](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color).
