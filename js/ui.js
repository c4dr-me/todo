export function renderTodos(todos, container, onToggleComplete, onDelete) {
  container.innerHTML = "";
  if (todos.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-500 py-8">No todos found.</div>`;
    return;
  }
  todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = `bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out ${todo.completed ? "opacity-60" : ""}`;
    
    div.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1">
          <input 
            type="checkbox" 
            ${todo.completed ? "checked" : ""} 
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            data-id="${todo.id}"
          />
          <span class="flex-1 ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}">${todo.todo}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-400">${formatDate(todo.createdAt)}</span>
          <button 
            class="text-red-500 hover:text-red-700 focus:outline-none"
            data-id="${todo.id}"
            title="Delete todo"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    const checkbox = div.querySelector('input[type="checkbox"]');
    const deleteBtn = div.querySelector('button');
    
    checkbox.addEventListener('change', () => onToggleComplete(todo.id));
    deleteBtn.addEventListener('click', () => onDelete(todo.id));
    
    container.appendChild(div);
  });
}

export function renderPagination(totalPages, currentPage, onPageClick) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  
  if (totalPages <= 1) return;
  
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
        i === currentPage ? "bg-blue-50 text-blue-600 border-blue-300" : ""
      }">
        ${i}
      </button>
    `;
    li.addEventListener("click", () => onPageClick(i));
    pagination.appendChild(li);
  }
}

export function showLoading(show) {
  const loader = document.getElementById("loading");
  loader.classList.toggle("hidden", !show);
}

export function showError(message) {
  const errorBox = document.getElementById("error");
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 3000);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}