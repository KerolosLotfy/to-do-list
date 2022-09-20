//  Golable Varablies
const newTask = document.querySelector("#newTask");
const form = document.querySelector(".header form");
const enterBtn = document.querySelector("#enter");
const menuBtn = document.querySelector(".menu");
const clearComplatedTasks = document.querySelector('#clear');
const control_colors = document.querySelectorAll('.control_menu form ');
let tasks_list = document.querySelectorAll(".tasks li");
let complatedTasks = document.querySelectorAll('.complated > ul li');
let arrOfTasks = [];
let arrOfComplateTasks = [];
let arrOfColors = [];
let root = document.documentElement;

//  reset colors
let bg = getComputedStyle(root).getPropertyValue('--bg-color').trim();
let text = getComputedStyle(root).getPropertyValue('--text-color').trim();
let active = getComputedStyle(root).getPropertyValue('--active-color').trim();
control_colors[0].children[1].value = bg;
control_colors[1].children[1].value = text;
control_colors[2].children[1].value = active;

// add class name (active) to this page to make tranlate Effect  
window.onload = () => {
    window.location.pathname === '/to-do-list/To-Do-List.html'
        ? document.querySelector(".to-do").classList.add("active")
        : '';
};

// Get Data Form Local Storage
if (localStorage.tasks !== "[]" && localStorage.tasks !== undefined) {
    getDataformLocalStorage(localStorage.getItem('tasks'));
}
if (localStorage.complated_tasks !== "[]" && localStorage.complated_tasks !== undefined) {
    getDataformLocalStorage(localStorage.getItem('complated_tasks'));
}
if (localStorage.colors !== "{}" && localStorage.colors !== undefined) {
    getDataformLocalStorage(localStorage.getItem('colors'));
}

// click enter button to add New Task
form.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTask(newTask.value);
    newTask.value = '';
    newTask.blur();
});

// click arrow to add New Task
enterBtn.addEventListener('click', () => {
    addNewTask(newTask.value);
    newTask.value = '';
    newTask.blur();
})

// Add New Task to page
function addNewTask(value, state = false) {
    let task = {
        task_title: value,
        complate: state
    }

    if (task.task_title !== '') {
        // create Elements 
        let li = createElementAndAppendToParent('li', '', '', document.querySelector('.tasks'));
        li.dataset.complate = task.complate;
        let p = createElementAndAppendToParent('p', value, '', li);
        let control = createElementAndAppendToParent('div', '', 'control', li);
        let editIcon = createElementAndAppendToParent('i', '', 'fa-solid fa-pen-to-square edit', control);
        let DeleteIcon = createElementAndAppendToParent('i', '', 'fa-solid fa-trash delete', control);
        let checkIcon = createElementAndAppendToParent('i', '', 'fa-solid fa-circle-check check', control);
        checkIcon.setAttribute("title", 'uncomplated')

        // add delete Task function for when click on delete Icon
        DeleteIcon.onclick = deleteTask(DeleteIcon);

        // add edit Task function for when click on edit Icon
        editIcon.onclick = editTask(editIcon);

        // add check Task function for when click on check Icon
        checkIcon.onclick = checkTask(checkIcon);

        // add new task (object) to array
        arrOfTasks.push(task);

        // update tasks list
        tasks_list = document.querySelectorAll(".tasks li");

        // add Data In Local Storage  function(array, itemName as 'string')
        addDataInLocalStorage(arrOfTasks, 'tasks');
    }
}

// Add Data In Local Storage 
function addDataInLocalStorage(arrOfTasks, itemName = 'item') {
    localStorage.setItem(itemName, JSON.stringify(arrOfTasks));
}

// Get Data Form Local Storage when loading the page 
function getDataformLocalStorage(arrOfTasks) {
    let arr = JSON.parse(arrOfTasks);
    arr.forEach((task, i, arr) => {
        if (task.complate) {
            arrOfComplateTasks = arr;
            addComplatedTask(task.task_title, task.id);
        } else if (task.bgColor) {
            control_colors[0].children[1].value = task.bgColor;
            control_colors[1].children[1].value = task.textColor;
            control_colors[2].children[1].value = task.activeColor;
            applyColorsInPage(task);
        } else {
            addNewTask(task.task_title);
        }
    })
}

