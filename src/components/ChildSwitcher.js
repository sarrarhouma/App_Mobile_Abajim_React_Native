import React from "react";
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { switchChild } from "../reducers/auth/AuthAction";
import { useNavigation } from "@react-navigation/native";

const ChildSwitcher = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // ✅ Récupération des données depuis Redux
  const children = useSelector((state) => state.auth.children);
  const activeChild = useSelector((state) => state.auth.activeChild) || children[0]; // ✅ Défaut : Premier enfant
  const parentInfo = useSelector((state) => state.auth.parentInfo); // ✅ Récupérer les infos du parent

  // ✅ Fonction pour récupérer les initiales du parent si aucune image
  const getInitials = (fullName) => {
    if (!fullName) return "؟"; // ✅ Par défaut si vide
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase(); // ✅ Ex: "MA" pour "Majed Ahmed"
    }
    return names[0].slice(0, 2).toUpperCase(); // ✅ Si un seul mot, prendre 2 premières lettres
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header avec profil du parent et des enfants */}
      <View style={styles.header}>
        {/* 🔹 Conteneur des profils Parent & Enfants */}
        <View style={styles.profileContainer}>
          
          {/* ✅ Parent Profile (Navigation vers ParentInfoScreen) */}
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
              <View style={styles.initialsWrapper}>
                <Text style={styles.initialsText}>{getInitials(parentInfo?.full_name)}</Text>
              </View>
            )}
            <Text style={styles.parentName}>{parentInfo?.full_name || "ولي الأمر"}</Text>
          </TouchableOpacity>

          {/* ✅ Profils des enfants */}
          <FlatList
            data={children}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            extraData={activeChild}  // ✅ Assure un re-rendu lors du switch
            renderItem={({ item }) => {
              const avatarUrl = item.avatar && item.avatar.startsWith("http")
                ? item.avatar
                : `https://www.abajim.com/${item.avatar?.startsWith("/") ? item.avatar.substring(1) : item.avatar}`;

              return (
                <TouchableOpacity 
                  onPress={() => {
                    console.log(`🔄 Switching to child: ${item.full_name} (ID: ${item.id})`);
                    dispatch(switchChild(item));
                  }}
                  style={[
                    styles.childProfileWrapper,
                    activeChild?.id === item.id && styles.activeChildBorder, // ✅ Mettre en surbrillance l'enfant actif
                  ]}
                >
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.childProfile}
                  />

                  {/* ✅ Point vert pour l'enfant actif */}
                  {activeChild?.id === item.id && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            }}
          />
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
    borderColor: "#FFD700", // ✅ Cercle doré pour le parent
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5, // ✅ Ombre légère pour effet 3D
  },
  initialsWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0097A7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1f3b64", // ✅ Cercle doré
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
    color: "#333",
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
});

export default ChildSwitcher;
