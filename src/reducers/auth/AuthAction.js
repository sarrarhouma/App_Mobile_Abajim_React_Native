import AsyncStorage from "@react-native-async-storage/async-storage";
export const API_URL = 'https://c70a-196-179-217-114.ngrok-free.app/api'; 
import { Alert } from "react-native";


export const FETCH_CORRECTION_VIDEO_REQUEST = "FETCH_CORRECTION_VIDEO_REQUEST";
export const FETCH_CORRECTION_VIDEO_SUCCESS = "FETCH_CORRECTION_VIDEO_SUCCESS";
export const FETCH_CORRECTION_VIDEO_FAILURE = "FETCH_CORRECTION_VIDEO_FAILURE";

// register new user
export const register = (fullName, mobile, password, role_id, navigation) => {
  return async (dispatch) => {
    dispatch({ type: "AUTH_LOADING" });

    try {
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
      if (!resData.token) {
        throw new Error("Aucun token reçu. Vérifie le backend.");
      }


      Alert.alert("Succès", "Inscription réussie !");

      // ✅ Store the token
      await AsyncStorage.setItem("token", resData.token);

      // ✅ Update Redux Store with Token
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: resData.token, 
      });

      // ✅ Fetch children count immediately after registration
      const childrenResponse = await fetch(`${API_URL}/enfants`, {
        headers: {
          Authorization: `Bearer ${resData.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      const childrenData = await childrenResponse.json();
      // ✅ Update Redux Store with children data
      dispatch({
        type: "FETCH_CHILDREN_SUCCESS",
        payload: childrenData,
      });

      // ✅ Navigate after fetching children
      if (childrenData.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: "AddKids" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Books" }],
        });
      }

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
      
      const response = await fetch(`${API_URL}/users/login`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ mobile, password }),
      });

      const resData = await response.json();

      if (!resData.token) {
        throw new Error("Identifiants incorrects.");
      }

      await AsyncStorage.setItem("token", resData.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: resData.token,
      });

      // ✅ Fetch children immediately after login
      const childrenResponse = await fetch(`${API_URL}/enfants`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${resData.token}`,
          "Content-Type": "application/json",
        },
      });

      const childrenData = await childrenResponse.json();
      console.log("✅ Enfants récupérés après connexion:", childrenData);

      dispatch({
        type: "FETCH_CHILDREN_SUCCESS",
        payload: childrenData,
      });

      // ✅ Navigate based on child count
      if (childrenData.length > 0) {
        navigation.reset({ index: 0, routes: [{ name: "Books" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "AddKids" }] });
      }

    } catch (error) {
      console.error("❌ Erreur de connexion :", error.message);
      dispatch({ type: "LOGIN_FAIL", error: error.message });
      Alert.alert("Erreur", error.message);
    }
  };
};

