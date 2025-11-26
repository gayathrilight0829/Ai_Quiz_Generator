import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

// 👉 Define the history item structure
interface HistoryItem {
  topic: string;
  score: number;
  total: number;
  date: string;
}

// 👉 Full component
export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    fetch("https://ai-quiz-generator-dfb8.onrender.com/api/quiz/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
      })
      .catch(() => alert("Failed to load history"));
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quiz History</Text>

      {history.map((h, i) => {
        const percentage = Math.round((h.score / h.total) * 100);

        // 👉 Emoji + feedback logic
        let emoji = "🙂";
        let feedback = "Nice attempt!";

        if (percentage === 100) {
          emoji = "🏆";
          feedback = "Perfect Score!";
        } else if (percentage >= 80) {
          emoji = "😄";
          feedback = "Great job!";
        } else if (percentage >= 60) {
          emoji = "😊";
          feedback = "Good effort!";
        } else if (percentage >= 40) {
          emoji = "😐";
          feedback = "Keep practicing!";
        } else if (percentage >= 20) {
          emoji = "😕";
          feedback = "Needs improvement!";
        } else {
          emoji = "😣";
          feedback = "Try again!";
        }

        return (
          <View key={i} style={styles.card}>
            <Text style={styles.topic}>Topic: {h.topic}</Text>

            {/* Percentage + emoji */}
            <Text style={styles.score}>
              {percentage}% {emoji}
            </Text>

            {/* Feedback text */}
            <Text style={styles.feedback}>{feedback}</Text>

            {/* Date */}
            <Text style={styles.date}>
              {new Date(h.date).toLocaleString()}
            </Text>
          </View>
        );
      })}

      {history.length === 0 && (
        <Text style={styles.noData}>No history found.</Text>
      )}
    </ScrollView>
  );
}

// 👉 Styles
const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  topic: { fontSize: 18, fontWeight: "600" },

  // New score style
  score: { fontSize: 20, marginTop: 5, fontWeight: "bold" },

  // New feedback style
  feedback: {
    fontSize: 16,
    marginTop: 5,
    color: "#444",
    fontStyle: "italic",
  },

  date: { fontSize: 14, color: "#888", marginTop: 8 },
  noData: { fontSize: 16, marginTop: 50, textAlign: "center", color: "#555" },
});
