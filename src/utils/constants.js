export const STORAGE_KEYS = {
  theme: 'theme',
  todos: 'todos',
}

export const TODO_STATUS = {
  active: 'active',
  completed: 'completed',
}

export const ATTRIBUTES = {
  todoId: 'data-todo-id',
  filterType: 'data-filter-type',
}

export const FILTER_TYPES = {
  all: 'all',
  active: 'active',
  completed: 'completed',
}

export const EMPTY_STATE = {
  [FILTER_TYPES.all]: {
    title: 'Empty as my motivation 😅 Let’s start adding stuff!',
  },
  [FILTER_TYPES.active]: {
    title: 'Nothing to do right now 😎 You’re all caught up!',
  },
  [FILTER_TYPES.completed]: {
    title: 'No completed tasks yet 🫠 Time to get things done!',
  },
}
