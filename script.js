// Game State
let balance = 0;
let clickPower = 1;
let autoRate = 0;
const multiplier = 1.15; // De oneindige prijs-verhoging

let upgrades = {
    click: { level: 0, cost: 10, powerPerLevel: 1 },
    auto: { level: 0, cost: 50, powerPerLevel: 2 }
};

// Elements
const coin = document.getElementById('coin');
const balanceDisplay = document.getElementById('balance');
const cpsDisplay = document.getElementById('cps');

// --- Click Handler ---
function handleInteraction(x, y) {
    balance += clickPower;
    spawnText(x, y, `+€${clickPower}`);
    updateUI();
}

coin.addEventListener('mousedown', (e) => handleInteraction(e.clientX, e.clientY));
coin.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);
});

// --- Upgrade Logic ---
document.getElementById('upg-click').onclick = () => buyUpgrade('click');
document.getElementById('upg-auto').onclick = () => buyUpgrade('auto');

function buyUpgrade(type) {
    const upg = upgrades[type];
    if (balance >= upg.cost) {
        balance -= upg.cost;
        upg.level++;
        
        if (type === 'click') clickPower += upg.powerPerLevel;
        if (type === 'auto') autoRate += upg.powerPerLevel;
        
        // De prijs gaat oneindig omhoog met de multiplier
        upg.cost = Math.floor(upg.cost * multiplier);
        updateUI();
    }
}

// --- Game Loop (Automatic Income) ---
setInterval(() => {
    balance += autoRate;
    updateUI();
}, 1000);

// --- Helpers ---
function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return Math.floor(n).toLocaleString('nl-NL');
}

function updateUI() {
    balanceDisplay.innerText = `€${formatNumber(balance)}`;
    cpsDisplay.innerText = `Income: €${formatNumber(autoRate)} /sec`;

    // Check if upgrades are affordable for visual glow
    updateBtn('upg-click', 'click');
    updateBtn('upg-auto', 'auto');
}

function updateBtn(elementId, type) {
    const btn = document.getElementById(elementId);
    const upg = upgrades[type];
    
    document.getElementById(`${type}-lv`).innerText = `Level ${upg.level}`;
    document.getElementById(`${type}-cost`).innerText = `€${formatNumber(upg.cost)}`;
    
    if (balance >= upg.cost) btn.classList.add('available');
    else btn.classList.remove('available');
}

function spawnText(x, y, val) {
    const div = document.createElement('div');
    div.className = 'float-text';
    div.innerText = val;
    div.style.left = `${x - 20}px`;
    div.style.top = `${y - 20}px`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 700);
}

// Initial UI Call
updateUI();
