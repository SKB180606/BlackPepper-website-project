/* =====================================================
   BLACKPEPPER BUSINESS INTELLIGENCE DASHBOARD
   ===================================================== */


/* =====================================================
   API CONFIGURATION
   ===================================================== */

const API_URL = "https://blackpepper-backend-production.up.railway.app/api";


/* =====================================================
   ADMIN ACCESS GUARD
   ===================================================== */

const dashboardAuth =
    sessionStorage.getItem("blackpepperAuth");

if (dashboardAuth !== "admin") {

    window.location.href = "login.html";

}


/* =====================================================
   HTML ESCAPE HELPER
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   VERIFY ADMIN ACCESS WITH BACKEND
   ===================================================== */

async function verifyAdminAccess() {

    const token =
        sessionStorage.getItem("bpToken");


    if (!token) {

        window.location.href =
            "login.html?access=denied";

        return false;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/me`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            sessionStorage.clear();

            window.location.href =
                "login.html?access=denied";

            return false;

        }


        if (
            !data.user ||
            data.user.role !== "ADMIN"
        ) {

            sessionStorage.clear();

            window.location.href =
                "login.html?access=denied";

            return false;

        }


        sessionStorage.setItem(
            "bpUser",
            JSON.stringify(data.user)
        );


        return true;


    } catch (error) {

        console.error(
            "AUTH ERROR:",
            error
        );


        alert(
            "Unable to verify your session. Make sure the backend is running."
        );


        return false;

    }

}


/* =====================================================
   FETCH DASHBOARD DATA
   ===================================================== */

async function fetchDashboard(endpoint) {

    const token =
        sessionStorage.getItem("bpToken");


    if (!token) {

        throw new Error(
            "Authentication token not found."
        );

    }


    const response =
        await fetch(
            `${API_URL}/dashboard/${endpoint}`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        let errorMessage =
            `Failed to load ${endpoint}`;

        try {

            const errorData =
                await response.json();

            if (errorData.message) {

                errorMessage =
                    errorData.message;

            }

        } catch (error) {

            // Ignore JSON parsing error

        }


        throw new Error(
            errorMessage
        );

    }


    return response.json();

}


/* =====================================================
   LOAD ALL DASHBOARD DATA
   ===================================================== */

async function loadDashboardData() {

    try {

        /* =========================================
           OVERVIEW
        ========================================= */

        const overview =
            await fetchDashboard(
                "overview"
            );


        console.log(
            "Overview loaded:",
            overview.data
        );


        if (overview.success) {

            updateOverview(
                overview.data
            );

        }


        /* =========================================
           LEADS
        ========================================= */

        const leads =
            await fetchDashboard(
                "leads"
            );


        console.log(
            "Leads loaded:",
            leads.data
        );


        /* =========================================
           INQUIRIES
        ========================================= */

        const inquiries =
            await fetchDashboard(
                "inquiries"
            );


        console.log(
            "Inquiries loaded:",
            inquiries.data
        );


        if (inquiries.success) {

            updateInquiries(
                inquiries.data
            );

        }


        /* =========================================
           SERVICES
        ========================================= */

        const services =
            await fetchDashboard(
                "services"
            );


        console.log(
            "Services loaded:",
            services.data
        );


        if (services.success) {

            updateServicePerformance(
                services.data
            );

        }


        /* =========================================
           WEBSITE ANALYTICS
        ========================================= */

        const website =
            await fetchDashboard(
                "website"
            );


        console.log(
            "Website analytics loaded:",
            website.data
        );
        updateWebsiteAnalytics(website.data);
        function updateWebsiteAnalytics(analytics) {

    if (!analytics || analytics.length === 0) {
        return;
    }

    // -------------------------------
    // TOTAL VISITORS
    // -------------------------------

    const totalVisitors = analytics.reduce(
        (sum, item) => sum + Number(item.visitors || 0),
        0
    );

    const visitorsElement =
        document.getElementById("analyticsVisitors");

    if (visitorsElement) {
        visitorsElement.textContent =
            totalVisitors.toLocaleString();
    }


    // -------------------------------
    // AVERAGE SESSION
    // (fixed: DB column is "avg_session", not "avg_session_duration")
    // -------------------------------

    const sessions = analytics
        .map(item => Number(item.avg_session || 0))
        .filter(value => value > 0);

    const averageSession =
        sessions.length
            ? sessions.reduce((a, b) => a + b, 0) / sessions.length
            : 0;

    const sessionElement =
        document.getElementById("analyticsSession");

    if (sessionElement) {
        sessionElement.textContent =
            averageSession.toFixed(1) + " min";
    }


    // -------------------------------
    // BOUNCE RATE
    // -------------------------------

    const bounceRates = analytics
        .map(item => Number(item.bounce_rate || 0))
        .filter(value => value >= 0);

    const averageBounce =
        bounceRates.length
            ? bounceRates.reduce((a, b) => a + b, 0)
                / bounceRates.length
            : 0;

    const bounceElement =
        document.getElementById("analyticsBounce");

    if (bounceElement) {
        bounceElement.textContent =
            averageBounce.toFixed(1) + "%";
    }


    // -------------------------------
    // RETURNING VISITORS
    // (fixed: now a real percentage of total visitors,
    // instead of averaging raw headcounts across months)
    // -------------------------------

    const totalVisitorsSum = analytics
        .reduce((sum, item) => sum + Number(item.visitors || 0), 0);

    const totalReturningSum = analytics
        .reduce((sum, item) => sum + Number(item.returning_visitors || 0), 0);

    const returningPercentage =
        totalVisitorsSum > 0
            ? (totalReturningSum / totalVisitorsSum) * 100
            : 0;

    const newPercentage =
        100 - returningPercentage;

    const returningElement =
        document.getElementById(
            "returningVisitorPercentage"
        );

    const newElement =
        document.getElementById(
            "newVisitorPercentage"
        );

    if (returningElement) {
        returningElement.textContent =
            returningPercentage.toFixed(1) + "%";
    }

    if (newElement) {
        newElement.textContent =
            newPercentage.toFixed(1) + "%";
    }


    // -------------------------------
    // PROGRESS BARS
    // -------------------------------

    const returningBar =
        document.getElementById(
            "returningVisitorBar"
        );

    const newBar =
        document.getElementById(
            "newVisitorBar"
        );

    if (returningBar) {
        returningBar.style.width =
            Math.min(returningPercentage, 100) + "%";
    }

    if (newBar) {
        newBar.style.width =
            Math.min(newPercentage, 100) + "%";
    }


    // -------------------------------
    // MONTHLY TRAFFIC
    // -------------------------------

    const trafficContainer =
        document.getElementById("monthlyTraffic");

    if (trafficContainer) {

        const sortedAnalytics =
            [...analytics].sort(
                (a, b) => Number(a.id) - Number(b.id)
            );

        const maxVisitors =
            Math.max(
                ...sortedAnalytics.map(
                    item => Number(item.visitors || 0)
                )
            );

        trafficContainer.innerHTML =
            sortedAnalytics.map(item => {

                const visitors =
                    Number(item.visitors || 0);

                const percentage =
                    maxVisitors > 0
                        ? (visitors / maxVisitors) * 100
                        : 0;

                return `
                    <div>
                        <div class="traffic-row">
                            <span>
                                ${escapeHTML(item.month)}
                            </span>

                            <strong>
                                ${visitors.toLocaleString()}
                            </strong>
                        </div>

                        <div class="traffic-bar">
                            <div
                                class="traffic-bar-fill"
                                style="width:${percentage}%"
                            ></div>
                        </div>
                    </div>
                `;
            }).join("");
    }


    // -------------------------------
    // DEMO TOP PAGES
    // -------------------------------

    const topPages =
        document.getElementById("topPages");

    if (topPages) {

        const pages = [
            ["Home", 5420],
            ["Services", 3840],
            ["About", 1920],
            ["Products", 1470],
            ["Contact", 980]
        ];

        const maxPageViews =
            Math.max(...pages.map(page => page[1]));

        topPages.innerHTML =
            pages.map(page => {

                const percentage =
                    (page[1] / maxPageViews) * 100;

                return `
                    <div>
                        <div class="traffic-row">
                            <span>
                                ${escapeHTML(page[0])}
                            </span>

                            <strong>
                                ${page[1].toLocaleString()}
                            </strong>
                        </div>

                        <div class="traffic-bar">
                            <div
                                class="traffic-bar-fill"
                                style="width:${percentage}%"
                            ></div>
                        </div>
                    </div>
                `;

            }).join("");
    }


    // -------------------------------
    // DEVICE BREAKDOWN
    // -------------------------------

    const deviceContainer =
        document.getElementById("deviceBreakdown");

    if (deviceContainer) {

        const devices = [
            ["Mobile", 64],
            ["Desktop", 31],
            ["Tablet", 5]
        ];

        deviceContainer.innerHTML =
            devices.map(device => {

                return `
                    <div class="device-row">

                        <span>
                            ${device[0]}
                        </span>

                        <div class="device-bar">
                            <div
                                class="device-fill"
                                style="width:${device[1]}%"
                            ></div>
                        </div>

                        <strong>
                            ${device[1]}%
                        </strong>

                    </div>
                `;

            }).join("");
    }

    console.log(
        "Website analytics updated:",
        analytics
    );
}

        /* =========================================
           SEO
        ========================================= */

        const seo =
            await fetchDashboard(
                "seo"
            );


        console.log(
            "SEO data loaded:",
            seo.data
        );


        /* =========================================
           PROJECTS
        ========================================= */

        const projects =
            await fetchDashboard(
                "projects"
            );


        console.log(
            "Projects loaded:",
            projects.data
        );
        updateProjects(projects.data);


        /* =========================================
           LEAD SOURCES
        ========================================= */

        const sources =
            await fetchDashboard(
                "lead-sources"
            );


        console.log(
            "Lead sources loaded:",
            sources.data
        );


        /* =========================================
           PIPELINE
        ========================================= */

        const pipeline =
            await fetchDashboard(
                "pipeline"
            );


        console.log(
            "Pipeline loaded:",
            pipeline.data
        );


        /* =========================================
           UPDATE PERFORMANCE CHART
        ========================================= */

        if (
            website.success &&
            leads.success
        ) {

            updatePerformanceChart(
                website.data,
                leads.data
            );


            updateLeadFunnel(
                website.data,
                leads.data
            );

        }


        /* =========================================
           FINAL SUCCESS MESSAGE
        ========================================= */

        console.log(
            "Dashboard data loaded successfully from MySQL."
        );


    } catch (error) {

        console.error(
            "DASHBOARD DATA ERROR:",
            error
        );

    }

}


/* =====================================================
   UPDATE OVERVIEW KPI CARDS
   ===================================================== */

function updateOverview(data) {

    if (!data) {

        console.warn(
            "Overview data is missing."
        );

        return;

    }


    const totalVisitors =
        document.getElementById(
            "totalVisitors"
        );


    const newLeads =
        document.getElementById(
            "newLeads"
        );


    const qualifiedLeads =
        document.getElementById(
            "qualifiedLeads"
        );


    const conversionRate =
        document.getElementById(
            "conversionRate"
        );


    /* =========================================
       TOTAL VISITORS
    ========================================= */

    if (totalVisitors) {

        totalVisitors.textContent =
            Number(
                data.totalVisitors || 0
            ).toLocaleString();

    }


    /* =========================================
       NEW LEADS
    ========================================= */

    if (newLeads) {

        newLeads.textContent =
            Number(
                data.newLeads || 0
            ).toLocaleString();

    }


    /* =========================================
       QUALIFIED LEADS
    ========================================= */

    if (qualifiedLeads) {

        qualifiedLeads.textContent =
            Number(
                data.qualifiedLeads || 0
            ).toLocaleString();

    }


    /* =========================================
       CONVERSION RATE
    ========================================= */

    if (conversionRate) {

        conversionRate.textContent =
            Number(
                data.conversionRate || 0
            ).toFixed(2) + "%";

    }


    console.log(
        "Overview updated:",
        data
    );

}


/* =====================================================
   UPDATE LEAD CONVERSION FUNNEL
   ===================================================== */

function updateLeadFunnel(
    analytics,
    leads
) {

    const funnelVisitors =
        document.getElementById(
            "funnelVisitors"
        );


    const funnelLeads =
        document.getElementById(
            "funnelLeads"
        );


    const funnelQualified =
        document.getElementById(
            "funnelQualified"
        );


    const funnelProposals =
        document.getElementById(
            "funnelProposals"
        );


    const funnelConverted =
        document.getElementById(
            "funnelConverted"
        );


    /* =========================================
       SAFETY CHECK
    ========================================= */

    if (!Array.isArray(analytics)) {

        console.warn(
            "Analytics data is not an array."
        );

        return;

    }


    if (!Array.isArray(leads)) {

        console.warn(
            "Lead data is not an array."
        );

        return;

    }


    /* =========================================
       WEBSITE VISITORS
    ========================================= */

    const totalVisitors =
        analytics.reduce(
            (total, item) => {

                return (
                    total +
                    Number(
                        item.visitors || 0
                    )
                );

            },
            0
        );


    /* =========================================
       LEAD COUNTS
    ========================================= */

    const totalLeads =
        leads.length;


    const qualifiedLeads =
        leads.filter(
            lead =>
                String(
                    lead.status || ""
                ).toLowerCase() ===
                "qualified"
        ).length;


    const proposalLeads =
        leads.filter(
            lead =>
                String(
                    lead.status || ""
                ).toLowerCase() ===
                "proposal"
        ).length;


    const convertedLeads =
        leads.filter(
            lead =>
                String(
                    lead.status || ""
                ).toLowerCase() ===
                "won"
        ).length;


    /* =========================================
       UPDATE HTML
    ========================================= */

    if (funnelVisitors) {

        funnelVisitors.textContent =
            totalVisitors.toLocaleString();

    }


    if (funnelLeads) {

        funnelLeads.textContent =
            totalLeads.toLocaleString();

    }


    if (funnelQualified) {

        funnelQualified.textContent =
            qualifiedLeads.toLocaleString();

    }


    if (funnelProposals) {

        funnelProposals.textContent =
            proposalLeads.toLocaleString();

    }


    if (funnelConverted) {

        funnelConverted.textContent =
            convertedLeads.toLocaleString();

    }


    /* =========================================
       DEBUG
    ========================================= */

    console.log(
        "Lead funnel updated:",
        {
            visitors: totalVisitors,
            leads: totalLeads,
            qualified: qualifiedLeads,
            proposals: proposalLeads,
            converted: convertedLeads
        }
    );

}


/* =====================================================
   UPDATE SERVICE PERFORMANCE
   ===================================================== */

function updateServicePerformance(
    serviceData
) {

    if (
        !Array.isArray(serviceData) ||
        serviceData.length === 0
    ) {

        console.log(
            "No service performance data available."
        );

        return;

    }


    /* =========================================
       GROUP DATABASE SERVICES
       INTO DASHBOARD CATEGORIES
    ========================================= */

    const serviceGroups = {

        "Web Development": [
            "Web Apps",
            "WordPress Website"
        ],

        "Mobile Apps": [
            "Mobile Apps"
        ],

        "E-Commerce": [
            "Ecommerce Website"
        ],

        "Cloud Solutions": [
            "AWS Consulting & Migration",
            "Cloud Hosting"
        ],

        "Digital Marketing": [
            "SEO & Social Media Marketing",
            "Digital Marketing",
            "Lead Generation & CRM"
        ]

    };


    /* =========================================
       CALCULATE GROUPED SERVICE COUNTS
    ========================================= */

    const groupedServices = {};


    Object.keys(
        serviceGroups
    ).forEach(
        dashboardService => {

            groupedServices[
                dashboardService
            ] = 0;


            serviceGroups[
                dashboardService
            ].forEach(
                databaseService => {

                    const match =
                        serviceData.find(
                            item =>
                                item.service ===
                                databaseService
                        );


                    if (match) {

                        groupedServices[
                            dashboardService
                        ] += Number(
                            match.inquiries || 0
                        );

                    }

                }
            );

        }
    );


    /* =========================================
       CALCULATE TOTAL
    ========================================= */

    const totalServiceLeads =
        Object.values(
            groupedServices
        ).reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        );


    if (
        totalServiceLeads === 0
    ) {

        console.log(
            "Service data contains no lead activity."
        );

        return;

    }


    /* =========================================
       UPDATE SERVICE ROWS
    ========================================= */

    const serviceRows =
        document.querySelectorAll(
            ".service-row"
        );


    serviceRows.forEach(
        row => {

            const serviceName =
                row.dataset.service;


            const count =
                groupedServices[
                    serviceName
                ];


            if (
                count === undefined
            ) {

                return;

            }


            const percentage =
                (
                    count /
                    totalServiceLeads
                ) * 100;


            const roundedPercentage =
                Math.round(
                    percentage
                );


            /* =================================
               PERCENTAGE TEXT
            ================================= */

            const percentageElement =
                row.querySelector(
                    ".service-label strong"
                );


            if (percentageElement) {

                percentageElement.textContent =
                    `${roundedPercentage}%`;

            }


            /* =================================
               PROGRESS BAR
            ================================= */

            const fill =
                row.querySelector(
                    ".service-fill"
                );


            if (fill) {

                fill.style.width =
                    `${percentage}%`;

            }

        }
    );


    /* =========================================
       FIND TOP SERVICE
    ========================================= */

    const sortedServices =
        Object.entries(
            groupedServices
        ).sort(
            (
                a,
                b
            ) =>
                b[1] - a[1]
        );


    const topService =
        sortedServices[0];


    if (!topService) {

        return;

    }


    const topServiceNameValue =
        topService[0];


    const topServiceCount =
        topService[1];


    const topPercentage =
        Math.round(
            (
                topServiceCount /
                totalServiceLeads
            ) * 100
        );


    /* =========================================
       UPDATE INSIGHT CARD
    ========================================= */

    const topServiceName =
        document.getElementById(
            "topServiceName"
        );


    const topServicePercentage =
        document.getElementById(
            "topServicePercentage"
        );


    const topServiceDescription =
        document.getElementById(
            "topServiceDescription"
        );


    if (topServiceName) {

        topServiceName.textContent =
            topServiceNameValue;

    }


    if (topServicePercentage) {

        topServicePercentage.textContent =
            `${topPercentage}%`;

    }


    if (topServiceDescription) {

        topServiceDescription.textContent =
            `${topServiceNameValue} represents the highest share of demonstrated lead activity in the prototype.`;

    }


    console.log(
        "Grouped service performance:",
        groupedServices
    );

}


/* =====================================================
   UPDATE RECENT INQUIRIES
   ===================================================== */

function updateInquiries(
    inquiries
) {

    const inquiriesBody =
        document.getElementById(
            "inquiriesBody"
        );


    if (!inquiriesBody) {

        console.warn(
            "Inquiries table body not found."
        );

        return;

    }


    if (
        !Array.isArray(inquiries) ||
        inquiries.length === 0
    ) {

        inquiriesBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >

                    No inquiries available.

                </td>

            </tr>

        `;

        return;

    }


    /* =========================================
       DISPLAY LATEST INQUIRIES FIRST
    ========================================= */

    inquiriesBody.innerHTML =
        inquiries
            .slice(0, 8)
            .map(
                inquiry => {

                    const clientName =
                        inquiry.client_name ||
                        inquiry.client ||
                        "Demo Client";


                    const service =
                        inquiry.service ||
                        "Service Inquiry";


                    const status =
                        inquiry.status ||
                        "New";


                    const dateValue =
                        inquiry.created_at ||
                        inquiry.date;


                    /* =============================
                       FORMAT DATE
                    ============================= */

                    let formattedDate =
                        "N/A";


                    if (dateValue) {

                        const date =
                            new Date(
                                dateValue
                            );


                        if (
                            !isNaN(
                                date.getTime()
                            )
                        ) {

                            formattedDate =
                                date.toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    }
                                );

                        }

                    }


                    /* =============================
                       CLIENT INITIAL
                    ============================= */

                    const initial =
                        clientName
                            .charAt(0)
                            .toUpperCase();


                    /* =============================
                       STATUS CLASS
                    ============================= */

                    const statusClass =
                        String(status)
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                "-"
                            );


                    /* =============================
                       RETURN TABLE ROW
                    ============================= */

                    return `

                        <tr>

                            <td>

                                <div class="client">

                                    <div class="client-avatar">

                                        ${escapeHTML(
                                            initial
                                        )}

                                    </div>


                                    <span>

                                        ${escapeHTML(
                                            clientName
                                        )}

                                    </span>

                                </div>

                            </td>


                            <td>

                                ${escapeHTML(
                                    service
                                )}

                            </td>


                            <td>

                                ${escapeHTML(
                                    formattedDate
                                )}

                            </td>


                            <td>

                                <span
                                    class="status ${escapeHTML(
                                        statusClass
                                    )}"
                                >

                                    ${escapeHTML(
                                        status
                                    )}

                                </span>

                            </td>


                            <td>

                                <button
    class="view-btn"
    data-inquiry-id="${escapeHTML(
        inquiry.id || ""
    )}"
>
    View More
</button>
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    /* =========================================
       ATTACH VIEW BUTTON EVENTS
       ========================================= */

    const newViewButtons =
        inquiriesBody.querySelectorAll(
            ".view-btn"
        );


    newViewButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const inquiryId =
                        button.dataset.inquiryId;


                    const inquiry =
                        inquiries.find(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    inquiryId
                                )
                        );


                    if (inquiry) {

    generateInquiryReceipt(
        inquiry
    );

}
                }
            );

        }
    );


    console.log(
        "Recent inquiries updated:",
        inquiries
    );

}


/* =====================================================
   OPEN INQUIRY MODAL
   ===================================================== */

function openInquiryModal(
    inquiry
) {

    const modal =
        document.getElementById(
            "leadModal"
        );


    const modalClient =
        document.getElementById(
            "modalClient"
        );


    const modalService =
        document.getElementById(
            "modalService"
        );


    const modalStatus =
        document.getElementById(
            "modalStatus"
        );


    const clientName =
        inquiry.client_name ||
        inquiry.client ||
        "Demo Client";


    const service =
        inquiry.service ||
        "Service Inquiry";


    const status =
        inquiry.status ||
        "New";


    if (modalClient) {

        modalClient.textContent =
            clientName;

    }


    if (modalService) {

        modalService.textContent =
            service;

    }


    if (modalStatus) {

        modalStatus.textContent =
            status;

    }


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =====================================================
   VISITORS & LEADS PERFORMANCE CHART
   ===================================================== */

function updatePerformanceChart(
    analytics,
    leads
) {

    const visitorLine =
        document.getElementById(
            "visitorLine"
        );


    const leadLine =
        document.getElementById(
            "leadLine"
        );


    const xAxis =
        document.getElementById(
            "chartXAxis"
        );


    /* =========================================
       CHECK REQUIRED ELEMENTS
    ========================================= */

    if (
        !visitorLine ||
        !leadLine
    ) {

        console.warn(
            "Performance chart elements not found."
        );

        return;

    }


    if (
        !Array.isArray(analytics) ||
        !Array.isArray(leads)
    ) {

        console.warn(
            "Invalid chart data."
        );

        return;

    }


    if (
        analytics.length === 0
    ) {

        console.warn(
            "No website analytics available."
        );

        return;

    }


    /* =========================================
       GET MONTHS
    ========================================= */

    const months =
        analytics.map(
            item =>
                item.month
        );


    /* =========================================
       GET VISITOR NUMBERS
    ========================================= */

    const visitors =
        analytics.map(
            item =>
                Number(
                    item.visitors || 0
                )
        );


    /* =========================================
       COUNT LEADS BY MONTH
    ========================================= */

    const leadCounts = {};


    leads.forEach(
        lead => {

            if (!lead.created_at) {

                return;

            }


            const date =
                new Date(
                    lead.created_at
                );


            if (
                isNaN(
                    date.getTime()
                )
            ) {

                return;

            }


            const month =
                date.toLocaleString(
                    "en-US",
                    {
                        month: "long"
                    }
                );


            leadCounts[month] =
                (
                    leadCounts[month] ||
                    0
                ) + 1;

        }
    );


    /* =========================================
       MATCH LEADS TO ANALYTICS MONTHS
    ========================================= */

    const monthlyLeads =
        months.map(
            month =>
                leadCounts[month] || 0
        );


    /* =========================================
       SVG DIMENSIONS
    ========================================= */

    const width = 800;

    const height = 280;

    const verticalPadding = 25;


    /* =========================================
       MAXIMUM VALUES
    ========================================= */

    const maxVisitors =
        Math.max(
            ...visitors,
            1
        );


    const maxLeads =
        Math.max(
            ...monthlyLeads,
            1
        );


    /* =========================================
       CREATE SVG POINTS
    ========================================= */

    function createPoints(
        values,
        maxValue
    ) {

        if (
            !values.length
        ) {

            return "";

        }


        if (
            values.length === 1
        ) {

            const y =
                height -
                verticalPadding -
                (
                    values[0] /
                    maxValue
                ) *
                (
                    height -
                    verticalPadding * 2
                );


            return `0,${y}`;

        }


        return values
            .map(
                (
                    value,
                    index
                ) => {

                    const x =
                        (
                            index /
                            (
                                values.length -
                                1
                            )
                        ) *
                        width;


                    const y =
                        height -
                        verticalPadding -
                        (
                            value /
                            maxValue
                        ) *
                        (
                            height -
                            verticalPadding * 2
                        );


                    return `${x},${y}`;

                }
            )
            .join(" ");

    }


    /* =========================================
       UPDATE VISITOR LINE
    ========================================= */

    visitorLine.setAttribute(
        "points",
        createPoints(
            visitors,
            maxVisitors
        )
    );


    /* =========================================
       UPDATE LEAD LINE
    ========================================= */

    leadLine.setAttribute(
        "points",
        createPoints(
            monthlyLeads,
            maxLeads
        )
    );


    /* =========================================
       UPDATE X-AXIS MONTH LABELS
    ========================================= */

    if (xAxis) {

        xAxis.innerHTML = "";


        months.forEach(
            month => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.textContent =
                    String(
                        month
                    ).substring(
                        0,
                        3
                    );


                xAxis.appendChild(
                    span
                );

            }
        );

    }


    /* =========================================
       DEBUG INFORMATION
    ========================================= */

    console.log(
        "Performance chart updated:",
        {
            months,
            visitors,
            monthlyLeads
        }
    );

}


/* =====================================================
   MOBILE SIDEBAR
   ===================================================== */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.toggle(
                    "open"
                );

            }

        }
    );

}


/* =====================================================
   SIDEBAR NAVIGATION
   ===================================================== */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );


                if (
                    window.innerWidth <= 800
                ) {

                    if (sidebar) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                }

            }
        );

    }
);


/* =====================================================
   PERIOD SELECT
   ===================================================== */

const periodSelect =
    document.getElementById(
        "periodSelect"
    );


if (periodSelect) {

    periodSelect.addEventListener(
        "change",
        () => {

            console.log(
                "Selected period:",
                periodSelect.value
            );

        }
    );

}


/* =====================================================
   SERVICE DETAILS
   ===================================================== */

const serviceDetailsBtn =
    document.getElementById(
        "serviceDetailsBtn"
    );


if (serviceDetailsBtn) {

    serviceDetailsBtn.addEventListener(
        "click",
        () => {

            const topServiceName =
                document.getElementById(
                    "topServiceName"
                );


            const serviceName =
                topServiceName
                    ? topServiceName.textContent
                    : "Top Performing Service";


            alert(
                `${serviceName} is currently the highest-performing service in this synthetic demonstration dataset.`
            );

        }
    );

}


/* =====================================================
   LEAD MODAL
   ===================================================== */

const modal =
    document.getElementById(
        "leadModal"
    );


const closeModal =
    document.getElementById(
        "closeModal"
    );


/* =====================================================
   CLOSE MODAL
   ===================================================== */

if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            if (modal) {

                modal.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =====================================================
   CLOSE MODAL ON BACKDROP CLICK
   ===================================================== */

if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =====================================================
   ESCAPE KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            if (modal) {

                modal.classList.remove(
                    "show"
                );

            }


            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }

    }
);


/* =====================================================
   VIEW ALL
   ===================================================== */

const viewAllBtn =
    document.getElementById(
        "viewAllBtn"
    );


if (viewAllBtn) {

    viewAllBtn.addEventListener(
        "click",
        () => {

            alert(
                "The complete lead-management interface is planned as a future module."
            );

        }
    );

}


/* =====================================================
   ACTIVE SECTION DETECTION
   ===================================================== */

const sections =
    document.querySelectorAll(
        ".dashboard-section[id]"
    );


if (
    "IntersectionObserver"
    in window
) {

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            const id =
                                entry.target.getAttribute(
                                    "id"
                                );


                            navLinks.forEach(
                                link => {

                                    link.classList.remove(
                                        "active"
                                    );


                                    if (
                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        "#" + id
                                    ) {

                                        link.classList.add(
                                            "active"
                                        );

                                    }

                                }
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.35
            }

        );


    sections.forEach(
        section => {

            observer.observe(
                section
            );

        }
    );

}


/* =====================================================
   LOGOUT
   ===================================================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "blackpepperAuth"
            );


            sessionStorage.removeItem(
                "bpToken"
            );


            sessionStorage.removeItem(
                "bpRole"
            );


            sessionStorage.removeItem(
                "bpUser"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const authorized =
            await verifyAdminAccess();


        if (!authorized) {

            return;

        }


        await loadDashboardData();

    }
);


/* =====================================================
   CONSOLE INFORMATION
   ===================================================== */

console.log(
    "BlackPepper Business Intelligence Dashboard loaded."
);


console.log(
    "All displayed values are synthetic demonstration data."
);
function updateWebsiteAnalytics(analytics) {

    if (!analytics || analytics.length === 0) {
        return;
    }

    // -------------------------------
    // TOTAL VISITORS
    // -------------------------------

    const totalVisitors = analytics.reduce(
        (sum, item) => sum + Number(item.visitors || 0),
        0
    );

    const visitorsElement =
        document.getElementById("analyticsVisitors");

    if (visitorsElement) {
        visitorsElement.textContent =
            totalVisitors.toLocaleString();
    }


    // -------------------------------
    // AVERAGE SESSION
    // -------------------------------

    const sessions = analytics
        .map(item => Number(item.avg_session_duration || 0))
        .filter(value => value > 0);

    const averageSession =
        sessions.length
            ? sessions.reduce((a, b) => a + b, 0) / sessions.length
            : 0;

    const sessionElement =
        document.getElementById("analyticsSession");

    if (sessionElement) {
        sessionElement.textContent =
            Math.round(averageSession) + " sec";
    }


    // -------------------------------
    // BOUNCE RATE
    // -------------------------------

    const bounceRates = analytics
        .map(item => Number(item.bounce_rate || 0))
        .filter(value => value >= 0);

    const averageBounce =
        bounceRates.length
            ? bounceRates.reduce((a, b) => a + b, 0)
                / bounceRates.length
            : 0;

    const bounceElement =
        document.getElementById("analyticsBounce");

    if (bounceElement) {
        bounceElement.textContent =
            averageBounce.toFixed(1) + "%";
    }


    // -------------------------------
    // RETURNING VISITORS
    // -------------------------------

    const returningValues = analytics
        .map(item =>
            Number(item.returning_visitors || 0)
        )
        .filter(value => value >= 0);

    const returningPercentage =
        returningValues.length
            ? returningValues.reduce((a, b) => a + b, 0)
                / returningValues.length
            : 0;

    const newPercentage =
        100 - returningPercentage;

    const returningElement =
        document.getElementById(
            "returningVisitorPercentage"
        );

    const newElement =
        document.getElementById(
            "newVisitorPercentage"
        );

    if (returningElement) {
        returningElement.textContent =
            returningPercentage.toFixed(1) + "%";
    }

    if (newElement) {
        newElement.textContent =
            newPercentage.toFixed(1) + "%";
    }


    // -------------------------------
    // PROGRESS BARS
    // -------------------------------

    const returningBar =
        document.getElementById(
            "returningVisitorBar"
        );

    const newBar =
        document.getElementById(
            "newVisitorBar"
        );

    if (returningBar) {
        returningBar.style.width =
            Math.min(returningPercentage, 100) + "%";
    }

    if (newBar) {
        newBar.style.width =
            Math.min(newPercentage, 100) + "%";
    }


    // -------------------------------
    // MONTHLY TRAFFIC
    // -------------------------------

    const trafficContainer =
        document.getElementById("monthlyTraffic");

    if (trafficContainer) {

        const sortedAnalytics =
            [...analytics].sort(
                (a, b) => Number(a.id) - Number(b.id)
            );

        const maxVisitors =
            Math.max(
                ...sortedAnalytics.map(
                    item => Number(item.visitors || 0)
                )
            );

        trafficContainer.innerHTML =
            sortedAnalytics.map(item => {

                const visitors =
                    Number(item.visitors || 0);

                const percentage =
                    maxVisitors > 0
                        ? (visitors / maxVisitors) * 100
                        : 0;

                return `
                    <div>
                        <div class="traffic-row">
                            <span>
                                ${escapeHTML(item.month)}
                            </span>

                            <strong>
                                ${visitors.toLocaleString()}
                            </strong>
                        </div>

                        <div class="traffic-bar">
                            <div
                                class="traffic-bar-fill"
                                style="width:${percentage}%"
                            ></div>
                        </div>
                    </div>
                `;
            }).join("");
    }


    // -------------------------------
    // DEMO TOP PAGES
    // -------------------------------

    const topPages =
        document.getElementById("topPages");

    if (topPages) {

        const pages = [
            ["Home", 5420],
            ["Services", 3840],
            ["About", 1920],
            ["Products", 1470],
            ["Contact", 980]
        ];

        const maxPageViews =
            Math.max(...pages.map(page => page[1]));

        topPages.innerHTML =
            pages.map(page => {

                const percentage =
                    (page[1] / maxPageViews) * 100;

                return `
                    <div>
                        <div class="traffic-row">
                            <span>
                                ${escapeHTML(page[0])}
                            </span>

                            <strong>
                                ${page[1].toLocaleString()}
                            </strong>
                        </div>

                        <div class="traffic-bar">
                            <div
                                class="traffic-bar-fill"
                                style="width:${percentage}%"
                            ></div>
                        </div>
                    </div>
                `;

            }).join("");
    }


    // -------------------------------
    // DEVICE BREAKDOWN
    // -------------------------------

    const deviceContainer =
        document.getElementById("deviceBreakdown");

    if (deviceContainer) {

        const devices = [
            ["Mobile", 64],
            ["Desktop", 31],
            ["Tablet", 5]
        ];

        deviceContainer.innerHTML =
            devices.map(device => {

                return `
                    <div class="device-row">

                        <span>
                            ${device[0]}
                        </span>

                        <div class="device-bar">
                            <div
                                class="device-fill"
                                style="width:${device[1]}%"
                            ></div>
                        </div>

                        <strong>
                            ${device[1]}%
                        </strong>

                    </div>
                `;

            }).join("");
    }

    console.log(
        "Website analytics updated:",
        analytics
    );
}
function updateProjects(projects) {
    const projectsBody = document.getElementById("projectsBody");

    // Summary card elements
    const activeProjects = document.getElementById("activeProjects");
    const onTrackProjects = document.getElementById("onTrackProjects");
    const atRiskProjects = document.getElementById("atRiskProjects");
    const completedProjects = document.getElementById("completedProjects");

    if (!projects) {
        console.log("No project data received.");
        return;
    }

    // -----------------------------
    // PROJECT SUMMARY
    // -----------------------------

    const active = projects.filter(project =>
        project.status &&
        project.status.toLowerCase() !== "completed"
    ).length;

    const onTrack = projects.filter(project =>
        project.status &&
        project.status.toLowerCase() === "on track"
    ).length;

    const atRisk = projects.filter(project =>
        project.status &&
        project.status.toLowerCase() === "at risk"
    ).length;

    const completed = projects.filter(project =>
        project.status &&
        project.status.toLowerCase() === "completed"
    ).length;

    // Update summary cards
    if (activeProjects) {
        activeProjects.textContent = active;
    }

    if (onTrackProjects) {
        onTrackProjects.textContent = onTrack;
    }

    if (atRiskProjects) {
        atRiskProjects.textContent = atRisk;
    }

    if (completedProjects) {
        completedProjects.textContent = completed;
    }

    // -----------------------------
    // PROJECT TABLE
    // -----------------------------

    if (!projectsBody) return;

    if (projects.length === 0) {
        projectsBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No projects available.
                </td>
            </tr>
        `;
        return;
    }

    projectsBody.innerHTML = projects.map(project => {

        const projectName =
            project.project_name ||
            project.name ||
            "Project";

        const client =
            project.client_name ||
            project.client ||
            "Client";

        const service =
            project.service ||
            "Service";

        const status =
            project.status ||
            "On Track";

        const statusClass =
            status.toLowerCase().replace(/\s+/g, "-");

        return `
            <tr>
                <td>
                    <strong>${escapeHTML(projectName)}</strong>
                </td>

                <td>
                    ${escapeHTML(client)}
                </td>

                <td>
                    ${escapeHTML(service)}
                </td>

                <td>
                    <span class="status ${escapeHTML(statusClass)}">
                        ${escapeHTML(status)}
                    </span>
                </td>
            </tr>
        `;
    }).join("");

    console.log("Project summary:", {
        total: projects.length,
        active,
        onTrack,
        atRisk,
        completed
    });
}
/* =====================================================
   GENERATE INQUIRY RECEIPT
   ===================================================== */

