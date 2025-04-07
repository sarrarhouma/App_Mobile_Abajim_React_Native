import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { reserveMeeting } from "../reducers/auth/AuthAction";
const API_BASE_URL = "https://27ef-196-179-217-114.ngrok-free.app/api";

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
    
    const { loading, reservationSuccess, error, activeChild } = useSelector(state => state.auth);

    const [meeting, setMeeting] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`);
                const data = await response.json();

                console.log("📥 Meeting Data reçu : ", data);

                if (!response.ok || !data) {
                    throw new Error("Données du meeting introuvables ou incorrectes.");
                }
                setMeeting(data);
            } catch (err) {
                console.error("❌ Erreur lors de la récupération du meeting :", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (meetingId) fetchMeeting();
    }, [meetingId]);
    
    useEffect(() => {
        if (reservationSuccess) {
            Alert.alert("🎉 Réservation réussie !");
        }
        if (error) {
            Alert.alert("❌ Erreur lors de la réservation :", error);
        }
    }, [reservationSuccess, error]);
    
    const handleReservation = async () => {
        console.log("🟢 [Action] - Réservation demandée");
    
        const userId = await AsyncStorage.getItem("childId");
        const token = await AsyncStorage.getItem("tokenChild");
    
        if (!userId || !token) {
            console.log("🚨 [Erreur] - Aucun `childId` ou `tokenChild` trouvé");
            Alert.alert("Erreur", "Aucun utilisateur trouvé.");
            return;
        }
    
        const meetingData = {
            meeting_id: meeting.id,
            sale_id: meeting.sale_id,
            user_id: parseInt(userId),
            meeting_time_id: meeting.times[0].id,
            day: meeting.times[0].day_label,
            date: "2025-04-07", 
            start_at: "14:00:00",
            end_at: "15:00:00",
            student_count: 1,
            paid_amount: meeting.amount,
            meeting_type: meeting.group_meeting ? "group" : "individual",
            discount: meeting.discount || 0,
            link: "",
            password: "",
            description: "Réservation depuis l'application",
            status: "reserved"
        };
    
        dispatch(reserveMeeting(meetingData));
    };
    

    if (!meeting) return <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />;

    if (loading) return <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />;
    if (error) return <Text style={styles.errorText}>Erreur: {error}</Text>;
    if (!meeting) return <Text style={styles.errorText}>Aucun meeting trouvé.</Text>;

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
                    {meeting.teacher?.avatar ? (
                        <Image source={{ uri: `https://www.abajim.com/${meeting.teacher.avatar}` }} style={styles.avatar} />
                    ) : (
                        <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>{getInitials(meeting.teacher?.full_name)}</Text>
                        </View>
                    )}
                    <Text style={styles.teacherName}>{meeting.teacher?.full_name || "غير متوفر"}</Text>
                </View>

                <Text style={styles.description}>📝 المادة : {meeting?.times[0]?.material?.name || "غير متوفر"}</Text>
                <Text style={styles.description}>💰 السعر : {meeting.amount} د.ت</Text>
                <Text style={styles.description}>🎟 التخفيض : {meeting.discount ? `${meeting.discount}%` : "لا يوجد"}</Text>
                <Text style={styles.description}>📅 نوع الحصة : {meeting.group_meeting ? "جماعية" : "فردية"}</Text>

                <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.accordionTitle}>
                        📋 تفاصيل الجلسات ({Array.isArray(meeting.times) ? meeting.times.filter(time => time && time.id).length : 0})
                    </Text>
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#0097A7" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.sessionContainer}>
                        {meeting.times.map((time, index) => (
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

            <TouchableOpacity style={styles.bookButton} onPress={handleReservation} disabled={loading}>
                <Text style={styles.bookButtonText}>
                    {loading ? "Réservation en cours..." : "إحجز الحصة"}
                </Text>
            </TouchableOpacity>
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
    }
});

export default MeetingsDetailsScreen;
