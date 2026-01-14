import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
  // Extract params from navigation
  const { name, background } = route.params;

  // Set the title to the user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    // Set the background color based on the prop passed
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={styles.text}>Welcome to the Chat!</Text>
      <Text style={styles.text}>You chose this background color.</Text>
      <Text style={styles.text}>Hello World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#FFF', // Assuming dark backgrounds, white text is safer
    fontSize: 20,
  }
});

export default Chat;