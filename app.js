```javascript
let transfers = [];

let beforePhotoData = createEmptyPhotos();
let afterPhotoData = createEmptyPhotos();

let finishingTransferId = null;

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


// ============================
// TYHJÄT KUVAT
// ============================

function createEmptyPhotos() {
    return {
        mittaristo: [],
        vasen: [],
        oikea: [],
        edesta: [],
        takaa: []
    };
}


// ============================
// NORMALISOI KUVAT
// ============================

function normalizePhotos(photos) {

    const result = createEmptyPhotos();

    if (!photos) {
        return result;
    }

    photoTypes.forEach(type => {

        if (Array.isArray(photos[type])) {
            result[type] = photos[type];

        } else if (photos[type]) {
            result[type] = [photos[type]];
        }
    });

    // Vanhan version "sivut"
    if (Array.isArray(photos.sivut)) {

        if (photos.sivut[0]) {
            result.vasen = [photos.sivut[0]];
        }

        if (photos.sivut[1]) {
            result.oikea = [photos.sivut[1]];
        }
    }

    return result;
}


// ============================
// KUVAMÄÄRÄ
// ============================

function getPhotoCount(photos) {

    if (!photos) {
        return 0;
    }

    return Object.values(photos).reduce(
        (total, group) => {

            if (!Array.isArray(group)) {
                return total;
            }

            return total + group.length;

        },
        0
    );
}


// ============================
// ONKO KAIKKI 5 KUVAA?
// ============================

function hasAllFivePhotos(photos) {

    if (!photos) {
        return false;
    }

    return photoTypes.every(
        type =>
            Array.isArray(photos[type]) &&
            photos[type].length > 0
    );
}


// ============================
// LATAA SIIRROT
// ============================

function loadTransfers() {

    const saved = localStorage.getItem(
        "siirtoAppTransfers"
    );

    if (saved) {

        try {

            transfers = JSON.parse(saved);

            if (!Array.isArray(transfers)) {
                transfers = [];
            }

            transfers = transfers.map(
                transfer => ({

                    ...transfer,

                    beforePhotos:
                        normalizePhotos(
                            transfer.beforePhotos
                        ),

                    afterPhotos:
                        normalizePhotos(
                            transfer.afterPhotos
                        )
                })
            );

        } catch (error) {

            console.error(
                "Siirtojen lataaminen epäonnistui:",
                error
            );

            transfers = [];
        }
    }

    renderTransfers();
    updateDashboard();
}


// ============================
// TALLENNA SIIRROT
// ============================

function saveTransfers() {

    try {

        localStorage.setItem(
            "siirtoAppTransfers",
            JSON.stringify(transfers)
        );

        return true;

    } catch (error) {

        console.error(
            "Siirtojen tallentaminen epäonnistui:",
            error
        );

        alert(
            "Siirron tallentaminen epäonnistui. " +
            "Selaimen tallennustila saattaa olla täynnä. " +
            "Kokeile ottaa kuvat uudelleen tai poistaa vanhoja siirtoja."
        );

        return false;
    }
}


// ============================
// KUVAN PIENENTÄMINEN
// ============================

function compressImage(file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            reject(
                new Error("Kuvatiedostoa ei löytynyt.")
            );
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const image = new Image();

            image.onload = function () {

                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                const QUALITY = 0.72;

                let width = image.width;
                let height = image.height;

                // Pienennetään vain tarvittaessa
                if (
                    width > MAX_WIDTH ||
                    height > MAX_HEIGHT
                ) {

                    const widthRatio =
                        MAX_WIDTH / width;

                    const heightRatio =
                        MAX_HEIGHT / height;

                    const ratio =
                        Math.min(
                            widthRatio,
                            heightRatio
                        );

                    width =
                        Math.round(
                            width * ratio
                        );

                    height =
                        Math.round(
                            height * ratio
                        );
                }

                const canvas =
                    document.createElement(
                        "canvas"
                    );

                canvas.width = width;
                canvas.height = height;

                const context =
                    canvas.getContext(
                        "2d"
                    );

                if (!context) {

                    reject(
                        new Error(
                            "Kuvan käsittely epäonnistui."
                        )
                    );

                    return;
                }

                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );

                const compressed =
                    canvas.toDataURL(
                        "image/jpeg",
                        QUALITY
                    );

                resolve(compressed);
            };

            image.onerror = function () {

                reject(
                    new Error(
                        "Kuvan avaaminen epäonnistui."
                    )
                );
            };

            image.src =
                event.target.result;
        };

        reader.onerror = function () {

            reject(
                new Error(
                    "Kuvan lukeminen epäonnistui."
                )
            );
        };

        reader.readAsDataURL(file);
    });
}


// ============================
// AVAA UUSI SIIRTO
// ============================

function openForm() {

    const modal =
        document.getElementById(
            "formModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "active"
    );

    const now =
        new Date();

    const dateInput =
        document.getElementById(
            "date"
        );

    const timeInput =
        document.getElementById(
            "time"
        );

    if (dateInput) {

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                now.getDate()
            ).padStart(
                2,
                "0"
            );

        dateInput.value =
            `${year}-${month}-${day}`;
    }

    if (timeInput) {

        timeInput.value =
            now.toTimeString()
                .slice(0, 5);
    }

    resetBeforePhotos();
}


// ============================
// SULJE UUSI SIIRTO
// ============================

function closeForm() {

    const modal =
        document.getElementById(
            "formModal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );
    }

    const form =
        document.getElementById(
            "transferForm"
        );

    if (form) {
        form.reset();
    }

    resetBeforePhotos();
}


// ============================
// RESET ENNEN-KUVAT
// ============================

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


// ============================
// LISÄÄ KUVA
// ============================

async function addPhoto(
    location,
    type
) {

    const input =
        document.getElementById(
            `${location}-${type}`
        );

    if (
        !input ||
        !input.files ||
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

    try {

        const compressedImage =
            await compressImage(
                file
            );

        target[type] = [
            compressedImage
        ];

        updatePhotoStatus(
            location,
            type
        );

        if (
            location === "before"
        ) {

            updateBeforePhotoCount();

        } else {

            updateAfterPhotoCount();
        }

    } catch (error) {

        console.error(
            "Kuvan käsittely epäonnistui:",
            error
        );

        alert(
            "Kuvan käsittely epäonnistui. " +
            "Kokeile ottaa kuva uudelleen."
        );

        input.value = "";
    }
}


// ============================
// KUVAN STATUS
// ============================

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


// ============================
// ESITYSKUVAT
// ============================

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
                        "preview-item";

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        photo;

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


// ============================
// ENNEN-KUVIEN MÄÄRÄ
// ============================

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


// ============================
// KOHTEEN KUVIEN MÄÄRÄ
// ============================

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

        button.textContent =
            "✅ Lopeta siirto";

    } else {

        button.disabled =
            true;

        button.textContent =
            `📸 Lisää kaikki kuvat (${count}/5)`;
    }
}


// ============================
// UUDEN SIIRRON TALLENNUS
// ============================

const transferForm =
    document.getElementById(
        "transferForm"
    );

if (transferForm) {

    transferForm.addEventListener(
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
                    beforePhotoData,

                afterPhotos:
                    createEmptyPhotos(),

                status:
                    "planned",

                createdAt:
                    new Date()
                        .toISOString(),

                completedAt:
                    null
            };

            transfers.push(
                transfer
            );

            const saved =
                saveTransfers();

            if (!saved) {

                // Jos tallennus epäonnistui,
                // poistetaan juuri lisätty siirto.
                transfers.pop();

                return;
            }

            closeForm();

            renderTransfers();

            updateDashboard();
        }
    );
}


// ============================
// RENDERÖI SIIRROT
// ============================

function renderTransfers() {

    const list =
        document.getElementById(
            "transferList"
        );

    if (!list) {
        return;
    }

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const filterStatus =
        document.getElementById(
            "filterStatus"
        );

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
            : "";

    const filter =
        filterStatus
            ? filterStatus.value
            : "all";

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

                        filter === "all"

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


// ============================
// SIIRTO-KORTTI
// ============================

function createTransferCard(
    transfer
) {

    const statusNames = {

        planned:
            "Suunniteltu",

        driving:
            "Matkalla",

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

                    ${
                        statusNames[
                            transfer.status
                        ] ||
                        "Suunniteltu"
                    }

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

                ${
                    transfer.vehicle
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

            <div class="transfer-actions">

                <button
                    class="action-btn primary"
                    onclick="showDetails(${transfer.id})"
                >
                    👁️ Avaa
                </button>

                <button
                    class="action-btn"
                    onclick="openMaps(${transfer.id})"
                >
                    🗺️ Reitti
                </button>

                ${
                    transfer.status === "planned"
                        ?
                        `
                            <button
                                class="action-btn"
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

                ${
                    transfer.status === "driving"
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
                    onclick="deleteTransfer(${transfer.id})"
                >
                    🗑️ Poista
                </button>

            </div>

        </div>

    `;
}


// ============================
// ALOITA AJO
// ============================

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

    transfer.status =
        status;

    if (
        status === "driving"
    ) {

        transfer.startedAt =
            new Date()
                .toISOString();
    }

    if (!saveTransfers()) {
        return;
    }

    renderTransfers();

    updateDashboard();
}


// ============================
// AVAA LOPETUS
// ============================

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

    afterPhotoData =
        normalizePhotos(
            transfer.afterPhotos
        );

    const vehicle =
        document.getElementById(
            "finishVehicle"
        );

    if (vehicle) {

        vehicle.textContent =
            transfer.vehicle ||
            "Ajoneuvo";
    }

    const route =
        document.getElementById(
            "finishRoute"
        );

    if (route) {

        route.textContent =
            `${transfer.from} → ${transfer.to}`;
    }

    resetAfterPhotoInterface();

    const modal =
        document.getElementById(
            "finishModal"
        );

    if (modal) {

        modal.classList.add(
            "active"
        );
    }
}


// ============================
// KOHTEEN KUVIEN RESET
// ============================

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


// ============================
// SULJE LOPETUS
// ============================

function closeFinishModal() {

    const modal =
        document.getElementById(
            "finishModal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );
    }

    finishingTransferId =
        null;

    afterPhotoData =
        createEmptyPhotos();
}


// ============================
// LOPETA SIIRTO
// ============================

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

    transfer.afterPhotos =
        afterPhotoData;

    transfer.status =
        "completed";

    transfer.completedAt =
        new Date()
            .toISOString();

    if (!saveTransfers()) {
        return;
    }

    closeFinishModal();

    renderTransfers();

    updateDashboard();
}


// ============================
// POISTA
// ============================

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


// ============================
// GOOGLE MAPS
// ============================

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


// ============================
// TIEDOT
// ============================

function showDetails(id) {

    const transfer =
        transfers.find(
            t => t.id === id
        );

    if (!transfer) {
        return;
    }

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

            ${
                transfer.vehicle
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
                📝 Lisätiedot
            </strong>

            ${
                transfer.notes
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


// ============================
// DETAILSIEN KUVAT
// ============================

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


// ============================
// SULJE DETAILS
// ============================

function closeDetails() {

    const modal =
        document.getElementById(
            "detailsModal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


// ============================
// DASHBOARD
// ============================

function updateDashboard() {

    const totalCount =
        document.getElementById(
            "totalCount"
        );

    if (totalCount) {

        totalCount.textContent =
            transfers.length;
    }

    // Käytetään paikallista päivämäärää
    // eikä UTC-päivämäärää.
    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    const today =
        `${year}-${month}-${day}`;

    const todayCount =
        document.getElementById(
            "todayCount"
        );

    if (todayCount) {

        todayCount.textContent =
            transfers.filter(
                t =>
                    t.date ===
                    today
            ).length;
    }

    const activeCount =
        document.getElementById(
            "activeCount"
        );

    if (activeCount) {

        activeCount.textContent =
            transfers.filter(
                t =>
                    t.status ===
                    "driving"
            ).length;
    }

    const completedCount =
        document.getElementById(
            "completedCount"
        );

    if (completedCount) {

        completedCount.textContent =
            transfers.filter(
                t =>
                    t.status ===
                    "completed"
            ).length;
    }
}


// ============================
// PÄIVÄMÄÄRÄ
// ============================

function formatDate(date) {

    if (!date) {
        return "";
    }

    const parts =
        date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return `
        ${parts[2]}.
        ${parts[1]}.
        ${parts[0]}
    `.replace(
        /\s/g,
        ""
    );
}


// ============================
// HTML TURVALLISUUS
// ============================

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


// ============================
// KÄYNNISTYS
// ============================

loadTransfers();
```
