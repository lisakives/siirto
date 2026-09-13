/* =========================================================
   SIIRTOAPP — DARK PREMIUM THEME
   ========================================================= */


/* =========================================================
   RESET
   ========================================================= */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}


:root {

    --bg: #080b10;
    --bg-soft: #0d1118;
    --surface: #11161f;
    --surface-2: #151b25;
    --surface-3: #1b222e;

    --border: rgba(255, 255, 255, 0.08);
    --border-light: rgba(255, 255, 255, 0.12);

    --text: #f5f7fa;
    --text-soft: #a8b0bd;
    --text-muted: #6f7886;

    --blue: #3b82f6;
    --blue-light: #60a5fa;
    --blue-dark: #2563eb;

    --green: #22c55e;
    --green-light: #4ade80;

    --orange: #f59e0b;
    --orange-light: #fbbf24;

    --red: #ef4444;
    --red-light: #f87171;

    --purple: #8b5cf6;

    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 22px;
    --radius-xl: 28px;

    --shadow:
        0 20px 50px rgba(0, 0, 0, 0.35);

    --shadow-small:
        0 8px 25px rgba(0, 0, 0, 0.25);

    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Arial,
        sans-serif;
}


html {
    scroll-behavior: smooth;
}


body {

    min-height: 100vh;

    background:
        radial-gradient(
            circle at 10% 0%,
            rgba(59, 130, 246, 0.10),
            transparent 30%
        ),

        radial-gradient(
            circle at 90% 20%,
            rgba(139, 92, 246, 0.06),
            transparent 25%
        ),

        var(--bg);

    color: var(--text);

    line-height: 1.5;

    -webkit-font-smoothing: antialiased;
}


button,
input,
textarea,
select {
    font: inherit;
}


button {
    cursor: pointer;
}


input,
textarea,
select {
    color: var(--text);
}


/* =========================================================
   TOPBAR
   ========================================================= */

.topbar {

    position: sticky;

    top: 0;

    z-index: 100;

    height: 76px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding:
        0
        max(22px, calc((100vw - 1180px) / 2));

    background:
        rgba(8, 11, 16, 0.82);

    border-bottom:
        1px solid var(--border);

    backdrop-filter:
        blur(18px);

    -webkit-backdrop-filter:
        blur(18px);
}


/* =========================================================
   LOGO
   ========================================================= */

.logo {

    display: flex;

    align-items: center;

    gap: 12px;
}


.logo-icon {

    width: 42px;
    height: 42px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 13px;

    background:
        linear-gradient(
            135deg,
            var(--blue),
            var(--purple)
        );

    box-shadow:
        0 8px 25px
        rgba(59, 130, 246, 0.25);

    font-size: 21px;
}


.logo-text {

    display: flex;

    flex-direction: column;

    line-height: 1.1;
}


.logo-text strong {

    font-size: 17px;

    letter-spacing: -0.3px;
}


.logo-text span {

    margin-top: 4px;

    color: var(--text-muted);

    font-size: 11px;

    font-weight: 500;
}


/* =========================================================
   ADD BUTTON
   ========================================================= */

.add-btn {

    border: none;

    display: flex;

    align-items: center;

    gap: 7px;

    padding:
        11px
        17px;

    border-radius: 13px;

    color: white;

    background:
        linear-gradient(
            135deg,
            var(--blue),
            var(--blue-dark)
        );

    box-shadow:
        0 8px 25px
        rgba(37, 99, 235, 0.28);

    font-size: 14px;

    font-weight: 700;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;
}


.add-btn span:first-child {

    font-size: 19px;

    line-height: 1;
}


.add-btn:hover {

    transform: translateY(-2px);

    box-shadow:
        0 12px 30px
        rgba(37, 99, 235, 0.38);

    filter: brightness(1.08);
}


.add-btn:active {

    transform: scale(0.97);
}


/* =========================================================
   MAIN CONTAINER
   ========================================================= */

.container {

    width: min(
        1180px,
        calc(100% - 40px)
    );

    margin:
        0 auto;

    padding:
        42px
        0
        80px;
}


/* =========================================================
   WELCOME
   ========================================================= */

