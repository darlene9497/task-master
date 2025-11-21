
function redirectIfNotLoggedIn() {
    if (sessionStorage.getItem("userLoggedIn") !== "true") {
        window.location.href = "/auth.html";
    }
}

// if user is already logged in, redirect to dashboard (index.html)
function redirectIfLoggedIn() {
    if (sessionStorage.getItem("userLoggedIn") === "true") {
        window.location.href = "/index.html";
    }
}

// loads html templates with their linked styles and scripts
async function loadImports() {
    const elements = document.querySelectorAll('[data-import]');
    
    for (const element of elements) {
        const url = element.getAttribute('data-import');
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            
            const html = await response.text();
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // find script sources
            const scriptTags = temp.querySelectorAll('script[src]');
            const scriptUrls = [];
            scriptTags.forEach(script => {
                scriptUrls.push(script.getAttribute('src'));
                script.remove();
            });
            
            // insert html into page
            element.innerHTML = temp.innerHTML;
            
            // load scripts after html is ready
            for (const src of scriptUrls) {
                await loadScript(src);
            }
            
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    }
}

// loads a single script file
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // skip if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// start loading when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadImports);
} else {
    loadImports();
}