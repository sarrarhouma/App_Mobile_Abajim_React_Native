import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, checkout } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { cartItems, isLoading, orderSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return Alert.alert("📭 سلة فارغة", "أضف عناصر قبل الدفع.");
    }
    dispatch(checkout());
  };

  const renderItem = ({ item }) => {
    const webinar = item?.webinar;
    const meeting = item?.meeting;

    if (!webinar && !meeting) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {webinar?.image_cover || meeting?.image ? (
            <Image
              source={{
                uri: webinar?.image_cover
                  ? `https://www.abajim.com/${webinar.image_cover}`
                  : `https://www.abajim.com/${meeting.image}`
              }}
              style={styles.image}
            />
          ) : (
            <View style={[styles.image, { justifyContent: "center", alignItems: "center" }]}> 
              <Text>📚</Text>
            </View>
          )}

          <View style={styles.details}>
            <Text style={styles.titleText}>
              {webinar?.slug || meeting?.title || "درس مباشر مضاف"}
            </Text>
            <Text style={styles.teacherText}>
              {webinar?.teacher?.full_name || meeting?.teacher?.full_name || "معلم غير معروف"}
            </Text>
            <Text style={styles.descText} numberOfLines={2}>
              {webinar?.description || meeting?.description || "لا يوجد وصف متاح."}
            </Text>
            <Text style={styles.price}>
              {webinar?.price || meeting?.price ? `${webinar?.price || meeting?.price} د.ت` : "مجاني"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => handleRemove(item.id)}>
            <Ionicons name="trash" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>السلة 🛒</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#6490ab" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item?.id?.toString?.() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        />
      )}

      <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={isLoading}>
        <Text style={styles.btnText}>{isLoading ? "جاري الدفع..." : "💳 الدفع الآن"}</Text>
      </TouchableOpacity>

      {orderSuccess && <Text style={styles.success}>✅ تم الدفع بنجاح!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f9fd" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 45,
    backgroundColor: "#0097A7",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },
  cardContent: {
    flexDirection: "row-reverse",
    alignItems: "center"
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: "#eee"
  },
  details: {
    flex: 1,
    paddingLeft: 6
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F3B64",
    textAlign: "right"
  },
  teacherText: {
    fontSize: 14,
    color: "#6490ab",
    marginTop: 2,
    textAlign: "right"
  },
  descText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textAlign: "right"
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0097A7",
    marginTop: 6,
    textAlign: "right"
  },
  checkoutBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#6490ab",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  success: {
    marginTop: 15,
    color: "green",
    fontWeight: "bold",
    textAlign: "center"
  }
});