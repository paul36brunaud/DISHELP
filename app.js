// --- Sélecteurs principaux ---
const buttons = document.querySelectorAll(".menu-btn");
const content = document.getElementById("content");

// --- Données stockées ---
function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

let pantry = safeParse("dishelp_pantry");
let favorites = safeParse("dishelp_favorites");
let fruitList = safeParse("dishelp_fruitList");
let vegList = safeParse("dishelp_vegList");
let currentRecipeFilter = null;

// --- Pages ---
const pages = {
home: `
  <h2 class="home-title">🍽️ Bienvenue sur Dishelp</h2>
  <p id="intro-text" class="home-subtitle">
    Découvrez des recettes adaptées à vos goûts et à votre garde-manger.
  </p>

  <div id="home-daily-menu"></div>

  <div class="home-menus">
    <div class="home-card" data-action="adapted-recipes">
      <span class="home-icon">🧺</span>
      <h3>Recettes adaptées</h3>
      <p>Voir plus de recettes en fonction de ton garde-manger</p>
    </div>

    <div class="home-card" data-action="recettes">
      <span class="home-icon">📖</span>
      <h3>Recettes</h3>
      <p>Toutes les idées disponibles</p>
    </div>
  </div>
`,


  favorites: `
    <h2>❤️ Mes favoris</h2>
    <div id="fav-list"></div>
  `,

  recipes: `
    <h2>📚 Recettes</h2>
    <div id="recipe-list" class="home-menus"></div>
  `,

  pantry: `
    <h2>🧺 Mon garde-manger</h2>
    <div class="pantry-input">
      <input id="ing-input" type="text" placeholder="Ajouter un ingrédient..." />
      <button id="add-ing" type="button"></button>
      <button id="clear-pantry" class="clear-btn">VIDER</button>
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
            <button type="button" id="add-fruit" class="add-small"></button>
          </div>
          <ul id="fruit-list" class="list-box"></ul>
        </div>

        <div class="profile-section">
          <label class="section-label">🥕 Légumes :</label>
          <div class="small-input-row">
            <input type="text" id="vegetables" placeholder="Ajouter un légume" class="profile-input" />
            <button type="button" id="add-veg" class="add-small"></button>
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
function showPage(target, filter = null) {
  if (target !== "recipes") {
    currentRecipeFilter = null;
  } else {
    currentRecipeFilter = filter;
  }

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
  if (target === "profile") initProfile();
  if (target === "recipes") renderRecipes(currentRecipeFilter);
  if (target === "home") renderHomeDailyMenu();

  const toggleBtn = document.getElementById("toggleBtn");

  function renderHomeDailyMenu() {
    const container = document.getElementById("home-daily-menu");
    if (!container) return;

    const menu = generateDailyMenu();
    const warningHtml = menu.warning ? `<p class="warning-text">${menu.warning}</p>` : "";

    if (menu.error) {
      container.innerHTML = `
        <div class="home-daily-card">
          <div class="home-daily-card-top">
            <span class="home-daily-badge">Recette du jour</span>
          </div>
          <p class="warning-text">${menu.error}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="home-daily-card">
        <div class="home-daily-card-top">
          <span class="home-daily-badge">Recette du jour</span>
          <span class="home-daily-time">⏱ ${menu.recipe.time} min</span>
          <span class="home-daily-servings">Pour ${getBurgerSettings().people} personnes</span>
        </div>
        ${warningHtml}
        <h3>${menu.recipe.name}</h3>
        <p class="home-daily-ingredients">${menu.recipe.ingredients.join(", ")}</p>
        <div class="home-daily-actions">
          <button type="button" class="home-daily-view">Voir la recette du jour</button>
        </div>
      </div>
    `;

    const button = container.querySelector(".home-daily-view");
    if (button) {
      button.addEventListener("click", () => {
        renderRecipeModal(menu.recipe);
      });
    }
  }
  const sideMenu = document.getElementById("menu");

  if (toggleBtn && sideMenu) {

    // ✅ Toujours visible
    toggleBtn.style.display = "flex";

    // ✅ Fermer le menu quand on change de page
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggleBtn.textContent = "☰";

    // ✅ Spécifique accueil seulement
    if (target === "home") {
      initHome();
      initHomeMenus();
    }

    // ✅ Toujours actif
    renderBurgerMenu();
  }
}

function renderRecipeModal(recipe) {
  if (!recipe) return;
  closeRecipeModal();

  const initialPeople = getBurgerSettings().people || 2;
  const scaledIngredients = scaleIngredients(recipe.ingredients, initialPeople);

  const modal = document.createElement("div");
  modal.id = "recipe-modal";
  modal.dataset.recipe = recipe.name;
  modal.className = "recipe-modal";
  modal.innerHTML = `
    <div class="recipe-modal-backdrop"></div>
    <div class="recipe-modal-panel" role="dialog" aria-modal="true" aria-label="Détails de la recette">
      <div class="recipe-modal-header">
        <div>
          <span class="recipe-detail-pill">Recette</span>
          <h3>${recipe.name}</h3>
        </div>
        <button type="button" class="recipe-modal-close" aria-label="Fermer la recette">✕</button>
      </div>
      <div class="recipe-detail-meta">
        <span>⏱ ${recipe.time} min</span>
        <span>${formatDifficulty(recipe)}</span>
        <span id="modalPeopleMeta">Pour ${initialPeople} personnes</span>
      </div>
      <div class="recipe-servings-control">
        <label for="modalPeopleRange">Nombre de personnes</label>
        <div class="recipe-servings-input">
          <input id="modalPeopleRange" type="range" min="1" max="10" value="${initialPeople}">
          <span id="modalPeopleValue">${initialPeople}</span>
        </div>
      </div>
      <div class="recipe-tags">${(recipe.tags || []).map(tag => `<span class="recipe-tag">${tag}</span>`).join("")}</div>
      <div class="recipe-section">
        <h4>Ingrédients</h4>
        <ul class="recipe-ingredients-list">
          ${scaledIngredients.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="recipe-section">
        <h4>Ustensiles</h4>
        <p>${recipe.utensils.join(", ")}</p>
      </div>
      <div class="recipe-section">
        <h4>Préparation</h4>
        <ol>${recipe.steps.map(step => `<li>${step}</li>`).join("")}</ol>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(".recipe-modal-close");
  const backdrop = modal.querySelector(".recipe-modal-backdrop");
  const peopleRange = modal.querySelector("#modalPeopleRange");
  const peopleValue = modal.querySelector("#modalPeopleValue");
  const peopleMeta = modal.querySelector("#modalPeopleMeta");
  const ingredientsList = modal.querySelector(".recipe-ingredients-list");

  const refreshIngredients = (people) => {
    const list = scaleIngredients(recipe.ingredients, people);
    if (ingredientsList) {
      ingredientsList.innerHTML = list.map(item => `<li>${item}</li>`).join("");
    }
    if (peopleMeta) {
      peopleMeta.textContent = `Pour ${people} personnes`;
    }
  };

  if (peopleRange) {
    peopleRange.addEventListener("input", (e) => {
      const people = +e.target.value;
      if (peopleValue) peopleValue.textContent = people;
      refreshIngredients(people);
    });
  }

  if (closeButton) closeButton.addEventListener("click", closeRecipeModal);
  if (backdrop) backdrop.addEventListener("click", closeRecipeModal);
}

function closeRecipeModal() {
  const modal = document.getElementById("recipe-modal");
  if (!modal) return;
  modal.remove();
  document.body.classList.remove("modal-open");
}

function scaleIngredients(ingredients, people) {
  if (people <= 1) return ingredients;
  const ratio = people / 2;
  return ingredients.map(ingredient => scaleIngredientText(ingredient, ratio));
}

function scaleIngredientText(text, ratio) {
  const trimmed = text.trim();
  const numericMatch = trimmed.match(/^([0-9]+(?:[.,][0-9]+)?)(\s*)(.*)$/);
  if (numericMatch) {
    const quantity = parseFloat(numericMatch[1].replace(",", "."));
    const rest = numericMatch[3];
    const scaled = quantity * ratio;
    const formatted = Number.isInteger(scaled) ? scaled : scaled.toFixed(2).replace(/\.00$/, "").replace(/\.?0+$/, "");
    return `${formatted}${numericMatch[2]}${rest}`;
  }

  const fractionMatch = trimmed.match(/^½(.*)$/);
  if (fractionMatch) {
    const scaled = 0.5 * ratio;
    const formatted = Number.isInteger(scaled) ? scaled : scaled.toFixed(2).replace(/\.00$/, "").replace(/\.?0+$/, "");
    return `${formatted} ${fractionMatch[1].trim()}`;
  }

  return ratio === 1 ? trimmed : `${ratio}× ${trimmed}`;
}

function formatDifficulty(recipe) {
  if (!recipe || typeof recipe.time !== "number") return "Difficulté inconnue";
  if (recipe.time <= 15) return "Facile";
  if (recipe.time <= 30) return "Moyen";
  return "Difficile";
}

function formatRegime(recipe) {
  const regimeTags = ["végétarien", "vegan", "sans gluten", "léger", "salade", "sucré", "poisson", "italienne", "asiatique"];
  const tags = (recipe.tags || []).map(t => t.toLowerCase());
  const found = regimeTags.filter(tag => tags.includes(tag));
  return found.length ? found.join(" · ") : "Tous régimes";
}

function initHomeMenus() {
  document.querySelectorAll(".home-card").forEach(card => {
    if (card.dataset.listenerBound === "true") return;
    card.dataset.listenerBound = "true";

    card.addEventListener("click", () => {
      const action = card.dataset.action;

      if (action === "recettes") showPage("recipes");

      if (action === "adapted-recipes") {
        showPage("recipes", { adapted: true });
      }
    });
  });
}


function renderPantry() {
  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");
  const clearBtn = document.getElementById("clear-pantry");

  // Sécurité si un élément n'existe pas
  if (!list || !input || !addBtn) return;

  // Convertir ancien format string en objet { name, qty }
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

  // 🔥 BOUTON VIDER
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (pantry.length === 0) return;

      const confirmClear = confirm(
        "Voulez-vous vraiment vider le garde-manger ?"
      );
      if (!confirmClear) return;

      pantry = [];
      localStorage.setItem("dishelp_pantry", JSON.stringify(pantry));
      renderList();
    });
  }

  renderList();
}


