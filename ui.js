/* =========================================================
   SAIF DroneNet - UI Controller
   ========================================================= */

const UI_TRANSLATIONS = {

    ar: {
        noAlerts: "لا توجد تنبيهات",
        patrolling: "في الدورية",
        responding: "يستجيب للحالة",
        stopped: "متوقف",
        ready: "جاهز",

        trafficViolation: "مخالفة مرورية",
        fire: "حريق مكتشف",
        emergency: "حالة طوارئ",

        droneResponding: "الدرون يتجه إلى موقع الحالة",
        droneArrived: "تم الوصول إلى موقع الحالة",

        cleaning: "جاري التنظيف...",
        cleaningCompleted: "اكتمل التنظيف",

        noEvents: "لا توجد أحداث حتى الآن.",
        missionReset: "تمت إعادة ضبط المهمة",
        patrolStarted: "بدأت الدورية",
        patrolStopped: "تم إيقاف الدورية",

        violationResponse: "تم إرسال الدرون لمتابعة المخالفة",
        fireResponse: "تم إرسال الدرون للتحقق من الحريق",
        emergencyResponse: "تم إرسال الدرون للاستجابة للطوارئ",

        lowBattery: "البطارية منخفضة - تم إيقاف الدورية",
        inspectionStarted: "جاري الفحص..."
    },

    en: {
        noAlerts: "No alerts",
        patrolling: "Patrolling",
        responding: "Responding",
        stopped: "Stopped",
        ready: "Ready",

        trafficViolation: "Traffic Violation",
        fire: "Fire Detected",
        emergency: "Emergency",

        droneResponding: "Drone responding to event",
        droneArrived: "Emergency location reached",

        cleaning: "Cleaning...",
        cleaningCompleted: "Cleaning completed",

        noEvents: "No events yet.",
        missionReset: "Mission reset",
        patrolStarted: "Patrol started",
        patrolStopped: "Patrol stopped",

        violationResponse: "Drone dispatched to traffic violation",
        fireResponse: "Drone dispatched to inspect fire",
        emergencyResponse: "Drone dispatched for emergency",

        lowBattery: "Low battery - patrol stopped",
        inspectionStarted: "Inspection in progress..."
    }
};


/* =========================================================
   Language
   ========================================================= */

function getUILanguage() {
    return localStorage.getItem("uiLanguage") || "ar";
}

function setLanguage(lang) {

    if (lang !== "ar" && lang !== "en") {
        lang = "ar";
    }

    localStorage.setItem("uiLanguage", lang);

    applyLanguage();
}

function changeDashboardLanguage(lang) {
    setLanguage(lang);
}

function getCurrentLanguage() {
    return getUILanguage();
}

function t(key) {

    const lang = getUILanguage();

    return (
        UI_TRANSLATIONS[lang]?.[key] ||
        UI_TRANSLATIONS.ar[key] ||
        key
    );
}


function applyLanguage() {

    const lang = getUILanguage();

    const html = document.documentElement;

    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";


    document
        .querySelectorAll("[data-ar][data-en]")
        .forEach(element => {

            const text =
                lang === "ar"
                    ? element.getAttribute("data-ar")
                    : element.getAttribute("data-en");

            if (text !== null) {
                element.textContent = text;
            }

        });


    document
        .querySelectorAll("[data-placeholder-ar][data-placeholder-en]")
        .forEach(element => {

            const text =
                lang === "ar"
                    ? element.getAttribute("data-placeholder-ar")
                    : element.getAttribute("data-placeholder-en");

            element.placeholder = text;

        });


    updateThemeButtons();
    updateDynamicLanguage();

    document.dispatchEvent(
        new CustomEvent("languageChanged")
    );
}


/* =========================================================
   Theme
   ========================================================= */

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    const theme =
        document.body.classList.contains("light-mode")
            ? "light"
            : "dark";

    localStorage.setItem("theme", theme);

    updateThemeButtons();
}


function updateThemeButtons() {

    const theme =
        localStorage.getItem("theme") || "dark";

    const buttons = [
        document.getElementById("themeButton"),
        document.getElementById("dashboardThemeButton")
    ];

    buttons.forEach(button => {

        if (!button) {
            return;
        }

        button.textContent =
            theme === "dark"
                ? "☀️"
                : "🌙";

    });
}


/* =========================================================
   Sections Navigation
   ========================================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");

    const buttons =
        document.querySelectorAll(".sidebar-btn");


    sections.forEach(section => {

        section.classList.remove(
            "active",
            "active-section"
        );

    });


    buttons.forEach(button => {
        button.classList.remove("active");
    });


    const selectedSection =
        document.getElementById(sectionId);


    if (!selectedSection) {

        console.warn(
            "Section not found:",
            sectionId
        );

        return;
    }


    selectedSection.classList.add(
        "active",
        "active-section"
    );


    buttons.forEach(button => {

        const onclick =
            button.getAttribute("onclick");

        if (
            onclick &&
            onclick.includes(
                `showSection('${sectionId}')`
            )
        ) {
            button.classList.add("active");
        }

    });


    /* Leaflet needs this when its container
       was hidden while the map was created. */

    if (
        sectionId === "dashboard" &&
        typeof window.refreshMapSize === "function"
    ) {

        setTimeout(() => {

            window.refreshMapSize();

        }, 150);

    }

}


/* =========================================================
   Drone Status
   ========================================================= */

