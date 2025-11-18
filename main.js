function loadComponent(modifier, url, callback) {
    const container = document.querySelector(`[data-modifier="${modifier}"]`);
    if (!container) return;

    fetch(url)
        .then(res => res.text())
        .then(html => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            // append template content if the template exists
            const template = tempDiv.querySelector("template");
            if(template) {
                container.appendChild(template.content.cloneNode(true));
            } else {
                container.innerHTML = html;
            }

            if(callback) callback(container);
        })
        .catch(err => console.error(`Failed to load ${modifier}:`, err));
}

// load auth visuals and form directly into auth-page container
loadComponent("auth-page", "/templates/auth/auth-bg.html");
loadComponent("auth-page", "/templates/auth/auth-form.html", () => {
    setAuthLogic();    // from auth.js
    formValidation();  // from auth.js
});
