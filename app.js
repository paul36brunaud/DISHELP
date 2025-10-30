// --- Sélecteurs principaux ---
const buttons = document.querySelectorAll('.menu-btn');
const content = document.getElementById('content');

// --- Données stockées ---
let pantry = JSON.parse(localStorage.getItem('dishhelp_pantry')) || [];
let favorites = JSON.parse(localStorage.getItem('dishhelp_favorites')) || [];

// --- Pages de base ---
const pages = {
  home: `
    <h2>🍽️ Bienvenue sur Dishhelp</h2>
    <p>Découvrez des recettes adaptées à vos goûts et à votre garde-manger.</p>

    <div id="recipe-list">
      <div class="recipe-card">
        <h3>🥗 Salade fraîcheur</h3>
        <p>Tomates, concombres, feta et huile d'olive.</p>
        <button class="fav-btn" data-recipe="Salade fraîcheur"> Ajouter aux favoris</button>
      </div>

      <div class="recipe-card">
        <h3>🍝 Pâtes à la tomate</h3>
        <p>Pâtes, crème, champignons et persil.</p>
        <button class="fav-btn" data-recipe="Pâtes à la crème"> Ajouter aux favoris</button>
      </div>

      <div class="recipe-card">
        <h3>🍛 omelette de légumes</h3>
        <p>Carottes, courgettes, pois chiches et lait de coco.</p>
        <button class="fav-btn" data-recipe="Curry de légumes"> Ajouter aux favoris</button>
      </div>
    </div>
  `,

  favorites: `
    <h2> Mes favoris</h2>
    <ul id="fav-list"></ul>
  `,

  pantry: `
    <h2> Mon garde-manger</h2>
    <div class="pantry-input">
      <input id="ing-input" type="text" placeholder="Ajouter un ingrédient...">
      <button id="add-ing">+</button>
    </div>
    <ul id="ing-list"></ul>
  `,

  profile: `
    <h2>👤 Profil</h2>
    <p>Configurez ici vos préférences alimentaires et allergènes.</p>
  `
};

// --- Affiche la page ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";
  buttons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-target="${target}"]`).classList.add('active');

  if (target === "pantry") initPantry();
  if (target === "favorites") renderFavorites();
  if (target === "home") initHome();
}

// --- Menu ---
buttons.forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.target));
});

// --- Garde-manger ---
function renderPantry() {
  content.innerHTML = `
    <h2>Mon garde-manger</h2>
    <div class="pantry-input">
      <input type="text" id="ing-input" placeholder="Ajouter un ingrédient...">
      <button id="add-ing">Ajouter</button>
    </div>
    <ul id="ing-list"></ul>
  `;

  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");

  function renderList() {
    list.innerHTML = "";
    pantry.forEach((i, idx) => {
      const li = document.createElement("li");
      li.textContent = i;

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.classList.add("del-ing");
      delBtn.dataset.idx = idx;

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  addBtn.addEventListener("click", () => {
    const val = input.value.trim();
    if (val) {
      pantry.push(val);
      localStorage.setItem("pantry", JSON.stringify(pantry));
      input.value = "";
      renderList();
    }
  });

  list.addEventListener("click", e => {
    if (e.target.classList.contains("del-ing")) {
      const idx = e.target.dataset.idx;
      pantry.splice(idx, 1);
      localStorage.setItem("pantry", JSON.stringify(pantry));
      renderList();
    }
  });

  renderList();
}


// --- Favoris ---
function renderFavorites() {
  const list = document.getElementById('fav-list');
  if (favorites.length === 0) {
    list.innerHTML = "<p>Aucun favori pour le moment </p>";
    return;
  }

  list.innerHTML = favorites.map((f, i) => `
    <li>
      ${f}
      <button class="del-ing" data-index="${i}">✖</button>
    </li>
  `).join('');

  // suppression d’un favori
  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('del-ing')) {
      const index = e.target.dataset.index;
      favorites.splice(index, 1);
      saveFavorites();
      renderFavorites();
    }
  });
}

// --- Ajouter un favori depuis la page d’accueil ---
function initHome() {
  const favButtons = document.querySelectorAll('.fav-btn');

  favButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const recipe = btn.dataset.recipe;
      if (!favorites.includes(recipe)) {
        favorites.push(recipe);
        saveFavorites();
        btn.textContent = "✅ Ajouté !";
        btn.disabled = true;
      }
    });
  });
}

// --- Sauvegardes locales ---
function saveFavorites() {
  localStorage.setItem('dishhelp_favorites', JSON.stringify(favorites));
}

// --- Démarrage ---
showPage('home');
