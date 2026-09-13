let transfers = [];

let beforePhotoData = createEmptyPhotos();
let afterPhotoData = createEmptyPhotos();

let finishingTransferId = null;


// ======================================================
// ASETUKSET
// ======================================================

const STORAGE_KEY = "siirtoAppTransfers";

const PHOTO_TYPES = [
    "mittaristo",
    "vasen",
    "oikea",
    "edesta",
    "takaa"
];

const PHOTO_NAMES = {
    mittaristo: "Mittaristo",
    vasen: "Vasen sivu",
    oikea: "Oikea sivu",
    edesta: "Edestä",
    takaa: "Takaa"
};


// Kuvien pakkaus
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const IMAGE_QUALITY = 0.72;


// ======================================================
// KUVAT
// ======================================================

function createEmptyPhotos() {
    return {
        mittaristo: null,
        vasen: null,
        oikea: null,
        edesta: null,
        takaa: null
    };
}


function normalizePhotos(photos) {

    const normalized = createEmptyPhotos();

    if (!photos) {
        return normalized;
    }

    PHOTO_TYPES.forEach(type => {

        if (photos[type]) {
            normalized[type] = photos[type];
        }

    });

    return normalized;
}


function getPhotoCount(photos) {

    if (!photos) {
        return 0;
    }

    return PHOTO_TYPES.filter(
        type => photos[type]
    ).length;
}


// ======================================================
// TALLENNUS
// ======================================================

function loadTransfers() {

    try {

        const saved = localStorage.getItem(
            STORAGE_KEY
        );

        if (!saved) {

            transfers = [];

        } else {

            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {

                transfers = parsed.map(transfer => ({

                    ...transfer,

                    beforePhotos:
                        normalizePhotos(
                            transfer.beforePhotos
                        ),

                    afterPhotos:
                        normalizePhotos(
                            transfer.afterPhotos
                        )

                }));

            } else {

                transfers = [];

            }

        }

    } catch (error) {

        console.error(
            "Siirtojen lataaminen epäonnistui:",
            error
        );

        transfers = [];

    }

    renderTransfers();
    updateDashboard();
}


function saveTransfers() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transfers)
        );

        return true;

    } catch (error) {

        console.error(
            "Tallennus epäonnistui:",
            error
        );

        alert(
            "Siirtoa ei voitu tallentaa.\n\n" +
            "Selaimen tallennustila saattaa olla täynnä. " +
            "Kokeile poistaa vanhoja siirtoja."
        );

        return false;
    }
}


// ======================================================
// UUSI SIIRTO
// ======================================================

function openForm() {

    const modal =
        document.getElementById("formModal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    resetBeforePhotos();

    setDefaultDateTime();
}


function closeForm() {

    const modal =
        document.getElementById("formModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");
}


function setDefaultDateTime() {

    const dateInput =
        document.getElementById("date");

    if (dateInput && !dateInput.value) {

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(now.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(now.getDate())
                .padStart(2, "0");

        dateInput.value =
            `${year}-${month}-${day}`;
    }
}


function resetBeforePhotos() {

    beforePhotoData =
        createEmptyPhotos();

    PHOTO_TYPES.forEach(type => {

        const input =
            document.getElementById(
                `before-${type}`
            );

        if (input) {
            input.value = "";
        }

        const status =
            document.getElementById(
                `before-${type}-status`
            );

        if (status) {

            status.textContent =
                "Ei kuvaa";

            status.classList.remove(
                "added"
            );
        }

        const preview =
            document.getElementById(
                `before-${type}-preview`
            );

        if (preview) {
            preview.innerHTML = "";
        }

    });

    const generalPreview =
        document.getElementById(
            "beforePreview"
        );

    if (generalPreview) {
        generalPreview.innerHTML = "";
    }

    updateBeforePhotoCount();
}


// ======================================================
// KUVAN PAKKAUS
// ======================================================

function compressImage(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload = event => {

                const image =
                    new Image();

                image.onload = () => {

                    let width =
                        image.width;

                    let height =
                        image.height;


                    if (
                        width > MAX_WIDTH ||
                        height > MAX_HEIGHT
                    ) {

                        const ratio =
                            Math.min(
                                MAX_WIDTH / width,
                                MAX_HEIGHT / height
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

                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );

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
                            IMAGE_QUALITY
                        );

                    resolve(compressed);

                };


                image.onerror = () => {

                    reject(
                        new Error(
                            "Kuvan lataaminen epäonnistui."
                        )
                    );

                };


                image.src =
                    event.target.result;

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Tiedoston lukeminen epäonnistui."
                    )
                );

            };


            reader.readAsDataURL(file);

        }
    );
}


