import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Keyboard,
  TextInput,
} from "react-native";
import { verifyOTP } from "../api/authService";

const VerificationScreen = ({ route, navigation }) => {
  const { phone: mobile = "" } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", ""]); // Tableau pour stocker les 4 chiffres
  const inputRefs = useRef([]); // Références pour les champs

  useEffect(() => {
    // Mettre le focus sur le premier champ au chargement
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Passer automatiquement au champ suivant
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Fermer le clavier si tous les champs sont remplis
    if (index === 3 && value) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
  
    if (otpCode.length !== 4) {
      alert("الرجاء إدخال رمز مكون من 4 أرقام");
      return;
    }
  
    try {
      console.log("Tentative de vérification avec:", mobile, otpCode);
  
      // Appel à l'API via authService
      const response = await verifyOTP(mobile, otpCode);
      console.log("Réponse brute:", response);
  
      if (response) {
        alert("رمز التحقق صحيح!");
        console.log("Redirection vers SignIn...");
        navigation.navigate("SignIn");
      } else {
        alert(response?.message || "رمز غير صحيح، حاول مرة أخرى");
      }
    } catch (error) {
      console.error("Erreur de vérification OTP:", error);
      alert("خطأ في التحقق من الرمز، يرجى المحاولة لاحقًا");
    }
  };
  
  

  return (
    <ImageBackground
      source={require("../../assets/images/ba1.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>التحقق من الحساب</Text>
        <Text style={styles.subtitle}>
          أدخل رمز التحقق الذي أرسلناه إلى هاتفك
        </Text>
        <Text style={styles.phone}>{mobile}</Text>

        {/* Champs OTP */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>

        {/* Bouton d'envoi */}
        <TouchableOpacity style={styles.sendButton} onPress={handleVerifyOTP}>
          <Text style={styles.sendText}>إرسال</Text>
        </TouchableOpacity>

        {/* Bouton de réinitialisation */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => navigation.navigate("ForgetPasswordScreen")}
        >
          <Text style={styles.resetText}>إعادة تعيين كلمة المرور</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F3B64",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    width: "80%",
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F3B64",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: 55,
    height: 55,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#1F3B64",
    paddingVertical: 15,
    width: "80%",
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  sendText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 15,
    width: "80%",
    borderRadius: 25,
    alignItems: "center",
  },
  resetText: {
    fontSize: 16,
    color: "#1F3B64",
    fontWeight: "bold",
  },
});

export default VerificationScreen;