.welcome {

    position: relative;

    overflow: hidden;

    display: flex;

    align-items: center;

    justify-content: space-between;

    min-height: 210px;

    padding:
        38px
        42px;

    margin-bottom: 25px;

    border:
        1px solid var(--border);

    border-radius:
        var(--radius-xl);

    background:
        linear-gradient(
            135deg,
            #111a29,
            #0e131b
        );

    box-shadow:
        var(--shadow);

}


.welcome::before {

    content: "";

    position: absolute;

    width: 280px;
    height: 280px;

    right: -80px;
    top: -120px;

    border-radius: 50%;

    background:
        rgba(59, 130, 246, 0.13);

    filter:
        blur(20px);
}


.welcome::after {

    content: "";

    position: absolute;

    width: 180px;
    height: 180px;

    right: 140px;
    bottom: -120px;

    border-radius: 50%;

    background:
        rgba(139, 92, 246, 0.10);

    filter:
        blur(20px);
}


.welcome > div:first-child {

    position: relative;

    z-index: 2;
}


.welcome-label {

    display: inline-block;

    margin-bottom: 10px;

    color: var(--blue-light);

    font-size: 11px;

    font-weight: 800;

    letter-spacing: 2px;
}


.welcome h1 {

    max-width: 650px;

    font-size:
        clamp(28px, 4vw, 44px);

    line-height: 1.05;

    letter-spacing: -1.5px;
}


.welcome h1 span {

    color: var(--blue-light);
}


.welcome p {

    max-width: 560px;

    margin-top: 15px;

    color: var(--text-soft);

    font-size: 14px;
}


.welcome-decoration {

    position: relative;

    z-index: 2;

    display: flex;

    align-items: center;

    justify-content: center;

    width: 130px;
    height: 130px;

    border-radius: 35px;

    background:
        rgba(59, 130, 246, 0.09);

    border:
        1px solid
        rgba(96, 165, 250, 0.13);

    font-size: 58px;

    transform:
        rotate(4deg);

    box-shadow:
        inset 0 0 40px
        rgba(59, 130, 246, 0.06);
}


/* =========================================================
   DASHBOARD
   ========================================================= */

.dashboard {

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 14px;

    margin-bottom: 25px;
}


.stat-card {

    min-height: 118px;

    display: flex;

    align-items: center;

    gap: 15px;

    padding: 20px;

    border:
        1px solid var(--border);

    border-radius:
        var(--radius-lg);

    background:
        linear-gradient(
            145deg,
            var(--surface),
            var(--bg-soft)
        );

    box-shadow:
        var(--shadow-small);

    transition:
        transform 0.2s ease,
        border-color 0.2s ease;
}


.stat-card:hover {

    transform:
        translateY(-3px);

    border-color:
        var(--border-light);
}


.stat-icon {

    width: 50px;
    height: 50px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 15px;

    font-size: 22px;
}


.stat-icon.blue {

    background:
        rgba(59, 130, 246, 0.13);

    color: var(--blue-light);
}


.stat-icon.purple {

    background:
        rgba(139, 92, 246, 0.13);

    color: #a78bfa;
}


.stat-icon.orange {

    background:
        rgba(245, 158, 11, 0.13);

    color: var(--orange-light);
}


.stat-icon.green {

    background:
        rgba(34, 197, 94, 0.13);

    color: var(--green-light);
}


.stat-content {

    display: flex;

    flex-direction: column;
}


.stat-content small {

    color: var(--text-muted);

    font-size: 11px;

    font-weight: 600;

    text-transform: uppercase;

    letter-spacing: 0.6px;
}


.stat-content strong {

    margin-top: 2px;

    font-size: 29px;

    line-height: 1;

    letter-spacing: -1px;
}


/* =========================================================
   TOOLBAR
   ========================================================= */

.toolbar {

    display: flex;

    align-items: center;

    gap: 12px;

    margin-bottom: 30px;
}


.search-box {

    position: relative;

    flex: 1;
}


.search-icon {

    position: absolute;

    left: 16px;
    top: 50%;

    transform:
        translateY(-50%);

    color: var(--text-muted);

    pointer-events: none;
}


.search-box input {

    width: 100%;

    height: 50px;

    padding:
        0
        16px
        0
        45px;

    border:
        1px solid var(--border);

    border-radius:
        14px;

    outline: none;

    background:
        var(--surface);

    color: var(--text);

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}


.search-box input::placeholder {

    color:
        var(--text-muted);
}


