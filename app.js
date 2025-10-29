const content = document.getElementById("content");
const buttons = document.querySelectorAll(".menu-btn");
let pantry = JSON.parse(localStorage.getItem("pantry")) || [];

// --- Gestion des onglets ---
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.target;
    if (target === "home") renderHome();
    else if (target === "favorites") renderFavorites();
    else if (target === "pantry") renderPantry();
    else if (target === "profile") renderProfile();
  });
});

// --- Écran d'accueil ---
function renderHome() {
  content.innerHTML = `
    <h2>Bienvenue sur Dishhelp 🍽️</h2>
    <p>Découvrez des plats adaptés à vos goûts et votre garde-manger.</p>
  `;
}

// --- Favoris ---
function renderFavorites() {
  content.innerHTML = `
    <h2>Mes favoris ❤️</h2>
    <p>Vos recettes enregistrées apparaîtront ici.</p>
  `;
}

// --- Garde-manger ---
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
    list.innerHTML = "";
    pantry.forEach((i, idx) => {
      const li = document.createElement("li");
      li.textContent = i;

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.classList.add("del-ing");
      delBtn.dataset.idx = idx;

      li.appendChild(delBtn);
      li.style.animation = "fadeInUp 0.3s ease";
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
      const li = e.target.parentElement;
      li.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => {
        const idx = e.target.dataset.idx;
        pantry.splice(idx, 1);
        localStorage.setItem("pantry", JSON.stringify(pantry));
        renderList();
      }, 300);
    }
  });

  renderList();
}

// --- Profil ---
function renderProfile() {
  content.innerHTML = `
    <h2>Mon profil 👤</h2>
    <p>Paramètres et préférences utilisateur à venir.</p>
  `;
}

// Charger l'accueil au démarrage
renderHome();
