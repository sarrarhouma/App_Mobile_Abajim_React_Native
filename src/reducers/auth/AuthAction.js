import AsyncStorage from "@react-native-async-storage/async-storage";
export const API_URL = 'https://f124-41-226-8-251.ngrok-free.app/api'; 
import { Alert } from "react-native";
import jwt_decode from "jwt-decode"

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
// Actions pour la réinitialisation du mot de passe
export const SEND_OTP_REQUEST = "SEND_OTP_REQUEST";
export const SEND_OTP_SUCCESS = "SEND_OTP_SUCCESS";
export const SEND_OTP_FAILURE = "SEND_OTP_FAILURE";

export const VERIFY_OTP_REQUEST = "VERIFY_OTP_REQUEST";
export const VERIFY_OTP_SUCCESS = "VERIFY_OTP_SUCCESS";
export const VERIFY_OTP_FAILURE = "VERIFY_OTP_FAILURE";

export const RESET_PASSWORD_REQUEST = "RESET_PASSWORD_REQUEST";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";
export const RESET_PASSWORD_FAILURE = "RESET_PASSWORD_FAILURE";

// ✅ Envoi OTP
export const sendOtp = (mobile, navigation) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });

  try {
    const response = await fetch(`${API_URL}/users/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Échec de l’envoi de l’OTP.");
    }

    dispatch({ type: SEND_OTP_SUCCESS });
    Alert.alert("نجاح", "تم إرسال رمز التحقق إلى هاتفك.");
    navigation.navigate("VerificationScreen", { phone: mobile });
  } catch (error) {
    dispatch({ type: SEND_OTP_FAILURE, payload: error.message });
    Alert.alert("Erreur", error.message);
  }
};

// ✅ Vérification OTP
export const verifyOtp = (mobile, otp, navigation) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });

  try {
    const response = await fetch(`${API_URL}/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "OTP invalide.");
    }

    dispatch({ type: VERIFY_OTP_SUCCESS });
    Alert.alert("Succès", "OTP validé avec succès.");
    navigation.navigate("ResetPasswordScreen", { phone: mobile });
  } catch (error) {
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
    Alert.alert("Erreur", error.message);
  }
};

