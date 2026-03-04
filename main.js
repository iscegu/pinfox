/* ============================================================
   PINFOX — main.js
   ============================================================ */

/* SAYI FORMATLAMA */
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.', ',') + ' M';
    if (num >= 1000)    return (num / 1000).toFixed(1).replace('.', ',') + ' B';
    return num.toLocaleString('tr-TR');
}

/* FİLTRE TOGGLE */
function toggleFilter(el) {
    const box = el.parentElement;
    box.classList.toggle('active');
}

/* ============================================================
   SAYAÇ SİSTEMİ
   ============================================================ */

const API = '/api/count.php';

/* Sayfa ziyaretini kaydet — type: tool | game | social, id: sayfa adı */
async function trackVisit(type, id) {
    try { await fetch(`${API}?action=hit&type=${type}&id=${id}`); } catch(e) {}
}

/* Kart tıklanmasını kaydet (ayrıca sayfa açılınca da trackVisit çağrılır) */
async function trackHit(type, id) {
    try { await fetch(`${API}?action=hit&type=${type}&id=${id}`); } catch(e) {}
}

/* Tüm sayaçları API'den çek ve ekrana yaz */
async function loadCounters() {
    try {
        const res  = await fetch(`${API}?action=get`);
        const data = await res.json();

        /* Kategori toplamları */
        const totalGames  = Object.values(data.games  || {}).reduce((a, b) => a + b, 0);
        const totalTools  = Object.values(data.tools  || {}).reduce((a, b) => a + b, 0);
        const totalSocial = Object.values(data.social || {}).reduce((a, b) => a + b, 0);

        const gamesEl  = document.getElementById('gamesCounter');
        const toolsEl  = document.getElementById('toolsCounter');
        const socialEl = document.getElementById('socialCounter');

        if (gamesEl)  gamesEl.innerText  = formatNumber(totalGames);
        if (toolsEl)  toolsEl.innerText  = formatNumber(totalTools);
        if (socialEl) socialEl.innerText = formatNumber(totalSocial);

        /* Kart bazlı sayaçlar */
        document.querySelectorAll('[data-count-id]').forEach(el => {
            const type = el.dataset.countType;
            const id   = el.dataset.countId;
            const src  = type === 'tool'   ? data.tools
                       : type === 'game'   ? data.games
                       : data.social;
            el.innerText = formatNumber((src && src[id]) || 0);
        });

    } catch(e) {
        console.warn('Sayaç API bağlantısı kurulamadı:', e);
    }
}

/* Sayfa yüklenince */
document.addEventListener('DOMContentLoaded', () => {
    loadCounters();
});