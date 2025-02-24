import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../reducers/auth/AuthAction";
import BottomNavigation from "../components/BottomNavigation";
import { Ionicons } from "@expo/vector-icons";

const profileImages = {
  girl: require("../../assets/icons/profile2.png"), // Profile for girls
  boys: [
    require("../../assets/icons/profile.png"),   // Profile 1 (Boy)
    require("../../assets/icons/profile3.png"),  // Profile 3 (Boy)
    require("../../assets/icons/profile4.png"),  // Profile 4 (Boy)
  ],
};

// Fonction pour récupérer l'image de profil selon le genre
const getProfileImage = (child, index) => {
  return child.sexe === "Fille"
    ? profileImages.girl
    : profileImages.boys[index % profileImages.boys.length];
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const children = useSelector((state) => state.auth.children);

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const selectedChild = children[selectedChildIndex] || {};

  const [name, setName] = useState(selectedChild?.Nom || "");
  const [gender, setGender] = useState(selectedChild?.sexe || "");
  const [level, setLevel] = useState(selectedChild?.level_id?.toString() || "");

  const handleEditChild = () => {
    navigation.navigate("AddKids", { child: selectedChild });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>إعدادات</Text>
      </View>

      {/* Kids Switcher */}
      {children.length > 1 && (
        <FlatList
          horizontal
          data={children}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.kidButton,
                selectedChildIndex === index && styles.selectedKid,
              ]}
              onPress={() => {
                setSelectedChildIndex(index);
                setName(item.Nom);
                setGender(item.sexe);
                setLevel(item.level_id?.toString());
              }}
            >
              <Image source={getProfileImage(item, index)} style={styles.kidIcon} />
              <Text style={styles.kidButtonText}>{item.Nom}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.kidSwitcherContainer}
        />
      )}

      {/* Edit Name */}
      <Text style={styles.label}>الاسم</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <TouchableOpacity onPress={handleEditChild}>
          <Ionicons name="create-outline" size={22} color="#0097A7" />
        </TouchableOpacity>
      </View>

      {/* Edit Gender */}
      <Text style={styles.label}>الجنس</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={gender} onChangeText={setGender} />
        <TouchableOpacity onPress={handleEditChild}>
          <Ionicons name="create-outline" size={22} color="#0097A7" />
        </TouchableOpacity>
      </View>

      {/* Edit Level */}
      <Text style={styles.label}>المستوى الدراسي</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={level} onChangeText={setLevel} />
        <TouchableOpacity onPress={handleEditChild}>
          <Ionicons name="create-outline" size={22} color="#0097A7" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <Text style={styles.label}>صورة الملف الشخصي</Text>
      <Image source={getProfileImage(selectedChild, selectedChildIndex)} style={styles.profileImage} />

      {/* Save Changes */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.buttonText}>حفظ التغييرات</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(Logout(navigation))}>
        <Text style={styles.buttonText}>تسجيل خروج</Text>
      </TouchableOpacity>

      {/* Bottom Navigation (Fixed Size) */}
      <View style={styles.bottomNav}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", alignItems: "center" },
  header: { backgroundColor: "#0097A7", padding: 25, width: "100%", alignItems: "center" },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
  label: { fontSize: 16, fontWeight: "bold", color: "#1F3B64", marginTop: 10 },
  inputContainer: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0097A7",
    padding: 15,
    borderRadius: 8,
    width: "75%",
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 14, textAlign: "right" },
  profileImage: { width: 85, height: 85, borderRadius: 50, marginTop: 10 },
  saveButton: { backgroundColor: "#0097A7", padding: 12, borderRadius: 8, width: "75%", alignItems: "center", marginTop: 15 },
  logoutButton: { backgroundColor: "red", padding: 12, borderRadius: 8, width: "75%", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 8,
  },

  // Kids Switcher
  kidSwitcherContainer: {
    marginTop: -10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 3,
  },
  kidButton: {
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#0097A7",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 55,  // Reduced width
    minHeight: 55,  // Reduced height
  },
  selectedKid: { backgroundColor: "#0097A7" },
  kidButtonText: { fontSize: 14, color: "#1F3B64", marginLeft: 4 },
  kidIcon: { width: 30, height: 30, marginRight: 3, borderRadius: 15 },
});

export default SettingsScreen;
