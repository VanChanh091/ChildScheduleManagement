import React, { useState, useRef } from "react";
import axios from "axios";
import { isSpeakingAsync, speak, stop } from "expo-speech";
import LottieView from "lottie-react-native";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import writingAnimation from "../../modal/loading.json";
import aiAnimation from "../../modal/ai.json";
import ChatBubble from "./components/ChatBubble";

const ChatBotAI = () => {
  const [chat, setChat] = useState([
    {
      role: "model",
      parts: [{ text: "Chào bạn, tôi có thể giúp gì cho bạn?" }],
    },
  ]);
  
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = "AIzaSyCMUOpzuLqEsMdw10LSptOJ88ABGE7-0k8";

  // Add a ref for FlatList
  const flatListRef = useRef();

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    // đóng bàn phím
    Keyboard.dismiss();

    // add user input to chat
    const updateChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    setChat(updateChat); // Update the chat state immediately
    setUserInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setLoading(true);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: updateChat,
        }
      );

      console.log("Gemini Pro Api res :", res.data);

      const modelResponse =
        res.data?.candidates?.[0]?.content?.parts[0]?.text || "";

      console.log(
        "Content of the first candidate:",
        res.data?.candidates?.[0]?.content
      );

      if (modelResponse) {
        const updateChatWithModel = [
          ...updateChat,
          {
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];
        setChat(updateChatWithModel);
        setUserInput(""); // Clear the input

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Error in Gemini Pro Api :", error);
      console.error("Error response :", error.response);
      setError(
        "An error occurred while fetching data. Please try again later."
      );
    } finally {
      setLoading(false);
      // Scroll to the bottom after adding a new message
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleSpeech = async (text) => {
    if (isSpeaking) {
      // if already speaking, stop the speech
      stop();
      setIsSpeaking(false); // Update the state when stopping
      setLoading(false);
    } else {
      // if not speaking, start the speech
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <ChatBubble
        role={item.role}
        text={item.parts[0].text}
        onSpeech={() => handleSpeech(item.parts[0].text)}
      />
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <LottieView
          source={aiAnimation}
          autoPlay
          loop
          style={styles.aiAnimation}
        />
        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
          Gemini Pro
        </Text>
      </View>

      <FlatList
        ref={flatListRef} // Set ref here
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      {loading && (
        <LottieView
          source={writingAnimation}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust for iOS and Android
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust vertical offset for iOS
      >
        <TextInput
          style={styles.input}
          placeholder="nhập nội dung ..."
          placeholderTextColor={"#ccc"}
          value={userInput}
          onChangeText={setUserInput}
          keyboardType="default"
          // mở bàn phím thì input nhảy trên bàn phím 10px khi ios
          keyboardVerticalOffset={10}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
          <Text style={styles.buttonText}>Gửi</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBotAI;

const styles = StyleSheet.create({
  chatContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0077cc",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },

  loadingAnimation: {
    width: 100,
    height: 30,
    marginTop: 5,
  },
  aiAnimation: {
    width: 150,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});