import React, { useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native"
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
  Filter
} from "lucide-react-native"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  category?: string
  priority?: "low" | "medium" | "high"
  dueDate?: Date
}

interface StatsViewProps {
  todos: Todo[]
}

function StatsView({ todos }: StatsViewProps) {
  const categories = [
    { id: "work", label: "Work", icon: Briefcase, color: "#3B82F6" },
    { id: "personal", label: "Personal", icon: HomeIcon, color: "#22C55E" },
    { id: "shopping", label: "Shopping", icon: ShoppingCart, color: "#F97316" },
    { id: "health", label: "Health", icon: Heart, color: "#EF4444" },
     {
      id:"others",
      label: "Others",
      icon: Filter,
      color:"#6a6565ff",
      description: "Other tasks"

    },
  ]

  const stats = useMemo(() => {
    const totalTasks = todos.length
    const completedTasks = todos.filter((todo) => todo.completed).length
    const pendingTasks = totalTasks - completedTasks
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const highPriority = todos.filter((todo) => todo.priority === "high").length
    const mediumPriority = todos.filter((todo) => todo.priority === "medium").length
    const lowPriority = todos.filter((todo) => todo.priority === "low").length

    const categoryStats = categories.map((category) => {
      const categoryTodos = todos.filter((todo) => todo.category === category.id)
      const completed = categoryTodos.filter((todo) => todo.completed).length
      const total = categoryTodos.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      return {
        ...category,
        total,
        completed,
        pending: total - completed,
        percentage,
      }
    })

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentTasks = todos.filter((todo) => todo.createdAt >= sevenDaysAgo).length
    const recentCompleted = todos.filter(
      (todo) => todo.completed && todo.createdAt >= sevenDaysAgo,
    ).length

    const dailyAverage = totalTasks > 0 ? Math.round(totalTasks / 7) : 0

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
      categoryStats,
      recentTasks,
      recentCompleted,
      dailyAverage,
    }
  }, [todos])

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BarChart3 size={48} color="#3B82F6" />
        <Text style={styles.headerTitle}>Statistics</Text>
        <Text style={styles.headerSubtitle}>Track your productivity insights</Text>
      </View>

      {/* Overview */}
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: "#E0F2FE" }]}>
          <CheckCircle size={32} color="#3B82F6" />
          <Text style={styles.cardNumber}>{stats.completedTasks}</Text>
          <Text style={styles.cardLabel}>Completed</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#FEF9C3" }]}>
          <Circle size={32} color="#F97316" />
          <Text style={styles.cardNumber}>{stats.pendingTasks}</Text>
          <Text style={styles.cardLabel}>Pending</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#000" />
          <Text style={styles.sectionTitle}>Overall Progress</Text>
        </View>
        <Text style={styles.bigNumber}>{stats.completionRate}%</Text>
        <Text style={styles.smallText}>Completion Rate</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${stats.completionRate}%` }]}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.smallText}>{stats.completedTasks} completed</Text>
          <Text style={styles.smallText}>{stats.totalTasks} total tasks</Text>
        </View>
      </View>

      {/* Priority Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Flag size={20} />
          <Text style={styles.sectionTitle}>Priority Breakdown</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.priorityLabel, { color: "#EF4444" }]}>
            High Priority
          </Text>
          <Text style={styles.badge}>{stats.highPriority}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.priorityLabel, { color: "#FACC15" }]}>
            Medium Priority
          </Text>
          <Text style={styles.badge}>{stats.mediumPriority}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.priorityLabel, { color: "#22C55E" }]}>
            Low Priority
          </Text>
          <Text style={styles.badge}>{stats.lowPriority}</Text>
        </View>
      </View>

      {/* Category Performance */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} />
          <Text style={styles.sectionTitle}>Category Performance</Text>
        </View>
        {stats.categoryStats.map((cat) => {
          const Icon = cat.icon
          return (
            <View key={cat.id} style={{ marginVertical: 6 }}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: cat.color }]} />
                  <Icon size={16} />
                  <Text style={styles.smallText}>{cat.label}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.smallText}>
                    {cat.completed}/{cat.total}
                  </Text>
                  <Text style={styles.badge}>{cat.percentage}%</Text>
                </View>
              </View>
              {cat.total > 0 && (
                <View style={styles.progressBarSmall}>
                  <View
                    style={[styles.progressFill, { width: `${cat.percentage}%` }]}
                  />
                </View>
              )}
            </View>
          )
        })}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.recentTasks}</Text>
            <Text style={styles.smallText}>Tasks Created</Text>
            <Text style={styles.smallText}>Last 7 days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#22C55E" }]}>
              {stats.recentCompleted}
            </Text>
            <Text style={styles.smallText}>Tasks Completed</Text>
            <Text style={styles.smallText}>Last 7 days</Text>
          </View>
        </View>
      </View>

      {/* Motivational Message */}
      {stats.totalTasks > 0 && (
        <View style={[styles.section, { backgroundColor: "#DCFCE7" }]}>
          <CheckCircle size={32} color="#22C55E" />
          <Text style={styles.motivationText}>
            {stats.completionRate >= 80
              ? "Outstanding work! 🎉"
              : stats.completionRate >= 60
              ? "Great progress! 💪"
              : stats.completionRate >= 40
              ? "You're making steady progress! 📈"
              : "Every task is a step forward! 🌟"}
          </Text>
          <Text style={styles.smallText}>
            You've completed {stats.completedTasks} tasks so far.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default function StatsScreen() {
  // Example data — replace with your actual todos state or from storage
  const exampleTodos: Todo[] = [
    {
      id: "1",
      text: "Finish project report",
      completed: true,
      createdAt: new Date(),
      category: "work",
      priority: "high",
    },
    {
      id: "2",
      text: "Buy groceries",
      completed: false,
      createdAt: new Date(),
      category: "shopping",
      priority: "medium",
    },
  ]

  return <StatsView todos={exampleTodos} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: { alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginTop: 8 },
  headerSubtitle: { fontSize: 14, color: "#6B7280" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  card: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  cardNumber: { fontSize: 22, fontWeight: "bold" },
  cardLabel: { fontSize: 12, color: "#6B7280" },
  section: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  bigNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3B82F6",
    textAlign: "center",
  },
  smallText: { fontSize: 12, color: "#6B7280" },
  progressBar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginVertical: 6,
  },
  progressFill: { height: "100%", backgroundColor: "#3B82F6", borderRadius: 8 },
  progressBarSmall: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 4,
  },
  priorityLabel: { fontSize: 14, fontWeight: "500" },
  badge: { fontSize: 12, paddingHorizontal: 8, color: "#111827" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  statBox: { flex: 1, alignItems: "center", padding: 8 },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  motivationText: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 8,
    textAlign: "center",
  },
})
