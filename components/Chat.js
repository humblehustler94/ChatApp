import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// --- NEW CODE START ---
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
// --- NEW CODE END ---

// 1. We modify the function signature to accept 'db' from props
const Chat = ({ db, route, navigation }) => {
  // Extract the "name" and "background" params passed from the Start screen.
  // ===========================================
  // 1. UPDATE: Destructive 'userID' from route.params
  const { name, background, userID } = route.params;

  // Initialize the messages state with an empty array
  const [messages, setMessages] = useState([]);

  // 2. This is the verification step to ensure 'db' is available
  useEffect(() => {
    if (db) {
      console.log("Chat.js: Database connection prop received!");
    } else {
      console.log("Chat.js: No database connection found.");
    }
  }, [db]);

  // useEffect to set the navigation title to the user's name once on mount.
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // useEffect to load the initial messages when the component mounts.
  useEffect(() => {
    // --- NEW FIREBASE LISTENER LOGIC ---
    
    // 1. Create the query (get messages ordered by time)
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    // 2. Listen for real-time updates
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          // Conversion: Firestore Timestamp -> JS Date
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    });

    // 3. Clean up listener when component unmounts
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  // Function called when a user sends a message.
  const onSend = (newMessages) => {
    // --- NEW FIREBASE SAVE LOGIC ---
    // Save the message to Firestore
    addDoc(collection(db, "messages"), newMessages[0]);
    // Note: We don't need to manually call setMessages here because
    // the onSnapshot listener in useEffect will see the new database item 
    // and update the list automatically!
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

  return (
    // Set the background color based on the prop passed
    <View style={[styles.container, { backgroundColor: background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90}
      >
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          onSend={onSend}
          // 2. UPDATE: Use the UserID and name passed from Start.js
          user={{
            _id: userID, // This matches the ID of the person "typing"
            name: name
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;