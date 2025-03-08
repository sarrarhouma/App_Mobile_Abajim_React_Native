import React from "react";
import { View, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { switchChild } from "../reducers/auth/AuthAction";

const ChildSwitcher = () => {
  const dispatch = useDispatch();
  const children = useSelector((state) => state.auth.children);
  const activeChild = useSelector((state) => state.auth.activeChild) || children[0]; // ✅ Default to first child

  
  // ✅ Function to switch back to first child when clicking the parent avatar
  const handleParentClick = () => {
    console.log("the children after switch 5:" +children);
    if (children.length > 0) {
      console.log(`🔄 Switching back to first child: ${children[0].full_name} (ID: ${children[0].id})`);
      dispatch(switchChild(children[0]));
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Rounded Header with Parent & Children Profiles */}
      <View style={styles.header}>
        {/* 🔹 Parent & Children Profiles in One Row */}
        <View style={styles.profileContainer}>
          {/* ✅ Parent Profile (Click to switch back to first child) */}
          <TouchableOpacity 
            onPress={handleParentClick}  // ✅ Switch back to first child
            style={styles.parentProfileWrapper}
          >
            <Image 
              source={require("../../assets/icons/avatar4.png")} 
              style={styles.parentProfile} 
            />
          </TouchableOpacity>

          {/* ✅ Children Profiles */}
          <FlatList
            data={children}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            extraData={activeChild}  // ✅ Ensure re-render on switch
            renderItem={({ item }) => {
              const avatarUrl = item.avatar.startsWith("http")
                ? item.avatar
                : `https://www.abajim.com/${item.avatar.startsWith("/") ? item.avatar.substring(1) : item.avatar}`;

              return (
                <TouchableOpacity 
                  onPress={() => {
                    console.log(`🔄 Switching to child: ${item.full_name} (ID: ${item.id})`);
                    dispatch(switchChild(item));
                  }}
                  style={[
                    styles.childProfileWrapper,
                    activeChild?.id === item.id && styles.activeChildBorder, // ✅ Highlight selected child
                  ]}
                >
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.childProfile}
                  />

                  {/* ✅ Green Dot for Active Child */}
                  {activeChild?.id === item.id && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  parentProfileWrapper: {
    alignItems: "center",
    marginRight: 15,
  },
  parentProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  childProfileWrapper: {
    position: "relative",
    marginLeft: 10,
  },
  childProfile: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  activeDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  activeChildBorder: {
    borderWidth: 2,
    borderColor: "#0097A7",
    borderRadius: 30,
    padding: 2,
  },
});

export default ChildSwitcher;
