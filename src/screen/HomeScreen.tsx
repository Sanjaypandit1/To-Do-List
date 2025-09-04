import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Platform,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, Trash2, LogOut, CheckSquare, Check, X, ChevronDown, Calendar, Clock, Archive } from 'lucide-react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  category?: string;
}

interface TodoAppProps {
  user: string;
  onLogout: () => void;
  initialTodos?: Todo[];
  showBackButton?: boolean;
  onBack?: () => void;
  categoryFilter?: string | null;
}

export function TodoApp({ 
  user, 
  onLogout, 
  initialTodos, 
  showBackButton = false, 
  onBack, 
  categoryFilter 
}: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(true);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  const categories = [
    { id: 'work', name: 'Work', color: '#3b82f6', icon: '💼' },
    { id: 'personal', name: 'Personal', color: '#22c55e', icon: '🏠' },
    { id: 'shopping', name: 'Shopping', color: '#f97316', icon: '🛒' },
    { id: 'health', name: 'Health', color: '#ef4444', icon: '❤️' },
    { id: 'others', name: 'Others', color: '#6a6565ff', icon: '📌' },
  ];

  // Animation for new tasks
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start();
  }, [todos]);

  // Load todos from AsyncStorage
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem(`todos_${user}`);
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          }));
          setAllTodos(parsedTodos);
          
          // Apply category filter if provided
          if (categoryFilter) {
            setTodos(parsedTodos.filter((todo: Todo) => todo.category === categoryFilter));
          } else {
            setTodos(parsedTodos);
          }
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    loadTodos();
  }, [user, categoryFilter]);

  // Save todos to AsyncStorage
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(`todos_${user}`, JSON.stringify(allTodos));
      } catch (error) {
        console.error('Error saving todos:', error);
      }
    };

    if (allTodos.length > 0) {
      saveTodos();
    }
  }, [allTodos, user]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
        category: selectedCategory || 'others'
      };
      
      const updatedTodos = [todo, ...allTodos];
      setAllTodos(updatedTodos);
      
      // Apply category filter if needed
      if (categoryFilter) {
        setTodos(updatedTodos.filter(todo => todo.category === categoryFilter));
      } else {
        setTodos(updatedTodos);
      }
      
      setNewTodo("");
      setSelectedCategory(undefined);
      setShowCategoryModal(false);
      
      // Reset animation for new item
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = allTodos.map((todo) => 
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date() : undefined
      } : todo
    );
    
    setAllTodos(updatedTodos);
    
    // Apply category filter if needed
    if (categoryFilter) {
      setTodos(updatedTodos.filter(todo => todo.category === categoryFilter));
    } else {
      setTodos(updatedTodos);
    }
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = allTodos.filter((todo) => todo.id !== id);
    setAllTodos(updatedTodos);
    
    // Apply category filter if needed
    if (categoryFilter) {
      setTodos(updatedTodos.filter(todo => todo.category === categoryFilter));
    } else {
      setTodos(updatedTodos);
    }
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(false);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6b7280';
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📌';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const completedCount = completedTodos.length;
  const totalCount = todos.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <CheckSquare size={20} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                {categoryFilter ? `${getCategoryName(categoryFilter)} Tasks` : 'My Tasks'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {completedCount} of {totalCount} completed
              </Text>
            </View>
          </View>
  
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Add Todo Form */}
        <View style={styles.addTodoCard}>
          <View style={styles.addTodoContainer}>
            <TextInput
              placeholder="Add a new task..."
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={addTodo}
              style={styles.input}
              placeholderTextColor="#6b7280"
            />
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              style={[styles.categoryButton, selectedCategory && { 
                backgroundColor: getCategoryColor(selectedCategory) 
              }]}
            >
              <Text style={styles.categoryButtonText}>
                {selectedCategory ? getCategoryIcon(selectedCategory) : '📂'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addTodo}
              disabled={!newTodo.trim()}
              style={[styles.addButton, !newTodo.trim() && styles.addButtonDisabled]}
            >
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Modal */}
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity 
                  onPress={() => setShowCategoryModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectCategory(item.id)}
                    style={styles.categoryItem}
                  >
                    <View style={[styles.categoryColor, { backgroundColor: item.color }]}>
                      <Text style={styles.categoryIcon}>{item.icon}</Text>
                    </View>
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Todo List */}
        <ScrollView style={styles.todoListContainer} showsVerticalScrollIndicator={false}>
          {/* Pending Tasks Section */}
          {pendingTodos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pending Tasks ({pendingTodos.length})</Text>
              {pendingTodos.map((todo) => (
                <Animated.View 
                  key={todo.id} 
                  style={[
                    styles.todoCard,
                    { 
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }] 
                    }
                  ]}
                >
                  <View style={styles.todoContent}>
                    <TouchableOpacity
                      onPress={() => toggleTodo(todo.id)}
                      style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
                    >
                      {todo.completed && <Check size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    
                    <View style={styles.todoTextContainer}>
                      <Text style={styles.todoText}>
                        {todo.text}
                      </Text>
                      
                      <View style={styles.todoMeta}>
                        <View style={styles.metaItem}>
                          <Calendar size={12} color="#6b7280" />
                          <Text style={styles.metaText}>
                            {formatDate(todo.createdAt)}
                          </Text>
                        </View>
                        
                        {todo.category && (
                          <View style={[styles.categoryBadge, { 
                            backgroundColor: getCategoryColor(todo.category) 
                          }]}>
                            <Text style={styles.categoryBadgeText}>
                              {getCategoryName(todo.category)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        onPress={() => toggleTodo(todo.id)}
                        style={[styles.actionButton, styles.completeButton]}
                      >
                        <Check size={16} color="#10b981" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => deleteTodo(todo.id)}
                        style={[styles.actionButton, styles.deleteButton]}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {/* Completed Tasks Section */}
          {completedTodos.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity 
                onPress={() => setShowCompleted(!showCompleted)}
                style={styles.sectionHeader}
              >
                <Text style={styles.sectionTitle}>
                  Completed Tasks ({completedTodos.length})
                </Text>
                <ChevronDown 
                  size={16} 
                  color="#6b7280" 
                  style={{ transform: [{ rotate: showCompleted ? '0deg' : '180deg' }] }} 
                />
              </TouchableOpacity>
              
              {showCompleted && completedTodos.map((todo) => (
                <View key={todo.id} style={[styles.todoCard, styles.completedCard]}>
                  <View style={styles.todoContent}>
                    <TouchableOpacity
                      onPress={() => toggleTodo(todo.id)}
                      style={[styles.checkbox, styles.checkboxChecked]}
                    >
                      <Check size={14} color="#ffffff" />
                    </TouchableOpacity>
                    
                    <View style={styles.todoTextContainer}>
                      <Text style={[styles.todoText, styles.todoTextCompleted]}>
                        {todo.text}
                      </Text>
                      
                      <View style={styles.todoMeta}>
                        <View style={styles.metaItem}>
                          <Clock size={12} color="#6b7280" />
                          <Text style={styles.metaText}>
                            Completed {todo.completedAt ? formatDate(todo.completedAt) : ''}
                          </Text>
                        </View>
                        
                        {todo.category && (
                          <View style={[styles.categoryBadge, { 
                            backgroundColor: getCategoryColor(todo.category) 
                          }]}>
                            <Text style={styles.categoryBadgeText}>
                              {getCategoryName(todo.category)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => deleteTodo(todo.id)}
                      style={[styles.actionButton, styles.deleteButton]}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {todos.length === 0 && (
            <View style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Archive size={48} color="#6b7280" />
                <Text style={styles.emptyText}>No tasks yet</Text>
                <Text style={styles.emptySubtext}>
                  {categoryFilter 
                    ? `Add your first ${getCategoryName(categoryFilter).toLowerCase()} task above` 
                    : 'Add your first task above to get started'
                  }
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#6366f1',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addTodoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  categoryButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  addButton: {
    height: 48,
    width: 48,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryColor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  todoListContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  todoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  completedCard: {
    borderLeftColor: '#10b981',
    opacity: 0.8,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    fontWeight: '500',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  completeButton: {
    backgroundColor: '#ecfdf5',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TodoApp;