function translateDroneStatus(status) {

    switch (status) {

        case "Patrolling":
            return t("patrolling");

        case "Responding":
            return t("responding");

        case "Stopped":
            return t("stopped");

        default:
            return status;
    }
}


function setDroneStatus(status) {

    window.currentDroneStatus = status;


    const translated =
        translateDroneStatus(status);


    const statusText =
        document.getElementById("statusText");

    const droneStatusPage =
        document.getElementById("droneStatusPage");

    const tableDroneStatus =
        document.getElementById("tableDroneStatus");


    if (statusText) {
        statusText.textContent = translated;
    }

    if (droneStatusPage) {
        droneStatusPage.textContent = translated;
    }

    if (tableDroneStatus) {
        tableDroneStatus.textContent = translated;
    }
}


/* =========================================================
   Event Log
   ========================================================= */

function renderEventLog() {

    const eventLog =
        document.getElementById("eventLog");

    if (!eventLog) {
        return;
    }


    const events =
        window.detectedEvents || [];


    if (events.length === 0) {

        eventLog.innerHTML =
            `<div>${t("noEvents")}</div>`;

        return;
    }


    eventLog.innerHTML =
        events
            .slice()
            .reverse()
            .map(event => {

                return `
                    <div>
                        <strong>${event.name}</strong>
                        <br>
                        <small>${event.time}</small>
                    </div>
                `;

            })
            .join("");
}


function setEventLog(message) {

    const eventLog =
        document.getElementById("eventLog");

    if (!eventLog) {
        return;
    }

    eventLog.innerHTML =
        `<div>${message}</div>`;
}


function addEventLog(message) {

    const eventLog =
        document.getElementById("eventLog");

    if (!eventLog) {
        return;
    }


    const current =
        eventLog.innerHTML.trim();


    if (
        current === "" ||
        current.includes(t("noEvents"))
    ) {
        eventLog.innerHTML = "";
    }


    const row =
        document.createElement("div");

    row.textContent =
        `${new Date().toLocaleTimeString()} — ${message}`;


    eventLog.appendChild(row);

    eventLog.scrollTop =
        eventLog.scrollHeight;
}


/* =========================================================
   Dynamic UI
   ========================================================= */

function updateDynamicLanguage() {

    if (
        typeof window.currentDroneStatus !==
        "undefined"
    ) {
        setDroneStatus(
            window.currentDroneStatus
        );
    }


    const alertText =
        document.getElementById("alertText");

    if (alertText) {

        alertText.textContent =
            window.currentAlertKey
                ? t(window.currentAlertKey)
                : t("noAlerts");

    }


    const maintenanceStatus =
        document.getElementById("maintenanceStatus");

    if (maintenanceStatus) {

        maintenanceStatus.textContent =
            window.currentMaintenanceKey
                ? t(window.currentMaintenanceKey)
                : t("ready");

    }


    const inspectionStatus =
        document.getElementById("inspectionStatus");

    if (inspectionStatus) {

        inspectionStatus.textContent =
            window.currentInspectionKey
                ? t(window.currentInspectionKey)
                : t("ready");

    }


    if (
        Array.isArray(window.detectedEvents)
    ) {
        renderEventLog();
    }

}


function updateUIAfterEvent(type) {

    window.currentAlertKey = type;

    window.currentInspectionKey =
        "inspectionStarted";


    const alertText =
        document.getElementById("alertText");

    if (alertText) {
        alertText.textContent = t(type);
    }


    const inspectionStatus =
        document.getElementById("inspectionStatus");

    if (inspectionStatus) {
        inspectionStatus.textContent =
            t("inspectionStarted");
    }


    if (type === "trafficViolation") {

        addEventLog(
            t("violationResponse")
        );

    }

    if (type === "fire") {

        addEventLog(
            t("fireResponse")
        );

    }

    if (type === "emergency") {

        addEventLog(
            t("emergencyResponse")
        );

    }

}


/* =========================================================
   Maintenance
   ========================================================= */

function updateMaintenanceStarting() {

    window.currentMaintenanceKey =
        "cleaning";


    const status =
        document.getElementById(
            "maintenanceStatus"
        );

    if (status) {
        status.textContent =
            t("cleaning");
    }


    addEventLog(
        t("cleaning")
    );
}


function updateMaintenanceCompleted() {

    window.currentMaintenanceKey =
        "cleaningCompleted";


    const status =
        document.getElementById(
            "maintenanceStatus"
        );

    if (status) {
        status.textContent =
            t("cleaningCompleted");
    }


    addEventLog(
        t("cleaningCompleted")
    );
}


/* =========================================================
   Login Compatibility
   ========================================================= */

function login() {

    window.location.href =
        "dashboard.html";
}


/* =========================================================
   Preferences
   ========================================================= */

function initializePreferences() {

    const savedTheme =
        localStorage.getItem("theme") ||
        "dark";


    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }


    if (
        !localStorage.getItem("uiLanguage")
    ) {
        localStorage.setItem(
            "uiLanguage",
            "ar"
        );
    }


    applyLanguage();
}


/* =========================================================
   Start
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePreferences();


        /* Make sure dashboard is visible
           when page opens. */

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (dashboard) {

            const hasVisibleSection =
                Array.from(
                    document.querySelectorAll(
                        ".page-section"
                    )
                ).some(section =>
                    section.classList.contains(
                        "active-section"
                    ) ||
                    section.classList.contains(
                        "active"
                    )
                );


            if (!hasVisibleSection) {

                showSection(
                    "dashboard"
                );

            }
        }

    }
);
