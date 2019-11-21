import { Todo } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';
import { ToDoRepository } from './todo_modul.js';
import * as globalVars from './main.js';

export class UI {
    paintOutTodo(todo) {
        let tr = document.createElement('tr');
        tr.classList.add('todo-item');
        tr.id = `todo-${globalVars.todoTableBody.querySelectorAll('.todo-item').length + 1}`;

        const todoIcon = todo.isFinished
            ? '<i class="far fa-check-circle finished-icon status-icon"></i>'
            : '<i class="fas fa-clipboard-list unfinished-icon status-icon"></i>';

        tr.innerHTML = `
            <td>${todoIcon}</td>
            <td data-todo-id="${todo.id}">${todo.id}</td>
            <td>${todo.title}</td>
            <td>${todo.todoBody}</td>
            <td><i class="far fa-times-circle delete-icon"></i></td>
        `;

        globalVars.todoTableBody.prepend(tr);
    }

    displayMessage(message, className) {
        const msgDiv = document.querySelector('.alert');
        msgDiv.classList.add(className);
        msgDiv.textContent = message;

        setTimeout(() => {
            msgDiv.classList.remove(className);
        }, 1500);
    }

    updateTodoStatus(todo) {
        let todoTds = document.querySelectorAll('[data-todo-id]');

        let toBeUpdatedTodoField = Array.from(todoTds).find(t => t.dataset.todoId == todo.id).previousElementSibling.firstChild;

        if (todo.isFinished) {
            toBeUpdatedTodoField.classList = 'far fa-check-circle finished-icon status-icon';
        } else {
            toBeUpdatedTodoField.classList = 'fas fa-clipboard-list unfinished-icon status-icon';
        }

        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
    }

    deleteTodo(todo) {
        let todoTds = document.querySelectorAll('[data-todo-id]');

        let toBeDeletedField = Array.from(todoTds).find(t => t.dataset.todoId == todo.id).parentElement;

        toBeDeletedField.remove();
    }
}
