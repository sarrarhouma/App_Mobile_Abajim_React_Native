import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayerWithOrientation = ({ uri }) => {
  const videoRef = useRef(null);

  const handlePlaybackStatusUpdate = async (status) => {

    if (status.isPlaying) {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
      }
    }

    if (status.didJustFinish || status.positionMillis === 0) {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (error) {
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