// ✅ Réinitialisation du mot de passe
export const resetPassword = (mobile, newPassword, navigation) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });

  try {
    const response = await fetch(`${API_URL}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, newPassword }),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Échec de la réinitialisation du mot de passe.");
    }

    dispatch({ type: RESET_PASSWORD_SUCCESS });
    Alert.alert("✅ تم إعادة تعيين كلمة المرور بنجاح!");

    navigation.navigate("SignIn");
  } catch (error) {
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: error.message });
    Alert.alert("❌ فشل إعادة تعيين كلمة المرور، حاول مرة أخرى.");
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

         //   console.log("✅ Children loaded from AsyncStorage:", children);

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
      await AsyncStorage.setItem("activeChildId", child.id.toString());
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
// fetching teacher informations
// fetching teacher informations
export const FETCH_TEACHER_REQUEST = "FETCH_TEACHER_REQUEST";
export const FETCH_TEACHER_SUCCESS = "FETCH_TEACHER_SUCCESS";
export const FETCH_TEACHER_FAILURE = "FETCH_TEACHER_FAILURE";
export const SET_IS_FOLLOWING = "SET_IS_FOLLOWING";
export const SET_FOLLOWERS_COUNT = "SET_FOLLOWERS_COUNT";

// Fetch teacher profile and follow info
export const fetchTeacherById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_TEACHER_REQUEST });

  try {
    const response = await fetch(`${API_URL}/teachers/${id}`);
    const text = await response.text();
   // console.log("🔎 API Raw Response:", text);

    const data = JSON.parse(text);

    if (!response.ok) throw new Error(data.error || "Failed to fetch teacher");

    dispatch({ type: FETCH_TEACHER_SUCCESS, payload: data });

    const followerId = await AsyncStorage.getItem("activeChildId");

    const [followingRes, countRes] = await Promise.all([
      fetch(`${API_URL}/follows/is-following/${followerId}/${id}`),
      fetch(`${API_URL}/follows/count/${id}`)
    ]);

    const followingData = await followingRes.json();
    const countData = await countRes.json();

    dispatch({ type: SET_IS_FOLLOWING, payload: followingData.isFollowing });
    dispatch({ type: SET_FOLLOWERS_COUNT, payload: countData.followers });

  } catch (error) {
    console.error("❌ Error fetching teacher:", error.message);
    dispatch({ type: FETCH_TEACHER_FAILURE, payload: error.message });
  }
};

// Toggle follow/unfollow status
export const toggleFollow = (teacherId) => async (dispatch) => {
  try {
    const follower = await AsyncStorage.getItem("activeChildId");

    if (!follower) {
      console.warn("⚠️ Aucun enfant sélectionné");
      return;
    }

    const isFollowingRes = await fetch(`${API_URL}/follows/is-following/${follower}/${teacherId}`);
    const { isFollowing } = await isFollowingRes.json();

    const url = `${API_URL}/follows/${isFollowing ? "unsubscribe" : "subscribe"}`;
    const method = isFollowing ? "DELETE" : "POST";

    const followRes = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower, user_id: teacherId }),
    });

    const followData = await followRes.json();

    if (!followRes.ok) {
      console.warn("❌ Erreur lors du follow/unfollow :", followData?.error || "Erreur inconnue");
      return;
    }

    dispatch({ type: SET_IS_FOLLOWING, payload: !isFollowing });

    // Update followers count
    const countRes = await fetch(`${API_URL}/follows/count/${teacherId}`);
    if (countRes.ok) {
      const countData = await countRes.json();
      dispatch({ type: SET_FOLLOWERS_COUNT, payload: countData.followers });
    } else {
      console.warn("⚠️ Failed to fetch updated followers count");
    }

  } catch (error) {
    console.error("❌ Follow/unfollow error:", error);
  }
};

// notifications

export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
export const FETCH_NOTIFICATIONS_FAILURE = "FETCH_NOTIFICATIONS_FAILURE";

export const fetchNotifications = (childId) => async (dispatch) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });

  try {
    const response = await fetch(`${API_URL}/notifications/child/${childId}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Échec récupération notifications");

    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error.message);
    dispatch({ type: FETCH_NOTIFICATIONS_FAILURE, payload: error.message });
  }
};

// fetch manuel by level and videos by mmanuel for BooksScreen 

export const FETCH_MANUELS_SUCCESS = "FETCH_MANUELS_SUCCESS";
export const FETCH_VIDEO_COUNTS_SUCCESS = "FETCH_VIDEO_COUNTS_SUCCESS";

// ✅ Fetch manuels par niveau
export const fetchManuelsByLevel = (levelId) => async (dispatch) => {
  dispatch({ type: "AUTH_LOADING" });
  try {
    const response = await fetch(`${API_URL}/manuels/level/${levelId}`);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: FETCH_MANUELS_SUCCESS, payload: data });
    } else {
      console.error("❌ Error fetching manuels:", data.error);
    }
  } catch (error) {
    console.error("❌ Error fetching manuels:", error);
  }
};

// ✅ Fetch nombre de vidéos par manuel
export const fetchVideoCounts = () => async (dispatch) => {
  try {
    const response = await fetch(`${API_URL}/videos/count-by-manuel`);
    const data = await response.json();

    if (response.ok) {
      const formatted = {};
      data.forEach((item) => {
        formatted[item.manuel_id] = item.totalVideos;
      });
      dispatch({ type: FETCH_VIDEO_COUNTS_SUCCESS, payload: formatted });
    } else {
      console.error("❌ Error fetching video counts:", data.error);
    }
  } catch (error) {
    console.error("❌ Error fetching video counts:", error);
  }
};
// ✅  rechercher des webinaires par mot clé et level_id
export const SEARCH_WEBINARS_REQUEST = "SEARCH_WEBINARS_REQUEST";
export const SEARCH_WEBINARS_SUCCESS = "SEARCH_WEBINARS_SUCCESS";
export const SEARCH_WEBINARS_FAILURE = "SEARCH_WEBINARS_FAILURE";

