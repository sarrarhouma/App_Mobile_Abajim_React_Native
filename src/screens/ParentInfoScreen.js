import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateParentInfo, fetchParentInfo } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

    const updatedInfo = { full_name: name, mobile };

    dispatch(updateParentInfo(updatedInfo, (success) => {
      if (success) {
        Alert.alert("✅ تم تحديث المعلومات بنجاح");
      } else {
        Alert.alert("❌ فشل التحديث، حاول مرة أخرى");
      }
    }));
  };

  return (
    <View style={styles.container}>
      {/* ✅ Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>معلوماتي الشخصية</Text>
      </View>

      {/* ✅ Input Fields */}
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

        {/* ✅ Save Changes Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>حفظ التعديلات</Text>
        </TouchableOpacity>

        {/* ✅ Redirect to Forget Password Screen */}
        <TouchableOpacity 
          style={styles.resetPasswordButton} 
          onPress={() => navigation.navigate("ForgetPasswordScreen")}
        >
          <Text style={styles.buttonText}>إعادة تعيين كلمة المرور</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  // ✅ Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0097A7",
    paddingVertical: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 15, // ✅ Positions back button correctly
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  // ✅ Form Styling
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "#1F3B64",
    textAlign: "right",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0097A7",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
    textAlign: "right",
    fontSize: 16,
    marginBottom: 15,
  },

  // ✅ Save Button
  saveButton: {
    backgroundColor: "#0097A7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  // ✅ Redirect to Forget Password Button
  resetPasswordButton: {
    backgroundColor: "#1d3b65",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default ParentInfoScreen;
