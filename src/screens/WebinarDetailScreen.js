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
  const { webinars, isLoading, activeChild } = useSelector((state) => state.auth);

  const [expandedChapter, setExpandedChapter] = useState(null);
  const [activeTab, setActiveTab] = useState("content");

  const webinar = webinars.find((w) => w.id === webinarId) || null;

  useEffect(() => {
    if (!webinar && activeChild?.level_id && !isLoading) {
      dispatch(fetchWebinarsByLevel(activeChild.level_id));
    }
  }, [dispatch, webinar, activeChild, isLoading]);

  if (!webinar) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0097A7" />
        <Text style={styles.loadingText}>جارٍ تحميل الدرس...</Text>
      </View>
    );
  }

  const chapters = webinar.chapters || [];

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
          <Text style={styles.tabText}>🎮 تحدي مرح</Text>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
      {activeTab === "content" && (
  <>
    {chapters.length === 0 ? (
      <View style={styles.emptyState}>
        <Image
          source={require("../../assets/icons/no_content.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.noVideoText}>🚫 لا يوجد محتوى متاح حاليا</Text>
      </View>
    ) : (
      chapters.map((chapter) => (
        <View key={chapter.id} style={styles.chapterContainer}>
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
            <Text style={styles.chapterTitle}>
              📘 {chapter?.files?.[0]?.translations?.[0]?.title || "فصل بدون عنوان"}
            </Text>
          </TouchableOpacity>

          {expandedChapter === chapter.id && (
            <View style={styles.videoContainer}>
              {chapter.files?.filter(file => file.file_type === "video").length > 0 ? (
                chapter.files
                  .filter(file => file.file_type === "video")
                  .map((file, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                      <Video
                        source={{ uri: file.file }}
                        style={styles.videoPlayer}
                        useNativeControls
                        resizeMode="contain"
                        onError={(e) => console.error("❌ Video error", e)}
                      />
                    </View>
                  ))
              ) : (
                <Text style={styles.noVideoText}>❌ لا يوجد فيديوهات لهذا الفصل</Text>
              )}
            </View>
          )}
        </View>
      ))
    )}
  </>
)}


{activeTab === "documents" && (
  <View style={styles.contentBox}>
    {chapters.flatMap(ch => ch.files || []).filter(f => f.file_type === "document").length > 0 ? (
      chapters
        .flatMap(ch => ch.files || [])
        .filter(file => file.file_type === "document")
        .map((file, idx) => (
          <Text key={idx} style={styles.documentText}>
            📄 {file?.translations?.[0]?.title || "وثيقة بدون عنوان"}
          </Text>
        ))
    ) : (
      <>
        <Image source={require("../../assets/icons/no_files2.png")} style={styles.emptyIllustration} />
        <Text style={styles.noVideoText}>❌ لا توجد وثائق متاحة</Text>
      </>
    )}
  </View>
)}


{activeTab === "quiz" && (
  <View style={styles.contentBox}>
    <>
      <Image source={require("../../assets/icons/no_quizz.png")} style={styles.emptyIllustration} />
      <Text style={styles.noVideoText}>🚀 لا يوجد تحديات متاحة بعد</Text>
    </>
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
  backButton: {
    position: "absolute", top: 45, left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 5, borderRadius: 5
  },
  overlayTitle: {
    position: "absolute", top: 45, right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 8, borderRadius: 5
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "white", textAlign: "right" },

  tabsContainer: {
    flexDirection: "row", justifyContent: "space-around",
    backgroundColor: "#0097A7", paddingVertical: 10
  },
  tab: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "white" },
  tabText: { color: "white", fontSize: 16, fontWeight: "bold" },

  sectionSpacing: { height: 20 },
  scrollContent: { paddingVertical: 20 },

  chapterContainer: { width: "90%", alignSelf: "center", marginBottom: 15 },
  chapterHeader: {
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: "#E0E0E0", padding: 15, borderRadius: 10
  },
  chapterTitle: {
    fontSize: 18, fontWeight: "bold", color: "#1F3B64",
    textAlign: "center", flex: 1
  },

  videoContainer: { marginTop: 15 },
  videoPlayer: { width: "100%", height: 220, borderRadius: 10 },

  contentBox: {
    width: "90%", alignSelf: "center", backgroundColor: "#FFF",
    padding: 15, borderRadius: 10, elevation: 5, marginBottom: 15
  },
  documentText: { fontSize: 16, color: "#333", textAlign: "right" },
  quizText: { fontSize: 16, color: "#333", textAlign: "right" },
  noVideoText: { textAlign: "center", color: "#888", marginTop: 10 },
  emptyIllustration: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain"
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  emptyImage: {
    width: 220,
    height: 200,
    marginBottom: 15,
  },
   
});

export default WebinarDetailScreen;
