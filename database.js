// ==========================
//  INGREDIENTS (partie 1/5)
// ==========================
const INGREDIENTS_DB = [
  // Légumes (exemples courants + variétés)
  "Carotte","Pomme de terre","Courgette","Poivron rouge","Poivron vert","Tomate","Tomate cerise",
  "Oignon jaune","Oignon rouge","Échalote","Ail","Brocoli","Chou-fleur","Épinards","Roquette",
  "Laitue","Batavia","Frisée","Endive","Fenouil","Céleri","Céleri-rave","Navet","Betterave",
  "Patate douce","Aubergine","Champignon de Paris","Champignons shiitake","Asperge","Maïs",
  "Haricots verts","Petits pois","Pois mange-tout","Courge","Potimarron","Kale","Chou frisé",

  // Fruits
  "Pomme","Poire","Banane","Orange","Mandarine","Clémentine","Pamplemousse","Citron","Citron vert",
  "Fraise","Framboise","Myrtille","Mûre","Raisin","Kiwi","Ananas","Mangue","Papaye","Abricot",
  "Pêche","Nectarine","Prune","Melon","Pastèque","Avocat","Tomatillo",

  // Viandes & volailles
  "Poulet","Filet de poulet","Cuisses de poulet","Dinde","Canard","Porc","Filet de porc","Bœuf",
  "Bœuf haché","Steak","Agneau","Veau","Charcuterie","Jambon","Bacon","Lardons",

  // Poissons & fruits de mer
  "Saumon","Thon","Cabillaud","Colin","Maquereau","Sardine","Truite","Crevettes","Crevette rose",
  "Langoustine","Moules","Coquilles Saint-Jacques","Calamars","Seiche","Palourde",

  // Féculents / céréales
  "Riz blanc","Riz complet","Basmati","Jasmin","Pâtes sèches","Pâtes fraîches","Spaghetti","Penne",
  "Riz sauvage","Quinoa","Couscous","Boulgour","Orge","Semoule","Pain","Pain complet","Baguette",
  "Tortilla","Polenta","Pommes de terre (purée)","Nouilles",

  // Légumineuses
  "Lentilles vertes","Lentilles corail","Pois chiches","Haricots rouges","Haricots blancs","Soja",
  "Fèves","Pois cassés",

  // Produits laitiers & substituts
  "Lait","Lait d'amande","Lait de soja","Beurre","Crème fraîche","Fromage râpé","Parmesan",
  "Fromage de chèvre","Ricotta","Mozzarella","Yaourt nature","Fromage blanc","Fromage frais",

  // Œufs & substituts
  "Œufs","Blanc d'œuf","Jaune d'œuf","Tofu",

  // Épices, condiments & aromates
  "Sel","Poivre noir","Paprika","Cumin","Curcuma","Gingembre","Cannelle","Noix de muscade",
  "Coriandre (moulu)","Coriandre fraîche","Basilic frais","Thym","Romarin","Laurier",
  "Persil","Ciboulette","Origan","Piment","Flocons de piment","Sriracha","Bouillon cube",

  // Huiles & vinaigres & sauces
  "Huile d'olive","Huile de tournesol","Huile de sésame","Vinaigre balsamique","Vinaigre de cidre",
  "Sauce soja","Sauce poisson","Ketchup","Moutarde","Mayonnaise","Aïoli","Tahini",

  // Sucre, farines & produits de boulangerie
  "Farine de blé","Farine de riz","Sucre","Cassonade","Sucre glace","Levure chimique","Levure de boulanger",
  "Poudre à lever","Bicarbonate de soude","Chocolat noir","Cacao en poudre",

  // Conserves & bocaux
  "Tomates concassées (boîte)","Concentré de tomate","Maïs en boîte","Pois chiches en boîte",
  "Haricots rouges en boîte","Thon en boîte","Sardines en boîte",

  // Boissons & autres
  "Café","Thé","Bouillon de volaille","Bouillon de légumes","Vin rouge","Vin blanc","Lait concentré",

  // Sauces internationales & ingrédients du monde
  "Curry en poudre","Curry rouge (pâte)","Miso","Kimchi","Nori (algue)","Wasabi","Gochujang",
  "Coco râpé","Lait de coco","Galanga","Citronnelle",

  // Fruits secs, graines, noix
  "Amande","Noix","Noisette","Pistache","Noix de cajou","Graines de tournesol","Graines de sésame",
  "Graines de chia","Graines de lin","Raisins secs","Abricots secs",

  // Divers utiles
  "Miel","Sirop d'érable","Confiture","Gelée","Fromage fondu","Crème liquide","Crème épaisse",
  "Gélatine","Agar-agar","Chapelure","Moutarde à l'ancienne","Sauce Worcestershire"
];

