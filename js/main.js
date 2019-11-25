import {
    UI,
    urgentCheckBox,
    urgentCheckBoxCover,
    todoForm,
    submitBtn,
    todoTableBody
} from './ui_module.js';
import { Todo, ToDoRepository, UrgentTodo } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';





// Submitting a Todo
todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const ui = new UI();

    const todoTitle = document.getElementById('todo-title').value;

    const todoBody = document.getElementById('todo-description').value;
    const dueDate = document.getElementById("urgent-todo-calendar-day").value;
    const dueTime = document.getElementById("urgent-todo-calendar-time").value;

    if (validateTodoFields(todoTitle, todoBody)) {

        let oneTodo;
        if(urgentCheckBox.checked === true){
            oneTodo = new UrgentTodo(todoTitle, todoBody, new Date(`${dueDate} ${dueTime}`));
        }else{
            oneTodo = new Todo(todoTitle, todoBody);
        }

        ToDoRepository.allTodos.push(oneTodo);
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);

        console.log(ToDoRepository.allTodos);
        ui.displayMessage('Todo successfully added', 'success');
        ui.paintOutTodo(oneTodo);
        document.querySelectorAll('.status-icon').forEach(i => i.addEventListener('click', statusFunction));
        document.querySelectorAll('.delete-todo-btn').forEach(i => i.addEventListener('click', removeTodo));
        document.querySelectorAll('.clock-icon').forEach(i => i.addEventListener('mouseover', showTime));
        document.querySelectorAll('.clock-icon').forEach(i => i.addEventListener('mouseleave', removeShowTime));
        ui.clearInput();
    } else {
        ui.displayMessage('Please fill in all fields!', 'error');
    }
});

function validateTodoFields(field1, field2) {
    if (field1 === '' || field2 === '') {
        return false;
    } else {
        return true;
    }
}

function statusFunction(e) {
    const ui = new UI();
    let clickedTodoId = e.target.parentElement.nextElementSibling.textContent;
    const clickedTodo = ToDoRepository.allTodos.find(todo => todo.id == clickedTodoId);
    clickedTodo.isFinished = !clickedTodo.isFinished;
    ui.updateTodoStatus(clickedTodo);
    ui.displayMessage(`Todo's status changed to: ${clickedTodo.isFinished ? 'Finished' : 'Unfinished'}`, 'success');
    console.log(clickedTodo.isFinished ? 'Todo done!' : 'Todo is still to be finished...');
}

function removeTodo(e) {
    const ui = new UI();
    let clickedTodoId = e.target.parentElement.parentElement.querySelector("[data-todo-id]").dataset.todoId;
    const clickedTodo = ToDoRepository.allTodos.find(todo => todo.id == clickedTodoId);
    ToDoRepository.allTodos.splice(ToDoRepository.allTodos.indexOf(clickedTodo), 1);
    ui.deleteTodo(clickedTodo);
    ui.displayMessage('Todo deleted.', 'success');
    Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    Local_Storage.getTodosFromLocalStorage();
    console.log(ToDoRepository.allTodos)
    if (ToDoRepository.allTodos.length !== 0) {
        ToDoRepository.allTodos.forEach(todo => ui.paintOutTodo(todo));
        document.querySelectorAll('.status-icon').forEach(i => i.addEventListener('click', statusFunction));
        document.querySelectorAll('.delete-todo-btn').forEach(i => i.addEventListener('click', removeTodo));
        document.querySelectorAll('.clock-icon').forEach(i => i.addEventListener('mouseover', showTime));
        document.querySelectorAll('.clock-icon').forEach(i => i.addEventListener('mouseleave', removeShowTime));
    }

    urgentCheckBoxCover.addEventListener("click", (e) => {
        ui.checkBoxControl();
        
    })

    ui.checkTodoArray();
});

const showTime = function(e){
    const ui = new UI();
    let urgTodoId = e.target.parentElement.parentElement.querySelector("[data-todo-id]").dataset.todoId;
    let checkedTodo = ToDoRepository.allTodos.find(t => t.id == urgTodoId);

    ui.showRemainingTime(checkedTodo, e.srcElement);
}

const removeShowTime = function(e){
    e.target.firstChild.remove();
}