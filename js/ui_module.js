import { Todo, UrgentTodo } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';
import { ToDoRepository } from './todo_modul.js';

export class UI {
    constructor(){
        this.urgentCheckBox = document.getElementById("urgent-todo-checkbox");
        this.urgentCheckBoxCover = document.querySelector(".checkbox-cover");
        this.todoForm = document.getElementById('add-todo-form');
        this.submitBtn = document.getElementById('add-todo-btn');
        this.todoTableBody = document.getElementById('todo-table-body');
        this.editTodoBtn = document.querySelectorAll(".edit-todo-btn");
    }

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

            if(todo instanceof UrgentTodo){
                tr.innerHTML = `
                    <td class="urgent-icon-td">
                        <i class="far fa-clock clock-icon"></i>
                    </td>
                    <td>${todoIcon}</td>
                    <td data-todo-id="${todo.id}">${todo.id}</td>
                    <td>${todo.title}</td>
                    <td>${todo.todoBody.length > 15 ? shortBody : todo.todoBody}</td>
                    <td>
                        <i class="far fa-times-circle delete-todo-btn"></i>
                    </td>`

            }else{

                tr.innerHTML = `
                    <td></td>
                    <td>${todoIcon}</td>
                    <td data-todo-id="${todo.id}">${todo.id}</td>
                    <td>${todo.title}</td>
                    <td>${todo.todoBody.length > 15 ? shortBody : todo.todoBody}</td>
                    <td>
                        <i class="far fa-times-circle delete-todo-btn"></i>
                    </td>`
            }

        ;

        this.todoTableBody.prepend(tr);
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
        console.log(todoTds)
        let toBeDeletedField = Array.from(todoTds).find(t => t.dataset.todoId == todo.id).parentElement;

        toBeDeletedField.remove();

        this.checkTodoArray();
    }


    clearInput(){
        this.todoForm.querySelectorAll('input[type="text"]').forEach(input => input.value ="");
        console.log("Input fields cleared.")
    }

    checkTodoArray(){
        if(ToDoRepository.allTodos.length === 0){
            todoTableBody.innerHTML = `<tr class="empty-table-identifier"><td colspan="6">There are no todos to show...</td></tr>`;
        }
    }

    checkBoxControl(){
        
        let isUrgentDataset = JSON.parse(this.urgentCheckBoxCover.dataset.urgentCbCheck);
        
        handleCalendar(!isUrgentDataset)
        this.urgentCheckBox.checked = !isUrgentDataset
        this.urgentCheckBoxCover.dataset.urgentCbCheck = !isUrgentDataset;
        return isUrgentDataset;
    }

    showRemainingTime(urgentTodo, tableElem){
        const timeDiv = document.createElement("div");

        let remainingTime = urgentTodo.calcRemainingTime();


        timeDiv.className = "time-div";
        timeDiv.innerHTML = `
            ${remainingTime.days == 0 ? "" : remainingTime.days + " day(s),"}
            ${remainingTime.hours < 10 ? "0"+remainingTime.hours : remainingTime.hours}:
            ${remainingTime.mins < 10 ? "0" + remainingTime.mins : remainingTime.mins}:
            ${remainingTime.secs < 10 ? "0" + remainingTime.secs : remainingTime.secs} left
        `;

        tableElem.appendChild(timeDiv);
        
    }

}
const handleCalendar = function(isUrgent){
        document.querySelector("[data-urgent-reveal]").dataset.urgentReveal = isUrgent;
}