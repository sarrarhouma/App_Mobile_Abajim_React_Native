import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addChild } from "../reducers/auth/AuthAction"; // ✅ Import Redux Action

const AddKidsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  const childrenCount = useSelector((state) => state.auth.children.length); // ✅ Track number of children

  const [kidsList, setKidsList] = useState([]); // ✅ Store added kids temporarily
  const [childName, setChildName] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // ✅ Level icons mapping
  const levelIcons = {
    1: require("../../assets/icons/one.png"),
    2: require("../../assets/icons/two.png"),
    3: require("../../assets/icons/three.png"),
    4: require("../../assets/icons/four.png"),
    5: require("../../assets/icons/five.png"),
    6: require("../../assets/icons/six.png"),
  };

  // ✅ Function to map frontend levels (1-6) to backend levels (6-11)
  const mapLevelToBackend = (level) => level + 5;

  // ✅ Function to convert gender format for API
  const formatGender = (gender) => (gender === "male" ? "Garçon" : "Fille");

  // ✅ Handle adding a child
  const handleAddChild = () => {
    if (!childName || !selectedGender || !selectedLevel) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول قبل إضافة الطفل");
      return;
    }

    if (kidsList.length >= 4) {
      Alert.alert("خطأ", "لا يمكنك إضافة أكثر من 4 أطفال.");
      return;
    }

    const backendLevelId = mapLevelToBackend(selectedLevel);

    const newChild = {
      Nom: childName,
      sexe: formatGender(selectedGender),
      level_id: backendLevelId,
    };

    setKidsList([...kidsList, newChild]); // ✅ Add child to local list
    setChildName("");
    setSelectedGender(null);
    setSelectedLevel(null);

    console.log("✅ Child Added Locally:", newChild);

    // ✅ Automatically navigate to Books if max 4 kids are added
    if (kidsList.length + 1 === 4) {
      handleSubmitAll();
    }
  };

  // ✅ Handle submitting all children to backend
  const handleSubmitAll = () => {
    console.log("🔄 Sending Kids to API...");
    kidsList.forEach((child) => dispatch(addChild(child, navigation)));

    // ✅ Navigate to Books after all kids are added
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

      {/* List of Added Kids */}
      <FlatList
        data={kidsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.kidItem}>
            <Text style={styles.kidText}>{item.Nom} - {item.sexe} - مستوى {item.level_id - 5}</Text>
          </View>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddChild} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "جاري الإضافة..." : "إضافة طفل"}</Text>
        </TouchableOpacity>

        {/* Show "Next" button only if at least 1 kid is added */}
        {kidsList.length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={handleSubmitAll}>
            <Text style={styles.buttonText}>التالي</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ✅ Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20, alignItems: "center" },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#1F3B64" },
  image: { width: 230, height: 150, resizeMode: "contain", marginBottom: 20 },
  label: { fontSize: 20, fontWeight: "bold", marginBottom: 10, alignSelf: "flex-end", color: "#1F3B64" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F3B64",
    marginBottom: 15,
  },
  input: { flex: 1, fontSize: 18, textAlign: "right", color: "#1F3B64" },
  genderContainer: { flexDirection: "row", justifyContent: "center", width: "100%", marginBottom: 10 },
  genderButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
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
    width: 75,
    height: 70,
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
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    width: "45%",
     margin: 7 
  },
  buttonText: { fontSize: 20, color: "#FFF", fontWeight: "bold" },
});

export default AddKidsScreen;
