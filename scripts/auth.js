// auth switch logic
function setAuthLogic() {
    const title = document.querySelector("[data-title]")
    const info = document.querySelector("[data-info]")
    const fields = document.getElementById("form-fields")

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn")

    const submitBtn = document.querySelector("[data-submit-btn]")

    // login form
    function showLogin() {
        title.textContent = "Welcome Back!";
        info.textContent = "Enter your details to access your account";

        fields.innerHTML = `
            <label>Email*</label>
            <div class="email-input">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                <input type="email" placeholder="hello@example.com" id="email" required autocomplete="email">
            </div>

            <label>Password*</label>
            <div class="password-input">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" placeholder="•••••••" id="password" required autocomplete="current-password">
            </div>
        `;

        submitBtn.textContent = "Next Step"
    }

    // signup form
    function showSignup() {
        title.textContent = "Join TaskMaster";
        info.textContent = "Create an account to boost your productivity";

        fields.innerHTML = `
            <label>Full Name*</label>
            <div class="name-input">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="John Doe" id="name" required>
            </div>

            <label>Email Address*</label>
            <div class="email-input">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                <input type="email" placeholder="hello@example.com" id="email" required autocomplete="email">
            </div>

            <label>Password*</label>
            <div class="password-input">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" placeholder="•••••••" id="password" required autocomplete="new-password">
            </div>
            <span class="pass-chars">Password must be at least 6 characters long</span>
        `;

        submitBtn.textContent = "Create Account"
    }

    // default screen
    showLogin()

    // button events to switch forms
    loginBtn.addEventListener("click", showLogin)
    signupBtn.addEventListener("click", showSignup)
}

// function to validate user inputs
function formValidation() {
    const form = document.getElementById("authForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const emailInput = document.querySelector("#email")
        const nameInput = document.querySelector("#name")
        const passwordInput = document.querySelector("#password")

        // email validation
        if(!validator.isEmail(emailInput.value)) {
            alert("Please enter a valid email")
            return;
        }

        // password validation
        if(!validator.isLength(passwordInput.value, { min:6 })) {
            alert("Password must be at least 6 characters long.")
            return;
        }

        let fullName = "";

        // name validation only when in signup mode
        if(nameInput) {
            fullName = nameInput.value.trim();
            const nameRegex = /^[A-Za-z]{3,}$/; // only letters, at least 3 characters

            if(!nameRegex.test(fullName)) {
                alert("Your name must have at least 3 letters and no numbers.")
                return
            }
        }

        const formData = {
            fullName,
            email: emailInput.value,
            password: passwordInput.value
        }

        fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            alert("Auth successful")
            console.log(data)

            // set login session
            sessionStorage.setItem("userLoggedIn", "true");
            sessionStorage.setItem("userName", fullName || emailInput.value);
            sessionStorage.setItem("userEmail", emailInput.value);

            // redirect to dashboard
            window.location.href = "/index.html";
        })
        .catch(err => {
            alert("Auth failed. Try again")
            console.error(err)
        });
    })
}