import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Logout, switchChild } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import API_BASE_URL from "../utils/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BooksScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [manuals, setManuals] = useState([]);

  const children = useSelector((state) => state.auth.children);
  const activeChild = useSelector((state) => state.auth.activeChild) || children[0]; // ✅ Set first child by default

  // ✅ Function to Open Document
  const handleOpenDocument = (documentUrl) => {
    console.log("📄 Opening document URL:", documentUrl);
    navigation.navigate("DocumentScreen", { documentUrl });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => dispatch(Logout(navigation))}
          style={styles.logoutButton}
        >
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, dispatch]);

  useEffect(() => {
    if (activeChild?.level_id) {
      fetchManuelsByLevel(activeChild.level_id);
    }
  }, [activeChild]);

  const fetchManuelsByLevel = async (level_id) => {
    try {
      setLoading(true);
      console.log(`🔄 Fetching books for level: ${level_id}`);

      const response = await fetch(`${API_BASE_URL}/manuels/level/${level_id}`);
      const data = await response.json();

      if (response.ok) {
        setManuals(data);
      } else {
        console.error("❌ Error fetching books:", data.error);
        setManuals([]);
      }
    } catch (error) {
      console.error("❌ Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Child Switch
  const handleSwitchChild = async (child) => {
    try {
      console.log(`🔄 Switching to child: ${child.full_name} (ID: ${child.id})`);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/users/switch-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ childId: child.id }),
      });

      const resData = await response.json();

      if (response.ok) {
        console.log("✅ Child switched successfully:", resData);
        await AsyncStorage.setItem("token", resData.token);
        dispatch(switchChild(resData));
      } else {
        console.error("❌ Error switching child:", resData.error);
      }
    } catch (error) {
      console.error("❌ Error switching child:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Rounded Header with Parent & Children Profiles */}
      <View style={styles.header}>
        {/* 🔹 Parent & Children Profiles in One Row */}
        <View style={styles.profileContainer}>
          {/* ✅ Parent Profile */}
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.parentProfileWrapper}>
            <Image source={require("../../assets/icons/avatar1.png")} style={styles.parentProfile} />
          </TouchableOpacity>

          {/* ✅ Children Profiles */}
          <FlatList
  data={children}
  horizontal
  keyExtractor={(item) => item.id.toString()}
  showsHorizontalScrollIndicator={false}
  renderItem={({ item }) => {
    const avatarUrl = item.avatar.startsWith("http")
      ? item.avatar
      : `https://www.abajim.com/${item.avatar.startsWith("/") ? item.avatar.substring(1) : item.avatar}`;

    return (
      <TouchableOpacity 
        onPress={() => {
          console.log(`🔄 Switching to child: ${item.full_name} (ID: ${item.id})`);
          dispatch(switchChild(item));
        }}
        style={[
          styles.childProfileWrapper,
          activeChild?.id === item.id && styles.activeChildBorder, // ✅ Highlight selected child
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

        </View>

        {/* 🔹 Title & Icons in the same row */}
        <View style={styles.headerBottom}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>📚 الكتب المدرسية</Text>

            {/* 🔹 Icons next to title */}
            <View style={styles.headerIcons}>
              <TouchableOpacity>
                <Image source={require("../../assets/icons/bell.png")} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require("../../assets/icons/coin.png")} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 🔹 Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />
      ) : manuals.length > 0 ? (
        <FlatList
          data={manuals}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookContainer} onPress={() => handleOpenDocument(item)}>
              <View style={styles.bookCard}>
                <Image source={{ uri: "https://www.abajim.com/" + item.logo }} style={styles.bookImage} />
                <Text style={styles.bookTitle}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.booksList}
        />
      ) : (
        <Text style={styles.noBooksText}>لا يوجد كتب متاحة لهذا المستوى</Text>
      )}

      {/* ✅ Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#0097A7",
    paddingHorizontal: 25,
    paddingVertical: 40,
    borderBottomLeftRadius: 30,  
    borderBottomRightRadius: 30, 
    alignItems: "center",
    justifyContent: "center",
  },
  
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 15,
  },
  
  titleContainer: {
    flexDirection: "row",
    alignItems: "center", // ✅ Align text & icons in one row
    justifyContent: "center",
  },
  
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 30,
    alignItems: "center", // ✅ Space between title & icons
  },
  
  headerIcons: {
    flexDirection: "row",
   alignItems: "center",
  },
  
  icon: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  
  parentProfileWrapper: {
    alignItems: "center",
    marginRight: 15,
  },

  parentProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFF",
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 5,
  },

  booksList: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  bookContainer: {
    flex: 1,
    marginVertical:20, 
    marginHorizontal: 45, 
    alignItems: "center",
  },

  bookCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: 180,
  },

  bookImage: { width: 170, height: 180, borderRadius: 10 },

  bookTitle: {
    fontSize: 14,
    marginTop: 8,
    color: "#1F3B64",
    fontWeight: "bold",
    textAlign: "center",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  logoutButton: { marginRight: 15 },
  loading: { marginTop: 20 },

  noBooksText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },
});

export default BooksScreen;
