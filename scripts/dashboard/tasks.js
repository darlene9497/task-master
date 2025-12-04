document.addEventListener("click", function (e) {
    // stop if no tasks container exists
    if (!document.querySelector(".tasks-container")) return;

    // detect top-level tab click (tasks / summary)
    const btn = e.target.closest(".container-btn[data-tab]");
    if (btn) {
        // remove previous active state
        const tabGroup = btn.closest(".tasks-container__main--top");
        tabGroup.querySelectorAll(".container-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.getAttribute("data-tab");

        // get main elements
        const midSection = document.querySelector(".tasks-container__main--mid");
        const actionButton = midSection.querySelector(".tasks-container__main--mid-btn button");
        const tasksInfo = midSection.querySelector(".tasks-container__main--mid-tasks");
        const tasksContainerArea = document.querySelector(".tasks-container__main--area-tasks");
        const summaryTab = document.getElementById("summaryTab");

        if (tab === "summary") {
            // update summary tab header
            tasksInfo.innerHTML = `
                <div>
                    <h3 class="summary-title">AI-Powered Task Summary</h3>
                    <span class="summary-desc">Get insights and recommendations for your tasks</span>
                </div>
            `;

            // change button to generate summary
            actionButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0
                1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558
                1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0
                1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1
                1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                <path d="M20 2v4"/><path d="M22 4h-4"/>
                <circle cx="4" cy="20" r="2"/></svg>
                <span>Generate New</span>
            `;

            // show summary area, hide tasks
            tasksContainerArea.style.display = "none";
            summaryTab.style.display = "block";
        } else {
            // show task counters
            tasksInfo.innerHTML = `
                <div class="activity-tasks">
                    <p>0</p>
                    <span>Active tasks</span>
                </div>
                <div class="separator"></div>
                <div class="completed-tasks">
                    <p>0</p>
                    <span>Completed</span>
                </div>
            `;

            // switch back to add task button
            actionButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                <span>Add Task</span>
            `;

            // show tasks, hide summary tab content
            tasksContainerArea.style.display = "block";
            summaryTab.style.display = "none";
        }
    }

    // summary inner tab switching (latest/history)
    const summaryBtn = e.target.closest(".summary-tabs .container-btn");
    if (summaryBtn) {
        // remove previous active state
        summaryBtn.parentElement.querySelectorAll(".container-btn").forEach(b => b.classList.remove("active"));
        summaryBtn.classList.add("active");

        const subTab = summaryBtn.getAttribute("data-summarytab");

        // hide all summary content sections
        document.querySelectorAll("#summaryTab .summary-content").forEach(content => {
            content.style.display = "none";
        });

        // show selected section
        const targetContent = document.querySelector(`#summaryTab .${subTab}-summary`);
        if (targetContent) targetContent.style.display = "block";
    }
});



// add task modal
const modalOverlay = document.getElementById('taskModal');
const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');

// open modal
document.addEventListener('click', function (e) {
    const addTaskBtn = e.target.closest('.tasks-container__main--mid-btn button');

    if (addTaskBtn) {
        modalOverlay.style.display = 'flex';
    }
});

// close modal
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });
});

// close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
});




// form submission
const modal = document.getElementById('taskModal');
const form = document.querySelector('.modal-body__form')
const submitBtn = document.querySelector('.modal-submit')

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // get form values
    const title = form.querySelector('input[type="text"]').value;
    const description = form.querySelector('textarea').value;
    const priority = document.getElementById('priority-level').value;
    const dueDate = document.getElementById('date').value;
    
    // validate required fields
    if (!title || !dueDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    // task object
    const task = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // log to the console
    console.log('---- New task created ----');
    console.log(task);
    console.log('--------------------');
    
    // close modal and then reset the form
    modal.style.display = 'none';
    form.reset();
    
    // success message
    alert('Task created. Check the console for details.');
});