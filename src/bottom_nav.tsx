import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, FolderOpen, Settings, BarChart3 } from 'lucide-react-native';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "categories", label: "Categories", icon: FolderOpen },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
    
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const iconColor = isActive ? '#ffffff' : '#1f2937';

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[
                styles.tabButton,
                isActive ? styles.activeTab : styles.inactiveTab
              ]}
            >
              <Icon 
                size={20} 
                color={iconColor}
              />
              <Text style={[
                styles.tabLabel,
                isActive ? styles.activeText : styles.inactiveText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6366f1', 
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  activeText: {
    color: '#ffffff', 
  },
  inactiveText: {
    color: '#1f2937', 
  },
});