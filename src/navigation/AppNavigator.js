import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Import Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import forgetPasswordScreen from '../screens/forgetPasswordScreen';
import VerificationScreen from "../screens/VerificationScreen";
import BooksScreen from "../screens/BooksScreen";
import AddKidsScreen from "../screens/AddKidsScreen";
import { Init } from "../reducers"; // Import Init Action


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.authToken);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize User Authentication State on App Start
  useEffect(() => {
    const initAuth = async () => {
      await dispatch(Init());
      setLoading(false);
    };
    initAuth();
  }, [dispatch]);

  // ✅ Show Loading Indicator While Checking Authentication State
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token ? "Books" : "AddKids"}>
        {token === null ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="ForgetPasswordScreen" component={forgetPasswordScreen} options={{ title: 'نسيت كلمة المرور' }} />
            <Stack.Screen name="VerificationScreen" component={VerificationScreen} options={{ title: "التحقق من الحساب" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Books" component={BooksScreen} options={{ title: " الكتب المدرسية" }} />
            <Stack.Screen name="AddKids" component={AddKidsScreen} options={{ title: "إضافة طفل" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;










// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import WelcomeScreen from '../screens/WelcomeScreen';
// import SignUpScreen from '../screens/SignUpScreen';
// import SignInScreen from '../screens/SignInScreen';
// import forgetPasswordScreen from '../screens/forgetPasswordScreen';
// import VerificationScreen from '../screens/VerificationScreen';
// import BooksScreen from '../screens/BooksScreen';
// import AddKidsScreen from '../screens/AddKidsScreen';

// const Stack = createNativeStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Welcome">
//         <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="SignUp" component={SignUpScreen} />
//         <Stack.Screen name="SignIn" component={SignInScreen} />
//         <Stack.Screen name="ForgetPasswordScreen" component={forgetPasswordScreen} options={{ title: 'نسيت كلمة المرور' }} />
//         <Stack.Screen name="VerificationScreen" component={VerificationScreen} options={{ title: 'التحقق من الحساب' }} />
//         <Stack.Screen name="Books" component={BooksScreen} options={{ title: ' الكتب المدرسية'  }} />
//         <Stack.Screen name="addKids" component={AddKidsScreen} options={{ title: ' إضافة طفل'  }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
