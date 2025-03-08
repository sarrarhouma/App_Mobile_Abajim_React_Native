import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebinarsByLevel } from "../reducers/auth/AuthAction";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const WebinarDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { webinarId } = route.params || {};
  const { webinars, isLoading } = useSelector((state) => state.auth);

  const webinar = webinars.find((w) => w.id === webinarId) || null;

  useEffect(() => {
    if (!webinar && !isLoading) {
      dispatch(fetchWebinarsByLevel(activeChild?.level_id));
    }
  }, [dispatch, webinar, webinarId]);

//   const videoUrl = webinar.video_demo 
//   ? `https://www.abajim.com${webinar.video_demo.startsWith("/") ? webinar.video_demo : "/" + webinar.video_demo}.mp4`
//   : null;
console.log("🎥 Vérifie si cette URL fonctionne dans le navigateur :", videoUrl);
 const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // url de test

  const chapters = [
    { id: 1, title: `📘 المحور الأول : ${webinar?.slug || "عنوان غير متوفر"}`, videos: [videoUrl] },
    { id: 2, title: "📗 المحور الثاني : ", videos: [] },
  ];
  const documents = [{ id: 1, title: "📄 وثيقة ١" }, { id: 2, title: "📄 وثيقة ٢" }];
  const quizzes = [{ id: 1, title: "🎮 اختبار ١" }, { id: 2, title: "🎮 اختبار ٢" }];

  const [expandedChapter, setExpandedChapter] = useState(chapters[0].id);
  const [activeTab, setActiveTab] = useState("content");

  if (!webinar) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0097A7" />
        <Text style={styles.loadingText}>جارٍ تحميل الدرس...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: `https://www.abajim.com/${webinar.image_cover}` }}
          style={styles.headerImage}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.overlayTitle}>
          <Text style={styles.headerTitle}>{webinar.slug || "عنوان غير متوفر"}</Text>
        </View>
      </View>

      {/* ✅ Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "quiz" && styles.activeTab]}
          onPress={() => setActiveTab("quiz")}
        >
          <Text style={styles.tabText}>🎮 التحدي</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "documents" && styles.activeTab]}
          onPress={() => setActiveTab("documents")}
        >
          <Text style={styles.tabText}>📄 الوثائق</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "content" && styles.activeTab]}
          onPress={() => setActiveTab("content")}
        >
          <Text style={styles.tabText}>📚 المحتوى</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Espacement ajouté */}
      <View style={styles.sectionSpacing} />

      {/* ✅ Contenu */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "content" && (
          <>
            {chapters.map((chapter) => (
              <View key={chapter.id} style={styles.chapterContainer}>
                {/* 📌 Titre du chapitre */}
                <TouchableOpacity
                  style={styles.chapterHeader}
                  onPress={() =>
                    setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)
                  }
                >
                  <Ionicons
                    name={expandedChapter === chapter.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#1F3B64"
                  />
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                </TouchableOpacity>

                {/* 🎥 Vidéos */}
                {expandedChapter === chapter.id && (
                  <View style={styles.videoContainer}>
                    {chapter.videos.length > 0 ? (
                      chapter.videos.map((video, index) => (
                        <Video
                          key={index}
                          source={{ uri: video }}
                          style={styles.videoPlayer}
                          useNativeControls
                          resizeMode="contain"
                          onError={(error) => console.error("❌ Erreur vidéo:", error)}
                        />
                      ))
                    ) : (
                      <Text style={styles.noVideoText}>❌ لا يوجد فيديوهات لهذا الفصل</Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* 📄 Documents Section avec même design */}
        {activeTab === "documents" && (
          <View style={styles.contentBox}>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <Text key={doc.id} style={styles.documentText}>{doc.title}</Text>
              ))
            ) : (
              <Text style={styles.noVideoText}>❌ لا توجد وثائق متاحة</Text>
            )}
          </View>
        )}

        {/* 🎮 Quiz Section avec même design */}
        {activeTab === "quiz" && (
          <View style={styles.contentBox}>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Text key={quiz.id} style={styles.quizText}>{quiz.title}</Text>
              ))
            ) : (
              <Text style={styles.noVideoText}>🚀 لا يوجد تحديات متاحة بعد</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  headerContainer: { position: "relative" },
  headerImage: { width: "100%", height: 280, resizeMode: "cover" },
  backButton: { position: "absolute", top: 45, left: 15 , backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 5, borderRadius: 5},
  overlayTitle: { position: "absolute", top: 45, right: 15, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 8, borderRadius: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "white", textAlign: "right" },

  tabsContainer: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#0097A7", paddingVertical: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "white" },
  tabText: { color: "white", fontSize: 16, fontWeight: "bold" },

  sectionSpacing: { height: 20 },

  chapterContainer: { width: "90%", alignSelf: "center", marginBottom: 15, },
  chapterHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#E0E0E0", padding: 15, borderRadius: 10 },
  chapterTitle: { fontSize: 18, fontWeight: "bold", color: "#1F3B64", textAlign: "center", flex: 1 },

  videoContainer: { alignItems: "center", width: "100%",  marginTop: 15,  alignSelf: "center", width: "100%" },
  videoPlayer: { width: "100%", height: 220, borderRadius: 10, },

  contentBox: { width: "90%", alignSelf: "center", backgroundColor: "#FFF", padding: 15, borderRadius: 10, elevation: 5, marginBottom: 15 },
  documentText: { fontSize: 16, color: "#333", textAlign: "right" },
  quizText: { fontSize: 16, color: "#333", textAlign: "right" },
});

export default WebinarDetailScreen;
