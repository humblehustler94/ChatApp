// 1. New: import required for touch handling
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// ---------------------------------
// 2. Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// ---------------------------------
// 3. Import the keys from the .env file
// (Make sure you configured the babel.config.js as discussed previously)
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID
} from "@env";
// --------------------------------
// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // 4. Create the config object using the secure keys
  const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
  };

  // 5. Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firebase and get a reference to the service
  const db = getFirestore(app);
  // --------------------------------

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen
            name="Start"
            component={Start}
            options={{ headerShown: false }} // Hides the top bar on the start screen
          />
          {/* 6. Update the Chat screen to pass the 'db' prop */}
          <Stack.Screen
            name="Chat">
            {props => <Chat db={db} {...props} />}

          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
}

export default App;