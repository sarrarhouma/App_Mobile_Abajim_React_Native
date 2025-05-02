import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, checkout } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

let Haptics;
try {
  Haptics = require("expo-haptics");
} catch (e) {
  console.warn("expo-haptics not installed.");
}

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { cartItems, isLoading, orderSuccess } = useSelector((state) => state.auth);
  const activeChild = useSelector((state) => state.auth.activeChild);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const LEVELS_MAP = {
    6: "الأولى ابتدائي",
    7: "الثانية ابتدائي",
    8: "الثالثة ابتدائي",
    9: "الرابعة ابتدائي",
    10: "الخامسة ابتدائي",
    11: "السّادسة ابتدائي",
  };

  useEffect(() => {
    dispatch(fetchCart());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [dispatch, fadeAnim]);

  const triggerHaptic = (style) => {
    if (Haptics) {
      try {
        Haptics.impactAsync(style);
      } catch (e) {}
    }
  };

  const handleRemove = (itemId) => {
    triggerHaptic(Haptics?.ImpactFeedbackStyle?.Medium);
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      triggerHaptic(Haptics?.NotificationFeedbackType?.Warning);
      return Alert.alert("📭 سلة التسوق فارغة", "يرجى إضافة عناصر قبل المتابعة للدفع.");
    }
    triggerHaptic(Haptics?.NotificationFeedbackType?.Success);
    dispatch(checkout());
  };

  const getInitials = (name) => {
    if (!name) return "؟";
    const names = name.trim().split(" ");
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : names[0].slice(0, 2).toUpperCase();
  };

  const renderItem = ({ item }) => {
    const webinar = item?.webinar;
    const meeting = item?.meeting;
    const content = webinar || meeting;
    const teacher = content?.teacher;

    const creatorLevel = item?.creator?.level_id
      ? LEVELS_MAP[item.creator.level_id] || `المستوى ${item.creator.level_id}`
      : activeChild?.level_name || LEVELS_MAP[activeChild?.level_id] || `المستوى ${activeChild?.level_id || "غير معروف"}`;

    if (!content) return null;

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <LinearGradient colors={["#ffffff", "#f8faff"]} style={styles.cardGradient}>
          <View style={styles.cardContent}>
            {content?.image_cover || content?.image ? (
              <Image
                source={{
                  uri: content?.image_cover
                    ? `https://www.abajim.com/${content.image_cover}`
                    : `https://www.abajim.com/${content.image}`,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="book" size={30} color="#6490ab" />
              </View>
            )}

            <View style={styles.details}>
              <Text style={styles.titleText} numberOfLines={1}>
                {content?.translations?.[0]?.title || content?.title || "درس مباشر"}
              </Text>

              <TouchableOpacity
                style={styles.teacherContainer}
                onPress={() => navigation.navigate("Teacher", { teacherId: teacher?.id })}
              >
                {teacher?.avatar ? (
                  <Image
                    source={{ uri: `https://www.abajim.com/${teacher.avatar}` }}
                    style={styles.teacherAvatar}
                  />
                ) : (
                  <View style={styles.initialsCircle}>
                    <Text style={styles.initialsText}>{getInitials(teacher?.full_name)}</Text>
                  </View>
                )}
                <Text style={styles.teacherName}>{teacher?.full_name || "معلم غير معروف"}</Text>
              </TouchableOpacity>

              <View style={styles.levelContainer}>
                <Ionicons name="school" size={14} color="#888" style={styles.levelIcon} />
                <Text style={styles.infoText}>{creatorLevel}</Text>
              </View>

              <Text style={styles.price}>
                {content?.price ? `${content?.price} د.ت` : "مجاني"}
              </Text>
            </View>

            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#ff4d4f" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 سلة التسوق </Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00BCD4" style={styles.loader} />
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item?.id?.toString?.() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>سلتك فارغة!</Text>
              <Text style={styles.emptySubText}>أضف بعض الدروس لتبدأ التعلّم</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.checkoutBtn, isLoading && styles.checkoutBtnDisabled]}
        onPress={handleCheckout}
        disabled={isLoading}
      >
        <LinearGradient colors={["#0097A7", "#0097A7"]} style={styles.checkoutGradient}>
          <Text style={styles.btnText}>{isLoading ? "جاري المعالجة..." : "💳 إتمام الدفع"}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {orderSuccess && (
        <Animated.View style={[styles.successContainer, { opacity: fadeAnim }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
          <Text style={styles.successText}>تم إتمام الدفع بنجاح!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 50, backgroundColor: "#0097A7", borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#fff", textAlign: "center", flex: 1 },
  card: { marginHorizontal: 16, marginVertical: 10, borderRadius: 16, overflow: "hidden", elevation: 3 },
  cardGradient: { padding: 14 },
  cardContent: { flexDirection: "row-reverse", alignItems: "center" },
  image: { width: 70, height: 70, borderRadius: 12, marginLeft: 12 },
  imagePlaceholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#e8eef4" },
  details: { flex: 1, paddingLeft: 8 },
  titleText: { fontSize: 17, fontWeight: "700", color: "#1F3B64", textAlign: "right" },
  teacherContainer: { flexDirection: "row-reverse", alignItems: "center", marginTop: 5 },
  teacherAvatar: { width: 28, height: 28, borderRadius: 14, marginLeft: 8 },
  initialsCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#0097A7", justifyContent: "center", alignItems: "center", marginLeft: 8 },
  initialsText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  teacherName: { fontSize: 14, color: "#0097A7", textDecorationLine: "underline" },
  levelContainer: { flexDirection: "row-reverse", alignItems: "center", marginTop: 6 },
  levelIcon: { marginLeft: 6 },
  infoText: { fontSize: 13, color: "#6b7280", textAlign: "right" },
  price: { fontSize: 15, fontWeight: "600", color: "#00BCD4", marginTop: 8, textAlign: "right" },
  removeButton: { padding: 8 },
  loader: { marginTop: 30 },
  listContent: { paddingBottom: 100, paddingTop: 12 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#6b7280", marginTop: 16 },
  emptySubText: { fontSize: 14, color: "#9ca3af", marginTop: 8 },
  checkoutBtn: { marginHorizontal: 20, marginVertical: 20, borderRadius: 16, overflow: "hidden", elevation: 4 },
  checkoutBtnDisabled: { opacity: 0.7 },
  checkoutGradient: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 17, letterSpacing: 0.5 },
  successContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 15 },
  successText: { marginLeft: 8, color: "#4caf50", fontWeight: "600", fontSize: 16 },
});
