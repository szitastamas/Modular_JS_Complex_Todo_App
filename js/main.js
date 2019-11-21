import { UI } from './ui_module.js';
import { Todo, ToDoRepository } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';

export const todoForm = document.getElementById('add-todo-form');
export const submitBtn = document.getElementById('add-todo-btn');
export const todoTableBody = document.getElementById('todo-table-body');

// Submitting a Todo
todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const ui = new UI();

    const todoTitle = document.getElementById('todo-title').value;

    const todoBody = document.getElementById('todo-description').value;

    if (validateTodoFields(todoTitle, todoBody)) {
        const oneTodo = new Todo(todoTitle, todoBody);
        ToDoRepository.allTodos.push(oneTodo);
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);

        console.log(ToDoRepository.allTodos);
        ui.displayMessage('Todo successfully added', 'success');
        ui.paintOutTodo(oneTodo);
        document.querySelectorAll('.status-icon').forEach(i => i.addEventListener('click', statusFunction));
        document.querySelectorAll('.delete-icon').forEach(i => i.addEventListener('click', removeTodo));
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
    let clickedTodoId = e.target.parentElement.parentElement.children[1].dataset.todoId;
    const clickedTodo = ToDoRepository.allTodos.find(todo => todo.id == clickedTodoId);
    ToDoRepository.allTodos.splice(ToDoRepository.allTodos.indexOf(clickedTodo), 1);
    ui.deleteTodo(clickedTodo);
    ui.displayMessage('Todo deleted.', 'success');
    Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
}

document.addEventListener('DOMContentLoaded', () => {
    let ui = new UI();
    if (ToDoRepository.allTodos.length !== 0) {
        ToDoRepository.allTodos.forEach(todo => ui.paintOutTodo(todo));
        document.querySelectorAll('.status-icon').forEach(i => i.addEventListener('click', statusFunction));
        document.querySelectorAll('.delete-icon').forEach(i => i.addEventListener('click', removeTodo));
    }
});
