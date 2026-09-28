/* SAIF DroneNet - Simulation Engine */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const mapElement =
            document.getElementById("map");


        if (
            !mapElement ||
            typeof L === "undefined"
        ) {

            return;

        }


        /* =========================
           MAP
        ========================= */

        const map =
            L.map("map").setView(
                [24.7136, 46.6753],
                15
            );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap"
            }
        ).addTo(map);


        /* =========================
           DRONE
        ========================= */

        const drone =
            L.marker(
                [24.7136, 46.6753]
            ).addTo(map);


        /* =========================
           PATROL PATH
        ========================= */

        const patrolPath = [

            [24.7136, 46.6753],

            [24.7140, 46.6765],

            [24.7148, 46.6775],

            [24.7155, 46.6768],

            [24.7150, 46.6752],

            [24.7142, 46.6745]

        ];


        /* =========================
           EVENT LOCATIONS
        ========================= */

        const eventLocations = {

            trafficViolation:
                [24.7160, 46.6780],

            fire:
                [24.7172, 46.6810],

            emergency:
                [24.7165, 46.6795]

        };


        /* =========================
           VARIABLES
        ========================= */

        let pathIndex = 0;

        let patrolTimer = null;

        let responseTimer = null;

        let maintenanceTimer = null;

        let battery = 100;

        let eventMarker = null;


        window.detectedEvents = [];

        window.currentDroneBattery = 100;

        window.currentDroneStatus =
            "Patrolling";

        window.currentAlertKey =
            "noAlerts";

        window.currentMaintenanceKey =
            "ready";

        window.currentInspectionKey =
            "ready";


        /* =========================
           BATTERY UI
        ========================= */

        function updateBatteryUI() {

            battery =
                Math.max(
                    0,
                    Math.min(
                        100,
                        battery
                    )
                );


            window.currentDroneBattery =
                battery;


            const batteryElements = [

                "batteryText",

                "dashboardBattery",

                "droneBatteryPage",

                "tableDroneBattery"

            ];


            batteryElements.forEach(id => {

                const element =
                    document.getElementById(
                        id
                    );


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


                batteryBar.classList.toggle(
                    "battery-medium",
                    battery > 20 &&
                    battery <= 50
                );


                batteryBar.classList.toggle(
                    "battery-low",
                    battery <= 20
                );

            }
        }


        /* =========================
           REPORT COUNTERS
        ========================= */

        function updateReportCounters() {

            const counters = [

                [
                    "reportViolations",
                    "trafficViolation"
                ],

                [
                    "reportFires",
                    "fire"
                ],

                [
                    "reportEmergencies",
                    "emergency"
                ]

            ];


            counters.forEach(
                ([elementId, type]) => {

                    const element =
                        document.getElementById(
                            elementId
                        );


                    if (element) {

                        element.textContent =
                            window.detectedEvents
                                .filter(
                                    event =>
                                        event.type ===
                                        type
                                )
                                .length;

                    }

                }
            );
        }


        /* =========================
           START PATROL
        ========================= */

        function startPatrol() {

            if (
                patrolTimer ||
                battery <= 0
            ) {

                if (battery <= 0) {

                    window.currentAlertKey =
                        "lowBattery";

                    updateDynamicLanguage();

                }

                return;

            }


            setDroneStatus(
                "Patrolling"
            );


            window.currentAlertKey =
                "noAlerts";


            window.currentInspectionKey =
                "ready";


            setEventLog([
                "patrolStarted"
            ]);


            patrolTimer =
                setInterval(
                    () => {

                        drone.setLatLng(
                            patrolPath[
                                pathIndex
                            ]
                        );


                        pathIndex =
                            (
                                pathIndex + 1
                            ) %
                            patrolPath.length;


                        map.panTo(
                            drone.getLatLng(),
                            {
                                animate: true,
                                duration: 0.4
                            }
                        );


                        battery--;

                        updateBatteryUI();


                        if (
                            battery <= 20
                        ) {

                            window.currentAlertKey =
                                "lowBattery";

                        }


                        if (
                            battery <= 0
                        ) {

                            stopPatrol(
                                true
                            );

                        }


                        updateDynamicLanguage();

                    },
                    2000
                );
        }


        /* =========================
           STOP PATROL
        ========================= */

        function stopPatrol(
            updateStatus = true
        ) {

            if (patrolTimer) {

                clearInterval(
                    patrolTimer
                );

                patrolTimer = null;

            }


            if (updateStatus) {

                setDroneStatus(
                    "Stopped"
                );


                setEventLog([
                    "patrolStopped"
                ]);


                updateDynamicLanguage();

            }
        }


        /* =========================
           EVENT RESPONSE
        ========================= */

        function respondToEvent(
            type
        ) {

            stopPatrol(false);


            if (responseTimer) {

                clearTimeout(
                    responseTimer
                );

            }


            const alertKeys = {

                trafficViolation:
                    "trafficViolation",

                fire:
                    "fireDetected",

                emergency:
                    "emergencyDetected"

            };


            const responseKeys = {

                trafficViolation:
                    "violationResponse",

                fire:
                    "fireResponse",

                emergency:
                    "emergencyResponse"

            };


            const alertKey =
                alertKeys[type];


            const responseKey =
                responseKeys[type];


            /* تسجيل الحدث */

            window.detectedEvents.push({

                type: type,

                time: new Date()

            });


            updateReportCounters();


            /* تحديث الحالة */

            window.currentAlertKey =
                alertKey;


            window.currentInspectionKey =
                "inspectionStarted";


            setDroneStatus(
                "Responding"
            );


            /* إزالة العلامة القديمة */

            if (eventMarker) {

                map.removeLayer(
                    eventMarker
                );

            }


            /* إنشاء علامة الحدث */

            eventMarker =
                L.marker(
                    eventLocations[type]
                )
                    .addTo(map)
                    .bindPopup(
                        t(alertKey)
                    );


            eventMarker.openPopup();


            /* تحريك الدرون */

            drone.setLatLng(
                eventLocations[type]
            );


            map.panTo(
                eventLocations[type],
                {
                    animate: true,
                    duration: 0.7
                }
            );


            /* استهلاك البطارية */

            battery =
                Math.max(
                    0,
                    battery - 5
                );


            updateBatteryUI();


            /* تحديث سجل الأحداث */

            updateUIAfterEvent(
                alertKey,
                responseKey
            );


            /*
             * بعد فترة قصيرة
             * يصل الدرون للموقع
             */

            responseTimer =
                setTimeout(
                    () => {

                        addEventLog(
                            "droneArrived"
                        );


                        updateDynamicLanguage();


                        responseTimer =
                            null;

                    },
                    1200
                );
        }


        /* =========================
           MAINTENANCE
        ========================= */

        function startMaintenance() {

            if (maintenanceTimer) {

                clearTimeout(
                    maintenanceTimer
                );

            }


            updateMaintenanceStarting();


            addEventLog(
                "cleaning"
            );


            maintenanceTimer =
                setTimeout(
                    () => {

                        updateMaintenanceCompleted();


                        maintenanceTimer =
                            null;

                    },
                    3000
                );
        }


        /* =========================
           RESET
        ========================= */

        function resetMission() {

            if (patrolTimer) {

                clearInterval(
                    patrolTimer
                );

            }


            if (responseTimer) {

                clearTimeout(
                    responseTimer
                );

            }


            if (maintenanceTimer) {

                clearTimeout(
                    maintenanceTimer
                );

            }


            patrolTimer =
                null;

            responseTimer =
                null;

            maintenanceTimer =
                null;


            pathIndex = 0;

            battery = 100;


            window.detectedEvents =
                [];


            window.currentDroneBattery =
                100;


            window.currentDroneStatus =
                "Patrolling";


            window.currentAlertKey =
                "noAlerts";


            window.currentMaintenanceKey =
                "ready";


            window.currentInspectionKey =
                "ready";


            /* إعادة الدرون للبداية */

            drone.setLatLng(
                patrolPath[0]
            );


            map.panTo(
                patrolPath[0]
            );


            /* إزالة علامة الحدث */

            if (eventMarker) {

                map.removeLayer(
                    eventMarker
                );

                eventMarker = null;

            }


            updateReportCounters();

            updateBatteryUI();


            setDroneStatus(
                "Patrolling"
            );


            setEventLog([
                "missionReset"
            ]);


            updateDynamicLanguage();

        }


        /* =========================
           LANGUAGE FOR MAP POPUP
        ========================= */

        window.updateEmergencyPopupLanguage =
            () => {

                if (
                    eventMarker &&
                    window.currentAlertKey
                ) {

                    eventMarker.setPopupContent(
                        t(
                            window.currentAlertKey
                        )
                    );

                }

            };


        /* =========================
           BUTTONS
        ========================= */

        document
            .getElementById(
                "startPatrolBtn"
            )
            ?.addEventListener(
                "click",
                startPatrol
            );


        document
            .getElementById(
                "stopPatrolBtn"
            )
            ?.addEventListener(
                "click",
                () => {

                    stopPatrol(true);

                }
            );


        document
            .getElementById(
                "trafficViolationBtn"
            )
            ?.addEventListener(
                "click",
                () => {

                    respondToEvent(
                        "trafficViolation"
                    );

                }
            );


        document
            .getElementById(
                "fireBtn"
            )
            ?.addEventListener(
                "click",
                () => {

                    respondToEvent(
                        "fire"
                    );

                }
            );


        document
            .getElementById(
                "emergencyBtn"
            )
            ?.addEventListener(
                "click",
                () => {

                    respondToEvent(
                        "emergency"
                    );

                }
            );


        document
            .getElementById(
                "maintenanceBtn"
            )
            ?.addEventListener(
                "click",
                startMaintenance
            );


        document
            .getElementById(
                "resetBtn"
            )
            ?.addEventListener(
                "click",
                resetMission
            );


        /* =========================
           LANGUAGE CHANGE
        ========================= */

        window.addEventListener(
            "languageChanged",
            () => {

                updateBatteryUI();

                updateDynamicLanguage();

            }
        );


        /* =========================
           INITIAL STATE
        ========================= */

        updateBatteryUI();

        setDroneStatus(
            "Patrolling"
        );

        updateDynamicLanguage();

    }
);
