import { Local_Storage } from './local_storage_module.js';

export class Todo {
    constructor(title, todoBody) {
        this.id = ToDoRepository.allTodos.length === 0 ? 0 : ToDoRepository.allTodos[ToDoRepository.allTodos.length - 1].id + 1;
        this.title = title;
        this.todoBody = todoBody;
        this.creationDate = Date.now();
        this.isFinished = false;
    }
}

export class ToDoRepository {
    static allTodos = Local_Storage.getTodosFromLocalStorage() === null ? [] : Local_Storage.getTodosFromLocalStorage();
}
