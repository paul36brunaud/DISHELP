// --- Sélecteurs principaux ---
const buttons = document.querySelectorAll(".menu-btn");
const content = document.getElementById("content");
const platDetails = document.getElementById("plat-details");

// --- Données stockées ---
let pantry = JSON.parse(localStorage.getItem("dishelp_pantry")) || [];
let favorites = JSON.parse(localStorage.getItem("dishelp_favorites")) || [];

// --- Pages ---
const pages = {
  home: `
    <h2>🍽️ Bienvenue sur Dishelp</h2>
    <p id="intro-text">Découvrez des recettes adaptées à vos goûts et à votre garde-manger.</p>
    <div id="recipe-list"></div>
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
      <!-- Formulaire profil ici -->
    </div>
  `
};

// --- Plat du jour ---
function renderPlatDuJour() {
  const plat = RECIPES_DB[Math.floor(Math.random() * RECIPES_DB.length)];
  platDetails.innerHTML = `
    <div class="recipe-card">
      <h3>${plat.name}</h3>
      <p>Ingrédients: ${plat.ingredients.join(", ")}</p>
      <p>Temps de cuisson: ${plat.time} min</p>
      <button class="fav-btn">Ajouter aux favoris</button>
    </div>
  `;

  // Gérer le bouton favori
  const favBtn = platDetails.querySelector(".fav-btn");
  favBtn.addEventListener("click", () => {
    if (!favorites.some(f => f.name === plat.name)) {
      favorites.push(plat);
      localStorage.setItem("dishelp_favorites", JSON.stringify(favorites));
    }
  });
}

// --- Navigation ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";

  const activeBtn = document.querySelector(`[data-target="${target}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (target === "home") renderPlatDuJour();
}

document.addEventListener("DOMContentLoaded", () => {
  showPage("home");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.target);
    });
  });
});
