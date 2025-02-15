import AsyncStorage from "@react-native-async-storage/async-storage";
export const API_URL = 'https://cf71-196-179-217-114.ngrok-free.app/api'; 
import { Alert } from "react-native";

export const register = (fullName, mobile, password, role_id, navigation) => {
    return async (dispatch) => {
      dispatch({ type: "AUTH_LOADING" });
  
      try {
        console.log("🔄 Envoi de la requête REGISTER...");
  
        const response = await fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName, 
            mobile,
            password,
            role_id, 
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Erreur HTTP:", response.status, errorData);
          throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }
  
        const resData = await response.json(); 
        if (!resData.access_token) {
          throw new Error("Aucun token reçu. Vérifie le backend.");
        }
  
        console.log("✅ Inscription réussie !");
        Alert.alert("Succès", "Inscription réussie !");
  
        // ✅ 🔄 Redirection immédiate vers AddKids
        navigation.navigate("AddKids");
  
        // ✅ Stocker le token après avoir ajouté l'enfant
        await AsyncStorage.setItem("token", resData.access_token);
  
        // ✅ Mettre à jour Redux Store
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: resData.access_token,
        });
  
      } catch (error) {
        console.error("❌ Erreur d'inscription:", error.message);
        dispatch({ type: "LOGIN_FAIL", error: error.message });
        Alert.alert("Erreur", error.message);
      }
    };
  };


// 🔹 Login Action
export const login = (mobile, password, navigation) => {
    return async (dispatch) => {
      dispatch({ type: "AUTH_LOADING" });
  
      try {
        console.log("🔄 Envoi de la requête LOGIN...");
        console.log("📨 URL API utilisée :", `${API_URL}/users/login`);
        
        const response = await fetch(`${API_URL}/users/login`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ mobile, password }),
        });
  
        const resData = await response.json();
        console.log("📨 Réponse reçue :", resData);
  
        // ✅ Vérifie si le token est bien reçu (le champ est "token" et non "access_token")
        if (!resData.token) {
          console.error("❌ Erreur : Aucun token reçu !");
          throw new Error("Identifiants incorrects.");
        }
  
        // ✅ Stocke le token dans AsyncStorage
        await AsyncStorage.setItem("token", resData.token);
  
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: resData.token,
        });
  
        console.log("✅ Connexion réussie !");
        navigation.navigate("Books");
  
      } catch (error) {
        console.error("❌ Erreur de connexion :", error.message);
        dispatch({ type: "LOGIN_FAIL", error: error.message });
        Alert.alert("Erreur", error.message);
      }
    };
  };
  
  // 🔹 Logout Action
  export const Logout = () => {
    return async (dispatch) => {
      await AsyncStorage.removeItem("token");
  
      dispatch({
        type: "LOGOUT",
      });
  
      Alert.alert("✅ Déconnexion réussie");
    };
  };
  
  // 🔹 Vérification de l'état de connexion
  export const Init = () => {
    return async (dispatch) => {
      let token = await AsyncStorage.getItem("token");
  
      if (token) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: token,
        });
      }
    };
  };



