import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchDocumentByManuelId,
  fetchCorrectionVideoUrl,
} from "../reducers/auth/AuthAction";

const DocumentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { documentUrl } = route.params || {};
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);
  const [allowedUrl, setAllowedUrl] = useState(null);

  const documentData = useSelector((state) => state.auth.documentData);
  const loading = useSelector((state) => state.auth.isLoading);
  const correctionVideoUrl = useSelector((state) => state.auth.correctionVideoUrl);

  useEffect(() => {
    if (documentUrl?.id) {
      dispatch(fetchDocumentByManuelId(documentUrl.id));
    }

    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
    };
    getToken();
  }, [documentUrl, dispatch]);

  const onWebViewMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.icon && data.page) {
        if (!authToken) {
          Alert.alert("خطأ", "لا يوجد رمز تسجيل الدخول. الرجاء إعادة تسجيل الدخول.");
          return;
        }
        dispatch(fetchCorrectionVideoUrl(documentUrl.id, data.icon, data.page));
      }
    } catch (error) {
      console.error("❌ Error parsing WebView message:", error);
    }
  };

  useEffect(() => {
    if (correctionVideoUrl) {
      setAllowedUrl(correctionVideoUrl);
      Linking.openURL(correctionVideoUrl);
    }
  }, [correctionVideoUrl]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📚 الكتاب المدرسي</Text>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>
            {documentData?.name || "📖 لم يتم العثور على الوثيقة"}
          </Text>
        </View>

        {/* WebView Section */}
        <View style={styles.webViewContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0097A7" />
          ) : documentData?.pathenfant ? (
            <WebView
              source={{
                uri: documentData?.pathenfant,
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
              }}
              startInLoadingState
              ref={webViewRef}
              renderLoading={() => <ActivityIndicator size="large" color="#0097A7" />}
              style={{ height: 600 }}
              injectedJavaScript={`document.addEventListener("click", function(event) {
                let target = event.target;
                while (target) {
                  if (target.tagName === "IMG" && target.src.includes("red-icon")) {
                    let iconNumber = target.getAttribute("data-icon");
                    let pageNumber = target.getAttribute("data-page");
                    window.ReactNativeWebView.postMessage(JSON.stringify({ icon: iconNumber, page: pageNumber }));
                    return;
                  }
                  target = target.parentElement;
                }
              });`}
              onMessage={onWebViewMessage}
              onNavigationStateChange={(event) => {
                const isDocument = event.url.startsWith(documentData?.pathenfant);
                const isCorrectionVideo = event.url === allowedUrl;
                if (isCorrectionVideo) return true;
                if (!isDocument) return false;
                return true;
              }}
            />
          ) : (
            <Text style={styles.errorText}>❌ فشل تحميل الوثيقة</Text>
          )}
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    backgroundColor: "#0097A7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: { padding: 5 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    flex: 1,
  },
  documentInfo: { alignItems: "center", marginVertical: 10 },
  documentTitle: { fontSize: 18, fontWeight: "bold", color: "#1F3B64" },
  webViewContainer: { marginTop: 10, width: "100%", height: 600 },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 18, color: "red" },
});

export default DocumentScreen;