// reset password 
export const resetPassword = (mobile, newPassword, callback) => async (dispatch) => {
  try {
    dispatch({ type: "AUTH_LOADING" });

    const response = await fetch(`${API_URL}/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile, newPassword }),
    });

    const resData = await response.json();

    if (response.ok) {
      dispatch({ type: "RESET_PASSWORD_SUCCESS" });
      Alert.alert("✅ تم إعادة تعيين كلمة المرور بنجاح!");
      if (callback) callback(true);
    } else {
      throw new Error(resData.message || "Échec de la réinitialisation du mot de passe.");
    }
  } catch (error) {
    console.error("❌ Erreur de réinitialisation du mot de passe :", error.message);
    dispatch({ type: "RESET_PASSWORD_FAILURE", payload: error.message });
    Alert.alert("❌ فشل إعادة تعيين كلمة المرور، حاول مرة أخرى.");
    if (callback) callback(false);
  }
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
        try {
            let token = await AsyncStorage.getItem("token");

            if (!token) {
                console.warn("⚠️ No token found, skipping initialization.");
                return;
            }

            dispatch({ type: "LOGIN_SUCCESS", payload: token });
            let childrenData = await AsyncStorage.getItem("children");
            let children = childrenData ? JSON.parse(childrenData) : [];

            console.log("✅ Children loaded from AsyncStorage:", children);

            if (!Array.isArray(children) || children.length === 0) {
                console.warn("⚠️ No children found in AsyncStorage, fetching from API...");

                // ✅ Fetch from API if AsyncStorage is empty
                const childrenResponse = await fetch(`${API_URL}/enfants`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (childrenResponse.ok) {
                    const latestChildren = await childrenResponse.json();

                    if (Array.isArray(latestChildren) && latestChildren.length > 0) {
                        await AsyncStorage.setItem("children", JSON.stringify(latestChildren));
                        dispatch({ type: "FETCH_CHILDREN_SUCCESS", payload: latestChildren });
                    } else {
                        console.warn("⚠️ No children found in backend.");
                        dispatch({ type: "FETCH_CHILDREN_SUCCESS", payload: [] });
                    }
                } else {
                    console.warn("⚠️ Failed to fetch children from backend.");
                }
            } else {
                dispatch({ type: "FETCH_CHILDREN_SUCCESS", payload: children });
            }
        } catch (error) {
            console.error("❌ Error in Init function:", error.message);
        }
    };
};


// 🔹 Add Child Action
export const addChild = (childData, navigation) => async (dispatch, getState) => {
  try {
      const parentToken = await AsyncStorage.getItem("token"); // ✅ Always use the parent’s token
      if (!parentToken) {
          throw new Error("User is not authenticated.");
      }

      dispatch({ type: "AUTH_LOADING" });
      
      const response = await fetch(`${API_URL}/enfants/add`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parentToken}`, // ✅ Ensures request is made as a parent
          },
          body: JSON.stringify(childData)
      });

      const resData = await response.json();
      
      if (response.ok) {
          dispatch({ type: "ADD_CHILD_SUCCESS", payload: resData.enfant });

          navigation.navigate("Books");  // Redirect to books page after adding a child
      } else {
          console.error("❌ Failed to add child:", resData.error);
          dispatch({ type: "ADD_CHILD_FAILURE", error: resData.error });
      }
  } catch (error) {
      console.error("❌ Error adding child:", error);
      dispatch({ type: "ADD_CHILD_FAILURE", error: error.message });
  }
};
// ✅ **Update Child Action**
export const updateChild = (childData, callback) => async (dispatch) => {
  dispatch({ type: "UPDATE_CHILD_REQUEST" });

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    console.log("🔄 Updating Child Data:", childData);

    const response = await fetch(`${API_URL}/enfants/update/${childData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nom: childData.nom, // ✅ Ensure it matches the API expected key
        level_id: childData.level_id,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.error || "Failed to update child.");
    }
    dispatch({
      type: "UPDATE_CHILD_SUCCESS",
      payload: resData.enfant, // ✅ Ensure correct response data
    });

    dispatch(fetchChildren()); // ✅ Refresh children list after update

    if (callback) callback(true); // ✅ Execute callback after success
  } catch (error) {
    console.error("❌ Error updating child:", error.message);
    dispatch({
      type: "UPDATE_CHILD_FAILURE",
      payload: error.message,
    });

    if (callback) callback(false); // ✅ Execute callback with failure
  }
};

// 🔹 Supprimer un enfant
export const deleteChild = (childId) => async (dispatch, getState) => {
  try {
    const token = await AsyncStorage.getItem("token"); // ✅ Récupérer le token du parent

    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    dispatch({ type: "AUTH_LOADING" });

    const response = await fetch(`${API_URL}/enfants/delete/${childId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_CHILD_SUCCESS", payload: childId });

      dispatch(fetchChildren()); // ✅ Rafraîchir la liste des enfants après suppression

      Alert.alert("✅ تم حذف الطفل", "تم حذف الطفل بنجاح.");
    } else {
      console.error("❌ فشل في حذف الطفل :", resData.error);
      dispatch({ type: "DELETE_CHILD_FAILURE", error: resData.error });
      Alert.alert("❌ Erreur", resData.error || "Échec de la suppression de l'enfant.");
    }
  } catch (error) {
    console.error("❌ حدث خطأ أثناء حذف الطفل", error.message);
    dispatch({ type: "DELETE_CHILD_FAILURE", error: error.message });
    Alert.alert("❌ خطأ",  "حدث خطأ أثناء الحذف.");
  }
};