function generateInquiryReceipt(inquiry) {

    if (!inquiry) {

        alert(
            "Unable to generate the inquiry receipt."
        );

        return;

    }


    /* =========================================
       GET INQUIRY INFORMATION
    ========================================= */

    const clientName =
        inquiry.client_name ||
        inquiry.client ||
        "Demo Client";


    const service =
        inquiry.service ||
        "Service Inquiry";


    const status =
        inquiry.status ||
        "New";


    const inquiryId =
        inquiry.id ||
        "N/A";


    const dateValue =
        inquiry.created_at ||
        inquiry.date;


    /* =========================================
       FORMAT DATE
    ========================================= */

    let formattedDate =
        "N/A";


    if (dateValue) {

        const date =
            new Date(
                dateValue
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            formattedDate =
                date.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );

        }

    }


    /* =========================================
       OPTIONAL DATABASE FIELDS
    ========================================= */

    const email =
        inquiry.email ||
        inquiry.client_email ||
        "Not provided";


    const phone =
        inquiry.phone ||
        inquiry.mobile ||
        inquiry.contact ||
        "Not provided";


    const message =
        inquiry.message ||
        inquiry.description ||
        inquiry.requirement ||
        "No additional message provided.";


    /* =========================================
       GENERATE RECEIPT NUMBER
    ========================================= */

    const inquiryNumber =
    100 + ((Number(inquiry.id) * 137) % 900);

