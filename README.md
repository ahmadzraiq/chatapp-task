# ChatApp

## Overview

ChatApp is a real-time chat application built with React Native and Firebase. It features Firebase Authentication for user management and Firestore for real-time chat functionality. Users can sign up, log in, and send messages in real time.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v18 or later)

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. **Clone the Repository**

```bash
git clone https://github.com/ahmadzraiq/chatapp-task.git
cd chatapp-task
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Firebase**

Set up your Firebase project and add your Firebase configuration in `config/firebaseConfig.ts`. Here's an example:

```ts
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
```

4. **Run the Project**

- To start the app on iOS:

```bash
npm run ios
```

- To start the app on Android:

```bash
npm run android
```

## Features

- **Authentication**: Users can sign up and log in using Firebase Authentication.
- **Real-time Messaging**: Send and receive messages in real-time using Firebase Firestore.
- **Persistent Login**: Authentication state persists between sessions using AsyncStorage.
