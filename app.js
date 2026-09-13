let transfers = [];

let beforePhotoData = createEmptyPhotos();
let afterPhotoData = createEmptyPhotos();

let finishingTransferId = null;
let checklistTransferId = null;
let editingTransferId = null;

let timerInterval = null;


const photoTypes = [
    "mittaristo",
    "vasen",
    "oikea",
    "edesta",
    "takaa"
];


const photoNames = {
    mittaristo: "Mittaristo",
    vasen: "Vasen sivu",
    oikea: "Oikea sivu",
    edesta: "Edestä",
    takaa: "Takaa"
};


// =========================================================
// ENNEN AJOA - TARKISTUSLISTA
// =========================================================

const preDriveChecklist = [
    {
        id: "outside",
        icon: "🚗",
        title: "Auto ulkoisesti tarkistettu",
        description: "Korin ja auton yleinen kunto tarkistettu."
    },
    {
        id: "tires",
        icon: "🛞",
        title: "Renkaat tarkistettu",
        description: "Renkaat näyttävät olevan kunnossa."
    },
    {
        id: "dashboard",
        icon: "📊",
        title: "Mittaristo tarkistettu",
        description: "Mittaristo, polttoaine / akku ja varoitusvalot tarkistettu."
    },
    {
        id: "damage",
        icon: "🔎",
        title: "Vauriot tarkistettu",
        description: "Auton olemassa olevat vauriot tarkistettu."
    },
    {
        id: "photos",
        icon: "📸",
        title: "Ennen ajoa -kuvat otettu",
        description: "Tarvittavat kuvat autosta on otettu."
    },
    {
        id: "keys",
        icon: "🔑",
        title: "Avaimet mukana",
        description: "Auton avaimet ovat mukana."
    },
    {
        id: "documents",
        icon: "📄",
        title: "Asiakirjat / tavarat mukana",
        description: "Tarvittavat asiakirjat ja tavarat ovat mukana."
    },
    {
        id: "start",
        icon: "▶️",
        title: "Auto käynnistyy normaalisti",
        description: "Auto käynnistyy ja toimii normaalisti."
    },
    {
        id: "destination",
        icon: "🏁",
        title: "Kohde tarkistettu",
        description: "Oikea kohde ja toimituspaikka varmistettu."
    },
    {
        id: "route",
        icon: "🗺️",
        title: "Reitti tarkistettu",
        description: "Reitti lähtöpaikasta kohteeseen on tarkistettu."
    }
];


// =========================================================
// TYHJÄT KUVAT
// =========================================================

function createEmptyPhotos() {

    return {
        mittaristo: [],
        vasen: [],
        oikea: [],
        edesta: [],
        takaa: []
    };
}


// =========================================================
// NORMALISOI KUVAT
// =========================================================

function normalizePhotos(photos) {

    const result = createEmptyPhotos();

    if (!photos) {
        return result;
    }

    photoTypes.forEach(type => {

        if (Array.isArray(photos[type])) {

            result[type] = photos[type];

        } else if (photos[type]) {

            result[type] = [
                photos[type]
            ];
        }

    });


    if (Array.isArray(photos.sivut)) {

        if (photos.sivut[0]) {

            result.vasen = [
                photos.sivut[0]
            ];
        }


        if (photos.sivut[1]) {

            result.oikea = [
                photos.sivut[1]
            ];
        }
    }


    return result;
}


// =========================================================
// KUVAMÄÄRÄ
// =========================================================

function getPhotoCount(photos) {

    if (!photos) {
        return 0;
    }


    return Object.values(photos)
        .reduce(
            (total, group) => {

                if (!Array.isArray(group)) {
                    return total;
                }

                return total + group.length;

            },
            0
        );
}


// =========================================================
// ONKO KAIKKI 5 KUVAA?
// =========================================================

function hasAllFivePhotos(photos) {

    if (!photos) {
        return false;
    }


    return photoTypes.every(
        type =>
            Array.isArray(
                photos[type]
            )
            &&
            photos[type].length > 0
    );
}


// =========================================================
// LATAA SIIRROT
// =========================================================

function loadTransfers() {

    const saved =
        localStorage.getItem(
            "siirtoAppTransfers"
        );


    if (saved) {

        try {

            transfers =
                JSON.parse(saved);


            transfers =
                transfers.map(
                    transfer => ({

                        ...transfer,

                        beforePhotos:
                            normalizePhotos(
                                transfer.beforePhotos
                            ),

                        afterPhotos:
                            normalizePhotos(
                                transfer.afterPhotos
                            ),

                        checklist:
                            transfer.checklist || {},

                        startedAt:
                            transfer.startedAt || null,

                        completedAt:
                            transfer.completedAt || null,

                        driveDuration:
                            transfer.driveDuration || 0

                    })
                );


        } catch {

            transfers = [];
        }
    }


    renderTransfers();

    updateDashboard();

    startActiveTimer();
}


// =========================================================
// TALLENNA
// =========================================================

function saveTransfers() {

    localStorage.setItem(
        "siirtoAppTransfers",
        JSON.stringify(transfers)
    );
}


// =========================================================
// AVAA UUSI SIIRTO TAI MUOKKAA SIIRTOA
// =========================================================

