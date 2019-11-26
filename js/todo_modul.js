//import { Local_Storage } from './local_storage_module.js';



export class ToDoRepository {

    static allTodos = [];
}

export class Todo {
    constructor(title, todoBody) {
        this.id = ToDoRepository.allTodos.length === 0 ? 0 : ToDoRepository.allTodos[ToDoRepository.allTodos.length - 1].id + 1;
        this.title = title;
        this.todoBody = todoBody;
        this.creationDate = new Date();
        this.isFinished = false;
    }
}


export class UrgentTodo extends Todo{
    constructor(title, todoBody, whenIsItDue){
        super(title, todoBody)

        this.whenIsItDue = new Date(whenIsItDue);
    }

    calcRemainingTime(){
        let totalSecs = (this.whenIsItDue - this.creationDate) / 1000;

        if(totalSecs < 0){
            totalSecs = 0
        }
        let totalMins = totalSecs / 60;
        let totalHours = totalMins / 60;
        let totalDays = totalHours / 24;

        let remHours = (totalDays % 1)*24;
        let remMins = (totalHours % 1) * 60;
        let remSecs = (totalMins % 1) * 60;

        const remTimeObject = {
            "days" : Math.floor(totalDays),
            "hours" : Math.floor(remHours),
            "mins" : Math.floor(remMins),
            "secs" : Math.floor(remSecs)
        }


        return remTimeObject
    }
}
