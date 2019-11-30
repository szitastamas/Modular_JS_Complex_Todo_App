import { UI } from './ui_module.js';
import { Todo, ToDoRepository, UrgentTodo } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';

export const ui = new UI();

let tableRows = null;

// Submitting a Todo
ui.todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const todoTitle = document.getElementById('todo-title').value;

    const todoBody = document.getElementById('todo-description').value;
    const dueDate = document.getElementById('urgent-todo-calendar-day').value;
    const dueTime = document.getElementById('urgent-todo-calendar-time').value;

    if (validateTodoFields(todoTitle, todoBody)) {
        let oneTodo;
        if (ui.urgentCheckBox.checked === true) {
            oneTodo = new UrgentTodo(todoTitle, todoBody, new Date(`${dueDate} ${dueTime}`));
        } else {
            oneTodo = new Todo(todoTitle, todoBody);
        }

        ToDoRepository.allTodos.push(oneTodo);
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
        ui.clearInput();
        ui.displayMessage('Todo successfully added', 'success');
        ui.paintOutTodo(oneTodo);
    } else {
        ui.displayMessage('Please fill in all fields!', 'error');
    }

    ui.todoTableRows.forEach(row => row.addEventListener('click', handleTodoItemClick));
});

function validateTodoFields(field1, field2) {
    if (field1 === '' || field2 === '') {
        return false;
    } else {
        return true;
    }
}

function statusFunction(todo) {
    
    ui.updateTodoStatus(todo);
    ui.displayMessage(`Todo's status changed to: ${todo.isFinished ? 'Finished' : 'Unfinished'}`, 'success');
}

function removeTodo(todo) {
   
    ToDoRepository.allTodos.splice(ToDoRepository.allTodos.indexOf(todo), 1);
    ui.deleteTodo(todo);
    ui.displayMessage('Todo deleted.', 'success');
    Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
}

document.addEventListener('DOMContentLoaded', () => {
    Local_Storage.getTodosFromLocalStorage();
    if (ToDoRepository.allTodos.length !== 0) {
        ToDoRepository.allTodos.forEach(todo => ui.paintOutTodo(todo));

        ui.todoTableRows.forEach(row => row.addEventListener('click', handleTodoItemClick));
    }

    ui.urgentCheckBoxCover.addEventListener('click', () => {
        ui.checkBoxControl();
    });

    ui.checkTodoArrayForEmpty();
    ui.updateTimer();
    
});

function handleTodoItemClick(e) {

    let clickedTodoId = e.target.parentElement.parentElement.id.split('-')[1];
    const clickedTodo = ToDoRepository.allTodos.find(todo => todo.id == clickedTodoId);


    if (e.srcElement.classList.contains('status-icon')) {
        statusFunction(clickedTodo);
    } else if (e.srcElement.classList.contains('delete-todo-btn')) {
        removeTodo(clickedTodo);
    } else if (e.srcElement.classList.contains('edit-todo-btn')) {
        ui.changeState('edit', clickedTodo);
    }
}