function openForm(id = null) {

    const modal =
        document.getElementById(
            "formModal"
        );

    const form =
        document.getElementById(
            "transferForm"
        );


    if (!modal || !form) {
        return;
    }


    editingTransferId =
        id !== null
            ? Number(id)
            : null;


    // =====================================================
    // MUOKKAUSTILA
    // =====================================================

    if (editingTransferId !== null) {

        const transfer =
            transfers.find(
                t =>
                    t.id ===
                    editingTransferId
            );


        if (!transfer) {

            editingTransferId =
                null;

            return;
        }


        document.getElementById(
            "customer"
        ).value =
            transfer.customer || "";


        document.getElementById(
            "date"
        ).value =
            transfer.date || "";


        document.getElementById(
            "time"
        ).value =
            transfer.time || "";


        document.getElementById(
            "vehicle"
        ).value =
            transfer.vehicle || "";


        document.getElementById(
            "from"
        ).value =
            transfer.from || "";


        document.getElementById(
            "to"
        ).value =
            transfer.to || "";


        document.getElementById(
            "notes"
        ).value =
            transfer.notes || "";


        beforePhotoData =
            normalizePhotos(
                transfer.beforePhotos
            );


        renderExistingBeforePhotos();


        updateBeforePhotoStatuses();

        updateBeforePhotoCount();


        const title =
            modal.querySelector(
                "h2"
            );


        if (title) {

            title.textContent =
                "✏️ Muokkaa siirtoa";
        }


        const submitButton =
            form.querySelector(
                ".submit-btn"
            );


        if (submitButton) {

            submitButton.innerHTML = `
                <span>💾</span>
                Tallenna muutokset
                <span class="submit-arrow">→</span>
            `;
        }


    } else {

        // =================================================
        // UUSI SIIRTO
        // =================================================

        form.reset();


        const now =
            new Date();


        document.getElementById(
            "date"
        ).value =
            now.toISOString()
                .split("T")[0];


        document.getElementById(
            "time"
        ).value =
            now.toTimeString()
                .slice(0, 5);


        resetBeforePhotos();


        const title =
            modal.querySelector(
                "h2"
            );


        if (title) {

            title.textContent =
                "🚗 Lisää siirtoajo";
        }


        const submitButton =
            form.querySelector(
                ".submit-btn"
            );


        if (submitButton) {

            submitButton.innerHTML = `
                <span>🚗</span>
                Lisää siirto
                <span class="submit-arrow">→</span>
            `;
        }
    }


    modal.classList.add(
        "active"
    );
}


// =========================================================
// RENDERÖI MUOKKAUSTILAN KUVAT
// =========================================================

function renderExistingBeforePhotos() {

    photoTypes.forEach(
        type => {

            const status =
                document.getElementById(
                    `before-${type}-status`
                );


            if (!status) {
                return;
            }


            const hasPhoto =
                beforePhotoData[type] &&
                beforePhotoData[type].length > 0;


            if (hasPhoto) {

                status.textContent =
                    "✓ Kuva lisätty";

                status.classList.add(
                    "has-photo"
                );

            } else {

                status.textContent =
                    "Ei kuvaa";

                status.classList.remove(
                    "has-photo"
                );
            }

        }
    );


    renderPhotoPreview(
        "before"
    );
}


// =========================================================
// PÄIVITÄ ENNEN-KUVIEN STATUS
// =========================================================

function updateBeforePhotoStatuses() {

    photoTypes.forEach(
        type => {

            updatePhotoStatus(
                "before",
                type
            );

        }
    );
}


// =========================================================
// SULJE UUSI / MUOKKAUS
// =========================================================

function closeForm() {

    document
        .getElementById(
            "formModal"
        )
        .classList.remove(
            "active"
        );


    document
        .getElementById(
            "transferForm"
        )
        .reset();


    editingTransferId =
        null;


    resetBeforePhotos();


    const title =
        document
            .getElementById(
                "formModal"
            )
            .querySelector(
                "h2"
            );


    if (title) {

        title.textContent =
            "🚗 Lisää siirtoajo";
    }


    const submitButton =
        document
            .getElementById(
                "transferForm"
            )
            .querySelector(
                ".submit-btn"
            );


    if (submitButton) {

        submitButton.innerHTML = `
            <span>🚗</span>
            Lisää siirto
            <span class="submit-arrow">→</span>
        `;
    }
}


// =========================================================
// RESET ENNEN-KUVAT
// =========================================================

function resetBeforePhotos() {

    beforePhotoData =
        createEmptyPhotos();


    photoTypes.forEach(
        type => {

            const status =
                document.getElementById(
                    `before-${type}-status`
                );


            if (status) {

                status.textContent =
                    "Ei kuvaa";

                status.classList.remove(
                    "has-photo"
                );
            }


            const input =
                document.getElementById(
                    `before-${type}`
                );


            if (input) {

                input.value = "";
            }

        }
    );


    const preview =
        document.getElementById(
            "beforePreview"
        );


    if (preview) {

        preview.innerHTML = "";
    }


    updateBeforePhotoCount();
}


// =========================================================
// LISÄÄ KUVA
// =========================================================

