interface TodoModel {
    id: number;
    title: string;
    todoBody: string;
    creationDate: number;
    isFinished: boolean;
}

class Local_Storage {
    static saveToLocalStorage(todoArray: Todo[]): void {
        localStorage.setItem('todos', JSON.stringify(todoArray));
    }

    static getTodosFromLocalStorage(): Todo[] {
        const todos = JSON.parse(localStorage.getItem('todos'));

        return todos;
    }
}

class ToDoRepository {
    public static allTodos: Todo[] = Local_Storage.getTodosFromLocalStorage() === null ? [] : Local_Storage.getTodosFromLocalStorage();
}

class Todo implements TodoModel {
    id: number;
    title: string;
    todoBody: string;
    creationDate: number;
    isFinished: boolean;
    constructor(title: string, todoBody: string) {
        this.id = ToDoRepository.allTodos.length === 0 ? 0 : ToDoRepository.allTodos[ToDoRepository.allTodos.length - 1].id + 1;
        this.title = title;
        this.todoBody = todoBody;
        this.creationDate = Date.now();
        this.isFinished = false;
    }
}

class UI {
    paintOutTodo(todo: Todo): void {
        let tr: HTMLTableRowElement = document.createElement('tr');
        tr.classList.add('todo-item');
        tr.id = `todo-${todoTableBody.querySelectorAll('.todo-item').length + 1}`;

        const todoIcon: string = todo.isFinished
            ? '<i class="far fa-check-circle finished-icon status-icon"></i>'
            : '<i class="fas fa-clipboard-list unfinished-icon status-icon"></i>';

        tr.innerHTML = `
            <td>${todoIcon}</td>
            <td data-todo-id="${todo.id}">${todo.id}</td>
            <td>${todo.title}</td>
            <td>${todo.todoBody}</td>
            <td><i class="far fa-times-circle delete-icon"></i></td>
        `;

        todoTableBody.prepend(tr);
    }

    displayMessage(message: string, className: string): void {
        const msgDiv: HTMLElement = document.querySelector('.alert');
        msgDiv.classList.add(className);
        msgDiv.textContent = message;

        setTimeout(() => {
            msgDiv.classList.remove(className);
        }, 1500);
    }

    updateTodoStatus(todo: Todo): void {
        let todoTds: NodeList = document.querySelectorAll('[data-todo-id]');

        let toBeUpdatedTodoField = Array.from(todoTds).find(t => t.dataset.todoId == todo.id).previousElementSibling.firstChild;

        if (todo.isFinished) {
            toBeUpdatedTodoField.classList = 'far fa-check-circle finished-icon status-icon';
        } else {
            toBeUpdatedTodoField.classList = 'fas fa-clipboard-list unfinished-icon status-icon';
        }

        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
    }

    deleteTodo(todo: Todo): void {
        let todoTds: NodeList = document.querySelectorAll('[data-todo-id]');

        let toBeDeletedField = Array.from(todoTds).find(t => t.dataset.todoId == todo.id).parentElement;

        toBeDeletedField.remove();
    }
}

const todoForm: HTMLElement = document.getElementById('add-todo-form');

const submitBtn: HTMLElement = document.getElementById('add-todo-btn');

const todoTableBody: HTMLElement = document.getElementById('todo-table-body');

// Submitting a ToDo
todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const ui = new UI();

    const todoTitle: string = (<HTMLInputElement>document.getElementById('todo-title')).value;

    const todoBody: string = (<HTMLInputElement>document.getElementById('todo-description')).value;

    if (validateTodoFields(todoTitle, todoBody)) {
        const oneTodo = new Todo(todoTitle, todoBody);
        ToDoRepository.allTodos.push(oneTodo);
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);

        console.log(ToDoRepository.allTodos);
        ui.displayMessage('Todo successfully added', 'success');
        ui.paintOutTodo(oneTodo);
        (<NodeList>document.querySelectorAll('.status-icon')).forEach(i => i.addEventListener('click', statusFunction));
        (<NodeList>document.querySelectorAll('.delete-icon')).forEach(i => i.addEventListener('click', removeTodo));
    } else {
        ui.displayMessage('Please fill in all fields!', 'error');
    }
});

function validateTodoFields(field1: string, field2: string): boolean {
    if (field1 === '' || field2 === '') {
        return false;
    } else {
        return true;
    }
}

function statusFunction(e: any): void {
    const ui = new UI();
    let clickedTodoId = e.target.parentElement.nextElementSibling.textContent;
    const clickedTodo: Todo = ToDoRepository.allTodos.find(todo => todo.id == clickedTodoId);
    clickedTodo.isFinished = !clickedTodo.isFinished;
    ui.updateTodoStatus(clickedTodo);
    ui.displayMessage(`Todo's status changed to: ${clickedTodo.isFinished ? 'Finished' : 'Unfinished'}`, 'success');
    console.log(clickedTodo.isFinished ? 'Todo done!' : 'Todo is still to be finished...');
}

function removeTodo(e: any): void {
    const ui = new UI();
    let clickedTodoId = e.target.parentElement.parentElement.children[1].dataset.todoId;
    const clickedTodo: Todo = ToDoRepository.allTodos.find(todo => todo.id == clickedTodoId);
    ToDoRepository.allTodos.splice(ToDoRepository.allTodos.indexOf(clickedTodo), 1);
    ui.deleteTodo(clickedTodo);
    ui.displayMessage('Todo deleted.', 'success');
    Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
}

document.addEventListener('DOMContentLoaded', (): void => {
    let ui = new UI();
    if (ToDoRepository.allTodos.length !== 0) {
        ToDoRepository.allTodos.forEach(todo => ui.paintOutTodo(todo));
        (<NodeList>document.querySelectorAll('.status-icon')).forEach(i => i.addEventListener('click', statusFunction));
        (<NodeList>document.querySelectorAll('.delete-icon')).forEach(i => i.addEventListener('click', removeTodo));
    }
});