export const fetchWebinarsByKeyword = (levelId, keyword) => async (dispatch) => {
  dispatch({ type: "FETCH_WEBINARS_REQUEST" });

  try {
    const response = await fetch(`${API_URL}/webinars/search/${levelId}/${keyword}`);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "FETCH_WEBINARS_SUCCESS", payload: data });
    } else {
      console.error("❌ Erreur API webinars/search :", data.error);
      dispatch({ type: "FETCH_WEBINARS_FAILURE", payload: data.error });
    }
  } catch (error) {
    console.error("❌ Erreur fetchWebinarsByKeyword :", error.message);
    dispatch({ type: "FETCH_WEBINARS_FAILURE", payload: error.message });
  }
};

// ✅ Ajouter un webinar comme favori
export const TOGGLE_FAVORITE_SUCCESS = "TOGGLE_FAVORITE_SUCCESS";
export const TOGGLE_FAVORITE_FAILURE = "TOGGLE_FAVORITE_FAILURE";
export const FETCH_FAVORITES_SUCCESS = "FETCH_FAVORITES_SUCCESS";

export const toggleFavorite = (webinarId) => async (dispatch) => {
  try {
    const tokenChild = await AsyncStorage.getItem("tokenChild"); 
    if (!tokenChild) throw new Error("Token enfant manquant !");

    const response = await fetch(`${API_URL}/likes/favorite/${webinarId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenChild}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Erreur lors du toggle favori");

    dispatch({
      type: TOGGLE_FAVORITE_SUCCESS,
      payload: { webinarId, isFavorite: data.isFavorite }
    });

    dispatch(fetchFavorites());
  } catch (error) {
    console.error("❌ Erreur toggleFavorite:", error.message);
  }
};

export const fetchFavorites = () => async (dispatch) => {
  try {
    const tokenChild = await AsyncStorage.getItem("tokenChild"); 
    if (!tokenChild) throw new Error("Utilisateur non authentifié.");

    const response = await fetch(`${API_URL}/likes/favorites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenChild}`,
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Erreur lors de la récupération des favoris");

    const favoritesIds = data.map((w) => w.id);
    dispatch({ type: FETCH_FAVORITES_SUCCESS, payload: favoritesIds });
  } catch (error) {
    console.error("❌ Erreur fetchFavorites:", error.message);
  }
};


// live Sessions = meetings 

export const FETCH_MEETINGS_REQUEST = "FETCH_MEETINGS_REQUEST";
export const FETCH_MEETINGS_SUCCESS = "FETCH_MEETINGS_SUCCESS";
export const FETCH_MEETINGS_FAILURE = "FETCH_MEETINGS_FAILURE";

export const FETCH_RESERVATIONS_REQUEST = "FETCH_RESERVATIONS_REQUEST";
export const FETCH_RESERVATIONS_SUCCESS = "FETCH_RESERVATIONS_SUCCESS";
export const FETCH_RESERVATIONS_FAILURE = "FETCH_RESERVATIONS_FAILURE";

export const UPDATE_RESERVATION_REQUEST = "UPDATE_RESERVATION_REQUEST";
export const UPDATE_RESERVATION_SUCCESS = "UPDATE_RESERVATION_SUCCESS";
export const UPDATE_RESERVATION_FAILURE = "UPDATE_RESERVATION_FAILURE";

// 🔹 Fetch All Meetings
export const fetchMeetings = () => async (dispatch) => {
  dispatch({ type: FETCH_MEETINGS_REQUEST });

  try {
    const response = await fetch(`${API_URL}/meetings`);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: FETCH_MEETINGS_SUCCESS, payload: data });
    } else {
      dispatch({ type: FETCH_MEETINGS_FAILURE, payload: data.error });
    }
  } catch (error) {
    dispatch({ type: FETCH_MEETINGS_FAILURE, payload: error.message });
  }
};
// 🔹 Fetch Meetings by Level ID
export const fetchMeetingsByLevel = (levelId) => async (dispatch) => {
  dispatch({ type: FETCH_MEETINGS_REQUEST });

  try {
    const tokenChild = await AsyncStorage.getItem("tokenChild");  // 🔥 Utilisation du token de l'enfant
    if (!tokenChild) throw new Error("Token d'enfant manquant !");

    const response = await fetch(`${API_URL}/meetings/level/${levelId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenChild}`,  // ✅ Utilisation du token d'enfant ici
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: FETCH_MEETINGS_SUCCESS, payload: data });
    } else {
      console.error("❌ Erreur API meetings : ", data.message);
      dispatch({ type: FETCH_MEETINGS_FAILURE, payload: data.message || "Erreur lors de la récupération des meetings" });
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des meetings : ", error.message);
    dispatch({ type: FETCH_MEETINGS_FAILURE, payload: error.message });
  }
};

// 🔹 Fetch Reservations by User ID
export const fetchReservationsByUserId = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_RESERVATIONS_REQUEST });

  try {
      const token = await AsyncStorage.getItem("childToken");
      const response = await fetch(`${API_URL}/meetings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
          dispatch({ type: FETCH_RESERVATIONS_SUCCESS, payload: data });
      } else {
          dispatch({ type: FETCH_RESERVATIONS_FAILURE, payload: data.error });
      }
  } catch (error) {
      dispatch({ type: FETCH_RESERVATIONS_FAILURE, payload: error.message });
  }
};



