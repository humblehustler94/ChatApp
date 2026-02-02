# ChatApp

A professional mobile chat application build with React Native and Expo. This app features real-time messaging, offline data persistence, and the ability to share images and locations.

## App Preview

*(Here, you can add a screenshot or, even better, a GIF of your app in action that you recorded)*

![A demo showing the user flow from the Start screen to the Chat screen.](assets/10%20-%20ChatApp%20ScreenRecording%20Final%20Task.gif)

![Screenshot of Start screen in ChatApp](assets/8%20-%20ChatApp%20Start%20View.png)

![Screenshot of Chat screen in ChatApp](assets/9%20-%20ChatApp%20Chat%20View.png)

![Screenshot of Chat in ChatApp](assets/20%20-%20ChatApp%20Chat%20screen%20view.png)

---
## Key Features

- **Start Screen:** A welcoming screen where users can configure their chat experience.
- **User Name Input:** Users can enter their name, which will be used to personalize the chat screen.
- **Customizable UI:** Users can choose from a selection of background colors for their chat screen.
- **Screen Navigation:** Seamless navigation between the Start screen and the Chat screen using React Navigation.
- **Dynamic Header:** The user's name is dynamically set as the title in the Chat screen's navigation header.
- **Personalized Chat Background:** The Chat screen's background color is set based on the user's selection from the Start screen.
- **Real-Time Messaging:** Powered by Google Firebase Firestore.
- **Media Sharing:** Send images from your device's library or take new photos with the camera.
- **Location Sharing:** Share your current GPS coordinates with a built-in map view.
- **Offline Support:** Messages are cached locally using AsyncStorage, allowing users to read conversations without an internet connection.
- **Customizabile UI:** Users can choose their display name and background color.
- **Accessibility:** Fully optimized for screen readers with accessibility labels and hints.

---
## Technologies Used

- **React Native:** A JavaScript framework for building native mobile apps.
- **Expo:** A platform and toolchain for universal React applications.
- **React Navigation:** A library for handling routing and navigation between screens.
- **JavaScript (ES6+)**
- **Node.js**
- **Framework:** React Native / Expo
- **Backend:** Google Firebase (Firestore & Cloud Storage)
- **Chat UI:** React Native Gifted Chat
- **Navigation:** React Navigation
- **Maps:** React Native Maps
- **Security:** react-native-dotenv for environment variable protections.
- **Offline Handling:** @react-native-community/netinfo & AsyncStorage

---

## Setup and Installation

To run this project locally, follow these steps:

### 1. Prerequisites
- **Node.js:** Version 18.x or 20.x (Recommended).
- **Expo:** Install the Expo Go app on your mobile device and Emulator.
- **Development Build:** Android Studio (for Android Emulator) or Xcode (for iOS Simulator).

### 2. Clone and Install
- git clone https://github.come/humblehustler94/ChatApp.git
- cd ChatApp
- npm install

### 3. Configuration (Environment Variables)
This goes into the .env file

API_KEY=your_api_key <br/>
AUTH_DOMAIN=your_project_id.firebaseapp.com <br/>
PROJECT_ID=your_project_id <br/>
STORAGE_BUCKET=your_project_id.firebasestorage.app <br/>
MESSAGING_SENDER_ID=your_messaging_id <br/>
APP_ID=your_app_id <br/>

### 4. Firebase Setup

1. Create a project in the [Firebase Console] (https://console.firebase.google.com).
2. Enable **Firestore Database** in Test Mode.
3. Enable **Firebase Storage** and set rules to allow read, write: if true; for development.
4. Enable **Anonymous Authentication** (or your preferred method).

### 5. Running the App

For standard developement:
- npx expo start
- npx expo start -c to clear the cache

**Important Note on Native Rebuilds:**
If you install a new library that changes the native "guts" of the app (like adding camera permissions or updating the Map library), you must rebuild the native folders:

- npx expo run:android
- npx expo run:ios

---

### Techincal Details
- **Security:** API keys are injected via app.config.js and managed through .env using react-native-dotenv. This ensures sensitive credentials are never hard-coded or commited to the version history.
- **Storage Logic:** Images are converted to Blobs using the fetch API and assigned a unique reference string (UserID + Timestamp) before being uploaded to Firebase Cloud Storage.
- **Connectivity:** The app uses a custom hook (useNetInfo) to detect network status. If dynamically enables/disables the Firestore network and triggers a local cache fetch whe the device is offline.

