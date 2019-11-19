var Todo = /** @class */ (function () {
    function Todo(title, todoBody) {
        this.title = title;
        this.todoBody = todoBody;
        this.creationDate = Date.now();
        this.isFinished = false;
    }
    Todo.prototype.finishTodo = function () {
        this.isFinished = true;
    };
    return Todo;
}());
var UI = /** @class */ (function () {
    function UI() {
    }
    UI.prototype.createTodo = function (todo) {
        var tr = document.createElement("tr");
        tr.classList.add("todo-item");
        tr.id = "todo-" + (todoTableBody.querySelectorAll(".todo-item").length + 1);
        var todoIcon = todo.isFinished
            ? '<i class="far fa-check-circle finished-icon status-icon"></i>'
            : '<i class="fas fa-clipboard-list unfinished-icon status-icon"></i>';
        tr.innerHTML =
            "\n            <td>" + todoIcon + "</td>\n            <td>" + todo.title + "</td>\n            <td>" + todo.todoBody + "</td>\n            <td><i class=\"far fa-times-circle delete-icon\"></i></td>\n        ";
        todoTableBody.prepend(tr);
    };
    return UI;
}());
var ToDoRepository = /** @class */ (function () {
    function ToDoRepository() {
    }
    ToDoRepository.allTodos = [];
    return ToDoRepository;
}());
var todoForm = document.getElementById("add-todo-form");
var submitBtn = document.getElementById("add-todo-btn");
var todoTableBody = document.getElementById("todo-table-body");
// Submitting a ToDo
todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var ui = new UI;
    var todoTitle = document.getElementById("todo-title").value;
    var todoBody = document.getElementById("todo-description").value;
    var oneTodo = new Todo(todoTitle, todoBody);
    ToDoRepository.allTodos.push(oneTodo);
    console.log(oneTodo);
    console.log(ToDoRepository.allTodos);
    ui.createTodo(oneTodo);
    document.querySelectorAll(".status-icon").forEach(function (i) { return i.addEventListener("click", statusFunction); });
});
function statusFunction(e) {
    console.log(e.target);
}
