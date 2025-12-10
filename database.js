// ==========================
//  BASE DE DONNÉES ALIMENTS
// ==========================

const INGREDIENTS_DB = [
    // --- Légumes ---
    "Carotte", "Pomme de terre", "Courgette", "Poivron", "Tomate",
    "Oignon", "Ail", "Brocoli", "Chou-fleur", "Épinards",
    "Haricots verts", "Betterave", "Navet", "Patate douce",

    // --- Fruits ---
    "Pomme", "Banane", "Orange", "Fraise", "Citron",
    "Mangue", "Ananas", "Poire", "Raisin", "Kiwi",

    // --- Viandes ---
    "Poulet", "Bœuf", "Porc", "Dinde", "Agneau",

    // --- Poissons / Fruits de mer ---
    "Saumon", "Thon", "Cabillaud", "Crevettes", "Moules",

    // --- Féculents / Céréales ---
    "Riz", "Pâtes", "Couscous", "Quinoa", "Semoule",

    // --- Produits laitiers ---
    "Lait", "Beurre", "Crème fraîche", "Yaourt", "Fromage",

    // --- Épicerie ---
    "Sel", "Poivre", "Huile d'olive", "Farine", "Sucre",
    "Levure", "Bouillon", "Moutarde", "Ketchup", "Vinaigre",

    // --- Légumineuses ---
    "Lentilles", "Pois chiches", "Haricots rouges",

    // --- Autres ---
    "Œufs", "Pain", "Chocolat", "Miel"
];


// ===========================
//  BASE DE DONNÉES RECETTES
// ===========================

const RECIPES_DB = [
    {
        name: "Pâtes carbonara",
        ingredients: ["Pâtes", "Crème fraîche", "Beurre", "Lardons", "Sel", "Poivre"],
        time: 20,
        utensils: ["Casserole", "Poêle"],
        steps: [
            "Cuire les pâtes",
            "Faire revenir les lardons",
            "Mélanger crème + beurre + lardons",
            "Mélanger avec les pâtes et assaisonner"
        ]
    },
    {
        name: "Salade de poulet",
        ingredients: ["Poulet", "Laitue", "Tomate", "Huile d'olive", "Sel", "Poivre"],
        time: 10,
        utensils: ["Poêle", "Bol"],
        steps: [
            "Cuire le poulet",
            "Couper les légumes",
            "Mélanger le tout"
        ]
    },
    {
        name: "Omelette",
        ingredients: ["Œufs", "Sel", "Poivre", "Beurre"],
        time: 5,
        utensils: ["Poêle", "Bol"],
        steps: [
            "Battre les œufs",
            "Verser dans une poêle",
            "Cuire quelques minutes"
        ]
    },
    {
        name: "Riz sauté aux légumes",
        ingredients: ["Riz", "Carotte", "Oignon", "Courgette", "Huile d'olive", "Sel"],
        time: 15,
        utensils: ["Poêle", "Casserole"],
        steps: [
            "Cuire le riz",
            "Faire revenir les légumes",
            "Mélanger avec le riz"
        ]
    }
];


// ==========================
//  BASE DE DONNÉES MENUS
// ==========================

const MENUS_DB = [
    {
        type: "Petit déjeuner",
        meals: ["Omelette", "Yaourt + Fruits", "Tartines au beurre"]
    },
    {
        type: "Déjeuner",
        meals: ["Pâtes carbonara", "Riz sauté aux légumes", "Salade de poulet"]
    },
    {
        type: "Dîner",
        meals: ["Soupe de légumes", "Salade composée", "Poisson grillé"]
    }
];


// =======================================
//  EXPORT GLOBAL POUR L’APPLICATION (app.js)
// =======================================

window.DB = {
    ingredients: INGREDIENTS_DB,
    recipes: RECIPES_DB,
    menus: MENUS_DB
};
