const STORAGE_KEY = 'todo-app-todos';
const API_URL = 'https://dummyjson.com/todos';


function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function initializeFromAPI() {
  const existingTodos = localStorage.getItem(STORAGE_KEY);
  if (!existingTodos) {
    try {
      const response = await fetch(`${API_URL}?limit=30`);
      if (!response.ok) throw new Error('Failed to fetch todos from API');
      
      const data = await response.json();
      const todosWithDates = data.todos.map(todo => ({
        ...todo,
        createdAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString()
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todosWithDates));
      return todosWithDates;
    } catch (error) {
      console.error('Failed to fetch from API, using fallback data:', error);
    }
  }
  return JSON.parse(existingTodos);
}

export async function fetchTodos() {
  const todos = await initializeFromAPI();
  return todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addTodo(task) {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: task,
        completed: false,
        userId: 1
      })
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const apiTodo = await response.json();
    const newTodo = {
      ...apiTodo,
      createdAt: new Date().toISOString()
    };
    
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    todos.push(newTodo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    
    return newTodo;
  } catch (error) {
    console.error(error);
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newTodo = {
      id: Date.now(),
      todo: task,
      completed: false,
      userId: 1,
      createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return newTodo;
  }
}

export async function toggleTodoComplete(id) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex].completed = !todos[todoIndex].completed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return todos[todoIndex];
  }
  throw new Error('Todos not found');
}

export async function deleteTodo(id) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const filteredTodos = todos.filter(todo => todo.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTodos));
  return true;
}