const receiptNumber =
    `BP-INQ-${inquiryNumber}`;


    /* =========================================
       OPEN NEW TAB
    ========================================= */

    const receiptWindow =
        window.open(
            "",
            "_blank"
        );


    if (!receiptWindow) {

        alert(
            "The receipt could not be opened. Please allow pop-ups for this website."
        );

        return;

    }


    /* =========================================
       RECEIPT HTML
    ========================================= */

    receiptWindow.document.write(`

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escapeHTML(receiptNumber)}
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        body {

            margin: 0;

            padding: 40px;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            background: #f4f7fb;

            color: #1e293b;

        }


        .receipt-wrapper {

            max-width: 850px;

            margin: 0 auto;

        }


        .toolbar {

            display: flex;

            justify-content: flex-end;

            gap: 12px;

            margin-bottom: 20px;

        }


        .toolbar button {

            border: none;

            padding: 11px 18px;

            border-radius: 8px;

            cursor: pointer;

            font-size: 14px;

            font-weight: 600;

        }


        .print-btn {

            background: #173b66;

            color: white;

        }


        .close-btn {

            background: white;

            color: #173b66;

            border: 1px solid #d7dee8 !important;

        }


        .receipt {

            background: white;

            border-radius: 14px;

            overflow: hidden;

            box-shadow:
                0 10px 35px
                rgba(23, 59, 102, 0.10);

        }


        .receipt-header {

            padding: 32px 38px;

            background:
                linear-gradient(
                    135deg,
                    #173b66,
                    #159a9c
                );

            color: white;

            display: flex;

            justify-content: space-between;

            align-items: center;

            gap: 25px;

        }


        .brand {

            display: flex;

            align-items: center;

            gap: 14px;

        }


        .brand-logo {

            width: 52px;

            height: 52px;

            border-radius: 50%;

            background: white;

            color: #173b66;

            display: flex;

            align-items: center;

            justify-content: center;

            font-weight: 800;

            font-size: 18px;

        }


        .brand h1 {

            margin: 0;

            font-size: 25px;

        }


        .brand p {

            margin: 5px 0 0;

            opacity: 0.85;

            font-size: 12px;

        }


        .receipt-title {

            text-align: right;

        }

        .receipt-brand {
    text-align: left;
}

.receipt-brand-name {
    font-family: Arial, sans-serif;
    font-size: 25px;
    font-weight: 800;
    letter-spacing: -1px;
}

.receipt-brand-name .brand-black {
    color: #111827;
}

.receipt-brand-name .brand-blue {
    color: #2563eb;
}

.receipt-brand-subtitle {
    margin-top: 4px;
    font-family: Arial, sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.8px;
    color: #64748b;
}
        .receipt-title span {

            display: block;

            font-size: 11px;

            letter-spacing: 1.5px;

            opacity: 0.8;

            margin-bottom: 5px;

        }


        .receipt-title strong {

            font-size: 20px;

        }


        .receipt-body {

            padding: 38px;

        }


        .section-label {

            font-size: 11px;

            font-weight: 700;

            letter-spacing: 1.2px;

            color: #159a9c;

            margin-bottom: 14px;

        }


        .details-grid {

            display: grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap: 1px;

            background: #e5eaf0;

            border: 1px solid #e5eaf0;

            border-radius: 10px;

            overflow: hidden;

            margin-bottom: 30px;

        }


        .detail {

            background: white;

            padding: 18px;

        }


        .detail span {

            display: block;

            font-size: 11px;

            color: #64748b;

            margin-bottom: 6px;

            text-transform: uppercase;

            letter-spacing: 0.5px;

        }


        .detail strong {

            display: block;

            color: #173b66;

            font-size: 15px;

        }


        .status {

            display: inline-block;

            padding: 5px 10px;

            border-radius: 20px;

            background: #e7f7f4;

            color: #16847f;

            font-size: 12px;

        }


        .message-box {

            border: 1px solid #e5eaf0;

            border-radius: 10px;

            padding: 20px;

            background: #f8fafc;

            margin-bottom: 30px;

        }


        .message-box p {

            margin: 0;

            line-height: 1.7;

            font-size: 14px;

            color: #475569;

        }


        .receipt-note {

            padding: 16px;

            border-radius: 8px;

            background: #eef6fa;

            color: #52677d;

            font-size: 12px;

            line-height: 1.6;

            margin-bottom: 30px;

        }


        .receipt-footer {

            padding-top: 20px;

            border-top: 1px solid #e5eaf0;

            display: flex;

            justify-content: space-between;

            gap: 20px;

            font-size: 11px;

            color: #94a3b8;

        }


        @media (max-width: 600px) {

            body {

                padding: 15px;

            }


            .receipt-header {

                flex-direction: column;

                align-items: flex-start;

            }


            .receipt-title {

                text-align: left;

            }


            .receipt-body {

                padding: 22px;

            }


            .details-grid {

                grid-template-columns: 1fr;

            }


            .receipt-footer {

                flex-direction: column;

            }

        }


        @media print {

            body {

                background: white;

                padding: 0;

            }


            .toolbar {

                display: none;

            }


            .receipt {

                box-shadow: none;

                border-radius: 0;

            }

        }

    </style>

</head>


<body>


<div class="receipt-wrapper">


    <div class="toolbar">

        <button
            class="close-btn"
            onclick="window.close()"
        >
            Close
        </button>


        <button
            class="print-btn"
            onclick="window.print()"
        >
            Download / Print Receipt
        </button>

    </div>


    <div class="receipt">


        <!-- HEADER -->

        <div class="receipt-header">


            <div class="brand">

               <div class="receipt-brand">
    <div class="receipt-brand-name">
        <span class="brand-black">Black</span><span class="brand-blue">Pepper</span>
    </div>
    <div class="receipt-brand-subtitle">
        InfoServices
    </div>
</div>


                

            </div>


            <div class="receipt-title">

                <span>
                    INQUIRY RECEIPT
                </span>

                <strong>
                    ${escapeHTML(receiptNumber)}
                </strong>

            </div>


        </div>


        <!-- BODY -->

        <div class="receipt-body">


            <div class="section-label">
                INQUIRY INFORMATION
            </div>


            <div class="details-grid">


                <div class="detail">

                    <span>
                        Client Name
                    </span>

                    <strong>
                        ${escapeHTML(clientName)}
                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Inquiry ID
                    </span>

                    <strong>
                        #${escapeHTML(inquiryId)}
                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Requested Service
                    </span>

                    <strong>
                        ${escapeHTML(service)}
                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Inquiry Date
                    </span>

                    <strong>
                        ${escapeHTML(formattedDate)}
                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Status
                    </span>

                    <strong>

                        <span class="status">

                            ${escapeHTML(status)}

                        </span>

                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Email
                    </span>

                    <strong>
                        ${escapeHTML(email)}
                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Contact
                    </span>

                    <strong>
                        ${escapeHTML(phone)}
                    </strong>

                </div>


            </div>


            <div class="section-label">
                INQUIRY MESSAGE
            </div>


            <div class="message-box">

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>


            


            <div class="receipt-footer">

                <span>
                    BlackPepper Business Intelligence Dashboard
                </span>

                <span>
                    Receipt: ${escapeHTML(receiptNumber)}
                </span>

            </div>


        </div>


    </div>


</div>


</body>

</html>

    `);


    receiptWindow.document.close();


    console.log(
        "Inquiry receipt generated:",
        {
            receiptNumber,
            inquiry
        }
    );

}