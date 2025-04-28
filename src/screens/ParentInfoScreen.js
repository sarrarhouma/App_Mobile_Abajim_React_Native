import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateParentInfo, fetchParentInfo, uploadParentAvatar } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import API_BASE_URL from "../utils/Config";

const BASE_URL = API_BASE_URL.replace("/api", "");

const ParentInfoScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const parentInfo = useSelector((state) => state.auth.parentInfo);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    dispatch(fetchParentInfo());
  }, [dispatch]);

  useEffect(() => {
    if (parentInfo) {
      setName(parentInfo.full_name || "");
      setMobile(parentInfo.mobile || "");
    }
  }, [parentInfo]);

  const handleSave = () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert("⚠️ يرجى إدخال جميع البيانات المطلوبة");
      return;
    }
    dispatch(updateParentInfo({ full_name: name, mobile }, (success) => {
      Alert.alert(success ? "✅ تم تحديث المعلومات بنجاح" : "❌ فشل التحديث");
    }));
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("❌", "صلاحيات المعرض مطلوبة");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = uri.split("/").pop();
        const ext = /\.(\w+)$/.exec(fileName)?.[1]?.toLowerCase();
        const mimeType = ext === "png" ? "image/png" : "image/jpeg";

        const formData = new FormData();
        formData.append("avatar", {
          uri,
          name: fileName,
          type: mimeType,
        });

        dispatch(uploadParentAvatar(formData));
      }
    } catch (error) {
      console.error("Erreur ImagePicker:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>معلوماتي الشخصية</Text>
      </View>

      <View style={styles.avatarContainer}>
        {parentInfo?.avatar ? (
          <Image source={{ uri: `${BASE_URL}${parentInfo.avatar}` }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>
              {parentInfo?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>الاسم</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          textAlign="right"
        />

        <Text style={styles.label}>رقم الهاتف</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
          textAlign="right"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>حفظ التعديلات</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#0097A7", paddingVertical: 50, paddingHorizontal: 15,
  },
  backButton: { position: "absolute", left: 15 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "white" },

  avatarContainer: { alignItems: "center", justifyContent: "center", marginTop: 30, marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  initialsCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#0097A7",
    alignItems: "center", justifyContent: "center",
  },
  initialsText: { color: "white", fontSize: 32, fontWeight: "bold" },
  cameraButton: {
    position: "absolute", bottom: 0, right: 165,
    backgroundColor: "#1F3B64", borderRadius: 20, padding: 5,
  },

  formContainer: { paddingHorizontal: 20, marginTop: 10 },
  label: {
    fontSize: 16, color: "#1F3B64", textAlign: "right",
    marginBottom: 5, fontWeight: "bold"
  },
  input: {
    borderWidth: 1, borderColor: "#0097A7",
    padding: 12, borderRadius: 8, backgroundColor: "#FFF",
    fontSize: 16, marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#0097A7", paddingVertical: 12,
    borderRadius: 8, alignItems: "center", marginTop: 15,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default ParentInfoScreen;