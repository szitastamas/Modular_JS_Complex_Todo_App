import { Todo, UrgentTodo } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';
import { ToDoRepository } from './todo_modul.js';

export class UI {
    paintOutTodo(todo) {
        let tr = document.createElement('tr');
        tr.className = 'todo-item';
        if(todo instanceof UrgentTodo){
            tr.classList.add("urgent");
        }
        tr.id = `todo-${todo.id}`;
        let shortBody = "";

        if(todo.todoBody.length > 15){
            shortBody = `${todo.todoBody.substring(0, 14)}...`;
        }

        const todoIcon = todo.isFinished
            ? '<i class="far fa-check-circle finished-icon status-icon"></i>'
            : '<i class="fas fa-clipboard-list unfinished-icon status-icon"></i>';

        tr.innerHTML = `
            <td>${todoIcon}</td>
            <td data-todo-id="${todo.id}">${todo.id}</td>
            <td>${todo.title}</td>
            <td>${todo.todoBody.length > 15 ? shortBody : todo.todoBody}</td>
            <td><i class="far fa-times-circle delete-icon"></i></td>
        `;

        todoTableBody.prepend(tr);
        if(document.querySelector(".empty-table-identifier")){
            document.querySelector(".empty-table-identifier").remove();
        }
    }

    displayMessage(message, className) {

        const msgDiv = document.querySelector('.alert');
        msgDiv.classList.add(className);
        msgDiv.textContent = message;

        setTimeout(() => {
            msgDiv.classList.remove(className);
        }, 1200);
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

        this.checkTodoArray();
    }


    clearInput(){
        todoForm.querySelectorAll('input[type="text"]').forEach(input => input.value ="");
        console.log("Input fields cleared.")
    }

    checkTodoArray(){
        if(ToDoRepository.allTodos.length === 0){
            todoTableBody.innerHTML = `<tr class="empty-table-identifier"><td colspan="6">There are no todos to show...</td></tr>`;
        }
    }

    checkBoxControl(){
        
        let isUrgentDataset = JSON.parse(urgentCheckBoxCover.dataset.urgentCbCheck);
        urgentCheckBox.checked = isUrgentDataset

        urgentCheckBoxCover.dataset.urgentCbCheck = !isUrgentDataset;

        return isUrgentDataset;
    }
}

export const urgentCheckBox = document.getElementById("urgent-todo-checkbox");
export const urgentCheckBoxCover = document.querySelector(".checkbox-cover");
export const todoForm = document.getElementById('add-todo-form');
export const submitBtn = document.getElementById('add-todo-btn');
export const todoTableBody = document.getElementById('todo-table-body');