function saveFavorites() {
  localStorage.setItem("dishelp_favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const list = document.getElementById("fav-list");
  if (!list) return;

  if (!favorites || favorites.length === 0) {
    list.innerHTML = "<p>Aucun favori pour le moment.</p>";
    return;
  }

  list.innerHTML = favorites
    .map((fav, i) => {
      const recipe = (window.DB && window.DB.recipes.find(r => r.name === fav.name)) || null;
      if (!recipe) {
        return `
          <div class="recipe-card" data-recipe="${fav.name}">
            <div class="recipe-summary" role="button" tabindex="0" aria-expanded="false">
              <h3>${fav.name}</h3>
              <p>${fav.description || "Favori"}</p>
              <button class="fav-remove" data-index="${i}" type="button">✕</button>
            </div>
          </div>
        `;
      }

      return `
        <div class="recipe-card" data-recipe="${recipe.name}">
          <div class="recipe-summary" role="button" tabindex="0" aria-expanded="false">
            <h3>${recipe.name}</h3>
            <p>${recipe.tags ? recipe.tags.join(", ") : ""}</p>
            <p><strong>⏱ ${recipe.time} min</strong></p>
            <button class="fav-remove" data-index="${i}" type="button">✕</button>
          </div>
          <div class="recipe-details" hidden>
            <p><strong>Ingrédients :</strong> ${recipe.ingredients.join(", ")}</p>
            <p><strong>Ustensiles :</strong> ${recipe.utensils.join(", ")}</p>
            <ol>${recipe.steps.map(step => `<li>${step}</li>`).join("")}</ol>
          </div>
        </div>
      `;
    })
    .join("");

  initRecipeCards();
  initFavoriteCards();
}

function initFavoriteCards() {
  document.querySelectorAll(".fav-remove").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = parseInt(btn.dataset.index, 10);
      if (Number.isNaN(index)) return;
      favorites.splice(index, 1);
      saveFavorites();
      renderFavorites();
      updateHeartIcons();
    });
  });
}

