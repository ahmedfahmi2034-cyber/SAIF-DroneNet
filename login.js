/* =========================================================
   SAIF DroneNet - Login Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const passwordToggle = document.getElementById("passwordToggle");
    const loginButton = document.getElementById("loginButton");

    /* =====================================================
       LOGIN FORM
       ===================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const username = usernameInput
                ? usernameInput.value.trim()
                : "";

            const password = passwordInput
                ? passwordInput.value.trim()
                : "";

            /* ---------------------------------------------
               Check empty fields
               --------------------------------------------- */

            if (username === "" || password === "") {

                showLoginMessage(
                    "يرجى إدخال اسم المستخدم وكلمة المرور",
                    "Please enter your username and password"
                );

                return;
            }

            /* ---------------------------------------------
               Login button loading state
               --------------------------------------------- */

            if (loginButton) {

                loginButton.disabled = true;

                const language =
                    typeof getUILanguage === "function"
                        ? getUILanguage()
                        : "ar";

                loginButton.textContent =
                    language === "en"
                        ? "Signing in..."
                        : "جارٍ تسجيل الدخول...";
            }

            /* ---------------------------------------------
               Small delay for realistic prototype effect
               --------------------------------------------- */

            setTimeout(function () {

                /*
                 * Prototype login:
                 * No real backend authentication is required.
                 * After login, open the dashboard.
                 */

                if (typeof login === "function") {

                    login();

                } else {

                    window.location.href = "dashboard.html";

                }

            }, 500);
        });
    }


    /* =====================================================
       PASSWORD SHOW / HIDE
       ===================================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener("click", function () {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword ? "text" : "password";

            const language =
                typeof getUILanguage === "function"
                    ? getUILanguage()
                    : "ar";

            if (isPassword) {

                passwordToggle.textContent =
                    language === "en"
                        ? "Hide"
                        : "إخفاء";

            } else {

                passwordToggle.textContent =
                    language === "en"
                        ? "Show"
                        : "إظهار";
            }
        });
    }


    /* =====================================================
       ENTER KEY
       ===================================================== */

    if (usernameInput) {

        usernameInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                if (passwordInput) {
                    passwordInput.focus();
                }
            }
        });
    }


    if (passwordInput) {

        passwordInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                if (loginForm) {
                    loginForm.requestSubmit();
                }
            }
        });
    }


    /* =====================================================
       LOGIN MESSAGE
       ===================================================== */

    function showLoginMessage(arabicMessage, englishMessage) {

        let messageBox =
            document.getElementById("loginMessage");

        if (!messageBox) {

            messageBox = document.createElement("div");

            messageBox.id = "loginMessage";

            messageBox.style.marginTop = "12px";
            messageBox.style.padding = "10px 14px";
            messageBox.style.borderRadius = "10px";
            messageBox.style.textAlign = "center";
            messageBox.style.fontSize = "14px";

            if (loginForm) {
                loginForm.appendChild(messageBox);
            }
        }

        const language =
            typeof getUILanguage === "function"
                ? getUILanguage()
                : "ar";

        messageBox.textContent =
            language === "en"
                ? englishMessage
                : arabicMessage;

        messageBox.style.display = "block";
    }


    /* =====================================================
       REMOVE ERROR WHEN USER STARTS TYPING
       ===================================================== */

    function hideLoginMessage() {

        const messageBox =
            document.getElementById("loginMessage");

        if (messageBox) {
            messageBox.style.display = "none";
        }
    }


    if (usernameInput) {
        usernameInput.addEventListener(
            "input",
            hideLoginMessage
        );
    }

    if (passwordInput) {
        passwordInput.addEventListener(
            "input",
            hideLoginMessage
        );
    }


    /* =====================================================
       LANGUAGE CHANGE
       ===================================================== */

    document.addEventListener(
        "languageChanged",
        function () {

            const messageBox =
                document.getElementById("loginMessage");

            const language =
                typeof getUILanguage === "function"
                    ? getUILanguage()
                    : "ar";

            if (passwordToggle && passwordInput) {

                if (passwordInput.type === "text") {

                    passwordToggle.textContent =
                        language === "en"
                            ? "Hide"
                            : "إخفاء";

                } else {

                    passwordToggle.textContent =
                        language === "en"
                            ? "Show"
                            : "إظهار";
                }
            }

            if (messageBox) {

                messageBox.textContent =
                    language === "en"
                        ? "Please enter your username and password"
                        : "يرجى إدخال اسم المستخدم وكلمة المرور";
            }
        }
    );

});
