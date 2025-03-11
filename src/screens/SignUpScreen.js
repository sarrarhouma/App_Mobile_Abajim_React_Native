import React, { useState } from "react";
import { 
  Image, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ImageBackground, Linking, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../reducers/auth/AuthAction"; 

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(3); // ✅ Ajout de role_id (par défaut à 3)

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error); // Récupération des erreurs Redux

  const handleRegister = async () => {
    if (!fullName || !mobile || !password) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    dispatch(register(fullName, mobile, password, roleId, navigation));
  };

  return (
    <ImageBackground source={require("../../assets/images/ba1.png")} style={styles.background}>
      <Image source={require("../../assets/images/logocolors.png")} style={styles.logo} />
      <Text style={styles.title}> إبدأ رحلة تعلمية إستثنائية مع أبجيم 🚀 </Text>
      <Text style={styles.title}>إنشاء حساب جديد</Text>

      {/* ✅ Affichage des erreurs Redux */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="الاسم الكامل"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="الهاتف"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>إنشاء حساب</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.loginLink}>لديك حساب بالفعل؟ تسجيل الدخول</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

// ✅ Styles remain unchanged
const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  logo: { width: 200, height: 70, marginBottom: 20 },
  title: { fontSize: 21, color: "#1F3B64", fontWeight: "bold", marginBottom: 20 },
  input: { width: "90%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 25, paddingHorizontal: 15, marginBottom: 15, textAlign: "right", backgroundColor: "rgba(255, 255, 255, 0.9)" },
  buttonPrimary: { width: "90%", height: 50, backgroundColor: "#17A2B8", justifyContent: "center", alignItems: "center", borderRadius: 25, marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "red", fontSize: 16, marginBottom: 10 },
  loginLink: { textAlign: "center", color: "#1F3B64", fontSize: 16, fontWeight: "bold" },
});

