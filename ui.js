/* SAIF DroneNet - UI */

const UI_TRANSLATIONS = {
    ar: {
        noAlerts: "لا توجد تنبيهات",
        patrolling: "في الدورية",
        responding: "يستجيب للحدث",
        stopped: "متوقف",
        ready: "جاهز",

        trafficViolation: "🚗 تم رصد مخالفة مرورية",
        fireDetected: "🔥 تم اكتشاف حريق",
        emergencyDetected: "🚑 تم اكتشاف حالة طارئة",

        droneResponding: "🛸 الدرون يستجيب للحدث",
        droneArrived: "📍 وصل الدرون إلى موقع الحدث",

        cleaning: "🧹 جارٍ تنظيف الدرون...",
        cleaningCompleted: "✅ اكتمل تنظيف الدرون",

        noEvents: "لا توجد أحداث حتى الآن.",
        missionReset: "🔄 تمت إعادة ضبط المهمة. الدرون جاهز.",

        patrolStarted: "🛸 بدأت دورية الدرون.",
        patrolStopped: "⏹ توقفت دورية الدرون.",

        violationResponse:
            "🛸 الدرون يتجه لفحص المخالفة.",

        fireResponse:
            "🛸 الدرون يتجه لفحص الحريق.",

        emergencyResponse:
            "🛸 الدرون يتجه لفحص الحالة الطارئة.",

        lowBattery:
            "⚠️ البطارية منخفضة",

        inspectionStarted:
            "🔎 بدأ فحص الحدث."
    },

    en: {
        noAlerts: "No Alerts",
        patrolling: "Patrolling",
        responding: "Responding to Event",
        stopped: "Stopped",
        ready: "Ready",

        trafficViolation:
            "🚗 Traffic violation detected",

        fireDetected:
            "🔥 Fire detected",

        emergencyDetected:
            "🚑 Emergency detected",

        droneResponding:
            "🛸 Drone responding to event",

        droneArrived:
            "📍 Drone arrived at event location",

        cleaning:
            "🧹 Cleaning in progress...",

        cleaningCompleted:
            "✅ Cleaning completed",

        noEvents:
            "No events yet.",

        missionReset:
            "🔄 Mission reset. Drone ready.",

        patrolStarted:
            "🛸 Drone patrol started.",

        patrolStopped:
            "⏹ Drone patrol stopped.",

        violationResponse:
            "🛸 Drone moving to inspect the violation.",

        fireResponse:
            "🛸 Drone moving to inspect the fire.",

        emergencyResponse:
            "🛸 Drone moving to inspect the emergency.",

        lowBattery:
            "⚠️ Low Battery",

        inspectionStarted:
            "🔎 Event inspection started."
    }
};


/* =========================
   LANGUAGE
========================= */

function getUILanguage() {
    return localStorage.getItem("language") || "ar";
}


function t(key) {

    const language = getUILanguage();

    return UI_TRANSLATIONS[language]?.[key] || key;
}


function applyLanguage() {

    const language = getUILanguage();

    document.documentElement.lang = language;

    document.documentElement.dir =
        language === "ar" ? "rtl" : "ltr";


    document
        .querySelectorAll("[data-ar][data-en]")
        .forEach(element => {

            element.textContent =
                language === "ar"
                    ? element.dataset.ar
                    : element.dataset.en;

        });


    document
        .querySelectorAll(
            "[data-placeholder-ar][data-placeholder-en]"
        )
        .forEach(element => {

            element.placeholder =
                language === "ar"
                    ? element.dataset.placeholderAr
                    : element.dataset.placeholderEn;

        });


    updateThemeButtons();

    updateDynamicLanguage();


    window.dispatchEvent(
        new CustomEvent("languageChanged", {
            detail: {
                language: language
            }
        })
    );
}


function setLanguage(language) {

    if (language !== "ar" && language !== "en") {
        return;
    }

    localStorage.setItem(
        "language",
        language
    );

    applyLanguage();
}


function changeDashboardLanguage(language) {
    setLanguage(language);
}


function getCurrentLanguage() {
    return getUILanguage();
}


function applyDashboardLanguage() {
    applyLanguage();
}


/* =========================
   LOGIN
========================= */

function login() {

    window.location.href = "dashboard.html";

}


/* =========================
   THEME
========================= */

function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );


    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode")
            ? "light"
            : "dark"
    );


    updateThemeButtons();
}


function updateThemeButtons() {

    const dashboardButton =
        document.getElementById(
            "dashboardThemeButton"
        );


    const loginButton =
        document.getElementById(
            "themeButton"
        );


    const isLight =
        document.body.classList.contains(
            "light-mode"
        );


    if (dashboardButton) {

        dashboardButton.textContent =
            isLight ? "🌙" : "☀️";

    }


    if (loginButton) {

        loginButton.textContent =
            isLight
                ? "🌙 داكن"
                : "☀️ فاتح";

    }
}