function addPhoto(
    location,
    type
) {

    const input =
        document.getElementById(
            `${location}-${type}`
        );


    if (
        !input ||
        !input.files.length
    ) {
        return;
    }


    const target =
        location === "before"
            ? beforePhotoData
            : afterPhotoData;


    const file =
        input.files[0];


    if (!file.type.startsWith("image/")) {

        alert(
            "Valitse kuvatiedosto."
        );

        input.value = "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            target[type] = [
                event.target.result
            ];


            updatePhotoStatus(
                location,
                type
            );


            if (
                location ===
                "before"
            ) {

                updateBeforePhotoCount();

            } else {

                updateAfterPhotoCount();
            }

        };


    reader.readAsDataURL(file);
}


// =========================================================
// KUVAN STATUS
// =========================================================

function updatePhotoStatus(
    location,
    type
) {

    const photos =
        location === "before"
            ? beforePhotoData
            : afterPhotoData;


    const count =
        photos[type]?.length || 0;


    const status =
        document.getElementById(
            `${location}-${type}-status`
        );


    if (!status) {
        return;
    }


    if (count === 0) {

        status.textContent =
            "Ei kuvaa";

        status.classList.remove(
            "has-photo"
        );

    } else {

        status.textContent =
            "✓ Kuva lisätty";

        status.classList.add(
            "has-photo"
        );
    }


    renderPhotoPreview(
        location
    );
}


// =========================================================
// ESITYSKUVAT
// =========================================================

function renderPhotoPreview(
    location
) {

    const photos =
        location === "before"
            ? beforePhotoData
            : afterPhotoData;


    const container =
        document.getElementById(
            location === "before"
                ? "beforePreview"
                : "afterPreview"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    photoTypes.forEach(
        type => {

            const list =
                photos[type] || [];


            list.forEach(
                photo => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "photo-preview-item";


                    const img =
                        document.createElement(
                            "img"
                        );


                    img.src =
                        photo;


                    img.alt =
                        photoNames[type];


                    img.style.width =
                        "100%";

                    img.style.height =
                        "100%";

                    img.style.objectFit =
                        "cover";

                    img.style.display =
                        "block";


                    img.style.cursor =
                        "zoom-in";


                    img.onclick =
                        function () {

                            openImageViewer(
                                photo,
                                photoNames[type]
                            );

                        };


                    const label =
                        document.createElement(
                            "span"
                        );


                    label.textContent =
                        photoNames[type];


                    item.appendChild(
                        img
                    );


                    item.appendChild(
                        label
                    );


                    container.appendChild(
                        item
                    );

                }
            );

        }
    );
}


// =========================================================
// KUVAN SUURENTAMINEN
// =========================================================

function openImageViewer(
    image,
    title
) {

    let viewer =
        document.getElementById(
            "imageViewer"
        );


    if (!viewer) {

        viewer =
            document.createElement(
                "div"
            );

        viewer.id =
            "imageViewer";


        viewer.style.position =
            "fixed";

        viewer.style.inset =
            "0";

        viewer.style.background =
            "rgba(0,0,0,0.92)";

        viewer.style.zIndex =
            "99999";

        viewer.style.display =
            "flex";

        viewer.style.flexDirection =
            "column";

        viewer.style.alignItems =
            "center";

        viewer.style.justifyContent =
            "center";

        viewer.style.padding =
            "20px";

        viewer.style.cursor =
            "zoom-out";


        viewer.innerHTML = `

            <div
                id="imageViewerTitle"
                style="
                    color:white;
                    font-size:16px;
                    font-weight:700;
                    margin-bottom:15px;
                "
            ></div>

            <img
                id="imageViewerImage"
                style="
                    max-width:95vw;
                    max-height:80vh;
                    object-fit:contain;
                    border-radius:14px;
                    box-shadow:0 20px 70px rgba(0,0,0,.5);
                "
            >

            <div
                style="
                    color:rgba(255,255,255,.65);
                    font-size:12px;
                    margin-top:15px;
                "
            >
                Sulje napauttamalla
            </div>

        `;


        viewer.onclick =
            function () {

                viewer.remove();

            };


        document.body.appendChild(
            viewer
        );
    }


    document.getElementById(
        "imageViewerTitle"
    ).textContent =
        title;


    document.getElementById(
        "imageViewerImage"
    ).src =
        image;
}


// =========================================================
// ENNEN-KUVIEN MÄÄRÄ
// =========================================================

function updateBeforePhotoCount() {

    const count =
        getPhotoCount(
            beforePhotoData
        );


    const element =
        document.getElementById(
            "beforePhotoCount"
        );


    if (element) {

        element.textContent =
            `${count} / 5`;
    }
}


// =========================================================
// KOHTEEN KUVIEN MÄÄRÄ
// =========================================================

function updateAfterPhotoCount() {

    const count =
        getPhotoCount(
            afterPhotoData
        );


    const element =
        document.getElementById(
            "afterPhotoCount"
        );


    if (element) {

        element.textContent =
            `${count} / 5`;
    }


    const button =
        document.getElementById(
            "finishTransferBtn"
        );


    if (!button) {
        return;
    }


    if (
        hasAllFivePhotos(
            afterPhotoData
        )
    ) {

        button.disabled =
            false;

        button.innerHTML =
            `<span>✅</span>
             Lopeta siirto
             <span class="submit-arrow">→</span>`;

    } else {

        button.disabled =
            true;

        button.innerHTML =
            `<span>📸</span>
             Lisää kaikki kuvat (${count}/5)`;
    }
}


