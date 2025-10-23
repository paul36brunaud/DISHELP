// --- Données locales ---
const pantry = JSON.parse(localStorage.getItem("pantry")) || [];
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const profile = JSON.parse(localStorage.getItem("profile")) || { diet: "standard", allergies: "" };

// --- Sélection éléments ---
const buttons = document.querySelectorAll('.menu-btn');
const content = document.getElementById('content');
let currentSection = 'home';

// --- Fonctions de rendu ---
function renderHome() {
  const recipes = [
    { id: 1, name: "Pâtes à la tomate 🍝", time: "15 min" },
    { id: 2, name: "Salade de riz 🥗", time: "10 min" },
    { id: 3, name: "Omelette aux légumes 🍳", time: "8 min" }
  ];

  content.innerHTML = `<h2>Plats du jour</h2>
  ${recipes.map(r => `
    <div class="recipe-card">
      <h3>${r.name}</h3>
      <p>${r.time}</p>
      <button data-id="${r.id}" class="fav-btn">❤️</button>
    </div>
  `).join('')}`;

  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const recipe = recipes.find(r => r.id === id);
      if (!favorites.some(f => f.id === id)) {
        favorites.push(recipe);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Ajouté aux favoris ❤️");
      }
    });
  });
}

function renderFavorites() {
  content.innerHTML = `<h2>Mes favoris ❤️</h2>`;
  if (favorites.length === 0) {
    content.innerHTML += `<p>Aucun favori pour l'instant.</p>`;
    return;
  }

  favorites.forEach(f => {
    const div = document.createElement("div");
    div.className = "recipe-card";
    div.innerHTML = `
      <h3>${f.name}</h3>
      <p>${f.time}</p>
      <button data-id="${f.id}" class="remove-fav">❌</button>
    `;
    content.appendChild(div);
  });

  document.querySelectorAll(".remove-fav").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const index = favorites.findIndex(f => f.id === id);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
      }
    });
  });
}

function renderPantry() {
  content.innerHTML = `
    <h2>Mon garde-manger</h2>
    <div>
      <input type="text" id="ing-input" placeholder="Ajouter un ingrédient...">
      <button id="add-ing">Ajouter</button>
    </div>
    <ul id="ing-list"></ul>
  `;

  const list = document.getElementById("ing-list");
  const input = document.getElementById("ing-input");
  const addBtn = document.getElementById("add-ing");

  function renderList() {
    list.innerHTML = pantry.map((i, idx) => `
      <li>${i} <button data-idx="${idx}" class="del-ing">❌</button></li>
    `).join('');
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

function renderProfile() {
  content.innerHTML = `
    <h2>Mon profil :</h2>
    <label>Régime :
      <select id="diet">
        <option value="standard">Standard</option>
        <option value="vegetarien">Végétarien</option>
        <option value="vegan">Végan</option>
      </select>
    </label>
    <label>Allergènes :
      <input type="text" id="allergies" placeholder="Ex: gluten, lactose...">
    </label>
    <button id="save">Sauvegarder</button>
  `;

  document.getElementById("diet").value = profile.diet;
  document.getElementById("allergies").value = profile.allergies;

  document.getElementById("save").addEventListener("click", () => {
    const updated = {
      diet: document.getElementById("diet").value,
      allergies: document.getElementById("allergies").value
    };
    localStorage.setItem("profile", JSON.stringify(updated));
    alert("Profil sauvegardé ✅");
  });
}

// --- Table de routage ---
const pages = {
  home: renderHome,
  favorites: renderFavorites,
  pantry: renderPantry,
  profile: renderProfile
};

// --- Navigation + animations ---
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const nextSection = btn.dataset.target;
    if (nextSection === currentSection) return;

    // Direction du slide
    const direction =
      Array.from(buttons).indexOf(btn) >
      Array.from(buttons).indexOf(document.querySelector('.menu-btn.active'))
        ? 'right'
        : 'left';

    // Animation de sortie
    content.classList.add(`slide-out-${direction}`);

    setTimeout(() => {
      pages[nextSection](); // Charge la nouvelle page
      currentSection = nextSection;

      // Animation d’entrée + rebond
      content.className = 'content slide-in-' + direction;
      setTimeout(() => {
        content.className = 'content rebound';
        setTimeout(() => (content.className = 'content'), 200);
      }, 150);
    }, 150);

    // Met à jour les boutons
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// --- Démarrage ---
renderHome();
