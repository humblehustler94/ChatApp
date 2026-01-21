import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  // Extract the "name" and "background" params passed from the Start screen.
  const { name, background } = route.params;

  // Initialize the messages state with an empty array
  const [messages, setMessages] = useState([]);

  // useEffect to set the navigation title to the user's name once on mount.
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // useEffect to laod the initial messages when the component mounts.
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: 'You have entered the chat', // Updated: Matches the requirement text
        createdAt: new Date(),
        system: true, // This marks the message as a system notification
      },
    ]);
  }, []);

  // Function called when a user sends a message.
  const onSend = (newMessages = []) => {
    // Append the new message to the previous messages state.
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }

  // Function to customize the chat bubble style.
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    );
  }

  // Fix: We need to wrap GiftedChat inside KeyboardingAvoidingView.
  // This ensures the layout calculates correctly and the button isn't covered.

  return (
    // Set the background color based on the prop passed
    <View style={[styles.container, { backgroundColor: background }]}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90} // Adjusts for the header bar
      >
      <GiftedChat 
      messages={messages}
      renderBubble={renderBubble}
      onSend={onSend}
      user={{
        _id: 1 // This matches the ID of the person "typing"
      }}
      />
      </KeyboardAvoidingView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Important: Allows the view to expand to 100% of screen
    // Ensures the view expands to fill the screen.
  }
});

export default Chat;