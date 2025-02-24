import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BottomNavigation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("Books")}>
        <Image source={require("../../assets/icons/books2.png")} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Lessons")}>
        <Image source={require("../../assets/icons/lesson2.png")} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("LiveStream")}>
        <Image source={require("../../assets/icons/livestream.png")} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Image source={require("../../assets/icons/settings.png")} style={styles.navIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
});

export default BottomNavigation;
