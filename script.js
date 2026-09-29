/* =========================================================
   SAIF DroneNet - Simulation Engine
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const mapElement =
            document.getElementById("map");


        if (!mapElement) {
            console.warn(
                "Map element not found."
            );
            return;
        }


        if (typeof L === "undefined") {

            console.error(
                "Leaflet library was not loaded."
            );

            return;
        }


        /* =================================================
           MAP
           ================================================= */

        const map =
            L.map("map").setView(
                [24.7136, 46.6753],
                15
            );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors",

                maxZoom: 19
            }
        ).addTo(map);


        window.refreshMapSize =
            function () {

                setTimeout(
                    () => {

                        map.invalidateSize();

                    },
                    100
                );

            };


        /* =================================================
           DRONE ICON
           ================================================= */

        const droneIcon =
            L.divIcon({

                className:
                    "drone-marker",

                html:
                    `
                    <div style="
                        font-size:28px;
                        width:32px;
                        height:32px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    ">
                        🛸
                    </div>
                    `,

                iconSize:
                    [32, 32],

                iconAnchor:
                    [16, 16]

            });


        const droneMarker =
            L.marker(
                [24.7136, 46.6753],
                {
                    icon: droneIcon
                }
            ).addTo(map);


        /* =================================================
           PATROL PATH
           ================================================= */

        const patrolPath = [

            [24.7136, 46.6753],

            [24.7140, 46.6765],

            [24.7148, 46.6775],

            [24.7155, 46.6768],

            [24.7150, 46.6752],

            [24.7142, 46.6745]

        ];


        L.polyline(
            patrolPath,
            {
                color: "#19c7a3",
                weight: 4,
                opacity: 0.8
            }
        ).addTo(map);


        /* =================================================
           EVENT LOCATIONS
           ================================================= */

        const eventLocations = {

            trafficViolation:
                [24.7160, 46.6780],

            fire:
                [24.7172, 46.6810],

            emergency:
                [24.7165, 46.6795]

        };


        /* =================================================
           VARIABLES
           ================================================= */

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


        /* =================================================
           BATTERY
           ================================================= */

        function updateBatteryUI() {

            const batteryValue =
                `${battery}%`;


            const dashboardBattery =
                document.getElementById(
                    "dashboardBattery"
                );

            const batteryText =
                document.getElementById(
                    "batteryText"
                );

            const droneBatteryPage =
                document.getElementById(
                    "droneBatteryPage"
                );

            const tableDroneBattery =
                document.getElementById(
                    "tableDroneBattery"
                );

            const droneBatteryBar =
                document.getElementById(
                    "droneBatteryBar"
                );


            if (dashboardBattery) {

                dashboardBattery.textContent =
                    batteryValue;

            }


            if (batteryText) {

                batteryText.textContent =
                    batteryValue;

            }


            if (droneBatteryPage) {

                droneBatteryPage.textContent =
                    batteryValue;

            }


            if (tableDroneBattery) {

                tableDroneBattery.textContent =
                    batteryValue;

            }


            if (droneBatteryBar) {

                droneBatteryBar.style.width =
                    `${battery}%`;

            }


            window.currentDroneBattery =
                battery;
        }


        /* =================================================
           REPORT COUNTERS
           ================================================= */

        function updateReportCounters() {

            const violations =
                window.detectedEvents.filter(
                    event =>
                        event.type ===
                        "trafficViolation"
                ).length;


            const fires =
                window.detectedEvents.filter(
                    event =>
                        event.type === "fire"
                ).length;


            const emergencies =
                window.detectedEvents.filter(
                    event =>
                        event.type === "emergency"
                ).length;


            const reportViolations =
                document.getElementById(
                    "reportViolations"
                );

            const reportFires =
                document.getElementById(
                    "reportFires"
                );

            const reportEmergencies =
                document.getElementById(
                    "reportEmergencies"
                );


            if (reportViolations) {

                reportViolations.textContent =
                    violations;

            }


            if (reportFires) {

                reportFires.textContent =
                    fires;

            }


            if (reportEmergencies) {

                reportEmergencies.textContent =
                    emergencies;

            }
        }


        /* =================================================
           START PATROL
           ================================================= */

        function startPatrol() {

            if (patrolTimer) {
                return;
            }


            setDroneStatus(
                "Patrolling"
            );


            window.currentAlertKey =
                "noAlerts";


            addEventLog(
                t("patrolStarted")
            );


            patrolTimer =
                setInterval(
                    () => {

                        pathIndex++;


                        if (
                            pathIndex >=
                            patrolPath.length
                        ) {

                            pathIndex = 0;

                        }


                        droneMarker.setLatLng(
                            patrolPath[
                                pathIndex
                            ]
                        );


                        battery =
                            Math.max(
                                0,
                                battery - 1
                            );


                        updateBatteryUI();


                        if (
                            battery <= 20
                        ) {

                            setDroneStatus(
                                "Stopped"
                            );


                            addEventLog(
                                t("lowBattery")
                            );


                            stopPatrol(
                                false
                            );

                        }

                    },
                    2000
                );
        }


        /* =================================================
           STOP PATROL
           ================================================= */

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


                addEventLog(
                    t("patrolStopped")
                );

            }

        }


        /* =================================================
           EVENT RESPONSE
           ================================================= */

        function respondToEvent(type) {

            const location =
                eventLocations[type];


            if (!location) {
                return;
            }


            stopPatrol(false);


            setDroneStatus(
                "Responding"
            );


            window.currentAlertKey =
                type;


            const eventName =
                t(type);


            window.detectedEvents.push({

                type: type,

                name: eventName,

                time:
                    new Date()
                        .toLocaleTimeString()

            });


            updateReportCounters();


            if (eventMarker) {

                map.removeLayer(
                    eventMarker
                );

            }


            eventMarker =
                L.marker(location)
                    .addTo(map)
                    .bindPopup(
                        `<b>${eventName}</b>`
                    )
                    .openPopup();


            addEventLog(
                eventName
            );


            addEventLog(
                t("droneResponding")
            );


            let responseIndex = 0;


            if (responseTimer) {

                clearInterval(
                    responseTimer
                );

            }


            responseTimer =
                setInterval(
                    () => {

                        responseIndex++;


                        const current =
                            patrolPath[
                                Math.min(
                                    responseIndex,
                                    patrolPath.length - 1
                                )
                            ];


                        droneMarker.setLatLng(
                            current
                        );


                        if (
                            responseIndex >=
                            patrolPath.length - 1
                        ) {

                            clearInterval(
                                responseTimer
                            );

                            responseTimer =
                                null;


                            droneMarker.setLatLng(
                                location
                            );


                            addEventLog(
                                t(
                                    "droneArrived"
                                )
                            );


                            if (
                                typeof updateUIAfterEvent ===
                                "function"
                            ) {

                                updateUIAfterEvent(
                                    type
                                );

                            }

                        }

                    },
                    700
                );

        }


        /* =================================================
           MAINTENANCE
           ================================================= */

        function startMaintenance() {

            stopPatrol(false);


            if (maintenanceTimer) {
                return;
            }


            if (
                typeof updateMaintenanceStarting ===
                "function"
            ) {

                updateMaintenanceStarting();

            }


            maintenanceTimer =
                setTimeout(
                    () => {

                        if (
                            typeof updateMaintenanceCompleted ===
                            "function"
                        ) {

                            updateMaintenanceCompleted();

                        }


                        maintenanceTimer =
                            null;

                    },
                    3000
                );
        }


        /* =================================================
           RESET
           ================================================= */

        function resetMission() {

            stopPatrol(false);


            if (responseTimer) {

                clearInterval(
                    responseTimer
                );

                responseTimer = null;

            }


            if (maintenanceTimer) {

                clearTimeout(
                    maintenanceTimer
                );

                maintenanceTimer = null;

            }


            pathIndex = 0;

            battery = 100;


            droneMarker.setLatLng(
                patrolPath[0]
            );


            if (eventMarker) {

                map.removeLayer(
                    eventMarker
                );

                eventMarker = null;

            }


            window.detectedEvents = [];


            window.currentAlertKey =
                "noAlerts";

            window.currentInspectionKey =
                "ready";

            window.currentMaintenanceKey =
                "ready";


            updateBatteryUI();

            updateReportCounters();


            setDroneStatus(
                "Patrolling"
            );


            setEventLog(
                t("missionReset")
            );

        }


        /* =================================================
           BUTTONS
           ================================================= */

        const startPatrolBtn =
            document.getElementById(
                "startPatrolBtn"
            );

        const stopPatrolBtn =
            document.getElementById(
                "stopPatrolBtn"
            );

        const trafficViolationBtn =
            document.getElementById(
                "trafficViolationBtn"
            );

        const fireBtn =
            document.getElementById(
                "fireBtn"
            );

        const emergencyBtn =
            document.getElementById(
                "emergencyBtn"
            );

        const maintenanceBtn =
            document.getElementById(
                "maintenanceBtn"
            );

        const resetBtn =
            document.getElementById(
                "resetBtn"
            );


        if (startPatrolBtn) {

            startPatrolBtn.addEventListener(
                "click",
                startPatrol
            );

        }


        if (stopPatrolBtn) {

            stopPatrolBtn.addEventListener(
                "click",
                () => {
                    stopPatrol(true);
                }
            );

        }


        if (trafficViolationBtn) {

            trafficViolationBtn.addEventListener(
                "click",
                () => {

                    respondToEvent(
                        "trafficViolation"
                    );

                }
            );

        }


        if (fireBtn) {

            fireBtn.addEventListener(
                "click",
                () => {

                    respondToEvent(
                        "fire"
                    );

                }
            );

        }


        if (emergencyBtn) {

            emergencyBtn.addEventListener(
                "click",
                () => {

                    respondToEvent(
                        "emergency"
                    );

                }
            );

        }


        if (maintenanceBtn) {

            maintenanceBtn.addEventListener(
                "click",
                startMaintenance
            );

        }


        if (resetBtn) {

            resetBtn.addEventListener(
                "click",
                resetMission
            );

        }


        /* =================================================
           LANGUAGE CHANGE
           ================================================= */

        document.addEventListener(
            "languageChanged",
            () => {

                updateBatteryUI();

                updateReportCounters();


                if (
                    typeof updateDynamicLanguage ===
                    "function"
                ) {

                    updateDynamicLanguage();

                }

            }
        );


        /* =================================================
           INITIALIZE
           ================================================= */

        updateBatteryUI();

        updateReportCounters();


        if (
            typeof updateDynamicLanguage ===
            "function"
        ) {

            updateDynamicLanguage();

        }


        /* Fix Leaflet after initial rendering */

        setTimeout(
            () => {

                map.invalidateSize();

            },
            300
        );

    }
);
