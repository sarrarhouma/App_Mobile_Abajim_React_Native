import React, { useState } from "react";
import {
  Image, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ImageBackground, Linking, ActivityIndicator,
  Keyboard, TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/auth/AuthAction";

export default function SignInScreen({ navigation }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);

  const handleLogin = () => {
    if (!mobile || !password) {
      Alert.alert("❌ Erreur", "Tous les champs sont obligatoires.");
      return;
    }
    dispatch(login(mobile, password, navigation));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={require("../../assets/images/ba1.png")} style={styles.background}>
        <Image source={require("../../assets/images/logocolors.png")} style={styles.logo} />
        <Text style={styles.title}>مرحبًا 👋</Text>
        <Text style={styles.title}>سجل الدخول مع أبجيم</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

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

        <TouchableOpacity onPress={() => navigation.navigate("ForgetPasswordScreen")}>
          <Text style={styles.forgotPassword}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تسجيل الدخول</Text>}
        </TouchableOpacity>

        <Text style={styles.orText}>أو</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1f3b64" }]}
            onPress={() => Linking.openURL("https://www.abajim.com/")}
          >
            <Ionicons name="logo-google" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1f3b64" }]}
            onPress={() => Linking.openURL("https://www.facebook.com/profile.php?id=61564811859358")}
          >
            <Ionicons name="logo-facebook" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.registerLink}>لا تملك حساب؟ إنشاء حساب جديد</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  logo: { width: 200, height: 70, marginBottom: 20 },
  title: { fontSize: 22, color: "#1F3B64", fontWeight: "bold", marginBottom: 20 },
  input: { width: "90%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 25, paddingHorizontal: 15, marginBottom: 15, textAlign: "right", backgroundColor: "rgba(255, 255, 255, 0.9)" },
  forgotPassword: { color: "#17A2B8", fontSize: 14, alignSelf: "flex-end", marginRight: "7%", marginBottom: 15 },
  buttonPrimary: { width: "90%", height: 50, backgroundColor: "#17A2B8", justifyContent: "center", alignItems: "center", borderRadius: 25, marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "red", fontSize: 16, marginBottom: 10 },
  orText: { fontSize: 16, color: "#777", marginBottom: 10 },
  socialButtons: { flexDirection: "row", gap: 15, marginBottom: 20 },
  socialButton: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  registerLink: { textAlign: "center", color: "#1F3B64", fontSize: 16, fontWeight: "bold" },
});