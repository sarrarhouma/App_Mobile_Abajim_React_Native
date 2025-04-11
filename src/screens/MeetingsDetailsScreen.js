import React, { useEffect, useState ,useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRoute, useNavigation, useFocusEffect  } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetingById, reserveMeeting, cancelReservation } from "../reducers/auth/AuthAction";

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
    
    // Get state from Redux
    const { loading, reservationSuccess, error, meeting, cancelLoading, cancelError, cancelSuccess } = useSelector(state => state.auth);
    const [expanded, setExpanded] = useState(false);
    const [localMeeting, setLocalMeeting] = useState(null);
    useFocusEffect(
        useCallback(() => {
            // Reset the flag whenever this screen is focused
            dispatch({ type: "RESET_RESERVATION_SUCCESS" });
        }, [dispatch])
    );
    // Fetch meeting details when component mounts
    useEffect(() => {
        if (meetingId) {
            console.log(`🔄 Fetching meeting with ID: ${meetingId}`);
            dispatch(fetchMeetingById(meetingId));
        } else {
            console.warn("⚠️ No meetingId provided in route params");
        }
    }, [meetingId, dispatch]);
    
    // Update local meeting state when Redux meeting changes
    useEffect(() => {
        if (meeting) {
            console.log("✅ Meeting data updated in Redux:", meeting);
            setLocalMeeting(meeting);
        } else {
            console.log("⚠️ Meeting data is null or undefined in Redux");
        }
    }, [meeting]);
    
    // Handle reservation success or error
    useEffect(() => {
        if (reservationSuccess) {
            Alert.alert("نجاح", "تمت عملية الحجز بنجاح !");
            navigation.goBack();
        }
        if (error) {
            Alert.alert("Erreur", error);
        }
    }, [reservationSuccess, error, navigation]);
    
    useEffect(() => {
        if (cancelSuccess) {
            Alert.alert('Succès', 'La réservation a été annulée avec succès');
            navigation.goBack();
        }
    }, [cancelSuccess, navigation]);

    useEffect(() => {
        if (cancelError) {
            Alert.alert('Erreur', cancelError);
        }
    }, [cancelError]);

    const handleReservation = async () => {
        console.log("🟢 [Action] - Réservation demandée");

        try {
            const token = await AsyncStorage.getItem("tokenChild");

            if (!token) {
                Alert.alert("Erreur", "Aucun utilisateur trouvé.");
                return;
            }

            console.log("🔑 [Token trouvé] :", token);

            // Use localMeeting instead of meeting from Redux
            const meetingToUse = localMeeting || meeting;
            
            if (!meetingToUse) {
                Alert.alert("Erreur", "Aucun meeting trouvé.");
                return;
            }

            // Log the meeting data for debugging
            console.log("📦 Meeting data:", JSON.stringify(meetingToUse, null, 2));

            // Check if we have the required meeting time
            if (!meetingToUse.times || !Array.isArray(meetingToUse.times) || meetingToUse.times.length === 0) {
                console.log("🚨 [Erreur] - Aucun horaire disponible pour ce meeting");
                Alert.alert("Erreur", "Aucun horaire disponible pour ce meeting.");
                return;
            }

            const selectedTime = meetingToUse.times[0];
            console.log("⏰ Selected time:", JSON.stringify(selectedTime, null, 2));

            // Get active child ID from AsyncStorage
            const activeChildId = await AsyncStorage.getItem("activeChildId");
            if (!activeChildId) {
                Alert.alert("Erreur", "Aucun enfant sélectionné.");
                return;
            }

            // Validate required fields
            if (!meetingToUse.id || !selectedTime.id) {
                console.log("🚨 [Erreur] - Données manquantes :", {
                    meeting_id: meetingToUse.id,
                    meeting_time_id: selectedTime.id
                });
                Alert.alert("Erreur", "Données manquantes pour effectuer la réservation.");
                return;
            }

            const meetingData = {
                meeting_id: meetingToUse.id,
                user_id: parseInt(activeChildId),
                meeting_time_id: selectedTime.id,
                day: selectedTime.day_label,
                date: selectedTime.meet_date ? new Date(selectedTime.meet_date * 1000).toISOString().split('T')[0] : "2025-04-07",
                start_at: selectedTime.start_time ? new Date(selectedTime.start_time * 1000).toLocaleTimeString('en-US', { hour12: false }) : "14:00:00",
                end_at: selectedTime.end_time ? new Date(selectedTime.end_time * 1000).toLocaleTimeString('en-US', { hour12: false }) : "15:00:00",
                student_count: 1,
                paid_amount: meetingToUse.amount || 30,
                meeting_type: meetingToUse.group_meeting ? "group" : "individual",
                discount: meetingToUse.discount || 10,
                link: "",
                password: "",
                description: "Réservation depuis l'application",
                status: "reserved",
                created_at: new Date().toISOString(),
                reserved_at: new Date().toISOString(),
                locked_at: null
            };

            console.log("📦 [Payload envoyé au Redux Action] :", JSON.stringify(meetingData, null, 2));
            
            // Dispatch the reservation action
            dispatch(reserveMeeting(meetingData, token));

        } catch (error) {
            console.log("🚨 [Erreur Fetch] :", error.message);
            Alert.alert("Erreur", "Une erreur est survenue lors de la réservation.");
        }
    };

    const handleDeclineReservation = async () => {
        Alert.alert(
            "تأكيد الإلغاء",
            "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
            [
                {
                    text: "إلغاء",
                    style: "cancel"
                },
                {
                    text: "تأكيد",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("tokenChild");
                            if (!token) {
                                Alert.alert("Erreur", "Aucun utilisateur trouvé.");
                                return;
                            }

                            if (!reservationId) {
                                Alert.alert("Erreur", "معرف الحجز غير متوفر.");
                                return;
                            }

                            console.log("🔑 [Token trouvé] :", token);
                            console.log("🆔 [Reservation ID] :", reservationId);

                            // Dispatch the cancel reservation action
                            dispatch(cancelReservation(reservationId, token));
                            
                            // Show success message and navigate back
                            Alert.alert("نجاح", "تم إلغاء الحجز بنجاح");
                            navigation.goBack();
                        } catch (error) {
                            console.log("🚨 [Erreur] :", error.message);
                            Alert.alert("Erreur", "Une erreur est survenue lors de l'annulation de la réservation.");
                        }
                    }
                }
            ]
        );
    };

    const handleCancelReservation = async () => {
        if (!localMeeting?.reservationId) {
            Alert.alert('Erreur', 'Impossible de trouver l\'identifiant de la réservation');
            return;
        }

        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir annuler cette réservation ?',
            [
                {
                    text: 'Non',
                    style: 'cancel'
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        dispatch(cancelReservation(localMeeting.reservationId));
                    }
                }
            ]
        );
    };

    // Use localMeeting for rendering if available, otherwise use meeting from Redux
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