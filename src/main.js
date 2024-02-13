// Implemeting todo app in type-script
var taskList = getHTMLElementById("task-list");
var searchTextInput = getHTMLElementById("card-search-input");
var searchBoxDeleteBtn = getHTMLElementById("search-delete-button");
var newTaskInput = getHTMLElementById("new-task-text");
var taskAddBtn = getHTMLElementById("new-task-add-button");
function isNull(val) {
    return val === null;
}
function isValidStatus(status) {
    return !isNull(status) && (status === "done" || status === "undone");
}
function getHTMLElementById(id) {
    var htmlElement = document.getElementById(id);
    if (!isNull(htmlElement)) {
        return htmlElement;
    }
    throw new Error("No matching element was found in the document!");
}
function getNewTaskElement(task) {
    var newTaskElement = document.createElement("li");
    var labelElement = document.createElement("label");
    var statusBtnElement = document.createElement("button");
    var trashElement = document.createElement("i");
    newTaskElement.setAttribute("status", task.status);
    newTaskElement.classList.add("task");
    statusBtnElement.classList.add("status");
    trashElement.classList.add("gg-trash");
    labelElement.textContent = task.label;
    statusBtnElement.textContent = "Done";
    newTaskElement.appendChild(trashElement);
    newTaskElement.appendChild(labelElement);
    newTaskElement.appendChild(statusBtnElement);
    return newTaskElement;
}
function addNewTask(label, status) {
    if (status === void 0) { status = "undone"; }
    if (label.trim()) {
        var task = { label: label, status: status };
        var newTaskElement = getNewTaskElement(task);
        taskList.appendChild(newTaskElement);
        storeTaskList();
        displaySearchedList();
    }
    else {
        console.log("Cannot add an empty task");
    }
}
function changeTaskStatus(taskElement) {
    if (!isNull(taskElement)) {
        var statusAttribure = taskElement.getAttribute("status");
        if (isValidStatus(statusAttribure)) {
            var taskStatus = statusAttribure;
            taskElement.setAttribute("status", taskStatus === "done" ? "undone" : "done");
        }
        else {
            throw new Error("Got incompatible task status. should be of type Task['status']");
        }
    }
    else {
        throw new Error("The status button either has no parent, or its parent isn't a DOM Element");
    }
    storeTaskList();
}
function deleteTask(taskElement) {
    taskElement.remove();
    storeTaskList();
}
function flushSearchBox() {
    searchTextInput.value = "";
    for (var i = 0; i < taskList.children.length; i++) {
        var taskElement = taskList.children[i];
        if (taskElement instanceof HTMLElement)
            taskElement.style.display = "flex";
    }
}
function getTaskLabel(taskElement) {
    var _a;
    var taskLabel = (_a = taskElement.querySelector("label")) === null || _a === void 0 ? void 0 : _a.textContent;
    if (taskLabel)
        return taskLabel;
    throw new Error("Got no task or textContent");
}
function displaySearchedList() {
    var searchPattern = searchTextInput.value.toLowerCase();
    for (var i = 0; i < taskList.children.length; i++) {
        var taskElement = taskList.children[i];
        if (taskElement instanceof HTMLElement) {
            var taskLabel = getTaskLabel(taskElement);
            taskElement.style.display = taskLabel
                .toLowerCase()
                .includes(searchPattern)
                ? "flex"
                : "none";
        }
    }
}
function taskList2JsonString() {
    var taskList2Save = [];
    for (var i = 0; i < taskList.children.length; i++) {
        var taskElement = taskList.children[i];
        if (taskElement instanceof HTMLElement) {
            var taskLabel = getTaskLabel(taskElement);
            var statusAttribure = taskElement.getAttribute("status");
            if (isValidStatus(statusAttribure)) {
                var taskStatus = statusAttribure;
                taskList2Save.push([taskLabel, taskStatus]);
            }
            else {
                throw new Error("Got incompatible task status. should be of type Task['status']");
            }
        }
    }
    return JSON.stringify(taskList2Save);
}
function storeTaskList() {
    localStorage.setItem("storedTaskList", taskList2JsonString());
}
function retrieveTaskList() {
    var storedTaskList = localStorage.getItem("storedTaskList");
    if (!isNull(storedTaskList)) {
        var parsedTaskList = JSON.parse(storedTaskList);
        for (var idx in parsedTaskList) {
            var _a = parsedTaskList[idx], label = _a[0], status_1 = _a[1];
            addNewTask(label, status_1);
        }
    }
}
function handleBtnClick(event) {
    var target = event.target;
    var ClickedBtn = target;
    if (ClickedBtn) {
        var parentElement = ClickedBtn.parentElement;
        if (!isNull(parentElement)) {
            if (ClickedBtn.matches("li.task > button.status")) {
                changeTaskStatus(parentElement);
            }
            else if (ClickedBtn.matches("li.task > .gg-trash")) {
                deleteTask(parentElement);
            }
        }
    }
}
(function myApp() {
    taskList.innerHTML = "";
    retrieveTaskList();
    taskAddBtn.addEventListener("click", function () {
        addNewTask(newTaskInput.value);
        newTaskInput.value = "";
    });
    newTaskInput.addEventListener("keypress", function (event) {
        if (event.code === "Enter") {
            addNewTask(newTaskInput.value);
            newTaskInput.value = "";
        }
    });
    searchBoxDeleteBtn.addEventListener("click", flushSearchBox);
    searchTextInput.addEventListener("input", displaySearchedList);
    document.body.addEventListener("click", handleBtnClick);
})();
