// App.js
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';

// 1. IMPORT CONNECTION FROM YOUR NEW FILE
import { db, auth } from './firebaseConfig';

import Start from './components/Start';
import Chat from './components/Chat';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createNativeStackNavigator();

const App = () => {
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
            {/* Pass the db instance imported from the config file */}
            {props => <Chat db={db} {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;