// components/CustomActions.js
import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, userID }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      },
    );
  };

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) onSend({ image: result.assets[0].uri });
    }
  }

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) onSend({ image: result.assets[0].uri });
    }
  }


  const getLocation = async () => {
    console.log("getLocation triggered"); // Trace 1
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      console.log("Permissions granted, fetching position..."); // Trace 2

      // We add a try/catch to see if an error is happening silently
      try { // CHANGED: getCurrentPositionAsync to getLastKnownPositionAsync
        const location = await Location.getLastKnownPositionAsync({});
        console.log("Location received:", location); // Trace 3

        if (location) {
          onSend({
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          });
          console.log("onSend called for location"); // Trace 4
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error occurred while fetching location");
      }
    } else {
      Alert.alert("Permissions to read location aren't granted");
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center', // Centers the + sign
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16, // Adjusted for visibility
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;