.search-box input:focus {

    border-color:
        rgba(59, 130, 246, 0.65);

    box-shadow:
        0 0 0 4px
        rgba(59, 130, 246, 0.08);
}


.filter-box {

    display: flex;

    align-items: center;

    gap: 10px;

    height: 50px;

    padding:
        0
        12px
        0
        16px;

    border:
        1px solid var(--border);

    border-radius:
        14px;

    background:
        var(--surface);
}


.filter-box span {

    color:
        var(--text-muted);

    font-size: 12px;

    font-weight: 600;
}


.filter-box select {

    border: none;

    outline: none;

    background:
        transparent;

    color:
        var(--text);

    cursor: pointer;

    font-size: 13px;

    font-weight: 600;
}


.filter-box option {

    background:
        var(--surface-2);

    color:
        var(--text);
}


/* =========================================================
   SECTION HEADER
   ========================================================= */

.section-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 15px;
}


.section-header h2 {

    font-size: 20px;

    letter-spacing: -0.5px;
}


.section-header p {

    margin-top: 3px;

    color: var(--text-muted);

    font-size: 13px;
}


/* =========================================================
   TRANSFER LIST
   ========================================================= */

#transferList {

    display: flex;

    flex-direction: column;

    gap: 14px;
}


/* =========================================================
   TRANSFER CARD
   ========================================================= */

.transfer-card {

    position: relative;

    overflow: hidden;

    padding: 23px;

    border:
        1px solid var(--border);

    border-radius:
        var(--radius-lg);

    background:
        linear-gradient(
            145deg,
            var(--surface),
            #0e131a
        );

    box-shadow:
        var(--shadow-small);

    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}


.transfer-card:hover {

    transform:
        translateY(-2px);

    border-color:
        var(--border-light);

    box-shadow:
        0 20px 50px
        rgba(0, 0, 0, 0.35);
}


.transfer-card::before {

    content: "";

    position: absolute;

    left: 0;
    top: 0;

    width: 3px;
    height: 100%;

    background:
        var(--blue);

    opacity: 0.7;
}


.transfer-card.driving::before {

    background:
        var(--orange);
}


.transfer-card.completed::before {

    background:
        var(--green);
}


/* =========================================================
   CARD TOP
   ========================================================= */

.transfer-card-top {

    display: flex;

    justify-content: space-between;

    gap: 20px;

    margin-bottom: 20px;
}


.transfer-main-info h3 {

    margin-top: 7px;

    font-size: 19px;

    letter-spacing: -0.4px;
}


.transfer-status-row {

    display: flex;
}


.status {

    display: inline-flex;

    align-items: center;

    gap: 7px;

    padding:
        5px
        9px;

    border-radius: 999px;

    font-size: 10px;

    font-weight: 800;

    text-transform: uppercase;

    letter-spacing: 0.5px;
}


.status-dot {

    width: 6px;
    height: 6px;

    border-radius: 50%;

    background:
        currentColor;
}


.status.pending {

    color:
        var(--blue-light);

    background:
        rgba(59, 130, 246, 0.10);
}


.status.driving {

    color:
        var(--orange-light);

    background:
        rgba(245, 158, 11, 0.10);
}


.status.completed {

    color:
        var(--green-light);

    background:
        rgba(34, 197, 94, 0.10);
}


.transfer-date {

    display: flex;

    flex-direction: column;

    align-items: flex-end;

    color: var(--text-muted);

    font-size: 12px;
}


.transfer-date strong {

    color: var(--text-soft);

    font-size: 13px;
}


/* =========================================================
   ROUTE
   ========================================================= */

.route-box {

    display: grid;

    grid-template-columns: 1fr 80px 1fr;

    align-items: center;

    padding: 18px;

    margin-bottom: 15px;

    border:
        1px solid var(--border);

    border-radius:
        15px;

    background:
        rgba(255, 255, 255, 0.025);
}


.route-point {

    display: flex;

    align-items: center;

    gap: 11px;
}


.route-point small {

    display: block;

    margin-bottom: 2px;

    color:
        var(--text-muted);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 1px;
}


.route-point strong {

    display: block;

    font-size: 14px;
}


