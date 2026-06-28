require('./server/node_modules/dotenv').config({ path: './server/.env' });
const mongoose = require('./server/node_modules/mongoose');
const Category = require('./server/models/Category');
const Product = require('./server/models/Product');
const User = require('./server/models/User');

const categories = [
  { name: 'Fashion & Clothing' },
  { name: 'Accessories' },
  { name: 'Home & Living' },
  { name: 'Food & Beverages' },
  { name: 'Arts & Crafts' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Category.deleteMany();
  await Product.deleteMany();
  console.log('Cleared existing categories and products');

  // Insert categories
  const createdCategories = await Category.insertMany(categories);
  console.log(`Created ${createdCategories.length} categories`);

  const [fashion, accessories, home, food, arts] = createdCategories;

  // Insert products
  const products = [
    // Fashion & Clothing
    { name: 'Kitenge Print Dress', description: 'Beautiful African print dress made from high-quality Kitenge fabric. Perfect for any occasion.', price: 15000, stock: 25, category: fashion._id, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a7a?w=400' },
    { name: 'Men\'s Safari Shirt', description: 'Comfortable and stylish safari shirt, ideal for the Rwandan climate.', price: 12000, stock: 30, category: fashion._id, image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400' },
    { name: 'Traditional Imigongo Wrap Skirt', description: 'Elegant wrap skirt inspired by traditional Rwandan Imigongo patterns.', price: 18000, stock: 20, category: fashion._id, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
    { name: 'Children\'s African Print Set', description: 'Adorable matching top and shorts set for children, made from soft African print fabric.', price: 8000, stock: 40, category: fashion._id, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400' },

    // Accessories
    { name: 'Handwoven Agaseke Basket', description: 'Traditional Rwandan peace basket (Agaseke) handwoven by local artisans. A symbol of Rwandan culture.', price: 25000, stock: 15, category: accessories._id, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Beaded Necklace', description: 'Handmade beaded necklace crafted by Rwandan women cooperatives using colorful beads.', price: 6000, stock: 50, category: accessories._id, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400' },
    { name: 'Leather Sandals', description: 'Handcrafted genuine leather sandals, durable and comfortable for everyday wear.', price: 20000, stock: 22, category: accessories._id, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
    { name: 'Sisal Shoulder Bag', description: 'Eco-friendly shoulder bag woven from natural sisal fiber with colorful Rwandan patterns.', price: 14000, stock: 18, category: accessories._id, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },

    // Home & Living
    { name: 'Imigongo Wall Art', description: 'Authentic Rwandan Imigongo geometric wall art painted with natural colors. A unique home decor piece.', price: 35000, stock: 10, category: home._id, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400' },
    { name: 'Woven Table Runner', description: 'Hand-woven table runner with traditional Rwandan patterns, perfect for dining tables.', price: 9000, stock: 35, category: home._id, image: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=400' },
    { name: 'Wooden Serving Bowl', description: 'Hand-carved wooden serving bowl made from sustainable Rwandan hardwood.', price: 22000, stock: 12, category: home._id, image: 'https://images.unsplash.com/photo-1612965607446-25e1332775ae?w=400' },
    { name: 'Banana Leaf Placemats (Set of 4)', description: 'Eco-friendly placemats woven from dried banana leaves. Unique and sustainable.', price: 7000, stock: 28, category: home._id, image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=400' },

    // Food & Beverages
    { name: 'Rwanda Single Origin Coffee (500g)', description: 'Premium single-origin Rwandan coffee beans from the hills of the Western Province. Rich and aromatic.', price: 10000, stock: 60, category: food._id, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
    { name: 'Honey from Nyungwe (250ml)', description: 'Pure natural honey harvested from beehives near Nyungwe Forest. Raw and unfiltered.', price: 5000, stock: 45, category: food._id, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' },
    { name: 'Dried Chili Pepper Mix (100g)', description: 'A flavorful blend of dried Rwandan chili peppers. Perfect for cooking and seasoning.', price: 3000, stock: 80, category: food._id, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400' },
    { name: 'Roasted Macadamia Nuts (200g)', description: 'Freshly roasted macadamia nuts grown in the fertile soils of Rwanda. A healthy snack.', price: 8000, stock: 55, category: food._id, image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400' },

    // Arts & Crafts
    { name: 'Hand-Painted Calabash', description: 'Decorative calabash gourd hand-painted with traditional Rwandan motifs. Great as a gift.', price: 12000, stock: 20, category: arts._id, image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=400' },
    { name: 'Recycled Paper Journal', description: 'Eco-friendly journal made from recycled paper, bound with banana fiber. Made by local artisans.', price: 4500, stock: 40, category: arts._id, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400' },
    { name: 'Ceramic Coffee Mug', description: 'Hand-thrown ceramic mug painted with Rwandan landscape patterns. Microwave and dishwasher safe.', price: 6500, stock: 30, category: arts._id, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400' },
    { name: 'Woven Grass Coasters (Set of 6)', description: 'Set of six hand-woven grass coasters with colorful geometric designs. Functional and decorative.', price: 5000, stock: 50, category: arts._id, image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400' },
  ];

  await Product.insertMany(products);
  console.log(`Created ${products.length} products`);

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@rwandastyle.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@rwandastyle.com',
      password: 'Admin@1234',
      role: 'admin',
      phone: '0780000000',
    });
    console.log('Admin user created — email: admin@rwandastyle.com | password: Admin@1234');
  }

  console.log('Seed complete!');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