// ✅ Fetch Children (Updated to use the new `users` table)
export const fetchChildren = () => async (dispatch, getState) => {
  try {
      const parentToken = await AsyncStorage.getItem("token"); // ✅ Ensure we use the parent's token

      if (!parentToken) {
          console.error("❌ Token missing.");
          return;
      }

      dispatch({ type: "AUTH_LOADING" });

      const response = await fetch(`${API_URL}/enfants`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${parentToken}`,
              "Content-Type": "application/json"
          }
      });

      const data = await response.json();
      if (response.ok) {
          console.log("✅ Children fetched:", data);

          await AsyncStorage.setItem("children", JSON.stringify(data)); // ✅ Store updated children list
          dispatch({ type: "FETCH_CHILDREN_SUCCESS", payload: data });
      } else {
          console.error("❌ Failed to fetch children:", data.error);
          dispatch({ type: "FETCH_CHILDREN_FAILURE", error: data.error });
      }
  } catch (error) {
      console.error("❌ Error fetching children:", error);
      dispatch({ type: "FETCH_CHILDREN_FAILURE", error: "Failed to fetch children" });
  }
};

// fetching documents by manuel_id 

export const fetchDocumentByManuelId = (manuelId) => {
  return async (dispatch) => {
    dispatch({ type: "DOCUMENT_LOADING" });

    try {
      console.log(`📥 Fetching documents for manuel_id: ${manuelId}`);

      const response = await fetch(`${API_URL}/documents/manuel/${manuelId}`);
      const data = await response.json();

      if (response.ok && data.length > 0) {
        console.log("✅ Document fetched successfully:", data[0]);
        dispatch({ type: "DOCUMENT_SUCCESS", payload: data[0] });
      } else {
        console.error("❌ No documents found for manuel_id:", manuelId);
        dispatch({ type: "DOCUMENT_FAIL", error: "No documents found" });
      }
    } catch (error) {
      console.error("❌ Error fetching document:", error);
      dispatch({ type: "DOCUMENT_FAIL", error: "Failed to fetch document" });
    }
  };
};
// switching betweeen kids accounts
export const switchChild = (child) => {
  return async (dispatch) => {
    try {
      console.log(`🔄 Switching to child: ${child.full_name} (ID: ${child.id})`);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(`${API_URL}/users/switch-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ childId: child.id }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to switch child.");
      }

      //console.log("✅ Child switched successfully:", resData);

      // ✅ Save the new token and active child
      await AsyncStorage.setItem("tokenChild", resData.token);
      await AsyncStorage.setItem("activeChild", JSON.stringify(resData.child));

      // ✅ Update Redux Store
      dispatch({
        type: "SWITCH_ACTIVE_CHILD",
        payload: { 
          child: resData.child, 
          token: resData.token, 
        },
      });
      const response2 = await fetch(`${API_URL}/enfants`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const resData2 = await response2.json();
      // ✅ Ensure children list is stored in AsyncStorage
      if (resData2) {
       // console.log("✅ Updated children list after switching:", resData2);
        await AsyncStorage.setItem("children", JSON.stringify(resData2));
        
        // ✅ Update Redux Store with new children list
        dispatch({
          type: "FETCH_CHILDREN_SUCCESS",
          payload: resData2
        });
      }
      // else {
      //   console.log("empty children");      }
      } 
    catch (error) {
      console.error("❌ Error switching child:", error.message);
    }
  };
};

