import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchChildren,
  updateParentInfo,
  fetchParentInfo,
  Logout,
} from "../reducers/auth/AuthAction";
import BottomNavigation from "../components/BottomNavigation";
import { Ionicons } from "@expo/vector-icons";

// ✅ Map level_id to Arabic level names
const LEVELS_MAP = {
  6: "الأولى ابتدائي",
  7: "الثانية ابتدائي",
  8: "الثالثة ابتدائي",
  9: "الرابعة ابتدائي",
  10: "الخامسة ابتدائي",
  11: "السّادسة ابتدائي",
};

// ✅ Function to get level name
const getLevelName = (levelId) => LEVELS_MAP[levelId] || "غير محدد";

// ✅ Function to get the correct avatar URL
const getAvatarUrl = (avatar) => {
  return avatar?.startsWith("http")
    ? avatar
    : `https://www.abajim.com/${avatar?.startsWith("/") ? avatar.substring(1) : avatar}`;
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // ✅ Get Parent & Children data from Redux Store
  const parentInfo = useSelector((state) => state.auth.parentInfo);
  const children = useSelector((state) => state.auth.children);
  const isLoading = useSelector((state) => state.auth.isLoading);

  // ✅ Local states for editable parent fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState(""); // Optional password update

  /** 🔹 Fetch Parent Info & Children on Mount */
  useEffect(() => {
    dispatch(fetchParentInfo());
    dispatch(fetchChildren());
  }, [dispatch]);

  /** 🔹 Sync Parent Data to State on Fetch */
  useEffect(() => {
    if (parentInfo) {
      setName(parentInfo.full_name || "");
      setMobile(parentInfo.mobile || "");
    }
  }, [parentInfo]);

  /** 🔹 Save Updated Parent Info */
  const handleSaveParentInfo = () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert("⚠️ يرجى إدخال جميع البيانات المطلوبة");
      return;
    }

    const updatedInfo = { full_name: name, mobile };
    if (password) updatedInfo.password = password; // ✅ Only add password if changed

    dispatch(updateParentInfo(updatedInfo, (success) => {
      if (success) {
        Alert.alert("✅ تم تحديث المعلومات بنجاح");
        setPassword(""); // Clear password field after update
      } else {
        Alert.alert("❌ فشل تحديث المعلومات، حاول مرة أخرى");
      }
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>إعدادات الحساب</Text>
        </View>

        {/* Parent Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات ولي الأمر</Text>

          <Text style={styles.label}>الاسم</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            textAlign="right"
          />

          <Text style={styles.label}>الجوال</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
            textAlign="right"
          />

          <Text style={styles.label}>كلمة المرور (اختياري)</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="أدخل كلمة مرور جديدة"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveParentInfo}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Children Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأطفال</Text>

          {/* Child List */}
          <FlatList
            horizontal
            data={children}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.childrenList}
            renderItem={({ item }) => (
              <View style={styles.childWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddKids", { child: item })} // ✅ Now editing works!
                >
                  <Image
                    source={{ uri: getAvatarUrl(item.avatar) }}
                    style={styles.childAvatar}
                  />
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color="white"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.childName}>{item.full_name}</Text>
                <Text style={styles.childLevel}>{getLevelName(item.level_id)}</Text>
              </View>
            )}
          />

          {/* Add Child Button (Only if less than 4 children) */}
          {children.length < 4 && (
            <TouchableOpacity
              style={styles.addChildButton}
              onPress={() => navigation.navigate("AddKids")}
            >
              <Ionicons name="add-circle" size={50} color="#0097A7" />
            </TouchableOpacity>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => dispatch(Logout(navigation))}
        >
          <Text style={styles.buttonText}>تسجيل خروج</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation - Fixed Position */}
      <View style={styles.bottomNav}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingBottom: 100 },

  header: { backgroundColor: "#0097A7", padding: 50, width: "100%", alignItems: "center" },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#FFF" },

  section: { width: "90%", backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0097A7", marginBottom: 10, textAlign: "right" },

  label: { fontSize: 16, fontWeight: "bold", color: "#1F3B64", marginTop: 5, textAlign: "right" },
  input: { borderWidth: 1, borderColor: "#0097A7", padding: 10, borderRadius: 8, marginTop: 5, textAlign: "right" },

  saveButton: { backgroundColor: "#0097A7", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  logoutButton: { backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20, width: "90%" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  childrenList: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  childWrapper: { alignItems: "center", marginHorizontal: 8, position: "relative" },
  childAvatar: { width: 70, height: 70, borderRadius: 50, borderWidth: 2, borderColor: "#0097A7" },
  editIcon: { position: "absolute", right: 0, bottom: 0, backgroundColor: "#0097A7", borderRadius: 15, padding: 3 },

  bottomNav: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "#FFF", paddingVertical: 8 },
});

export default SettingsScreen;
