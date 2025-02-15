import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Logout } from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import missing Ionicons

const books = [
  { id: "1", title: "أنيسي قراءة", image: require("../../assets/books/anisi_kiraa.jpg") },
  { id: "2", title: "أنيسي تمارين", image: require("../../assets/books/anisi_tamarine.jpg") },
  { id: "3", title: "رياضيات", image: require("../../assets/books/riadhiat_1.jpg") },
];

const BooksScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // ✅ Use `useLayoutEffect` inside the component
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={require("../../assets/icons/profile.png")}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>الكتب المدرسية</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/icons/bell.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/icons/coin.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Books List */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookContainer}>
            <Image source={item.image} style={styles.bookImage} />
            <Text style={styles.bookTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.booksList}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/info.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/lessons.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/live-stream.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/settings.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    backgroundColor: "#0097A7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 55,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: { fontSize: 25, fontWeight: "bold", color: "#FFF" },
  headerIcons: { flexDirection: "row" },
  icon: { width: 35, height: 35, marginLeft: 15 },
  profileIcon: { width: 55, height: 55, borderRadius: 20 },
  booksList: { paddingVertical: 20, alignItems: "center" },
  bookContainer: {
    alignItems: "center",
    margin: 15,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bookImage: { width: 150, height: 150, borderRadius: 10 },
  bookTitle: { fontSize: 16, marginTop: 5, color: "#1F3B64", fontWeight: "bold" },
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
  navIcon: { width: 35, height: 35 },
  logoutButton: { marginRight: 15 },
});

export default BooksScreen;
