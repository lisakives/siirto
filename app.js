let transfers = [];

let beforePhotoData = createEmptyPhotos();
let afterPhotoData = createEmptyPhotos();
let finishingTransferId = null;

const PHOTO_TYPES = [
    "mittaristo",
    "vasen",
    "oikea",
    "edesta",
    "takaa"
];

const PHOTO_NAMES = {
    mittaristo: "Mittaristo",
    vasen: "Vasen",
    oikea: "Oikea",
    edesta: "Edestä",
    takaa: "Takaa"
};

// Kuvien pakkaus ennen tallennusta
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const IMAGE_QUALITY = 0.72;


// =========================
// KUVAT
// =========================

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
    return PHOTO_TYPES.filter(type => photos[type]).length;
}

function hasAllFivePhotos(photos) {
    return getPhotoCount(photos) === 5;
}


// =========================
// TALLENNUS
// =========================

function loadTransfers() {
    try {
        const saved = localStorage.getItem("siirtoAppTransfers");

        if (saved) {
            transfers = JSON.parse(saved);

            transfers = transfers.map(transfer => ({
                ...transfer,
                beforePhotos: normalizePhotos(transfer.beforePhotos),
                afterPhotos: normalizePhotos(transfer.afterPhotos)
            }));
        } else {
            transfers = [];
        }
    } catch (error) {
        console.error("Siirtojen lataaminen epäonnistui:", error);
        transfers = [];
    }

    renderTransfers();
    updateDashboard();
}

function saveTransfers() {
    try {
        localStorage.setItem(
            "siirtoAppTransfers",
            JSON.stringify(transfers)
        );

        return true;
    } catch (error) {
        console.error("Tallennus epäonnistui:", error);

        alert(
            "Siirtoa ei voitu tallentaa.\n\n" +
            "Puhelimen tallennustila selaimessa saattaa olla täynnä."
        );

        return false;
    }
}


// =========================
// UUSI SIIRTO
// =========================

function openForm() {
    const modal = document.getElementById("formModal");

    if (!modal) return;

    modal.classList.add("active");

    resetBeforePhotos();
}

function closeForm() {
    const modal = document.getElementById("formModal");

    if (!modal) return;

    modal.classList.remove("active");
}

function resetBeforePhotos() {
    beforePhotoData = createEmptyPhotos();

    PHOTO_TYPES.forEach(type => {
        const input = document.getElementById(`before-${type}`);

        if (input) {
            input.value = "";
        }
    });

    updateBeforePhotoCount();
}

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            const image = new Image();

            image.onload = () => {
                let width = image.width;
                let height = image.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const ratio = Math.min(
                        MAX_WIDTH / width,
                        MAX_HEIGHT / height
                    );

                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );

                const compressedImage = canvas.toDataURL(
                    "image/jpeg",
                    IMAGE_QUALITY
                );

                resolve(compressedImage);
            };

            image.onerror = () => {
                reject(new Error("Kuvan lataaminen epäonnistui."));
            };

            image.src = event.target.result;
        };

        reader.onerror = () => {
            reject(new Error("Tiedoston lukeminen epäonnistui."));
        };

        reader.readAsDataURL(file);
    });
}

async function addPhoto(section, type) {
    const input = document.getElementById(`${section}-${type}`);

    if (!input || !input.files || !input.files[0]) {
        return;
    }

    const file = input.files[0];

    try {
        const compressedImage = await compressImage(file);

        if (section === "before") {
            beforePhotoData[type] = compressedImage;
            updateBeforePhotoCount();
            renderPhotoPreview("before", type, compressedImage);
        }

        if (section === "after") {
            afterPhotoData[type] = compressedImage;
            updateAfterPhotoCount();
            renderPhotoPreview("after", type, compressedImage);
        }

    } catch (error) {
        console.error(error);
        alert("Kuvan lisääminen epäonnistui.");
    }
}

function updatePhotoStatus(section, type) {
    const status = document.getElementById(
        `${section}-${type}-status`
    );

    if (!status) return;

    status.textContent = "✓ Kuva lisätty";
    status.classList.add("added");
}

