import React from "react";
import { View, StyleSheet } from "react-native";
import SubscriptionCard from "../components/SubscriptionCard";

const SubscriptionScreen = () => {
  return (
    <View style={styles.container}>
      <SubscriptionCard subscribe_id={3} amount={120} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
});

export default SubscriptionScreen;