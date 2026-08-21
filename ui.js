/* =====================================================
   SAIF DRONENET - UI LANGUAGE SYSTEM
===================================================== */


/* =========================================
   GET CURRENT LANGUAGE
========================================= */

function getUILanguage() {

    return localStorage.getItem("language") || "ar";

}


/* =========================================
   TRANSLATIONS
========================================= */

const UI_TRANSLATIONS = {

    ar: {

        /* General */

        noAlerts:
            "لا توجد تنبيهات",

        patrolling:
            "في الدورية",

        responding:
            "يستجيب للطوارئ",

        stopped:
            "متوقف",

        ready:
            "جاهز",


        /* Emergency */

        trafficAccident:
            "🚨 تم اكتشاف حادث مروري",

        droneResponding:
            "🛸 الدرون يستجيب لحالة الطوارئ",

        droneArrived:
            "📍 وصل الدرون إلى موقع الطوارئ",


        /* Maintenance */

        cleaning:
            "🧹 جارٍ تنظيف الدرون...",

        cleaningCompleted:
            "✅ اكتمل تنظيف الدرون",


        /* Events */

        noEvents:
            "لا توجد أحداث حتى الآن.",

        missionReset:
            "🔄 تمت إعادة ضبط المهمة. الدرون جاهز.",

        patrolStarted:
            "🛸 بدأت دورية الدرون.",

        patrolStopped:
            "⏹ توقفت دورية الدرون.",


        /* Emergency Event */

        emergencyDetected:
            "🚨 تم اكتشاف حادث مروري.",

        emergencyResponse:
            "🛸 الدرون يستجيب لحالة الطوارئ.",

        emergencyArrived:
            "📍 وصل الدرون إلى موقع الطوارئ."


    },


    en: {

        /* General */

        noAlerts:
            "No Alerts",

        patrolling:
            "Patrolling",

        responding:
            "Responding",

        stopped:
            "Stopped",

        ready:
            "Ready",


        /* Emergency */

        trafficAccident:
            "🚨 Traffic Accident Detected",

        droneResponding:
            "🛸 Drone responding to emergency",

        droneArrived:
            "📍 Drone arrived at emergency location",


        /* Maintenance */

        cleaning:
            "🧹 Cleaning in progress...",

        cleaningCompleted:
            "✅ Cleaning completed",


        /* Events */

        noEvents:
            "No events yet.",

        missionReset:
            "🔄 Mission reset. Drone ready.",

        patrolStarted:
            "🛸 Drone patrol started.",

        patrolStopped:
            "⏹ Drone patrol stopped.",


        /* Emergency Event */

        emergencyDetected:
            "🚨 Traffic accident detected.",

        emergencyResponse:
            "🛸 Drone responding to emergency.",

        emergencyArrived:
            "📍 Drone arrived at emergency location."

    }

};


/* =========================================
   TRANSLATION HELPER
========================================= */

function t(key) {

    const language =
        getUILanguage();

    return UI_TRANSLATIONS[language][key];

}


/* =========================================
   UPDATE DYNAMIC TEXT
========================================= */

function updateDynamicLanguage() {

    const language =
        getUILanguage();


    /*
       Battery
    */

    const battery =
        window.currentDroneBattery !== undefined
            ? window.currentDroneBattery
            : 100;


    const batteryText =
        document.getElementById(
            "batteryText"
        );

    if (batteryText) {

        batteryText.textContent =
            battery + "%";

    }


    const cardBattery =
        document.getElementById(
            "cardBattery"
        );

    if (cardBattery) {

        cardBattery.textContent =
            battery + "%";

    }


    const dashboardBattery =
        document.getElementById(
            "dashboardBattery"
        );

    if (dashboardBattery) {

        dashboardBattery.textContent =
            battery + "%";

    }


    const droneBatteryPage =
        document.getElementById(
            "droneBatteryPage"
        );

    if (droneBatteryPage) {

        droneBatteryPage.textContent =
            battery + "%";

    }


    const tableBattery =
        document.getElementById(
            "tableDroneBattery"
        );

    if (tableBattery) {

        tableBattery.textContent =
            battery + "%";

    }


    /*
       Status
    */

    if (
        window.currentDroneStatus
    ) {

        setDroneStatus(
            window.currentDroneStatus
        );

    }


}


/* =========================================
   DRONE STATUS
========================================= */

function translateDroneStatus(status) {

    const language =
        getUILanguage();


    if (status === "Patrolling") {

        return t("patrolling");

    }


    if (status === "Responding") {

        return t("responding");

    }


    if (status === "Stopped") {

        return t("stopped");

    }


    if (status === "Ready") {

        return t("ready");

    }


    return status;

}


/* =========================================
   SET DRONE STATUS
========================================= */

function setDroneStatus(status) {

    window.currentDroneStatus =
        status;


    const translated =
        translateDroneStatus(
            status
        );


    const statusText =
        document.getElementById(
            "statusText"
        );

    if (statusText) {

        statusText.textContent =
            translated;

    }


    const cardStatus =
        document.getElementById(
            "cardStatus"
        );

    if (cardStatus) {

        cardStatus.textContent =
            translated;

    }


    const droneStatusPage =
        document.getElementById(
            "droneStatusPage"
        );

    if (droneStatusPage) {

        droneStatusPage.textContent =
            translated;

    }


    const tableStatus =
        document.getElementById(
            "tableDroneStatus"
        );

    if (tableStatus) {

        tableStatus.textContent =
            translated;

    }

}


/* =========================================
   UPDATE EMERGENCY UI
========================================= */

function updateUIAfterEmergency() {

    const alertText =
        document.getElementById(
            "alertText"
        );


    if (alertText) {

        alertText.textContent =
            t("trafficAccident");

    }


    setDroneStatus(
        "Responding"
    );


    const batteryText =
        document.getElementById(
            "batteryText"
        );


    if (batteryText) {

        batteryText.textContent =
            "95%";

    }


    const dashboardBattery =
        document.getElementById(
            "dashboardBattery"
        );


    if (dashboardBattery) {

        dashboardBattery.textContent =
            "95%";

    }


    const eventLog =
        document.getElementById(
            "eventLog"
        );


    if (eventLog) {

        eventLog.innerHTML =

            t("emergencyDetected") +
            "<br>" +

            t("emergencyResponse") +
            "<br>" +

            t("emergencyArrived");

    }

}


/* =========================================
   MAINTENANCE
========================================= */

function updateMaintenanceStarting() {

    const status =
        document.getElementById(
            "maintenanceStatus"
        );


    if (status) {

        status.textContent =
            t("cleaning");

    }

}


function updateMaintenanceCompleted() {

    const status =
        document.getElementById(
            "maintenanceStatus"
        );


    if (status) {

        status.textContent =
            t("cleaningCompleted");

    }


    const eventLog =
        document.getElementById(
            "eventLog"
        );


    if (eventLog) {

        eventLog.innerHTML +=

            "<br>" +
            t("cleaningCompleted");

    }

}


/* =========================================
   REFRESH LANGUAGE AFTER CHANGE
========================================= */

window.addEventListener(
    "languageChanged",
    function () {

        updateDynamicLanguage();

    }
);


/* =========================================
   INITIALIZATION
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        window.currentDroneBattery =
            100;

        window.currentDroneStatus =
            "Patrolling";


        updateDynamicLanguage();

    }
);