// =========================================================
// UUDEN SIIRRON / MUOKKAUKSEN TALLENNUS
// =========================================================

document
    .getElementById(
        "transferForm"
    )
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !hasAllFivePhotos(
                    beforePhotoData
                )
            ) {

                alert(
                    "Ota kaikki 5 kuvaa ennen siirron lisäämistä."
                );

                return;
            }


            // =================================================
            // MUOKATAAN VANHAA SIIRTOA
            // =================================================

            if (
                editingTransferId !== null
            ) {

                const transfer =
                    transfers.find(
                        t =>
                            t.id ===
                            editingTransferId
                    );


                if (!transfer) {

                    alert(
                        "Siirtoa ei löytynyt."
                    );

                    return;
                }


                transfer.customer =
                    document
                        .getElementById(
                            "customer"
                        )
                        .value
                        .trim();


                transfer.date =
                    document
                        .getElementById(
                            "date"
                        )
                        .value;


                transfer.time =
                    document
                        .getElementById(
                            "time"
                        )
                        .value;


                transfer.vehicle =
                    document
                        .getElementById(
                            "vehicle"
                        )
                        .value
                        .trim();


                transfer.from =
                    document
                        .getElementById(
                            "from"
                        )
                        .value
                        .trim();


                transfer.to =
                    document
                        .getElementById(
                            "to"
                        )
                        .value
                        .trim();


                transfer.notes =
                    document
                        .getElementById(
                            "notes"
                        )
                        .value
                        .trim();


                transfer.beforePhotos =
                    normalizePhotos(
                        beforePhotoData
                    );


                /*
                 * TÄRKEÄÄ:
                 *
                 * Näitä ei muuteta:
                 * - id
                 * - status
                 * - afterPhotos
                 * - startedAt
                 * - completedAt
                 * - driveDuration
                 * - checklist
                 */


                saveTransfers();

                closeForm();

                renderTransfers();

                updateDashboard();

                return;
            }


            // =================================================
            // LUODAAN UUSI SIIRTO
            // =================================================

            const transfer = {

                id: Date.now(),

                customer:
                    document
                        .getElementById(
                            "customer"
                        )
                        .value
                        .trim(),

                date:
                    document
                        .getElementById(
                            "date"
                        )
                        .value,

                time:
                    document
                        .getElementById(
                            "time"
                        )
                        .value,

                vehicle:
                    document
                        .getElementById(
                            "vehicle"
                        )
                        .value
                        .trim(),

                from:
                    document
                        .getElementById(
                            "from"
                        )
                        .value
                        .trim(),

                to:
                    document
                        .getElementById(
                            "to"
                        )
                        .value
                        .trim(),

                notes:
                    document
                        .getElementById(
                            "notes"
                        )
                        .value
                        .trim(),

                beforePhotos:
                    normalizePhotos(
                        beforePhotoData
                    ),

                afterPhotos:
                    createEmptyPhotos(),

                status:
                    "planned",

                createdAt:
                    new Date()
                        .toISOString(),

                startedAt:
                    null,

                completedAt:
                    null,

                driveDuration:
                    0,

                checklist:
                    {}

            };


            transfers.push(
                transfer
            );


            saveTransfers();

            closeForm();

            renderTransfers();

            updateDashboard();

        }
    );


// =========================================================
// RENDERÖI SIIRROT
// =========================================================

