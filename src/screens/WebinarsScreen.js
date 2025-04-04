import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Logout, fetchWebinarsByLevel, fetchWebinarsByKeyword, toggleFavorite , fetchFavorites} from "../reducers/auth/AuthAction";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import ChildSwitcher from "../components/ChildSwitcher";

const getInitials = (fullName) => {
  if (!fullName) return "؟";
  const names = fullName.trim().split(" ");
  return names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : names[0].slice(0, 2).toUpperCase();
};

const WebinarsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const children = useSelector((state) => state.auth.children);
  const activeChild = useSelector((state) => state.auth.activeChild) || children[0];
  const { webinars, loading } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => dispatch(Logout(navigation))} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, dispatch]);

  useEffect(() => {
    if (activeChild?.level_id) {
      dispatch(fetchWebinarsByLevel(activeChild.level_id));
    }
  }, [activeChild, dispatch]);

  useEffect(() => {
    if (searchText.trim() !== "" && activeChild?.level_id) {
      dispatch(fetchWebinarsByKeyword(activeChild.level_id, searchText.trim()));
    } else if (activeChild?.level_id) {
      dispatch(fetchWebinarsByLevel(activeChild.level_id));
    }
  }, [searchText]);
  

  useEffect(() => {
    if (searchText.trim() === "") {
      if (activeChild?.level_id) dispatch(fetchWebinarsByLevel(activeChild.level_id));
    }
  }, [searchText]);

  const handleSearch = () => {
    if (searchText.trim() && activeChild?.level_id) {
      dispatch(searchWebinarsByKeyword(activeChild.level_id, searchText.trim()));
    }
  };
  useEffect(() => {
    dispatch(fetchFavorites()); // Charger les favoris lorsque l'écran est monté
  }, []);

  const handleToggleFavorite = async (webinarId) => {
    const tokenChild = await AsyncStorage.getItem("tokenChild");
    if (!tokenChild) {
      console.log("❌ Aucun token d'enfant trouvé.");
      return;
    }

    dispatch(toggleFavorite(webinarId)); // Appeler l'action toggleFavorite
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0097A7" style={styles.loading} />
      ) : (
        <FlatList
          data={webinars}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.webinarsList}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                {/* <ChildSwitcher /> */}
                <View style={styles.headerBottom}>
                  <Text style={styles.title}> الدروس الإضافية</Text>
                  <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate("Settings", { screen: "Notifications" })}>
                      <Image source={require("../../assets/icons/notifications.png")} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image source={require("../../assets/icons/coin.png")} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="🔎 ابحث عن درس..."
                  value={searchText}
                  onChangeText={setSearchText}
                  textAlign="right"
                />
                <TouchableOpacity
                style={styles.searchButton}
                onPress={() => {
                  if (searchText.trim() !== "") {
                    dispatch(fetchWebinarsByKeyword(activeChild.level_id, searchText));
                  } else {
                    dispatch(fetchWebinarsByLevel(activeChild.level_id));
                  }
                }}
              >
                <Ionicons name="search" size={22} color="white" />
              </TouchableOpacity>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.webinarContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("WebinarDetail", { webinarId: item.id })}
              >
                <View style={styles.webinarCard}>
                  <Image
                    source={{ uri: `https://www.abajim.com/${item.image_cover}` }}
                    style={styles.webinarImage}
                  />
                  <View style={styles.webinarDetails}>
                    <Text style={styles.webinarTitle}>{item.slug}</Text>
          
                    <View style={styles.infoContainer}>
                      {item.teacher?.avatar ? (
                        <Image
                          source={{ uri: `https://www.abajim.com/${item.teacher.avatar}` }}
                          style={styles.teacherAvatar}
                        />
                      ) : (
                        <View style={styles.initialsCircle}>
                          <Text style={styles.initialsText}>{getInitials(item.teacher?.full_name)}</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Teacher", { teacherId: item.teacher?.id })}
                      >
                        <Text style={[styles.detailText, { textDecorationLine: "underline", color: "#0097A7" }]}>
                          {item.teacher?.full_name || "غير متوفر"}
                        </Text>
                      </TouchableOpacity>
                    </View>
          
                    <View style={styles.infoContainer}>
                      <Ionicons name="time-outline" size={18} color="#0097A7" />
                      <Text style={styles.detailText}>
                        {item.duration ? `${item.duration} دقيقة` : "غير متوفر"}
                      </Text>
                    </View>
                    <View style={styles.infoContainer}>
                      <Ionicons name="cash-outline" size={18} color="#0097A7" />
                      <Text style={styles.detailText}>
                        {item.price ? `${item.price} د.ت` : "مجاني"}
                      </Text>
                    </View>
          
                    <Text style={styles.webinarDescription} numberOfLines={2}>
                      {item.description || "لا يوجد وصف متاح لهذا الدرس."}
                    </Text>
          
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => dispatch(toggleFavorite(item.id))}
                    >
                      <Ionicons
                        name={item.isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={item.isFavorite ? "red" : "#0097A7"}
                      />
                      <Text style={styles.favoriteText}>
                        {item.isFavorite ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noWebinarsText}>🚫 لا يوجد دروس فيديو متاحة لهذا المستوى</Text>
          }
        />
      )}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#0097A7",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },

  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "right",
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
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    margin: 15,
    paddingHorizontal: 10,
    elevation: 3,
  },

  searchInput: { flex: 1, paddingVertical: 8, fontSize: 16, textAlign: "right" },

  searchButton: {
    backgroundColor: "#1F3B64",
    padding: 11,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },

  webinarsList: {
    paddingBottom: 90,
  },

  webinarContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  webinarCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  webinarImage: { width: 130, height: 130, borderRadius: 10 },

  webinarDetails: { marginRight: 15, flex: 1 },

  webinarTitle: { fontSize: 16, fontWeight: "bold", color: "#1F3B64", textAlign: "right" },

  infoContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },

  detailText: { fontSize: 14, color: "#555", textAlign: "right" },

  webinarDescription: { fontSize: 12, color: "#777", marginTop: 8, textAlign: "right" },

  teacherAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 5,
  },

  initialsCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0097A7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },

  initialsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  noWebinarsText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },

  logoutButton: {
    marginRight: 15,
  },

  loading: {
    marginTop: 20,
  },
  favoriteButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
  },
  favoriteText: {
    color: "#0097A7",
    fontSize: 14,
    marginRight: 6,
  },
  
});

export default WebinarsScreen;
