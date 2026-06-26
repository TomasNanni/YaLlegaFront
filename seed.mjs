process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API = 'https://localhost:7287/api';

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const json = Buffer.from(base64, 'base64').toString('utf-8');
  return JSON.parse(json);
}


async function login(email, password) {
  const res = await fetch(`${API}/Authentication/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ EmailAddress: email, Password: password }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  return await res.text();
}

async function getRestaurantCategories(restaurantId) {
  const res = await fetch(`${API}/category/GetRestaurantCategories/${restaurantId}`);
  if (!res.ok) return [];
  return await res.json();
}

async function deleteCategory(token, id) {
  await fetch(`${API}/category/Delete/${id}`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  });
}

async function createCategory(token, name, description, restaurantUserId, productsId = []) {
  const res = await fetch(`${API}/category/Create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ name, description, RestaurantUserId: restaurantUserId, productsId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create category "${name}" failed (${res.status}): ${text}`);
  }
  const cat = await res.json();
  console.log(`  Categoría creada: "${cat.name}" (id: ${cat.id})`);
  return cat;
}

async function createProduct(token, product) {
  const res = await fetch(`${API}/products/Create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create product "${product.name}" failed (${res.status}): ${text}`);
  }
  const prod = await res.json();
  console.log(`    Producto creado: "${prod.name}" (id: ${prod.id}) - $${prod.basePrice}`);
  return prod;
}

const seedData = [
  {
    email: 'maria.gonzalez@example.com',
    password: 'pass1234',
    categories: [
      {
        name: 'Carnes',
        description: 'Los mejores cortes de carne a las brasas',
        products: [
          { name: 'Bife de Chorizo', description: 'Corte clásico argentino de 400g, jugoso y tierno', urlImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', basePrice: 12500, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Asado de Tira', description: 'Costillas de res a la parrilla con chimichurri', urlImage: 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=400&h=300&fit=crop', basePrice: 10800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Vacío', description: 'Corte de vacío a punto, acompañado con papas rústicas', urlImage: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop', basePrice: 11500, discount: 10, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Entraña', description: 'Entraña a la parrilla con salsa criolla', urlImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', basePrice: 11000, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Matambre a la Pizza', description: 'Matambre con mozzarella, tomate y orégano', urlImage: 'https://images.unsplash.com/photo-1432139509613-5c4255a1d754?w=400&h=300&fit=crop', basePrice: 9800, discount: 15, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Pollo a la Parrilla', description: 'Medio pollo marinado a las brasas', urlImage: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop', basePrice: 7500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
        ],
      },
      {
        name: 'Ensaladas',
        description: 'Acompañamientos frescos para tu parrilla',
        products: [
          { name: 'Ensalada Mixta', description: 'Lechuga, tomate, cebolla y zanahoria', urlImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', basePrice: 3500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Ensalada César', description: 'Lechuga romana, crutones, parmesano y aderezo césar', urlImage: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop', basePrice: 4800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Papas Fritas', description: 'Papas fritas crocantes con sal marina', urlImage: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', basePrice: 3200, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Provoleta', description: 'Provolone fundido con orégano y aceite de oliva', urlImage: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop', basePrice: 5200, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
        ],
      },
      {
        name: 'Bebidas',
        description: 'Para acompañar tu comida',
        products: [
          { name: 'Malbec Mendoza', description: 'Vino tinto Malbec de Bodega Norton, 750ml', urlImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop', basePrice: 8500, discount: 0, isStandout: true, happyHourStart: '18:00', happyHourEnd: '20:00' },
          { name: 'Cerveza Artesanal IPA', description: 'Pinta de IPA artesanal de 500ml', urlImage: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop', basePrice: 3500, discount: 0, isStandout: false, happyHourStart: '18:00', happyHourEnd: '20:00' },
          { name: 'Agua Mineral', description: 'Agua mineral con o sin gas, 500ml', urlImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop', basePrice: 1500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Limonada Casera', description: 'Limonada fresca con menta y jengibre', urlImage: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop', basePrice: 2800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Fernet con Cola', description: 'Fernet Branca con Coca-Cola', urlImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop', basePrice: 4000, discount: 20, isStandout: false, happyHourStart: '22:00', happyHourEnd: '23:00' },
        ],
      },
    ],
  },
  {
    email: 'juan.martinez@example.com',
    password: 'pass1234',
    categories: [
      {
        name: 'Pizzas',
        description: 'Pizzas artesanales al horno de leña',
        products: [
          { name: 'Margherita', description: 'Salsa de tomate San Marzano, mozzarella fior di latte y albahaca fresca', urlImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', basePrice: 7800, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Napolitana', description: 'Tomate, mozzarella, anchoas, aceitunas y orégano', urlImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', basePrice: 8500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmesano y fontina', urlImage: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=400&h=300&fit=crop', basePrice: 9200, discount: 10, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Prosciutto e Rúcula', description: 'Jamón crudo, rúcula, parmesano y aceite de oliva', urlImage: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop', basePrice: 9800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Diavola', description: 'Salame picante, mozzarella, tomate y chile', urlImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', basePrice: 8800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Fugazzeta', description: 'Doble masa rellena de mozzarella con cebolla caramelizada', urlImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', basePrice: 8200, discount: 15, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Calzone', description: 'Masa rellena de ricota, jamón, mozzarella y salsa', urlImage: 'https://images.unsplash.com/photo-1536964549204-cce9eab227bd?w=400&h=300&fit=crop', basePrice: 7500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Pizza Vegetariana', description: 'Morrones, champiñones, aceitunas, cebolla y tomate', urlImage: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&h=300&fit=crop', basePrice: 7800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
        ],
      },
      {
        name: 'Pastas',
        description: 'Pastas caseras hechas con amor',
        products: [
          { name: 'Ravioles de Ricota', description: 'Ravioles caseros rellenos de ricota y espinaca con salsa filetto', urlImage: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?w=400&h=300&fit=crop', basePrice: 7200, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Ñoquis de Papa', description: 'Ñoquis caseros con salsa bolognesa o pesto', urlImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop', basePrice: 6500, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Spaghetti Carbonara', description: 'Spaghetti con panceta, huevo, pecorino y pimienta negra', urlImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop', basePrice: 7800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Lasagna Bolognesa', description: 'Capas de pasta, ragú bolognés, bechamel y parmesano', urlImage: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', basePrice: 8500, discount: 10, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Tallarines al Pesto', description: 'Tallarines frescos con pesto genovés y piñones', urlImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop', basePrice: 7000, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
        ],
      },
      {
        name: 'Postres',
        description: 'Para terminar tu comida con algo dulce',
        products: [
          { name: 'Tiramisú', description: 'Tiramisú clásico con café espresso y mascarpone', urlImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', basePrice: 4500, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Panna Cotta', description: 'Panna cotta de vainilla con coulis de frutos rojos', urlImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', basePrice: 3800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Gelato Artesanal', description: 'Tres bochas de helado artesanal a elección', urlImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop', basePrice: 3200, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Coca-Cola', description: 'Coca-Cola de 500ml', urlImage: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop', basePrice: 1800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Birra Italiana', description: 'Cerveza Peroni Nastro Azzurro, 330ml', urlImage: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop', basePrice: 3500, discount: 0, isStandout: false, happyHourStart: '19:00', happyHourEnd: '21:00' },
        ],
      },
    ],
  },
  {
    email: 'ana.fernandez@example.com',
    password: 'pass1234',
    categories: [
      {
        name: 'Rolls Especiales',
        description: 'Nuestros rolls más creativos y populares',
        products: [
          { name: 'Philadelphia Roll', description: 'Salmón, queso crema y palta, 10 piezas', urlImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', basePrice: 6800, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Tempura Roll', description: 'Langostinos en tempura, palta y salsa teriyaki, 10 piezas', urlImage: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop', basePrice: 8200, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Dragon Roll', description: 'Langostino, palta, sésamo y salsa unagi, 10 piezas', urlImage: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop', basePrice: 9500, discount: 10, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Sake Roll', description: 'Salmón fresco, pepino y sésamo, 8 piezas', urlImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop', basePrice: 5800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Veggie Roll', description: 'Palta, pepino, zanahoria y tofu, 8 piezas', urlImage: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=400&h=300&fit=crop', basePrice: 5200, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Rainbow Roll', description: 'California roll cubierto con sashimi variado, 10 piezas', urlImage: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop', basePrice: 10500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
        ],
      },
      {
        name: 'Clásicos',
        description: 'Platos tradicionales de la cocina japonesa',
        products: [
          { name: 'Nigiri Mixto', description: 'Selección de 8 nigiris: salmón, atún, langostino y pulpo', urlImage: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop', basePrice: 8800, discount: 0, isStandout: true, happyHourStart: null, happyHourEnd: null},
          { name: 'Sashimi de Salmón', description: '10 láminas de salmón fresco con wasabi y jengibre', urlImage: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop', basePrice: 7500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Ramen Tonkotsu', description: 'Caldo de cerdo, fideos, huevo marinado, chashu y nori', urlImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', basePrice: 7200, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Gyozas', description: '6 empanadillas japonesas de cerdo y verduras', urlImage: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop', basePrice: 4500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Edamame', description: 'Vainas de soja al vapor con sal marina', urlImage: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=300&fit=crop', basePrice: 2800, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
        ],
      },
      {
        name: 'Bebidas Zen',
        description: 'Bebidas para acompañar tu experiencia',
        products: [
          { name: 'Sake Caliente', description: 'Sake tradicional servido caliente, 180ml', urlImage: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop', basePrice: 4500, discount: 0, isStandout: true, happyHourStart: '18:00', happyHourEnd: '20:00' },
          { name: 'Té Verde Matcha', description: 'Té matcha ceremonial preparado al momento', urlImage: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop', basePrice: 2500, discount: 0, isStandout: false, happyHourStart: null, happyHourEnd: null},
          { name: 'Cerveza Asahi', description: 'Cerveza japonesa Asahi Super Dry, 330ml', urlImage: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop', basePrice: 3800, discount: 0, isStandout: false, happyHourStart: '18:00', happyHourEnd: '20:00' },
          { name: 'Limonada de Yuzu', description: 'Limonada refrescante con cítrico yuzu japonés', urlImage: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop', basePrice: 3200, discount: 15, isStandout: false, happyHourStart: null, happyHourEnd: null},
        ],
      },
    ],
  },
];

async function seed() {
  console.log('=== Iniciando seed de datos ===\n');

  for (const data of seedData) {
    console.log(`\nLogueando como ${data.email}...`);
    const token = await login(data.email, data.password);
    const claims = decodeToken(token);
    const restaurantId = parseInt(claims['nameid'] || claims['sub']);
    console.log(`  Restaurant ID: ${restaurantId}`);

    const existingCats = await getRestaurantCategories(restaurantId);
    if (existingCats.length > 0) {
      console.log(`  Borrando ${existingCats.length} categorías existentes...`);
      for (const cat of existingCats) {
        await deleteCategory(token, cat.id);
        console.log(`    Borrada: "${cat.name}" (id: ${cat.id})`);
      }
    }

    for (const catData of data.categories) {
      const productIds = [];
      for (const prodData of catData.products) {
        const prod = await createProduct(token, {
          ...prodData,
          categoriesId: [],
        });
        productIds.push(prod.id);
      }
      await createCategory(token, catData.name, catData.description, restaurantId, productIds);
    }

    console.log(`✓ ${data.email} completado\n`);
  }

  console.log('\n=== Seed completado exitosamente ===');
  console.log('3 restaurantes, 9 categorías, y todos sus productos fueron creados.');
}

seed().catch((err) => {
  console.error('\n✗ Error durante el seed:', err.message);
  process.exit(1);
});