// 🔹 Update Reservation
export const updateReservation = (reservationId, updateData) => async (dispatch) => {
    dispatch({ type: UPDATE_RESERVATION_REQUEST });

    try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/meetings/reserve/${reservationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({ type: UPDATE_RESERVATION_SUCCESS, payload: data });
        } else {
            dispatch({ type: UPDATE_RESERVATION_FAILURE, payload: data.error });
        }
    } catch (error) {
        dispatch({ type: UPDATE_RESERVATION_FAILURE, payload: error.message });
    }
};
export const FETCH_MEETING_BY_ID_REQUEST = "FETCH_MEETING_BY_ID_REQUEST";
export const FETCH_MEETING_BY_ID_SUCCESS = "FETCH_MEETING_BY_ID_SUCCESS";
export const FETCH_MEETING_BY_ID_FAILURE = "FETCH_MEETING_BY_ID_FAILURE";

export const fetchMeetingById = (meetingId) => async (dispatch) => {
  dispatch({ type: FETCH_MEETING_BY_ID_REQUEST });

  try {
    console.log(`🔍 Fetching meeting with ID: ${meetingId}`);
    
    const response = await fetch(`${API_URL}/meetings/${meetingId}`);
    const data = await response.json();

    console.log("📥 API Response:", data);

    if (response.ok) {
      // Check if data is an array and has at least one element
      if (Array.isArray(data) && data.length > 0) {
        console.log("✅ Meeting data found:", data[0]);
        dispatch({ type: FETCH_MEETING_BY_ID_SUCCESS, payload: data[0] });
      } else if (typeof data === 'object' && data !== null) {
        // If data is a single object
        console.log("✅ Meeting data found:", data);
        dispatch({ type: FETCH_MEETING_BY_ID_SUCCESS, payload: data });
      } else {
        console.error("❌ No meeting data found in response");
        dispatch({ type: FETCH_MEETING_BY_ID_FAILURE, payload: "No meeting data found" });
      }
    } else {
      console.error("❌ API Error:", data.message || "Failed to fetch meeting");
      dispatch({ type: FETCH_MEETING_BY_ID_FAILURE, payload: data.message || "Failed to fetch meeting" });
    }
  } catch (error) {
    console.error("❌ Error fetching meeting:", error.message);
    dispatch({ type: FETCH_MEETING_BY_ID_FAILURE, payload: error.message });
  }
}; 

export const RESERVE_MEETING_REQUEST = 'RESERVE_MEETING_REQUEST';
export const RESERVE_MEETING_SUCCESS = 'RESERVE_MEETING_SUCCESS';
export const RESERVE_MEETING_FAILURE = 'RESERVE_MEETING_FAILURE';

