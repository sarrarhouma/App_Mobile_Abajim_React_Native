import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useDispatch } from "react-redux";
import { checkout } from "../reducers/auth/AuthAction";

const SubscriptionCard = ({ subscribe_id = 3, amount = 120, onClose }) => {
  const dispatch = useDispatch();

  const handleSubscribe = () => {
    dispatch(checkout(subscribe_id, amount));
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* En-tête stylisée */}
        <View style={styles.headerContainer}>
          <Text style={styles.cardTitle}>🎓 اشترك الآن في عرض الكرتابة</Text>
          <Text style={styles.cardSubtitle}>كل ما يحتاجه طفلك للنجاح 📚</Text>
        </View>

        {/* Détails prix et offre */}
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>🪙 {amount} دينار / الشهر</Text>
          <Text style={styles.bonus}> وصول كامل للدروس + تمارين + دعم مباشر</Text>
        </View>

        {/* Bouton d'action */}
        <TouchableOpacity style={styles.btn} onPress={handleSubscribe}>
          <Text style={styles.btnText}>ابدأ الآن</Text>
        </TouchableOpacity>

        {/* Bouton de fermeture */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.85,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#1f90ab",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f3c88",
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
  detailsContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#009688",
  },
  bonus: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  btn: {
    backgroundColor: "#1f3c88",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 15,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f5f5f5",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f3c88",
  },
});

export default SubscriptionCard;
