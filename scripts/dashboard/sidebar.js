// populate user profile information
function populateUserProfile() {
    const userName = localStorage.getItem("userName") || "User";
    const userEmail = localStorage.getItem("userEmail") || "";

    // get first letter of first name for profile icon
    const firstNameInitial = userName.trim().charAt(0).toUpperCase();

    // update profile icon
    const profileIcon = document.querySelector(".sidebar-container__profile--icon");
    if(profileIcon) {
        profileIcon.textContent = firstNameInitial;
    }

    // update user name
    const userNameElement = document.querySelector(".user-name");
    if(userNameElement) {
        // get first name only
        const firstName = userName.split(" ")[0];
        userNameElement.textContent = firstName;
    }

    // update user email
    const userEmailElement = document.querySelector(".user-email");
    if(userEmailElement) {
        userEmailElement.textContent = userEmail;
    }
}

// handle logout
function setupLogout() {
    const logoutBtn = document.querySelector(".nav-btn--logout");
    
    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            const confirmLogout = confirm("Are you sure you want to logout?");
            
            if(confirmLogout) {
                // clear user session
                localStorage.removeItem("userLoggedIn");
                localStorage.removeItem("currentUserId");
                localStorage.removeItem("userName");
                localStorage.removeItem("userEmail");
                
                // redirect to auth page
                window.location.href = "/auth.html";
            }
        });
    }
}

// collapse/expand sidebar
function setupSidebarToggle() {
    const collapseBtn = document.getElementById("collapse-btn");
    const sidebar = document.querySelector(".sidebar-container");
    
    if(collapseBtn && sidebar) {
        collapseBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
}

// initialize sidebar on load (called by main.js after HTML is injected)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        populateUserProfile();
        setupLogout();
        setupSidebarToggle();
    });
} else {
    // DOM already loaded, execute immediately
    populateUserProfile();
    setupLogout();
    setupSidebarToggle();
}