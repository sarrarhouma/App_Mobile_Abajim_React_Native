import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";

const MyCardScreen = () => {
  const navigation = useNavigation();

  const [cardNumber, setCardNumber] = useState("XXXX XXXX XXXX 8790");
  const [cardHolder, setCardHolder] = useState("PUAH MIHIN");
  const [expiryDate, setExpiryDate] = useState("09 / 26");
  const [cvv, setCvv] = useState("***");
  const [saveCard, setSaveCard] = useState(true);

  return (
    <View style={styles.container}>
      {/* ✅ Header avec retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>بطاقتي</Text>
      </View>

      {/* ✅ Image de la carte */}
      <View style={styles.cardContainer}>
        <Image source={require("../../assets/images/card.png")} style={styles.cardImage} />
      </View>

      {/* ✅ Informations de la carte */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>اسم حامل البطاقة</Text>
        <TextInput
          style={styles.input}
          value={cardHolder}
          onChangeText={setCardHolder}
          textAlign="right"
        />

        <Text style={styles.label}>رقم البطاقة</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          textAlign="right"
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>تاريخ الصلاحية</Text>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={setExpiryDate}
              textAlign="right"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              secureTextEntry
              textAlign="right"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* ✅ Option pour sauvegarder la carte */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>حفظ هذه البطاقة</Text>
          <Switch value={saveCard} onValueChange={setSaveCard} />
        </View>
      </View>

      {/* ✅ Navigation inférieure */}
      <View style={styles.bottomNav}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    backgroundColor: "#0097A7",
    padding: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 15 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#FFF", textAlign: "center" },

  cardContainer: { alignItems: "center", marginVertical: 20 },
  cardImage: { width: "90%", height: 200, resizeMode: "contain", borderRadius: 10 },

  infoContainer: { paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10, textAlign: "right" },
  input: {
    borderWidth: 1,
    borderColor: "#0097A7",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#FFF",
  },

  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInputContainer: { width: "48%" },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  toggleText: { fontSize: 16, fontWeight: "bold", textAlign: "right" },

  bottomNav: { position: "absolute", bottom: 0, width: "100%" },
});

export default MyCardScreen;