// ======================================================
// KUVAN LISÄÄMINEN
// ======================================================

async function addPhoto(section, type) {

    const input =
        document.getElementById(
            `${section}-${type}`
        );

    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {
        return;
    }


    const file =
        input.files[0];


    if (!file.type.startsWith("image/")) {

        alert(
            "Valitse kuvatiedosto."
        );

        return;
    }


    try {

        const compressedImage =
            await compressImage(file);


        if (section === "before") {

            beforePhotoData[type] =
                compressedImage;

            updateBeforePhotoCount();

            renderPhotoPreview(
                "before",
                type,
                compressedImage
            );
        }


        if (section === "after") {

            afterPhotoData[type] =
                compressedImage;

            updateAfterPhotoCount();

            renderPhotoPreview(
                "after",
                type,
                compressedImage
            );
        }

    } catch (error) {

        console.error(
            "Kuvan lisääminen epäonnistui:",
            error
        );

        alert(
            "Kuvan lisääminen epäonnistui."
        );

    }
}


// ======================================================
// KUVAN TILA
// ======================================================

function updatePhotoStatus(
    section,
    type
) {

    const status =
        document.getElementById(
            `${section}-${type}-status`
        );

    if (!status) {
        return;
    }

    status.textContent =
        "✓ Kuva lisätty";

    status.classList.add(
        "added"
    );
}


// ======================================================
// KUVAN ESikatselu
// ======================================================

function renderPhotoPreview(
    section,
    type,
    imageData
) {

    const preview =
        document.getElementById(
            `${section}-${type}-preview`
        );


    updatePhotoStatus(
        section,
        type
    );


    if (!preview) {
        return;
    }


    preview.innerHTML = `

        <img
            src="${imageData}"
            alt="${PHOTO_NAMES[type]}"
        >

    `;
}


// ======================================================
// KUVAMÄÄRÄT
// ======================================================

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


    // KUVAT EIVÄT OLE PAKOLLISIA

    const button =
        document.getElementById(
            "finishTransferBtn"
        );

    if (button) {

        button.disabled =
            false;

        button.innerHTML = `
            <span>✅</span>
            Lopeta siirto
            <span class="submit-arrow">→</span>
        `;
    }
}


// ======================================================
// UUDEN SIIRRON TALLENNUS
// ======================================================

const transferForm =
    document.getElementById(
        "transferForm"
    );


if (transferForm) {

    transferForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const customer =
                document
                    .getElementById(
                        "customer"
                    )
                    ?.value
                    .trim();


            const date =
                document
                    .getElementById(
                        "date"
                    )
                    ?.value;


            const time =
                document
                    .getElementById(
                        "time"
                    )
                    ?.value;


            const vehicle =
                document
                    .getElementById(
                        "vehicle"
                    )
                    ?.value
                    .trim();


            const from =
                document
                    .getElementById(
                        "from"
                    )
                    ?.value
                    .trim();


            const to =
                document
                    .getElementById(
                        "to"
                    )
                    ?.value
                    .trim();


            const notes =
                document
                    .getElementById(
                        "notes"
                    )
                    ?.value
                    .trim();


            if (
                !customer ||
                !date ||
                !vehicle ||
                !from ||
                !to
            ) {

                alert(
                    "Täytä kaikki pakolliset siirtotiedot."
                );

                return;
            }


            const newTransfer = {

                id: Date.now(),

                customer,

                date,

                time,

                vehicle,

                from,

                to,

                notes,

                status: "pending",

                createdAt:
                    new Date()
                        .toISOString(),

                beforePhotos:
                    normalizePhotos(
                        beforePhotoData
                    ),

                afterPhotos:
                    createEmptyPhotos()

            };


            transfers.unshift(
                newTransfer
            );


            const saved =
                saveTransfers();


            if (!saved) {

                transfers.shift();

                return;
            }


            renderTransfers();

            updateDashboard();


            transferForm.reset();

            resetBeforePhotos();

            closeForm();

        }
    );
}