/* =========================
   DRONE STATUS
========================= */

function translateDroneStatus(status) {

    const statusMap = {

        Patrolling: "patrolling",

        Responding: "responding",

        Stopped: "stopped",

        Ready: "ready"

    };


    return t(
        statusMap[status] || status
    );
}


function setDroneStatus(status) {

    window.currentDroneStatus =
        status;


    const translated =
        translateDroneStatus(status);


    const elements = [

        "statusText",

        "droneStatusPage",

        "tableDroneStatus"

    ];


    elements.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                translated;

        }

    });
}


/* =========================
   EVENT LOG
========================= */

function renderEventLog() {

    const eventLog =
        document.getElementById(
            "eventLog"
        );


    if (!eventLog) {
        return;
    }


    const events =
        window.currentEventLogKeys || [];


    if (!events.length) {

        eventLog.innerHTML =
            t("noEvents");

        return;

    }


    eventLog.innerHTML =
        events
            .map(event => {

                return `
                    <div class="log-entry">
                        ${t(event.key || event)}
                    </div>
                `;

            })
            .join("");
}


function setEventLog(events) {

    window.currentEventLogKeys =
        (Array.isArray(events)
            ? events
            : [events]
        ).map(key => ({
            key: key
        }));


    renderEventLog();
}


function addEventLog(key) {

    if (!window.currentEventLogKeys) {

        window.currentEventLogKeys = [];

    }


    window.currentEventLogKeys.push({
        key: key
    });


    renderEventLog();
}


/* =========================
   DYNAMIC UI
========================= */

function updateDynamicLanguage() {

    const battery =
        window.currentDroneBattery ?? 100;


    const batteryElements = [

        "batteryText",

        "dashboardBattery",

        "droneBatteryPage",

        "tableDroneBattery"

    ];


    batteryElements.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                battery + "%";

        }

    });


    const eventCounter =
        document.getElementById(
            "dashboardEvents"
        );


    if (eventCounter) {

        eventCounter.textContent =
            window.detectedEvents?.length || 0;

    }


    if (window.currentDroneStatus) {

        setDroneStatus(
            window.currentDroneStatus
        );

    }


    const alertElement =
        document.getElementById(
            "alertText"
        );


    if (
        alertElement &&
        window.currentAlertKey
    ) {

        alertElement.textContent =
            t(window.currentAlertKey);

    }


    const maintenance =
        document.getElementById(
            "maintenanceStatus"
        );


    if (
        maintenance &&
        window.currentMaintenanceKey
    ) {

        maintenance.textContent =
            t(window.currentMaintenanceKey);

    }


    const inspection =
        document.getElementById(
            "inspectionStatus"
        );


    if (
        inspection &&
        window.currentInspectionKey
    ) {

        inspection.textContent =
            t(window.currentInspectionKey);

    }


    renderEventLog();


    if (
        typeof window.updateEmergencyPopupLanguage ===
        "function"
    ) {

        window.updateEmergencyPopupLanguage();

    }
}


/* =========================
   EVENT UI
========================= */

function updateUIAfterEvent(
    alertKey,
    responseKey
) {

    window.currentAlertKey =
        alertKey;


    window.currentInspectionKey =
        "inspectionStarted";


    setDroneStatus(
        "Responding"
    );


    setEventLog([

        alertKey,

        responseKey,

        "inspectionStarted"

    ]);


    updateDynamicLanguage();
}


/* =========================
   MAINTENANCE
========================= */

function updateMaintenanceStarting() {

    window.currentMaintenanceKey =
        "cleaning";


    updateDynamicLanguage();
}


function updateMaintenanceCompleted() {

    window.currentMaintenanceKey =
        "cleaningCompleted";


    addEventLog(
        "cleaningCompleted"
    );


    updateDynamicLanguage();
}


/* =========================
   NAVIGATION
========================= */

function showSection(section) {

    document
        .querySelectorAll(".page-section")
        .forEach(page => {

            page.classList.remove(
                "active-section"
            );

        });


    const selected =
        document.getElementById(
            section
        );


    if (selected) {

        selected.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".sidebar-btn")
        .forEach(button => {

            button.classList.toggle(

                "active",

                button.dataset.section ===
                    section

            );

        });


    if (section === "dashboard") {

        setTimeout(() => {

            window.dispatchEvent(
                new Event("resize")
            );

        }, 150);

    }
}


/* =========================
   INITIALIZATION
========================= */

function initializePreferences() {

    if (
        !["ar", "en"].includes(
            localStorage.getItem(
                "language"
            )
        )
    ) {

        localStorage.setItem(
            "language",
            "ar"
        );

    }


    if (
        localStorage.getItem(
            "theme"
        ) === "light"
    ) {

        document.body.classList.add(
            "light-mode"
        );

    }


    applyLanguage();
}


document.addEventListener(
    "DOMContentLoaded",
    initializePreferences
);