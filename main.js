"use strict";

const taskList = document.getElementById("task-list");
const searchTextInput = document.getElementById("card-search-input");
const searchBoxDeleteBtn = document.getElementById("search-delete-button");
const newTaskInput = document.getElementById("new-task-text");
const taskAddBtn = document.getElementById("new-task-add-button");

function getNewTaskElement(label, status) {
  const newTaskElement = document.createElement("li");
  const labelElement = document.createElement("label");
  const statusBtnElement = document.createElement("button");
  const trashElement = document.createElement("i");

  newTaskElement.setAttribute("status", status);
  newTaskElement.classList.add("task");
  statusBtnElement.classList.add("status");
  trashElement.classList.add("gg-trash");

  labelElement.textContent = label;
  statusBtnElement.textContent = "Done";

  newTaskElement.appendChild(trashElement);
  newTaskElement.appendChild(labelElement);
  newTaskElement.appendChild(statusBtnElement);

  return newTaskElement;
}

function addNewTask(label, status = "undone") {
  if (label.trim()) {
    const newTaskElement = getNewTaskElement(label, status);
    taskList.appendChild(newTaskElement);
  } else {
    console.log("Cannot add an empty task");
  }
  saveTaskList();
  displaySearchedList();
}

function changeTaskStatus(statusBtnElement) {
  const newTaskElement = statusBtnElement.parentNode;
  const status = newTaskElement.getAttribute("status");

  if (status === "done") {
    newTaskElement.setAttribute("status", "undone");
  } else {
    newTaskElement.setAttribute("status", "done");
  }
  saveTaskList();
}

function deleteTask(taskElement) {
  taskElement.remove();
  saveTaskList();
}

function flushSearchBox() {
  searchTextInput.value = "";

  for (let i = 0; i < taskList.children.length; i++) {
    const taskElement = taskList.children[i];
    taskElement.style.display = "flex";
  }
}

function displaySearchedList() {
  const searchPattern = searchTextInput.value.toLowerCase();

  for (let i = 0; i < taskList.children.length; i++) {
    const taskElement = taskList.children[i];
    const taskLabel = taskElement.querySelector("label").textContent;
    taskElement.style.display = taskLabel.toLowerCase().includes(searchPattern)
      ? "flex"
      : "none";
  }
}

function taskList2Json() {
  const obj = [];

  for (let i = 0; i < taskList.children.length; i++) {
    const taskElement = taskList.children[i];
    const label = taskElement.children[1];
    obj.push([label.textContent, taskElement.getAttribute("status")]);
  }

  const json = JSON.stringify(obj);

  return json;
}

function saveTaskList() {
  localStorage.setItem("taskListJson", taskList2Json());
}

function retrieveTaskTable() {
  let parsedTaskList;

  try {
    const storedTaskList = localStorage.getItem("taskListJson");
    parsedTaskList = JSON.parse(storedTaskList);
  } catch (error) {
    console.log(
      "Couldn't find previous todo list in local storage\n -> initializing an empty list"
    );
    parsedTaskList = [];
  }

  taskList.innerHTML = "";

  for (const idx in parsedTaskList) {
    const [label, status] = parsedTaskList[idx];
    addNewTask(label, status);
  }
}

(function myApp() {
  retrieveTaskTable();
  taskAddBtn.addEventListener("click", () => {
    addNewTask(newTaskInput.value);
    newTaskInput.value = "";
  });

  newTaskInput.addEventListener("keypress", (event) => {
    if (event.code === "Enter") {
      addNewTask(newTaskInput.value);
      newTaskInput.value = "";
    }
  });

  searchBoxDeleteBtn.addEventListener("click", flushSearchBox);
  searchTextInput.addEventListener("input", displaySearchedList);

  document.addEventListener("click", function (event) {
    const clickedElement = event.target;
    if (clickedElement.matches("li.task > button.status")) {
      changeTaskStatus(clickedElement);
    } else if (clickedElement.matches("li.task > .gg-trash")) {
      deleteTask(clickedElement.parentNode);
    }
  });
})();