// Réserver un meeting
export const reserveMeeting = (meetingData, token) => async (dispatch) => {
  dispatch({ type: "RESERVE_MEETING_REQUEST" });

  try {
      // 🔍 Adding sale_id if it exists in the meetingData
      const meetingDataWithSale = {
          ...meetingData,
          sale_id: meetingData.sale_id || meetingData.meeting_id  // Use sale_id if available, otherwise fallback to meeting_id
      };
      
      console.log("📦 [Payload envoyé au backend pour la réservation] :", JSON.stringify(meetingDataWithSale, null, 2));

      const response = await fetch(`${API_URL}/meetings/reserve`, {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(meetingDataWithSale)
      });

      const data = await response.json();
      console.log("📥 [Réponse du serveur - Réservation] :", JSON.stringify(data, null, 2));

      if (response.ok) {
          dispatch({ 
              type: "RESERVE_MEETING_SUCCESS", 
              payload: data 
          });

          // ✅ Reset reservationSuccess flag after a short delay (to avoid infinite alerts)
          setTimeout(() => {
              dispatch({ type: "RESET_RESERVATION_SUCCESS" });
          }, 1000);
      } else {
          // If the first attempt fails, try without sale_id
          if (data.message && (data.message.includes("sale_id") || data.message.includes("Vente non trouvée"))) {
              console.log("⚠️ [Avertissement] - Erreur liée au sale_id, tentative de réservation sans sale_id");
              
              // Try again without sale_id
              const retryPayload = { ...meetingData };
              
              console.log("🔄 [Nouvelle tentative] - Sans sale_id:", JSON.stringify(retryPayload, null, 2));
              
              const retryResponse = await fetch(`${API_URL}/meetings/reserve`, {
                  method: 'POST',
                  headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(retryPayload)
              });
              
              const retryData = await retryResponse.json();
              console.log("📥 [Réponse du serveur (2ème tentative)] :", JSON.stringify(retryData, null, 2));
              
              if (retryResponse.ok) {
                  dispatch({ 
                      type: "RESERVE_MEETING_SUCCESS", 
                      payload: retryData 
                  });

                  // ✅ Reset reservationSuccess flag after a short delay
                  setTimeout(() => {
                      dispatch({ type: "RESET_RESERVATION_SUCCESS" });
                  }, 1000);
              } else {
                  const errorMessage = retryData.message || retryData.error || "Erreur inconnue";
                  console.log("❌ [Erreur Serveur - Réservation] :", errorMessage);
                  dispatch({ 
                      type: "RESERVE_MEETING_FAILURE", 
                      payload: errorMessage 
                  });
              }
          } else {
              const errorMessage = data.message || data.error || "Erreur inconnue";
              console.log("❌ [Erreur Serveur - Réservation] :", errorMessage);
              dispatch({ 
                  type: "RESERVE_MEETING_FAILURE", 
                  payload: errorMessage 
              });
          }
      }
  } catch (error) {
      console.log("🚨 [Erreur Fetch - Réservation] :", error.message);
      dispatch({ 
          type: "RESERVE_MEETING_FAILURE", 
          payload: error.message || "Erreur de connexion au serveur" 
      });
  }
};

export const CANCEL_RESERVATION_REQUEST = "CANCEL_RESERVATION_REQUEST";
export const CANCEL_RESERVATION_SUCCESS = "CANCEL_RESERVATION_SUCCESS";
export const CANCEL_RESERVATION_FAILURE = "CANCEL_RESERVATION_FAILURE";
//cancel meeting
export const cancelReservation = (reservationId) => async (dispatch) => {
  dispatch({ type: CANCEL_RESERVATION_REQUEST });
  
  try {
      const token = await AsyncStorage.getItem('tokenChild');
      if (!token) {
          throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/meetings/cancel/${reservationId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      const data = await response.json();
      
      if (!response.ok) {
          throw new Error(data.message || 'Failed to cancel reservation');
      }

      // Make sure we include the meeting_id in the payload
      const payload = {
          ...data,
          // Only try to split reservationId if it exists and is a string
          meeting_id: data.meeting_id || (typeof reservationId === 'string' ? reservationId.split('_')[0] : null)
      };

      dispatch({ type: CANCEL_RESERVATION_SUCCESS, payload });
      
      // Refresh the meetings list to ensure it's up to date
      if (data.level_id) {
          dispatch(fetchMeetingsByLevel(data.level_id));
      }
  } catch (error) {
      dispatch({ type: CANCEL_RESERVATION_FAILURE, payload: error.message });
  }
}; 