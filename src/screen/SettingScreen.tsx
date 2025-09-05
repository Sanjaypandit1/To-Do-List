'use client';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../components/Auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type SettingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

export default function SettingScreen() {

  const { user, isGuest, signOut } = useAuth();
  const navigation = useNavigation<SettingScreenNavigationProp>();

  useEffect(() => {
  }, []);


  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        onPress: () => {
          signOut();
          console.log('Logged out');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Feather name="settings" size={48} color="#2563eb" />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your TaskFlow experience
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="user" size={20} /> {user ? 'Profile' : 'Account'}
          </Text>
          {user ? (
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Feather name="user" size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{user.name}</Text>
                <Text style={styles.muted}>{user.email}</Text>
                <Text style={styles.badge}>Premium User</Text>
              </View>
            </View>
          ) : isGuest ? (
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: '#6b7280' }]}>
                <Feather name="user" size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>Guest User</Text>
                <Text style={styles.muted}>Limited access to features</Text>
                <View style={styles.authButtonsContainer}>
                  <TouchableOpacity
                    style={styles.signInButton}
                    onPress={signOut} 
                  >
                    <Text style={styles.signInButtonText}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={signOut} 
                  >
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.authPrompt}>
              <Text style={styles.muted}>Sign in to access all features</Text>
              <View style={styles.authButtonsContainer}>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => {}} 
                >
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => {}} 
                >
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="shield" size={20} /> Privacy & Security
          </Text>
          <TouchableOpacity style={styles.button}>
            <Feather name="shield" size={18} />
            <Text style={styles.buttonText}> Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Feather name="info" size={18} />
            <Text style={styles.buttonText}> Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="smartphone" size={20} /> App Information
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Version</Text>
            <Text style={styles.badgeOutline}>1.0.0</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Build</Text>
            <Text style={styles.badgeOutline}>2024.1</Text>
          </View>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.button}>
            <Feather name="info" size={18} />
            <Text style={styles.buttonText}> About TaskFlow</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Feather name="log-out" size={18} color="#fff" />
              <Text style={styles.logoutText}> Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  muted: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },

  authPrompt: {
    alignItems: 'center',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  signInButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  signUpButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },

  badge: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  badgeOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 14,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 6,
  },

  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },

  footer: {
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 16,
  },
});
