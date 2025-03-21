import React, { useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, I18nManager, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../reducers/auth/AuthAction";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const activeChild = useSelector((state) => state.auth.activeChild);
  const notifications = useSelector((state) => state.auth.notifications);
  const loading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    if (activeChild?.id) {
      dispatch(fetchNotifications(activeChild.id));
    }
  }, [activeChild]);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Image source={require("../../assets/icons/notifications.png")} style={styles.notificationIcon} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationText}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {item.statuses?.length > 0 && item.statuses[0].seen_at ? "✅ مقروء" : "🟢 جديد"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>الإشعارات</Text>
      </View>

      {/* Loading / Empty */}
      {loading ? (
        <ActivityIndicator size="large" color="#0097A7" style={{ marginTop: 50 }} />
      ) : notifications?.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50, fontSize: 16 }}>لا توجد إشعارات حالياً.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      )}

      <View style={styles.bottomNav}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0097A7",
    paddingVertical: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 15 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "white" },
  listContainer: { padding: 20 },
  notificationItem: {
    flexDirection: "row-reverse",
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