function getAdaptedRecipes() {
  const pantryRaw = JSON.parse(localStorage.getItem("dishelp_pantry")) || [];
  const allergens = JSON.parse(localStorage.getItem("dishelp_allergens")) || [];
  const normalizedAllergens = allergens.map(a => a.toLowerCase());
  const pantryNormalized = pantryRaw.map(item => typeof item === "string" ? item.toLowerCase() : item.name?.toLowerCase() || "");

  return (window.DB && window.DB.recipes || []).filter(recipe => {
    const hasAllIngredients = recipe.ingredients.every(ing => pantryNormalized.includes(ing.toLowerCase()));
    const safeWithAllergens = !recipe.allergens.some(allergen => normalizedAllergens.includes(allergen.toLowerCase()));
    return hasAllIngredients && safeWithAllergens;
  });
}

function renderRecipes(filter = null) {
  const container = document.getElementById("recipe-list");
  if (!container) return;

  const settings = getBurgerSettings();
  const allRecipes = (window.DB && window.DB.recipes) || [];
  let recipes = allRecipes;
  let header = "📚 Recettes";

  if (filter && filter.adapted) {
    recipes = getAdaptedRecipes();
    header = "📚 Recettes adaptées";
  }

  if (!recipes.length) {
    container.innerHTML = `<h2>${header}</h2><p>Aucune recette adaptée trouvée.</p>`;
    return;
  }

  container.innerHTML = recipes
    .map(recipe => `
      <div class="recipe-card" data-recipe="${recipe.name}">
        <div class="recipe-summary" role="button" tabindex="0" aria-expanded="false">
          <div class="recipe-card-head">
            <div>
              <h3>${recipe.name}</h3>
              <div class="recipe-meta">
                <span>⏱ ${recipe.time} min</span>
                <span>${formatDifficulty(recipe)}</span>
                <span>Pour ${settings.people} pers.</span>
              </div>
              <div class="recipe-tags">${(recipe.tags || []).map(tag => `<span class="recipe-tag">${tag}</span>`).join("")}</div>
            </div>
          </div>
        </div>
        <div class="recipe-card-actions">
          <button class="recipe-open-btn" type="button">Recette</button>
          <button class="fav-btn" type="button" aria-label="Ajouter aux favoris">♥</button>
        </div>
      </div>
    `)
    .join("");

  initRecipeFavorites();
  initRecipeCards();
}

