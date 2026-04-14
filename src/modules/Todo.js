import { ATTRIBUTES, EMPTY_STATE, FILTER_TYPES, TODO_STATUS } from '@/utils/constants.js'
import { todoStore } from '@/modules/TodoStore.js'

class Todo {
  selectors = {
    root: '[data-js-todo]',
    newTodoForm: '[data-js-todo-new-todo-form]',
    newTodoInput: '[data-js-todo-new-todo-input]',
    todoList: '[data-js-todo-list]',
    todoItem: '[data-js-todo-item]',
    todoCheckbox: '[data-js-todo-item-checkbox]',
    todoItemInput: '[data-js-todo-item-text]',
    removeTodoButton: '[data-js-todo-item-actions-delete-button]',
    editTodoButton: '[data-js-todo-item-actions-edit-button]',
    activeTodosCount: '[data-js-active-todos-count]',
    filters: '[data-js-filters]',
    filterButton: '[data-js-filters-button]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    this.newTodoFormElement = this.rootElement.querySelector(this.selectors.newTodoForm)
    this.newTodoInputElement = this.rootElement.querySelector(this.selectors.newTodoInput)
    this.todoListElement = this.rootElement.querySelector(this.selectors.todoList)
    this.activeTodosCountElement = this.rootElement.querySelector(this.selectors.activeTodosCount)
    this.filtersElement = this.rootElement.querySelector(this.selectors.filters)
    this.filtersButtonElements = this.filtersElement.querySelectorAll(this.selectors.filterButton)

    this.stateFilters = {
      activeFilterType: [...this.filtersButtonElements]
        .find((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive))
        ?.getAttribute(ATTRIBUTES.filterType),
    }

    this.updateUI()
    this.bindEvent()
  }

  bindEvent = () => {
    this.newTodoFormElement.addEventListener('submit', this.handleNewTodoSubmit)
    this.filtersElement.addEventListener('click', this.handleFilterTodos)
    this.todoListElement.addEventListener('click', this.onTodoListClick)
  }

  onTodoListClick = (event) => {
    const checkboxElement = event.target.closest(this.selectors.todoCheckbox)

    if (checkboxElement) {
      this.handleTodoStatusChange(event)
    }

    const removeButtonElement = event.target.closest(this.selectors.removeTodoButton)

    if (removeButtonElement) {
      this.handleRemoveTodo(event)
    }

    const editTodoButtonElement = event.target.closest(this.selectors.editTodoButton)

    if (editTodoButtonElement) {
      this.handleEditTodo(event)
    }
  }

  handleNewTodoSubmit = (event) => {
    event.preventDefault()

    const newTodoTitle = this.newTodoInputElement.value
    const hasTitle = newTodoTitle.trim().length > 0

    if (!hasTitle) {
      return
    }

    const newTodo = todoStore.createNewTodo(newTodoTitle)

    todoStore.todos.push(newTodo)
    todoStore.setTodo(todoStore.todos)

    this.updateUI()
    this.newTodoInputElement.value = ''
  }

  handleTodoStatusChange = (event) => {
    const checkboxElement = event.target
    const isChecked = checkboxElement.checked
    const todoItemElement = checkboxElement.closest(this.selectors.todoItem)
    const todoId = todoItemElement.getAttribute(ATTRIBUTES.todoId)

    todoStore.setTodoStatus(todoId, isChecked)

    this.renderActiveTodosCount()
  }

  handleRemoveTodo = (event) => {
    const todoItemElement = event.target.closest(this.selectors.todoItem)
    const todoId = todoItemElement.getAttribute(ATTRIBUTES.todoId)

    todoStore.removeTodo(todoId)

    this.updateUI()
  }

  handleEditTodo = (event) => {
    const todoItemElement = event.target.closest(this.selectors.todoItem)
    const todoId = todoItemElement.getAttribute(ATTRIBUTES.todoId)
    const todoItemInputElement = todoItemElement.querySelector(this.selectors.todoItemInput)
    const todoLength = todoItemInputElement.value.length

    const handleBlur = () => {
      todoItemInputElement.readOnly = true
      todoItemInputElement.removeEventListener('blur', handleBlur)
      todoItemInputElement.removeEventListener('change', handleTitleChange)
    }
    const handleTitleChange = () => {
      const newTodoTitle = todoItemInputElement.value
      const hasTitle = newTodoTitle.trim().length > 0

      if (hasTitle) {
        return todoStore.setTodoTitle(todoId, newTodoTitle)
      }

      todoStore.removeTodo(todoId)

      this.updateUI()
    }

    todoItemInputElement.addEventListener('change', handleTitleChange)
    todoItemInputElement.addEventListener('blur', handleBlur)
    todoItemInputElement.readOnly = false
    todoItemInputElement.focus()
    todoItemInputElement.setSelectionRange(todoLength, todoLength)
  }