// Export partiel (sera complété dans la dernière partie)
// ===========================
//  RECIPES (partie 2/5)
// ===========================
const RECIPES_DB = [
  {
    name: "Pâtes carbonara",
    ingredients: ["Pâtes","Beurre","Crème fraîche","Lardons","Parmesan","Sel","Poivre","Œufs"],
    time: 20,
    utensils: ["Casserole","Poêle","Saladier","Fouet"],
    steps: [
      "Cuire les pâtes al dente dans une grande casserole d'eau salée.",
      "Pendant ce temps, faire revenir les lardons dans une poêle.",
      "Battre les œufs avec la crème et le parmesan.",
      "Mélanger les pâtes égouttées avec les lardons et la sauce œufs-crème hors du feu.",
      "Assaisonner et servir immédiatement."
    ],
    tags: ["italienne","rapide"],
    allergens: ["Œufs","Lait"]
  },
  {
    name: "Salade de poulet",
    ingredients: ["Poulet","Laitue","Tomate","Concombre","Huile d'olive","Vinaigre balsamique","Sel","Poivre"],
    time: 15,
    utensils: ["Poêle","Bol","Couteau"],
    steps: [
      "Cuire le poulet à la poêle, assaisonner et laisser refroidir.",
      "Couper les légumes et mélanger avec la laitue.",
      "Découper le poulet et ajouter à la salade. Assaisonner."
    ],
    tags: ["salade","léger","rapide"],
    allergens: []
  },
  {
    name: "Omelette aux légumes",
    ingredients: ["Œufs","Lait","Carotte","Courgette","Oignon","Beurre","Sel","Poivre"],
    time: 10,
    utensils: ["Poêle","Bol","Fouet"],
    steps: [
      "Couper les légumes en petits dés et les faire revenir.",
      "Battre les œufs avec le lait, verser sur les légumes et cuire l'omelette."
    ],
    tags: ["rapide","végétarien"],
    allergens: ["Œufs","Lait"]
  },
  {
    name: "Riz sauté aux légumes",
    ingredients: ["Riz blanc","Carotte","Oignon","Courgette","Petits pois","Sauce soja","Huile d'olive","Sel"],
    time: 20,
    utensils: ["Casserole","Poêle","Spatule"],
    steps: [
      "Cuire le riz et laisser refroidir.",
      "Faire sauter les légumes, ajouter le riz et la sauce soja, mélanger."
    ],
    tags: ["végétarien","asiatique"],
    allergens: ["Soja"]
  },
  {
    name: "Saumon grillé au four",
    ingredients: ["Saumon","Citron","Huile d'olive","Sel","Poivre","Aneth"],
    time: 25,
    utensils: ["Four","Plaque","Papier cuisson"],
    steps: [
      "Préchauffer le four à 200°C.",
      "Assaisonner le saumon, ajouter un filet de citron et cuire 12-15 min."
    ],
    tags: ["rapide","poisson"],
    allergens: ["Poissons"]
  },
  // ---> Ajoute ici d'autres recettes : soupes, desserts, plats du monde, végétariennes, vegan, sans gluten...
  {
    name: "Soupe de lentilles",
    ingredients: ["Lentilles vertes","Carotte","Oignon","Ail","Bouillon cube","Tomates concassées","Sel","Poivre"],
    time: 40,
    utensils: ["Casserole","Mixeur (optionnel)"],
    steps: [
      "Faire revenir oignon et ail, ajouter carotte et lentilles.",
      "Couvrir d'eau et ajouter le bouillon, cuire 30 min.",
      "Mixer si désiré et assaisonner."
    ],
    tags: ["vegan","soupe"],
    allergens: []
  },
  {
    name: "Tartines avocat œuf",
    ingredients: ["Pain","Avocat","Œufs","Sel","Poivre","Citron","Huile d'olive"],
    time: 12,
    utensils: ["Poêle","Toaster","Couteau"],
    steps: [
      "Toaster le pain, écraser l'avocat avec citron, assaisonner.",
      "Cuire l'œuf (au plat ou pochée) et déposer sur la tartine."
    ],
    tags: ["petit déjeuner","rapide"],
    allergens: ["Œufs"]
  },
  {
    name: "Poulet rôti aux herbes",
    ingredients: ["Poulet","Huile d'olive","Thym","Romarin","Sel","Poivre","Ail","Citron"],
    time: 90,
    utensils: ["Four","Plat à rôtir"],
    steps: [
      "Préchauffer le four à 180°C.",
      "Assaisonner le poulet avec herbes et cuire 1h-1h15 selon la taille."
    ],
    tags: ["classique","confort"],
    allergens: []
  },
  {
    name: "Quinoa bowl légumes rôtis",
    ingredients: ["Quinoa","Courgette","Poivron rouge","Patate douce","Huile d'olive","Sel","Poivre","Feta"],
    time: 35,
    utensils: ["Four","Casserole"],
    steps: [
      "Cuire le quinoa.",
      "Rôtir les légumes au four avec huile et sel.",
      "Assembler le bowl avec quinoa, légumes et feta."
    ],
    tags: ["santé","végétarien"],
    allergens: ["Lait"]
  },
  {
    name: "Pancakes rapides",
    ingredients: ["Farine de blé","Lait","Œufs","Sucre","Levure chimique","Beurre","Sel"],
    time: 15,
    utensils: ["Poêle","Saladier","Fouet"],
    steps: [
      "Mélanger les ingrédients pour obtenir une pâte.",
      "Cuire des petits disques à la poêle jusqu'à dorure."
    ],
    tags: ["petit déjeuner","sucré"],
    allergens: ["Gluten","Œufs","Lait"]
  }
  // (Tu peux compléter / dupliquer ces objets pour atteindre la quantité souhaitée)
];
// =======================
//  MENUS (partie 3/5)
// =======================
const MENUS_DB = [
  {
    id: "menu-01",
    name: "Menu léger - Express",
    type: "Déjeuner",
    meals: [
      { role: "entrée", recipe: "Salade de poulet" },
      { role: "plat", recipe: "Riz sauté aux légumes" },
      { role: "dessert", recipe: "Yaourt nature + fruits" }
    ],
    tags: ["léger","rapide"]
  },
  {
    id: "menu-02",
    name: "Menu réconfort",
    type: "Dîner",
    meals: [
      { role: "plat", recipe: "Poulet rôti aux herbes" },
      { role: "accompagnement", recipe: "Purée de pommes de terre" },
      { role: "dessert", recipe: "Pancakes rapides" }
    ],
    tags: ["confort","famille"]
  },
  {
    id: "menu-03",
    name: "Menu végétarien",
    type: "Déjeuner",
    meals: [
      { role: "entrée", recipe: "Soupe de lentilles" },
      { role: "plat", recipe: "Quinoa bowl légumes rôtis" },
      { role: "dessert", recipe: "Salade de fruits" }
    ],
    tags: ["végétarien","santé"]
  },
  {
    id: "menu-04",
    name: "Petit déjeuner énergétique",
    type: "Petit déjeuner",
    meals: [
      { role: "plat", recipe: "Tartines avocat œuf" },
      { role: "boisson", recipe: "Smoothie banane" }
    ],
    tags: ["énergie","petit déjeuner"]
  },
  // Modèle générique : utile pour génération automatique par l'app
  {
    id: "template-standard",
    name: "Template quotidien",
    type: "Template",
    meals: [
      { role: "petit_dej", recipe: null },
      { role: "dejeuner", recipe: null },
      { role: "diner", recipe: null },
      { role: "snack", recipe: null }
    ],
    tags: ["template"]
  }
];
// ================================
//  FILTRES / MÉTADONNÉES (partie 4/5)
// ================================
const META = {
  types: ["Entrée","Plat","Dessert","Boisson","Snack","Accompagnement","Soupe","Salade","Petit déjeuner"],
  cuisines: ["Française","Italienne","Asiatique","Indienne","Mexicaine","Méditerranéenne","Américaine","Végétarienne","Vegan"],
  tagsCommon: ["rapide","économique","festif","santé","confort","famille","épicé","sucré","salé"],
  diets: ["végétarien","vegan","sans-gluten","sans-lactose","keto","paléo","halal"],
  allergens: [
    "Arachides","Fruits à coque","Œufs","Lait","Poissons","Crustacés","Blé","Gluten","Soja","Sésame","Moutarde","Sulphites"
  ],
  utensils: [
    "Casserole","Poêle","Four","Mixeur","Robot","Saladier","Spatule","Cuillère en bois","Fouet","Planche à découper",
    "Couteau","Presse-agrume","Mandoline","Mixeur plongeant","Râpe","Passoire","Cuit-vapeur"
  ]
};
// ================================
//  EXPORT GLOBAL (partie 5/5)
// ================================
window.DB = {
  ingredients: INGREDIENTS_DB,
  recipes: RECIPES_DB,
  menus: MENUS_DB,
  meta: META
};
