const listings = [
  // Pizza Listings
  {
    name: "Margherita Pizza",
    originalPrice: 250,
    discountedPrice: 200,
    description: "Classic Margherita with fresh basil and mozzarella cheese.",
    images: [
      {
        url: "https://cdn.loveandlemons.com/wp-content/uploads/2023/07/margherita-pizza-recipe-580x826.jpg",
        filename: "margherita.jpg",
      },
    ],
    isVeg: true,
    category: "Pizza",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 120,
  },
  {
    name: "Pepperoni Pizza",
    originalPrice: 300,
    discountedPrice: 270,
    description: "Loaded with spicy pepperoni and cheese.",
    images: [
      {
        url: "https://cdn.uengage.io/uploads/5/image-694925-1715678908.png",
        filename: "pepperoni.jpg",
      },
    ],
    isVeg: false,
    category: "Pizza",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 150,
  },
  {
    name: "BBQ Chicken Pizza",
    originalPrice: 350,
    discountedPrice: 320,
    description: "Tangy BBQ chicken with onions and mozzarella cheese.",
    images: [
      {
        url: "https://www.allrecipes.com/thmb/GaPoTsU1nxkKlmrhYgVHRglGFs0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d.jpg",
        filename: "bbqchicken.jpg",
      },
    ],
    isVeg: false,
    category: "Pizza",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 95,
  },
  {
    name: "Veggie Delight Pizza",
    originalPrice: 280,
    discountedPrice: 240,
    description: "A delightful mix of bell peppers, olives, and mushrooms.",
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1/0173/8181/8422/files/20240625161049-recipeimage7_pizzagriddle_veggievegandelight.jpg?v=1719331851&width=600&height=900",
        filename: "veggiedelight.jpg",
      },
    ],
    isVeg: true,
    category: "Pizza",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 110,
  },
  {
    name: "Four Cheese Pizza",
    originalPrice: 320,
    discountedPrice: 290,
    description:
      "A cheesy combination of mozzarella, parmesan, cheddar, and gouda.",
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1/0508/5514/9736/files/Recipe_Four_Cheese_Pizza_1_480x480.jpg?v=1620478315",
        filename: "fourcheese.jpg",
      },
    ],
    isVeg: true,
    category: "Pizza",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 135,
  },

  // Sandwich Listings
  {
    name: "Grilled Cheese Sandwich",
    originalPrice: 120,
    discountedPrice: 100,
    description: "Classic grilled cheese with a golden crust.",
    images: [
      {
        url: "https://cdn.loveandlemons.com/wp-content/uploads/2023/01/grilled-cheese-sandwich-580x712.jpg",
        filename: "grilledcheese.jpg",
      },
    ],
    isVeg: true,
    category: "Sandwich",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 90,
  },
  {
    name: "Club Sandwich",
    originalPrice: 180,
    discountedPrice: 160,
    description:
      "A triple-layered sandwich loaded with chicken, lettuce, and mayo.",
    images: [
      {
        url: "https://hips.hearstapps.com/hmg-prod/images/club-sandwich-lead-67c06a0f21081.jpg?crop=1xw:1xh;center,top&resize=1200:*",
        filename: "clubsandwich.jpg",
      },
    ],
    isVeg: false,
    category: "Sandwich",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 85,
  },
  {
    name: "Paneer Tikka Sandwich",
    originalPrice: 150,
    discountedPrice: 130,
    description: "A fusion of soft paneer with spicy tikka flavors.",
    images: [
      {
        url: "https://www.maggi.in/sites/default/files/styles/home_stage_1500_700/public/srh_recipes/094e741f748730fae8c3742217c5fd58.jpg?h=51a72048&itok=6VknETAE",
        filename: "paneertikka.jpg",
      },
    ],
    isVeg: true,
    category: "Sandwich",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 70,
  },
  {
    name: "Chicken Mayo Sandwich",
    originalPrice: 170,
    discountedPrice: 150,
    description: "Creamy mayonnaise with tender chicken filling.",
    images: [
      {
        url: "https://www.spicebangla.com/wp-content/uploads/2024/06/chicken-mayo-sandwich-grill.jpg",
        filename: "chickenmayo.jpg",
      },
    ],
    isVeg: false,
    category: "Sandwich",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 100,
  },
  {
    name: "Veggie Sub Sandwich",
    originalPrice: 160,
    discountedPrice: 140,
    description: "A fresh sub loaded with lettuce, tomatoes, and sauces.",
    images: [
      {
        url: "https://www.budgetbytes.com/wp-content/uploads/2021/08/Ultimate-Veggie-Sandwich-V2-768x1024.jpg",
        filename: "veggiesub.jpg",
      },
    ],
    isVeg: true,
    category: "Sandwich",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 65,
  },
  {
    name: "Spaghetti Bolognese",
    originalPrice: 250,
    discountedPrice: 200,
    description:
      "A classic Italian pasta served with a rich and savory meat sauce.",
    images: [
      { url: "https://www.recipetineats.com/tachyon/2018/07/Spaghetti-Bolognese.jpg?resize=900%2C1260&zoom=0.72", filename: "spaghetti1.jpg" },
      { url: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_728,h_546/k%2FPhoto%2FRecipes%2F2024-11-spaghetti-bolognese%2FSEO-spaghetti-bolognese-0088", filename: "spaghetti2.jpg" },
    ],
    isVeg: false,
    category: "Pasta",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 120,
  },
  {
    name: "Fettuccine Alfredo",
    originalPrice: 280,
    discountedPrice: 240,
    description: "Creamy and rich Alfredo sauce over fettuccine pasta.",
    images: [
      {
        url: "https://www.allrecipes.com/thmb/6t5UtCtBjvl26mcpYq1ZhPTfbcQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-23431-to-die-for-fettuccine-alfredo-DDMFS-beauty-3x4-b64d36c7ff314cb39774e261c5b18352.jpg",
        filename: "fettuccine1.jpg",
      },
      {
        url: "https://moribyan.com/wp-content/uploads/2021/10/IMG_2443-e1635176822829.jpg",
        filename: "fettuccine2.jpg",
      },
    ],
    isVeg: false,
    category: "Pasta",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 150,
  },
  {
    name: "Penne Arrabbiata",
    originalPrice: 220,
    discountedPrice: 180,
    description: "Penne pasta in a spicy tomato-based sauce.",
    images: [
      { url: "https://www.recipetineats.com/tachyon/2023/10/Penne-Arrabbiata-4.jpg?resize=900%2C1125&zoom=0.72", filename: "penne1.jpg" },
      { url: "https://www.recipetineats.com/tachyon/2023/10/Penne-Arrabbiata-3.jpg?resize=900%2C1125&zoom=0.72", filename: "penne2.jpg" },
    ],
    isVeg: true,
    category: "Pasta",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.2,
    ratingsCount: 95,
  },
  {
    name: "Mac and Cheese",
    originalPrice: 230,
    discountedPrice: 210,
    description: "Creamy mac and cheese with a crunchy top.",
    images: [
      { url: "https://www.allrecipes.com/thmb/bNRRCp3_rGakXb8wSbjYDWfeZqs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/238691-Simple-Macaroni-And-Cheese-mfs_008-b32db5aa505041acbe958aedb81d29e9.jpg", filename: "mac1.jpg" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Original_Mac_n_Cheese_.jpg/1024px-Original_Mac_n_Cheese_.jpg", filename: "mac2.jpg" },
    ],
    isVeg: true,
    category: "Pasta",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 200,
  },
  {
    name: "Lasagna",
    originalPrice: 300,
    discountedPrice: 260,
    description: "Layers of pasta, cheese, and rich meat sauce.",
    images: [
      { url: "https://www.simplyrecipes.com/thmb/Y3uEitjZdpzB46HxXy3JnsHXXN0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Best-Classic-Lasagna-Lead-7-48433ed3fa71405b967e77d09c494a74.jpg", filename: "lasagna1.jpg" },
      { url: "https://www.simplyrecipes.com/thmb/pCT0hoPM_GUZx-dT0BLUHkFCndw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Best-Classic-Lasagna-Lead-1-b67f9c8bb82448d7ac34807d0d62244e.jpg", filename: "lasagna2.jpg" },
    ],
    isVeg: false,
    category: "Pasta",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 180,
  },

  {
    name: "Classic Maggi",
    originalPrice: 50,
    discountedPrice: 40,
    description: "The original Maggi noodles with a classic taste.",
    images: [
      { url: "https://assets.zeezest.com/blogs/PROD_Maggi%20cover_1711352940490_thumb_1200.jpeg?w=1200&q=75&fm=webp", filename: "maggi1.jpg" },
      { url: "https://assets.zeezest.com/images/PROD_Classic%20spicy_1711352215638_thumb_800.jpeg", filename: "maggi2.jpg" },
    ],
    isVeg: true,
    category: "Maggi",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 100,
  },
  {
    name: "Maggi with Cheese",
    originalPrice: 60,
    discountedPrice: 50,
    description: "Maggi noodles with melted cheese.",
    images: [
      { url: "https://www.maggi.in/sites/default/files/styles/home_stage_1500_700/public/srh_recipes/f6d480af28b14b4226639ef9a4042835.jpg?h=152e3acd&itok=ILEBJxJN", filename: "maggi3.jpg" },
      { url: "https://c.ndtvimg.com/2022-03/phf9edeo_maggi_625x300_11_March_22.jpg", filename: "maggi4.jpg" },
    ],
    isVeg: true,
    category: "Maggi",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 120,
  },
  {
    name: "Maggi with Veggies",
    originalPrice: 70,
    discountedPrice: 60,
    description: "Maggi noodles with mixed veggies.",
    images: [
      { url: "https://www.maggi.co.uk/sites/default/files/styles/home_stage_1500_700/public/srh_recipes/ecf00e5c370f20e168f182e68c597e58.jpg?h=67eabc4d&itok=63J1UTuV", filename: "maggi5.jpg" },
      { url: "https://i.ytimg.com/vi/T09CbMLq6Wo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC8-3YClULrr6nmz2NnzC4NaEZX7Q", filename: "maggi6.jpg" },
    ],
    isVeg: true,
    category: "Maggi",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 110,
  },
  {
    name: "Maggi with Chicken",
    originalPrice: 100,
    discountedPrice: 90,
    description: "Maggi noodles with tender chicken pieces.",
    images: [
      { url: "https://www.maggi.lk/sites/default/files/styles/home_stage_1500_700/public/srh_recipes/7c979378d75d81812f8540563da0e74c.jpg?h=4f5b30f1&itok=pLXB-swt", filename: "maggi7.jpg" },
      { url: "https://www.whiskaffair.com/wp-content/uploads/2022/09/Chicken-Maggi-2-1.jpg", filename: "maggi8.jpg" },
    ],
    isVeg: false,
    category: "Maggi",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 150,
  },
  {
    name: "Spicy Maggi",
    originalPrice: 55,
    discountedPrice: 45,
    description: "Maggi noodles with a spicy kick.",
    images: [
      { url: "https://i0.wp.com/naturallynidhi.com/wp-content/uploads/2024/01/Spicy-Peanut-Maggi-Noodles-Cover.jpg?w=1200&ssl=1", filename: "maggi9.jpg" },
      { url: "https://i0.wp.com/naturallynidhi.com/wp-content/uploads/2024/01/Spicy-Peanut-Maggi-Noodles-1.jpg?w=680&ssl=1", filename: "maggi10.jpg" },
    ],
    isVeg: true,
    category: "Maggi",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 130,
  },

  {
    name: "Classic Fries",
    originalPrice: 100,
    discountedPrice: 80,
    description: "Crispy golden fries with a hint of salt.",
    images: [
      { url: "https://jamiegeller.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/MTY1NTI0ODcxNTEzODQzMjM4/crispy-classic-french-friesjpg.webp", filename: "fries1.jpg" },
      { url: "https://thecozycook.com/wp-content/uploads/2020/02/Copycat-McDonalds-French-Fries-.jpg", filename: "fries2.jpg" },
    ],
    isVeg: true,
    category: "Fries",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.2,
    ratingsCount: 90,
  },
  {
    name: "Cheese Fries",
    originalPrice: 120,
    discountedPrice: 100,
    description: "Fries topped with melted cheese and a sprinkle of herbs.",
    images: [
      {
        url: "https://www.chatpataaffair.com/wp-content/uploads/2023/05/cheesy-fries.jpg2_.jpg",
        filename: "cheesefries1.jpg",
      },
      {
        url: "https://pilotchefs.com/media/2024/12/Cheese-Fries.jpg",
        filename: "cheesefries2.jpg",
      },
    ],
    isVeg: true,
    category: "Fries",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 150,
  },
  {
    name: "Spicy Fries",
    originalPrice: 110,
    discountedPrice: 90,
    description: "Fries with a spicy seasoning.",
    images: [
      {
        url: "https://diethood.com/wp-content/uploads/2023/11/cajun-fries-4.jpgg",
        filename: "spicyfries1.jpg",
      },
      {
        url: "https://www.crowdedkitchen.com/wp-content/uploads/2019/03/Sweet-potato-fries-3.jpg",
        filename: "spicyfries2.jpg",
      },
    ],
    isVeg: true,
    category: "Fries",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 120,
  },
  {
    name: "Garlic Fries",
    originalPrice: 130,
    discountedPrice: 110,
    description: "Fries tossed in garlic butter with fresh herbs.",
    images: [
      {
        url: "https://www.foodiecrush.com/wp-content/uploads/2018/04/Killer-Rosemary-Garlic-Fries-foodiecrush.com-010-683x1024.jpg",
        filename: "garlicfries1.jpg",
      },
      {
        url: "https://www.tablefortwoblog.com/wp-content/uploads/2024/02/garlic-fries-recipe-photos-tablefortwoblog-9.jpg",
        filename: "garlicfries2.jpg",
      },
    ],
    isVeg: true,
    category: "Fries",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 160,
  },
  {
    name: "Loaded Fries",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Fries topped with cheese, bacon, and sour cream.",
    images: [
      {
        url: "https://www.spendwithpennies.com/wp-content/uploads/2022/08/Loaded-Cheese-Fries-SpendWithPennies-4-800x1200.jpg",
        filename: "loadedfries1.jpg",
      },
      {
        url: "https://www.queensleeappetit.com/wp-content/uploads/2018/01/Loaded-Cheese-Fries-2.jpg",
        filename: "loadedfries2.jpg",
      },
    ],
    isVeg: false,
    category: "Fries",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.9,
    ratingsCount: 200,
  },

  {
    name: "Veg Manchurian",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Crispy vegetable balls in a tangy, spicy Manchurian sauce.",
    images: [
      {
        url: "https://i.ytimg.com/vi/xkMbJCtaaqA/maxresdefault.jpg",
        filename: "vegmanchurian1.jpg",
      },
      {
        url: "https://www.chefadora.com/_next/image?url=https%3A%2F%2Fchefadora.b-cdn.net%2FScreenshot_2024_10_01_140619_572a1d5d13.jpg&w=1920&q=75",
        filename: "vegmanchurian2.jpg",
      },
    ],
    isVeg: true,
    category: "Manchurian",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 110,
  },
  {
    name: "Chicken Manchurian",
    originalPrice: 180,
    discountedPrice: 150,
    description: "Juicy chicken pieces in a savory, spicy Manchurian sauce.",
    images: [
      {
        url: "https://www.chilitochoc.com/wp-content/uploads/2024/11/serving-spoon-in-manchurian-gravy.jpg",
        filename: "chickenmanchurian1.jpg",
      },
      {
        url: "https://www.chilitochoc.com/wp-content/uploads/2024/11/chicken-manchurian-with-gravy.jpg",
        filename: "chickenmanchurian2.jpg",
      },
    ],
    isVeg: false,
    category: "Manchurian",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 130,
  },
  {
    name: "Gobi Manchurian",
    originalPrice: 160,
    discountedPrice: 140,
    description: "Crispy cauliflower in a deliciously spicy Manchurian sauce.",
    images: [
      {
        url: "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*wftmMjJgSf4TJCvj_suuAw.jpeg",
        filename: "gobimanchurian1.jpg",
      },
      {
        url: "https://www.sharmispassions.com/wp-content/uploads/2022/02/gobi-manchurian6.jpg",
        filename: "gobimanchurian2.jpg",
      },
    ],
    isVeg: true,
    category: "Manchurian",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 120,
  },
  {
    name: "Paneer Manchurian",
    originalPrice: 170,
    discountedPrice: 140,
    description: "Soft paneer cubes in a spicy, tangy Manchurian sauce.",
    images: [
      {
        url: "https://vaya.in/recipes/wp-content/uploads/2018/03/Paneer-Manchurian.jpg",
        filename: "paneermanchurian1.jpg",
      },
      {
        url: "https://orders.popskitchen.in/storage/2024/09/image-167.png",
        filename: "paneermanchurian2.jpg",
      },
    ],
    isVeg: true,
    category: "Manchurian",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 140,
  },
  {
    name: "Prawn Manchurian",
    originalPrice: 210,
    discountedPrice: 180,
    description: "Succulent prawns cooked in a spicy Manchurian sauce.",
    images: [
      {
        url: "https://kfoods.com/images1/newrecipeicon/prawn-manchurian_5471.jpg",
        filename: "prawnmanchurian1.jpg",
      },
      {
        url: "https://jeyporedukaan.in/wp-content/uploads/2022/09/images-1-1.jpeg",
        filename: "prawnmanchurian2.jpg",
      },
    ],
    isVeg: false,
    category: "Manchurian",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 150,
  },

  {
    name: "Spring Rolls",
    originalPrice: 120,
    discountedPrice: 100,
    description:
      "Crispy rolls filled with mixed veggies and served with a tangy dip.",
    images: [
      {
        url: "https://saltedmint.com/wp-content/uploads/2024/01/Vegetable-Spring-Rolls-4-500x375.jpg",
        filename: "springrolls1.jpg",
      },
      {
        url: "https://redhousespice.com/wp-content/uploads/2021/12/whole-spring-rolls-and-halved-ones-scaled.jpg",
        filename: "springrolls2.jpg",
      },
    ],
    isVeg: true,
    category: "Appetizer",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 110,
  },
  {
    name: "Chicken Wings",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Succulent chicken wings with a smoky barbecue glaze.",
    images: [
      {
        url: "https://bakerbynature.com/wp-content/uploads/2015/02/Sweet-and-Spicy-Sriracha-Chicken-Wings-0-6.jpg",
        filename: "chickenwings1.jpg",
      },
      {
        url: "https://www.recipetineats.com/tachyon/2024/11/New-Oreleans-chicken-wings_1.jpg?resize=500%2C500",
        filename: "chickenwings2.jpg",
      },
    ],
    isVeg: false,
    category: "Appetizer",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 140,
  },
  {
    name: "Samosa",
    originalPrice: 50,
    discountedPrice: 40,
    description: "Crispy pastry filled with spiced potatoes and peas.",
    images: [
      { url: "https://vegecravings.com/wp-content/uploads/2017/03/Aloo-Samosa-Recipe-Step-By-Step-Instructions.jpg", filename: "samosa1.jpg" },
      { url: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/08/Best-Indian-Punjabi-Samosa-Recipe.jpg", filename: "samosa2.jpg" },
    ],
    isVeg: true,
    category: "Appetizer",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 120,
  },
  {
    name: "Onion Rings",
    originalPrice: 80,
    discountedPrice: 70,
    description: "Crispy and golden onion rings served with a spicy dip.",
    images: [
      {
        url: "https://static01.nyt.com/images/2020/04/22/dining/ejm-sourdough-03/ejm-sourdough-03-threeByTwoMediumAt2X.jpg",
        filename: "onionrings1.jpg",
      },
      {
        url: "https://sweetsimplevegan.com/wp-content/uploads/2022/03/close_up_Vegan_beer_battered_crispy_onion_rings_sweet_simple_vegan_2.jpg",
        filename: "onionrings2.jpg",
      },
    ],
    isVeg: true,
    category: "Appetizer",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 110,
  },
  {
    name: "Paneer Tikka",
    originalPrice: 180,
    discountedPrice: 160,
    description: "Grilled paneer cubes marinated in spices and yogurt.",
    images: [
      {
        url: "https://example.com/paneertikka1.jpg",
        filename: "paneertikka1.jpg",
      },
      {
        url: "https://example.com/paneertikka2.jpg",
        filename: "paneertikka2.jpg",
      },
    ],
    isVeg: true,
    category: "Appetizer",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 130,
  },

  {
    name: "Veg Momos",
    originalPrice: 120,
    discountedPrice: 100,
    description:
      "Steamed dumplings filled with vegetables, served with spicy chutney.",
    images: [
      { url: "https://example.com/vegmomos1.jpg", filename: "vegmomos1.jpg" },
      { url: "https://example.com/vegmomos2.jpg", filename: "vegmomos2.jpg" },
    ],
    isVeg: true,
    category: "Momos",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 120,
  },
  {
    name: "Chicken Momos",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Steamed chicken-filled dumplings with a spicy dipping sauce.",
    images: [
      {
        url: "https://example.com/chickenmomos1.jpg",
        filename: "chickenmomos1.jpg",
      },
      {
        url: "https://example.com/chickenmomos2.jpg",
        filename: "chickenmomos2.jpg",
      },
    ],
    isVeg: false,
    category: "Momos",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 150,
  },
  {
    name: "Paneer Momos",
    originalPrice: 160,
    discountedPrice: 140,
    description:
      "Steamed dumplings filled with spiced paneer and served with chutney.",
    images: [
      {
        url: "https://example.com/paneermomos1.jpg",
        filename: "paneermomos1.jpg",
      },
      {
        url: "https://example.com/paneermomos2.jpg",
        filename: "paneermomos2.jpg",
      },
    ],
    isVeg: true,
    category: "Momos",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 140,
  },
  {
    name: "Prawn Momos",
    originalPrice: 200,
    discountedPrice: 170,
    description: "Steamed prawn-filled momos with a tangy sauce.",
    images: [
      {
        url: "https://example.com/prawnmomos1.jpg",
        filename: "prawnmomos1.jpg",
      },
      {
        url: "https://example.com/prawnmomos2.jpg",
        filename: "prawnmomos2.jpg",
      },
    ],
    isVeg: false,
    category: "Momos",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 160,
  },
  {
    name: "Tandoori Momos",
    originalPrice: 180,
    discountedPrice: 150,
    description: "Grilled momos with a smoky tandoori flavor.",
    images: [
      {
        url: "https://example.com/tandoorimomos1.jpg",
        filename: "tandoorimomos1.jpg",
      },
      {
        url: "https://example.com/tandoorimomos2.jpg",
        filename: "tandoorimomos2.jpg",
      },
    ],
    isVeg: true,
    category: "Momos",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 150,
  },

  {
    name: "Vanilla Ice-Cream",
    originalPrice: 80,
    discountedPrice: 70,
    description: "Classic creamy vanilla ice-cream, smooth and delicious.",
    images: [
      {
        url: "https://example.com/vanillaicecream1.jpg",
        filename: "vanillaicecream1.jpg",
      },
      {
        url: "https://example.com/vanillaicecream2.jpg",
        filename: "vanillaicecream2.jpg",
      },
    ],
    isVeg: true,
    category: "Ice-Cream",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.2,
    ratingsCount: 100,
  },
  {
    name: "Chocolate Ice-Cream",
    originalPrice: 90,
    discountedPrice: 75,
    description: "Rich and creamy chocolate ice-cream for chocolate lovers.",
    images: [
      {
        url: "https://example.com/chocolateicecream1.jpg",
        filename: "chocolateicecream1.jpg",
      },
      {
        url: "https://example.com/chocolateicecream2.jpg",
        filename: "chocolateicecream2.jpg",
      },
    ],
    isVeg: true,
    category: "Ice-Cream",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 120,
  },
  {
    name: "Strawberry Ice-Cream",
    originalPrice: 85,
    discountedPrice: 75,
    description:
      "Sweet and tangy strawberry ice-cream made with fresh berries.",
    images: [
      {
        url: "https://example.com/strawberryicecream1.jpg",
        filename: "strawberryicecream1.jpg",
      },
      {
        url: "https://example.com/strawberryicecream2.jpg",
        filename: "strawberryicecream2.jpg",
      },
    ],
    isVeg: true,
    category: "Ice-Cream",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 110,
  },
  {
    name: "Butterscotch Ice-Cream",
    originalPrice: 95,
    discountedPrice: 80,
    description: "Creamy butterscotch ice-cream with a crunchy caramel swirl.",
    images: [
      {
        url: "https://example.com/butterscotchicecream1.jpg",
        filename: "butterscotchicecream1.jpg",
      },
      {
        url: "https://example.com/butterscotchicecream2.jpg",
        filename: "butterscotchicecream2.jpg",
      },
    ],
    isVeg: true,
    category: "Ice-Cream",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 130,
  },
  {
    name: "Mango Ice-Cream",
    originalPrice: 100,
    discountedPrice: 85,
    description:
      "Delicious and refreshing mango ice-cream made with fresh mangoes.",
    images: [
      {
        url: "https://example.com/mangoicecream1.jpg",
        filename: "mangoicecream1.jpg",
      },
      {
        url: "https://example.com/mangoicecream2.jpg",
        filename: "mangoicecream2.jpg",
      },
    ],
    isVeg: true,
    category: "Ice-Cream",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 140,
  },

  {
    name: "Veg Burger",
    originalPrice: 120,
    discountedPrice: 100,
    description:
      "Crispy veggie patty with fresh lettuce and creamy mayonnaise.",
    images: [
      { url: "https://example.com/vegburger1.jpg", filename: "vegburger1.jpg" },
      { url: "https://example.com/vegburger2.jpg", filename: "vegburger2.jpg" },
    ],
    isVeg: true,
    category: "Burgers",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 110,
  },
  {
    name: "Chicken Burger",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Juicy chicken patty with fresh vegetables and mayo.",
    images: [
      {
        url: "https://example.com/chickenburger1.jpg",
        filename: "chickenburger1.jpg",
      },
      {
        url: "https://example.com/chickenburger2.jpg",
        filename: "chickenburger2.jpg",
      },
    ],
    isVeg: false,
    category: "Burgers",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 120,
  },
  {
    name: "Cheese Burger",
    originalPrice: 170,
    discountedPrice: 140,
    description: "Delicious cheese-stuffed burger with fresh toppings.",
    images: [
      {
        url: "https://example.com/cheeseburger1.jpg",
        filename: "cheeseburger1.jpg",
      },
      {
        url: "https://example.com/cheeseburger2.jpg",
        filename: "cheeseburger2.jpg",
      },
    ],
    isVeg: false,
    category: "Burgers",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 140,
  },
  {
    name: "Double Patty Burger",
    originalPrice: 220,
    discountedPrice: 190,
    description:
      "Two juicy patties with a layer of melted cheese and crispy veggies.",
    images: [
      {
        url: "https://example.com/doublepattyburger1.jpg",
        filename: "doublepattyburger1.jpg",
      },
      {
        url: "https://example.com/doublepattyburger2.jpg",
        filename: "doublepattyburger2.jpg",
      },
    ],
    isVeg: false,
    category: "Burgers",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 150,
  },
  {
    name: "Fish Burger",
    originalPrice: 180,
    discountedPrice: 160,
    description: "Crispy fish fillet with a tangy tartar sauce.",
    images: [
      {
        url: "https://example.com/fishburger1.jpg",
        filename: "fishburger1.jpg",
      },
      {
        url: "https://example.com/fishburger2.jpg",
        filename: "fishburger2.jpg",
      },
    ],
    isVeg: false,
    category: "Burgers",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 130,
  },

  {
    name: "Veg Roll",
    originalPrice: 150,
    discountedPrice: 130,
    description:
      "A delicious veggie wrap with crispy vegetables and tangy sauces.",
    images: [
      { url: "https://example.com/vegroll1.jpg", filename: "vegroll1.jpg" },
      { url: "https://example.com/vegroll2.jpg", filename: "vegroll2.jpg" },
    ],
    isVeg: true,
    category: "Rolls",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 110,
  },
  {
    name: "Chicken Roll",
    originalPrice: 180,
    discountedPrice: 150,
    description: "Tender chicken pieces wrapped with fresh veggies and sauces.",
    images: [
      {
        url: "https://example.com/chickenroll1.jpg",
        filename: "chickenroll1.jpg",
      },
      {
        url: "https://example.com/chickenroll2.jpg",
        filename: "chickenroll2.jpg",
      },
    ],
    isVeg: false,
    category: "Rolls",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 120,
  },
  {
    name: "Paneer Roll",
    originalPrice: 160,
    discountedPrice: 140,
    description: "Spicy grilled paneer wrapped with fresh salad and sauces.",
    images: [
      {
        url: "https://example.com/paneerroll1.jpg",
        filename: "paneerroll1.jpg",
      },
      {
        url: "https://example.com/paneerroll2.jpg",
        filename: "paneerroll2.jpg",
      },
    ],
    isVeg: true,
    category: "Rolls",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 130,
  },
  {
    name: "Egg Roll",
    originalPrice: 140,
    discountedPrice: 120,
    description:
      "Scrambled eggs wrapped with veggies and sauces in a soft paratha.",
    images: [
      { url: "https://example.com/eggroll1.jpg", filename: "eggroll1.jpg" },
      { url: "https://example.com/eggroll2.jpg", filename: "eggroll2.jpg" },
    ],
    isVeg: false,
    category: "Rolls",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 115,
  },
  {
    name: "Mutton Roll",
    originalPrice: 200,
    discountedPrice: 170,
    description:
      "Juicy mutton pieces with a blend of spices wrapped in a soft paratha.",
    images: [
      {
        url: "https://example.com/muttonroll1.jpg",
        filename: "muttonroll1.jpg",
      },
      {
        url: "https://example.com/muttonroll2.jpg",
        filename: "muttonroll2.jpg",
      },
    ],
    isVeg: false,
    category: "Rolls",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 140,
  },

  {
    name: "Chocolate Pastry",
    originalPrice: 120,
    discountedPrice: 100,
    description:
      "Decadent chocolate pastry with layers of rich cocoa frosting.",
    images: [
      {
        url: "https://example.com/chocolatepastry1.jpg",
        filename: "chocolatepastry1.jpg",
      },
      {
        url: "https://example.com/chocolatepastry2.jpg",
        filename: "chocolatepastry2.jpg",
      },
    ],
    isVeg: true,
    category: "Pastry",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 120,
  },
  {
    name: "Vanilla Pastry",
    originalPrice: 100,
    discountedPrice: 85,
    description: "Light and fluffy vanilla pastry topped with whipped cream.",
    images: [
      {
        url: "https://example.com/vanillapastry1.jpg",
        filename: "vanillapastry1.jpg",
      },
      {
        url: "https://example.com/vanillapastry2.jpg",
        filename: "vanillapastry2.jpg",
      },
    ],
    isVeg: true,
    category: "Pastry",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 110,
  },
  {
    name: "Strawberry Pastry",
    originalPrice: 130,
    discountedPrice: 110,
    description: "Sweet strawberry pastry topped with fresh berries and cream.",
    images: [
      {
        url: "https://example.com/strawberrypastry1.jpg",
        filename: "strawberrypastry1.jpg",
      },
      {
        url: "https://example.com/strawberrypastry2.jpg",
        filename: "strawberrypastry2.jpg",
      },
    ],
    isVeg: true,
    category: "Pastry",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 130,
  },
  {
    name: "Pineapple Pastry",
    originalPrice: 140,
    discountedPrice: 120,
    description:
      "Refreshing pineapple-flavored pastry with whipped cream and fruit.",
    images: [
      {
        url: "https://example.com/pineapplepastry1.jpg",
        filename: "pineapplepastry1.jpg",
      },
      {
        url: "https://example.com/pineapplepastry2.jpg",
        filename: "pineapplepastry2.jpg",
      },
    ],
    isVeg: true,
    category: "Pastry",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 115,
  },
  {
    name: "Coffee Pastry",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Moist coffee-flavored pastry with a creamy coffee icing.",
    images: [
      {
        url: "https://example.com/coffeepastry1.jpg",
        filename: "coffeepastry1.jpg",
      },
      {
        url: "https://example.com/coffeepastry2.jpg",
        filename: "coffeepastry2.jpg",
      },
    ],
    isVeg: true,
    category: "Pastry",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 120,
  },

  {
    name: "Veg Hakka Noodles",
    originalPrice: 120,
    discountedPrice: 100,
    description: "Stir-fried noodles with mixed vegetables and spices.",
    images: [
      {
        url: "https://example.com/veghakkanoodles1.jpg",
        filename: "veghakkanoodles1.jpg",
      },
      {
        url: "https://example.com/veghakkanoodles2.jpg",
        filename: "veghakkanoodles2.jpg",
      },
    ],
    isVeg: true,
    category: "Noodles",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 110,
  },
  {
    name: "Chicken Noodles",
    originalPrice: 150,
    discountedPrice: 130,
    description: "Stir-fried noodles with chicken, vegetables, and spices.",
    images: [
      {
        url: "https://example.com/chickennoodles1.jpg",
        filename: "chickennoodles1.jpg",
      },
      {
        url: "https://example.com/chickennoodles2.jpg",
        filename: "chickennoodles2.jpg",
      },
    ],
    isVeg: false,
    category: "Noodles",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 120,
  },
  {
    name: "Egg Noodles",
    originalPrice: 130,
    discountedPrice: 110,
    description:
      "Delicious noodles stir-fried with scrambled eggs and veggies.",
    images: [
      {
        url: "https://example.com/eggnoodles1.jpg",
        filename: "eggnoodles1.jpg",
      },
      {
        url: "https://example.com/eggnoodles2.jpg",
        filename: "eggnoodles2.jpg",
      },
    ],
    isVeg: false,
    category: "Noodles",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.3,
    ratingsCount: 115,
  },
  {
    name: "Prawn Noodles",
    originalPrice: 180,
    discountedPrice: 150,
    description: "Noodles stir-fried with succulent prawns and vegetables.",
    images: [
      {
        url: "https://example.com/prawnnoodles1.jpg",
        filename: "prawnnoodles1.jpg",
      },
      {
        url: "https://example.com/prawnnoodles2.jpg",
        filename: "prawnnoodles2.jpg",
      },
    ],
    isVeg: false,
    category: "Noodles",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 130,
  },
  {
    name: "Schezwan Noodles",
    originalPrice: 140,
    discountedPrice: 120,
    description:
      "Spicy Schezwan noodles stir-fried with vegetables and soy sauce.",
    images: [
      {
        url: "https://example.com/schezwannoodles1.jpg",
        filename: "schezwannoodles1.jpg",
      },
      {
        url: "https://example.com/schezwannoodles2.jpg",
        filename: "schezwannoodles2.jpg",
      },
    ],
    isVeg: true,
    category: "Noodles",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 125,
  },

  {
    name: "Chocolate Cake",
    originalPrice: 350,
    discountedPrice: 300,
    description:
      "Rich and moist chocolate cake layered with creamy chocolate frosting.",
    images: [
      {
        url: "https://example.com/chocolatecake1.jpg",
        filename: "chocolatecake1.jpg",
      },
      {
        url: "https://example.com/chocolatecake2.jpg",
        filename: "chocolatecake2.jpg",
      },
    ],
    isVeg: true,
    category: "Cakes",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 150,
  },
  {
    name: "Vanilla Cake",
    originalPrice: 300,
    discountedPrice: 250,
    description: "Fluffy vanilla cake with a light whipped cream topping.",
    images: [
      {
        url: "https://example.com/vanillacake1.jpg",
        filename: "vanillacake1.jpg",
      },
      {
        url: "https://example.com/vanillacake2.jpg",
        filename: "vanillacake2.jpg",
      },
    ],
    isVeg: true,
    category: "Cakes",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 140,
  },
  {
    name: "Red Velvet Cake",
    originalPrice: 380,
    discountedPrice: 330,
    description: "Luxurious red velvet cake with cream cheese frosting.",
    images: [
      {
        url: "https://example.com/redvelvetcake1.jpg",
        filename: "redvelvetcake1.jpg",
      },
      {
        url: "https://example.com/redvelvetcake2.jpg",
        filename: "redvelvetcake2.jpg",
      },
    ],
    isVeg: true,
    category: "Cakes",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.9,
    ratingsCount: 160,
  },
  {
    name: "Fruit Cake",
    originalPrice: 400,
    discountedPrice: 350,
    description:
      "Delicious cake topped with fresh seasonal fruits and a light syrup.",
    images: [
      { url: "https://example.com/fruitcake1.jpg", filename: "fruitcake1.jpg" },
      { url: "https://example.com/fruitcake2.jpg", filename: "fruitcake2.jpg" },
    ],
    isVeg: true,
    category: "Cakes",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 130,
  },
  {
    name: "Cheesecake",
    originalPrice: 420,
    discountedPrice: 370,
    description:
      "Creamy cheesecake with a buttery biscuit crust and topped with berries.",
    images: [
      {
        url: "https://example.com/cheesecake1.jpg",
        filename: "cheesecake1.jpg",
      },
      {
        url: "https://example.com/cheesecake2.jpg",
        filename: "cheesecake2.jpg",
      },
    ],
    isVeg: true,
    category: "Cakes",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 145,
  },

  {
    name: "Sweet and Sour Vegetables",
    originalPrice: 160,
    discountedPrice: 140,
    description: "Crispy vegetables in a tangy sweet and sour sauce.",
    images: [
      {
        url: "https://example.com/sweetandsourvegetables1.jpg",
        filename: "sweetandsourvegetables1.jpg",
      },
      {
        url: "https://example.com/sweetandsourvegetables2.jpg",
        filename: "sweetandsourvegetables2.jpg",
      },
    ],
    isVeg: true,
    category: "Chinese",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 110,
  },
  {
    name: "Chili Chicken",
    originalPrice: 180,
    discountedPrice: 150,
    description: "Spicy chili chicken with crispy batter and a tangy sauce.",
    images: [
      {
        url: "https://example.com/chilichicken1.jpg",
        filename: "chilichicken1.jpg",
      },
      {
        url: "https://example.com/chilichicken2.jpg",
        filename: "chilichicken2.jpg",
      },
    ],
    isVeg: false,
    category: "Chinese",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 120,
  },
  {
    name: "Spring Rolls",
    originalPrice: 140,
    discountedPrice: 120,
    description:
      "Crispy rolls filled with vegetables and served with a tangy sauce.",
    images: [
      {
        url: "https://example.com/springrolls1.jpg",
        filename: "springrolls1.jpg",
      },
      {
        url: "https://example.com/springrolls2.jpg",
        filename: "springrolls2.jpg",
      },
    ],
    isVeg: true,
    category: "Chinese",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 115,
  },
  {
    name: "Dim Sum",
    originalPrice: 200,
    discountedPrice: 170,
    description:
      "Delicate steamed dumplings filled with vegetables and spices.",
    images: [
      { url: "https://example.com/dimsum1.jpg", filename: "dimsum1.jpg" },
      { url: "https://example.com/dimsum2.jpg", filename: "dimsum2.jpg" },
    ],
    isVeg: true,
    category: "Chinese",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 130,
  },
  {
    name: "Fish in Black Bean Sauce",
    originalPrice: 250,
    discountedPrice: 220,
    description: "Tender fish cooked in a flavorful black bean sauce.",
    images: [
      {
        url: "https://example.com/fishblackbeansauce1.jpg",
        filename: "fishblackbeansauce1.jpg",
      },
      {
        url: "https://example.com/fishblackbeansauce2.jpg",
        filename: "fishblackbeansauce2.jpg",
      },
    ],
    isVeg: false,
    category: "Chinese",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.9,
    ratingsCount: 140,
  },

  {
    name: "Aloo Paratha",
    originalPrice: 100,
    discountedPrice: 90,
    description: "Soft flatbread stuffed with spiced mashed potatoes.",
    images: [
      {
        url: "https://example.com/alooparatha1.jpg",
        filename: "alooparatha1.jpg",
      },
      {
        url: "https://example.com/alooparatha2.jpg",
        filename: "alooparatha2.jpg",
      },
    ],
    isVeg: true,
    category: "Paratha",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 100,
  },
  {
    name: "Gobi Paratha",
    originalPrice: 110,
    discountedPrice: 95,
    description: "Soft flatbread stuffed with spiced cauliflower.",
    images: [
      {
        url: "https://example.com/gobiparatha1.jpg",
        filename: "gobiparatha1.jpg",
      },
      {
        url: "https://example.com/gobiparatha2.jpg",
        filename: "gobiparatha2.jpg",
      },
    ],
    isVeg: true,
    category: "Paratha",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 110,
  },
  {
    name: "Methi Paratha",
    originalPrice: 120,
    discountedPrice: 105,
    description: "A flatbread made with fenugreek leaves and spices.",
    images: [
      {
        url: "https://example.com/methiparatha1.jpg",
        filename: "methiparatha1.jpg",
      },
      {
        url: "https://example.com/methiparatha2.jpg",
        filename: "methiparatha2.jpg",
      },
    ],
    isVeg: true,
    category: "Paratha",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 105,
  },
  {
    name: "Paneer Paratha",
    originalPrice: 130,
    discountedPrice: 115,
    description: "A flatbread stuffed with spiced paneer filling.",
    images: [
      {
        url: "https://example.com/paneerparatha1.jpg",
        filename: "paneerparatha1.jpg",
      },
      {
        url: "https://example.com/paneerparatha2.jpg",
        filename: "paneerparatha2.jpg",
      },
    ],
    isVeg: true,
    category: "Paratha",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 120,
  },
  {
    name: "Keema Paratha",
    originalPrice: 150,
    discountedPrice: 135,
    description: "Paratha stuffed with spiced minced meat.",
    images: [
      {
        url: "https://example.com/keemaparatha1.jpg",
        filename: "keemaparatha1.jpg",
      },
      {
        url: "https://example.com/keemaparatha2.jpg",
        filename: "keemaparatha2.jpg",
      },
    ],
    isVeg: false,
    category: "Paratha",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 130,
  },

  {
    name: "Plain Dosa",
    originalPrice: 80,
    discountedPrice: 70,
    description: "Crispy rice crepes served with sambar and coconut chutney.",
    images: [
      { url: "https://example.com/plandosa1.jpg", filename: "plana_dosa1.jpg" },
      { url: "https://example.com/plandosa2.jpg", filename: "plana_dosa2.jpg" },
    ],
    isVeg: true,
    category: "Dosa",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.4,
    ratingsCount: 100,
  },
  {
    name: "Masala Dosa",
    originalPrice: 100,
    discountedPrice: 90,
    description: "Crispy dosa stuffed with a spiced potato filling.",
    images: [
      {
        url: "https://example.com/masaladosa1.jpg",
        filename: "masaladosa1.jpg",
      },
      {
        url: "https://example.com/masaladosa2.jpg",
        filename: "masaladosa2.jpg",
      },
    ],
    isVeg: true,
    category: "Dosa",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.6,
    ratingsCount: 120,
  },
  {
    name: "Rava Dosa",
    originalPrice: 110,
    discountedPrice: 95,
    description: "A crispy dosa made from semolina flour.",
    images: [
      { url: "https://example.com/ravadosa1.jpg", filename: "ravadosa1.jpg" },
      { url: "https://example.com/ravadosa2.jpg", filename: "ravadosa2.jpg" },
    ],
    isVeg: true,
    category: "Dosa",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.5,
    ratingsCount: 110,
  },
  {
    name: "Onion Dosa",
    originalPrice: 120,
    discountedPrice: 105,
    description: "Crispy dosa topped with onions and served with chutneys.",
    images: [
      { url: "https://example.com/oniondosa1.jpg", filename: "oniondosa1.jpg" },
      { url: "https://example.com/oniondosa2.jpg", filename: "oniondosa2.jpg" },
    ],
    isVeg: true,
    category: "Dosa",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.7,
    ratingsCount: 120,
  },
  {
    name: "Cheese Dosa",
    originalPrice: 130,
    discountedPrice: 115,
    description: "Crispy dosa stuffed with cheese and served with sambar.",
    images: [
      {
        url: "https://example.com/cheesedosa1.jpg",
        filename: "cheesedosa1.jpg",
      },
      {
        url: "https://example.com/cheesedosa2.jpg",
        filename: "cheesedosa2.jpg",
      },
    ],
    isVeg: true,
    category: "Dosa",
    owner: "67a361ab152df28eca9d695a",
    rating: 4.8,
    ratingsCount: 130,
  },
];

module.exports = {data:listings};
