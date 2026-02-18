const textarea = document.getElementById("post-textarea");
const postBtn = document.getElementById("post-btn");
const feed = document.getElementById("community-feed");

// form avatar initials dynamically
const avatarEl = document.getElementById("post-avatar");
if (avatarEl) {
    avatarEl.textContent = getUserInitials();
}

// get username
function getUserName() {
    return localStorage.getItem("userName") || "User";
}

// set user initals from their username
function getUserInitials() {
    const name = getUserName();
    return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// time helpers
function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// click on the post button to post
postBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePost();
});


// enter to post (shift+enter = new line)
textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation()
        handlePost();
    }
});

// main handler function for posts
function handlePost() {
    const message = textarea.value.trim();
    if (!message) return;

    renderUserPost(message);

    if (message.toLowerCase().includes("@comsq")) {
        renderAIPost(message);
    }

    textarea.value = "";
}

// function for user post
function renderUserPost(text) {
    const timestamp = Date.now();

    const post = document.createElement("div");
    post.className = "community-container__main--user-content";

    post.innerHTML = `
        <div class="user-content__area">
            <div class="user-content__avatar">
                <span>${getUserInitials()}</span>
            </div>

            <div class="user-content__area--card">
                <div class="user-content__area--top">
                    <p>${getUserName()}</p>
                    <span class="day" data-time="${timestamp}">
                        ${timeAgo(timestamp)}
                    </span>
                </div>
                <p class="user-comment">
                    ${escapeHTML(text)}
                </p>
            </div>
        </div>
    `;

    feed.prepend(post);
}

// function for AI post
function renderAIPost(text) {
    const timestamp = Date.now();

    const post = document.createElement("div");
    post.className = "community-container__main--ai-content";

    post.innerHTML = `
        <div class="ai-content__avatar">
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
        </div>

        <div class="ai-content__area">
            <div class="ai-content__area--top">
                <div class="desc">
                    <span class="name">Comsq AI</span>
                    <span class="badge">AI Assistant</span>
                </div>
                <span class="day" data-time="${timestamp}">
                    ${timeAgo(timestamp)}
                </span>
            </div>

            <p class="ai-response">Thinking...</p>
        </div>
    `;

    feed.prepend(post);

    fetchGeminiResponse(
        text.replace("@comsq", "").trim(),
        post.querySelector(".ai-response")
    );
}

// function to get gemini AI response
async function fetchGeminiResponse(prompt, responseEl) {
    const API_KEY = "";
    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": API_KEY,
            },
            body: JSON.stringify({
                contents: [
                {
                    parts: [{ text: prompt }],
                },
                ],
            })
        });

        const data = await res.json();

        responseEl.textContent =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t generate a response.";
    } catch (err) {
        console.error(err);
        responseEl.textContent = "Error contacting Comsq AI.";
    }
}

// cross-site scripting(XSS) safety
function escapeHTML(str) {
    return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// auto update time labels
setInterval(() => {
    document.querySelectorAll("[data-time]").forEach(el => {
        const timestamp = Number(el.dataset.time);
        el.textContent = timeAgo(timestamp);
    });
}, 60 * 1000); // every minute
