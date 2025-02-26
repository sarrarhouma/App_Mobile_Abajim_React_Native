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
import { Logout } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import API_BASE_URL from "../utils/Config";
import ChildSwitcher from "../components/ChildSwitcher"; // ✅ ChildSwitcher Component

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


  return (
    <View style={styles.container}>
      {/* 🔹 BLUE HEADER BACKGROUND (RESTORED) */}
      <View style={styles.header}>
        <ChildSwitcher /> {/* ✅ New Component for Parent & Children Profiles */}
        {/* 🔹 Title & Icons */}
        <View style={styles.headerBottom}>
          <Text style={styles.title}>📚 الكتب المدرسية</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },

  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    alignItems: "center",
    color: "#FFF",
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

  booksList: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  bookContainer: {
    flex: 1,
    marginVertical: 15,
    marginHorizontal: 10,
    alignItems: "center",
  },

  bookCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: 190,
  },

  bookImage: { width: 160, height: 170, borderRadius: 10 },

  bookTitle: {
    fontSize: 13,
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
