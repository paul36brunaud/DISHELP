// --- Sélecteurs principaux ---
const buttons = document.querySelectorAll(".menu-btn");
const content = document.getElementById("content");

// --- Données stockées ---
let pantry = JSON.parse(localStorage.getItem("dishelp_pantry")) || [];
let favorites = JSON.parse(localStorage.getItem("dishelp_favorites")) || [];
let fruitList = JSON.parse(localStorage.getItem("dishelp_fruitList")) || [];
let vegList = JSON.parse(localStorage.getItem("dishelp_vegList")) || [];

// --- Pages ---
const pages = {
  home: `
    <h2>🍽️ Bienvenue sur Dishelp</h2>
    <p id="intro-text">Découvrez des recettes adaptées à vos goûts et à votre garde-manger.</p>
  `,
  favorites: `
    <h2>❤️ Mes favoris</h2>
    <div id="fav-list"></div>
  `,
  pantry: `
    <h2>🧺 Mon garde-manger</h2>
    <div class="pantry-input">
      <input id="ing-input" type="text" placeholder="Ajouter un ingrédient..." />
      <button id="add-ing" type="button">+</button>
    </div>
    <ul id="ing-list"></ul>
  `,
  profile: `
    <h2 class="title-profile">Mon Profil</h2>
    <div class="profile-card">
      <div class="profile-photo">
        <div class="photo-circle">👤</div>
      </div>

      <form id="profile-form" class="profile-form">
        <div class="profile-section">
          <label class="section-label">⚠️ Allergènes :</label>
          <select id="allergens" multiple class="profile-select">
            <option value="Arachides">Arachides</option>
            <option value="Fruits à coque">Fruits à coque</option>
            <option value="Œufs">Œufs</option>
            <option value="Lait">Lait</option>
            <option value="Poissons">Poissons</option>
            <option value="Crustacés">Crustacés</option>
            <option value="Blé">Blé</option>
            <option value="Gluten">Gluten</option>
            <option value="Soja">Soja</option>
          </select>
        </div>

        <div class="profile-section">
          <label class="section-label">🍎 Fruits :</label>
          <div class="small-input-row">
            <input type="text" id="fruits" class="profile-input" />
            <button type="button" id="add-fruit" class="add-small">+</button>
          </div>
          <ul id="fruit-list" class="list-box"></ul>
        </div>

        <div class="profile-section">
          <label class="section-label">🥕 Légumes :</label>
          <div class="small-input-row">
            <input type="text" id="vegetables" class="profile-input" />
            <button type="button" id="add-veg" class="add-small">+</button>
          </div>
          <ul id="veg-list" class="list-box"></ul>
        </div>

        <button type="submit" class="profile-btn">💾 Enregistrer</button>
      </form>
    </div>
  `
};

// --- Navigation ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";

  buttons.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-target="${target}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (target === "pantry") renderPantry();
  if (target === "favorites") renderFavorites();
  if (target === "home") initHome();
  if (target === "profile") initProfile();

  // --- Bouton hamburger visible UNIQUEMENT sur Accueil ---
  const toggleBtn = document.getElementById("toggleBtn");
  const sideMenu = document.getElementById("menu");

  if (toggleBtn && sideMenu) {
    if (target === "home") {
      toggleBtn.style.display = "flex";
    } else {
      toggleBtn.style.display = "none";
      sideMenu.classList.remove("open");
    }
  }
}

// --- PANTRY ---
function renderPantry() {
  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");

  function renderList() {
    list.innerHTML = "";
    pantry.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "pantry-item";
      li.innerHTML = `
        <span>${item.name}</span>
        <input type="number" value="${item.qty}" min="1" class="qty-input"/>
        <button>❌</button>
      `;
      li.querySelector("button").onclick = () => {
        pantry.splice(idx, 1);
        localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
        renderList();
      };
      list.appendChild(li);
    });
  }

  addBtn.onclick = () => {
    if (!input.value.trim()) return;
    pantry.push({ name: input.value, qty: 1 });
    localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
    input.value = "";
    renderList();
  };

  renderList();
}

// --- FAVORIS ---
function saveFavorites() {
  localStorage.setItem("dishelp_favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const list = document.getElementById("fav-list");
  if (!favorites.length) {
    list.innerHTML = "<p>Aucun favori.</p>";
    return;
  }

  list.innerHTML = favorites.map((f, i) => `
    <div class="recipe-card">
      ${f.full}
      <button data-i="${i}">❌</button>
    </div>
  `).join("");

  list.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      favorites.splice(btn.dataset.i, 1);
      saveFavorites();
      renderFavorites();
    };
  });
}

// --- HOME ---
function initHome() {}

// --- PROFIL ---
function initProfile() {
  const allergensSelect = document.getElementById("allergens");
  const saved = JSON.parse(localStorage.getItem("dishelp_allergens")) || [];

  [...allergensSelect.options].forEach(opt => {
    if (saved.includes(opt.value)) opt.selected = true;
    opt.onmousedown = e => {
      e.preventDefault();
      opt.selected = !opt.selected;
    };
  });

  document.getElementById("profile-form").onsubmit = e => {
    e.preventDefault();
    const values = [...allergensSelect.selectedOptions].map(o => o.value);
    localStorage.setItem("dishelp_allergens", JSON.stringify(values));
    alert("Profil enregistré !");
  };
}

// --- HAMBURGER ---
const toggleBtn = document.getElementById("toggleBtn");
const sideMenu = document.getElementById("menu");

if (toggleBtn && sideMenu) {
  toggleBtn.onclick = () => sideMenu.classList.toggle("open");
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  showPage("home");
  buttons.forEach(btn =>
    btn.onclick = () => showPage(btn.dataset.target)
  );
});
