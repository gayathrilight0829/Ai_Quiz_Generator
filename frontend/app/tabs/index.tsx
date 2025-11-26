import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [topic, setTopic] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Quiz Generator</Text>

      <TextInput
        placeholder="Enter topic"
        style={styles.input}
        value={topic}
        onChangeText={setTopic}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/quiz?topic=${topic}`)}
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8 },
  buttonText: { color: "white", textAlign: "center" },
});
