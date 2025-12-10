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
    <div id="filters" class="filters">
      <h3>Filtres disponibles</h3>
      <label for="ingredient-filter">Ingrédient :</label>
      <input type="text" id="ingredient-filter" placeholder="Rechercher un ingrédient" />

      <label for="category-filter">Catégorie :</label>
      <select id="category-filter">
        <option value="">Choisir une catégorie</option>
        <option value="Entrée">Entrée</option>
        <option value="Plat principal">Plat principal</option>
        <option value="Dessert">Dessert</option>
      </select>

      <label for="time-filter">Temps de préparation :</label>
      <input type="number" id="time-filter" placeholder="Temps en minutes" />

      <button id="apply-filters">Appliquer les filtres</button>
    </div>
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

// --- Navigation ---
function showPage(target) {
  content.innerHTML = pages[target] || "<p>Page introuvable.</p>";

  const introText = document.getElementById("intro-text");
  if (introText && (target === "home" || target === "pantry" || target === "favorites")) {
    if (!introText.classList.contains("interacted")) {
      introText.style.display = "block";
    }
  }

  buttons.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-target="${target}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (target === "pantry") renderPantry();
  if (target === "favorites") renderFavorites();
  if (target === "home") initHome();
  if (target === "profile") initProfile();
}

function renderPantry() {
  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");

  pantry = pantry.map(item => typeof item === "string" ? { name: item, qty: 1 } : item);

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
      qtyInput.max = 100;
      qtyInput.value = item.qty;
      qtyInput.classList.add("qty-input");

      qtyInput.addEventListener("change", () => {
        item.qty = parseInt(qtyInput.value) || 1;
        localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
      });

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.textContent = "❌";
      delBtn.classList.add("del-ing");

      delBtn.addEventListener("click", () => {
        pantry.splice(idx, 1);
        localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
        renderList();
      });

      li.appendChild(nameSpan);
      li.appendChild(qtyInput);
      li.appendChild(delBtn);

      list.appendChild(li);
    });
  }

  const addIngredient = () => {
    const val = input.value.trim();
    if (!val) return;

    pantry.push({ name: val, qty: 1 });
    localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));

    input.value = "";
    renderList();

    const introText = document.getElementById("intro-text");
    if (introText) {
      introText.style.display = "none";
      introText.classList.add("interacted");
    }
  };

  addBtn.addEventListener("click", addIngredient);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  });

  renderList();
}

function saveFavorites() {
  localStorage.setItem("dishelp_favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const list = document.getElementById("fav-list");

  if (!favorites || favorites.length === 0) {
    list.innerHTML = "<p>Aucun favori pour le moment.</p>";
    return;
  }

  list.innerHTML = favorites
    .map((f, i) => `
      <div class="recipe-card" data-recipe="${f.name}">
        ${f.full}
        <button class="fav-toggle" data-index="${i}" style="margin-top:10px;">❌</button>
      </div>
    `)
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

function initHome() {
  const filtersBtn = document.getElementById("apply-filters");

  filtersBtn.addEventListener("click", () => {
    const ingredientFilter = document.getElementById("ingredient-filter").value.toLowerCase();
    const categoryFilter = document.getElementById("category-filter").value;
    const timeFilter = document.getElementById("time-filter").value;

    // Appliquer les filtres
    applyFilters(ingredientFilter, categoryFilter, timeFilter);
  });
}

function applyFilters(ingredientFilter, categoryFilter, timeFilter) {
  const recipeListContainer = document.getElementById("recipe-list");
  
  const filteredRecipes = DB.recipes.filter((recipe) => {
    const matchIngredient = ingredientFilter ? recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(ingredientFilter)) : true;
    const matchCategory = categoryFilter ? recipe.category === categoryFilter : true;
    const matchTime = timeFilter ? recipe.time <= timeFilter : true;

    return matchIngredient && matchCategory && matchTime;
  });

  recipeListContainer.innerHTML = filteredRecipes.length > 0 ? filteredRecipes.map(recipe => `
    <div class="recipe-card">
      <h3>${recipe.name}</h3>
      <p>${recipe.description}</p>
      <button class="fav-btn">Ajouter aux favoris</button>
    </div>
  `).join("") : "<p>Aucune recette trouvée pour les critères sélectionnés.</p>";
}

// --- PROFIL ---
function initProfile() {
  const fruitInput = document.getElementById("fruits");
  const vegInput = document.getElementById("vegetables");

  const fruitListBox = document.getElementById("fruit-list");
  const vegListBox = document.getElementById("veg-list");

  const addFruitBtn = document.getElementById("add-fruit");
  const addVegBtn = document.getElementById("add-veg");

  function renderFruitList() {
    fruitListBox.innerHTML = fruitList
      .map((f, i) => `<li>${f}<button data-i="${i}" class="list-del" type="button">❌</button></li>`)
      .join("");
  }

  function renderVegList() {
    vegListBox.innerHTML = vegList
      .map((v, i) => `<li>${v}<button data-i="${i}" class="list-del" type="button">❌</button></li>`)
      .join("");
  }

  addFruitBtn.addEventListener("click", () => {
    const val = fruitInput.value.trim();
    if (!val) return;
    fruitList.push(val);
    fruitInput.value = "";
    localStorage.setItem("dishelp_fruitList", JSON.stringify(fruitList));
    renderFruitList();
  });

  addVegBtn.addEventListener("click", () => {
    const val = vegInput.value.trim();
    if (!val) return;
    vegList.push(val);
    vegInput.value = "";
    localStorage.setItem("dishelp_vegList", JSON.stringify(vegList));
    renderVegList();
  });

  fruitListBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("list-del")) {
      const i = parseInt(e.target.dataset.i, 10);
      fruitList.splice(i, 1);
      localStorage.setItem("dishelp_fruitList", JSON.stringify(fruitList));
      renderFruitList();
    }
  });

  vegListBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("list-del")) {
      const i = parseInt(e.target.dataset.i, 10);
      vegList.splice(i, 1);
      localStorage.setItem("dishelp_vegList", JSON.stringify(vegList));
      renderVegList();
    }
  });

  fruitInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFruitBtn.click();
    }
  });

  vegInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addVegBtn.click();
    }
  });

  renderFruitList();
  renderVegList();
  
  // --- Allergènes ---
  const savedAllergens = JSON.parse(localStorage.getItem("dishelp_allergens")) || [];
  const allergensSelect = document.getElementById("allergens");

  allergensSelect.setAttribute("multiple", "multiple");

  Array.from(allergensSelect.options).forEach(option => {
    option.addEventListener("mousedown", e => {
      e.preventDefault();
      option.selected = !option.selected;
    });

    if (savedAllergens.includes(option.value)) {
      option.selected = true;
    }
  });

  const form = document.getElementById("profile-form");
  if (form) {
    form.removeEventListener && form.removeEventListener("submit", saveProfile);
    form.addEventListener("submit", saveProfile);
  }
}

// --- Enregistrement du profil ---
function saveProfile(event) {
  event.preventDefault();

  const allergensSelect = document.getElementById("allergens");
  const selectedAllergens = Array.from(allergensSelect.selectedOptions).map(option => option.value);

  localStorage.setItem("dishelp_allergens", JSON.stringify(selectedAllergens));

  const message = document.createElement("div");
  message.classList.add("save-confirm");
  message.textContent = "✔ Profil enregistré avec succès !";

  document.body.appendChild(message);

  setTimeout(() => {
    message.classList.add("hide");
    setTimeout(() => message.remove(), 300);
  }, 1800);
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
