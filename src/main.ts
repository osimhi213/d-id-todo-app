// Implemeting todo app in type-script

interface Task {
  label: string;
  status?: "done" | "undone";
}

const taskList = getHTMLElementById("task-list");
const searchTextInput = getHTMLElementById(
  "card-search-input"
) as HTMLInputElement;
const searchBoxDeleteBtn = getHTMLElementById("search-delete-button");
const newTaskInput = getHTMLElementById("new-task-text") as HTMLInputElement;
const taskAddBtn = getHTMLElementById("new-task-add-button");

function isValidStatus(
  status: string | null | undefined
): status is Task["status"] {
  return (
    status !== null &&
    status !== undefined &&
    (status === "done" || status === "undone")
  );
}

function getHTMLElementById(id: string): HTMLElement {
  const htmlElement = document.getElementById(id);

  if (htmlElement !== null) {
    return htmlElement;
  }

  throw new Error("No matching element was found in the document!");
}

function getNewTaskElement(task: Task): HTMLLIElement {
  const newTaskElement = document.createElement("li");
  const labelElement = document.createElement("label");
  const statusBtnElement = document.createElement("button");
  const trashElement = document.createElement("i");

  newTaskElement.classList.add("task");
  trashElement.classList.add("gg-trash");
  statusBtnElement.classList.add("status");

  labelElement.textContent = task.label;
  statusBtnElement.textContent = "Done";

  newTaskElement.setAttribute("status", task.status || "undone");

  newTaskElement.appendChild(trashElement);
  newTaskElement.appendChild(labelElement);
  newTaskElement.appendChild(statusBtnElement);

  statusBtnElement.addEventListener("click", () => {
    changeTaskStatus(newTaskElement);
  });
  trashElement.addEventListener("click", () => {
    deleteTask(newTaskElement);
  });

  return newTaskElement;
}

function addNewTask(task: Task): void {
  if (!task.label.trim()) {
    console.log("Cannot add an empty task");
  } else {
    taskList.appendChild(getNewTaskElement(task));
    storeTaskList();
    displaySearchedList();
  }
}

function changeTaskStatus(taskElement: HTMLElement): void {
  if (taskElement === null) {
    throw new Error(
      "The status button either has no parent, or its parent isn't a DOM Element"
    );
  }

  const taskStatus = taskElement.getAttribute("status");

  if (!isValidStatus(taskStatus)) {
    throw new Error(
      "Got incompatible task status. should be of 'done' or 'undone'"
    );
  }

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
    if (taskElement instanceof HTMLElement) taskElement.style.display = "flex";
  }
}

function getTaskLabel(taskElement: HTMLElement): Task["label"] {
  const taskLabel = taskElement.querySelector("label")?.textContent;

  if (!taskLabel) {
    throw new Error("Got no task or textContent");
  }

  return taskLabel;
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
      const taskLabel = getTaskLabel(taskElement);
      const taskStatus = taskElement.getAttribute("status");

      if (!isValidStatus(taskStatus)) {
        throw new Error(
          "Got incompatible task status. Should be of done or undone"
        );
      }

      taskList2Save.push({ label: taskLabel, status: taskStatus });
    }
  }

  return JSON.stringify(taskList2Save);
}

function storeTaskList(): void {
  localStorage.setItem("storedTaskList", taskList2JsonString());
}

function retrieveTaskList(): void {
  const storedTaskList = localStorage.getItem("storedTaskList");

  if (storedTaskList !== null) {
    const parsedTaskList: Task[] = JSON.parse(storedTaskList);

    for (const taskElement of parsedTaskList) {
      addNewTask(taskElement);
    }
  }
}

(function myApp() {
  taskList.innerHTML = "";
  retrieveTaskList();

  taskAddBtn.addEventListener("click", () => {
    addNewTask({ label: newTaskInput.value });
    newTaskInput.value = "";
  });

  newTaskInput.addEventListener("keypress", (event) => {
    if (event.code === "Enter") {
      addNewTask({ label: newTaskInput.value });
      newTaskInput.value = "";
    }
  });

  searchBoxDeleteBtn.addEventListener("click", flushSearchBox);
  searchTextInput.addEventListener("input", displaySearchedList);
})();