.route-dot {

    width: 11px;
    height: 11px;

    flex-shrink: 0;

    border-radius: 50%;

    border: 3px solid var(--surface);

    box-shadow:
        0 0 0 2px currentColor;
}


.route-dot.start {

    color:
        var(--blue);

    background:
        var(--blue);
}


.route-dot.end {

    color:
        var(--green);

    background:
        var(--green);
}


.route-line {

    height: 1px;

    background:
        linear-gradient(
            90deg,
            var(--blue),
            var(--green)
        );

    opacity: 0.45;
}


/* =========================================================
   VEHICLE
   ========================================================= */

.vehicle-info {

    display: flex;

    align-items: center;

    gap: 11px;

    margin-bottom: 15px;
}


.vehicle-icon {

    width: 38px;
    height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background:
        rgba(255, 255, 255, 0.05);

    font-size: 17px;
}


.vehicle-info small {

    display: block;

    color:
        var(--text-muted);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 1px;
}


.vehicle-info strong {

    display: block;

    margin-top: 1px;

    font-size: 13px;
}


/* =========================================================
   META
   ========================================================= */

.transfer-meta {

    display: flex;

    flex-wrap: wrap;

    gap: 8px;

    padding-top: 14px;

    border-top:
        1px solid var(--border);
}


.transfer-meta span {

    padding:
        6px
        9px;

    border-radius: 8px;

    background:
        rgba(255, 255, 255, 0.035);

    color:
        var(--text-muted);

    font-size: 11px;
}


.transfer-meta strong {

    color:
        var(--text-soft);
}


/* =========================================================
   NOTES
   ========================================================= */

.transfer-notes {

    display: flex;

    gap: 9px;

    margin-top: 12px;

    padding: 12px;

    border-radius: 11px;

    background:
        rgba(255, 255, 255, 0.025);

    color:
        var(--text-soft);

    font-size: 12px;
}


.transfer-notes p {

    flex: 1;
}


/* =========================================================
   ACTIONS
   ========================================================= */

.transfer-actions {

    display: flex;

    align-items: center;

    flex-wrap: wrap;

    gap: 8px;

    margin-top: 17px;
}


.btn {

    min-height: 38px;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 7px;

    padding:
        8px
        12px;

    border:
        1px solid transparent;

    border-radius: 10px;

    font-size: 12px;

    font-weight: 700;

    transition:
        transform 0.18s ease,
        background 0.18s ease,
        border-color 0.18s ease;
}


.btn:hover {

    transform:
        translateY(-1px);
}


.btn.secondary {

    background:
        rgba(255, 255, 255, 0.05);

    border-color:
        var(--border);

    color:
        var(--text-soft);
}


.btn.secondary:hover {

    background:
        rgba(255, 255, 255, 0.08);

    color:
        var(--text);
}


.btn.primary {

    background:
        rgba(59, 130, 246, 0.14);

    border-color:
        rgba(59, 130, 246, 0.20);

    color:
        var(--blue-light);
}


.btn.primary:hover {

    background:
        rgba(59, 130, 246, 0.22);
}


.btn.success {

    background:
        rgba(34, 197, 94, 0.13);

    border-color:
        rgba(34, 197, 94, 0.20);

    color:
        var(--green-light);
}


.btn.success:hover {

    background:
        rgba(34, 197, 94, 0.21);
}


.btn.danger {

    margin-left: auto;

    width: 38px;

    padding: 0;

    background:
        rgba(239, 68, 68, 0.08);

    border-color:
        rgba(239, 68, 68, 0.12);

    color:
        var(--red-light);
}


