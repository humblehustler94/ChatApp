import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  // Extract params from navigation
  const { name, background } = route.params;

  // 1. Create the messages state
  const [messages, setMessages] = useState([]);

  // Set the title to the user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // 2. Load initial messages (User message + System message)
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
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // 3. onSend function to handle new messages
  const onSend = (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }

  // 4. Custom Bubble Styling (Optional/Advanced step from text)
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
  }
});

export default Chat;