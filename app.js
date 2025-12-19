// ================================
//   SÉLECTEURS PRINCIPAUX
// ================================
const buttons = document.querySelectorAll(".menu-btn");
const content = document.getElementById("content");

// ================================
//   DONNÉES STOCKÉES
// ================================
let pantry = JSON.parse(localStorage.getItem("dishelp_pantry")) || [];
let favorites = JSON.parse(localStorage.getItem("dishelp_favorites")) || [];
let fruitList = JSON.parse(localStorage.getItem("dishelp_fruitList")) || [];
let vegList = JSON.parse(localStorage.getItem("dishelp_vegList")) || [];

// ================================
//   PAGES
// ================================
const pages = {
  home: `
    <h2>🍽️ Bienvenue sur Dishelp</h2>
    <p id="intro-text">Découvrez des recettes adaptées à vos goûts.</p>
    <section class="menus-home" id="menus-home"></section>
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
            <input type="text" id="fruits" placeholder="Ajouter un fruit" class="profile-input" />
            <button type="button" id="add-fruit" class="add-small">+</button>
          </div>
          <ul id="fruit-list" class="list-box"></ul>
        </div>

        <div class="profile-section">
          <label class="section-label">🥕 Légumes :</label>
          <div class="small-input-row">
            <input type="text" id="vegetables" placeholder="Ajouter un légume" class="profile-input" />
            <button type="button" id="add-veg" class="add-small">+</button>
          </div>
          <ul id="veg-list" class="list-box"></ul>
        </div>

        <button type="submit" class="profile-btn">💾 Enregistrer</button>
      </form>

      <div id="profile-summary" class="profile-summary"></div>
    </div>
  `
};

// ================================
//   NAVIGATION
// ================================
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";

  buttons.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-target="${target}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (target === "pantry") renderPantry();
  if (target === "favorites") renderFavorites();
  if (target === "home") initHome();
  if (target === "profile") initProfile();
}

// ================================
//   PANTRY
// ================================
function renderPantry() {
  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");

  pantry = pantry.map(item =>
    typeof item === "string" ? { name: item, qty: 1 } : item
  );

  function renderList() {
    list.innerHTML = "";

    pantry.forEach((item, idx) => {
      const li = document.createElement("li");
      li.classList.add("pantry-item");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = item.name;

      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.min = 1;
      qtyInput.value = item.qty;
      qtyInput.classList.add("qty-input");

      qtyInput.addEventListener("change", () => {
        item.qty = parseInt(qtyInput.value) || 1;
        localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.addEventListener("click", () => {
        pantry.splice(idx, 1);
        localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
        renderList();
      });

      li.append(nameSpan, qtyInput, delBtn);
      list.appendChild(li);
    });
  }

  function addIngredient() {
    const val = input.value.trim();
    if (!val) return;

    pantry.push({ name: val, qty: 1 });
    localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
    input.value = "";
    renderList();
  }

  addBtn.addEventListener("click", addIngredient);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  });

  renderList();
}

// ================================
//   FAVORIS
// ================================
function saveFavorites() {
  localStorage.setItem("dishelp_favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const list = document.getElementById("fav-list");

  if (!favorites.length) {
    list.innerHTML = "<p>Aucun favori pour le moment.</p>";
    return;
  }

  list.innerHTML = favorites.map((f, i) => `
    <div class="recipe-card" data-recipe="${f.name}">
      ${f.full}
      <button data-index="${i}" class="fav-toggle">❌</button>
    </div>
  `).join("");

  list.querySelectorAll(".fav-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      favorites.splice(btn.dataset.index, 1);
      saveFavorites();
      renderFavorites();
    });
  });
}

// ================================
//   HOME
// ================================
function initHome() {
  renderHomeMenus();

  document.querySelectorAll(".fav-btn").forEach(btn => {
    const card = btn.closest(".recipe-card");
    if (!card) return;

    const name = card.dataset.recipe;
    btn.textContent = favorites.some(f => f.name === name) ? "❌" : "❤️";

    btn.addEventListener("click", () => {
      if (favorites.some(f => f.name === name)) {
        favorites = favorites.filter(f => f.name !== name);
        btn.textContent = "❤️";
      } else {
        favorites.push({ name, full: card.innerHTML });
        btn.textContent = "❌";
      }
      saveFavorites();
    });
  });
}

// ================================
//   PROFIL
// ================================
function initProfile() {
  const allergensSelect = document.getElementById("allergens");
  const saved = JSON.parse(localStorage.getItem("dishelp_allergens")) || [];

  Array.from(allergensSelect.options).forEach(opt => {
    opt.selected = saved.includes(opt.value);
    opt.addEventListener("mousedown", e => {
      e.preventDefault();
      opt.selected = !opt.selected;
    });
  });

  document
    .getElementById("profile-form")
    .addEventListener("submit", saveProfile);
}

function saveProfile(e) {
  e.preventDefault();

  const select = document.getElementById("allergens");
  const values = Array.from(select.selectedOptions).map(o => o.value);
  localStorage.setItem("dishelp_allergens", JSON.stringify(values));

  const msg = document.createElement("div");
  msg.className = "save-confirm";
  msg.textContent = "✔ Profil enregistré";
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 1800);
}

// ================================
//   MENU DU JOUR
// ================================
function generateDailyMenu() {
  const pantry = JSON.parse(localStorage.getItem("dishelp_pantry")) || [];
  const allergens = (JSON.parse(localStorage.getItem("dishelp_allergens")) || [])
    .map(a => a.toLowerCase());

  const available = DB.recipes.filter(recipe => {
    const hasIngredients = recipe.ingredients.every(ing =>
      pantry.some(p => p.name.toLowerCase() === ing.toLowerCase())
    );

    const safe = !recipe.ingredients.some(ing =>
      allergens.includes(ing.toLowerCase())
    );

    return hasIngredients && safe;
  });

  if (!available.length) {
    return { error: "Aucune recette disponible." };
  }

  return available[Math.floor(Math.random() * available.length)];
}

// ================================
//   MENU FILTRES
// ================================
function initFiltersMenu() {
  const btn = document.getElementById("open-filters");
  const menu = document.getElementById("filters-menu");
  const app = document.querySelector(".app");

  if (!btn || !menu || !app) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    app.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-hidden", (!open).toString());
  });
}

// ================================
//   MENUS ACCUEIL
// ================================
function renderHomeMenus() {
  const container = document.getElementById("menus-home");
  if (!container || !window.DB?.menus) return;

  container.innerHTML = DB.menus.slice(0, 3).map(menu => `
    <div class="menu-card">
      <h3>${menu.name}</h3>
      <span>${menu.type} • ${menu.tags.join(", ")}</span>
    </div>
  `).join("");
}

// ================================
//   INIT GLOBAL
// ================================
document.addEventListener("DOMContentLoaded", () => {
  showPage("home");

  buttons.forEach(btn =>
    btn.addEventListener("click", () => showPage(btn.dataset.target))
  );

  initFiltersMenu();
});
