const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const modal = document.getElementById("editBox");
const editNameInput = document.getElementById('taskName');
const editDateInput = document.getElementById('taskDate');
const editDescInput = document.getElementById('taskDescription');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
let taskBeingEdited = null;

inputBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskName = inputBox.value.trim();

    if(taskName === ''){
        alert('You must write something!');
        return;
    }
    let li = document.createElement("li");
        
    let taskHeader = document.createElement("div");
    taskHeader.className = 'task-header';
        
    let taskTitle = document.createElement("span");
    taskTitle.className = 'task-title';
    taskTitle.textContent = taskName;
    taskHeader.appendChild(taskTitle);
        
        // New tasks start without details; the edit modal adds them later.
    li.appendChild(taskHeader);
        
    let deleteBtn = document.createElement('button');
    deleteBtn.type = "button";
    deleteBtn.className = "delete";
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = "\u00d7";
    li.appendChild(deleteBtn);
        
    let editBtn = document.createElement('button');
    editBtn.type = "button";
    editBtn.className = "edit";
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = "\u270E";
    li.appendChild(editBtn);
        
    listContainer.appendChild(li);

    inputBox.value = '';
    
    saveData();
}

// Handles task list clicks (Check off, Delete, Edit)
listContainer.addEventListener('click', function(e){
    const task = e.target.closest('li');
    const deleteBtn = e.target.closest('.delete');
    const editBtn = e.target.closest('.edit');

    if(deleteBtn){
        task.remove();
        saveData();
    }   

    else if (editBtn) {
        taskBeingEdited = task;
        
        // 1. Populate the name input
        const titleEl = task.querySelector('.task-title');
        editNameInput.value = titleEl ? titleEl.textContent : '';
        
        // 2. Populate the date input (strips away the "Due: " prefix)
        const dateEl = task.querySelector('.task-date');
        if (dateEl) {
            editDateInput.value = dateEl.textContent.replace('Due: ', '');
        } else {
            editDateInput.value = '';
        }
        
        // 3. Populate the description input
        const descEl = task.querySelector('.task-desc');
        editDescInput.value = descEl ? descEl.textContent : '';
        
        modal.classList.add('show');
    }

    else{
        task.classList.toggle("checked");
        saveData();
    }

}, false);

// Modal Cancel button logic
cancelBtn.addEventListener('click', function(e) {
    modal.classList.remove('show');
    taskBeingEdited = null;
});

// Modal Save button logic
saveBtn.addEventListener('click', function(e) {
    const editedTaskName = editNameInput.value.trim();
    if (editedTaskName === '') {
        alert('Task name cannot be empty!');
        return;
    }

    if (taskBeingEdited) {
        // 1. Update the task title name
        const titleEl = taskBeingEdited.querySelector('.task-title');
        if (titleEl) {
            titleEl.textContent = editedTaskName;
        }

        // 2. Update, create, or remove the due date tag
        let dateEl = taskBeingEdited.querySelector('.task-date');
        let headerEl = taskBeingEdited.querySelector('.task-header');
        
        if (editDateInput.value !== '') {
            if (dateEl) {
                // If it already exists, just change the text
                dateEl.textContent = `Due: ${editDateInput.value}`;
            } else if (headerEl) {
                // If it didn't exist before, create and attach a new date tag
                let newDateSpan = document.createElement("span");
                newDateSpan.className = 'task-date';
                newDateSpan.textContent = `Due: ${editDateInput.value}`;
                headerEl.appendChild(newDateSpan);
            }
        } else if (dateEl) {
            // If the user cleared the date box, delete the date tag from the list
            dateEl.remove();
        }

        // 3. Update, create, or remove the description paragraph
        let descEl = taskBeingEdited.querySelector('.task-desc');
        
        if (editDescInput.value.trim() !== '') {
            if (descEl) {
                // If it already exists, update its text
                descEl.textContent = editDescInput.value.trim();
            } else {
                // If it didn't exist before, create a new paragraph and append it below the header
                let newDescParagraph = document.createElement("p");
                newDescParagraph.className = 'task-desc';
                newDescParagraph.textContent = editDescInput.value.trim();
                taskBeingEdited.appendChild(newDescParagraph);
            }
        } else if (descEl) {
            // If the user cleared the description field, remove it from the task row entirely
            descEl.remove();
        }

        // Close modal and lock down changes
        modal.classList.remove('show');
        taskBeingEdited = null;
        saveData();
    }
});

function saveData(){
    localStorage.setItem('data', listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem('data') || '';
    // Repair older saved tasks that were created without a delete control.
    for (const li of listContainer.children) {
        if (li.tagName === "LI" && !li.querySelector('.delete')) {
            const span = document.createElement('span');
            span.className = "delete";
            span.textContent = "\u00d7";
            li.appendChild(span);
        }
    }
    saveData();
}
showTask();
