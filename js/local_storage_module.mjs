
import { Todo, UrgentTodo, ToDoRepository } from "./todo_modul.mjs";


export class Local_Storage {
    static saveToLocalStorage(todoArray) {
        localStorage.setItem('todos', JSON.stringify(todoArray));
    }

    static getTodosFromLocalStorage() {
        const todosFromLS = JSON.parse(localStorage.getItem('todos')) == null ? [] : JSON.parse(localStorage.getItem('todos'));

        Array.from(todosFromLS).forEach(el => {
            if(el.whenIsItDue){
                const newUrgTodo = new UrgentTodo(el.title, el.todoBody, el.whenIsItDue);
                newUrgTodo.isFinished = el.isFinished;
                ToDoRepository.allTodos.push(newUrgTodo);
            }else{
                const newTodo = new Todo(el.title, el.todoBody);
                newTodo.isFinished = el.isFinished;
                ToDoRepository.allTodos.push(newTodo);
            }
        })

    }
}
