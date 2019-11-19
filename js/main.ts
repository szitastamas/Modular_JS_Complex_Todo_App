interface TodoModel{
    title: string,
    todoBody: string,
    creationDate: number,
    isFinished: boolean,
    finishTodo: () => void
}

class Todo implements TodoModel{
    title: string;
    todoBody: string;
    creationDate: number;
    isFinished: boolean;
    constructor(title: string, todoBody: string){
        this.title = title;
        this.todoBody = todoBody;
        this.creationDate = Date.now();
        this.isFinished = false;
    }
    
    finishTodo(){
        this.isFinished = true;
    }
}

class UI{
    createTodo(todo: Todo):void{
        
        let tr:HTMLTableRowElement = document.createElement("tr");
        tr.classList.add("todo-item");
        tr.id = `todo-${todoTableBody.querySelectorAll(".todo-item").length+1}`;

        const todoIcon:string = todo.isFinished ? '<i class="far fa-check-circle finished-icon"></i>' : '<i class="fas fa-clipboard-list unfinished-icon"></i>';

        tr.innerHTML = 
        `
            <td>${todoIcon}</td>
            <td>${todo.title}</td>
            <td>${todo.todoBody}</td>
            <td><i class="far fa-times-circle delete-icon"></i></td>
        `;
        
        todoTableBody.prepend(tr);
    }
}

const todoForm:HTMLElement = document.getElementById("add-todo-form");

const submitBtn:HTMLElement = document.getElementById("add-todo-btn");

const todoTableBody:HTMLElement = document.getElementById("todo-table-body");


// Submitting a ToDo
todoForm.addEventListener("submit", e => {
    e.preventDefault();

    const ui = new UI;

    const todoTitle:string = (<HTMLInputElement>document.getElementById("todo-title")).value

    const todoBody:string = (<HTMLInputElement> document.getElementById("todo-description")).value;

    ui.createTodo(new Todo(todoTitle, todoBody));

})