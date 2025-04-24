import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetingById, reserveMeeting, cancelReservation, addToCart } from "../reducers/auth/AuthAction";

const getInitials = (fullName) => {
  if (!fullName) return "?";
  const names = fullName.trim().split(" ");
  return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : names[0].slice(0, 2).toUpperCase();
};

const MeetingsDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const meetingId = route.params?.meetingId;
  const isReserved = route.params?.isReserved || false;
  const reservationId = route.params?.reservationId;

  const {
    loading,
    reservationSuccess,
    error,
    meeting,
    cancelLoading,
    cancelError,
    cancelSuccess
  } = useSelector((state) => state.auth);

  const [expanded, setExpanded] = useState(false);
  const [localMeeting, setLocalMeeting] = useState(null);

  useFocusEffect(
    useCallback(() => {
      dispatch({ type: "RESET_RESERVATION_SUCCESS" });
    }, [dispatch])
  );

  useEffect(() => {
    if (meetingId) {
      dispatch(fetchMeetingById(meetingId));
    }
  }, [meetingId, dispatch]);

  useEffect(() => {
    if (meeting) setLocalMeeting(meeting);
  }, [meeting]);

  useEffect(() => {
    const handlePostReservation = async () => {
      try {
        const tokenParent = await AsyncStorage.getItem("token");
        const reserveMeetingId = meeting?.id;
        if (!tokenParent || !reserveMeetingId) return;

        const payload = { reserve_meeting_id: reserveMeetingId };
        dispatch(addToCart(payload));
        navigation.navigate("CartScreen");
      } catch (error) {
        console.error("❌ Erreur post-réservation :", error);
      }
    };

    if (reservationSuccess) {
      Alert.alert("نجاح", "تمت عملية الحجز بنجاح !");
      handlePostReservation();
    }
  }, [reservationSuccess]);

  useEffect(() => {
    if (cancelSuccess) {
      Alert.alert("Succès", "La réservation a été annulée avec succès");
      navigation.goBack();
    }
  }, [cancelSuccess]);

  useEffect(() => {
    if (cancelError) {
      Alert.alert("Erreur", cancelError);
    }
  }, [cancelError]);

  const handleReservation = async () => {
    try {
      const token = await AsyncStorage.getItem("tokenChild");
      if (!token) return Alert.alert("Erreur", "Aucun utilisateur trouvé.");

      const meetingToUse = localMeeting || meeting;
      if (!meetingToUse || !meetingToUse.times?.length) return Alert.alert("Erreur", "Aucun horaire disponible pour ce meeting.");

      const selectedTime = meetingToUse.times[0];
      const activeChildId = await AsyncStorage.getItem("activeChildId");
      if (!activeChildId) return Alert.alert("Erreur", "Aucun enfant sélectionné.");

      const meetingData = {
        meeting_id: meetingToUse.id,
        user_id: parseInt(activeChildId),
        meeting_time_id: selectedTime.id,
        day: selectedTime.day_label,
        date: new Date(selectedTime.meet_date * 1000).toISOString().split("T")[0],
        start_at: new Date(selectedTime.start_time * 1000).toLocaleTimeString("en-US", { hour12: false }),
        end_at: new Date(selectedTime.end_time * 1000).toLocaleTimeString("en-US", { hour12: false }),
        student_count: 1,
        paid_amount: meetingToUse.amount || 30,
        meeting_type: meetingToUse.group_meeting ? "group" : "individual",
        discount: meetingToUse.discount || 0,
        link: "",
        password: "",
        description: "Réservation depuis l'application",
        status: "reserved",
        created_at: new Date().toISOString(),
        reserved_at: new Date().toISOString(),
        locked_at: null
      };

      dispatch(reserveMeeting(meetingData, token));
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la réservation.");
    }
  };

  const handleDeclineReservation = async () => {
    Alert.alert("تأكيد الإلغاء", "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تأكيد",
        onPress: async () => {
          const token = await AsyncStorage.getItem("tokenChild");
          if (!token || !reservationId) return Alert.alert("Erreur", "معرف الحجز غير متوفر.");
          dispatch(cancelReservation(reservationId, token));
        }
      }
    ]);
  };

  const meetingToRender = localMeeting || meeting;

    if (loading) return <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />;
    if (error && !meetingToRender) return <Text style={styles.errorText}>Erreur: {error}</Text>;
    if (!meetingToRender) return <Text style={styles.errorText}>Aucun meeting trouvé.</Text>;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
                    <Ionicons name="arrow-back" size={30} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>تفاصيل الدرس المباشر</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sessionTextAboveAvatar}> درس مباشر مع المعلم(ة) </Text>
                
                <View style={styles.teacherInfo}>
                    {meetingToRender.teacher?.avatar ? (
                        <Image source={{ uri: `https://www.abajim.com/${meetingToRender.teacher.avatar}` }} style={styles.avatar} />
                    ) : (
                        <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>{getInitials(meetingToRender.teacher?.full_name)}</Text>
                        </View>
                    )}
                    <Text style={styles.teacherName}>{meetingToRender.teacher?.full_name || "غير متوفر"}</Text>
                </View>

                <Text style={styles.description}>📝 المادة : {meetingToRender?.times[0]?.material?.name || "غير متوفر"}</Text>
                <Text style={styles.description}>💰 السعر : {meetingToRender.amount} د.ت</Text>
                <Text style={styles.description}>🎟 التخفيض : {meetingToRender.discount ? `${meetingToRender.discount}%` : "لا يوجد"}</Text>
                <Text style={styles.description}>📅 نوع الحصة : {meetingToRender.group_meeting ? "جماعية" : "فردية"}</Text>

                <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.accordionTitle}>
                        📋 تفاصيل الجلسات ({Array.isArray(meetingToRender.times) ? meetingToRender.times.filter(time => time && time.id).length : 0})
                    </Text>
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#0097A7" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.sessionContainer}>
                        {meetingToRender.times.map((time, index) => (
                            <View key={index} style={styles.sessionCard}>
                                <Text style={styles.sessionText}>اليوم : {time.day_label}</Text>
                                <Text style={styles.sessionText}>التاريخ : {new Date(time.meet_date * 1000).toLocaleDateString()}</Text>
                                <Text style={styles.sessionText}>من : {new Date(time.start_time * 1000).toLocaleTimeString()}</Text>
                                <Text style={styles.sessionText}>إلى : {new Date(time.end_time * 1000).toLocaleTimeString()}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {isReserved ? (
                <TouchableOpacity style={styles.declineButton} onPress={handleDeclineReservation} disabled={loading}>
                    <Text style={styles.declineButtonText}>
                        {loading ? "جاري الإلغاء..." : "إلغاء الحجز"}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.bookButton} onPress={handleReservation} disabled={loading}>
                    <Text style={styles.bookButtonText}>
                        {loading ? "Réservation en cours..." : "إحجز الحصة"}
                    </Text>
                </TouchableOpacity>
            )}

            {meetingToRender?.isReserved && (
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancelReservation}
                    disabled={cancelLoading}
                >
                    <Text style={styles.buttonText}>
                        {cancelLoading ? 'Annulation en cours...' : 'Annuler la réservation'}
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 50 },
    header: {
        backgroundColor: "#0097A7",
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: "row",
        alignItems: "center",
    },
    goBack: { marginRight: 15 },
    headerTitle: { fontSize: 22, color: "#FFF", fontWeight: "bold", textAlign: "center", flex: 1 },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 30,
        padding: 25,
        margin: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    teacherInfo: { alignItems: "center", marginBottom: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
    initialsCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#0097A7", justifyContent: "center", alignItems: "center", marginBottom: 15 },
    initialsText: { color: "#FFF", fontSize: 40, fontWeight: "bold" },
    teacherName: { fontSize: 24, fontWeight: "bold", color: "#0097A7" },
    description: { fontSize: 16, color: "#555", marginBottom: 10, textAlign: "right" },
    accordionHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
    accordionTitle: { textAlign: "right", fontSize: 18, fontWeight: "bold", color: "#1f3b64" },
    sessionContainer: { marginTop: 10 },
    sessionCard: { backgroundColor: "#E0F7FA", padding: 10, borderRadius: 15, marginBottom: 10 },
    sessionText: { fontSize: 14, color: "#333", textAlign: "right" },
    sessionTextAboveAvatar: { textAlign: "center", marginBottom: 10, fontSize: 18, color: "#1f3b64" , fontWeight: "bold"},
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red", textAlign: "center", margin: 20, fontSize: 16 },
    bookButton: { 
        backgroundColor: "#1f3b64", 
        paddingVertical: 15, 
        alignItems: "center", 
        borderRadius: 30, 
        marginHorizontal: 20, 
        marginVertical: 20 
    },
    bookButtonText: { 
        color: "#FFF", 
        fontSize: 18, 
        fontWeight: "bold" 
    },
    declineButton: { 
        backgroundColor: "#D32F2F", 
        paddingVertical: 15, 
        alignItems: "center", 
        borderRadius: 30, 
        marginHorizontal: 20, 
        marginVertical: 20 
    },
    declineButtonText: { 
        color: "#FFF", 
        fontSize: 18, 
        fontWeight: "bold" 
    },
    button: {
        backgroundColor: '#ff4444',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 30,
        marginHorizontal: 20,
        marginVertical: 20
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    cancelButton: {
        backgroundColor: '#ff4444',
        marginTop: 10
    }
});

export default MeetingsDetailsScreen; 