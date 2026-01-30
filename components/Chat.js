import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- NEW: Import CustomActions component ---
import CustomActions from './CustomActions';

// --- FIX: Declare unsubMessages OUTSIDE the component entirely ---
// This ensures the reference is kept even when the component re-renders 
// due to connection changes, allowing proper cleanup of old listeners.
let unsubMessages;

const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  // --- NEW CACHING FUNCTIONS START ---

  // Save messages to local storage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Load messages from local storage
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || "[]";
    setMessages(JSON.parse(cachedMessages));
  }
  // --- NEW CACHING FUNCTIONS END ---

  // useEffect to set the navigation title to the user's name once on mount.
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // 3. UPDATED useEffect for logic switching (Online vs Offline)
  useEffect(() => {

    if (isConnected === true) {
      // If online, setup the firestore listener

      // Clean up old listener if it exists to prevent memory leaks
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            _id: doc.id, // --- FIX: Use _id for GiftedChat compatibility ---
            ...doc.data(),
            // Conversion: Firestore Timestamp -> JS Date
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        });

        // --- CACHE THE MESSAGES HERE ---
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      // If offline, load from local storage
      loadCachedMessages();
    }

    // Clean up listener when component unmounts
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]); // 4. Dependency ensures logic re-runs on signal change

  // UPDATE: Standardizing the message object before sending to Firestore
  const onSend = (newMessages) => {
    // When called from CustomActions, newMessages might be an object rather than an array
    // GiftedChat usually sends an array, but we check to handle both
    const messageToSend = Array.isArray(newMessages) ? newMessages[0] : newMessages;

    // Ensure all necessary fields are present for GiftedChat/Firestore compatibility
    addDoc(collection(db, "messages"), {
      ...messageToSend, 
      createdAt: new Date(),
      user: {
        _id: userID + name,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`
      }
    });
  }

  // Function to customize the chat bubble style.
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: "#000" },
          left: { backgroundColor: "#FFF" }
        }}
      />
    );
  }

  // --- UPDATED: Logic to keep the input toolbar visible even when offline ---
  const renderInputToolbar = (props) => {
    // By removing the "if(isConnected)" check, the toolbar remains on screen
    return <InputToolbar {...props} />;
  }

  // =================================================
  // NEW: Function to render the CustomActions button
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} onSend={onSend} {...props} />;
  };
  // ===============================================

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* --- NEW: RED CONNECTION BANNER --- */}
      {isConnected === false ? (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>Connection lost!</Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90}
      >
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={onSend}
          // UPDATE: Now points to the renderCustomActions function
          renderActions={renderCustomActions}

          // --- AVATAR SETTINGS ---
          showAvatarForEveryMessage={true}
          showUserAvatar={true}
          renderUsernameOnMessage={true}
          user={{
            _id: userID + name,
            name: name,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  // --- BANNER STYLES ---
  connectionBanner: {
    backgroundColor: '#C0392B', // A deep red color
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // This keeps it at the very top
    top: 0,
    zIndex: 1, // Ensure it says on top of the chat messages
  },
  connectionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  }
});

export default Chat;