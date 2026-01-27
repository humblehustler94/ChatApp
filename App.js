// App.js
import { use, useEffect } from 'react'; // 1. Import useEffect
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox, Alert } from 'react-native'; // 2. Add Alert to imports

// ===================================================
// 3. Import NetInfo and Firestore network functions
import { useNetInfo } from '@react-native-community/netinfo';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
// ===================================================

import { db, auth } from './firebaseConfig';
import Start from './components/Start';
import Chat from './components/Chat';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createNativeStackNavigator();

const App = () => {
  // =================================================
  // 4. Initialize the connection status hook
  const connectionStatus = useNetInfo();

  // 5. Logic to enable/disable Firestore network based on connectivity
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);
  // ================================================
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen
            name="Start"
            options={{ headerShown: false }}
          >
            {/* Pass the auth instance imported from the config file */}
            {props => <Start auth={auth} {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="Chat">
            {/* 6. Pass isConnected as a prop to the Chat component */}
            {/* Pass the db instance imported from the config file */}
            {props => (
              <Chat
                isConnected={connectionStatus.isConnected}
                db={db}
                {...props}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;