  handleFilterTodos = (event) => {
    const filterType = event.target.getAttribute(ATTRIBUTES.filterType)

    this.stateFilters.activeFilterType = filterType
    this.filtersButtonElements.forEach((buttonElement) => {
      const isActiveFilter = filterType === buttonElement.getAttribute(ATTRIBUTES.filterType)

      buttonElement.classList.toggle(this.stateClasses.isActive, isActiveFilter)
    })

    const filteredTodos = this.filterTodos(filterType)

    if (filteredTodos.length === 0) {
      return this.renderEmptyState(filterType)
    }

    this.renderTodos(filteredTodos)
  }

  renderTodos = (todos) => {
    this.todoListElement.replaceChildren()

    todos.forEach((todo) => {
      const { id, name, status } = todo
      const isChecked = status === TODO_STATUS.completed ? 'checked' : ''

      const todoItemHTML = `
      <li class="todo__list-item todo-item" data-js-todo-item data-todo-id="${id}">
        <div class="todo-item__content">
          <label class="visually-hidden" for="todo-${id}">Mark todo as completed</label>
          <input
            class="todo-item__checkbox"
            type="checkbox"
            id="todo-${id}"
            data-js-todo-item-checkbox
            ${isChecked}
          />
          <input
            class="todo-item__title"
            type="text"
            value="${name}"
            aria-label="Todo"
            readonly
            data-js-todo-item-text
          />
        </div>
        <div class="todo-item__actions" data-js-todo-item-actions>
          <button
            class="todo-item__actions-button"
            type="button"
            aria-label="Edit todo"
            data-js-todo-item-actions-edit-button
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1739 6.81201C21.7026 6.28344 21.9997 5.56648 21.9998 4.81887C21.9999 4.07125 21.703 3.35422 21.1744 2.82551C20.6459 2.29681 19.9289 1.99973 19.1813 1.99963C18.4337 1.99954 17.7166 2.29644 17.1879 2.82501L3.84193 16.174C3.60975 16.4055 3.43805 16.6905 3.34193 17.004L2.02093 21.356C1.99509 21.4425 1.99314 21.5344 2.01529 21.6219C2.03743 21.7094 2.08285 21.7892 2.14673 21.853C2.21061 21.9168 2.29055 21.9621 2.37809 21.9841C2.46563 22.0061 2.55749 22.004 2.64393 21.978L6.99693 20.658C7.3101 20.5628 7.59511 20.3921 7.82693 20.161L21.1739 6.81201Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 5L19 9"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="todo-item__actions-button"
            type="button"
            aria-label="Delete todo"
            data-js-todo-item-actions-delete-button
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </li>
    `

      this.todoListElement.insertAdjacentHTML('afterbegin', todoItemHTML)
    })
  }

  renderActiveTodosCount = () => {
    this.activeTodosCountElement.textContent = todoStore.getFilteredTodos(
      FILTER_TYPES.active
    ).length
  }

  renderEmptyState = (filterType) => {
    const emptyStateHTML = `
      <div class="todo__empty-state empty-state">
        <img
          class="empty-state__image"
          src="./src/assets/images/empty-state-image.png"
          alt="Man taking a selfie"
          width="340"
          height="479"
          loading="lazy"
        />
        <h2 class="empty-state__title">${EMPTY_STATE[filterType].title}</h2>
      </div>
    `

    this.todoListElement.replaceChildren()
    this.todoListElement.insertAdjacentHTML('beforeend', emptyStateHTML)
  }

  filterTodos = (filterType) => {
    let filteredTodos

    switch (filterType) {
      case FILTER_TYPES.all:
        filteredTodos = todoStore.todos
        break
      case FILTER_TYPES.active:
        filteredTodos = todoStore.getFilteredTodos(filterType)
        break
      case FILTER_TYPES.completed:
        filteredTodos = todoStore.getFilteredTodos(filterType)
        break
    }

    return filteredTodos
  }

  updateUI = () => {
    this.renderActiveTodosCount()

    const filterType = this.stateFilters.activeFilterType
    const isEmptyAll = todoStore.todos.length === 0

    if (isEmptyAll) {
      return this.renderEmptyState(filterType)
    }

    const todos = this.filterTodos(filterType)

    this.renderTodos(todos)
  }
}

export default Todo