function renderPhotoPreview(section, type, imageData) {
    const preview = document.getElementById(
        `${section}-${type}-preview`
    );

    if (!preview) {
        updatePhotoStatus(section, type);
        return;
    }

    preview.innerHTML = `
        <img 
            src="${imageData}" 
            alt="${PHOTO_NAMES[type]}"
        >
    `;

    updatePhotoStatus(section, type);
}

function updateBeforePhotoCount() {
    const count = getPhotoCount(beforePhotoData);

    const element = document.getElementById("beforePhotoCount");

    if (element) {
        element.textContent = `${count}/5`;
    }
}

function updateAfterPhotoCount() {
    const count = getPhotoCount(afterPhotoData);

    const element = document.getElementById("afterPhotoCount");

    if (element) {
        element.textContent = `${count}/5`;
    }

    // KUVAT EIVÄT OLE PAKOLLISIA
    const button = document.getElementById("finishTransferBtn");

    if (button) {
        button.disabled = false;
        button.textContent = "✅ Lopeta siirto";
    }
}


// =========================
// UUDEN SIIRRON TALLENNUS
// =========================

const transferForm = document.getElementById("transferForm");

if (transferForm) {
    transferForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const customer = document.getElementById("customer")?.value.trim();
        const date = document.getElementById("date")?.value;
        const time = document.getElementById("time")?.value;
        const vehicle = document.getElementById("vehicle")?.value.trim();
        const from = document.getElementById("from")?.value.trim();
        const to = document.getElementById("to")?.value.trim();
        const notes = document.getElementById("notes")?.value.trim();

        if (!customer || !date || !vehicle || !from || !to) {
            alert("Täytä pakolliset siirtotiedot.");
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

            createdAt: new Date().toISOString(),

            // KUVAT OVAT VAPAAEHTOISIA
            beforePhotos: normalizePhotos(beforePhotoData),
            afterPhotos: createEmptyPhotos()
        };

        transfers.unshift(newTransfer);

        const saved = saveTransfers();

        if (!saved) {
            transfers.shift();
            return;
        }

        renderTransfers();
        updateDashboard();

        transferForm.reset();

        resetBeforePhotos();

        closeForm();
    });
}


// =========================
// SIIRTOJEN NÄYTTÄMINEN
// =========================

