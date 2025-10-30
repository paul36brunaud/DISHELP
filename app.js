// --- Sélecteurs principaux ---
const buttons = document.querySelectorAll(".menu-btn");
const content = document.getElementById("content");

// --- Données stockées ---
let pantry = JSON.parse(localStorage.getItem("dishhelp_pantry")) || [];
let favorites = JSON.parse(localStorage.getItem("dishhelp_favorites")) || [];

// --- Pages ---
const pages = {
  home: `
    <h2>🍽️ Bienvenue sur Dishhelp</h2>
    <p>Découvrez des recettes adaptées à vos goûts et à votre garde-manger.</p>

    <div id="recipe-list">
      <div class="recipe-card">
        <h3>🥗 Salade fraîcheur</h3>
        <p>Tomates, concombres, feta et huile d'olive.</p>
        <button class="fav-btn" data-recipe="Salade fraîcheur">Ajouter aux favoris</button>
      </div>

      <div class="recipe-card">
        <h3>🍝 Pâtes à la tomate</h3>
        <p>Pâtes, tomate, basilic et parmesan.</p>
        <button class="fav-btn" data-recipe="Pâtes à la tomate">Ajouter aux favoris</button>
      </div>

      <div class="recipe-card">
        <h3>🍛 Omelette de légumes</h3>
        <p>Œufs, carottes, courgettes et oignons.</p>
        <button class="fav-btn" data-recipe="Omelette de légumes">Ajouter aux favoris</button>
      </div>
    </div>
  `,

  favorites: `
    <h2>❤️ Mes favoris</h2>
    <ul id="fav-list"></ul>
  `,

  pantry: `
    <h2>🧺 Mon garde-manger</h2>
    <div class="pantry-input">
      <input id="ing-input" type="text" placeholder="Ajouter un ingrédient..." />
      <button id="add-ing">+</button>
    </div>
    <ul id="ing-list"></ul>
  `,

  profile: `
    <h2>👤 Profil</h2>
    <p>Configurez ici vos préférences alimentaires et allergènes.</p>
  `
};

// --- Navigation ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";
  buttons.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-target="${target}"]`).classList.add("active");

  if (target === "pantry") renderPantry();
  if (target === "favorites") renderFavorites();
  if (target === "home") initHome();
}

buttons.forEach(btn =>
  btn.addEventListener("click", () => showPage(btn.dataset.target))
);

// --- Garde-manger ---
function renderPantry() {
  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");

  function renderList() {
    list.innerHTML = "";
    pantry.forEach((item, idx) => {
      const li = document.createElement("li");
      li.textContent = item;

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.classList.add("del-ing");
      delBtn.dataset.idx = idx;

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  const addIngredient = () => {
    const val = input.value.trim();
    if (!val) return;
    pantry.push(val);
    localStorage.setItem("dishhelp_pantry", JSON.stringify(pantry));
    input.value = "";
    renderList();
  };

  addBtn.addEventListener("click", addIngredient);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  });

  list.addEventListener("click", e => {
    if (e.target.classList.contains("del-ing")) {
      pantry.splice(e.target.dataset.idx, 1);
      localStorage.setItem("dishhelp_pantry", JSON.stringify(pantry));
      renderList();
    }
  });

  renderList();
}

// --- Gestion des Favoris ---

// Affiche la page des favoris
function renderFavorites() {
  const list = document.getElementById("fav-list");
  if (favorites.length === 0) {
    list.innerHTML = "<p>Aucun favori pour le moment.</p>";
    return;
  }

  list.innerHTML = favorites
    .map(
      (f, i) => `
        <li>
          ${f}
          <button class="del-ing" data-index="${i}">✖</button>
        </li>
      `
    )
    .join("");

  // Supprimer un favori avec le bouton ✖
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("del-ing")) {
      const index = e.target.dataset.index;
      favorites.splice(index, 1);
      saveFavorites();
      renderFavorites();
    }
  });
}

// --- Ajouter ou retirer un favori depuis la page d'accueil ---
function initHome() {
  const favButtons = document.querySelectorAll(".fav-btn");

  favButtons.forEach((btn) => {
    const recipe = btn.dataset.recipe;

    // Si la recette est déjà en favoris
    if (favorites.includes(recipe)) {
      btn.classList.add("added");
      btn.textContent = "✖"; // croix rouge pastel
    } else {
      btn.textContent = "♡"; // cœur rouge pastel
    }

    // Gestion du clic sur le cœur / croix
    btn.addEventListener("click", () => {
      if (favorites.includes(recipe)) {
        // Supprimer des favoris
        favorites = favorites.filter((r) => r !== recipe);
        btn.classList.remove("added");
        btn.textContent = "♡"; // revient au cœur rouge pastel
      } else {
        // Ajouter aux favoris
        favorites.push(recipe);
        btn.classList.add("added");
        btn.textContent = "✖"; // croix rouge pastel
      }
      saveFavorites();
    });
  });
}

// --- Sauvegarde locale ---
function saveFavorites() {
  localStorage.setItem("dishhelp_favorites", JSON.stringify(favorites));
}
