import {  useState ,useEffect } from 'react'; // add useState in imports
import {  GiftedChat } from 'react-native-gifted-chat'; // NEW IMPORT ADDED HERE
import { StyleSheet, View } from 'react-native'; // Get rid of Text cause GiftedChat will handle Text now


const Chat = ({ route, navigation }) => {
  // GET both name and color from the route parameters
  const { name, color} = route.params; // Now you can use the 'name' variable in your component.

  // State to hold the messages
  const [messages, setMessages] = useState([]);

  // This function is called when the user sends a message
  const onSend = (newMessages = []) => {
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  useEffect(() => {
    // Set the navigation header title to the user's name
    navigation.setOptions({ title: name});

    // Set an intial static message
    setMessages([
      {
        _id: 1,
        text: `Hello, ${name}!`, // Personalize the welcome msg
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []); // The empty array [] means this runs only once.

  return (
    // APPLY the selected background color to the main container
    <View style={[styles.container, {backgroundColor: color}]}>
      {/*<Text>Hello {name}!</Text> */}
      <GiftedChat
      messages={messages}
      onSend={onSend} // <-- simplified version.
      user={{
        _id:1,
      }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center', // No longer needed used to house the old "Hello" Text.
    //alignItems: 'center'
  }
});

export default Chat;
