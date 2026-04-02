import { ATTRIBUTES, TODO_STATUS } from '@/utils/constants.js'
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
  }

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    this.newTodoFormElement = this.rootElement.querySelector(this.selectors.newTodoForm)
    this.newTodoInputElement = this.rootElement.querySelector(this.selectors.newTodoInput)
    this.todoList = this.rootElement.querySelector(this.selectors.todoList)

    this.init()
    this.bindEvent()
  }

  init = () => {
    const isEmpty = todoStore.todos.length === 0

    if (!isEmpty) {
      todoStore.todos.forEach((todo) => this.renderTodo(todo))
    }
  }

  bindEvent = () => {
    this.newTodoFormElement.addEventListener('submit', this.handleNewTodoSubmit)
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

    this.renderTodo(newTodo)
    this.newTodoInputElement.value = ''
  }

  handleTodoCheckbox = (event) => {
    const checkboxElement = event.target
    const todoItemElement = checkboxElement.closest(this.selectors.todoItem)
    const todoId = todoItemElement.getAttribute(ATTRIBUTES.todoId)
    const isChecked = checkboxElement.checked

    todoStore.setTodoStatus(todoId, isChecked)
  }

  handleRemoveTodo = (event) => {
    const todoItemElement = event.target.closest(this.selectors.todoItem)
    const todoId = todoItemElement.getAttribute(ATTRIBUTES.todoId)

    todoStore.removeTodo(todoItemElement, todoId)
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

      if (!hasTitle) {
        return todoStore.removeTodo(todoItemElement, todoId)
      }

      todoStore.setTodoTitle(todoId, newTodoTitle)
    }

    todoItemInputElement.addEventListener('change', handleTitleChange)
    todoItemInputElement.addEventListener('blur', handleBlur)

    todoItemInputElement.readOnly = false
    todoItemInputElement.focus()
    todoItemInputElement.setSelectionRange(todoLength, todoLength)
  }

  renderTodo = (todo) => {
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

    this.todoList.insertAdjacentHTML('afterbegin', todoItemHTML)

    // Все обработчики должны вешаться в bindEvents, логично? Думаю да, подумать как исправить этот момент
    // Фактически можно использовать это как временное решение для проверки handleTodoCheckbox()

    // Вариант ли использовать делегирование событий?
    //    Да, как будто должно работать, но тогда возможно нужно будет немного изменить логику (искать closest/target элементы)
    //    Тогда возможно нужно будет и другие ивенты делегировать

    const checkboxElement = this.todoList.firstElementChild.querySelector(
      this.selectors.todoCheckbox
    )
    const removeButtonElement = this.todoList.firstElementChild.querySelector(
      this.selectors.removeTodoButton
    )
    const editTodoButtonElement = this.todoList.firstElementChild.querySelector(
      this.selectors.editTodoButton
    )

    checkboxElement.addEventListener('click', this.handleTodoCheckbox)
    removeButtonElement.addEventListener('click', this.handleRemoveTodo)
    editTodoButtonElement.addEventListener('click', this.handleEditTodo)
  }

  // Счетчик активных тасок

  // Фильтрация тасок по статусу

  // Сделать стор с тудушками
  //    Сначала была идея как в Н-Суши (Там был отдельный класс BasketStore)
  //    Тут можно глобально в конструкторе получить массив при ините и взаимодействовать с ним
  //        Но как тогда сохранять?
  //            Если не понятно, то можно просто создавать обьект с массивом данных (получать так же
  //            при ините) и методами. Нужно изучить этот момент и все возможные ньюансы
  //    Если верхний - не вариант, то в целом почему бы не создать отдельный класс с стором и его
  //    методами (Гет/Сет и т.п.), как в Н-Суши?
}

export default Todo
