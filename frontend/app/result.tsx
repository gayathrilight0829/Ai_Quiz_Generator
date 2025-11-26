import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "./context/AuthContext";
export default function Result() {
  const { topic, score, total } = useLocalSearchParams();

  // TODO: replace with real login token later
  const { token } = useAuth(); // get real token


  useEffect(() => {
    // Save result to backend history
    fetch("https://ai-quiz-generator-dfb8.onrender.com/api/quiz/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        topic,
        score: Number(score),
        total: Number(total),
        date: new Date(),
      }),
    })
      .then(res => res.json())
      .then(() => console.log("History saved"))
      .catch(err => console.log("Failed to save history", err));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Quiz Completed! 🎉</Text>

        <Text style={styles.subtitle}>Topic: {topic}</Text>

        <Text style={styles.score}>
          Your Score: <Text style={styles.bold}>{score}</Text> / {total}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  score: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
    color: "#007bff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
