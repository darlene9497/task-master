// event delegation for dynamically loaded content
document.addEventListener("click", (e) => {
    const collapseBtn = e.target.closest("#collapse-btn")
    if (!collapseBtn) return

    const sidebar = document.getElementById("root__aside")
    if(sidebar) {
        sidebar.classList.toggle("collapsed")
    }
})

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

// // collapse/expand sidebar
// function setupSidebarToggle() {
//     const collapseBtn = document.getElementById("collapse-btn");
//     const sidebar = document.getElementById("root__aside");
    
//     if(collapseBtn && sidebar) {
//         collapseBtn.addEventListener("click", (e) => {
//             e.stopPropagation();
//             sidebar.classList.toggle("collapsed");
//         });
//     }
// }

// mobile menu toggle
function setupMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("root__aside");
    const overlay = document.getElementById("sidebar-overlay");
    
    if(menuBtn && sidebar) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.add("mobile-open");
            if(overlay) {
                overlay.classList.add("active");
            }
        });
    }

    // close sidebar when clicking overlay
    if(overlay) {
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("mobile-open");
            overlay.classList.remove("active");
        });
    }

    // close sidebar when clicking a nav button on mobile
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if(window.innerWidth <= 768) {
                sidebar.classList.remove("mobile-open");
                if(overlay) {
                    overlay.classList.remove("active");
                }
            }
        });
    });
}

// initialize sidebar on load (called by main.js after HTML is injected)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        populateUserProfile();
        setupLogout();
        setupSidebarToggle();
        setupMobileMenu();
    });
} else {
    // DOM already loaded, execute immediately
    populateUserProfile();
    setupLogout();
    // setupSidebarToggle();
    setupMobileMenu();
}