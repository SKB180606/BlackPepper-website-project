// ==========================================
// BLACKPEPPER ADMIN LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const togglePassword = document.getElementById("togglePassword");


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }
    });
}


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginError.textContent = "";


    // --------------------------------------
    // BASIC VALIDATION
    // --------------------------------------

    if (!email || !password) {

        loginError.textContent =
            "Please enter your email and password.";

        return;
    }


    // --------------------------------------
    // GET hCAPTCHA TOKEN
    // (hcaptcha.render() must have created the
    // widget on this page already, e.g. via a
    // <div class="h-captcha" data-sitekey="..."></div>
    // and the hCaptcha script tag in your HTML)
    // --------------------------------------

    let captchaToken = "";

    if (typeof hcaptcha !== "undefined") {

        captchaToken = hcaptcha.getResponse();

        if (!captchaToken) {

            loginError.textContent =
                "Please complete the CAPTCHA before signing in.";

            return;
        }

    } else {

        loginError.textContent =
            "CAPTCHA failed to load. Please refresh the page.";

        return;
    }


    // --------------------------------------
    // CONNECT TO BACKEND
    // --------------------------------------

    try {

        const response = await fetch(
            "https://blackpepper-backend-production.up.railway.app/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password,
                    captchaToken: captchaToken
                })
            }
        );


        const data = await response.json();


        // ----------------------------------
        // LOGIN FAILED
        // ----------------------------------

        if (!response.ok || !data.success) {

            loginError.textContent =
                data.message ||
                "Invalid email or password.";

            // Reset the widget so the user can try again —
            // hCaptcha tokens are single-use.
            if (typeof hcaptcha !== "undefined") {
                hcaptcha.reset();
            }

            return;
        }


        // ----------------------------------
        // ADMIN ACCESS CHECK
        // ----------------------------------

        if (data.user.role !== "ADMIN") {

            loginError.textContent =
                "Access denied. Only authorized administrators can access the dashboard.";

            return;
        }


        // ----------------------------------
        // SAVE AUTHENTICATION DATA
        // ----------------------------------

        sessionStorage.setItem(
            "blackpepperAuth",
            "admin"
        );

        sessionStorage.setItem(
            "bpRole",
            "admin"
        );

        sessionStorage.setItem(
            "bpToken",
            data.token
        );

        sessionStorage.setItem(
            "bpUser",
            JSON.stringify(data.user)
        );


        // ----------------------------------
        // GO TO DASHBOARD
        // ----------------------------------

        window.location.href =
            "dashboard.html";

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        loginError.textContent =
            "Unable to connect to the server. Make sure the backend is running.";
    }

});