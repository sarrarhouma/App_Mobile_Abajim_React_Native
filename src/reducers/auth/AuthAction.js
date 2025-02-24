import AsyncStorage from "@react-native-async-storage/async-storage";
export const API_URL = 'https://4fc7-196-179-217-114.ngrok-free.app/api'; 
import { Alert } from "react-native";

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

      console.log("✅ Inscription réussie !");
      Alert.alert("Succès", "Inscription réussie !");

      // ✅ Store the token
      await AsyncStorage.setItem("token", resData.token);

      // ✅ Update Redux Store with Token
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: resData.token, 
      });

      console.log("🔄 Vérification du nombre d'enfants...");

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
        console.log("🟡 Aucun enfant trouvé. Redirection vers AddKids...");
        navigation.reset({
          index: 0,
          routes: [{ name: "AddKids" }],
        });
      } else {
        console.log("🟢 Enfants trouvés. Redirection vers Books...");
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
                console.warn("⚠️ No token found in AsyncStorage.");
                return;
            }

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: token,
            });

            console.log("🔄 Fetching children from AsyncStorage...");
            let childrenData = await AsyncStorage.getItem("children");
            let parsedChildren = childrenData ? JSON.parse(childrenData) : [];

            if (parsedChildren.length > 0) {
                console.log("✅ Children found in AsyncStorage:", parsedChildren);
                dispatch({
                    type: "FETCH_CHILDREN_SUCCESS",
                    payload: parsedChildren,
                });
            }

            // ✅ Fetch the latest children data from the API
            console.log("🔄 Fetching fresh children data from the API...");
            const childrenResponse = await fetch(`${API_URL}/enfants`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!childrenResponse.ok) {
                console.warn("⚠️ Failed to fetch children from backend.");
                return;
            }

            const latestChildren = await childrenResponse.json();

            // ✅ Ensure fresh data is stored and compared before updating Redux
            if (JSON.stringify(latestChildren) !== JSON.stringify(parsedChildren)) {
                console.log("🆕 Updating AsyncStorage with fresh children data...");
                await AsyncStorage.setItem("children", JSON.stringify(latestChildren));
                dispatch({
                    type: "FETCH_CHILDREN_SUCCESS",
                    payload: latestChildren,
                });
            }
            // ✅ Set first child as active if no active child is stored
            const activeChild = await AsyncStorage.getItem("activeChild");
            if (!activeChild && latestChildren.length > 0) {
                console.log("🔄 Setting default active child:", latestChildren[0].full_name);
                await AsyncStorage.setItem("activeChild", JSON.stringify(latestChildren[0]));
                dispatch({
                    type: "SWITCH_ACTIVE_CHILD",
                    payload: latestChildren[0],
                });
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

      console.log("🔄 Sending Add Child Request...");
      
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
          console.log("✅ Child added:", resData);
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

// ✅ Fetch Children (Updated to use the new `users` table)
export const fetchChildren = () => async (dispatch, getState) => {
  try {
      const parentToken = await AsyncStorage.getItem("token"); // ✅ Ensure we use the parent's token

      if (!parentToken) {
          console.error("❌ Token missing.");
          return;
      }

      dispatch({ type: "AUTH_LOADING" });

      console.log("🔄 Fetching children...");

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
  return async (dispatch, getState) => {
    try {
      console.log(`🔄 Switching to child: ${child.full_name} (ID: ${child.id})`);

      const parentToken = await AsyncStorage.getItem("token"); // ✅ Keep the parent's token for verification
      if (!parentToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(`${API_URL}/users/switch-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parentToken}`, // ✅ Use parent's token to verify the switch
        },
        body: JSON.stringify({ childId: child.id }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to switch child.");
      }

      console.log("✅ Child switched successfully:", resData);

      // ✅ Store new token and active child
      await AsyncStorage.setItem("token", resData.token); // 🔄 Store child's token
      await AsyncStorage.setItem("activeChild", JSON.stringify(resData.child));

      dispatch({
        type: "SWITCH_ACTIVE_CHILD",
        payload: {
          child: resData.child,
          token: resData.token, // ✅ Update token for API calls
        },
      });

    } catch (error) {
      console.error("❌ Error switching child:", error.message);
    }
  };
};



