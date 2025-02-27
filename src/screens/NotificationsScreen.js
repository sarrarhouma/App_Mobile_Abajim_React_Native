import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, I18nManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

// ✅ Dummy Notifications Data
const notifications = [
  { id: "1", text: "تم إنشاء درس جديد", time: "منذ 15 دقيقة", icon: require("../../assets/icons/bell.png") },
  { id: "2", text: "تم إنشاء درس جديد", time: "منذ 50 دقيقة", icon: require("../../assets/icons/bell.png") },
];

const NotificationsScreen = () => {
  const navigation = useNavigation(); // ✅ FIX: Navigation was not defined

  return (
    <View style={styles.container}>
      {/* ✅ Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>الإشعارات</Text>
      </View>

      {/* ✅ Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Image source={item.icon} style={styles.notificationIcon} />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationText}>{item.text}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />

      {/* ✅ Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  // ✅ Header Styling
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0097A7",
    paddingVertical: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 15, // ✅ Position Back Button Correctly
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  // ✅ Notification List Styling
  listContainer: { padding: 20 },
  notificationItem: { 
    flexDirection: "row-reverse", // ✅ Make items align RTL
    alignItems: "center", 
    marginBottom: 15, 
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  notificationIcon: { width: 40, height: 40, marginLeft: 10 },

  notificationTextContainer: { flex: 1, alignItems: "flex-end" },
  notificationText: { fontSize: 16, fontWeight: "bold", color: "#1F3B64", textAlign: "right" },
  notificationTime: { fontSize: 14, color: "#666", textAlign: "right" },

  bottomNav: { position: "absolute", bottom: 0, width: "100%" },
});

export default NotificationsScreen;