function renderTransfers() {

    const list =
        document.getElementById(
            "transferList"
        );


    const search =
        document.getElementById(
            "searchInput"
        )
            .value
            .toLowerCase();


    const filter =
        document.getElementById(
            "filterStatus"
        )
            .value;


    const filtered =
        transfers
            .filter(
                transfer => {

                    const customer =
                        transfer.customer ||
                        "";

                    const from =
                        transfer.from ||
                        "";

                    const to =
                        transfer.to ||
                        "";

                    const vehicle =
                        transfer.vehicle ||
                        "";


                    const matchesSearch =

                        customer
                            .toLowerCase()
                            .includes(
                                search
                            )

                        ||

                        from
                            .toLowerCase()
                            .includes(
                                search
                            )

                        ||

                        to
                            .toLowerCase()
                            .includes(
                                search
                            )

                        ||

                        vehicle
                            .toLowerCase()
                            .includes(
                                search
                            );


                    const matchesFilter =

                        filter ===
                        "all"

                        ||

                        transfer.status ===
                        filter;


                    return (
                        matchesSearch &&
                        matchesFilter
                    );

                }
            )
            .sort(
                (a, b) =>
                    b.id - a.id
            );


    if (!filtered.length) {

        list.innerHTML = `

            <div class="empty">

                <div>🚗</div>

                <h3>
                    Ei siirtoja
                </h3>

                <p>
                    Lisää ensimmäinen siirto
                    painamalla "Uusi siirto".
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML =
        filtered
            .map(
                createTransferCard
            )
            .join("");
}


// =========================================================
// SIIRTO-KORTTI
// =========================================================

function createTransferCard(
    transfer
) {

    const statusNames = {

        planned:
            "Suunniteltu",

        driving:
            "Ajo käynnissä",

        completed:
            "Valmis"

    };


    const photoCount =
        getPhotoCount(
            transfer.beforePhotos
        )
        +
        getPhotoCount(
            transfer.afterPhotos
        );


    const drivingTime =
        transfer.status === "driving"
            ? formatDuration(
                getCurrentDriveDuration(
                    transfer
                )
            )
            : formatDuration(
                transfer.driveDuration || 0
            );


    const timerHtml =
        transfer.status === "driving"

            ?

            `
                <div
                    class="live-drive-timer"
                    data-timer-id="${transfer.id}"
                >
                    🟢 ${drivingTime}
                </div>
            `

            :

            transfer.driveDuration

                ?

                `
                    <div
                        class="live-drive-timer"
                    >
                        ⏱️ ${drivingTime}
                    </div>
                `

                :

                "";


    return `

        <div class="transfer-card">

            <div class="transfer-top">

                <div class="transfer-customer">

                    ${escapeHtml(
        transfer.customer
    )}

                </div>


                <span
                    class="status ${transfer.status}"
                >

                    ${statusNames[
        transfer.status
        ] ||
        "Suunniteltu"}

                </span>

            </div>


            <div class="route">

                <div class="route-point">

                    📍

                    <strong>
                        Lähtö
                    </strong>

                    <br>

                    ${escapeHtml(
            transfer.from
        )}

                </div>


                <div class="route-arrow">
                    ➜
                </div>


                <div class="route-point">

                    🏁

                    <strong>
                        Kohde
                    </strong>

                    <br>

                    ${escapeHtml(
            transfer.to
        )}

                </div>

            </div>


            <div class="transfer-info">

                <span>
                    📅
                    ${formatDate(
            transfer.date
        )}
                </span>


                <span>
                    🕐
                    ${transfer.time}
                </span>


                ${transfer.vehicle
            ?
            `
                            <span>
                                🚗
                                ${escapeHtml(
                transfer.vehicle
            )}
                            </span>
                        `
            :
            ""
        }


                <span>
                    📸
                    ${photoCount} kuvaa
                </span>

            </div>


            ${timerHtml}


            <div class="transfer-actions">

                <button
                    class="action-btn primary"
                    onclick="showDetails(
                        ${transfer.id}
                    )"
                >
                    👁️ Avaa
                </button>


                <button
                    class="action-btn"
                    onclick="openMaps(
                        ${transfer.id}
                    )"
                >
                    🗺️ Reitti
                </button>


                <button
                    class="action-btn"
                    onclick="openForm(
                        ${transfer.id}
                    )"
                >
                    ✏️ Muokkaa
                </button>


                ${transfer.status === "planned"

            ?

            `
                            <button
                                class="action-btn start-drive-btn"
                                onclick="changeStatus(
                                    ${transfer.id},
                                    'driving'
                                )"
                            >
                                🚗 Aloita ajo
                            </button>
                        `

            :

            ""
        }


                ${transfer.status === "driving"

            ?

            `
                            <button
                                class="action-btn finish-action"
                                onclick="openFinishModal(
                                    ${transfer.id}
                                )"
                            >
                                🏁 Lopeta siirto
                            </button>
                        `

            :

            ""
        }


                <button
                    class="action-btn danger"
                    onclick="deleteTransfer(
                        ${transfer.id}
                    )"
                >
                    🗑️ Poista
                </button>

            </div>

        </div>

    `;
}


// =========================================================
// ALOITA AJO
// =========================================================

function changeStatus(
    id,
    status
) {

    const transfer =
        transfers.find(
            t => t.id === id
        );


    if (!transfer) {
        return;
    }


    if (
        status === "driving"
    ) {

        openPreDriveChecklist(
            id
        );

        return;
    }


    transfer.status =
        status;


    saveTransfers();

    renderTransfers();

    updateDashboard();
}


// =========================================================
// AVAA ENNEN AJOA -TARKISTUSLISTA
// =========================================================

function openPreDriveChecklist(
    id
) {

    const transfer =
        transfers.find(
            t => t.id === id
        );


    if (!transfer) {
        return;
    }


    checklistTransferId =
        id;


    if (!transfer.checklist) {

        transfer.checklist =
            {};
    }


    createChecklistModal();


    preDriveChecklist.forEach(
        item => {

            const checkbox =
                document.getElementById(
                    `check-${item.id}`
                );


            if (checkbox) {

                checkbox.checked =
                    transfer.checklist[
                    item.id
                    ] === true;
            }

        }
    );


    updateChecklistProgress();


    document
        .getElementById(
            "preDriveModal"
        )
        .classList.add(
            "active"
        );
}


// =========================================================
// LUO TARKISTUSLISTA
// =========================================================

function createChecklistModal() {

    let modal =
        document.getElementById(
            "preDriveModal"
        );


    if (modal) {
        return;
    }


    modal =
        document.createElement(
            "div"
        );


    modal.id =
        "preDriveModal";


    modal.className =
        "modal";


    modal.innerHTML = `

        <div
            class="modal-content"
            style="
                max-width:620px;
            "
        >

            <div class="modal-header">

                <div>

                    <span class="modal-eyebrow">
                        ENNEN AJOA
                    </span>

                    <h2>
                        🚗 Tarkistuslista
                    </h2>

                </div>

                <button
                    type="button"
                    class="close-btn"
                    onclick="closePreDriveChecklist()"
                >
                    ×
                </button>

            </div>


            <div
                style="
                    margin-bottom:20px;
                    padding:16px;
                    border-radius:14px;
                    background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.08);
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:10px;
                    "
                >

                    <strong>
                        Ennen kuin lähdet
                    </strong>

                    <span
                        id="checklistProgressText"
                        style="
                            font-weight:800;
                        "
                    >
                        0 / ${preDriveChecklist.length}
                    </span>

                </div>


                <div
                    style="
                        height:8px;
                        border-radius:999px;
                        background:rgba(255,255,255,.08);
                        overflow:hidden;
                    "
                >

                    <div
                        id="checklistProgressBar"
                        style="
                            height:100%;
                            width:0%;
                            border-radius:999px;
                            background:linear-gradient(90deg,#4f8cff,#6c63ff);
                            transition:.2s;
                        "
                    ></div>

                </div>

            </div>


            <div
                id="preDriveChecklistItems"
                style="
                    display:flex;
                    flex-direction:column;
                    gap:10px;
                "
            >

                ${preDriveChecklist.map(
        item => `

                        <label
                            for="check-${item.id}"
                            style="
                                display:flex;
                                align-items:center;
                                gap:13px;
                                padding:15px;
                                border-radius:14px;
                                border:1px solid rgba(255,255,255,.08);
                                background:rgba(255,255,255,.035);
                                cursor:pointer;
                                transition:.2s;
                            "
                        >

                            <input
                                type="checkbox"
                                id="check-${item.id}"
                                onchange="updateChecklistProgress()"
                                style="
                                    width:20px;
                                    height:20px;
                                    flex:0 0 auto;
                                    accent-color:#5d8cff;
                                "
                            >

                            <span
                                style="
                                    font-size:22px;
                                    flex:0 0 auto;
                                "
                            >
                                ${item.icon}
                            </span>

                            <span
                                style="
                                    display:flex;
                                    flex-direction:column;
                                    gap:3px;
                                "
                            >

                                <strong>
                                    ${item.title}
                                </strong>

                                <small
                                    style="
                                        opacity:.55;
                                        line-height:1.4;
                                    "
                                >
                                    ${item.description}
                                </small>

                            </span>

                        </label>

                    `
    ).join("")}

            </div>


            <button
                type="button"
                id="startDrivingConfirmBtn"
                class="submit-btn"
                onclick="confirmStartDriving()"
                disabled
                style="
                    margin-top:20px;
                "
            >

                <span>
                    🚗
                </span>

                Aloita ajo

                <span class="submit-arrow">
                    →
                </span>

            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );
}


