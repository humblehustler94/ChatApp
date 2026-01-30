import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, Alert } from 'react-native'; // Added Alert to imports
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// --- NEW: Import ImagePicker ---
import * as ImagePicker from 'expo-image-picker';
// --- NEW: Import Location ---
import * as Location from 'expo-location';
// ===============================================

// --- FIX: Declare unsubMessages OUTSIDE the component entirely ---
// This ensures the reference is kept even when the component re-renders 
// due to connection changes, allowing proper cleanup of old listeners.
let unsubMessages;

const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);
  // ========================================
  // --- NEW: COMMUNICATION LOGIC START ---

  // Logic to pick an image from the library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        // Instead of setImage, we "send" the image message
        const imageUri = result.assets[0].uri;
        onSend([{ image: imageUri }]);
      }
    }
  }

  // Logic to take a new photo with the camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        onSend([{ image: imageUri }]);
      }
    }
  }

  // Logic to get the user's geolocation
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend([{
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        }]);
      }
    } else {
      Alert.alert("Permissions to read location aren't granted");
    }
  }

  // --- NEW: COMMUNICATION LOGIC END ---
  // ========================================

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
    const messageToSend = newMessages[0];

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
  // NEW: Placeholder for the "+" Action button
  // (In the next sub-topic, you will create a custom component for this)
  const renderActions = (props) => {
    // This is where you'll eventually place the custom "+" button component
    // For now, it stays as null until the next part of your course
    return null;
  }
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
          // UPDATE: Now points to the renderActions function
          renderActions={renderActions}

          // --- FIX: Hides the floating action button (hamburger icon) ---
          //renderActions={null} 

          // --- AVATAR SETTINGS ---
          showAvatarForEveryMessage={true}
          showUserAvatar={true}
          renderUsernameOnMessage={true}
          user={{
            _id: userID + name,
            name: name,
            // Uses your custom initials-based logic or placeholder
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