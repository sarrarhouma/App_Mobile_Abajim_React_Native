import React from "react";
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { switchChild } from "../reducers/auth/AuthAction";
import { useNavigation } from "@react-navigation/native";

// ✅ Génère une couleur aléatoire cohérente à partir du nom
const getRandomColorFromString = (str) => {
  const colors = [
    "#FF8A80", "#FFB74D", "#81C784", "#4DD0E1", "#9575CD", "#F06292", "#BA68C8", "#1F3B64",
    "#F44336", "#E91E63", "#9C27B0", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688",
    "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B"
  ];  
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const ChildSwitcher = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const children = useSelector((state) => state.auth.children);
  const activeChild = useSelector((state) => state.auth.activeChild) || children[0];
  const parentInfo = useSelector((state) => state.auth.parentInfo);

  const getInitials = (fullName) => {
    if (!fullName) return "؟";
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {/* ✅ Parent */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings", { screen: "ParentInfo" })}
            style={styles.parentProfileWrapper}
          >
            {parentInfo?.avatar ? (
              <Image
                source={{ uri: parentInfo.avatar }}
                style={styles.parentProfile}
              />
            ) : (
              <View style={[
                styles.initialsWrapper,
                { backgroundColor: getRandomColorFromString(parentInfo?.full_name || "ولي الأمر") },
              ]}>
                <Text style={styles.initialsText}>{getInitials(parentInfo?.full_name)}</Text>
              </View>
            )}
            <Text style={styles.parentName}>{parentInfo?.full_name || "ولي الأمر"}</Text>
          </TouchableOpacity>

          {/* ✅ Enfants */}
          <View>
            <FlatList
              data={children}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              extraData={activeChild}
              renderItem={({ item }) => {
                const avatarUrl = item.avatar && item.avatar.startsWith("http")
                  ? item.avatar
                  : `https://www.abajim.com/${item.avatar?.startsWith("/") ? item.avatar.substring(1) : item.avatar}`;

                return (
                  <TouchableOpacity
                    onPress={() => dispatch(switchChild(item))}
                    style={[
                      styles.childProfileWrapper,
                      activeChild?.id === item.id && styles.activeChildBorder,
                    ]}
                  >
                    <Image
                      source={{ uri: avatarUrl }}
                      style={styles.childProfile}
                    />
                    {activeChild?.id === item.id && <View style={styles.activeDot} />}
                  </TouchableOpacity>
                );
              }}
            />

            {/* ✅ Message de bienvenue */}
            <Text style={styles.welcomeText}>
               مرحباً صغيري {activeChild?.full_name} 👋
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  parentProfileWrapper: {
    alignItems: "center",
    marginRight: 15,
  },
  parentProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFD700",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  initialsWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1f3b64",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  initialsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  parentName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F3B64",
    marginTop: 5,
  },
  childProfileWrapper: {
    position: "relative",
    marginLeft: 10,
  },
  childProfile: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  activeDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  activeChildBorder: {
    borderWidth: 2,
    borderColor: "#0097A7",
    borderRadius: 30,
    padding: 2,
  },
  welcomeText: {
    marginTop: 8,
    fontSize: 16,
    color: "#1F3B64",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ChildSwitcher;
