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
    <p id="intro-text">Découvrez des recettes adaptées à vos goûts et à votre garde-manger.</p>
    <div id="recipe-list">
      <div class="recipe-card" data-recipe="Salade fraîcheur">
        <h3>🥗 Salade fraîcheur</h3>
        <p>Tomates, concombres, feta et huile d'olive.</p>
        <button class="fav-btn">Ajouter aux favoris</button>
      </div>

      <div class="recipe-card" data-recipe="Pâtes à la tomate">
        <h3>🍝 Pâtes à la tomate</h3>
        <p>Pâtes, tomate, basilic et parmesan.</p>
        <button class="fav-btn">Ajouter aux favoris</button>
      </div>

      <div class="recipe-card" data-recipe="Omelette de légumes">
        <h3>🍛 Omelette de légumes</h3>
        <p>Œufs, carottes, courgettes et oignons.</p>
        <button class="fav-btn">Ajouter aux favoris</button>
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
    <p>Configurez ici vos préférences culinaires, allergènes et régimes alimentaires.</p>
  `
};

// --- Navigation ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";
  
  // Réinitialiser le texte descriptif lorsqu'on revient sur la page
  if (target === "home" || target === "pantry" || target === "favorites") {
    const introText = document.getElementById("intro-text");
    if (introText && !introText.classList.contains("interacted")) {
      introText.style.display = "block"; // Affiche le texte si il n'a pas été masqué
    }
  }

  buttons.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-target="${target}"]`).classList.add("active");

  // Charger la page spécifique
  if (target === "pantry") renderPantry();
  if (target === "favorites") renderFavorites();
  if (target === "home") initHome();
}

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
    const introText = document.getElementById("intro-text");
    if (introText) {
      introText.style.display = "none"; // Masque le texte une fois que l'utilisateur interagit
      introText.classList.add("interacted"); // Ajoute un flag pour marquer l'interaction
    }
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

// --- Sauvegarde des favoris ---
function saveFavorites() {
  localStorage.setItem("dishhelp_favorites", JSON.stringify(favorites));
}

// --- Affichage des favoris ---
function renderFavorites() {
  const list = document.getElementById("fav-list");

  if (!favorites || favorites.length === 0) {
    list.innerHTML = "<p>Aucun favori pour le moment.</p>";
    return;
  }

  list.innerHTML = favorites
    .map(
      (f, i) => `
        <li>
          <h3>${f.name}</h3>
          <p>${f.description}</p>
          <button class="fav-toggle" data-index="${i}">❌</button>
        </li>
      `
    )
    .join("");

  list.querySelectorAll(".fav-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      favorites.splice(index, 1);
      saveFavorites();
      renderFavorites();
      updateHeartIcons();
    });
  });
}

// --- Page d’accueil : ajout / retrait des favoris ---
function initHome() {
  const favButtons = document.querySelectorAll(".fav-btn");

  favButtons.forEach((btn) => {
    const recipeCard = btn.closest(".recipe-card");
    const recipeName = recipeCard.dataset.recipe;
    const recipeDescription = recipeCard.querySelector("p").textContent;

    // état initial
    if (favorites.some(fav => fav.name === recipeName)) {
      setToCross(btn);
    } else {
      setToHeart(btn);
    }

    // clic : toggle
    btn.addEventListener("click", () => {
      btn.classList.add("anim-click");

      const recipe = {
        name: recipeName,
        description: recipeDescription
      };

      if (favorites.some(fav => fav.name === recipeName)) {
        favorites = favorites.filter(f => f.name !== recipeName);
        setToHeart(btn);
      } else {
        favorites.push(recipe);
        setToCross(btn);
      }

      saveFavorites();
      updateHeartIcons();

      // retire la classe d'animation après un court délai
      setTimeout(() => btn.classList.remove("anim-click"), 300);
    });
  });
}

// --- Fonctions pour les styles ---
function setToHeart(btn) {
  btn.textContent = "❤️";
  btn.style.color = "#e63946"; // rouge vif
}

function setToCross(btn) {
  btn.textContent = "❌";
  btn.style.color = "#ff6b6b"; // rouge pastel
}

// --- Synchronisation visuelle des icônes de cœur ---
function updateHeartIcons() {
  const favButtons = document.querySelectorAll(".fav-btn");
  favButtons.forEach((btn) => {
    const recipeCard = btn.closest(".recipe-card");
    const recipeName = recipeCard.dataset.recipe;
    if (favorites.some(fav => fav.name === recipeName)) setToCross(btn);
    else setToHeart(btn);
  });
}
