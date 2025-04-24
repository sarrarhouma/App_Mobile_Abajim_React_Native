import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BottomNavigation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
       <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.navItem}>
        <Image source={require("../../assets/icons/user (4).png")} style={styles.navIcon} />
        <Text style={styles.navText}>الإعدادات</Text>
      </TouchableOpacity>
  

      <TouchableOpacity onPress={() => navigation.navigate("LiveSession")} style={styles.navItem}>
        <Image source={require("../../assets/icons/live-stream (4).png")} style={styles.navIcon} />
        <Text style={styles.navText}>الدروس المباشرة</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Webinars")} style={styles.navItem}>
        <Image source={require("../../assets/icons/study (1).png")} style={styles.navIcon} />
        <Text style={styles.navText}>الدروس الإضافية</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Books")} style={styles.navItem}>
        <Image source={require("../../assets/icons/books-stack-of-three.png")} style={styles.navIcon} />
        <Text style={styles.navText}>الكتب المدرسية</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 28,
    height: 28,
    marginBottom: 2,
  },
  navText: {
    fontSize: 11,
    color: "#1F3B64",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default BottomNavigation;
