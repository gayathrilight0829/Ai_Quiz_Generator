import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function Modal() {
  const { logOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await logOut();
          router.replace("/login");
        }}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  logoutBtn: { padding: 15, backgroundColor: "red", borderRadius: 8 },
  logoutText: { color: "white", textAlign: "center", fontSize: 18 }
});