// ======================================================
// SIIRTOJEN NÄYTTÄMINEN
// ======================================================

function renderTransfers() {

    const container =
        document.getElementById(
            "transferList"
        );

    if (!container) {
        return;
    }


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const filterSelect =
        document.getElementById(
            "filterStatus"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filter =
        filterSelect
            ? filterSelect.value
            : "all";


    const filteredTransfers =
        transfers.filter(
            transfer => {

                const customer =
                    String(
                        transfer.customer || ""
                    ).toLowerCase();


                const vehicle =
                    String(
                        transfer.vehicle || ""
                    ).toLowerCase();


                const from =
                    String(
                        transfer.from || ""
                    ).toLowerCase();


                const to =
                    String(
                        transfer.to || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    customer.includes(search) ||
                    vehicle.includes(search) ||
                    from.includes(search) ||
                    to.includes(search);


                const matchesFilter =
                    filter === "all" ||
                    transfer.status === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    if (
        filteredTransfers.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🚗
                </div>

                <h3>
                    Ei siirtoja
                </h3>

                <p>
                    Lisää ensimmäinen siirto
                    painamalla "Uusi siirto".
                </p>

                <button
                    class="empty-action"
                    onclick="openForm()"
                    type="button"
                >
                    ＋ Lisää siirto
                </button>

            </div>

        `;

        return;
    }


    container.innerHTML =
        filteredTransfers
            .map(
                createTransferCard
            )
            .join("");
}


// ======================================================
// SIIRTO-KORTTI
// ======================================================

function createTransferCard(
    transfer
) {

    const beforeCount =
        getPhotoCount(
            normalizePhotos(
                transfer.beforePhotos
            )
        );


    const afterCount =
        getPhotoCount(
            normalizePhotos(
                transfer.afterPhotos
            )
        );


    let statusText =
        "Suunniteltu";

    let statusClass =
        "pending";


    if (
        transfer.status === "driving"
    ) {

        statusText =
            "Matkalla";

        statusClass =
            "driving";
    }


    if (
        transfer.status === "completed"
    ) {

        statusText =
            "Valmis";

        statusClass =
            "completed";
    }


    const safeCustomer =
        escapeHtml(
            transfer.customer
        );


    const safeVehicle =
        escapeHtml(
            transfer.vehicle
        );


    const safeFrom =
        escapeHtml(
            transfer.from
        );


    const safeTo =
        escapeHtml(
            transfer.to
        );


    const safeNotes =
        escapeHtml(
            transfer.notes
        );


    return `

        <article
            class="transfer-card ${statusClass}"
        >

            <div class="transfer-card-top">


                <div class="transfer-main-info">

                    <div class="transfer-status-row">

                        <span
                            class="status ${statusClass}"
                        >
                            <span class="status-dot"></span>
                            ${statusText}
                        </span>

                    </div>


                    <h3>
                        ${safeCustomer}
                    </h3>

                </div>


                <div class="transfer-date">

                    <strong>
                        ${formatDate(
                            transfer.date
                        )}
                    </strong>

                    ${
                        transfer.time
                            ? `
                            <span>
                                ${escapeHtml(
                                    transfer.time
                                )}
                            </span>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="route-box">

                <div class="route-point">

                    <span class="route-dot start"></span>

                    <div>

                        <small>
                            LÄHTÖ
                        </small>

                        <strong>
                            ${safeFrom}
                        </strong>

                    </div>

                </div>


                <div class="route-line"></div>


                <div class="route-point">

                    <span class="route-dot end"></span>

                    <div>

                        <small>
                            KOHDE
                        </small>

                        <strong>
                            ${safeTo}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="vehicle-info">

                <span class="vehicle-icon">
                    🚗
                </span>

                <div>

                    <small>
                        AJONEUVO
                    </small>

                    <strong>
                        ${safeVehicle}
                    </strong>

                </div>

            </div>


            <div class="transfer-meta">

                <span>
                    📸 Ennen
                    <strong>
                        ${beforeCount}/5
                    </strong>
                </span>

                <span>
                    📸 Jälkeen
                    <strong>
                        ${afterCount}/5
                    </strong>
                </span>

            </div>


            ${
                transfer.notes
                    ? `

                    <div class="transfer-notes">

                        <span>
                            📝
                        </span>

                        <p>
                            ${safeNotes}
                        </p>

                    </div>

                    `
                    : ""
            }


            <div class="transfer-actions">


                <button
                    class="btn secondary"
                    onclick="showDetails(${transfer.id})"
                    type="button"
                >
                    <span>👁️</span>
                    Tiedot
                </button>


                ${
                    transfer.status !== "completed"
                        ? `

                        <button
                            class="btn primary"
                            onclick="openMaps(${transfer.id})"
                            type="button"
                        >
                            <span>🗺️</span>
                            Reitti
                        </button>

                        `
                        : ""
                }


                ${
                    transfer.status === "pending"
                        ? `

                        <button
                            class="btn success"
                            onclick="changeStatus(
                                ${transfer.id},
                                'driving'
                            )"
                            type="button"
                        >
                            <span>🚗</span>
                            Aloita
                        </button>

                        `
                        : ""
                }


                ${
                    transfer.status === "driving"
                        ? `

                        <button
                            class="btn success"
                            onclick="openFinishModal(
                                ${transfer.id}
                            )"
                            type="button"
                        >
                            <span>✓</span>
                            Lopeta
                        </button>

                        `
                        : ""
                }


                <button
                    class="btn danger"
                    onclick="deleteTransfer(
                        ${transfer.id}
                    )"
                    type="button"
                    aria-label="Poista siirto"
                >
                    🗑️
                </button>

            </div>

        </article>

    `;
}


// ======================================================
// STATUS
// ======================================================

function changeStatus(
    id,
    newStatus
) {

    const transfer =
        transfers.find(
            transfer =>
                transfer.id === id
        );


    if (!transfer) {
        return;
    }


    transfer.status =
        newStatus;


    if (
        newStatus === "driving"
    ) {

        transfer.startedAt =
            new Date()
                .toISOString();
    }


    const saved =
        saveTransfers();


    if (!saved) {
        return;
    }


    renderTransfers();

    updateDashboard();
}


// ======================================================
// LOPETA SIIRTO
// ======================================================

function openFinishModal(id) {

    const transfer =
        transfers.find(
            transfer =>
                transfer.id === id
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


    const vehicleElement =
        document.getElementById(
            "finishVehicle"
        );


    const routeElement =
        document.getElementById(
            "finishRoute"
        );


    if (vehicleElement) {

        vehicleElement.textContent =
            transfer.vehicle;
    }


    if (routeElement) {

        routeElement.textContent =
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


    updateAfterPhotoCount();
}


// ======================================================
// LOPETUKSEN KUVAT
// ======================================================

function resetAfterPhotoInterface() {

    PHOTO_TYPES.forEach(
        type => {

            const input =
                document.getElementById(
                    `after-${type}`
                );


            if (input) {

                input.value = "";
            }


            const status =
                document.getElementById(
                    `after-${type}-status`
                );


            const preview =
                document.getElementById(
                    `after-${type}-preview`
                );


            if (afterPhotoData[type]) {

                if (status) {

                    status.textContent =
                        "✓ Kuva lisätty";

                    status.classList.add(
                        "added"
                    );
                }

                if (preview) {

                    preview.innerHTML = `

                        <img
                            src="${afterPhotoData[type]}"
                            alt="${PHOTO_NAMES[type]}"
                        >

                    `;
                }

            } else {

                if (status) {

                    status.textContent =
                        "Ei kuvaa";

                    status.classList.remove(
                        "added"
                    );
                }

                if (preview) {

                    preview.innerHTML = "";
                }
            }

        }
    );


    const generalPreview =
        document.getElementById(
            "afterPreview"
        );


    if (generalPreview) {

        generalPreview.innerHTML =
            createGeneralPhotoPreview(
                afterPhotoData
            );
    }


    updateAfterPhotoCount();
}


// ======================================================
// YLEINEN KUVAPREVIKKA
// ======================================================

function createGeneralPhotoPreview(
    photos
) {

    return PHOTO_TYPES
        .filter(
            type => photos[type]
        )
        .map(
            type => `

                <div class="photo-preview-item">

                    <img
                        src="${photos[type]}"
                        alt="${PHOTO_NAMES[type]}"
                    >

                    <span>
                        ${PHOTO_NAMES[type]}
                    </span>

                </div>

            `
        )
        .join("");
}


// ======================================================
// SULJE LOPETA
// ======================================================

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
}


// ======================================================
// SIIRRON LOPETTAMINEN
// ======================================================

function finishTransfer() {

    if (!finishingTransferId) {
        return;
    }


    const transfer =
        transfers.find(
            transfer =>
                transfer.id ===
                finishingTransferId
        );


    if (!transfer) {
        return;
    }


    // KUVIA EI TARKISTETA.
    // Ne ovat täysin vapaaehtoisia.

    transfer.afterPhotos =
        normalizePhotos(
            afterPhotoData
        );


    transfer.status =
        "completed";


    transfer.completedAt =
        new Date()
            .toISOString();


    const saved =
        saveTransfers();


    if (!saved) {
        return;
    }


    renderTransfers();

    updateDashboard();

    closeFinishModal();
}


// ======================================================
// POISTA SIIRTO
// ======================================================

function deleteTransfer(id) {

    const transfer =
        transfers.find(
            transfer =>
                transfer.id === id
        );


    if (!transfer) {
        return;
    }


    const confirmed =
        confirm(
            `Poistetaanko siirto "${transfer.customer}"?`
        );


    if (!confirmed) {
        return;
    }


    transfers =
        transfers.filter(
            transfer =>
                transfer.id !== id
        );


    const saved =
        saveTransfers();


    if (!saved) {
        return;
    }


    renderTransfers();

    updateDashboard();
}


// ======================================================
// GOOGLE MAPS
// ======================================================

function openMaps(id) {

    const transfer =
        transfers.find(
            transfer =>
                transfer.id === id
        );


    if (!transfer) {
        return;
    }


    const origin =
        encodeURIComponent(
            transfer.from
        );


    const destination =
        encodeURIComponent(
            transfer.to
        );


    const url =
        "https://www.google.com/maps/dir/" +
        "?api=1" +
        `&origin=${origin}` +
        `&destination=${destination}`;


    window.open(
        url,
        "_blank"
    );
}


// ======================================================
// TIEDOT
// ======================================================

function showDetails(id) {

    const transfer =
        transfers.find(
            transfer =>
                transfer.id === id
        );


    if (!transfer) {
        return;
    }


    const modal =
        document.getElementById(
            "detailsModal"
        );


    const content =
        document.getElementById(
            "detailsContent"
        );


    const title =
        document.getElementById(
            "detailsTitle"
        );


    if (
        !modal ||
        !content
    ) {
        return;
    }


    if (title) {

        title.textContent =
            transfer.customer;
    }


    const beforePhotos =
        normalizePhotos(
            transfer.beforePhotos
        );


    const afterPhotos =
        normalizePhotos(
            transfer.afterPhotos
        );


    content.innerHTML = `

        <div class="details-section">

            <div class="details-grid">

                <div class="detail-item">

                    <span>
                        👤 Asiakas
                    </span>

                    <strong>
                        ${escapeHtml(
                            transfer.customer
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        🚗 Ajoneuvo
                    </span>

                    <strong>
                        ${escapeHtml(
                            transfer.vehicle
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        📅 Päivä
                    </span>

                    <strong>
                        ${formatDate(
                            transfer.date
                        )}
                    </strong>

                </div>


                ${
                    transfer.time
                        ? `

                        <div class="detail-item">

                            <span>
                                🕐 Aika
                            </span>

                            <strong>
                                ${escapeHtml(
                                    transfer.time
                                )}
                            </strong>

                        </div>

                        `
                        : ""
                }


                <div class="detail-item">

                    <span>
                        📍 Lähtö
                    </span>

                    <strong>
                        ${escapeHtml(
                            transfer.from
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        🏁 Kohde
                    </span>

                    <strong>
                        ${escapeHtml(
                            transfer.to
                        )}
                    </strong>

                </div>

            </div>


            ${
                transfer.notes
                    ? `

                    <div class="details-note">

                        <span>
                            📝
                        </span>

                        <div>

                            <small>
                                LISÄTIEDOT
                            </small>

                            <p>
                                ${escapeHtml(
                                    transfer.notes
                                )}
                            </p>

                        </div>

                    </div>

                    `
                    : ""
            }

        </div>


        <div class="details-section">

            <div class="details-section-heading">

                <div>

                    <h3>
                        📸 Ennen lähtöä
                    </h3>

                    <span>
                        ${getPhotoCount(
                            beforePhotos
                        )} / 5 kuvaa
                    </span>

                </div>

            </div>


            <div class="details-photos">

                ${createDetailsPhotos(
                    beforePhotos
                )}

            </div>

        </div>


        <div class="details-section">

            <div class="details-section-heading">

                <div>

                    <h3>
                        📸 Kohteessa
                    </h3>

                    <span>
                        ${getPhotoCount(
                            afterPhotos
                        )} / 5 kuvaa
                    </span>

                </div>

            </div>


            <div class="details-photos">

                ${createDetailsPhotos(
                    afterPhotos
                )}

            </div>

        </div>

    `;


    modal.classList.add(
        "active"
    );
}


// ======================================================
// DETAILSIEN KUVAT
// ======================================================

function createDetailsPhotos(
    photos
) {

    return PHOTO_TYPES
        .map(
            type => {

                if (!photos[type]) {

                    return `

                        <div
                            class="details-photo empty"
                        >

                            <div>
                                📷
                            </div>

                            <span>
                                ${PHOTO_NAMES[type]}
                            </span>

                            <small>
                                Ei kuvaa
                            </small>

                        </div>

                    `;
                }


                return `

                    <div class="details-photo">

                        <img
                            src="${photos[type]}"
                            alt="${PHOTO_NAMES[type]}"
                        >

                        <span>
                            ${PHOTO_NAMES[type]}
                        </span>

                    </div>

                `;

            }
        )
        .join("");
}


// ======================================================
// SULJE TIEDOT
// ======================================================

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


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

    const total =
        transfers.length;


    const todayString =
        getLocalDateString(
            new Date()
        );


    const today =
        transfers.filter(
            transfer =>
                transfer.date ===
                todayString
        ).length;


    const driving =
        transfers.filter(
            transfer =>
                transfer.status ===
                "driving"
        ).length;


    const completed =
        transfers.filter(
            transfer =>
                transfer.status ===
                "completed"
        ).length;


    // UUSI HTML

    const totalElement =
        document.getElementById(
            "totalCount"
        );


    const todayElement =
        document.getElementById(
            "todayCount"
        );


    const activeElement =
        document.getElementById(
            "activeCount"
        );


    const completedElement =
        document.getElementById(
            "completedCount"
        );


    if (totalElement) {

        animateNumber(
            totalElement,
            total
        );
    }


    if (todayElement) {

        animateNumber(
            todayElement,
            today
        );
    }


    if (activeElement) {

        animateNumber(
            activeElement,
            driving
        );
    }


    if (completedElement) {

        animateNumber(
            completedElement,
            completed
        );
    }
}


// ======================================================
// DASHBOARD-NUMERON ANIMAATIO
// ======================================================

function animateNumber(
    element,
    target
) {

    const current =
        Number(
            element.textContent
        ) || 0;


    if (current === target) {
        return;
    }


    element.textContent =
        target;
}


// ======================================================
// PAIKALLINEN PÄIVÄMÄÄRÄ
// ======================================================

function getLocalDateString(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


// ======================================================
// PÄIVÄMÄÄRÄN MUOTOILU
// ======================================================

function formatDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;
    }


    return date.toLocaleDateString(
        "fi-FI",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// ======================================================
// HTML-TURVALLISUUS
// ======================================================

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================================
// HAKU
// ======================================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderTransfers
    );
}


// ======================================================
// SUODATUS
// ======================================================

const filterStatus =
    document.getElementById(
        "filterStatus"
    );


if (filterStatus) {

    filterStatus.addEventListener(
        "change",
        renderTransfers
    );
}


// ======================================================
// MODAALIEN SULKEMINEN
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "active"
            );
        }

    }
);


// ======================================================
// ESC = SULJE MODAALI
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(
                ".modal.active"
            )
            .forEach(
                modal => {

                    modal.classList.remove(
                        "active"
                    );

                }
            );


        finishingTransferId =
            null;
    }
);


// ======================================================
// KÄYNNISTYS
// ======================================================

loadTransfers();
