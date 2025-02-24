import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentByManuelId } from "../reducers/auth/AuthAction"; 

const DocumentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { documentUrl } = route.params || {};
  const dispatch = useDispatch();

  // ✅ Get document data from Redux store
  const documentData = useSelector((state) => state.auth.documentData);
  const loading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    console.log("📄 Document URL Passed:", documentUrl);
    if (documentUrl?.id) {
      dispatch(fetchDocumentByManuelId(documentUrl.id)); // Dispatch Redux action
    }
  }, [documentUrl, dispatch]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الكتاب المدرسي📚 </Text>
      </View>

      {/* Document Name */}
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>
          {documentData?.name || "📖 Aucun document trouvé"}
        </Text>
      </View>

      {/* WebView for Document Display */}
      <View style={styles.webViewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0097A7" />
        ) : documentData?.pathenfant ? (
            <WebView
            source={{ uri: documentData?.pathenfant }}
            startInLoadingState
            renderLoading={() => <ActivityIndicator size="large" color="#0097A7" />}
            style={{ flex: 1 }}
            onShouldStartLoadWithRequest={(event) => {
              // ✅ Allow only the initial URL, block any navigation attempt
              if (event.url !== documentData?.pathenfant) {
                console.log("⛔ Navigation blocked to:", event.url);
                return false; // Prevent navigation
              }
              return true; // Allow the main document to load
            }}
          />
          
        ) : (
          <Text style={styles.errorText}>❌ Impossible de charger le document</Text>
        )}
      </View>

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
    paddingVertical: 45,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#FFF", textAlign: "center", flex: 1 },
  documentInfo: { alignItems: "center", marginVertical: 10 },
  documentTitle: { fontSize: 18, fontWeight: "bold", color: "#1F3B64" },
  webViewContainer: { flex: 1, marginTop: 10 },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 18, color: "red" },
});

export default DocumentScreen;
