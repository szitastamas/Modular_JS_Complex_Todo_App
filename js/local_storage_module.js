
import { Todo, UrgentTodo, ToDoRepository } from "./todo_modul.js";


export class Local_Storage {
    static saveToLocalStorage(todoArray) {
        localStorage.setItem('todos', JSON.stringify(todoArray));
    }

    static getTodosFromLocalStorage() {
        const todosFromLS = JSON.parse(localStorage.getItem('todos'));

        const todos = [];

        Array.from(todosFromLS).forEach(el => {
            if(el.whenIsItDue){
                ToDoRepository.allTodos.push(new UrgentTodo(el.title, el.todoBody, el.whenIsItDue));
            }else{
                ToDoRepository.allTodos.push(new Todo(el.title, el.todoBody));
            }
        })

        return todos;
    }
}