// Create Element And Append This Element To Parent Element 
function createElementAndAppendToParent(element = '', innerText = '', className = '', parent) {
    let el = document.createElement(element);
    el.innerText = innerText;
    el.className = className;
    parent.appendChild(el)
    return el;
}

// Delete Task function
function deleteTask(del) {
    del.addEventListener("click", () => {
        del.parentElement.parentElement.remove();
        // Update Data In Local Storage
        updateData();
    });
};

// Edit Task function
function editTask(edit) {
    edit.addEventListener('click', () => {
        if (!edit.parentElement.parentElement.children[0].hasAttribute("contenteditable")) {
            edit.classList.add("active");
            edit.parentElement.parentElement.children[0].setAttribute("contenteditable", "true")
            edit.parentElement.parentElement.children[0].focus();
        } else {
            edit.parentElement.parentElement.children[0].removeAttribute("contenteditable");
            edit.classList.remove("active");
            // Update Data In Local Storage
            updateData();
        };

    })

}

// when click Check icon make a Task complated  
function checkTask(c) {
    c.addEventListener("click", () => {
        // add date complated task
        let date = new Date().toLocaleString('en-Au', { dateStyle: 'short', timeStyle: 'short', 'hourCycle': 'h12' });
        // add Complated Task to  Complated tasks list
        addComplatedTask(c.parentElement.parentElement.children[0].innerText, date);
        // Update Data In Local Storage
        updateData(c.parentElement.parentElement.children[0].innerText, date);
        // remove complated task from tasks list
        c.parentElement.parentElement.remove();
    });
}

// add Complated Task to page 
function addComplatedTask(task_title, date = '') {
    // create Element And Append To Parent
    let li = createElementAndAppendToParent('li', '', '', document.querySelector('.complated > ul'));
    let p = createElementAndAppendToParent('p', task_title, '', li);
    let control = createElementAndAppendToParent('div', '', 'control', li);
    let checkIcon = createElementAndAppendToParent('i', '', 'fa-solid fa-circle-check check', control);
    checkIcon.setAttribute('title', 'completed');
    let Date = createElementAndAppendToParent('span', date, 'date', control);
    Date.setAttribute('title', 'DD/MM/YY, H:M');
}

// Update Data In Local Storage
function updateData(complatedTask = '', date = '') {
    tasks_list = document.querySelectorAll(".tasks li");
    complatedTasks = document.querySelectorAll('.complated > ul li');
    arrOfTasks = [];
    tasks_list.forEach((li, i) => {
        let task = {
            task_title: li.innerText,
            complate: false,
        }
        if (task.task_title === complatedTask) {
            task.complate = true;
            task.id = date;
            arrOfComplateTasks.push(task);
        } else {
            arrOfTasks.push(task);
        }
    });
    addDataInLocalStorage(arrOfTasks, 'tasks');
    addDataInLocalStorage(arrOfComplateTasks, 'complated_tasks');
}

// click broom icon to Detele All complated_tasks 
clearComplatedTasks.addEventListener('click', () => {
    complatedTasks = document.querySelectorAll('.complated > ul li');
    for (let i = 0; i < complatedTasks.length; i++) {
        complatedTasks[i].remove();
    };
    localStorage.removeItem('complated_tasks');
});

//  click menu icon to 
menuBtn.addEventListener(("click"), () => {
    menuBtn.classList.toggle("active");
    document.querySelector('menu').classList.toggle("active");
    control_colors.forEach((form) => {
        form.children[1].addEventListener('blur', () => {
            document.querySelector('menu').classList.remove("active");
            let colors = {
                bgColor: control_colors[0].children[1].value,
                textColor: control_colors[1].children[1].value,
                activeColor: control_colors[2].children[1].value,
            }
            arrOfColors = [colors];
            addDataInLocalStorage(arrOfColors, 'colors');

            // apply Colors In Page
            applyColorsInPage(colors);

        })

    })
});

// apply Colors In Page
function applyColorsInPage(colors) {
    root.style.setProperty('--bg-color', colors.bgColor);
    root.style.setProperty('--text-color', colors.textColor);
    root.style.setProperty('--active-color', colors.activeColor);
}

//  reset colors Data from page and  local Storage
document.querySelector('.reset').addEventListener('click', () => {
    localStorage.removeItem('colors');
    location.reload();
})
