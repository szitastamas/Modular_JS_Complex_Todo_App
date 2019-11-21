class Local_Storage {
    static saveToLocalStorage(todoArray) {
        localStorage.setItem('todos', JSON.stringify(todoArray));
    }

    static getTodosFromLocalStorage() {
        const todos = JSON.parse(localStorage.getItem('todos'));

        return todos;
    }
}

export { Local_Storage };
