import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { Button, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const HeaderRight = () => {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return (
      <View style={{ flexDirection: "row", marginRight: 10, gap: 10 }}>
        <Button title="Login" onPress={() => router.push("/login")} />
        <Button title="Signup" onPress={() => router.push("/signup")} />
      </View>
    );
  }

  return (
    <Ionicons
      name="person-circle-outline"
      size={32}
      color="#007bff"
      style={{ marginRight: 10 }}
      onPress={() => router.push("/modal")}
    />
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "AI Quiz Generator",
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) =>
            <Ionicons name="home-outline" size={22} color={color} />
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) =>
            <Ionicons name="time-outline" size={22} color={color} />
        }}
      />
    </Tabs>
  );
}
