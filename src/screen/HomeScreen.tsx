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
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, Trash2, LogOut, CheckSquare, Check, X, ChevronDown } from 'lucide-react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
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

  const categories = [
    { id: 'work', name: 'Work', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#22c55e' },
    { id: 'shopping', name: 'Shopping', color: '#f97316' },
    { id: 'health', name: 'Health', color: '#ef4444' },
    { id: 'others', name: 'Others', color: '#6a6565ff' },
  ];

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
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = allTodos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
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

  const completedCount = todos.filter((todo) => todo.completed).length;
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
          <TouchableOpacity 
            onPress={showBackButton ? onBack : onLogout} 
            style={styles.logoutButton}
          >
            {showBackButton ? (
              <Text style={styles.backButtonText}>Back</Text>
            ) : (
              <LogOut size={16} color="#6b7280" />
            )}
          </TouchableOpacity>
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
                {selectedCategory ? getCategoryName(selectedCategory) : 'Category'}
              </Text>
              <ChevronDown size={16} color="#ffffff" />
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
                    <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Todo List */}
        <ScrollView style={styles.todoListContainer}>
          {todos.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <CheckSquare size={48} color="#6b7280" />
                <Text style={styles.emptyText}>No tasks yet</Text>
                <Text style={styles.emptySubtext}>
                  {categoryFilter 
                    ? `Add your first ${getCategoryName(categoryFilter).toLowerCase()} task above` 
                    : 'Add your first task above to get started'
                  }
                </Text>
              </View>
            </View>
          ) : (
            todos.map((todo) => (
              <View key={todo.id} style={styles.todoCard}>
                <View style={styles.todoContent}>
                  <TouchableOpacity
                    onPress={() => toggleTodo(todo.id)}
                    style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
                  >
                    {todo.completed && <Check size={14} color="#ffffff" />}
                  </TouchableOpacity>
                  <View style={styles.todoTextContainer}>
                    <Text
                      style={[
                        styles.todoText,
                        todo.completed && styles.todoTextCompleted
                      ]}
                    >
                      {todo.text}
                    </Text>
                    <View style={styles.todoMeta}>
                      <Text style={styles.todoDate}>
                        {todo.createdAt.toLocaleDateString()}
                      </Text>
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
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
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
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#0b62e4ff',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    paddingTop: 24,
  },
  addTodoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
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
    gap: 8,
  },
  input: {
    flex: 2,
    height: 48,
    fontSize: 16,
    color: '#6366f1',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  categoryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    height: 48,
    width: 48,
    backgroundColor: '#6366f1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#82a8ebff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    color: '#1f2937',
  },
  todoListContainer: {
    flex: 1,
  },
  todoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
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
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  todoDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default TodoApp;