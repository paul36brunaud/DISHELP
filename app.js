// --- Sélecteurs principaux ---
const buttons = document.querySelectorAll(".menu-btn");
const content = document.getElementById("content");
const filtersContainer = document.getElementById("filters-container");

// --- Données stockées ---
let pantry = JSON.parse(localStorage.getItem("dishelp_pantry")) || [];
let favorites = JSON.parse(localStorage.getItem("dishelp_favorites")) || [];
let fruitList = JSON.parse(localStorage.getItem("dishelp_fruitList")) || [];
let vegList = JSON.parse(localStorage.getItem("dishelp_vegList")) || [];

const DB = { // Simulation de la base de données
    recipes: [
        {
            name: "Salade fraîcheur",
            ingredients: ["Tomates", "Concombres", "Feta", "Huile d'olive"],
            type: "Entrée",
            time: 10,
            description: "Tomates, concombres, feta et huile d'olive.",
        },
        {
            name: "Pâtes à la tomate",
            ingredients: ["Pâtes", "Tomates", "Basilic", "Parmesan"],
            type: "Plat principal",
            time: 25,
            description: "Pâtes, tomate, basilic et parmesan.",
        },
        {
            name: "Omelette de légumes",
            ingredients: ["Œufs", "Carottes", "Courgettes", "Oignons"],
            type: "Plat principal",
            time: 15,
            description: "Œufs, carottes, courgettes et oignons.",
        },
        // Ajoute d'autres recettes ici
    ]
};

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
    <h2>Mon Profil</h2>
    <!-- Formulaire de profil ici -->
  `
};

// --- Navigation ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";

  buttons.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-target="${target}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (target === "home") initHome();
  if (target === "favorites") renderFavorites();
  if (target === "pantry") renderPantry();
  if (target === "profile") initProfile();
}

function renderFavorites() {
  const list = document.getElementById("fav-list");
  list.innerHTML = favorites.length ? 
    favorites.map(f => `<div class="recipe-card"><h3>${f.name}</h3><p>${f.description}</p></div>`).join('') : 
    "<p>Aucun favori pour le moment.</p>";
}

// --- Affichage des recettes à l'accueil ---
function initHome() {
  const recipeList = document.getElementById("recipe-list");
  
  const recipes = DB.recipes;
  renderRecipes(recipes);

  // Fonction pour afficher les recettes
  function renderRecipes(recipes) {
    recipeList.innerHTML = recipes.map(recipe => `
      <div class="recipe-card">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <button class="fav-btn">Ajouter aux favoris</button>
      </div>
    `).join("");
    
    // Gérer l'ajout aux favoris
    const favButtons = document.querySelectorAll(".fav-btn");
    favButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const recipe = recipes[index];
        favorites.push(recipe);
        localStorage.setItem("dishelp_favorites", JSON.stringify(favorites));
        renderFavorites();
      });
    });
  }

  // Générer les filtres
  generateFilters();
}

// --- Génération dynamique des filtres ---
function generateFilters() {
  const types = [...new Set(DB.recipes.map(recipe => recipe.type))];
  const ingredients = [...new Set(DB.recipes.flatMap(recipe => recipe.ingredients))];
  
  const filterTypeHTML = types.map(type => `
    <label>
      <input type="checkbox" class="filter-type" value="${type}"> ${type}
    </label>
  `).join(" ");

  const filterIngredientHTML = ingredients.map(ingredient => `
    <label>
      <input type="checkbox" class="filter-ingredient" value="${ingredient}"> ${ingredient}
    </label>
  `).join(" ");

  filtersContainer.innerHTML = `
    <h3>Filtres</h3>
    <div class="filter-section">
      <h4>Type de plat</h4>
      ${filterTypeHTML}
    </div>
    <div class="filter-section">
      <h4>Ingrédients</h4>
      ${filterIngredientHTML}
    </div>
  `;

  addFilterListeners();
}

// --- Ajouter les listeners de filtres ---
function addFilterListeners() {
  const typeFilters = document.querySelectorAll(".filter-type");
  const ingredientFilters = document.querySelectorAll(".filter-ingredient");

  const recipeList = document.getElementById("recipe-list");

  typeFilters.forEach(filter => {
    filter.addEventListener("change", applyFilters);
  });
  ingredientFilters.forEach(filter => {
    filter.addEventListener("change", applyFilters);
  });

  function applyFilters() {
    const selectedTypes = Array.from(typeFilters)
      .filter(filter => filter.checked)
      .map(filter => filter.value);

    const selectedIngredients = Array.from(ingredientFilters)
      .filter(filter => filter.checked)
      .map(filter => filter.value);

    const filteredRecipes = DB.recipes.filter(recipe => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(recipe.type);
      const ingredientsMatch = selectedIngredients.length === 0 || recipe.ingredients.some(ingredient => selectedIngredients.includes(ingredient));
      return typeMatch && ingredientsMatch;
    });

    renderRecipes(filteredRecipes);
  }
}

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", () => {
  showPage("home");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.target);
    });
  });
});

// --- Sélecteurs pour le menu latéral ---
const hamburgerBtn = document.querySelector('.hamburger-btn');
const filtersContainer = document.querySelector('.filters-container');
const content = document.querySelector('.content');

// Fonction pour ouvrir/fermer le menu latéral
hamburgerBtn.addEventListener('click', () => {
  filtersContainer.classList.toggle('open'); // Ajoute/retire la classe 'open'
  hamburgerBtn.classList.toggle('active'); // Ajoute/retire la classe 'active'

  // Ajuste la marge du contenu principal pour faire de la place au menu
  content.classList.toggle('shifted'); // Ajoute/retire la classe 'shifted' au contenu
});
