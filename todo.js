document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dateInput = document.getElementById('dateInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    loadTasks();

    addButton.addEventListener('click', function() {
        if (taskInput.value.trim() !== '') {
            const task = {
                text: taskInput.value,
                priority: priorityInput.value,
                date: dateInput.value,
                completed: false
            };
            addTask(task);
            saveTask(task);
            taskInput.value = '';
            dateInput.value = '';
        }
    });

    function addTask(task) {
        const newTask = document.createElement('li');

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.innerHTML = `
            <input type="text" value="${task.text}" readonly>
            <input type="date" value="${task.date}" readonly>
        `;

        newTask.className = `priority-${task.priority}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        // Add line-through effect when checkbox is checked
        checkbox.addEventListener('change', function() {
            newTask.classList.toggle('completed');
            task.completed = checkbox.checked;
            updateTask(task);
        });

        const doneLabel = document.createElement('label');
        doneLabel.className = 'done';
        doneLabel.textContent = 'DONE';
        doneLabel.appendChild(checkbox);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'deleteButton';
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(newTask);
            removeTask(task);
        });

        const editButton = document.createElement('button');
        editButton.className = 'editButton';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            const inputs = newTask.querySelectorAll('input[type="text"], input[type="date"]');
            inputs.forEach(input => input.readOnly = !input.readOnly);
            editButton.textContent = inputs[0].readOnly ? 'Edit' : 'Save';
            if (inputs[0].readOnly) {
                task.text = inputs[0].value;
                task.date = inputs[1].value;
                updateTask(task);
            }
        });

        newTask.appendChild(taskContent);
        newTask.appendChild(doneLabel);
        newTask.appendChild(editButton);
        newTask.appendChild(deleteButton);

        taskList.appendChild(newTask);
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => addTask(task));
    }

    function updateTask(updatedTask) {
        const tasks = getTasks();
        const index = tasks.findIndex(task => task.text === updatedTask.text);
        tasks[index] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(taskToRemove) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.text !== taskToRemove.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
