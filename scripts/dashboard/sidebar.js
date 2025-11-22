// event delegation for dynamically loaded content
document.addEventListener("click", (e) => {
    const collapseBtn = e.target.closest("#collapse-btn")
    if (!collapseBtn) return

    const sidebar = document.getElementById("root__aside")
    if(sidebar) {
        sidebar.classList.toggle("collapsed")
    }
})
