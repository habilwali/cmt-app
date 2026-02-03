# OTRM TV App

This is a [**React Native TV**](https://github.com/react-native-tvos/react-native-tvos) project built for Android TV and Apple TV (tvOS).

The app uses `react-native-tvos` which is a maintained fork of React Native specifically designed for TV platforms with built-in support for remote control navigation.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your TV app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android TV or Apple TV app:

### Android TV

**Prerequisites:**
- Android Studio with Android TV emulator set up
- Create an Android TV AVD (Android Virtual Device) in Android Studio

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

**Note:** Make sure you have an Android TV emulator running or a physical Android TV device connected.

### Apple TV (tvOS)

For tvOS, you need to install CocoaPods dependencies first:

```sh
cd ios
bundle exec pod install
cd ..
```

Then run:

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

**Note:** For tvOS, you may need to select the tvOS scheme in Xcode. Open `ios/OTRMTvApp.xcworkspace` in Xcode and select the tvOS target.

If everything is set up correctly, you should see your app running in the Android TV Emulator, Apple TV Simulator, or your connected TV device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android TV**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **Apple TV**: Press <kbd>R</kbd> in tvOS Simulator.

## TV-Specific Features

This app is configured for TV platforms with:
- Remote control navigation support (ready for future implementation)
- TV-optimized UI (larger text, better contrast)
- Android TV manifest configuration
- Support for both Android TV and Apple TV (tvOS)

### Future Remote Navigation

When you're ready to add remote control navigation, you can use:
- `useTVEventHandler` hook from `react-native-tvos` for handling remote key presses
- Focus management libraries for spatial navigation
- TV-specific navigation libraries

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
