import { STORAGE_KEYS, TODO_STATUS } from '@/utils/constants.js'

class TodoStore {
  constructor() {
    this.todos = this.getTodo()
  }

  setTodo = (todos) => {
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos))
  }

  setTodoTitle = (todoId, todoTitle) => {
    const todo = this.todos.find((todo) => todo.id === todoId)

    todo.name = todoTitle

    this.setTodo(this.todos)
  }

  setTodoStatus = (todoId, isCompleted) => {
    const todo = this.todos.find((todo) => todo.id === todoId)

    if (isCompleted) {
      todo.status = TODO_STATUS.completed
    } else {
      todo.status = TODO_STATUS.active
    }

    this.setTodo(this.todos)
  }

  getTodo = () => {
    // Разобрать кейс, когда юзер в ручную меняет ЛС
    // Прокинуть это все через try/catch
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.todos)) ?? []
  }

  getActiveTodos = () => {
    return todoStore.todos.filter((todo) => todo.status === TODO_STATUS.active)
  }

  createNewTodo = (todoTitle) => {
    return {
      id: crypto.randomUUID(),
      name: todoTitle,
      status: TODO_STATUS.active,
    }
  }

  removeTodo = (todoId) => {
    this.todos = this.todos.filter((todo) => todo.id !== todoId)
    this.setTodo(this.todos)
  }
}

export const todoStore = new TodoStore()
