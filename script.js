document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => renderTask(task));

    addTaskButton.addEventListener('click', addTask);

    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            addTask();
        }
    });

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
           id: Date.now(),
           text: taskText,
           completed: false,
        };

        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = "";
    };

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    function renderTask(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.classList.add('new-item-animation');
        if(task.completed) li.classList.add('completed');
        li.innerHTML = `
        <input type='checkbox' ${task.completed ? 'checked' : ''} />
        <span>${task.text}</span>
        <button>Delete</button>`

        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            li.classList.toggle('completed', task.completed);
            saveTasks();
        });

        // li.addEventListener('click', (e) => {
        //     if (e.target.tagName === 'BUTTON') return; // Ignore clicks on the delete button
            
        //     task.completed = !task.completed;
        //     li.classList.toggle('completed');
        //     saveTasks();
        // })

        li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            tasks = tasks.filter(t => t.id !== task.id);
            li.classList.add("deleting");
            li.addEventListener('animationend', () => {
                li.remove();
            });
            saveTasks();
        });

        todoList.appendChild(li);
    }
});