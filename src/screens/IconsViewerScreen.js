import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { fetchCorrectionVideoUrl } from "../redux/actions/AuthAction"; // ✅ Import Redux action

const IconsViewer = ({ route }) => {
  const { manuelId, icon, page, bookPath } = route.params; // ✅ Receive params from navigation
  const dispatch = useDispatch();
  const { correctionVideoUrl, isLoading } = useSelector((state) => state.auth); // ✅ Get Redux state

  const webViewRef = useRef(null);

  // 🆕 Fetch the correction video URL when the component mounts
  useEffect(() => {
    dispatch(fetchCorrectionVideoUrl(manuelId, icon, page));
  }, [dispatch, manuelId, icon, page]);

  // 🆕 Open the correction video when clicking the red icon
  const handleIconClick = () => {
    if (correctionVideoUrl) {
      Linking.openURL(correctionVideoUrl);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🆕 Display a WebView for document visualization */}
      <WebView
        source={{ uri: bookPath ? bookPath + `#page=${page}` : "https://www.abajim.com" }}
        ref={webViewRef}
        onNavigationStateChange={(navState) => {
          if (!navState.url.startsWith("https://www.abajim.com/panel/scolaire/")) {
            webViewRef.current.stopLoading();
          }
        }}
      />

      {/* 🆕 Show a loading indicator while fetching the URL */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0097A7" />
      ) : (
        <TouchableOpacity 
          onPress={handleIconClick} 
          style={{ padding: 10, backgroundColor: "red", borderRadius: 50, alignSelf: "center", marginTop: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>🎥 Ouvrir la correction</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IconsViewer;
