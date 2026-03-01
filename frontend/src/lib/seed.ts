import { AppDB, Restaurant } from "@/lib/types";

const weekHours = [
  { day: "Mon", open: "11:30", close: "22:00" },
  { day: "Tue", open: "11:30", close: "22:00" },
  { day: "Wed", open: "11:30", close: "22:00" },
  { day: "Thu", open: "11:30", close: "22:30" },
  { day: "Fri", open: "11:30", close: "23:00" },
  { day: "Sat", open: "10:30", close: "23:00" },
  { day: "Sun", open: "10:30", close: "21:30" }
];

export const seedRestaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Olive & Ember",
    cuisine: "Mediterranean",
    priceRange: "$$$",
    rating: 4.8,
    reviewCount: 412,
    address: "145 Spring St",
    neighborhood: "SoHo",
    city: "New York",
    phone: "+1 (212) 555-0118",
    email: "hello@oliveember.com",
    description:
      "Contemporary Mediterranean plates with wood-fired mains, seasonal produce, and a calm downtown atmosphere.",
    isOpenNow: true,
    nextAvailableSlots: ["18:30", "19:15", "20:00", "21:30"],
    heroImages: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1200&q=80"
    ],
    openingHours: weekHours,
    menu: [
      {
        id: "r1-c1",
        name: "Small Plates",
        order: 1,
        dishes: [
          {
            id: "r1-d1",
            name: "Smoked Eggplant Dip",
            description: "Charred eggplant, tahini, pomegranate, and warm pita.",
            price: 12,
            tags: ["vegan", "chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1604908176997-43158c34b7a8?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r1-d2",
            name: "Citrus Halloumi",
            description: "Seared halloumi with orange, mint, and pistachio crumble.",
            price: 14,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r1-d3",
            name: "Harissa Prawns",
            description: "Tiger prawns, fermented chili butter, grilled lemon.",
            price: 18,
            tags: ["spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      },
      {
        id: "r1-c2",
        name: "Mains",
        order: 2,
        dishes: [
          {
            id: "r1-d4",
            name: "Wood-Fired Branzino",
            description: "Whole branzino, saffron potatoes, preserved lemon relish.",
            price: 34,
            tags: ["gluten-free", "chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r1-d5",
            name: "Lamb Kofta",
            description: "Spiced lamb skewers with herb couscous and yogurt.",
            price: 29,
            tags: [],
            photoUrl:
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r1-d6",
            name: "Freekeh Pilaf",
            description: "Roasted vegetables, freekeh grain, tahini drizzle.",
            price: 24,
            tags: ["vegan"],
            photoUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      }
    ]
  },
  {
    id: "r2",
    name: "Nori House",
    cuisine: "Japanese",
    priceRange: "$$$",
    rating: 4.7,
    reviewCount: 356,
    address: "88 Market St",
    neighborhood: "Financial District",
    city: "San Francisco",
    phone: "+1 (415) 555-0192",
    email: "bookings@norihouse.co",
    description:
      "Refined sushi and robata in a minimalist room with carefully sourced seafood and seasonal tasting sets.",
    isOpenNow: true,
    nextAvailableSlots: ["17:45", "18:30", "19:00", "20:30"],
    heroImages: [
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=80"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80"
    ],
    openingHours: weekHours,
    menu: [
      {
        id: "r2-c1",
        name: "Nigiri",
        order: 1,
        dishes: [
          {
            id: "r2-d1",
            name: "Otoro Nigiri",
            description: "Bluefin belly, fresh wasabi, aged soy.",
            price: 16,
            tags: ["chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r2-d2",
            name: "Yuzu Salmon",
            description: "Line-caught salmon with yuzu kosho and sesame.",
            price: 12,
            tags: [],
            photoUrl:
              "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r2-d3",
            name: "Tamago Truffle",
            description: "Sweet egg omelet finished with black truffle salt.",
            price: 10,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      },
      {
        id: "r2-c2",
        name: "Robata",
        order: 2,
        dishes: [
          {
            id: "r2-d4",
            name: "Miso Black Cod",
            description: "48-hour miso glaze, pickled daikon, shiso oil.",
            price: 32,
            tags: ["gluten-free"],
            photoUrl:
              "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r2-d5",
            name: "Yaki Onigiri",
            description: "Grilled rice cakes, soy butter, spring onion.",
            price: 11,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r2-d6",
            name: "Spicy Chicken Skewer",
            description: "Free-range chicken thigh, togarashi glaze.",
            price: 14,
            tags: ["spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1598515213692-d1ec75c5fb80?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      }
    ]
  },
  {
    id: "r3",
    name: "Terra Pasta Lab",
    cuisine: "Italian",
    priceRange: "$$",
    rating: 4.6,
    reviewCount: 289,
    address: "320 Elm Ave",
    neighborhood: "River North",
    city: "Chicago",
    phone: "+1 (312) 555-0180",
    email: "ciao@terrapastalab.com",
    description:
      "Handmade pasta, slow braises, and regional Italian wines in a warm, contemporary setting.",
    isOpenNow: false,
    nextAvailableSlots: ["19:30", "20:15", "21:00"],
    heroImages: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1400&q=80"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=80"
    ],
    openingHours: weekHours,
    menu: [
      {
        id: "r3-c1",
        name: "Antipasti",
        order: 1,
        dishes: [
          {
            id: "r3-d1",
            name: "Burrata e Pomodoro",
            description: "Creamy burrata, heirloom tomatoes, basil oil.",
            price: 15,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1625944524160-1f4f2f4f0f6a?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r3-d2",
            name: "Grilled Calamari",
            description: "Lemon, chili flakes, parsley, fennel salad.",
            price: 17,
            tags: ["gluten-free", "spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r3-d3",
            name: "Roasted Beet Carpaccio",
            description: "Pistachio, citrus, whipped ricotta.",
            price: 13,
            tags: ["vegetarian", "gluten-free"],
            photoUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      },
      {
        id: "r3-c2",
        name: "Pasta",
        order: 2,
        dishes: [
          {
            id: "r3-d4",
            name: "Pappardelle Ragu",
            description: "House pappardelle, slow-cooked beef ragu, pecorino.",
            price: 27,
            tags: ["chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r3-d5",
            name: "Cacio e Pepe",
            description: "Toasted pepper, aged pecorino romano.",
            price: 22,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8f70?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r3-d6",
            name: "Chili Vodka Rigatoni",
            description: "Creamy tomato sauce, Calabrian chili, stracciatella.",
            price: 24,
            tags: ["spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      }
    ]
  },
  {
    id: "r4",
    name: "Canopy Grill",
    cuisine: "American",
    priceRange: "$$",
    rating: 4.5,
    reviewCount: 198,
    address: "77 Pine Blvd",
    neighborhood: "Capitol Hill",
    city: "Seattle",
    phone: "+1 (206) 555-0148",
    email: "host@canopygrill.com",
    description:
      "Seasonal American kitchen with a focus on local produce, wood-fire proteins, and natural wines.",
    isOpenNow: true,
    nextAvailableSlots: ["18:00", "18:45", "19:45", "21:00"],
    heroImages: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1400&q=80"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1200&q=80"
    ],
    openingHours: weekHours,
    menu: [
      {
        id: "r4-c1",
        name: "Starters",
        order: 1,
        dishes: [
          {
            id: "r4-d1",
            name: "Crispy Brussels",
            description: "Maple glaze, toasted almonds, lemon zest.",
            price: 11,
            tags: ["vegan"],
            photoUrl:
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r4-d2",
            name: "Smoked Trout Dip",
            description: "House crackers, dill, capers, shallots.",
            price: 14,
            tags: [],
            photoUrl:
              "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r4-d3",
            name: "Heirloom Tomato Tart",
            description: "Goat cheese, basil pesto, flaky crust.",
            price: 13,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      },
      {
        id: "r4-c2",
        name: "Wood-Fire",
        order: 2,
        dishes: [
          {
            id: "r4-d4",
            name: "Ribeye 12oz",
            description: "Grass-fed ribeye, fingerling potatoes, jus.",
            price: 38,
            tags: ["gluten-free"],
            photoUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r4-d5",
            name: "Cedar Salmon",
            description: "Northwest salmon, dill yogurt, charred vegetables.",
            price: 31,
            tags: ["gluten-free", "chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r4-d6",
            name: "Wild Mushroom Polenta",
            description: "Creamy corn polenta and roasted mushrooms.",
            price: 23,
            tags: ["vegetarian", "gluten-free"],
            photoUrl:
              "https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      }
    ]
  },
  {
    id: "r5",
    name: "Saffron Route",
    cuisine: "Indian",
    priceRange: "$$",
    rating: 4.7,
    reviewCount: 241,
    address: "210 Lakeview Dr",
    neighborhood: "Midtown",
    city: "Austin",
    phone: "+1 (512) 555-0133",
    email: "reservations@saffronroute.com",
    description:
      "Regional Indian cuisine with house-ground spices, tandoor specials, and vibrant vegetarian options.",
    isOpenNow: true,
    nextAvailableSlots: ["18:15", "19:00", "20:15", "21:15"],
    heroImages: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1400&q=80"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1200&q=80"
    ],
    openingHours: weekHours,
    menu: [
      {
        id: "r5-c1",
        name: "Street Plates",
        order: 1,
        dishes: [
          {
            id: "r5-d1",
            name: "Pani Puri",
            description: "Crisp shells, tamarind water, potato and chickpeas.",
            price: 9,
            tags: ["vegan", "spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r5-d2",
            name: "Paneer Tikka",
            description: "Charred cottage cheese, mint chutney, onions.",
            price: 13,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1613292443284-8d10ef9383f1?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r5-d3",
            name: "Chili Garlic Wings",
            description: "Crispy wings with smoked chili glaze.",
            price: 14,
            tags: ["spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1625943555411-6e7f2f5374c8?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      },
      {
        id: "r5-c2",
        name: "Tandoor & Curry",
        order: 2,
        dishes: [
          {
            id: "r5-d4",
            name: "Butter Chicken",
            description: "Charred chicken in silky tomato fenugreek sauce.",
            price: 21,
            tags: ["chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r5-d5",
            name: "Dal Makhani",
            description: "Slow-cooked black lentils, cream, and butter.",
            price: 18,
            tags: ["vegetarian", "gluten-free"],
            photoUrl:
              "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r5-d6",
            name: "Goan Fish Curry",
            description: "Coconut curry, kokum, market fish.",
            price: 24,
            tags: ["gluten-free", "spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      }
    ]
  },
  {
    id: "r6",
    name: "Lumen Verde",
    cuisine: "Mexican",
    priceRange: "$$",
    rating: 4.4,
    reviewCount: 167,
    address: "60 Pearl Ave",
    neighborhood: "Arts District",
    city: "Los Angeles",
    phone: "+1 (323) 555-0174",
    email: "hola@lumenverde.mx",
    description:
      "Modern Mexican cuisine with bright ceviches, handmade tortillas, and a mezcal-forward bar program.",
    isOpenNow: false,
    nextAvailableSlots: ["18:45", "19:30", "20:45"],
    heroImages: [
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1627308595187-615b8fd3c1f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=1200&q=80"
    ],
    openingHours: weekHours,
    menu: [
      {
        id: "r6-c1",
        name: "Ceviches & Botanas",
        order: 1,
        dishes: [
          {
            id: "r6-d1",
            name: "Hamachi Ceviche",
            description: "Yellowtail, aguachile verde, cucumber, radish.",
            price: 18,
            tags: ["gluten-free", "spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1627308595187-615b8fd3c1f2?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r6-d2",
            name: "Roasted Cauliflower Taco",
            description: "Blue corn tortilla, mole, cashew crema.",
            price: 7,
            tags: ["vegan"],
            photoUrl:
              "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r6-d3",
            name: "Queso Fundido",
            description: "Oaxaca cheese, poblano, handmade tortillas.",
            price: 13,
            tags: ["vegetarian"],
            photoUrl:
              "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      },
      {
        id: "r6-c2",
        name: "Platos Fuertes",
        order: 2,
        dishes: [
          {
            id: "r6-d4",
            name: "Birria Short Rib",
            description: "Slow-braised rib, ancho jus, corn puree.",
            price: 29,
            tags: ["chef-pick"],
            photoUrl:
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r6-d5",
            name: "Charred Shrimp Tacos",
            description: "Chipotle aioli, cabbage slaw, lime.",
            price: 17,
            tags: ["spicy"],
            photoUrl:
              "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80",
            available: true
          },
          {
            id: "r6-d6",
            name: "Mushroom Adobo",
            description: "King oyster mushrooms, adobo glaze, herbs.",
            price: 22,
            tags: ["vegan", "gluten-free"],
            photoUrl:
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
            available: true
          }
        ]
      }
    ]
  }
];

export const seedDB: AppDB = {
  restaurants: seedRestaurants,
  reservations: [
    {
      id: "res-1001",
      restaurantId: "r1",
      date: "2026-03-06",
      time: "19:30",
      partySize: 2,
      customerName: "Emma Carter",
      customerEmail: "emma.carter@example.com",
      customerPhone: "+1 (646) 555-0101",
      notes: "Window seat if possible",
      status: "confirmed",
      createdAt: "2026-02-27T16:15:00.000Z"
    },
    {
      id: "res-1002",
      restaurantId: "r1",
      date: "2026-03-07",
      time: "20:00",
      partySize: 4,
      customerName: "Daniel Kim",
      customerEmail: "dan.kim@example.com",
      customerPhone: "+1 (917) 555-0142",
      notes: "Birthday celebration",
      status: "pending",
      createdAt: "2026-02-28T10:10:00.000Z"
    },
    {
      id: "res-1003",
      restaurantId: "r1",
      date: "2026-03-08",
      time: "18:30",
      partySize: 3,
      customerName: "Nora Singh",
      customerEmail: "nora.singh@example.com",
      customerPhone: "+1 (347) 555-0128",
      notes: "One gluten-free guest",
      status: "confirmed",
      createdAt: "2026-02-26T12:40:00.000Z"
    },
    {
      id: "res-1004",
      restaurantId: "r1",
      date: "2026-03-09",
      time: "19:15",
      partySize: 2,
      customerName: "Leo Martinez",
      customerEmail: "leo.m@example.com",
      customerPhone: "+1 (929) 555-0179",
      status: "cancelled",
      createdAt: "2026-02-25T15:00:00.000Z"
    },
    {
      id: "res-1005",
      restaurantId: "r2",
      date: "2026-03-05",
      time: "18:45",
      partySize: 2,
      customerName: "Mia Johnson",
      customerEmail: "mia.j@example.com",
      customerPhone: "+1 (415) 555-0130",
      status: "confirmed",
      createdAt: "2026-02-25T08:20:00.000Z"
    },
    {
      id: "res-1006",
      restaurantId: "r3",
      date: "2026-03-06",
      time: "20:30",
      partySize: 5,
      customerName: "Chris Wong",
      customerEmail: "chris.w@example.com",
      customerPhone: "+1 (312) 555-0199",
      status: "pending",
      createdAt: "2026-02-28T18:05:00.000Z"
    },
    {
      id: "res-1007",
      restaurantId: "r4",
      date: "2026-03-07",
      time: "19:00",
      partySize: 6,
      customerName: "Sophie Green",
      customerEmail: "sophie.green@example.com",
      customerPhone: "+1 (206) 555-0150",
      status: "confirmed",
      createdAt: "2026-02-27T09:50:00.000Z"
    },
    {
      id: "res-1008",
      restaurantId: "r5",
      date: "2026-03-08",
      time: "18:15",
      partySize: 2,
      customerName: "Ethan Cole",
      customerEmail: "ethan.cole@example.com",
      customerPhone: "+1 (512) 555-0114",
      status: "pending",
      createdAt: "2026-02-28T06:45:00.000Z"
    }
  ]
};
