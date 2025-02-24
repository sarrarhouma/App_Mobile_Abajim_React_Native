import BottomNavigation from "../components/BottomNavigation";
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const LiveSessionScreen = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.authToken);

  useEffect(() => {
    if (!token) {
      navigation.replace("SignIn"); // Redirect user to login if not authenticated
    }
  }, [token, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!token ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text>🎥 Welcome to Live Sessions!</Text>
        )}
      </View>

      {/* ✅ Bottom Navigation (Always at the Bottom) */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take full height
    justifyContent: "space-between", // Ensures navigation stays at the bottom
  },
  content: {
    flex: 1, // Takes up remaining space above the bottom navigation
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LiveSessionScreen;
