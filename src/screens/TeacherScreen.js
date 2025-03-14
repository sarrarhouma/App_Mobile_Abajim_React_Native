import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherById, toggleFollow } from "../reducers/auth/AuthAction";

const getInitials = (fullName) => {
  if (!fullName) return "؟";
  const names = fullName.trim().split(" ");
  return names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : names[0].slice(0, 2).toUpperCase();
};

const TeacherScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { teacherId } = route.params;

  const teacher = useSelector((state) => state.auth.teacherProfile);
  const loading = useSelector((state) => state.auth.isLoading);
  const isFollowing = useSelector((state) => state.auth.isFollowing);
  const followersCount = useSelector((state) => state.auth.followersCount);

  useEffect(() => {
    if (teacherId) dispatch(fetchTeacherById(teacherId));
  }, [teacherId]);

  if (loading || !teacher) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0097A7" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🎯 En-tête avec image de couverture */}
      <View style={styles.coverContainer}>
        {teacher.cover_img && (
          <Image
            source={{ uri: `https://www.abajim.com/${teacher.cover_img}` }}
            style={styles.coverImage}
          />
        )}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>👨‍🏫 الملف الشخصي للمعلم</Text>
      </View>

      {/* 📌 Avatar & informations */}
      <View style={styles.profileContainer}>
        {teacher.avatar ? (
          <Image
            source={{ uri: `https://www.abajim.com/${teacher.avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{getInitials(teacher.full_name)}</Text>
          </View>
        )}

        {/* 💡 Ligne: bouton suivi + nombre de followers */}
        <View style={styles.followRow}>
          <TouchableOpacity
            onPress={() => dispatch(toggleFollow(teacher.id))}
            style={[styles.followButton, isFollowing ? styles.unfollow : styles.follow]}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? "إلغاء المتابعة" : "➕ متابعة"}
            </Text>
          </TouchableOpacity>

          <View style={styles.followerBox}>
            <Ionicons name="people" size={18} color="#0097A7" />
            <Text style={styles.followerText}>{followersCount} متابع</Text>
          </View>
        </View>

        {/* 👤 Nom & Bio */}
        <Text style={styles.name}>{teacher.full_name}</Text>
        <Text style={styles.bio}>{teacher.bio}</Text>
        <Text style={styles.about}>{teacher.about}</Text>
      </View>

      {/* 🎬 Liste des webinaires */}
      <Text style={styles.sectionTitle}>📺 الدروس الإضافية المنشورة</Text>
      <FlatList
        data={teacher.videos}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.videoList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.webinarCard}
            onPress={() => navigation.navigate("WebinarDetail", { webinarId: item.id })}
          >
            <Image
              source={{ uri: `https://www.abajim.com/${item.image_cover}` }}
              style={styles.webinarImage}
            />
            <Text style={styles.webinarTitle}>{item.slug}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  coverContainer: {
    height: 180,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0097A7",
  },
  coverImage: { width: "100%", height: "100%", position: "absolute" },
  backButton: { position: "absolute", top: 50, left: 15, zIndex: 2 },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    zIndex: 2,
    marginTop: 60,
  },

  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: -50,
    zIndex: 3,
  },
  initialsCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0097A7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
    zIndex: 3,
  },
  initialsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },

  followRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 15,
  },
  followButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 25,
    backgroundColor: "#0097A7",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  follow: {
    backgroundColor: "#0097A7",
  },
  unfollow: {
    backgroundColor: "#888",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  followerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 9.5,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "#0097A7",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  followerText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F3B64",
  },  

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F3B64",
    marginTop: 15,
  },
  bio: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  about: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    writingDirection: "rtl",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F3B64",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "right",
    writingDirection: "rtl",
  },
  videoList: { paddingHorizontal: 15 },
  webinarCard: {
    marginLeft: 10,
    width: 140,
    alignItems: "center",
  },
  webinarImage: { width: 140, height: 90, borderRadius: 10 },
  webinarTitle: {
    fontSize: 14,
    color: "#1F3B64",
    marginTop: 5,
    textAlign: "center",
  },
});

export default TeacherScreen;
