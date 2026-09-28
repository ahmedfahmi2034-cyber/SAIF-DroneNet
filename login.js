/* =========================================================
   SAIF DroneNet
   Independent Login Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const html = document.documentElement;
    const body = document.body;

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");

    const loginButton = document.getElementById("loginButton");
    const passwordToggle = document.getElementById("passwordToggle");
    const themeButton = document.getElementById("themeButton");

    const arabicButton = document.querySelector(
        ".language-controls button:first-child"
    );

    const englishButton = document.querySelector(
        ".language-controls button:last-child"
    );


    /* =====================================================
       LANGUAGE
       ===================================================== */

    function setPageLanguage(language) {

        if (language !== "ar" && language !== "en") {
            language = "ar";
        }

        localStorage.setItem("saifLanguage", language);

        html.lang = language;
        html.dir = language === "ar" ? "rtl" : "ltr";

        /* Translate normal elements */

        const elements = document.querySelectorAll(
            "[data-ar][data-en]"
        );

        elements.forEach(function (element) {

            element.textContent =
                language === "ar"
                    ? element.getAttribute("data-ar")
                    : element.getAttribute("data-en");
        });


        /* Translate placeholders */

        const inputs = document.querySelectorAll(
            "[data-placeholder-ar][data-placeholder-en]"
        );

        inputs.forEach(function (input) {

            input.placeholder =
                language === "ar"
                    ? input.getAttribute("data-placeholder-ar")
                    : input.getAttribute("data-placeholder-en");
        });


        /* Password button */

        if (passwordToggle) {

            const showing =
                passwordInput &&
                passwordInput.type === "text";

            passwordToggle.textContent =
                showing
                    ? (language === "ar" ? "إخفاء" : "Hide")
                    : (language === "ar" ? "إظهار" : "Show");
        }


        /* Login button */

        if (loginButton && !loginButton.disabled) {

            const buttonText =
                loginButton.querySelector("span");

            if (buttonText) {

                buttonText.textContent =
                    language === "ar"
                        ? "تسجيل الدخول"
                        : "Sign In";
            }
        }
    }


    /* =====================================================
       LANGUAGE BUTTONS
       ===================================================== */

    if (arabicButton) {

        arabicButton.addEventListener("click", function () {
            setPageLanguage("ar");
        });
    }


    if (englishButton) {

        englishButton.addEventListener("click", function () {
            setPageLanguage("en");
        });
    }


    /* Also make functions globally available */

    window.setLanguage = setPageLanguage;
    window.changeDashboardLanguage = setPageLanguage;


    /* =====================================================
       DARK / LIGHT MODE
       ===================================================== */

    function updateThemeButton() {

        if (!themeButton) {
            return;
        }

        const lightMode =
            body.classList.contains("light-mode");

        themeButton.textContent =
            lightMode ? "☀️" : "🌙";

        themeButton.title =
            lightMode
                ? "الوضع الداكن"
                : "الوضع الفاتح";
    }


    function setTheme(theme) {

        if (theme === "light") {

            body.classList.add("light-mode");

            localStorage.setItem(
                "saifTheme",
                "light"
            );

        } else {

            body.classList.remove("light-mode");

            localStorage.setItem(
                "saifTheme",
                "dark"
            );
        }

        updateThemeButton();
    }


    function toggleTheme() {

        const isLight =
            body.classList.contains("light-mode");

        setTheme(
            isLight ? "dark" : "light"
        );
    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            toggleTheme
        );
    }


    window.toggleTheme = toggleTheme;


    /* =====================================================
       PASSWORD SHOW / HIDE
       ===================================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            function () {

                const language =
                    localStorage.getItem("saifLanguage") || "ar";

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    passwordToggle.textContent =
                        language === "ar"
                            ? "إخفاء"
                            : "Hide";

                } else {

                    passwordInput.type = "password";

                    passwordToggle.textContent =
                        language === "ar"
                            ? "إظهار"
                            : "Show";
                }
            }
        );
    }


    /* =====================================================
       LOGIN
       ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const username =
                    usernameInput
                        ? usernameInput.value.trim()
                        : "";

                const password =
                    passwordInput
                        ? passwordInput.value.trim()
                        : "";


                /* Empty fields */

                if (!username || !password) {

                    showMessage();

                    return;
                }


                /* Button loading */

                if (loginButton) {

                    loginButton.disabled = true;

                    const language =
                        localStorage.getItem("saifLanguage") || "ar";

                    const buttonText =
                        loginButton.querySelector("span");

                    if (buttonText) {

                        buttonText.textContent =
                            language === "ar"
                                ? "جارٍ الدخول..."
                                : "Signing in...";
                    }
                }


                /*
                 * Give the browser a moment to show
                 * the loading state.
                 */

                setTimeout(function () {

                    /*
                     * IMPORTANT:
                     * Relative path works on GitHub Pages.
                     */

                    window.location.href =
                        "./dashboard.html";

                }, 500);
            }
        );
    }


    /* =====================================================
       LOGIN MESSAGE
       ===================================================== */

    function showMessage() {

        let message =
            document.getElementById("loginMessage");


        if (!message) {

            message =
                document.createElement("div");

            message.id = "loginMessage";

            message.style.marginTop = "12px";

            message.style.padding = "10px";

            message.style.borderRadius = "10px";

            message.style.textAlign = "center";

            message.style.fontSize = "13px";

            if (loginForm) {
                loginForm.appendChild(message);
            }
        }


        const language =
            localStorage.getItem("saifLanguage") || "ar";


        message.textContent =
            language === "ar"
                ? "يرجى إدخال اسم المستخدم وكلمة المرور"
                : "Please enter your username and password";

        message.style.display = "block";
    }


    /* Hide message while typing */

    function hideMessage() {

        const message =
            document.getElementById("loginMessage");

        if (message) {
            message.style.display = "none";
        }
    }


    if (usernameInput) {
        usernameInput.addEventListener(
            "input",
            hideMessage
        );
    }


    if (passwordInput) {
        passwordInput.addEventListener(
            "input",
            hideMessage
        );
    }


    /* =====================================================
       ENTER KEY
       ===================================================== */

    if (usernameInput) {

        usernameInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    if (passwordInput) {
                        passwordInput.focus();
                    }
                }
            }
        );
    }


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    if (loginForm) {
                        loginForm.requestSubmit();
                    }
                }
            }
        );
    }


    /* =====================================================
       LOAD SAVED SETTINGS
       ===================================================== */

    const savedLanguage =
        localStorage.getItem("saifLanguage") || "ar";

    const savedTheme =
        localStorage.getItem("saifTheme") || "dark";


    setPageLanguage(savedLanguage);

    setTheme(savedTheme);

});
