"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "./src/screen/HomeScreen"
import CategoriesScreen from "./src/screen/CategoriesScreen"
import StatsScreen from "./src/screen/StatsScreen"
import SettingScreen from "./src/screen/SettingScreen"
import AuthScreen from "./src/components/AuthScreen"
import OnboardingScreen from "./src/screen/OnboardingScreen"
import { BottomNav } from "./src/components/bottom_nav"
import { AuthProvider, useAuth } from "./src/components/Auth"

// Define your navigation types
export type RootStackParamList = {
  Onboarding: undefined
  MainTabs: undefined
  Auth: undefined
  Settings: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function MainTabs() {
  const [activeTab, setActiveTab] = useState("home")
  const { user, signOut } = useAuth() // Get user and signOut from auth context

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen user={user?.id || "guest"} onLogout={signOut} />
      case "categories":
        return <CategoriesScreen user={user?.id || "guest"} onLogout={signOut} />
      case "stats":
        return <StatsScreen user={user?.id || "guest"} />
      case "settings":
        return <SettingScreen />
      default:
        return <HomeScreen user={user?.id || "guest"} onLogout={signOut} />
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>{renderScreen()}</View>
      </View>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

function AuthNavigator() {
  const { user, isGuest, isLoading, hasSeenOnboarding, completeOnboarding } = useAuth()

  if (isLoading) {
    return null // You could add a loading screen here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding">{() => <OnboardingScreen onComplete={completeOnboarding} />}</Stack.Screen>
      ) : user || isGuest ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})