function initRecipeCards() {
  document.querySelectorAll(".recipe-card").forEach((card) => {
    const openBtn = card.querySelector(".recipe-open-btn");
    const recipeName = card.dataset.recipe;
    if (!openBtn || !recipeName) return;

    openBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const recipe = (window.DB && window.DB.recipes.find(r => r.name === recipeName)) || null;
      if (!recipe) return;

      const existingModal = document.getElementById("recipe-modal");
      if (existingModal && existingModal.dataset.recipe === recipeName) {
        closeRecipeModal();
        return;
      }

      renderRecipeModal(recipe);
    });
  });
}

function initRecipeFavorites() {
  document.querySelectorAll(".fav-btn").forEach((btn) => {
    const recipeCard = btn.closest(".recipe-card");
    if (!recipeCard) return;

    const recipeName = recipeCard.dataset.recipe;
    const recipe = (window.DB && window.DB.recipes.find(r => r.name === recipeName)) || null;
    if (!recipe) return;

    if (favorites.some(fav => fav.name === recipeName)) {
      setToCross(btn);
    } else {
      setToHeart(btn);
    }

    btn.addEventListener("click", () => {
      if (favorites.some(fav => fav.name === recipeName)) {
        favorites = favorites.filter(fav => fav.name !== recipeName);
        setToHeart(btn);
      } else {
        favorites.push({
          name: recipe.name,
          description: recipe.tags ? recipe.tags.join(", ") : "",
          full: `<h3>${recipe.name}</h3><p>${recipe.tags ? recipe.tags.join(", ") : ""}</p>`
        });
        setToCross(btn);
      }

      saveFavorites();
      renderFavorites();
      updateHeartIcons();
    });
  });
}

