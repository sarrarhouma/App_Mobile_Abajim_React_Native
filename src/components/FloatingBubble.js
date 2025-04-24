import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const FloatingBubble = () => {
  const navigation = useNavigation();
// Get screen width and height
const { width, height } = Dimensions.get("window");
  const pan = useRef(
    new Animated.ValueXY({
      x: width - 100, 
      y: height - 180, 
    })
  ).current;

  // 🎯 Activer le glisser-déposer
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // Optionnel : snap-to-edge ici
      },
    })
  ).current;

  // ✅ Au clic → rediriger
  const handlePress = () => {
    navigation.navigate("SubscriptionScreen");
  };

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <View style={styles.innerContent}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.label}>اشترك</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#1f3c88",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 4 },
    elevation: 10,
    zIndex: 9999,
    borderWidth: 2,
    borderColor: "#fff",
  },
  touchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContent: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 30,
    marginBottom: 3,
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default FloatingBubble;
