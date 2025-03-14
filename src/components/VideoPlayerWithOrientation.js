import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayerWithOrientation = ({ uri }) => {
  const videoRef = useRef(null);

  const handlePlaybackStatusUpdate = async (status) => {
    console.log("🎬 Playback status:", status);

    if (status.isPlaying) {
      console.log("▶️ Video is playing, switching to LANDSCAPE...");
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.log("❌ Failed to switch to LANDSCAPE:", error);
      }
    }

    if (status.didJustFinish || status.positionMillis === 0) {
      console.log("⏹ Video stopped/finished, switching to PORTRAIT...");
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (error) {
        console.log("❌ Failed to switch to PORTRAIT:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 10,
  },
});

export default VideoPlayerWithOrientation;
