/* ============================
   DATABASE — DISHELP
   Structure centrale de données
   ============================ */

// ---- Aliments bruts ----
const Foods = [
  // Exemple :
  // { id: "food_apple", name: "Pomme", category: "fruit", allergens: [], nutrition: { calories: 52, proteins: 0.3, carbs: 14, fat: 0.2 } }
];


// ---- Ingrédients utilisables ----
const Ingredients = [
  // Exemple :
  // { id: "ing_apple", foodId: "food_apple", name: "Pomme (tranchée)", unit: "g", defaultAmount: 80 }
];


// ---- Recettes complètes ----
const Recipes = [
  // Exemple :
  // {
  //   id: "rec_tarte_pomme",
  //   name: "Tarte aux pommes",
  //   cuisine: "française",
  //   category: "dessert",
  //   time: 50,
  //   difficulty: "moyen",
  //   tags: ["sucré", "four"],
  //   allergens: ["gluten", "lait"],
  //   utensils: ["four", "couteau"],
  //   ingredients: [
  //     { ingredientId: "ing_apple", amount: 300 }
  //   ],
  //   steps: ["Préchauffer le four…", "Étaler la pâte…"]
  // }
];


// ---- Export pour accès global ----
window.DishelpDB = {
  Foods,
  Ingredients,
  Recipes
};