// =========================================================
// TARKISTUSLISTAN EDISTYMINEN
// =========================================================

function updateChecklistProgress() {

    const transfer =
        transfers.find(
            t => t.id === checklistTransferId
        );


    if (!transfer) {
        return;
    }


    if (!transfer.checklist) {

        transfer.checklist =
            {};
    }


    let checked = 0;


    preDriveChecklist.forEach(
        item => {

            const checkbox =
                document.getElementById(
                    `check-${item.id}`
                );


            if (
                checkbox &&
                checkbox.checked
            ) {

                checked++;

                transfer.checklist[
                    item.id
                ] = true;

            } else if (checkbox) {

                transfer.checklist[
                    item.id
                ] = false;
            }

        }
    );


    const total =
        preDriveChecklist.length;


    const percentage =
        Math.round(
            (checked / total) * 100
        );


    const text =
        document.getElementById(
            "checklistProgressText"
        );


    if (text) {

        text.textContent =
            `${checked} / ${total}`;
    }


    const bar =
        document.getElementById(
            "checklistProgressBar"
        );


    if (bar) {

        bar.style.width =
            `${percentage}%`;
    }


    const button =
        document.getElementById(
            "startDrivingConfirmBtn"
        );


    if (button) {

        button.disabled =
            checked !== total;

        if (checked === total) {

            button.innerHTML = `
                <span>🚗</span>
                Kaikki tarkistettu – aloita ajo
                <span class="submit-arrow">→</span>
            `;

        } else {

            button.innerHTML = `
                <span>🔒</span>
                Tarkista kaikki kohdat
            `;
        }
    }


    saveTransfers();
}


// =========================================================
// VAHVISTA AJO
// =========================================================

function confirmStartDriving() {

    const transfer =
        transfers.find(
            t => t.id === checklistTransferId
        );


    if (!transfer) {
        return;
    }


    const allChecked =
        preDriveChecklist.every(
            item =>
                transfer.checklist &&
                transfer.checklist[
                item.id
                ] === true
        );


    if (!allChecked) {

        alert(
            "Tarkista kaikki kohdat ennen ajoa."
        );

        return;
    }


    transfer.status =
        "driving";


    transfer.startedAt =
        new Date()
            .toISOString();


    transfer.completedAt =
        null;


    transfer.driveDuration =
        0;


    saveTransfers();


    closePreDriveChecklist();


    renderTransfers();

    updateDashboard();

    startActiveTimer();
}


