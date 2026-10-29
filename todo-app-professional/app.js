document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const taskCounter = document.getElementById('task-counter');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let todos = JSON.parse(localStorage.getItem('aesthetic_todos')) || [
    { id: 1, text: 'Morning workout 🧘‍♀️', completed: false },
    { id: 2, text: 'Read 20 pages 📖', completed: true },
    { id: 3, text: 'Water the plants 🌿', completed: false }
  ];

  let currentFilter = 'all';

  function saveTodos() {
    localStorage.setItem('aesthetic_todos', JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
          ✨ No tasks right now! Time to relax 🌸
        </div>
      `;
    } else {
      filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
          <div class="todo-content" onclick="toggleTodo(${todo.id})">
            <div class="custom-checkbox">${todo.completed ? '🌸' : ''}</div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
          </div>
          <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete task">✕</button>
        `;
        todoList.appendChild(li);
      });
    }

    updateCounter();
  }

  function updateCounter() {
    const activeCount = todos.filter(t => !t.completed).length;
    taskCounter.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} left ✨`;
  }

  window.toggleTodo = function(id) {
    todos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
  };

  window.deleteTodo = function(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
  };

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      todos.push({
        id: Date.now(),
        text: text,
        completed: false
      });
      todoInput.value = '';
      saveTodos();
      renderTodos();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });

  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderTodos();
});