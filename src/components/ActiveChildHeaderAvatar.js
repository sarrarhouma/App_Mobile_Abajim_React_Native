import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const ActiveChildHeaderAvatar = () => {
  const activeChild = useSelector((state) => state.auth.activeChild);

  if (!activeChild) return null;

  const getInitials = (fullName) => {
    const names = fullName?.trim().split(" ");
    return names?.length >= 2
      ? names[0][0] + names[1][0]
      : names?.[0]?.slice(0, 2) || "؟";
  };

  const avatarUrl = activeChild.avatar?.startsWith("http")
    ? activeChild.avatar
    : `https://www.abajim.com/${activeChild.avatar?.startsWith("/") ? activeChild.avatar.substring(1) : activeChild.avatar}`;

  return (
    <View style={styles.container}>
      {activeChild.avatar ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials(activeChild.full_name)}</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>{activeChild.full_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginLeft: 10,
    maxWidth: 40,
  },
  avatar: {
    width: 10,
    height: 10,
    borderRadius: 22,
    backgroundColor: "#4caf50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  initialsContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  initialsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  name: {
    fontSize: 10,
    color: "#fff",
    marginTop: 2,
    textAlign: "center",
  },
});

export default ActiveChildHeaderAvatar;
