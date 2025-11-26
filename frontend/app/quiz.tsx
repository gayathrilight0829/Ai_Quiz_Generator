import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}
export default function Quiz() {
  const { topic } = useLocalSearchParams();

  // ALL HOOKS MUST BE HERE (TOP)
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);   // ← FIXED (moved to top)

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch("https://ai-quiz-generator-dfb8.onrender.com/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty: "easy",
          numberOfQuestions: 5
        }),
      });

      const data = await res.json();

      console.log("Quiz API Response:", data);

      if (!data.quiz || data.quiz.length === 0) {
        alert("No quiz returned from API");
        setLoading(false);
        return;
      }

      setQuiz(data.quiz);
      setLoading(false);

    } catch (err) {
      alert("Failed to load quiz!");
      console.log(err);
      setLoading(false);
    }
  };

  // ---------------- UI LOADING ----------------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Generating Quiz for {topic}...</Text>
      </View>
    );
  }

  // ---------------- NO QUESTIONS ----------------
  if (!quiz.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18, color: "#333" }}>
          No questions received
        </Text>
      </View>
    );
  }

  const q = quiz[current];

  // ---------------- NEXT BUTTON ----------------
  const next = async () => {
  if (!selected) return alert("Please select an answer");

  const isCorrect = selected === q.answer;
  const finalScore = isCorrect ? score + 1 : score;

  // 📌 If last question → save history in backend
  if (current + 1 === quiz.length) {
    try {
      await fetch("https://ai-quiz-generator-dfb8.onrender.com/api/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: await AsyncStorage.getItem("token"), // user login token
          topic,
          score: finalScore,
          total: quiz.length
        })
      });
    } catch (e) {
      console.log("History save error:", e);
    }

    // Then navigate to results
    router.push(
      `/result?topic=${topic}&score=${finalScore}&total=${quiz.length}`
    );
    return;
  }

  // next-question logic
  setScore(finalScore);
  setSelected("");
  setCurrent(current + 1);
};

  // ---------------- MAIN UI ----------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.questionTitle}>
          Question {current + 1} / {quiz.length}
        </Text>

        <Text style={styles.question}>{q.question}</Text>

        {q.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelected(opt)}
            style={[
              styles.option,
              selected === opt && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected === opt && styles.optionTextSelected,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={next}>
          <Text style={styles.buttonText}>
            {current + 1 === quiz.length ? "Submit Quiz" : "Next Question"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f1f3f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  question: {
    fontSize: 17,
    marginBottom: 20,
    color: "#333",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
