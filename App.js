// 1. New: import required for touch handling
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen
            name="Start"
            component={Start}
            options={{ headerShown: false }} // Hides the top bar on the start screen
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
}

export default App;