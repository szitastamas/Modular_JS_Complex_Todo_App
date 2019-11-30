import { Todo, ToDoRepository, UrgentTodo } from "./todo_modul.js"
import { ui } from "./main.js"
import { Local_Storage } from "./local_storage_module.js"

export class EditorUI {

    static createSelf(todo) {

        if(document.getElementById("edit-div-window")){
            document.getElementById("edit-div-window").remove();
        }

        const editDiv = document.createElement("div");
        editDiv.id = "edit-div-window"
        editDiv.className = "edit-div-container";

        editDiv.innerHTML = 
        `
            <h4 class="todo-edit-card-title">${todo.title}</h4>
            <hr />
            <h5>Todo description:</h5>
            <textarea id="edit-todo-textarea">${todo.todoBody}</textarea>
            <hr />
            <h5>Todo created at:</h5>
            <p>${todo.creationDate.toUTCString()}</p>
            <hr />
            <ul class="edit-todo-details">
                <li class="todo-detail">
                    Status: ${todo.isFinished ? "Finished" : "Pending"}
                </li>
                <li class="todo-detail">
                    Priority: ${todo instanceof UrgentTodo ? "Urgent" : "Normal"}
                </li>
            </ul>
            <div class="edit-todo-btn-container">
                <button id="save-changes-btn">Save Changes</button>
                <button id="close-edit-todo-btn">Back</button>
            </div>
        `;

        editDiv.style.top = pageYOffset + "px";
            document.querySelector(".todo-container").appendChild(editDiv);
            document.getElementById("close-edit-todo-btn").addEventListener("click", EditorUI.removeSelf)
            document.getElementById("save-changes-btn").addEventListener("click", () =>{
                this.saveChanges(todo)
            })

    }

    static removeSelf(){

        ui.changeState("add")
        document.getElementById("edit-div-window").remove();
    }

    static saveChanges(todo){

        let shortBody = '';

        todo.todoBody = document.getElementById("edit-todo-textarea").value;
        if (todo.todoBody.length > 25) {
            shortBody = `${todo.todoBody.substring(0, 24)}...`;
        }
        Local_Storage.saveToLocalStorage(ToDoRepository.allTodos);
        const toBeUpdatedRow = ui.todoTableRows.find(tr => tr.id.split("-")[1] == todo.id).querySelector(".tr-todo-description");
        toBeUpdatedRow.innerHTML = todo.todoBody.length > 25 ? shortBody : todo.todoBody;
        ui.displayMessage("Todo updated", "success");
        EditorUI.removeSelf();
    }
}