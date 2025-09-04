import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { Briefcase, Home, ShoppingCart, Heart, FolderOpen, CheckCircle,Filter } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoApp from "./HomeScreen";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
}

interface CategoriesViewProps {
  todos: Todo[];
  onCategorySelect: (category: string | null) => void;
  onBack: () => void;
  user: string;
}

export function CategoriesView({ todos, onCategorySelect, onBack, user }: CategoriesViewProps) {
  const categories = [
    {
      id: "work",
      label: "Work",
      icon: Briefcase,
      color: "#3b82f6",
      description: "Professional tasks and projects",
    },
    {
      id: "personal",
      label: "Personal",
      icon: Home,
      color: "#22c55e",
      description: "Personal goals and activities",
    },
    {
      id: "shopping",
      label: "Shopping",
      icon: ShoppingCart,
      color: "#f97316",
      description: "Items to buy and errands",
    },
    {
      id: "health",
      label: "Health",
      icon: Heart,
      color: "#ef4444",
      description: "Health and wellness tasks",
    },
    {
      id:"others",
      label: "Others",
      icon: Filter,
      color:"#6a6565ff",
      description: "Other tasks"

    }
  ];

  const getCategoryStats = (categoryId: string) => {
    const categoryTodos = todos.filter((todo) => todo.category === categoryId);
    const completed = categoryTodos.filter((todo) => todo.completed).length;
    const total = categoryTodos.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const allTodosStats = {
    completed: todos.filter((todo) => todo.completed).length,
    total: todos.length,
    percentage: todos.length > 0 ? Math.round((todos.filter((todo) => todo.completed).length / todos.length) * 100) : 0,
  };

  const CategoryCard = ({
    category,
    stats,
    onPress,
  }: {
    category: (typeof categories)[0];
    stats: ReturnType<typeof getCategoryStats>;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
            <category.icon size={24} color="white" />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{category.label}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {stats.completed}/{stats.total}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.cardDescription}>{category.description}</Text>

        {stats.total > 0 ? (
          <>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stats.percentage}%`, backgroundColor: category.color }]} />
            </View>
            <Text style={styles.progressText}>{stats.percentage}% complete</Text>
          </>
        ) : (
          <Text style={styles.noTasksText}>No tasks yet</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <FolderOpen size={48} color="#6366f1" />
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSubtitle}>Organize your tasks by category</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={[styles.card, styles.allTasksCard]} onPress={() => onCategorySelect(null)}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.allTasksIcon}>
                <FolderOpen size={24} color="white" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>All Tasks</Text>
                <View style={styles.badgeSecondary}>
                  <Text style={styles.badgeSecondaryText}>
                    {allTodosStats.completed}/{allTodosStats.total}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.cardDescription}>View all your tasks in one place</Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${allTodosStats.percentage}%`,
                    backgroundColor: "#6366f1",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{allTodosStats.percentage}% complete</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                stats={stats}
                onPress={() => onCategorySelect(category.id)}
              />
            );
          })}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScrollContent}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#6366f1" }]}>
                <FolderOpen size={40} color="white" />
              </View>
              <Text style={styles.statNumber}>{todos.length}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#22c55e" }]}>
                <CheckCircle size={40} color="white" />
              </View>
              <Text style={styles.statNumber}>{todos.filter((todo) => todo.completed).length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

export default function CategoriesScreen({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryView, setShowCategoryView] = useState(true);

  // Load todos from AsyncStorage
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem(`todos_${user}`);
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }));
          setTodos(parsedTodos);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    loadTodos();
  }, [user]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setShowCategoryView(false);
  };

  const handleBackToCategories = () => {
    setShowCategoryView(true);
    setSelectedCategory(null);
  };

  if (showCategoryView) {
    return <CategoriesView todos={todos} onCategorySelect={handleCategorySelect} onBack={onLogout} user={user} />;
  }

  // Filter todos by selected category if a category is selected
  const filteredTodos = selectedCategory
    ? todos.filter(todo => todo.category === selectedCategory)
    : todos;

  return (
    <TodoApp 
      user={user} 
      onLogout={handleBackToCategories} 
      initialTodos={filteredTodos}
      showBackButton={true}
      onBack={handleBackToCategories}
      categoryFilter={selectedCategory}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500",
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  allTasksCard: {
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  allTasksIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  badge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSecondary: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  badgeSecondaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
  },
  noTasksText: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  categoriesGrid: {
    marginBottom: 24,
  },
  statsContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsScrollContent: {
    paddingRight: 10,
  },
  statItem: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
    minWidth: 140,
  },
  statIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 18,
    color: "#64748b",
    textAlign: "center",
  },
});