// ✅ Fetch Correction Video with Authentication
export const fetchCorrectionVideoUrl = (manuelId, icon, page) => async (dispatch) => {
  dispatch({ type: "FETCH_CORRECTION_VIDEO_REQUEST" });

  try {
    const token = await AsyncStorage.getItem("token"); // ✅ Get auth token
    console.log("🔑 Retrieved Token:", token); // Log the token

    if (!token) {
      console.error("❌ No auth token found");
      dispatch({ type: "FETCH_CORRECTION_VIDEO_FAILURE", payload: "Unauthorized access (No token)" });
      return;
    }


      const apiUrl = `${API_URL}/documents/correction-video/${manuelId}/${icon}/${page}`;
    console.log("📡 Sending Request to:", apiUrl); // Log API URL

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Include authentication token
      },
    });

    console.log("📥 API Response Status:", response.status); // Log response status

    const data = await response.json();
    console.log("📤 API Response Data:", data); // Log response data

    if (response.ok && data.correctionVideoUrl) {
      console.log("✅ Correction Video URL Found:", data.correctionVideoUrl);
      dispatch({ type: "FETCH_CORRECTION_VIDEO_SUCCESS", payload: data.correctionVideoUrl });
    } else {
      console.error("❌ API Error:", data);
      dispatch({ type: "FETCH_CORRECTION_VIDEO_FAILURE", payload: data.error || "Failed to fetch video" });
    }
  } catch (error) {
    console.error("❌ Error fetching correction video:", error);
    dispatch({ type: "FETCH_CORRECTION_VIDEO_FAILURE", payload: error.message });
  }
};
      
 //fetch parent who logged in  informations 

 // 🔹 Fetch Parent Information
export const fetchParentInfo = () => async (dispatch) => {
  dispatch({ type: "FETCH_PARENT_INFO_REQUEST" });

  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.error("❌ No auth token found");
      dispatch({ type: "FETCH_PARENT_INFO_FAILURE", payload: "Unauthorized access (No token)" });
      return;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Send authentication token
      },
    });

    const data = await response.json();
    if (response.ok) {
      dispatch({ type: "FETCH_PARENT_INFO_SUCCESS", payload: data });
    } else {
      console.error("❌ API Error:", data);
      dispatch({ type: "FETCH_PARENT_INFO_FAILURE", payload: data.error || "Failed to fetch parent info" });
    }
  } catch (error) {
    console.error("❌ Error fetching parent info:", error);
    dispatch({ type: "FETCH_PARENT_INFO_FAILURE", payload: error.message });
  }
};
 ////////////////////////////fetching webinars by level_id

 // Action Types
export const FETCH_WEBINARS_REQUEST = "FETCH_WEBINARS_REQUEST";
export const FETCH_WEBINARS_SUCCESS = "FETCH_WEBINARS_SUCCESS";
export const FETCH_WEBINARS_FAILURE = "FETCH_WEBINARS_FAILURE";

// Fetch webinars by level_id
export const fetchWebinarsByLevel = (levelId) => async (dispatch) => {
  dispatch({ type: "FETCH_WEBINARS_REQUEST" });

  try {
      console.log(`📥 Fetching webinars for level_id: ${levelId}`);

      const response = await fetch(`${API_URL}/webinars/level/${levelId}`);
      const data = await response.json();

      if (response.ok) {
         // console.log("✅ Webinars fetched successfully:", data);
          dispatch({ type: "FETCH_WEBINARS_SUCCESS", payload: data || [] });
      } else {
          console.error("❌ API Error fetching webinars:", data.error);
          dispatch({ type: "FETCH_WEBINARS_FAILURE", payload: data.error });
      }
  } catch (error) {
      console.error("❌ Network error fetching webinars:", error);
      dispatch({ type: "FETCH_WEBINARS_FAILURE", payload: "Failed to fetch webinars" });
  }
};
