// get time-based greeting
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

// update dashboard greeting
function updateDashboardGreeting() {
    const headingElement = document.querySelector(".dashboard-container__heading h1");
    
    if(headingElement) {
        const userName = localStorage.getItem("userName") || "User";
        const firstName = userName.split(" ")[0].toUpperCase();
        const greeting = getTimeBasedGreeting();
        
        headingElement.textContent = `${greeting}, ${firstName}!`;
    }
}

// initialize dashboard on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDashboardGreeting);
} else {
    // DOM already loaded, execute immediately
    updateDashboardGreeting();
}
