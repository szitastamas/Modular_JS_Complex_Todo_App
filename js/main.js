var Local_Storage = /** @class */ (function () {
    function Local_Storage() {
    }
    Local_Storage.saveToLocalStorage = function (todoArray) {
        localStorage.setItem('todos', JSON.stringify(todoArray));
    };
    Local_Storage.getTodosFromLocalStorage = function () {
        var todos = JSON.parse(localStorage.getItem('todos'));
        return todos;
    };
    return Local_Storage;
}());
var ToDoRepository = /** @class */ (function () {
    function ToDoRepository() {
    }
    ToDoRepository.allTodos = Local_Storage.getTodosFromLocalStorage() === null ? [] : Local_Storage.getTodosFromLocalStorage();
    return ToDoRepository;
}());
var Todo = /** @class */ (function () {
    function Todo(title, todoDescription) {
        this.id = ToDoRepository.allTodos.length === 0 ? 0 : ToDoRepository.allTodos[ToDoRepository.allTodos.length - 1].id + 1;
        this.title = title;
        this.todoDescription = todoDescription;
        this.creationDate = Date.now();
        this.isFinished = false;
    }
    return Todo;
}());
var UI = /** @class */ (function () {
    function UI() {
    }
    UI.prototype.paintOutTodo = function (todo) {
        var tr = document.createElement('tr');
        tr.classList.add('todo-item');
        tr.id = "todo-" + (todoTableBody.querySelectorAll('.todo-item').length + 1);
        var todoIcon = todo.isFinished
            ? '<i class="far fa-check-circle finished-icon status-icon"></i>'
            : '<i class="fas fa-clipboard-list unfinished-icon status-icon"></i>';
        tr.innerHTML = "\n            <td>" + todoIcon + "</td>\n            <td data-todo-id=\"" + todo.id + "\">" + todo.id + "</td>\n            <td>" + todo.title + "</td>\n            <td>" + todo.todoDescription + "</td>\n            <td><i class=\"far fa-times-circle delete-icon\"></i></td>\n        ";
        todoTableBody.prepend(tr);
    };
    UI.prototype.displayMessage = function (message, className) {
        var msgDiv = document.querySelector('.alert');
        msgDiv.classList.add(className);
        msgDiv.textContent = message;
        setTimeout(function () {
            msgDiv.classList.remove(className);
        }, 1500);
    };
    UI.prototype.updateTodoStatus = function (todo) {
        var todoTds = document.querySelectorAll('[data-todo-id]');
        var toBeUpdatedTodoField = Array.from(todoTds).find(function (t) { return t.dataset.todoId == todo.id; }).previousElementSibling.firstChild;
        if (todo.isFinished) {
            toBeUpdatedTodoField.classList = 'far fa-check-circle finished-icon status-icon';
        }
        else {
            toBeUpdatedTodoField.classList = 'fas fa-clipboard-list unfinished-icon status-icon';
        }
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
    };
    UI.prototype.deleteTodo = function (todo) {
        var todoTds = document.querySelectorAll('[data-todo-id]');
        var toBeDeletedField = Array.from(todoTds).find(function (t) { return t.dataset.todoId == todo.id; }).parentElement;
        toBeDeletedField.remove();
    };
    return UI;
}());
var todoForm = document.getElementById('add-todo-form');
var submitBtn = document.getElementById('add-todo-btn');
var todoTableBody = document.getElementById('todo-table-body');
// Submitting a ToDo
todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var ui = new UI();
    var todoTitle = document.getElementById('todo-title');
    var todoBody = document.getElementById('todo-description');
    if (validateTodoFields(todoTitle.value, todoBody.value)) {
        var oneTodo = new Todo(todoTitle.value, todoBody.value);
        ToDoRepository.allTodos.push(oneTodo);
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
        console.log(ToDoRepository.allTodos);
        ui.displayMessage('Todo successfully added', 'success');
        ui.paintOutTodo(oneTodo);
        document.querySelectorAll('.status-icon').forEach(function (i) { return i.addEventListener('click', statusFunction); });
        document.querySelectorAll('.delete-icon').forEach(function (i) { return i.addEventListener('click', removeTodo); });
        todoTitle.value = "";
        todoBody.value = "";
    }
    else {
        ui.displayMessage('Please fill in all fields!', 'error');
    }
});
function validateTodoFields(field1, field2) {
    if (field1 === '' || field2 === '') {
        return false;
    }
    else {
        return true;
    }
}
function statusFunction(e) {
    var ui = new UI();
    var clickedTodoId = e.target.parentElement.nextElementSibling.textContent;
    var clickedTodo = ToDoRepository.allTodos.find(function (todo) { return todo.id == clickedTodoId; });
    clickedTodo.isFinished = !clickedTodo.isFinished;
    ui.updateTodoStatus(clickedTodo);
    ui.displayMessage("Todo's status changed to: " + (clickedTodo.isFinished ? 'Finished' : 'Unfinished'), 'success');
    console.log(clickedTodo.isFinished ? 'Todo done!' : 'Todo is still to be finished...');
}
function removeTodo(e) {
    var ui = new UI();
    var clickedTodoId = e.target.parentElement.parentElement.children[1].dataset.todoId;
    var clickedTodo = ToDoRepository.allTodos.find(function (todo) { return todo.id == clickedTodoId; });
    ToDoRepository.allTodos.splice(ToDoRepository.allTodos.indexOf(clickedTodo), 1);
    ui.deleteTodo(clickedTodo);
    ui.displayMessage('Todo deleted.', 'success');
    Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
}
document.addEventListener('DOMContentLoaded', function () {
    var ui = new UI();
    if (ToDoRepository.allTodos.length !== 0) {
        ToDoRepository.allTodos.forEach(function (todo) { return ui.paintOutTodo(todo); });
        document.querySelectorAll('.status-icon').forEach(function (i) { return i.addEventListener('click', statusFunction); });
        document.querySelectorAll('.delete-icon').forEach(function (i) { return i.addEventListener('click', removeTodo); });
    }
});