// =========================================================
// SULJE TARKISTUSLISTA
// =========================================================

function closePreDriveChecklist() {

    const modal =
        document.getElementById(
            "preDriveModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );
    }


    checklistTransferId =
        null;
}


// =========================================================
// ALOITA AKTIIVISEN AJAN SEURANTA
// =========================================================

function startActiveTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );
    }


    timerInterval =
        setInterval(
            function () {

                const activeTransfers =
                    transfers.filter(
                        transfer =>
                            transfer.status ===
                            "driving"
                    );


                if (!activeTransfers.length) {
                    return;
                }


                activeTransfers.forEach(
                    transfer => {

                        const element =
                            document.querySelector(
                                `[data-timer-id="${transfer.id}"]`
                            );


                        if (!element) {
                            return;
                        }


                        element.textContent =
                            `🟢 ${formatDuration(
                                getCurrentDriveDuration(
                                    transfer
                                )
                            )}`;

                    }
                );

            },
            1000
        );
}


// =========================================================
// AJON KESTO
// =========================================================

function getCurrentDriveDuration(
    transfer
) {

    if (
        !transfer ||
        !transfer.startedAt
    ) {

        return 0;
    }


    const start =
        new Date(
            transfer.startedAt
        ).getTime();


    const now =
        Date.now();


    return Math.max(
        0,
        Math.floor(
            (now - start) / 1000
        )
    );
}


// =========================================================
// MUOTOILE AIKA
// =========================================================

function formatDuration(
    seconds
) {

    seconds =
        Math.max(
            0,
            Math.floor(
                Number(seconds) || 0
            )
        );


    const hours =
        Math.floor(
            seconds / 3600
        );


    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );


    const remainingSeconds =
        seconds % 60;


    return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(remainingSeconds).padStart(2, "0")
    ].join(":");
}


// =========================================================
// AVAA LOPETUS
// =========================================================

function openFinishModal(id) {

    const transfer =
        transfers.find(
            t => t.id === id
        );


    if (!transfer) {
        return;
    }


    finishingTransferId =
        id;


    if (
        transfer.status ===
        "driving"
    ) {

        transfer.driveDuration =
            getCurrentDriveDuration(
                transfer
            );
    }


    afterPhotoData =
        normalizePhotos(
            transfer.afterPhotos
        );


    document.getElementById(
        "finishVehicle"
    ).textContent =
        transfer.vehicle ||
        "Ajoneuvo";


    document.getElementById(
        "finishRoute"
    ).textContent =
        `${transfer.from} → ${transfer.to}`;


    resetAfterPhotoInterface();


    document
        .getElementById(
            "finishModal"
        )
        .classList.add(
            "active"
        );
}


// =========================================================
// KOHTEEN KUVIEN RESET
// =========================================================

function resetAfterPhotoInterface() {

    photoTypes.forEach(
        type => {

            const status =
                document.getElementById(
                    `after-${type}-status`
                );


            if (status) {

                const hasPhoto =
                    afterPhotoData[type] &&
                    afterPhotoData[type].length;


                if (hasPhoto) {

                    status.textContent =
                        "✓ Kuva lisätty";

                    status.classList.add(
                        "has-photo"
                    );

                } else {

                    status.textContent =
                        "Ei kuvaa";

                    status.classList.remove(
                        "has-photo"
                    );
                }
            }


            const input =
                document.getElementById(
                    `after-${type}`
                );


            if (input) {
                input.value = "";
            }

        }
    );


    renderPhotoPreview(
        "after"
    );


    updateAfterPhotoCount();
}


// =========================================================
// SULJE LOPETUS
// =========================================================

function closeFinishModal() {

    document
        .getElementById(
            "finishModal"
        )
        .classList.remove(
            "active"
        );


    finishingTransferId =
        null;


    afterPhotoData =
        createEmptyPhotos();
}


// =========================================================
// LOPETA SIIRTO
// =========================================================

function finishTransfer() {

    if (!finishingTransferId) {
        return;
    }


    if (
        !hasAllFivePhotos(
            afterPhotoData
        )
    ) {

        alert(
            "Ota kaikki 5 kuvaa ennen siirron lopettamista."
        );

        return;
    }


    const transfer =
        transfers.find(
            t =>
                t.id ===
                finishingTransferId
        );


    if (!transfer) {
        return;
    }


    if (
        transfer.startedAt
    ) {

        transfer.driveDuration =
            getCurrentDriveDuration(
                transfer
            );
    }


    transfer.afterPhotos =
        normalizePhotos(
            afterPhotoData
        );


    transfer.status =
        "completed";


    transfer.completedAt =
        new Date()
            .toISOString();


    saveTransfers();


    closeFinishModal();

    renderTransfers();

    updateDashboard();
}


// =========================================================
// POISTA
// =========================================================

function deleteTransfer(id) {

    const transfer =
        transfers.find(
            t => t.id === id
        );


    if (!transfer) {
        return;
    }


    const confirmed =
        confirm(
            `Poistetaanko siirto ${transfer.customer}?`
        );


    if (!confirmed) {
        return;
    }


    transfers =
        transfers.filter(
            t => t.id !== id
        );


    saveTransfers();

    renderTransfers();

    updateDashboard();
}


