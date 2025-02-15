import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addChild } from "../reducers/auth/AuthAction"; // ✅ Ajout de l'action Redux

const AddKidsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // ✅ États pour stocker les informations de l'enfant
  const [childName, setChildName] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const levelIcons = {
    1: require("../../assets/icons/one.png"),
    2: require("../../assets/icons/two.png"),
    3: require("../../assets/icons/three.png"),
    4: require("../../assets/icons/four.png"),
    5: require("../../assets/icons/five.png"),
    6: require("../../assets/icons/six.png"),
  };

  // ✅ Fonction pour ajouter l'enfant
  const handleAddChild = () => {
    if (!childName || !selectedGender || !selectedLevel) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول قبل إضافة الطفل");
      return;
    }

    // ✅ Ajout de l'enfant dans Redux
    dispatch(addChild({ name: childName, gender: selectedGender, level: selectedLevel }));

    Alert.alert("نجاح", "تمت إضافة الطفل بنجاح!");

    // ✅ Navigation vers l'écran "Books"
    navigation.navigate("Books");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>قم بملء البيانات لإضافة طفلك</Text>
      </View>

      {/* Image */}
      <Image source={require("../../assets/images/kids.jpg")} style={styles.image} />

      {/* Name Input */}
      <Text style={styles.label}>الاسم</Text>
      <View style={styles.inputContainer}>
        <Image source={require("../../assets/icons/user.png")} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="الاسم"
          placeholderTextColor="#DADADA"
          value={childName}
          onChangeText={setChildName}
        />
      </View>

      {/* Gender Selection */}
      <Text style={styles.label}>الجنس</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, selectedGender === "male" && styles.selectedButton]}
          onPress={() => setSelectedGender("male")}
        >
          <Image source={require("../../assets/icons/male.png")} style={styles.genderIcon} />
          <Text style={styles.genderText}>ذكر</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, selectedGender === "female" && styles.selectedButton]}
          onPress={() => setSelectedGender("female")}
        >
          <Image source={require("../../assets/icons/female.png")} style={styles.genderIcon} />
          <Text style={styles.genderText}>أنثى</Text>
        </TouchableOpacity>
      </View>

      {/* School Level Selection */}
      <Text style={styles.label}>المستوى الدراسي</Text>
      <View style={styles.levelContainer}>
        <View style={styles.levelRow}>
          {[1, 2, 3].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.levelButton, selectedLevel === level && styles.selectedLevel]}
              onPress={() => setSelectedLevel(level)}
            >
              <Image source={levelIcons[level]} style={styles.levelIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.levelRow}>
          {[4, 5, 6].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.levelButton, selectedLevel === level && styles.selectedLevel]}
              onPress={() => setSelectedLevel(level)}
            >
              <Image source={levelIcons[level]} style={styles.levelIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddChild}>
          <Text style={styles.buttonText}>إضافة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20, alignItems: "center" },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#1F3B64" },
  image: { width: 250, height: 150, resizeMode: "contain", marginBottom: 20 },
  label: { fontSize: 20, fontWeight: "bold", marginBottom: 10, alignSelf: "flex-end", color: "#1F3B64" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F3B64",
    marginBottom: 15,
  },
  input: { flex: 1, fontSize: 18, textAlign: "right", color: "#1F3B64" },
  genderContainer: { flexDirection: "row", justifyContent: "center", width: "100%", marginBottom: 10 },
  genderButton: {
    backgroundColor: "#E0E0E0",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  genderIcon: { width: 35, height: 32, marginRight: 5 },
  genderText: { fontSize: 20, color: "#1F3B64" },
  selectedButton: { backgroundColor: "#0097A7" },
  levelContainer: { flexDirection: "column", alignItems: "center", marginBottom: 20 },
  levelRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  levelButton: {
    width: 80,
    height: 80,
    backgroundColor: "#E0E0E0",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  selectedLevel: { backgroundColor: "#0097A7" },
  levelIcon: { width: 60, height: 60 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", width: "100%" },
  addButton: {
    backgroundColor: "#1F3B64",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "60%",
  },
  buttonText: { fontSize: 20, color: "#FFF", fontWeight: "bold" },
});

export default AddKidsScreen;