.btn.danger:hover {

    background:
        rgba(239, 68, 68, 0.17);
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

.empty-state {

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    min-height: 270px;

    padding: 40px;

    border:
        1px dashed
        rgba(255, 255, 255, 0.12);

    border-radius:
        var(--radius-lg);

    background:
        rgba(255, 255, 255, 0.015);

    text-align: center;
}


.empty-icon {

    width: 65px;
    height: 65px;

    display: flex;

    align-items: center;
    justify-content: center;

    margin-bottom: 15px;

    border-radius: 20px;

    background:
        rgba(59, 130, 246, 0.10);

    font-size: 28px;
}


.empty-state h3 {

    font-size: 17px;
}


.empty-state p {

    max-width: 340px;

    margin-top: 5px;

    color:
        var(--text-muted);

    font-size: 13px;
}


.empty-action {

    margin-top: 18px;

    padding:
        10px
        16px;

    border:
        1px solid
        rgba(59, 130, 246, 0.25);

    border-radius: 10px;

    background:
        rgba(59, 130, 246, 0.10);

    color:
        var(--blue-light);

    font-size: 12px;

    font-weight: 700;
}


/* =========================================================
   MODALS
   ========================================================= */

.modal {

    position: fixed;

    inset: 0;

    z-index: 500;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 20px;

    background:
        rgba(0, 0, 0, 0.72);

    backdrop-filter:
        blur(10px);

    -webkit-backdrop-filter:
        blur(10px);

    opacity: 0;

    visibility: hidden;

    transition:
        opacity 0.25s ease,
        visibility 0.25s ease;
}


.modal.active {

    opacity: 1;

    visibility: visible;
}


.modal-content {

    width: min(
        760px,
        100%
    );

    max-height:
        calc(100vh - 40px);

    overflow-y: auto;

    padding: 28px;

    border:
        1px solid
        var(--border-light);

    border-radius:
        var(--radius-xl);

    background:
        linear-gradient(
            145deg,
            #151b25,
            #0d1219
        );

    box-shadow:
        0 35px 100px
        rgba(0, 0, 0, 0.65);

    transform:
        translateY(15px)
        scale(0.98);

    transition:
        transform 0.25s ease;
}


.modal.active .modal-content {

    transform:
        translateY(0)
        scale(1);
}


.modal-content::-webkit-scrollbar {

    width: 6px;
}


.modal-content::-webkit-scrollbar-thumb {

    background:
        rgba(255, 255, 255, 0.12);

    border-radius:
        999px;
}


/* =========================================================
   MODAL HEADER
   ========================================================= */

.modal-header {

    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 20px;

    margin-bottom: 25px;
}


.modal-eyebrow {

    display: block;

    margin-bottom: 4px;

    color:
        var(--blue-light);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 1.5px;
}


.modal-header h2 {

    font-size: 24px;

    letter-spacing: -0.7px;
}


.close-btn {

    width: 38px;
    height: 38px;

    flex-shrink: 0;

    border:
        1px solid var(--border);

    border-radius: 11px;

    background:
        rgba(255, 255, 255, 0.04);

    color:
        var(--text-muted);

    font-size: 25px;

    line-height: 1;

    transition:
        background 0.2s ease,
        color 0.2s ease,
        transform 0.2s ease;
}


.close-btn:hover {

    background:
        rgba(239, 68, 68, 0.10);

    color:
        var(--red-light);

    transform:
        rotate(5deg);
}


/* =========================================================
   FORM
   ========================================================= */

.form-section {

    margin-bottom: 25px;

    padding: 20px;

    border:
        1px solid var(--border);

    border-radius:
        var(--radius-lg);

    background:
        rgba(255, 255, 255, 0.018);
}


.form-section-title {

    display: flex;

    align-items: center;

    gap: 12px;

    margin-bottom: 20px;
}


.form-section-icon {

    width: 40px;
    height: 40px;

    display: flex;

    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 12px;

    background:
        rgba(59, 130, 246, 0.10);

    font-size: 18px;
}


.form-section-title strong {

    display: block;

    font-size: 14px;
}


.form-section-title span {

    display: block;

    margin-top: 2px;

    color:
        var(--text-muted);

    font-size: 11px;
}


.form-grid {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 16px;
}


.form-group {

    display: flex;

    flex-direction: column;

    gap: 7px;
}


.form-group.full {

    grid-column:
        1 / -1;
}


.form-group label {

    color:
        var(--text-soft);

    font-size: 11px;

    font-weight: 700;
}


.form-group input,
.form-group textarea {

    width: 100%;

    border:
        1px solid var(--border);

    border-radius:
        12px;

    outline: none;

    background:
        rgba(255, 255, 255, 0.035);

    color:
        var(--text);

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
}


.form-group input {

    height: 46px;

    padding:
        0
        13px;
}


.form-group textarea {

    min-height: 95px;

    resize: vertical;

    padding: 13px;
}


.form-group input::placeholder,
.form-group textarea::placeholder {

    color:
        var(--text-muted);
}


.form-group input:focus,
.form-group textarea:focus {

    border-color:
        rgba(59, 130, 246, 0.65);

    background:
        rgba(59, 130, 246, 0.025);

    box-shadow:
        0 0 0 4px
        rgba(59, 130, 246, 0.07);
}


/* =========================================================
   INPUT WITH ICON
   ========================================================= */

.input-with-icon {

    position: relative;
}


.input-with-icon > span {

    position: absolute;

    left: 13px;

    top: 50%;

    transform:
        translateY(-50%);

    z-index: 2;
}


.input-with-icon input {

    padding-left: 40px;
}


/* =========================================================
   PHOTO SECTION
   ========================================================= */

.photo-section {

    background:
        linear-gradient(
            145deg,
            rgba(59, 130, 246, 0.035),
            rgba(255, 255, 255, 0.015)
        );
}


.photo-section-title {

    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 15px;

    margin-bottom: 17px;
}


.photo-heading {

    display: flex;

    align-items: center;

    gap: 12px;
}


.form-section-icon.camera {

    background:
        rgba(139, 92, 246, 0.11);
}


.photo-heading h3 {

    font-size: 14px;
}


.photo-heading p {

    margin-top: 2px;

    color:
        var(--text-muted);

    font-size: 11px;
}


.photo-count {

    flex-shrink: 0;

    padding:
        6px
        10px;

    border-radius: 999px;

    background:
        rgba(59, 130, 246, 0.10);

    color:
        var(--blue-light);

    font-size: 11px;

    font-weight: 800;
}


/* =========================================================
   PHOTO LIST
   ========================================================= */

.photo-list {

    display: flex;

    flex-direction: column;

    gap: 7px;
}


.photo-row {

    display: flex;

    align-items: center;

    gap: 12px;

    min-height: 60px;

    padding:
        8px
        10px;

    border:
        1px solid transparent;

    border-radius: 12px;

    background:
        rgba(255, 255, 255, 0.025);

    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}


.photo-row:hover {

    background:
        rgba(255, 255, 255, 0.045);

    border-color:
        var(--border);
}


.photo-row-icon {

    width: 37px;
    height: 37px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 10px;

    background:
        rgba(255, 255, 255, 0.05);

    font-size: 16px;
}


.photo-row-content {

    flex: 1;

    min-width: 0;

    display: flex;

    flex-direction: column;
}


.photo-row-content strong {

    font-size: 12px;
}


.photo-row-content span {

    margin-top: 1px;

    color:
        var(--text-muted);

    font-size: 10px;
}


.photo-row-content span.added {

    color:
        var(--green-light);

    font-weight: 700;
}


/* =========================================================
   PHOTO BUTTON
   ========================================================= */

.photo-button {

    position: relative;

    overflow: hidden;

    display: inline-flex;

    align-items: center;

    gap: 5px;

    padding:
        8px
        11px;

    border:
        1px solid var(--border);

    border-radius: 9px;

    background:
        rgba(255, 255, 255, 0.045);

    color:
        var(--text-soft);

    font-size: 10px;

    font-weight: 700;

    cursor: pointer;

    transition:
        background 0.2s ease,
        color 0.2s ease;
}


.photo-button:hover {

    background:
        rgba(59, 130, 246, 0.12);

    color:
        var(--blue-light);
}


.photo-button input {

    position: absolute;

    width: 1px;
    height: 1px;

    opacity: 0;

    pointer-events: none;
}


/* =========================================================
   PHOTO PREVIEW
   ========================================================= */

.photo-preview {

    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 8px;

    margin-top: 12px;
}


.photo-preview-item {

    position: relative;

    overflow: hidden;

    aspect-ratio: 1;

    border-radius: 10px;

    border:
        1px solid var(--border);

    background:
        var(--surface-2);
}


.photo-preview-item img {

    width: 100%;
    height: 100%;

    object-fit: cover;
}


.photo-preview-item span {

    position: absolute;

    left: 4px;
    right: 4px;
    bottom: 4px;

    padding: 3px;

    border-radius: 5px;

    background:
        rgba(0, 0, 0, 0.65);

    color: white;

    font-size: 8px;

    text-align: center;
}


/* =========================================================
   SUBMIT
   ========================================================= */

.submit-btn {

    width: 100%;

    min-height: 52px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    border: none;

    border-radius: 14px;

    background:
        linear-gradient(
            135deg,
            var(--blue),
            var(--blue-dark)
        );

    color: white;

    box-shadow:
        0 10px 30px
        rgba(37, 99, 235, 0.24);

    font-size: 13px;

    font-weight: 800;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;
}


.submit-btn:hover {

    transform:
        translateY(-2px);

    box-shadow:
        0 15px 35px
        rgba(37, 99, 235, 0.32);

    filter:
        brightness(1.08);
}


.submit-btn:active {

    transform:
        scale(0.985);
}


.submit-arrow {

    margin-left: 3px;

    font-size: 17px;
}


.finish-btn {

    background:
        linear-gradient(
            135deg,
            #16a34a,
            #15803d
        );

    box-shadow:
        0 10px 30px
        rgba(34, 197, 94, 0.18);
}


.finish-btn:hover {

    box-shadow:
        0 15px 35px
        rgba(34, 197, 94, 0.25);
}


/* =========================================================
   FINISH INFO
   ========================================================= */

.finish-info {

    display: flex;

    align-items: center;

    gap: 13px;

    margin-bottom: 20px;

    padding: 15px;

    border:
        1px solid var(--border);

    border-radius: 15px;

    background:
        rgba(255, 255, 255, 0.025);
}


.finish-car-icon {

    width: 45px;
    height: 45px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 13px;

    background:
        rgba(34, 197, 94, 0.10);

    font-size: 21px;
}


.finish-info strong {

    display: block;

    font-size: 14px;
}


.finish-info span {

    display: block;

    margin-top: 2px;

    color:
        var(--text-muted);

    font-size: 11px;
}


/* =========================================================
   DETAILS
   ========================================================= */

.details-section {

    margin-bottom: 20px;

    padding: 20px;

    border:
        1px solid var(--border);

    border-radius:
        var(--radius-lg);

    background:
        rgba(255, 255, 255, 0.018);
}


.details-grid {

    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 10px;
}


.detail-item {

    padding:
        12px;

    border-radius: 11px;

    background:
        rgba(255, 255, 255, 0.025);
}


.detail-item span {

    display: block;

    margin-bottom: 3px;

    color:
        var(--text-muted);

    font-size: 10px;
}


.detail-item strong {

    display: block;

    font-size: 12px;
}


.details-note {

    display: flex;

    gap: 10px;

    margin-top: 10px;

    padding: 13px;

    border-radius: 11px;

    background:
        rgba(59, 130, 246, 0.06);

    color:
        var(--text-soft);
}


.details-note small {

    color:
        var(--blue-light);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 0.7px;
}


.details-note p {

    margin-top: 3px;

    font-size: 12px;
}


.details-section-heading {

    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 13px;
}


.details-section-heading h3 {

    font-size: 14px;
}


.details-section-heading span {

    color:
        var(--text-muted);

    font-size: 10px;
}


.details-photos {

    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 8px;
}


.details-photo {

    overflow: hidden;

    position: relative;

    aspect-ratio: 1;

    display: flex;

    flex-direction: column;

    justify-content: flex-end;

    border-radius: 10px;

    border:
        1px solid var(--border);

    background:
        var(--surface-2);
}


.details-photo img {

    position: absolute;

    inset: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
}


.details-photo span {

    position: relative;

    z-index: 2;

    padding: 5px;

    background:
        linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.85)
        );

    color: white;

    font-size: 8px;

    text-align: center;
}