function initHome() {
  const favButtons = document.querySelectorAll(".fav-btn");

  favButtons.forEach((btn) => {
    const recipeCard = btn.closest(".recipe-card");
    const recipeName = recipeCard.dataset.recipe;
    const recipeDescription = recipeCard.querySelector("p").textContent;

    const clone = recipeCard.cloneNode(true);
    const favBtnInClone = clone.querySelector(".fav-btn");
    if (favBtnInClone) favBtnInClone.remove();
    const fullContent = clone.innerHTML;

    if (favorites.some(fav => fav.name === recipeName)) {
      setToCross(btn);
    } else {
      setToHeart(btn);
    }

    btn.addEventListener("click", () => {
      btn.classList.add("anim-click");

      const recipe = {
        name: recipeName,
        description: recipeDescription,
        full: fullContent
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

      setTimeout(() => btn.classList.remove("anim-click"), 300);
    });
  });
}

function setToHeart(btn) {
  btn.textContent = "❤️";
  btn.style.color = "#e63946";
}

function setToCross(btn) {
  btn.textContent = "❌";
  btn.style.color = "#ff6b6b";
}

function updateHeartIcons() {
  const favButtons = document.querySelectorAll(".fav-btn");

  favButtons.forEach((btn) => {
    const recipeCard = btn.closest(".recipe-card");
    const recipeName = recipeCard.dataset.recipe;

    if (favorites.some(fav => fav.name === recipeName)) {
      setToCross(btn);
    } else {
      setToHeart(btn);
    }
  });
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

// ================================
//   MENU DU JOUR INTELLIGENT
// ================================

function generateDailyMenu() {
    const allergens = JSON.parse(localStorage.getItem("dishelp_allergens")) || [];
    const normalizedAllergens = allergens.map(a => a.toLowerCase());
    const allRecipes = (window.DB && window.DB.recipes) || [];

    if (!allRecipes.length) {
      return { error: "Aucune recette disponible dans la base de données." };
    }

    const safeRecipes = allRecipes.filter(recipe => {
      return !recipe.allergens.some(allergen => normalizedAllergens.includes(allergen.toLowerCase()));
    });

    const chosen = safeRecipes.length > 0
      ? safeRecipes[Math.floor(Math.random() * safeRecipes.length)]
      : allRecipes[Math.floor(Math.random() * allRecipes.length)];

    const warning = safeRecipes.length === 0
      ? "Aucune recette sans allergènes trouvée. Voici une suggestion du jour." : "";

    return {
      recipe: chosen,
      warning
    };
}

// ===============================
// MENU HAMBURGER - ACCUEIL
// ===============================
const toggleBtn = document.getElementById("toggleBtn");
const sideMenu = document.getElementById("menu");

if (toggleBtn && sideMenu) {
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = sideMenu.classList.toggle("open");

    // ➜ décalage de toute la page
    document.body.classList.toggle("menu-open", isOpen);

    // ➜ animation icône
    toggleBtn.textContent = isOpen ? "❌" : "☰";

    if (isOpen) {
      renderBurgerMenu();
    }
  });
}

let burgerMenuEventsBound = false;

function getBurgerSettings() {
  const defaults = {
    diet: null,
    preferences: [],
    price: 20,
    time: 30,
    difficulty: 2,
    usePantry: true,
    people: 2
  };
  const saved = JSON.parse(localStorage.getItem("dishelp_settings")) || {};
  return { ...defaults, ...saved };
}

