# Modular_JS_Complex_Todo_App
A todo app with JavaScript modules with somewhat more functionality than just simply adding-removing a todo.

### Extended funcionality through OOP in JavaScript
Adding and removing a Todo is obvious. In my application you can add two different types of todos:
- Standard todo
- Urgent todo

The "urgent" version is an inherited class of the standard todo with more features e.g. adding a clock icon to the table row.
On hover a small field is being revealed with a countdown in it which is meant to show you how much time you have left to finish that task of yours.

Clicking on the Status icon in the table triggers an event which makes your todo labeled as finished or pending. 
On Edit state you can edit the title and the description of your Todo.

### Structuring of the project
My goal was to separate each building block of the app. The class Todo / Urgent Todo have their own functionality which has nothing to do with the UI.

As far as the DOM Manipulation goes the UI class is responsible for modifying the state of the app, adding and removing elements to the table,
revealing the calendar if the urgent checkbox is selected. 

Saving data to the local storage as well as editing a todo has their own classes as well.

In the main file only the events will be triggered and the modules will take care of the rest.

### Styling
The app's appearance is based on Skeleton CSS and the custom styling is created by using SASS. The app has a decent appearance on mobile devices as well.
