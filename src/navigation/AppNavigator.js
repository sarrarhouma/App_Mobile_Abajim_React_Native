import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Import Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import ForgetPasswordScreen from "../screens/forgetPasswordScreen";
import VerificationScreen from "../screens/VerificationScreen";
import BooksScreen from "../screens/BooksScreen";
import AddKidsScreen from "../screens/AddKidsScreen";
import DocumentScreen from "../screens/DocumentScreen";
import Lessons from "../screens/lessonsScreen";

import { Init, fetchChildren } from "../reducers/auth/AuthAction";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.authToken);
  const children = useSelector((state) => state.auth.children) || [];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(Init()); 
  
      if (token) {
        await dispatch(fetchChildren());  // ✅ Ensure children are loaded
      }
      console.log("Number of children:", children.length); // ✅ Initialize auth state
       
      setLoading(false);  // ✅ Done loading
    };

    initializeApp();
  }, [dispatch, token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? (children.length === 0 ? "AddKids" : "Books") : "Welcome"}       
      >       
        {!token ? (
          <>
            {/* User NOT logged in */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
            <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
          </>
        ) : (
          <>
            {/* If user has children, go to Books. Otherwise, show AddKids */}
            <Stack.Screen name="Books" component={BooksScreen} options={{ title: "الكتب المدرسية" }} />
            <Stack.Screen name="DocumentScreen" component={DocumentScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddKids" component={AddKidsScreen} options={{ title: "إضافة طفل" }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: " إعدادات" }} />
            <Stack.Screen name="Lessons" component={AddKidsScreen} options={{ title: "إضافة طفل" }} />
            <Stack.Screen name="LiveSession" component={SettingsScreen} options={{ title: " إعدادات" }} />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