function renderBurgerMenu() {
  const container = document.getElementById("burger-content");
  if (!container) return;

  if (!burgerMenuEventsBound) {
    container.addEventListener("click", e => e.stopPropagation());
    burgerMenuEventsBound = true;
  }

  const settings = getBurgerSettings();

  container.innerHTML = `

    <li class="burger-title title-FILTRES">FILTRES</li>

    <!-- RÉGIME -->
    <li class="burger-section">
      <strong>Régime</strong>
      ${["Classique", "Végétarien", "Vegan"].map(r => `
        <button class="burger-btn diet-btn ${settings.diet === r ? "active" : ""}"
                data-diet="${r}">
          ${r}
        </button>
      `).join("")}
    </li>

    <!-- PRÉFÉRENCES -->
    <li class="burger-section">
      <strong>Préférences rapides</strong>
      ${["Rapide", "Healthy", "Gourmand", "Économique"].map(p => `
        <button class="burger-btn pref-btn ${settings.preferences.includes(p) ? "active" : ""}"
                data-pref="${p}">
          ${p}
        </button>
      `).join("")}
    </li>

    <!-- TEMPS -->
    <li class="burger-section">
      <strong>Temps ( <span class="time-value">${settings.time}</span> min )</strong>
      <input type="range" min="5" max="120" step="5"
             value="${settings.time}" id="timeRange">
    </li>

    <!-- PRIX -->
    <li class="burger-section">
      <strong>Coût ( <span class="price-value">${settings.price}</span> € )</strong>
      <input type="range" min="5" max="100" step="5"
             value="${settings.price}" id="priceRange">
    </li>

    <!-- DIFFICULTÉ -->
    <li class="burger-section">
      <strong>Difficulté</strong>
      <div class="stars">
        ${[1,2,3,4,5].map(i => `
          <span class="star ${i <= settings.difficulty ? "active" : ""}"
                data-star="${i}">★</span>
        `).join("")}
      </div>
    </li>

    <!-- NOMBRE DE PERSONNES -->
    <li class="burger-section">
      <strong>Nombre de personnes ( <span class="people-value">${settings.people}</span> )</strong>
      <input type="range" min="1" max="10" step="1"
             value="${settings.people}" id="peopleRange">
    </li>

    <!-- GARDE-MANGER -->
    <li class="burger-section pantry-switch">
  <label class="pantry-label">
    <input type="checkbox" id="usePantry" ${settings.usePantry ? "checked" : ""}>
    <span class="pantry-slider"></span>
    <span class="pantry-text">Garde-manger</span>
  </label>
</li>

    <!-- RESET -->
    <li class="burger-section">
      <button id="resetPreferences" class="reset-btn">
        RÉINITIALISER
      </button>
    </li>
  `;

  /* ===== EVENTS ===== */

  // régime
  container.querySelectorAll(".diet-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      settings.diet = btn.dataset.diet;
      saveBurgerSettings(settings);
      renderBurgerMenu();
    });
  });

  // préférences
  container.querySelectorAll(".pref-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const v = btn.dataset.pref;
      settings.preferences.includes(v)
        ? settings.preferences = settings.preferences.filter(x => x !== v)
        : settings.preferences.push(v);

      saveBurgerSettings(settings);
      btn.classList.toggle("active");
    });
  });

  // slider temps (FLUIDE)
  const timeRange = container.querySelector("#timeRange");
  const timeValue = container.querySelector(".time-value");

  timeRange.addEventListener("input", e => {
    e.stopPropagation();
    settings.time = +e.target.value;
    timeValue.textContent = settings.time;
    saveBurgerSettings(settings);
  });

  // slider prix (FLUIDE)
  const priceRange = container.querySelector("#priceRange");
  const priceValue = container.querySelector(".price-value");

  priceRange.addEventListener("input", e => {
    e.stopPropagation();
    settings.price = +e.target.value;
    priceValue.textContent = settings.price;
    saveBurgerSettings(settings);
  });

  const peopleRange = container.querySelector("#peopleRange");
  const peopleValue = container.querySelector(".people-value");
  if (peopleRange) {
    peopleRange.addEventListener("input", e => {
      e.stopPropagation();
      settings.people = +e.target.value;
      peopleValue.textContent = settings.people;
      saveBurgerSettings(settings);
    });
  }

  container.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", e => {
      e.stopPropagation();

      const value = +star.dataset.star;

      if (settings.difficulty === value) {
        // 🔒 minimum 1 étoile
        settings.difficulty = Math.max(1, value - 1);
      } else {
        settings.difficulty = value;
      }

      saveBurgerSettings(settings);
      renderBurgerMenu();
    });
  });


  // garde-manger
  container.querySelector("#usePantry").addEventListener("change", e => {
    e.stopPropagation();
    settings.usePantry = e.target.checked;
    saveBurgerSettings(settings);
  });

  // reset
  container.querySelector("#resetPreferences").addEventListener("click", e => {
    e.stopPropagation();
    localStorage.removeItem("dishelp_settings");
    renderBurgerMenu();
  });
}


// sauvegarde
function saveBurgerSettings(settings) {
  localStorage.setItem("dishelp_settings", JSON.stringify(settings));
}


// ===============================
// FERMETURE MENU AU CLIC EXTERIEUR
// ===============================
document.addEventListener("click", (e) => {
  if (!sideMenu || !toggleBtn) return;
  if (!sideMenu.classList.contains("open")) return;

  if (!sideMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggleBtn.textContent = "☰";
  }
});

// ===============================
// SWIPE POUR FERMER LE MENU
// ===============================
let touchStartX = 0;
let touchEndX = 0;

sideMenu.addEventListener("touchstart", (e) => {
  if (!sideMenu.classList.contains("open")) return;
  touchStartX = e.touches[0].clientX;
});

sideMenu.addEventListener("touchmove", (e) => {
  if (!sideMenu.classList.contains("open")) return;
  touchEndX = e.touches[0].clientX;
});

sideMenu.addEventListener("touchend", () => {
  if (!sideMenu.classList.contains("open")) return;

  const swipeDistance = touchEndX - touchStartX;

  // swipe gauche suffisamment large
  if (swipeDistance < -60) {
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggleBtn.textContent = "☰";
  }
});