// =====================================================
// SAIF DRONENET - MAIN DASHBOARD LOGIC
// =====================================================


// نتأكد أننا داخل صفحة الـ Dashboard
const mapElement = document.getElementById("map");

if (mapElement) {

    // =================================================
    // MAP
    // =================================================

    const map = L.map("map").setView(
        [24.7136, 46.6753],
        15
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(map);


    // =================================================
    // DRONE
    // =================================================

    const drone = L.marker(
        [24.7136, 46.6753]
    ).addTo(map);


    // =================================================
    // PATROL PATH
    // =================================================

    const patrolPath = [

        [24.7136, 46.6753],
        [24.7140, 46.6765],
        [24.7148, 46.6775],
        [24.7155, 46.6768],
        [24.7150, 46.6752],
        [24.7142, 46.6745]

    ];


    let patrolIndex = 0;

    let patrolInterval = null;

    let battery = 100;


    window.currentDroneBattery = battery;
    window.currentDroneStatus = "Patrolling";


    // =================================================
    // BATTERY
    // =================================================

    function updateBattery() {

        window.currentDroneBattery = battery;


        const ids = [
            "batteryText",
            "cardBattery",
            "dashboardBattery",
            "droneBatteryPage",
            "tableDroneBattery"
        ];


        ids.forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.textContent =
                    battery + "%";

            }

        });


        const batteryBar =
            document.getElementById(
                "droneBatteryBar"
            );

        if (batteryBar) {

            batteryBar.style.width =
                battery + "%";

        }

    }


    // =================================================
    // EVENT LOG
    // =================================================

    function setEventLog(text) {

        const eventLog =
            document.getElementById(
                "eventLog"
            );

        if (eventLog) {

            eventLog.innerHTML =
                text;

        }

    }


    function addEventLog(text) {

        const eventLog =
            document.getElementById(
                "eventLog"
            );

        if (eventLog) {

            eventLog.innerHTML +=
                "<br>" + text;

        }

    }


    // =================================================
    // START PATROL
    // =================================================

    function startPatrol() {

        setDroneStatus(
            "Patrolling"
        );


        if (patrolInterval) {
            return;
        }


        setEventLog(
            t("patrolStarted")
        );


        patrolInterval =
            setInterval(() => {

                drone.setLatLng(
                    patrolPath[
                        patrolIndex
                    ]
                );


                map.panTo(
                    patrolPath[
                        patrolIndex
                    ]
                );


                patrolIndex =
                    (
                        patrolIndex + 1
                    ) %
                    patrolPath.length;


                battery =
                    Math.max(
                        0,
                        battery - 1
                    );


                updateBattery();


                if (battery <= 20) {

                    const alertText =
                        document.getElementById(
                            "alertText"
                        );


                    if (alertText) {

                        alertText.textContent =
                            getUILanguage() === "ar"
                                ? "⚠️ البطارية منخفضة"
                                : "⚠️ Low Battery";

                    }

                }

            }, 2000);

    }


    // =================================================
    // STOP PATROL
    // =================================================

    function stopPatrol() {

        if (patrolInterval) {

            clearInterval(
                patrolInterval
            );

            patrolInterval = null;

        }


        addEventLog(
            t("patrolStopped")
        );

    }


    // =================================================
    // EMERGENCY
    // =================================================

    const emergencyLocation = [
        24.7165,
        46.6795
    ];


    let emergencyMarker = null;


    function simulateEmergency() {

        stopPatrol();


        setDroneStatus(
            "Responding"
        );


        if (!emergencyMarker) {

            emergencyMarker =
                L.marker(
                    emergencyLocation
                )
                .addTo(map)
                .bindPopup(
                    getUILanguage() === "ar"
                        ? "🚨 حادث مروري"
                        : "🚨 Traffic Accident"
                );

        }


        emergencyMarker.openPopup();


        drone.setLatLng(
            emergencyLocation
        );


        map.panTo(
            emergencyLocation
        );


        battery = 95;

        updateBattery();


        updateUIAfterEmergency();

    }


    // =================================================
    // MAINTENANCE
    // =================================================

    function startMaintenance() {

        updateMaintenanceStarting();


        addEventLog(
            getUILanguage() === "ar"
                ? "🧹 بدأت عملية تنظيف الدرون."
                : "🧹 Drone cleaning started."
        );


        setTimeout(() => {

            updateMaintenanceCompleted();

        }, 3000);

    }


    // =================================================
    // RESET MISSION
    // =================================================

    function resetMission() {

        if (patrolInterval) {

            clearInterval(
                patrolInterval
            );

            patrolInterval = null;

        }


        patrolIndex = 0;

        battery = 100;


        window.currentDroneBattery =
            battery;


        drone.setLatLng(
            patrolPath[0]
        );


        map.panTo(
            patrolPath[0]
        );


        updateBattery();


        setDroneStatus(
            "Patrolling"
        );


        const alertText =
            document.getElementById(
                "alertText"
            );


        if (alertText) {

            alertText.textContent =
                t("noAlerts");

        }


        const maintenanceStatus =
            document.getElementById(
                "maintenanceStatus"
            );


        if (maintenanceStatus) {

            maintenanceStatus.textContent =
                t("ready");

        }


        setEventLog(
            t("missionReset")
        );


        if (emergencyMarker) {

            map.removeLayer(
                emergencyMarker
            );

            emergencyMarker = null;

        }

    }


    // =================================================
    // BUTTONS
    // =================================================

    const startButton =
        document.getElementById(
            "startPatrolBtn"
        );

    const stopButton =
        document.getElementById(
            "stopPatrolBtn"
        );

    const emergencyButton =
        document.getElementById(
            "emergencyBtn"
        );

    const maintenanceButton =
        document.getElementById(
            "maintenanceBtn"
        );

    const resetButton =
        document.getElementById(
            "resetBtn"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            startPatrol
        );

    }


    if (stopButton) {

        stopButton.addEventListener(
            "click",
            stopPatrol
        );

    }


    if (emergencyButton) {

        emergencyButton.addEventListener(
            "click",
            simulateEmergency
        );

    }


    if (maintenanceButton) {

        maintenanceButton.addEventListener(
            "click",
            startMaintenance
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetMission
        );

    }


    // =================================================
    // LANGUAGE CHANGE SYNC
    // =================================================

    window.addEventListener(
        "languageChanged",
        function () {

            updateDynamicLanguage();

        }
    );


    // =================================================
    // INITIAL STATE
    // =================================================

    updateBattery();

    setDroneStatus(
        "Patrolling"
    );

}