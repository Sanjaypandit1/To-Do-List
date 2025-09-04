import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/screen/HomeScreen";
import CategoriesScreen from "./src/screen/CategoriesScreen";
import SearchScreen from "./src/screen/SearchScreen";
import StatsScreen from "./src/screen/StatsScreen";
import SettingScreen from "./src/screen/SettingScreen";
import { BottomNav } from "./src/bottom_nav";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen user={""} onLogout={function (): void {
          throw new Error("Function not implemented.");
        } } />;
      case "categories":
        return <CategoriesScreen />;
      case "search":
        return <SearchScreen />;
      case "stats":
        return <StatsScreen />;
      case "settings":
        return <SettingScreen />;
      default:
        return <HomeScreen user={""} onLogout={function (): void {
          throw new Error("Function not implemented.");
        } } />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});