.details-photo.empty {

    align-items: center;

    justify-content: center;

    gap: 3px;

    color:
        var(--text-muted);

    text-align: center;
}


.details-photo.empty div {

    font-size: 20px;

    opacity: 0.45;
}


.details-photo.empty span {

    padding: 0;

    background: none;

    color:
        var(--text-soft);

    font-size: 9px;
}


.details-photo.empty small {

    font-size: 8px;
}


/* =========================================================
   FOCUS
   ========================================================= */

button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {

    outline:
        2px solid
        var(--blue-light);

    outline-offset: 2px;
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 900px) {

    .dashboard {

        grid-template-columns:
            repeat(2, 1fr);
    }


    .welcome-decoration {

        width: 105px;
        height: 105px;

        font-size: 45px;
    }

}


/* =========================================================
   TABLET / PHONE
   ========================================================= */

@media (max-width: 700px) {

    .topbar {

        height: 68px;

        padding:
            0
            15px;
    }


    .logo-text span {

        display: none;
    }


    .logo-icon {

        width: 38px;
        height: 38px;

        border-radius: 11px;
    }


    .add-btn {

        padding:
            10px
            13px;
    }


    .container {

        width:
            calc(100% - 24px);

        padding:
            25px
            0
            50px;
    }


    .welcome {

        min-height:
            auto;

        padding:
            28px
            25px;

        border-radius:
            22px;
    }


    .welcome h1 {

        font-size:
            30px;
    }


    .welcome p {

        font-size:
            13px;
    }


    .welcome-decoration {

        display: none;
    }


    .dashboard {

        gap: 9px;
    }


    .stat-card {

        min-height:
            100px;

        padding:
            14px;

        gap: 10px;

        border-radius:
            17px;
    }


    .stat-icon {

        width: 40px;
        height: 40px;

        border-radius: 12px;

        font-size: 18px;
    }


    .stat-content strong {

        font-size:
            24px;
    }


    .toolbar {

        flex-direction:
            column;

        align-items:
            stretch;
    }


    .filter-box {

        justify-content:
            space-between;
    }


    .transfer-card {

        padding:
            17px;
    }


    .route-box {

        grid-template-columns:
            1fr;

        gap: 12px;
    }


    .route-line {

        width:
            1px;

        height:
            18px;

        margin-left:
            5px;

        background:
            linear-gradient(
                var(--blue),
                var(--green)
            );
    }


    .transfer-actions {

        display:
            grid;

        grid-template-columns:
            1fr 1fr;
    }


    .btn {

        width:
            100%;
    }


    .btn.danger {

        margin-left:
            0;
    }


    .modal {

        align-items:
            flex-end;

        padding:
            0;
    }


    .modal-content {

        max-height:
            92vh;

        padding:
            21px;

        border-radius:
            24px
            24px
            0
            0;
    }


    .form-grid {

        grid-template-columns:
            1fr;
    }


    .form-group.full {

        grid-column:
            auto;
    }


    .photo-preview {

        grid-template-columns:
            repeat(3, 1fr);
    }


    .details-grid {

        grid-template-columns:
            1fr;
    }


    .details-photos {

        grid-template-columns:
            repeat(3, 1fr);
    }

}