function renderTransfers() {
    const container = document.getElementById("transferList");

    if (!container) return;

    const searchInput = document.getElementById("searchInput");
    const filterSelect = document.getElementById("statusFilter");

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filter = filterSelect
        ? filterSelect.value
        : "all";

    let filteredTransfers = transfers.filter(transfer => {
        const matchesSearch =
            !search ||
            transfer.customer.toLowerCase().includes(search) ||
            transfer.vehicle.toLowerCase().includes(search) ||
            transfer.from.toLowerCase().includes(search) ||
            transfer.to.toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" ||
            transfer.status === filter;

        return matchesSearch && matchesFilter;
    });

    if (filteredTransfers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🚗</div>
                <h3>Ei siirtoja</h3>
                <p>Lisää ensimmäinen siirto painamalla "+ Uusi siirto".</p>
            </div>
        `;

        return;
    }

    container.innerHTML = filteredTransfers
        .map(createTransferCard)
        .join("");
}

function createTransferCard(transfer) {
    const beforeCount = getPhotoCount(
        normalizePhotos(transfer.beforePhotos)
    );

    const afterCount = getPhotoCount(
        normalizePhotos(transfer.afterPhotos)
    );

    let statusText = "Odottaa";
    let statusClass = "pending";

    if (transfer.status === "driving") {
        statusText = "Ajossa";
        statusClass = "driving";
    }

    if (transfer.status === "completed") {
        statusText = "Valmis";
        statusClass = "completed";
    }

    return `
        <div class="transfer-card">

            <div class="transfer-card-top">

                <div>
                    <h3>${escapeHtml(transfer.customer)}</h3>

                    <span class="status ${statusClass}">
                        ${statusText}
                    </span>
                </div>

                <div class="transfer-date">
                    ${formatDate(transfer.date)}
                    ${transfer.time ? `• ${escapeHtml(transfer.time)}` : ""}
                </div>

            </div>

            <div class="transfer-info">

                <div>
                    🚗
                    <strong>
                        ${escapeHtml(transfer.vehicle)}
                    </strong>
                </div>

                <div>
                    📍
                    ${escapeHtml(transfer.from)}
                    →
                    ${escapeHtml(transfer.to)}
                </div>

                <div>
                    📸 Ennen: ${beforeCount}/5
                    &nbsp;&nbsp;
                    📸 Jälkeen: ${afterCount}/5
                </div>

            </div>

            ${
                transfer.notes
                    ? `
                    <div class="transfer-notes">
                        📝 ${escapeHtml(transfer.notes)}
                    </div>
                    `
                    : ""
            }

            <div class="transfer-actions">

                <button
                    class="btn secondary"
                    onclick="showDetails(${transfer.id})"
                >
                    👁️ Tiedot
                </button>

                ${
                    transfer.status !== "completed"
                        ? `
                        <button
                            class="btn primary"
                            onclick="openMaps(${transfer.id})"
                        >
                            🗺️ Reitti
                        </button>
                        `
                        : ""
                }

                ${
                    transfer.status === "pending"
                        ? `
                        <button
                            class="btn success"
                            onclick="changeStatus(${transfer.id}, 'driving')"
                        >
                            🚗 Aloita
                        </button>
                        `
                        : ""
                }

                ${
                    transfer.status === "driving"
                        ? `
                        <button
                            class="btn success"
                            onclick="openFinishModal(${transfer.id})"
                        >
                            ✅ Lopeta
                        </button>
                        `
                        : ""
                }

                <button
                    class="btn danger"
                    onclick="deleteTransfer(${transfer.id})"
                >
                    🗑️
                </button>

            </div>

        </div>
    `;
}


// =========================
// STATUS
// =========================

function changeStatus(id, newStatus) {
    const transfer = transfers.find(
        transfer => transfer.id === id
    );

    if (!transfer) return;

    transfer.status = newStatus;

    saveTransfers();
    renderTransfers();
    updateDashboard();
}


// =========================
// LOPETA SIIRTO
// =========================

function openFinishModal(id) {
    const transfer = transfers.find(
        transfer => transfer.id === id
    );

    if (!transfer) return;

    finishingTransferId = id;

    afterPhotoData = normalizePhotos(
        transfer.afterPhotos
    );

    resetAfterPhotoInterface();

    const modal = document.getElementById("finishModal");

    if (modal) {
        modal.classList.add("active");
    }

    updateAfterPhotoCount();
}

function resetAfterPhotoInterface() {
    PHOTO_TYPES.forEach(type => {
        const input = document.getElementById(`after-${type}`);

        if (input) {
            input.value = "";
        }

        const existingPhoto = afterPhotoData[type];

        if (existingPhoto) {
            renderPhotoPreview(
                "after",
                type,
                existingPhoto
            );
        } else {
            const preview = document.getElementById(
                `after-${type}-preview`
            );

            if (preview) {
                preview.innerHTML = "";
            }

            const status = document.getElementById(
                `after-${type}-status`
            );

            if (status) {
                status.textContent = "";
                status.classList.remove("added");
            }
        }
    });

    updateAfterPhotoCount();
}

function closeFinishModal() {
    const modal = document.getElementById("finishModal");

    if (modal) {
        modal.classList.remove("active");
    }

    finishingTransferId = null;
}

function finishTransfer() {
    if (!finishingTransferId) {
        return;
    }

    const transfer = transfers.find(
        transfer => transfer.id === finishingTransferId
    );

    if (!transfer) {
        return;
    }

    // KUVIA EI ENÄÄ TARKISTETA TÄSSÄ

    transfer.afterPhotos = normalizePhotos(
        afterPhotoData
    );

    transfer.status = "completed";
    transfer.completedAt = new Date().toISOString();

    const saved = saveTransfers();

    if (!saved) {
        return;
    }

    renderTransfers();
    updateDashboard();

    closeFinishModal();
}


// =========================
// POISTA SIIRTO
// =========================

function deleteTransfer(id) {
    const transfer = transfers.find(
        transfer => transfer.id === id
    );

    if (!transfer) return;

    const confirmed = confirm(
        `Poistetaanko siirto "${transfer.customer}"?`
    );

    if (!confirmed) {
        return;
    }

    transfers = transfers.filter(
        transfer => transfer.id !== id
    );

    saveTransfers();

    renderTransfers();
    updateDashboard();
}


// =========================
// GOOGLE MAPS
// =========================

function openMaps(id) {
    const transfer = transfers.find(
        transfer => transfer.id === id
    );

    if (!transfer) return;

    const origin = encodeURIComponent(
        transfer.from
    );

    const destination = encodeURIComponent(
        transfer.to
    );

    const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${origin}` +
        `&destination=${destination}`;

    window.open(url, "_blank");
}


// =========================
// TIEDOT
// =========================

function showDetails(id) {
    const transfer = transfers.find(
        transfer => transfer.id === id
    );

    if (!transfer) return;

    const modal = document.getElementById("detailsModal");
    const content = document.getElementById("detailsContent");

    if (!modal || !content) return;

    const beforePhotos = normalizePhotos(
        transfer.beforePhotos
    );

    const afterPhotos = normalizePhotos(
        transfer.afterPhotos
    );

    content.innerHTML = `
        <div class="details-section">

            <h3>🚗 Siirron tiedot</h3>

            <p>
                <strong>Asiakas:</strong>
                ${escapeHtml(transfer.customer)}
            </p>

            <p>
                <strong>Auto:</strong>
                ${escapeHtml(transfer.vehicle)}
            </p>

            <p>
                <strong>Päivä:</strong>
                ${formatDate(transfer.date)}
            </p>

            ${
                transfer.time
                    ? `
                    <p>
                        <strong>Aika:</strong>
                        ${escapeHtml(transfer.time)}
                    </p>
                    `
                    : ""
            }

            <p>
                <strong>Lähtö:</strong>
                ${escapeHtml(transfer.from)}
            </p>

            <p>
                <strong>Kohde:</strong>
                ${escapeHtml(transfer.to)}
            </p>

            ${
                transfer.notes
                    ? `
                    <p>
                        <strong>Muistiinpanot:</strong>
                        ${escapeHtml(transfer.notes)}
                    </p>
                    `
                    : ""
            }

        </div>

        <div class="details-section">

            <h3>
                📸 Ennen
                (${getPhotoCount(beforePhotos)}/5)
            </h3>

            <div class="details-photos">
                ${createDetailsPhotos(beforePhotos)}
            </div>

        </div>

        <div class="details-section">

            <h3>
                📸 Jälkeen
                (${getPhotoCount(afterPhotos)}/5)
            </h3>

            <div class="details-photos">
                ${createDetailsPhotos(afterPhotos)}
            </div>

        </div>
    `;

    modal.classList.add("active");
}

function createDetailsPhotos(photos) {
    return PHOTO_TYPES
        .map(type => {
            if (!photos[type]) {
                return `
                    <div class="details-photo empty">
                        <span>${PHOTO_NAMES[type]}</span>
                        <small>Ei kuvaa</small>
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
        })
        .join("");
}

function closeDetails() {
    const modal = document.getElementById("detailsModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// =========================
// DASHBOARD
// =========================

function updateDashboard() {
    const total = transfers.length;

    const todayString =
        new Date().toISOString().split("T")[0];

    const today = transfers.filter(
        transfer => transfer.date === todayString
    ).length;

    const driving = transfers.filter(
        transfer => transfer.status === "driving"
    ).length;

    const completed = transfers.filter(
        transfer => transfer.status === "completed"
    ).length;

    const totalElement =
        document.getElementById("totalTransfers");

    const todayElement =
        document.getElementById("todayTransfers");

    const drivingElement =
        document.getElementById("drivingTransfers");

    const completedElement =
        document.getElementById("completedTransfers");

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (todayElement) {
        todayElement.textContent = today;
    }

    if (drivingElement) {
        drivingElement.textContent = driving;
    }

    if (completedElement) {
        completedElement.textContent = completed;
    }
}


// =========================
// PÄIVÄMÄÄRÄ
// =========================

function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "fi-FI",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// =========================
// TURVALLINEN HTML
// =========================

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================
// HAKU JA SUODATUS
// =========================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener(
        "input",
        renderTransfers
    );
}

const statusFilter = document.getElementById("statusFilter");

if (statusFilter) {
    statusFilter.addEventListener(
        "change",
        renderTransfers
    );
}


// =========================
// MODAALIEN SULKEMINEN
// =========================

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
        event.target.classList.remove("active");
    }
});


// =========================
// KÄYNNISTYS
// =========================

loadTransfers();
