import { addTodo, fetchTodos, toggleTodoComplete, deleteTodo } from "./api.js";
import { renderTodos, renderPagination, showLoading, showError } from "./ui.js";

let todos = [];
let filteredTodos = [];
let currentPage = 1;
const itemsPerPage = 10;

export async function initializeApp() {
  try {
    showLoading(true);
    todos = await fetchTodos();
    filteredTodos = [...todos];
    renderPage();
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

export function setupEventListeners() {
  document.getElementById("addTodoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTask = document.getElementById("newTodo").value.trim();
    if (!newTask) return;
    
    try {
      showLoading(true);
      const newTodo = await addTodo(newTask);
      todos.unshift(newTodo);
      filteredTodos = [...todos];
      currentPage = 1;
      renderPage();
      e.target.reset();
    } catch (err) {
      showError(err.message);
    } finally {
      showLoading(false);
    }
  });

  document.getElementById("searchInput").addEventListener("input", filterAndRender);
  document.getElementById("fromDate").addEventListener("change", filterAndRender);
  document.getElementById("toDate").addEventListener("change", filterAndRender);
}

async function handleToggleComplete(id) {
  try {
    await toggleTodoComplete(id);
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex].completed = !todos[todoIndex].completed;
    }
    filterAndRender();
  } catch (err) {
    showError(err.message);
  }
}

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this todo?')) {
    try {
      await deleteTodo(id);
      todos = todos.filter(todo => todo.id !== id);
      filterAndRender();
    } catch (err) {
      showError(err.message);
    }
  }
}

function filterAndRender() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const fromInput = document.getElementById("fromDate").value;
  const toInput = document.getElementById("toDate").value;

  filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.todo.toLowerCase().includes(searchValue);
    
    let inDateRange = true;
    if (fromInput || toInput) {
      const createdAt = new Date(todo.createdAt);
      const createdDateOnly = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
      
      if (fromInput) {
        const fromDate = new Date(fromInput);
        if (!isNaN(fromDate)) {
          inDateRange = inDateRange && createdDateOnly >= fromDate;
        }
      }
      
      if (toInput) {
        const toDate = new Date(toInput);
        if (!isNaN(toDate)) {
          inDateRange = inDateRange && createdDateOnly <= toDate;
        }
      }
    }
    
    return matchesSearch && inDateRange;
  });

  currentPage = 1;
  renderPage();
}

function renderPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = filteredTodos.slice(start, start + itemsPerPage);
  renderTodos(paginatedTodos, document.getElementById("todoList"), handleToggleComplete, handleDelete);
  renderPagination(Math.ceil(filteredTodos.length / itemsPerPage), currentPage, (page) => {
    currentPage = page;
    renderPage();
  });
}