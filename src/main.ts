// Implemeting todo app in type-script

interface Task {
  readonly label: string;
  status: "done" | "undone";
}

const defaultStatus: Pick<Task, "status"> = {
  status: "undone",
};

const taskList = getHTMLElementById("task-list");
const searchTextInput = getHTMLElementById(
  "card-search-input"
) as HTMLInputElement;
const searchBoxDeleteBtn = getHTMLElementById("search-delete-button");
const newTaskInput = getHTMLElementById("new-task-text") as HTMLInputElement;
const taskAddBtn = getHTMLElementById("new-task-add-button");

function isValidTask(obj: any): obj is Task {
  return obj && typeof obj.label === "string" && isValidStatus(obj.status);
}

function isValidStatus(status: unknown): status is Task["status"] {
  return status === "done" || status === "undone";
}

function getHTMLElementById(id: string): HTMLElement {
  const htmlElement = document.getElementById(id);

  if (htmlElement === null) {
    throw new Error("No matching element was found in the document!");
  }

  return htmlElement;
}

function getTaskLabel(taskElement: HTMLElement): Task["label"] {
  const taskLabel = taskElement.querySelector("label")?.textContent;

  if (!taskLabel) {
    throw new Error("Got no task or text content");
  }

  return taskLabel;
}

function getTaskStatus(taskElement: HTMLElement): Task["status"] {
  const taskStatus = taskElement.getAttribute("status");

  if (!isValidStatus(taskStatus)) {
    throw new Error("Got incompatible task status");
  }

  return taskStatus;
}

function getNewTaskElement(newTask: Task): HTMLLIElement {
  const newTaskElement = document.createElement("li");
  const labelElement = document.createElement("label");
  const statusBtnElement = document.createElement("button");
  const trashElement = document.createElement("i");

  newTaskElement.classList.add("task");
  trashElement.classList.add("gg-trash");
  statusBtnElement.classList.add("status");

  labelElement.textContent = newTask.label;
  statusBtnElement.textContent = "Done";

  newTaskElement.setAttribute("status", newTask.status);

  newTaskElement.appendChild(trashElement);
  newTaskElement.appendChild(labelElement);
  newTaskElement.appendChild(statusBtnElement);

  statusBtnElement.addEventListener("click", () =>
    changeTaskStatus(newTaskElement)
  );
  trashElement.addEventListener("click", () => deleteTask(newTaskElement));

  return newTaskElement;
}

function addNewTask(newTask: Task): void {
  if (!newTask.label.trim()) {
    console.log("Cannot add an empty task");
  } else {
    taskList.appendChild(getNewTaskElement(newTask));
    storeTaskList();
    displaySearchedList();
  }
}

function changeTaskStatus(taskElement: HTMLLIElement): void {
  const taskStatus = getTaskStatus(taskElement);

  taskElement.setAttribute("status", taskStatus === "done" ? "undone" : "done");
  storeTaskList();
}

function deleteTask(taskElement: HTMLElement): void {
  taskElement.remove();
  storeTaskList();
}

function flushSearchBox(): void {
  searchTextInput.value = "";

  for (const taskElement of taskList.children) {
    if (taskElement instanceof HTMLElement) {
      taskElement.style.display = "flex";
    }
  }
}

function displaySearchedList(): void {
  const searchPattern = searchTextInput.value.toLowerCase();

  for (const taskElement of taskList.children) {
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
  const taskList2Save: Task[] = [];

  for (const taskElement of taskList.children) {
    if (taskElement instanceof HTMLElement) {
      const newTask: Task = {
        label: getTaskLabel(taskElement),
        status: getTaskStatus(taskElement),
      };

      taskList2Save.push(newTask);
    }
  }

  return JSON.stringify(taskList2Save);
}

function storeTaskList(): void {
  localStorage.setItem("storedTaskList", taskList2JsonString());
}

function retrieveTaskList(): void {
  const storedTaskList = localStorage.getItem("storedTaskList");

  if (storedTaskList) {
    const parsedTaskList = JSON.parse(storedTaskList);

    for (const taskElement of parsedTaskList) {
      if (isValidTask(taskElement)) {
        addNewTask(taskElement);
      }
    }
  }
}

(function myApp() {
  taskList.innerHTML = "";
  retrieveTaskList();

  taskAddBtn.addEventListener("click", () => {
    const newTask: Task = { ...defaultStatus, label: newTaskInput.value };
    addNewTask(newTask);
    newTaskInput.value = "";
  });

  newTaskInput.addEventListener("keypress", (event) => {
    if (event.code === "Enter") {
      const newTask: Task = { ...defaultStatus, label: newTaskInput.value };
      addNewTask(newTask);
      newTaskInput.value = "";
    }
  });

  searchBoxDeleteBtn.addEventListener("click", flushSearchBox);
  searchTextInput.addEventListener("input", displaySearchedList);
})();
