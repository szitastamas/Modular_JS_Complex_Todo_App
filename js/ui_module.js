import { Todo, UrgentTodo, ToDoRepository } from './todo_modul.js';
import { Local_Storage } from './local_storage_module.js';

export class UI {
    constructor() {
        this.urgentCheckBox = document.getElementById('urgent-todo-checkbox');
        this.urgentCheckBoxCover = document.querySelector('.checkbox-cover');
        this.todoForm = document.getElementById('add-todo-form');
        this.submitBtn = document.getElementById('add-todo-btn');
        this.todoTable = document.getElementById('todo-table');
        this.todoTableBody = document.getElementById('todo-table-body');
        this.editTodoBtn = document.querySelectorAll('.edit-todo-btn');
        this.todoTableRows = [];
        this.state = 'add';
    }

    paintOutTodo(todo) {
        let tr = document.createElement('tr');
        tr.className = 'todo-item';
        if (todo instanceof UrgentTodo) {
            tr.classList.add('urgent');
        }
        tr.id = `todo-${todo.id}`;
        let shortBody = '';
        let trBody = '';
        if (todo.todoBody.length > 25) {
            shortBody = `${todo.todoBody.substring(0, 24)}...`;
        }

        const todoStatusIcon = todo.isFinished
            ? '<i class="far fa-check-circle finished-icon status-icon"></i>'
            : '<i class="fas fa-clipboard-list unfinished-icon status-icon"></i>';

        if (todo instanceof UrgentTodo) {
            trBody += `
            <td class="urgent-icon-td">
                <i class="far fa-clock clock-icon">
                    <div class="time-div">${this.findRemainingTime(todo)}</div>
                </i>
            </td>
            `;
        } else {
            trBody += '<td></td>';
        }

        trBody += `
            <td>${todoStatusIcon}</td>
            <td>${todo.title}</td>
            <td>${todo.todoBody.length > 25 ? shortBody : todo.todoBody}</td>
            <td>
                <i class="far fa-eye edit-todo-btn"></i>
            </td>
            <td>
                <i class="far fa-times-circle delete-todo-btn"></i>
            </td>`;

        tr.innerHTML = trBody;
        this.todoTableRows.push(tr);
        this.todoTableBody.prepend(tr);
        if (document.querySelector('.empty-table-identifier')) {
            document.querySelector('.empty-table-identifier').remove();
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
        todo.isFinished = !todo.isFinished;
        let toBeUpdatedTodoField = this.todoTableRows.find(row => row.id.split('-')[1] == todo.id).querySelector('.status-icon');

        if (todo.isFinished) {
            toBeUpdatedTodoField.className = 'far fa-check-circle finished-icon status-icon';
        } else {
            toBeUpdatedTodoField.className = 'fas fa-clipboard-list unfinished-icon status-icon';
        }

        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
    }

    deleteTodo(todo) {
        this.todoTableRows.find(row => row.id.split('-')[1] == todo.id).remove();

        this.checkTodoArrayForEmpty();
    }

    clearInput() {
        this.todoForm.querySelectorAll('input[type="text"]').forEach(input => (input.value = ''));
        this.urgentCheckBox.checked = false;
        this.urgentCheckBoxCover.dataset.urgentCbCheck = false;
        handleCalendar(false);
        console.log('Input fields cleared.');
    }

    checkTodoArrayForEmpty() {
        if (ToDoRepository.allTodos.length === 0) {
            this.todoTableBody.innerHTML = `<tr class="empty-table-identifier"><td colspan="6">There are no todos to show...</td></tr>`;
        }
    }

    checkBoxControl() {
        let isUrgentDataset = JSON.parse(this.urgentCheckBoxCover.dataset.urgentCbCheck);

        handleCalendar(!isUrgentDataset);
        this.urgentCheckBox.checked = !isUrgentDataset;
        this.urgentCheckBoxCover.dataset.urgentCbCheck = !isUrgentDataset;
        return isUrgentDataset;
    }

    findRemainingTime(urgentTodo) {
        let remainingTime = urgentTodo.calcRemainingTime();
        let isTimeUp = Object.values(remainingTime).reduce((total, val) => (total += val), 0) === 0 ? true : false;

        let output = '';
        if (isTimeUp) {
            output = 'Time is up.';
        } else {
            output = `
                        ${remainingTime.days == 0 ? '' : remainingTime.days + ' day(s),'}
                        ${remainingTime.hours < 10 ? '0' + remainingTime.hours : remainingTime.hours}:
                        ${remainingTime.mins < 10 ? '0' + remainingTime.mins : remainingTime.mins}:
                        ${remainingTime.secs < 10 ? '0' + remainingTime.secs : remainingTime.secs} left
                    `;
        }

        return output;
    }

    updateTimer() {
        function updateTime(todo) {
            todo.creationDate = new Date();
        }

        setInterval(() => {
            let timeDivs = document.querySelectorAll('.time-div');

            if (timeDivs.length != 0) {
                timeDivs.forEach(div => {
                    let trParent = div.parentElement.parentElement.parentElement;
                    let todoID = trParent.id.split('-')[1];
                    let currentTodo = null;

                    for (let todo of ToDoRepository.allTodos) {
                        if (todoID == todo.id) {
                            currentTodo = todo;
                        }
                    }

                    let isTimeUp = Object.values(currentTodo.calcRemainingTime()).reduce((total, val) => (total += val), 0) === 0 ? true : false;

                    if (isTimeUp === false) {
                        updateTime(currentTodo);
                        div.innerHTML = this.findRemainingTime(currentTodo);
                    }
                });
            }
        }, 1000);
    }

    changeState(state, todo) {
        if (state === 'edit') {
            console.log('Editing state triggered.');
            this.todoTable.classList.add('editing-state');
        } else {
            this.todoTable.classList.remove('editing-state');
        }
    }
}

class Edit {
    constructor(todo) {
        this.todo = todo;
    }

    createSelf() {}
}

const handleCalendar = function(isUrgent) {
    document.querySelector('[data-urgent-reveal]').dataset.urgentReveal = isUrgent;
};
