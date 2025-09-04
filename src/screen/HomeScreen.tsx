import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, Trash2, LogOut, CheckSquare, Check } from 'lucide-react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoAppProps {
  user: string;
  onLogout: () => void;
}

export function TodoApp({ user, onLogout }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

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

  // Save todos to AsyncStorage
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(`todos_${user}`, JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos:', error);
      }
    };

    saveTodos();
  }, [todos, user]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
              <Text style={styles.headerTitle}>My Tasks</Text>
              <Text style={styles.headerSubtitle}>
                {completedCount} of {totalCount} completed
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <LogOut size={16} color="#6b7280" />
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
              onPress={addTodo}
              disabled={!newTodo.trim()}
              style={[styles.addButton, !newTodo.trim() && styles.addButtonDisabled]}
            >
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Todo List */}
        <ScrollView style={styles.todoListContainer}>
          {todos.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <CheckSquare size={48} color="#6b7280" />
                <Text style={styles.emptyText}>No tasks yet</Text>
                <Text style={styles.emptySubtext}>Add your first task above to get started</Text>
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
                    <Text style={styles.todoDate}>
                      {todo.createdAt.toLocaleDateString()}
                    </Text>
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
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#6366f1',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
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
  todoDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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