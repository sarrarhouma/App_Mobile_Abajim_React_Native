import React, { useEffect,useState, useCallback  } from "react";
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
import { useNavigation, useFocusEffect  } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetingsByLevel,  addToCart, removeFromCart, fetchCart } from "../reducers/auth/AuthAction";
import BottomNavigation from "../components/BottomNavigation";
import CartIcon from "../components/CartIcon";
import NotificationIcon from "../components/NotificationIcon";
import FavoriteIcon from "../components/FavoriteIcon";
const badgeColors = {
  "العربية": "#FF9800",
  "الرياضيات": "#4CAF50",
  "الإيقاظ العلمي": "#03A9F4",
  "الفرنسية": "#673AB7",
  "المواد الاجتماعية": "#795548",
  "الإنجليزية": "#3F51B5",
};

const getBadgeColor = (materialName) => {
  return badgeColors[materialName] || "#0097A7";
};

const getInitials = (fullName) => {
  if (!fullName) return "؟";
  const names = fullName.trim().split(" ");
  return names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : names[0].slice(0, 2).toUpperCase();
};

const LiveSessionsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const children = useSelector((state) => state.auth.children);
  const activeChild = useSelector((state) => state.auth.activeChild) || children[0];
  const { meetings, loadingMeetings, cartItems } = useSelector((state) => state.auth);
  const [expanded, setExpanded] = useState(null);
  // const cartItems = useSelector((state) => state.auth.cartItems);

  const isInCart = (meetingId) => {
    return cartItems?.some((item) => item.meeting_id === meetingId);
  };  
  useEffect(() => {
    if (activeChild?.level_id) {
      dispatch(fetchMeetingsByLevel(activeChild.level_id));
    }
  }, [activeChild, dispatch]);
  useFocusEffect(
    useCallback(() => {
        // Reset the flag whenever this screen is focused
        dispatch({ type: "RESET_RESERVATION_SUCCESS" });
    }, [dispatch])
);
  return (
    <View style={styles.container}>
      {loadingMeetings ? (
        <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />
      ) : (
        <FlatList
          data={meetings}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.webinarsList}
          ListHeaderComponent={
            <View style={styles.header}>
                  <View style={styles.headerBottom}>        
                    <Text style={styles.title}>الدروس المباشرة</Text>
                    <View style={styles.headerIcons}>
                    <CartIcon onPress={() => navigation.navigate("CartScreen")} />
                    <FavoriteIcon onPress={() =>  navigation.navigate("Settings", { screen: "Favorites" })} />
                    <NotificationIcon onPress={() => navigation.navigate("Settings", { screen: "Notifications" })} />

                    </View>
                  </View>
                </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("MeetingsDetails", { meetingId: item.id })}

            >
             <View style={styles.webinarCard}>
             <View style={styles.row}>
             <View style={styles.materialBadgeContainer}>
                          {item.times[0]?.material && (
                            <View style={[styles.badge, { backgroundColor: getBadgeColor(item.times[0].material.name) }]}>
                              <Text style={styles.badgeText}>{item.times[0].material.name}</Text>
                            </View>
                          )}
                        </View>
                  <View style={styles.avatarWrapper}>
                      {item.teacher?.avatar ? (
                          <Image
                              source={{ uri: `https://www.abajim.com/${item.teacher.avatar}` }}
                              style={styles.teacherAvatar}
                          />
                      ) : (
                          <View style={styles.initialsCircle}>
                              <Text style={styles.initialsText}>{getInitials(item.teacher?.full_name)}</Text>
                          </View>
                      )}
                  </View>

                  <View style={styles.teacherInfo}>
                      <Text style={styles.teacherName}>{item.teacher?.full_name || "غير متوفر"}</Text>
                                    
                      </View>
                    </View>

                    <View style={styles.sessionHeader}>
                      <Ionicons name="calendar" size={20} color="#0097A7" />
                      <Text style={styles.webinarTitle}>
                        {item.group_meeting ? "لقاء جماعي" : "لقاء فردي"} - عدد الجلسات: {item.times.length}
                      </Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <Ionicons name="cash-outline" size={20} color="#4CAF50" />
                      <Text style={styles.detailText}>السعر: {item.amount} د.ت</Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <Ionicons name="pricetag-outline" size={20} color="#FF9800" />
                      <Text style={styles.detailText}>
                        التخفيض: {item.discount ? `${item.discount}%` : "لا يوجد"}
                      </Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.accordionHeader}
                      onPress={() => setExpanded(expanded === item.id ? null : item.id)}
                  >
                      <Text style={styles.accordionTitle}>
                          📋 تفاصيل الجلسات 
                      </Text>
                      <Ionicons name={expanded === item.id ? "chevron-up" : "chevron-down"} size={24} color="#0097A7" />
                  </TouchableOpacity>

                        {expanded === item.id && (
                            <ScrollView style={styles.sessionContainer}>
                                {item.times.map((time, index) => (
                                    <View key={index} style={styles.sessionCard}>
                                        <Text style={styles.sessionText}>اليوم : {time.day_label}</Text>
                                        <Text style={styles.sessionText}>المادة الفرعية : {time.submaterial?.name || "غير متوفر"}</Text>
                                        <Text style={styles.sessionText}>التاريخ : {new Date(time.meet_date * 1000).toLocaleDateString()}</Text>
                                        <Text style={styles.sessionText}>من : {new Date(time.start_time * 1000).toLocaleTimeString()}</Text>
                                        <Text style={styles.sessionText}>إلى : {new Date(time.end_time * 1000).toLocaleTimeString()}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                  </View>
                  {/* <TouchableOpacity
                  style={[
                    styles.cartButtonBottom,
                    { backgroundColor: isInCart(item.id) ? "#818894" : "#1f3b64" },
                  ]}
                  onPress={async () => {
                    console.log("clicked", item.id);
                    const token = await AsyncStorage.getItem("token"); // ✅ token parent
                    if (!token) {
                      console.warn("❌ Token parent manquant");
                      return;
                    }

                    const itemInCart = cartItems?.find((i) => i.meeting_id === item.id);
                    if (itemInCart) {
                      dispatch(removeFromCart(itemInCart.id)).then(() => dispatch(fetchCart()));
                    } else {
                      dispatch(addToCart({ meeting_id: item.id })).then(() => dispatch(fetchCart()));
                    }
                  }}
                >
                  <Ionicons name="cart" size={16} color="#fff" style={{ marginLeft: 5 }} />
                  <Text style={styles.cartButtonText}>
                    {isInCart(item.id) ? "إزالة من السلة" : "أضف إلى السلة"}
                  </Text>
                </TouchableOpacity> */}

            </TouchableOpacity>
          )}
        />
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
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 15,
  },
  headerIcons: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#FFF", 
    textAlign: "right",
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
    width: 120, 
    height: 120, 
    borderRadius: 60, 
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
  materialBadgeContainer: {
    alignSelf: "flex-start",
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
    borderColor: "#FFD700", 
    backgroundImage: 'linear-gradient(45deg, #FF9800, #FFD700)', 
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
    marginTop: 5,
  },
  detailText: { 
    fontSize: 14, 
    color: "#555", 
    textAlign: "right", 
    marginRight: 5 
  },
  accordionHeader: { 
    flexDirection: "row-reverse", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 10 
},
accordionTitle: { 
    textAlign: "right", 
    flex: 1 , 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#1f3b64" 
},
sessionContainer: { 
    marginTop: 10, 
    paddingHorizontal: 10 
},
sessionCard: { 
    backgroundColor: "#E0F7FA", 
    padding: 10, 
    borderRadius: 15, 
    marginBottom: 10 
},
sessionText: { 
    fontSize: 14, 
    color: "#333", 
    textAlign: "right" 
},
addToCartButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#6490ab",
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 10,
  alignSelf: "flex-start",
  marginTop: 8
},
addToCartText: {
  color: "#fff",
  fontWeight: "bold",
  marginLeft: 8
},
cartButtonBottom: {
  flexDirection: 'row-reverse',
  alignItems: 'center',
  paddingVertical: 15,
  paddingHorizontal: 50,
  borderRadius: 25,
  backgroundColor: '#1f3b64',
  alignSelf: 'center',
  marginTop: 12,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
cartButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},

});

export default LiveSessionsScreen;
