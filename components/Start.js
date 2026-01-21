import { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image // 1. Added Image to imports
} from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [background, setBackground] = useState('');

    const colors = [
        '#090C08',
        '#474056',
        '#8A95A5',
        '#B9C6AE'
    ];

    const signIn = () => {
        navigation.navigate('Chat', {
            name: name,
            background: background
        });
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background-image.png')}
                resizeMode="cover"
                style={styles.image}
            >
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >

                    <Text style={styles.title}>ChatApp</Text>

                    <View style={styles.box}>

                        {/* 2. Created a Wrapper View to hold Icon + Input side-by-side */}
                        <View style={styles.inputWrapper}>

                            {/* 3. The Icon Image (Using the PNG version for safety) */}
                            <Image
                                source={require('../assets/user-icon.png')}
                                style={styles.icon}
                            />

                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholder='Your Name'
                                placeholderTextColor='rgba(117, 112, 131, 0.5)'
                            />
                        </View>

                        <Text style={styles.text}>Choose Background Color:</Text>

                        <View style={styles.colorWrapper}>
                            {colors.map((color, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.color, {
                                        backgroundColor: color,
                                        borderWidth: background === color ? 2 : 0,
                                        borderColor: '#fff'
                                    }]}
                                    onPress={() => setBackground(color)}

                                    // 1. ACCESSIBILIRTY FOR COLOR BUBBLES 
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityHint="Lets you choose the background color for your chat screen."

                                    // We create a label based on the index so the reader says "Color choice 1", "Color choice 2", ect.

                                    accessibilityLabel="Color choice"
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={signIn}

                            // 2. ACCESSIBILITY FOR START BUTTON
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Start Chatting"
                            accessibilityHint="Navigates to the chat screen."
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 80,
        flex: 1,
    },
    box: {
        backgroundColor: 'white',
        width: '88%',
        height: '44%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 30,
        paddingVertical: 20,
    },
    // 4. New style for the Box holding the Icon and Input
    inputWrapper: {
        width: '88%',
        height: 50,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        flexDirection: 'row', // Places Icon and Text side by side
        alignItems: 'center',
        paddingLeft: 10,
        marginBottom: 10,
        opacity: 0.5, // Sets opacity for border and icon
    },
    // 5. Style for the Icon itself
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    // 6. Updated TextInput (Removed borders/width as the wrapper handles it)
    textInput: {
        flex: 1, // Takes remaining space
        fontSize: 16,
        fontWeight: '300',
        color: '#000000',
    },
    text: {
        fontSize: 16,
        fontWeight: '300',
        color: '#000000',
        alignSelf: 'flex-start', // Aligns text to the left
        marginLeft: '6%',
        opacity: 1, // Fixed: Opacity is 0-1, not 100
    },
    colorWrapper: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
    color: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    button: {
        backgroundColor: '#757083',
        width: '88%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    }
});

export default Start;