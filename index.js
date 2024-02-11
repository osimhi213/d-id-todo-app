// Retrieve toDoJson
const storedToDoJson = JSON.parse(localStorage.getItem('toDoJson'));
const toDoTable = document.getElementById('todo-table');
toDoTable.innerHTML = '';

for (const idx in storedToDoJson) {
    const [label, status] = storedToDoJson[idx];
    addNewToDo(label, status);
}

const addToDoBtn = document.querySelector('#addtodo-btn');
const newToDoInput = document.querySelector('#newtodo');

/*
New task functionality (sorted by created_at) 
*/ 
function getNewToDoNode (label, status) {
    var newToDoNode = document.createElement("li");
    newToDoNode.classList.add("bullet");
    var labelElement = document.createElement("label");
    labelElement.textContent = label;
    var button = document.createElement("button");
    button.classList.add(status);
    button.textContent = "Done";
    newToDoNode.appendChild(labelElement);
    newToDoNode.appendChild(button);
    return newToDoNode;
}

function addNewToDo (label, status='gray') {
    if (label) {
        const newToDoNode = getNewToDoNode(label, status)
        toDoTable.appendChild(newToDoNode)    
    }
};

addToDoBtn.addEventListener('click', () => {
    addNewToDo(newToDoInput.value);
    newToDoInput.value = '';
});

newToDoInput.addEventListener('keypress', (event) => {
    if (event.code === 'Enter') {
        addNewToDo(newToDoInput.value)
        newToDoInput.value = '';
    } 
});

/*
Complete task functionality
*/ 
const completeTask = (btn) => {
    btn.classList.toggle('green');
    btn.classList.toggle('gray');
};

/*
Delete task functionality
*/ 
const deleteTask = (clickedElement) => {
    const li = clickedElement.matches('li') ? clickedElement : clickedElement.parentNode;
    toDoTable.removeChild(li);
};

/*
Delete search box functionality
*/ 
const deleteSearchBoxText = () => {
    searchTextElement.value = '';
    for (let i = 0; i < toDoTable.children.length; i++) {
        const task = toDoTable.children[i];
        task.style.display = 'flex';
    }
};


/*
Clicks Handler
*/ 
document.addEventListener('click', function(event) {
    const clickedElement = event.target;
    // complete
    if (clickedElement.matches('li.bullet > button')) {
        completeTask(clickedElement);

    // delete task
    } else if (clickedElement.matches('li') || clickedElement.matches('li > label')) {
        deleteTask(clickedElement);
    
    // delete search box
    } else if (clickedElement.matches('.delete-button')) { 
        deleteSearchBoxText(clickedElement);
    }
});

/*
Search Input Handler
*/ 
const dispSearchedTable = () => {
    const searchPattern = searchTextElement.value.toLowerCase();
    for (let i = 0; i < toDoTable.children.length; i++) {
        const task = toDoTable.children[i];
        const taskLabel = task.querySelector('label').textContent;
        if (!taskLabel.toLowerCase().includes(searchPattern)) {
            task.style.display = 'none';
        } else {
            task.style.display = 'flex';
        }
    }
};

const searchTextElement = document.getElementById('card-search-input');
searchTextElement.addEventListener('input', dispSearchedTable)

/*
Save Html
*/ 

// Create an observer to find mutations in toDoTable (target)
const observer = new MutationObserver((mutationsList, observer) => {
    if (mutationsList) {
        saveTableAsJson();
    }
});
const observerOptions = {
    subtree: true,
    childList: true,
    attributes: true,
};
observer.observe(toDoTable, observerOptions);


// if triggered than table has changed and we need to save it to localStorage
const saveTableAsJson = () => {
    localStorage.setItem('toDoJson', toDoTable2Json());
}

const toDoTable2Json = () => {
    let obj = {};
    for (let i = 0; i < toDoTable.children.length; i++) {
        const task = toDoTable.children[i];
        const [label, status] = task.children;
        obj[i] = [label.textContent, status.className];
    }
    const json = JSON.stringify(obj);
    console.log(json);
    return json;
};

