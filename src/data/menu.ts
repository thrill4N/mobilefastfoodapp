import { MenuItem, RewardItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // --- BUNNY CHOWS ---
  {
    id: 'bunny-lamb',
    name: 'Quarter Lamb Bunny Chow',
    category: 'Bunny Chow',
    price: 110.00,
    description: 'A classic quarter-loaf of soft white bread, hollowed out and stuffed to the brim with slow-cooked, rich and spicy succulent lamb curry. Served with traditional carrot salad (sambals).',
    image: '/src/assets/images/bunny_chow_1779831774338.png',
    optionsLabel: 'Choose Toppings & Sides',
    availableToppings: [
      { name: 'Extra Gravy (Gravy Train)', price: 0 },
      { name: 'Spicy Mango Atchar', price: 10 },
      { name: 'Grated Cheddar Cheese', price: 15 },
      { name: 'Fresh Green Chilies', price: 5 },
      { name: 'Extra Carrot Sambals', price: 8 }
    ],
    rating: 4.9,
    ratingCount: 142,
    popular: true,
    preparationTime: 12
  },
  {
    id: 'bunny-chicken',
    name: 'Quarter Chicken Bunny Chow',
    category: 'Bunny Chow',
    price: 85.00,
    description: 'Tender pulled chicken thigh simmered in a robust, aromatic traditional curry sauce, packed in a fresh hollowed-out quarter-loaf. Topped with fresh coriander.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Choose Toppings & Sides',
    availableToppings: [
      { name: 'Extra Gravy', price: 0 },
      { name: 'Spicy Mango Atchar', price: 10 },
      { name: 'Grated Cheddar', price: 15 }
    ],
    rating: 4.7,
    ratingCount: 98,
    preparationTime: 10
  },
  {
    id: 'bunny-beans',
    name: 'Quarter Sugar Bean Bunny (Veg)',
    category: 'Bunny Chow',
    price: 65.00,
    description: 'A deeply flavorful and spicy sugar bean curry slow-simmered with potatoes, nested in a warm quarter-loaf. A legendary vegetarian favorite.',
    image: 'https://images.unsplash.com/photo-1585934966613-22cf1ed6a2b8?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Spicy Mango Atchar', price: 10 },
      { name: 'Grated Cheddar', price: 15 },
      { name: 'Fresh Green Chilies', price: 5 }
    ],
    rating: 4.6,
    ratingCount: 64,
    preparationTime: 8
  },

  // --- VETKOEKS ---
  {
    id: 'vetkoek-mince',
    name: 'Traditional Curried Mince Vetkoek',
    category: 'Vetkoek',
    price: 55.00,
    description: 'Golden-fried yeast dough bread pocket, crisp on the outside and wonderfully fluffy on the inside, generously stuffed with savory, aromatic curried beef mince.',
    image: '/src/assets/images/vetkoek_1779831794743.png',
    optionsLabel: 'Choose Fillings & Toppings',
    availableToppings: [
      { name: 'Extra Curried Mince', price: 18 },
      { name: 'Melted Cheddar Cheese', price: 12 },
      { name: 'Sweet Apricot Jam', price: 6 },
      { name: 'Tangy Tomato Relish', price: 5 }
    ],
    rating: 4.8,
    ratingCount: 175,
    popular: true,
    preparationTime: 10
  },
  {
    id: 'vetkoek-cheese-polony',
    name: 'Cheese & French Polony Vetkoek',
    category: 'Vetkoek',
    price: 45.00,
    description: 'Freshly fried hot vetkoek stuffed with sliced South African French polony, stacked cheese, and a spread of classic tangy burger sauce.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80', // street burger style
    availableToppings: [
      { name: 'Extra Polony Slice', price: 8 },
      { name: 'Extra Cheddar Cheese', price: 12 },
      { name: 'Fried Egg', price: 10 }
    ],
    rating: 4.5,
    ratingCount: 110,
    preparationTime: 6
  },
  {
    id: 'vetkoek-sweet',
    name: 'Sweet Apricot & Butter Vetkoek',
    category: 'Vetkoek',
    price: 35.00,
    description: 'Hot, fluffy fried vetkoek served with a generous melting slab of salted butter and authentic South African sweet apricot jam.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Extra Cheddar (Sweet & Savory)', price: 12 },
      { name: 'Golden Syrup drizzle', price: 5 }
    ],
    rating: 4.7,
    ratingCount: 89,
    preparationTime: 5
  },

  // --- SHWAMMA ---
  {
    id: 'shwamma-beef',
    name: 'Karoo Beef Shwamma',
    category: 'Shwamma',
    price: 95.00,
    description: 'Warm, flame-grilled pita bread tightly wrapped with shaved spice-marinated local beef, hummus, fresh cucumber, red onion, vine tomatoes, and creamy South African garlic sauce.',
    image: 'https://images.unsplash.com/photo-1561651823-34fed022540e?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Add Shwamma Upgrades',
    availableToppings: [
      { name: 'Extra Beef Strips', price: 25 },
      { name: 'Grilled Halloumi Cheese', price: 18 },
      { name: 'Double Garlic Mayo', price: 6 },
      { name: 'Sliced Jalapeños', price: 8 },
      { name: 'Creamy Hummus inside', price: 10 }
    ],
    rating: 4.8,
    ratingCount: 120,
    popular: true,
    preparationTime: 8
  },
  {
    id: 'shwamma-chicken',
    name: 'Flame-Grilled Chicken Shwamma',
    category: 'Shwamma',
    price: 85.00,
    description: 'Juicy strips of spice-marinated chicken breast, grilled to perfection and wrapped in flatbread with tzatziki, shred lettuce, tomatoes, and tahini drizzle.',
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f76?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Extra Chicken Strips', price: 20 },
      { name: 'Grilled Halloumi Cheese', price: 18 },
      { name: 'Feta Cheese crumble', price: 12 }
    ],
    rating: 4.7,
    ratingCount: 135,
    preparationTime: 8
  },

  // --- BURGERS ---
  {
    id: 'burger-jozi',
    name: 'The Jozi Double Smash Burger',
    category: 'Burgers',
    price: 95.00,
    description: 'Two ultra-thin smashed prime beef patties on an artisanal toasted brioche bun, loaded with melted cheddar cheese, crisp local lettuce, sliced gherkins, and our secret Jozi burger sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Customize Your Burger',
    availableToppings: [
      { name: 'Extra Smashed Beef Patty', price: 22 },
      { name: 'Smoked Beef Macon (Halal bacon)', price: 15 },
      { name: 'Crispy Fried Onion Rings', price: 8 },
      { name: 'Creamy Avocado Slices', price: 15 },
      { name: 'Fried Egg', price: 10 }
    ],
    rating: 4.9,
    ratingCount: 215,
    popular: true,
    preparationTime: 9
  },
  {
    id: 'burger-peri-chicken',
    name: 'Spicy Peri-Peri Chicken Burger',
    category: 'Burgers',
    price: 79.00,
    description: 'Flame-broiled chicken breast fillet basted in fiery South African Lemon & Herb or Hot Peri-Peri sauce, served on a toasted bun with mayo, crunchy lettuce, and ripe tomato.',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Cheddar Cheese Slice', price: 10 },
      { name: 'Creamy Pineapple ring', price: 8 },
      { name: 'Creamy Pepper Sauce', price: 10 }
    ],
    rating: 4.8,
    ratingCount: 167,
    preparationTime: 8
  },

  // --- PIZZA ---
  {
    id: 'pizza-regina',
    name: 'Boerewors & Chakalaka Pizza',
    category: 'Pizza',
    price: 125.00,
    description: 'Our signature local fusion pizza. Stone-baked thin crust topped with premium boerewors chunks, zesty homemade spicy chakalaka relish, caramelized onions, mozzarella cheese, and fresh coriander.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Pizza Toppings',
    availableToppings: [
      { name: 'Extra Boerewors Chunks', price: 24 },
      { name: 'Crumbled Danish Feta', price: 15 },
      { name: 'Extra Mozzarella', price: 18 },
      { name: 'Chopped Fresh Chillies', price: 5 },
      { name: 'Sweet Peppadews', price: 12 }
    ],
    rating: 4.9,
    ratingCount: 189,
    popular: true,
    preparationTime: 14
  },
  {
    id: 'pizza-peppadew',
    name: 'Sweet Peppadew & Feta Pizza (Veg)',
    category: 'Pizza',
    price: 110.00,
    description: 'Sweet and tangy South African pickled Peppadew peppers, paired beautifully with creamy crumbled feta, kalamata olives, garlic, oregano, and gooey mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Extra Peppadews', price: 12 },
      { name: 'Avocado Slices (Seasonal)', price: 15 },
      { name: 'Mushrooms & Olives', price: 14 }
    ],
    rating: 4.7,
    ratingCount: 84,
    preparationTime: 12
  },

  // --- DESSERTS ---
  {
    id: 'dessert-malva',
    name: 'Warm Malva Pudding & Custard',
    category: 'Desserts',
    price: 48.00,
    description: 'A deeply comforting South African classic: warm, caramelized, apricot-infused baked pudding soak-drenched in butter-cream syrup. Served swimming in hot, velvety vanilla custard.',
    image: '/src/assets/images/malva_pudding_1779831809285.png',
    optionsLabel: 'Choose Serving Option',
    availableToppings: [
      { name: 'Hot Liquid Custard', price: 0 },
      { name: 'Scoop of Vanilla Ice Cream', price: 12 },
      { name: 'Whipped Double Cream', price: 8 },
      { name: 'Toasted Almond Flakes', price: 6 }
    ],
    rating: 4.9,
    ratingCount: 232,
    popular: true,
    preparationTime: 6
  },
  {
    id: 'dessert-sundae',
    name: 'Bar-One Chocolate Sundae Ice Cream',
    category: 'Desserts',
    price: 42.00,
    description: 'Rich and velvety soft-serve vanilla ice cream beautifully layered and loaded with authentic South African Nestlé Bar-One chocolate fudge syrup and crushed wafers.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Choose Serving Option',
    availableToppings: [
      { name: 'On-the-go Tub with Lid', price: 0 },
      { name: 'Dine-in Tall Waffle Glass', price: 0 },
      { name: 'Extra Bar-One Fudge Sauce', price: 10 },
      { name: 'Crushed Oreo cookies', price: 8 }
    ],
    rating: 4.8,
    ratingCount: 154,
    preparationTime: 4
  },

  // --- BEVERAGES ---
  {
    id: 'bev-rooibos',
    name: 'Craft Rooibos Peach Iced Tea',
    category: 'Beverages',
    price: 28.00,
    description: 'House-brewed organic Cederberg red Rooibos tea, cold-pressed with natural South African peach nectar and fresh mint. Naturally caffeine-free and ultra-refreshing!',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Extra Ice Cubes', price: 0 },
      { name: 'Lemon Slices', price: 3 },
      { name: 'Squeeze of Honey', price: 5 }
    ],
    rating: 4.8,
    ratingCount: 145,
    preparationTime: 3
  },
  {
    id: 'bev-creamsoda',
    name: 'Classic Cream Soda Float',
    category: 'Beverages',
    price: 35.00,
    description: 'The ultimate Mzansi nostalgia! A tall glass of bubbly, bright green Sparletta Cream Soda topped with a generous floating scoop of vanilla soft-serve ice cream.',
    image: 'https://images.unsplash.com/photo-1527960656306-ff37c6412931?w=800&auto=format&fit=crop&q=80',
    availableToppings: [
      { name: 'Extra Soft-Serve Float', price: 12 },
      { name: 'Add Maraschino Cherry', price: 6 }
    ],
    rating: 4.9,
    ratingCount: 178,
    popular: true,
    preparationTime: 4
  },
  {
    id: 'fish-chips',
    name: 'Traditional Fish & Slap Chips',
    category: 'Burgers',
    price: 95.00,
    description: 'Crispy golden-battered hake fillet served with a mountain of traditional soft-cooked slap chips, vinegar, and tartare sauce.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Choose Toppings & Sides',
    availableToppings: [
      { name: 'Extra Tartare Sauce', price: 8 },
      { name: 'Lemony Herb Butter', price: 12 },
      { name: 'Pickled Onions', price: 6 },
      { name: 'Salt & Vinegar Slap Chips Top-up', price: 15 }
    ],
    rating: 4.8,
    ratingCount: 132,
    popular: true,
    preparationTime: 12
  },
  {
    id: 'beef-chips',
    name: 'Gauteng Beef Sirloin & Slap Chips',
    category: 'Burgers',
    price: 115.00,
    description: 'Tender grilled beef sirloin strips basted in sticky braai marinade, served on a bed of fresh hot slap chips with a pinch of seasoning salt.',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Add Steak Upgrades',
    availableToppings: [
      { name: 'Extra Beef Strips', price: 25 },
      { name: 'Creamy Mushroom Sauce', price: 15 },
      { name: 'Chakalaka Drizzle', price: 10 },
      { name: 'Melted Cheddar Cheese', price: 12 }
    ],
    rating: 4.7,
    ratingCount: 94,
    preparationTime: 11
  },
  {
    id: 'chicken-buns',
    name: 'Fried Chicken & Fresh Buns Combo',
    category: 'Burgers',
    price: 75.00,
    description: 'Gauteng-style deep fried crisp and juicy chicken pieces, served with soft buttered hamburger buns and tangy coleslaw.',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Choose Upgrades',
    availableToppings: [
      { name: 'Extra Crisp Drumstick', price: 20 },
      { name: 'Tangy Mayo Coleslaw', price: 8 },
      { name: 'Hot Peri-Peri Sauce Dip', price: 6 },
      { name: 'Melted Cheddar Cheese', price: 10 }
    ],
    rating: 4.6,
    ratingCount: 115,
    popular: false,
    preparationTime: 10
  },
  {
    id: 'boerewors-hotdog',
    name: 'Boerewors Street Hotdog',
    category: 'Burgers',
    price: 65.00,
    description: 'Traditional thick-grilled South African spiced Boerewors sausage tucked snuggly into a toasted long bun, topped with caramelized sweet onions and tomato-mustard relish.',
    image: 'https://images.unsplash.com/photo-1541248421061-ce3c114389df?w=800&auto=format&fit=crop&q=80',
    optionsLabel: 'Add Hotdog Relishes',
    availableToppings: [
      { name: 'Sweet Caramelized Onions', price: 6 },
      { name: 'Chakalaka relish topping', price: 10 },
      { name: 'Grated Cheddar Cheese', price: 12 },
      { name: 'Spicy Mustard drizzle', price: 4 }
    ],
    rating: 4.8,
    ratingCount: 156,
    popular: true,
    preparationTime: 7
  }
];

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: 'reward-cream-soda',
    title: 'Free Cream Soda Float',
    description: 'Quench your thirst with our ultimate retro green soda float.',
    pointsCost: 150,
    icon: 'GlassWater'
  },
  {
    id: 'reward-vetkoek-sweet',
    title: 'Free Apricot Jam Vetkoek',
    description: 'A warm fluffy vetkoek with delicious butter and sweet jam.',
    pointsCost: 250,
    icon: 'Donut'
  },
  {
    id: 'reward-lamb-bunny',
    title: 'Free Quarter Lamb Bunny Chow',
    description: 'Our absolute bestseller lamb bunny chow, on us!',
    pointsCost: 700,
    icon: 'Beef'
  },
  {
    id: 'reward-jozi-burger',
    title: 'Free Jozi Smash Burger',
    description: 'Get down to business with a double beef smash burger.',
    pointsCost: 600,
    icon: 'Salad'
  }
];
