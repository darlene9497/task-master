// if user is not logged in, redirect to auth
function redirectIfNotLoggedIn() {
    if (localStorage.getItem("userLoggedIn") !== "true") {
        window.location.href = "/auth.html";
    }
}

// if user is already logged in, redirect to dashboard
function redirectIfLoggedIn() {
    if (localStorage.getItem("userLoggedIn") === "true") {
        window.location.href = "/index.html";
    }
}

// load a single script
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // skip if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// load templates with scripts
async function loadImports() {
    const elements = document.querySelectorAll('[data-import]');

    for (const element of elements) {
        const url = element.getAttribute("data-import");

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);

            const html = await response.text();
            const temp = document.createElement("div");
            temp.innerHTML = html;

            // extract script sources
            const scriptTags = temp.querySelectorAll("script[src]");
            const scriptUrls = [];
            scriptTags.forEach((script) => {
                scriptUrls.push(script.getAttribute("src"));
                script.remove();
            });

            // insert HTML into element
            element.innerHTML = temp.innerHTML;

            // load scripts sequentially
            for (const src of scriptUrls) {
                await loadScript(src);
            }

            // initialize element-specific logic
            if (element.id === "root__aside") {
                initNavButtons();

                setTimeout(() => {
                    if (typeof populateUserProfile === "function") populateUserProfile();
                    if (typeof setupLogout === "function") setupLogout();
                    if (typeof setupSidebarToggle === "function") setupSidebarToggle();
                    if (typeof setupMobileMenu === "function") setupMobileMenu();
                    // reveal sidebar after all scripts initialized
                    element.style.visibility = "visible";
                    element.classList.add("show");
                }, 50);
            }

            if (element.id === "root__main") {
                setTimeout(() => {
                    if (typeof updateDashboardGreeting === "function") updateDashboardGreeting();
                    // reveal main content
                    element.style.visibility = "visible";
                    element.classList.add("show");
                }, 50);
            }
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    }
}

// load main content (used for nav buttons)
async function loadMainContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);

        const html = await response.text();
        const temp = document.createElement("div");
        temp.innerHTML = html;

        // extract scripts
        const scriptTags = temp.querySelectorAll("script[src]");
        const scriptUrls = [];
        scriptTags.forEach((script) => {
            scriptUrls.push(script.getAttribute("src"));
            script.remove();
        });

        const main = document.getElementById("root__main");
        main.innerHTML = temp.innerHTML;

        for (const src of scriptUrls) {
            await loadScript(src);
        }

        // trigger dashboard-specific init
        setTimeout(() => {
            if (typeof updateDashboardGreeting === "function") updateDashboardGreeting();
            main.style.visibility = "visible";
            main.classList.add("show");
        }, 50);

    } catch (err) {
        console.error(err);
    }
}

// nav button click handlers
function initNavButtons() {
    const buttons = document.querySelectorAll(".nav-btn[data-target]");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetUrl = btn.getAttribute("data-target");
            // hide main while loading new content
            const main = document.getElementById("root__main");
            main.style.visibility = "hidden";
            main.classList.remove("show");
            loadMainContent(targetUrl);
        });
    });
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    // initially hide content to prevent FOUC
    const aside = document.getElementById("root__aside");
    const main = document.getElementById("root__main");
    aside.style.visibility = "hidden";
    main.style.visibility = "hidden";

    loadImports();
    initNavButtons();
});
