import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

function InitialLoader() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

function RootStack() {
  const { isLoading } = useAuth();

  if (isLoading) return <InitialLoader />;

  return (
    <Stack>
      <Stack.Screen name="tabs" options={{ headerShown: false }} />

      <Stack.Screen
        name="login"
        options={{ presentation: "modal", headerShown: false }}
      />

      <Stack.Screen
        name="signup"
        options={{ presentation: "modal", headerShown: false }}
      />

      <Stack.Screen name="modal" options={{ presentation: "modal", title: "Settings" }} />

      <Stack.Screen name="quiz" options={{ title: "Start Quiz" }} />
      <Stack.Screen name="result" options={{ title: "Quiz Results" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
