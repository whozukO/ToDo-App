(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(e){if(e.ep)return;e.ep=!0;const i=o(e);fetch(e.href,i)}})();const h={theme:"theme",todos:"todos"},c={active:"active",completed:"completed"},r={todoId:"data-todo-id",filterType:"data-filter-type"},l={all:"all",active:"active",completed:"completed"},T={[l.all]:{title:"Empty as my motivation 😅 Let’s start adding stuff!"},[l.active]:{title:"Nothing to do right now 😎 You’re all caught up!"},[l.completed]:{title:"No completed tasks yet 🫠 Time to get things done!"}};class g{selectors={toggleButton:"[data-js-toggle-theme-button]"};themes={dark:"dark",light:"light"};constructor(){this.toggleButtonElement=document.querySelector(this.selectors.toggleButton),this.setInitialTheme(),this.bindEvents()}setInitialTheme=()=>{const t=localStorage.getItem(h.theme);(t===this.themes.light||t===this.themes.dark)&&this.setTheme(t)};saveThemeToLocalStorage=t=>{localStorage.setItem(h.theme,t)};onToggleButtonClick=()=>{document.documentElement.dataset.theme===this.themes.dark?(this.setTheme(this.themes.light),this.saveThemeToLocalStorage(this.themes.light)):(this.setTheme(this.themes.dark),this.saveThemeToLocalStorage(this.themes.dark))};setTheme=t=>{document.documentElement.dataset.theme=t};bindEvents=()=>{this.toggleButtonElement.addEventListener("click",this.onToggleButtonClick)}}class p{constructor(){this.todos=this.getTodo()}setTodo=t=>{localStorage.setItem(h.todos,JSON.stringify(t))};setTodoTitle=(t,o)=>{const s=this.todos.find(e=>e.id===t);s.name=o,this.setTodo(this.todos)};setTodoStatus=(t,o)=>{const s=this.todos.find(e=>e.id===t);o?s.status=c.completed:s.status=c.active,this.setTodo(this.todos)};getTodo=()=>JSON.parse(localStorage.getItem(h.todos))??[];getFilteredTodos=t=>d.todos.filter(o=>o.status===t);createNewTodo=t=>({id:crypto.randomUUID(),name:t,status:c.active});removeTodo=t=>{this.todos=this.todos.filter(o=>o.id!==t),this.setTodo(this.todos)}}const d=new p;class f{selectors={root:"[data-js-todo]",newTodoForm:"[data-js-todo-new-todo-form]",newTodoInput:"[data-js-todo-new-todo-input]",todoList:"[data-js-todo-list]",todoItem:"[data-js-todo-item]",todoCheckbox:"[data-js-todo-item-checkbox]",todoItemInput:"[data-js-todo-item-text]",removeTodoButton:"[data-js-todo-item-actions-delete-button]",editTodoButton:"[data-js-todo-item-actions-edit-button]",activeTodosCount:"[data-js-active-todos-count]",filters:"[data-js-filters]",filterButton:"[data-js-filters-button]"};stateClasses={isActive:"is-active"};constructor(){this.rootElement=document.querySelector(this.selectors.root),this.newTodoFormElement=this.rootElement.querySelector(this.selectors.newTodoForm),this.newTodoInputElement=this.rootElement.querySelector(this.selectors.newTodoInput),this.todoListElement=this.rootElement.querySelector(this.selectors.todoList),this.activeTodosCountElement=this.rootElement.querySelector(this.selectors.activeTodosCount),this.filtersElement=this.rootElement.querySelector(this.selectors.filters),this.filtersButtonElements=this.filtersElement.querySelectorAll(this.selectors.filterButton),this.stateFilters={activeFilterType:[...this.filtersButtonElements].find(t=>t.classList.contains(this.stateClasses.isActive))?.getAttribute(r.filterType)},this.updateUI(),this.bindEvent()}bindEvent=()=>{this.newTodoFormElement.addEventListener("submit",this.handleNewTodoSubmit),this.filtersElement.addEventListener("click",this.handleFilterTodos),this.todoListElement.addEventListener("click",this.onTodoListClick)};onTodoListClick=t=>{t.target.closest(this.selectors.todoCheckbox)&&this.handleTodoStatusChange(t),t.target.closest(this.selectors.removeTodoButton)&&this.handleRemoveTodo(t),t.target.closest(this.selectors.editTodoButton)&&this.handleEditTodo(t)};handleNewTodoSubmit=t=>{t.preventDefault();const o=this.newTodoInputElement.value;if(!(o.trim().length>0))return;const e=d.createNewTodo(o);d.todos.push(e),d.setTodo(d.todos),this.updateUI(),this.newTodoInputElement.value=""};handleTodoStatusChange=t=>{const o=t.target,s=o.checked,i=o.closest(this.selectors.todoItem).getAttribute(r.todoId);d.setTodoStatus(i,s),this.renderActiveTodosCount()};handleRemoveTodo=t=>{const s=t.target.closest(this.selectors.todoItem).getAttribute(r.todoId);d.removeTodo(s),this.updateUI()};handleEditTodo=t=>{const o=t.target.closest(this.selectors.todoItem),s=o.getAttribute(r.todoId),e=o.querySelector(this.selectors.todoItemInput),i=e.value.length,n=()=>{e.readOnly=!0,e.removeEventListener("blur",n),e.removeEventListener("change",a)},a=()=>{const u=e.value;if(u.trim().length>0)return d.setTodoTitle(s,u);d.removeTodo(s),this.updateUI()};e.addEventListener("change",a),e.addEventListener("blur",n),e.readOnly=!1,e.focus(),e.setSelectionRange(i,i)};handleFilterTodos=t=>{const o=t.target.getAttribute(r.filterType);this.stateFilters.activeFilterType=o,this.filtersButtonElements.forEach(e=>{const i=o===e.getAttribute(r.filterType);e.classList.toggle(this.stateClasses.isActive,i)});const s=this.filterTodos(o);if(s.length===0)return this.renderEmptyState(o);this.renderTodos(s)};renderTodos=t=>{this.todoListElement.replaceChildren(),t.forEach(o=>{const{id:s,name:e,status:i}=o,n=i===c.completed?"checked":"",a=`
      <li class="todo__list-item todo-item" data-js-todo-item data-todo-id="${s}">
        <div class="todo-item__content">
          <label class="visually-hidden" for="todo-${s}">Mark todo as completed</label>
          <input
            class="todo-item__checkbox"
            type="checkbox"
            id="todo-${s}"
            data-js-todo-item-checkbox
            ${n}
          />
          <input
            class="todo-item__title"
            type="text"
            value="${e}"
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
    `;this.todoListElement.insertAdjacentHTML("afterbegin",a)})};renderActiveTodosCount=()=>{this.activeTodosCountElement.textContent=d.getFilteredTodos(l.active).length};renderEmptyState=t=>{const o=`
      <div class="todo__empty-state empty-state">
        <img
          class="empty-state__image"
          src="/empty-state-image.png"
          alt="Man taking a selfie"
          width="340"
          height="479"
          loading="lazy"
        />
        <h2 class="empty-state__title">${T[t].title}</h2>
      </div>
    `;this.todoListElement.replaceChildren(),this.todoListElement.insertAdjacentHTML("beforeend",o)};filterTodos=t=>{let o;switch(t){case l.all:o=d.todos;break;case l.active:o=d.getFilteredTodos(t);break;case l.completed:o=d.getFilteredTodos(t);break}return o};updateUI=()=>{this.renderActiveTodosCount();const t=this.stateFilters.activeFilterType;if(d.todos.length===0)return this.renderEmptyState(t);const s=this.filterTodos(t);this.renderTodos(s)}}new g;new f;