/* =========================================================
   SMALL PHONE
   ========================================================= */

@media (max-width: 430px) {

    .topbar {

        padding:
            0
            11px;
    }


    .logo-text strong {

        font-size:
            15px;
    }


    .add-btn span:last-child {

        display:
            none;
    }


    .add-btn {

        width:
            40px;

        height:
            40px;

        padding:
            0;

        justify-content:
            center;

        border-radius:
            12px;
    }


    .add-btn span:first-child {

        font-size:
            22px;
    }


    .container {

        width:
            calc(100% - 18px);

        padding-top:
            18px;
    }


    .welcome {

        padding:
            24px
            20px;
    }


    .welcome h1 {

        font-size:
            27px;
    }


    .dashboard {

        grid-template-columns:
            repeat(2, 1fr);
    }


    .stat-card {

        min-height:
            90px;

        padding:
            12px;
    }


    .stat-icon {

        width:
            35px;

        height:
            35px;

        font-size:
            16px;
    }


    .stat-content small {

        font-size:
            9px;
    }


    .stat-content strong {

        font-size:
            21px;
    }


    .transfer-card-top {

        flex-direction:
            column;

        gap:
            10px;
    }


    .transfer-date {

        align-items:
            flex-start;

        flex-direction:
            row;

        gap:
            5px;
    }


    .transfer-actions {

        grid-template-columns:
            1fr;
    }


    .photo-row {

        min-height:
            57px;
    }


    .photo-button {

        padding:
            8px;

        font-size:
            9px;
    }


    .photo-button span {

        display:
            none;
    }


    .form-section {

        padding:
            15px;
    }


    .modal-header h2 {

        font-size:
            21px;
    }


    .details-photos {

        grid-template-columns:
            repeat(2, 1fr);
    }

}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {

        scroll-behavior: auto !important;

        transition-duration:
            0.01ms !important;

        animation-duration:
            0.01ms !important;

        animation-iteration-count:
            1 !important;
    }

}