// =========================================================
// GOOGLE MAPS – REITTI
// =========================================================

function openMaps(id) {

    const transfer =
        transfers.find(
            t => t.id === id
        );


    if (!transfer) {
        return;
    }


    const from =
        encodeURIComponent(
            transfer.from
        );


    const to =
        encodeURIComponent(
            transfer.to
        );


    const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${from}` +
        `&destination=${to}`;


    window.open(
        url,
        "_blank"
    );
}


// =========================================================
// TIEDOT
// =========================================================

function showDetails(id) {

    const transfer =
        transfers.find(
            t => t.id === id
        );


    if (!transfer) {
        return;
    }


    const driveDuration =
        transfer.driveDuration
            ? formatDuration(
                transfer.driveDuration
            )
            : "Ei vielä ajettu";


    document.getElementById(
        "detailsTitle"
    ).textContent =
        `🚗 ${transfer.customer}`;


    document.getElementById(
        "detailsContent"
    ).innerHTML = `

        <div class="details-row">

            <strong>
                📍 Reitti
            </strong>

            ${escapeHtml(
        transfer.from
    )}

            →

            ${escapeHtml(
        transfer.to
    )}

        </div>


        <div class="details-row">

            <strong>
                📅 Aika
            </strong>

            ${formatDate(
        transfer.date
    )}

            klo

            ${transfer.time}

        </div>


        <div class="details-row">

            <strong>
                🚗 Ajoneuvo
            </strong>

            ${transfer.vehicle
            ?
            escapeHtml(
                transfer.vehicle
            )
            :
            "Ei ilmoitettu"
        }

        </div>


        <div class="details-row">

            <strong>
                ⏱️ Ajoaika
            </strong>

            ${driveDuration}

        </div>


        <div class="details-row">

            <strong>
                📝 Lisätiedot
            </strong>

            ${transfer.notes
            ?
            escapeHtml(
                transfer.notes
            )
            :
            "Ei lisätietoja"
        }

        </div>


        <div class="details-row">

            <strong>
                📸 Kuvat ennen lähtöä
            </strong>

            ${createDetailsPhotos(
            transfer.beforePhotos
        )}

        </div>


        <div class="details-row">

            <strong>
                🏁 Kuvat kohteessa
            </strong>

            ${createDetailsPhotos(
            transfer.afterPhotos
        )}

        </div>

    `;


    document
        .getElementById(
            "detailsModal"
        )
        .classList.add(
            "active"
        );
}


// =========================================================
// DETAILSIEN KUVAT
// =========================================================

function createDetailsPhotos(
    photos
) {

    const normalized =
        normalizePhotos(
            photos
        );


    const count =
        getPhotoCount(
            normalized
        );


    if (!count) {

        return `
            <p class="no-photos">
                Ei kuvia.
            </p>
        `;
    }


    let html =
        `<div class="details-photo-grid">`;


    photoTypes.forEach(
        type => {

            const list =
                normalized[type] ||
                [];


            list.forEach(
                photo => {

                    html += `

                        <div
                            class="details-photo-item"
                            onclick="openImageViewer(
                                '${photo}',
                                '${photoNames[type]}'
                            )"
                            style="cursor:zoom-in;"
                        >

                            <img
                                src="${photo}"
                                alt="${photoNames[type]}"
                            >

                            <span>
                                ${photoNames[type]}
                            </span>

                        </div>

                    `;

                }
            );

        }
    );


    html +=
        `</div>`;


    return html;
}


// =========================================================
// SULJE DETAILS
// =========================================================

function closeDetails() {

    document
        .getElementById(
            "detailsModal"
        )
        .classList.remove(
            "active"
        );
}


// =========================================================
// DASHBOARD
// =========================================================

function updateDashboard() {

    document.getElementById(
        "totalCount"
    ).textContent =
        transfers.length;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "todayCount"
    ).textContent =
        transfers.filter(
            t =>
                t.date ===
                today
        ).length;


    document.getElementById(
        "activeCount"
    ).textContent =
        transfers.filter(
            t =>
                t.status ===
                "driving"
        ).length;


    document.getElementById(
        "completedCount"
    ).textContent =
        transfers.filter(
            t =>
                t.status ===
                "completed"
        ).length;
}


// =========================================================
// PÄIVÄMÄÄRÄ
// =========================================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const parts =
        date.split("-");


    return `
        ${parts[2]}.
        ${parts[1]}.
        ${parts[0]}
    `.replace(
        /\s/g,
        ""
    );
}


// =========================================================
// HTML TURVALLISUUS
// =========================================================

function escapeHtml(text) {

    if (!text) {
        return "";
    }


    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// =========================================================
// GOOGLE MAPS – KOHTEEN HAKU
// =========================================================

function openGoogleMaps() {

    const destination =
        document
            .getElementById("to")
            .value
            .trim();


    const query =
        destination
            ? destination
            : "";


    const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;


    window.open(
        url,
        "_blank"
    );
}


// =========================================================
// KÄYNNISTYS
// =========================================================

loadTransfers();
