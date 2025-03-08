import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import ParentInfoScreen from "../screens/ParentInfoScreen";
import KidsListScreen from "../screens/KidsListScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import MyCardScreen from "../screens/MyCardScreen";
import ForgetPasswordScreen from "../screens/forgetPasswordScreen";
import VerificationScreen from "../screens/VerificationScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen}options={{ title: "الكتب المدرسية" }} />
      <Stack.Screen name="ParentInfo" component={ParentInfoScreen} />
      <Stack.Screen name="KidsList" component={KidsListScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="MyCard" component={MyCardScreen} />
      <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
