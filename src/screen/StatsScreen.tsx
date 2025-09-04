import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  Circle,
  Flag,
  Briefcase,
  HomeIcon,
  ShoppingCart,
  Heart,
  Filter,
} from 'lucide-react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface StatsViewProps {
  todos: Todo[];
}

function StatsView({ todos }: StatsViewProps) {
  const categories = [
    { id: 'work', label: 'Work', icon: Briefcase, color: '#3B82F6' },
    { id: 'personal', label: 'Personal', icon: HomeIcon, color: '#22C55E' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart, color: '#F97316' },
    { id: 'health', label: 'Health', icon: Heart, color: '#EF4444' },
    { id: 'others', label: 'Others', icon: Filter, color: '#6a6565ff' },
  ];

  const stats = useMemo(() => {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const categoryStats = categories.map(category => {
      const categoryTodos = todos.filter(todo => todo.category === category.id);
      const completed = categoryTodos.filter(todo => todo.completed).length;
      return {
        ...category,
        total: categoryTodos.length,
        completed,
        percentage:
          categoryTodos.length > 0
            ? Math.round((completed / categoryTodos.length) * 100)
            : 0,
      };
    });

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      categoryStats,
    };
  }, [todos]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BarChart3 size={28} color="#3B82F6" />
        <Text style={styles.headerTitle}>Your Task Stats</Text>
        <Text style={styles.headerSubtitle}>
          Overview of your productivity
        </Text>
      </View>

      {/* Summary cards */}
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: '#DBEAFE' }]}>
          <Text style={styles.cardNumber}>{stats.totalTasks}</Text>
          <Text style={styles.cardLabel}>Total</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#DCFCE7' }]}>
          <Text style={styles.cardNumber}>{stats.completedTasks}</Text>
          <Text style={styles.cardLabel}>Completed</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#FEE2E2' }]}>
          <Text style={styles.cardNumber}>{stats.pendingTasks}</Text>
          <Text style={styles.cardLabel}>Pending</Text>
        </View>
      </View>

      {/* Completion Rate */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Completion Rate</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${stats.completionRate}%` }]}
          />
        </View>
        <Text style={{ textAlign: 'center', marginTop: 4 }}>
          {stats.completionRate}% completed
        </Text>
      </View>

     
      {/* Category Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>By Category</Text>
        </View>
        {stats.categoryStats.map(category => (
          <View key={category.id} style={{ marginVertical: 6 }}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <category.icon size={18} color={category.color} />
                <Text style={{ marginLeft: 8 }}>{category.label}</Text>
              </View>
              <Text>
                {category.completed}/{category.total}
              </Text>
            </View>
            <View style={styles.progressBarSmall}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${category.percentage}%`, backgroundColor: category.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Motivation */}
      <Text style={styles.motivationText}>
        {stats.completionRate === 100
          ? 'Amazing! All tasks are done 🎉'
          : stats.completionRate >= 50
          ? 'Great work! Keep pushing 💪'
          : 'Stay focused, you got this 🚀'}
      </Text>
    </ScrollView>
  );
}

export default function StatsScreen({ user }: { user: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem(`todos_${user}`);
        if (savedTodos) {
          const parsed = JSON.parse(savedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }));
          setTodos(parsed);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };
    loadTodos();
  }, [user]);

  return <StatsView todos={todos} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,},
  header: { alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  headerSubtitle: { fontSize: 14, color: '#6B7280' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardNumber: { fontSize: 22, fontWeight: 'bold' },
  cardLabel: { fontSize: 12, color: '#6B7280' },
  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginVertical: 6,
  },
  progressFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 8 },
  progressBarSmall: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginTop: 4,
  },
  priorityLabel: { fontSize: 14, fontWeight: '500' },
  motivationText: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 12,
    textAlign: 'center',
  },
});
