// Implemeting todo app in type-script

interface Task {
  label: string;
  status: "done" | "undone";
}

const taskList = getHTMLElementById("task-list");
const searchTextInput = getHTMLElementById(
  "card-search-input"
) as HTMLInputElement;
const searchBoxDeleteBtn = getHTMLElementById("search-delete-button");
const newTaskInput = getHTMLElementById("new-task-text") as HTMLInputElement;
const taskAddBtn = getHTMLElementById("new-task-add-button");

function isNull(val: any): val is null {
  return val === null;
}

function isValidStatus(status: string | null): status is Task["status"] {
  return !isNull(status) && (status === "done" || status === "undone");
}

function getHTMLElementById(id: string): HTMLElement {
  const htmlElement = document.getElementById(id);
  if (!isNull(htmlElement)) {
    return htmlElement;
  }
  throw new Error("No matching element was found in the document!");
}

function getNewTaskElement(task: Task): HTMLLIElement {
  const newTaskElement = document.createElement("li");
  const labelElement = document.createElement("label");
  const statusBtnElement = document.createElement("button");
  const trashElement = document.createElement("i");

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

function addNewTask(
  label: Task["label"],
  status: Task["status"] = "undone"
): void {
  if (label.trim()) {
    const task: Task = { label, status };
    const newTaskElement = getNewTaskElement(task);
    taskList.appendChild(newTaskElement);
    storeTaskList();
    displaySearchedList();
  } else {
    console.log("Cannot add an empty task");
  }
}

function changeTaskStatus(taskElement: HTMLElement): void {
  if (!isNull(taskElement)) {
    const statusAttribure = taskElement.getAttribute("status");
    if (isValidStatus(statusAttribure)) {
      const taskStatus = statusAttribure;
      taskElement.setAttribute(
        "status",
        taskStatus === "done" ? "undone" : "done"
      );
    } else {
      throw new Error(
        "Got incompatible task status. should be of type Task['status']"
      );
    }
  } else {
    throw new Error(
      "The status button either has no parent, or its parent isn't a DOM Element"
    );
  }
  storeTaskList();
}

function deleteTask(taskElement: HTMLElement): void {
  taskElement.remove();
  storeTaskList();
}

function flushSearchBox(): void {
  searchTextInput.value = "";

  for (let i = 0; i < taskList.children.length; i++) {
    const taskElement = taskList.children[i];
    if (taskElement instanceof HTMLElement) taskElement.style.display = "flex";
  }
}

function getTaskLabel(taskElement: HTMLElement): Task["label"] {
  const taskLabel = taskElement.querySelector("label")?.textContent;
  if (taskLabel) return taskLabel;
  throw new Error("Got no task or textContent");
}

function displaySearchedList(): void {
  const searchPattern = searchTextInput.value.toLowerCase();

  for (let i = 0; i < taskList.children.length; i++) {
    const taskElement = taskList.children[i];
    if (taskElement instanceof HTMLElement) {
      const taskLabel = getTaskLabel(taskElement);
      taskElement.style.display = taskLabel
        .toLowerCase()
        .includes(searchPattern)
        ? "flex"
        : "none";
    }
  }
}

function taskList2JsonString(): string {
  const taskList2Save: [Task["label"], Task["status"]][] = [];

  for (let i = 0; i < taskList.children.length; i++) {
    const taskElement = taskList.children[i];
    if (taskElement instanceof HTMLElement) {
      const taskLabel = getTaskLabel(taskElement);
      const statusAttribure = taskElement.getAttribute("status");
      if (isValidStatus(statusAttribure)) {
        const taskStatus = statusAttribure;
        taskList2Save.push([taskLabel, taskStatus]);
      } else {
        throw new Error(
          "Got incompatible task status. should be of type Task['status']"
        );
      }
    }
  }
  return JSON.stringify(taskList2Save);
}

function storeTaskList(): void {
  localStorage.setItem("storedTaskList", taskList2JsonString());
}

function retrieveTaskList(): void {
  const storedTaskList = localStorage.getItem("storedTaskList");
  if (!isNull(storedTaskList)) {
    const parsedTaskList: [Task["label"], Task["status"]][] =
      JSON.parse(storedTaskList);
    for (const idx in parsedTaskList) {
      const [label, status] = parsedTaskList[idx];
      addNewTask(label, status);
    }
  }
}

function handleBtnClick(event: Event) {
  const { target } = event;
  const ClickedBtn = target as HTMLButtonElement;
  if (ClickedBtn) {
    const parentElement = ClickedBtn.parentElement;
    if (!isNull(parentElement)) {
      if (ClickedBtn.matches("li.task > button.status")) {
        changeTaskStatus(parentElement);
      } else if (ClickedBtn.matches("li.task > .gg-trash")) {
        deleteTask(parentElement);
      }
    }
  }
}

(function myApp() {
  taskList.innerHTML = "";
  retrieveTaskList();
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
  document.body.addEventListener("click", handleBtnClick);

})();
