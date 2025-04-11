import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservationsByUserId } from "../reducers/auth/AuthAction";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const badgeColors = {
  "العربية": "#FF9800",
  "الرياضيات": "#4CAF50",
  "الإيقاظ العلمي": "#03A9F4",
  "الفرنسية": "#673AB7",
  "المواد الاجتماعية": "#795548",
  "الإنجليزية": "#3F51B5",
};

const getBadgeColor = (materialName) => badgeColors[materialName] || "#0097A7";

const getInitials = (fullName) => {
  if (!fullName) return "؟";
  const names = fullName.trim().split(" ");
  return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : names[0].slice(0, 2).toUpperCase();
};

const ReservedMeetingsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { reservations, loadingReservations } = useSelector((state) => state.auth);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      const userId = await AsyncStorage.getItem("activeChildId");
      if (userId) {
        dispatch(fetchReservationsByUserId(userId));
      }
    };
    fetchReservations();
  }, [dispatch]);

  // Filter out invalid reservations (those with meeting: null)
  const validReservations = reservations ? reservations.filter(item => item && item.meeting) : [];

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderReservation = ({ item }) => {
    // Ensure times is at least an empty array
    const times = item.meeting.times || [];
    const isExpanded = expandedItems[item.id] || false;

    return (
      <View style={styles.webinarCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("MeetingsDetails", { 
            meetingId: item.meeting.id,
            isReserved: true,
            reservationId: item.id
          })}
          style={styles.cardContent}
        >
          <View style={styles.row}>
            {times.length > 0 && times[0]?.material && (
              <View style={[styles.badge, { backgroundColor: getBadgeColor(times[0].material.name) }]}>
                <Text style={styles.badgeText}>{times[0].material.name}</Text>
              </View>
            )}
            <View style={styles.avatarWrapper}>
              {item.meeting.teacher?.avatar ? (
                <Image
                  source={{ uri: `https://www.abajim.com/${item.meeting.teacher.avatar}` }}
                  style={styles.teacherAvatar}
                />
              ) : (
                <View style={styles.initialsCircle}>
                  <Text style={styles.initialsText}>{getInitials(item.meeting.teacher?.full_name)}</Text>
                </View>
              )}
            </View>

            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{item.meeting.teacher?.full_name || "غير متوفر"}</Text>
            </View>
          </View>

          <View style={styles.sessionHeader}>
            <Ionicons name="calendar" size={20} color="#0097A7" />
            <Text style={styles.webinarTitle}>
              {item.meeting.group_meeting ? "لقاء جماعي" : "لقاء فردي"} - عدد الجلسات: {times.length}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <Ionicons name="cash-outline" size={20} color="#4CAF50" />
            <Text style={styles.detailText}>السعر: {item.meeting.amount || 0} د.ت</Text>
          </View>

          <View style={styles.detailsRow}>
            <Ionicons name="pricetag-outline" size={20} color="#FF9800" />
            <Text style={styles.detailText}>
              التخفيض: {item.meeting.discount ? `${item.meeting.discount}%` : "لا يوجد"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.accordionHeader} 
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.accordionTitle}>
            📋 تفاصيل الجلسات ({times.length})
          </Text>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#0097A7" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sessionContainer}>
            {times.length > 0 ? (
              times.map((time, index) => (
                <View key={index} style={styles.sessionCard}>
                  <Text style={styles.sessionText}>اليوم : {time.day_label || "غير متوفر"}</Text>
                  <Text style={styles.sessionText}>المادة الفرعية : {time.submaterial?.name || "غير متوفر"}</Text>
                  <Text style={styles.sessionText}>التاريخ : {time.meet_date ? new Date(time.meet_date * 1000).toLocaleDateString() : "غير متوفر"}</Text>
                  <Text style={styles.sessionText}>من : {time.start_time ? new Date(time.start_time * 1000).toLocaleTimeString() : "غير متوفر"}</Text>
                  <Text style={styles.sessionText}>إلى : {time.end_time ? new Date(time.end_time * 1000).toLocaleTimeString() : "غير متوفر"}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.detailText}>لا توجد جلسات متاحة لهذا الاجتماع.</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
          <Ionicons name="arrow-back" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>الحصص المباشرة المحجوزة</Text>
      </View>

      {loadingReservations ? (
        <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />
      ) : validReservations.length > 0 ? (
        <FlatList
          data={validReservations}
          renderItem={renderReservation}
          keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
          contentContainerStyle={styles.webinarsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا توجد حصص محجوزة</Text>
        </View>
      )}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  header: {
    backgroundColor: "#0097A7",
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    position: "relative",
  },
  goBack: { position: "absolute", left: 20, top: 50 },
  title: { fontSize: 22, fontWeight: "bold", color: "#FFF", textAlign: "center" },
  webinarsList: { paddingBottom: 90 },
  webinarCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    // This is a wrapper for the clickable part of the card
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    marginLeft: 10,
  },
  teacherAvatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  initialsCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0097A7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  initialsText: { 
    color: "#FFF", 
    fontSize: 30, 
    fontWeight: "bold" 
  },
  teacherInfo: { 
    alignItems: "center",
    marginBottom: 15,
  },
  teacherName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#0097A7",
    textAlign: "center",
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#FF9800",
    alignSelf: "flex-start",
    transform: [{ rotate: "-7deg" }],
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginVertical: 10,
    marginLeft: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 2 },
    borderWidth: 1,
    borderColor: "#FFD700", // Bordure dorée pour un effet premium
  },
  badgeText: { 
    color: "#FFF", 
    fontWeight: "bold",
    fontSize: 14,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    transform: [{ rotate: "7deg" }],
  },
  webinarTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginVertical: 5, 
    textAlign: "right",
    marginRight: 5
  },
  detailsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 7,
  },
  detailText: { 
    fontSize: 14, 
    color: "#555", 
    textAlign: "right", 
    marginRight: 5 
  },
  sessionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  accordionTitle: { 
    textAlign: "right", 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#1f3b64" 
  },
  sessionContainer: { 
    marginTop: 10 
  },
  sessionCard: { 
    backgroundColor: "#E0F7FA", 
    padding: 10, 
    borderRadius: 15, 
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#0097A7",
  },
  sessionText: { 
    fontSize: 14, 
    color: "#333", 
    textAlign: "right",
    marginBottom: 5
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReservedMeetingsScreen; 