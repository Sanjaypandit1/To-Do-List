import React, { useState } from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default function SettingScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const user = 'Sanjay';

  const handleLogout = () => {
    console.log('Logged out');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Feather name="settings" size={48} color="#4f46e5" />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your TaskFlow experience
          </Text>
        </View>

        {/* Profile */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="user" size={18} /> Profile
          </Text>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Feather name="user" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{user}</Text>
              <Text style={styles.muted}>Productivity Master</Text>
              <Text style={styles.badge}>Premium User</Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="aperture" size={18} /> Appearance
          </Text>
          <View style={styles.rowBetween}>
            <View>
              <Text>Dark Mode</Text>
              <Text style={styles.muted}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="bell" size={18} /> Notifications
          </Text>
          <View style={styles.rowBetween}>
            <View>
              <Text>Push Notifications</Text>
              <Text style={styles.muted}>
                Receive task reminders and updates
              </Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.separator} />
          <View style={styles.rowBetween}>
            <View>
              <Text>Sound Effects</Text>
              <Text style={styles.muted}>
                Play sounds for task completion
              </Text>
            </View>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="shield" size={18} /> Privacy & Security
          </Text>
          <TouchableOpacity style={styles.button}>
            <Feather name="shield" size={16} />
            <Text style={styles.buttonText}> Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Feather name="info" size={16} />
            <Text style={styles.buttonText}> Terms of Service</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="smartphone" size={18} /> App Information
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
            <Feather name="info" size={16} />
            <Text style={styles.buttonText}> About TaskFlow</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={16} color="#fff" />
            <Text style={styles.logoutText}> Sign Out</Text>
          </TouchableOpacity>
        </View>
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
  header: { alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  headerSubtitle: { fontSize: 14, color: '#6b7280' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
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
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: { fontSize: 16, fontWeight: '600' },
  muted: { fontSize: 12, color: '#6b7280' },

  badge: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    fontSize: 12,
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
    fontSize: 12,
  },

  button: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  buttonText: { fontSize: 14, marginLeft: 6 },

  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },

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
  logoutText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
});