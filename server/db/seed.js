require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const db = require('../db');

const ADMIN_EMAIL = 'ronnexronnie@gmail.com';
const UNSPLASH_API = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const products = [
  // ── Electronics (12) ──
  { title: 'iPhone 15 Pro Max 256GB', description: 'Latest Apple flagship with A17 Pro chip. Titanium design, 48MP camera system with 5x optical zoom. All-day battery life.', price: 4500000, category: 'electronics', condition: 'New', location: 'Kampala', imgQuery: 'iphone 15 pro max' },
  { title: 'Samsung Galaxy S24 Ultra 512GB', description: 'Samsung premium flagship with built-in S Pen. 200MP camera, Galaxy AI features, stunning Dynamic AMOLED display.', price: 3800000, category: 'electronics', condition: 'New', location: 'Kampala', imgQuery: 'samsung galaxy s24 ultra' },
  { title: 'MacBook Air M3 15-inch', description: 'Apple lightweight laptop powered by M3 chip. 18-hour battery life, brilliant Retina display, silent fanless design.', price: 5200000, category: 'electronics', condition: 'New', location: 'Kampala', imgQuery: 'macbook air' },
  { title: 'Dell XPS 15 Intel i9', description: 'Premium Windows ultrabook with InfinityEdge display. Intel i9 processor, 32GB RAM, NVIDIA RTX graphics.', price: 4800000, category: 'electronics', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'dell xps laptop' },
  { title: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life, crystal-clear hands-free calling.', price: 450000, category: 'electronics', condition: 'New', location: 'Jinja', imgQuery: 'sony headphones' },
  { title: 'AirPods Pro 2nd Gen USB-C', description: 'Apple adaptive audio with active noise cancellation. Personalized Spatial Audio, up to 6 hours listening time.', price: 320000, category: 'electronics', condition: 'New', location: 'Kampala', imgQuery: 'airpods pro' },
  { title: 'iPad Air M2 11-inch', description: 'Apple tablet with M2 chip, Liquid Retina display. Perfect for creative work, note-taking, and entertainment.', price: 2900000, category: 'electronics', condition: 'New', location: 'Entebbe', imgQuery: 'ipad air' },
  { title: 'Canon EOS R50 Mirrorless', description: 'Entry-level mirrorless camera with 24.2MP APS-C sensor. 4K video, advanced subject tracking, compact design.', price: 2100000, category: 'electronics', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'canon r50 camera' },
  { title: 'Sony PlayStation 5 Slim', description: 'Next-gen gaming console with ultra-fast SSD. Supports 4K gaming, ray tracing, and haptic feedback controller.', price: 1800000, category: 'electronics', condition: 'New', location: 'Kampala', imgQuery: 'playstation 5 console' },
  { title: 'JBL Flip 6 Bluetooth Speaker', description: 'Portable waterproof speaker with bold JBL Original Pro Sound. 12-hour battery life, IP67 waterproof.', price: 180000, category: 'electronics', condition: 'New', location: 'Jinja', imgQuery: 'jbl flip speaker' },
  { title: 'Samsung Galaxy Watch 6 Classic', description: 'Premium smartwatch with rotating bezel. Body composition analysis, sleep tracking, ECG, and Wear OS.', price: 750000, category: 'electronics', condition: 'New', location: 'Kampala', imgQuery: 'samsung smartwatch' },
  { title: 'Amazon Kindle Paperwhite 2024', description: 'Waterproof e-reader with 6.8" glare-free display. Weeks of battery life, adjustable warm light, 16GB storage.', price: 280000, category: 'electronics', condition: 'New', location: 'Entebbe', imgQuery: 'kindle e reader' },

  // ── Fashion (10) ──
  { title: 'Nike Air Max 270 React', description: 'Comfortable lifestyle sneakers with Max Air unit and React foam. Breathable mesh upper with iconic design.', price: 220000, category: 'fashion', condition: 'New with box', location: 'Kampala', imgQuery: 'nike sneakers' },
  { title: 'Premium Leather Handbag', description: 'Genuine Italian leather tote bag with gold hardware. Spacious interior with zip closure and adjustable strap.', price: 350000, category: 'fashion', condition: 'New with tags', location: 'Kampala', imgQuery: 'leather handbag' },
  { title: 'Ray-Ban Aviator Classic', description: 'Timeless sunglasses with teardrop shape and metal frame. Green G-15 lenses provide 100% UV protection.', price: 180000, category: 'fashion', condition: 'New', location: 'Kampala', imgQuery: 'aviator sunglasses' },
  { title: 'Rolex Submariner Date 2024', description: 'Luxury dive watch in Oystersteel with Cerachrom bezel. 300m water resistance, Superlative Chronometer certified.', price: 35000000, category: 'fashion', condition: 'New', location: 'Kampala', imgQuery: 'rolex watch' },
  { title: 'Levi\'s Trucker Denim Jacket', description: 'Classic blue trucker jacket in 100% cotton denim. Button front, two chest pockets, adjustable waist tabs.', price: 120000, category: 'fashion', condition: 'Used - Like New', location: 'Jinja', imgQuery: 'denim jacket' },
  { title: 'Adidas Ultraboost Light', description: 'Ultra-comfortable running shoes with Light BOOST midsole. Continental rubber outsole, Primeknit upper.', price: 250000, category: 'fashion', condition: 'New', location: 'Kampala', imgQuery: 'adidas running shoes' },
  { title: 'Michael Kors Jet Set Tote', description: 'Signature logo-print saffiano leather tote with top zip closure. Perfect everyday bag with multiple compartments.', price: 450000, category: 'fashion', condition: 'New with tags', location: 'Entebbe', imgQuery: 'designer tote bag' },
  { title: 'Diesel Men\'s Chronograph Watch', description: 'Stainless steel chronograph with bold design. Quartz movement, date display, 100m water resistance.', price: 280000, category: 'fashion', condition: 'New', location: 'Kampala', imgQuery: 'diesel watch' },
  { title: 'Versace Oversized Sunglasses', description: 'Statement round-frame sunglasses in gold-tone metal. Medusa emblem at temples, gradient blue lenses.', price: 350000, category: 'fashion', condition: 'New', location: 'Kampala', imgQuery: 'designer sunglasses' },
  { title: 'Puma Essentials Hoodie', description: 'Cotton-blend pullover hoodie with adjustable drawstring hood. Kangaroo pocket, ribbed cuffs and hem.', price: 85000, category: 'fashion', condition: 'New with tags', location: 'Gulu', imgQuery: 'hoodie clothing' },

  // ── Home & Furniture (10) ──
  { title: 'L-shaped Sectional Sofa', description: 'Large fabric L-shaped sofa with reversible chaise. Plush cushion filling, removable covers, seats up to 6.', price: 3500000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'sectional sofa' },
  { title: 'Solid Oak 6-Seater Dining Table', description: 'Handcrafted oak dining table with natural finish. Seats 6 comfortably, sturdy construction, matching chairs available.', price: 2800000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'dining table' },
  { title: 'Queen Size Bed Frame Upholstered', description: 'Elegant upholstered bed frame with tufted headboard. Wood slat support system, no box spring needed.', price: 2100000, category: 'home', condition: 'New', location: 'Jinja', imgQuery: 'bed frame' },
  { title: 'Modern Arc Floor Lamp', description: 'Minimalist arc floor lamp with marble base. Brushed brass finish, off-white linen shade, dimmable LED compatible.', price: 350000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'floor lamp' },
  { title: 'Marble Coffee Table', description: 'Contemporary coffee table with white marble top and gold metal legs. Oval shape, 120cm length, easy assembly.', price: 850000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'coffee table' },
  { title: '5-Tier Bookshelf Industrial', description: 'Rustic industrial bookshelf with metal frame and wooden shelves. 5 tiers, holds up to 50kg, wall anchor included.', price: 420000, category: 'home', condition: 'New', location: 'Entebbe', imgQuery: 'bookshelf' },
  { title: 'Premium Wool Area Rug', description: 'Handwoven wool rug with geometric pattern. Soft texture, stain-resistant, suitable for living room or bedroom.', price: 650000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'area rug' },
  { title: 'Ergonomic Office Chair', description: 'Mesh back office chair with lumbar support. Adjustable height, armrests, tilt lock, 150kg weight capacity.', price: 550000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'office chair' },
  { title: 'Wooden Nightstand Set of 2', description: 'Solid mango wood nightstands with carved drawer fronts. Natural finish, compact size fits small spaces.', price: 380000, category: 'home', condition: 'New', location: 'Jinja', imgQuery: 'nightstand' },
  { title: 'Large Wall Mirror with Frame', description: 'Rectangular wall mirror with ornate gold frame. 90x120cm, ready to hang with D-rings and hooks included.', price: 450000, category: 'home', condition: 'New', location: 'Kampala', imgQuery: 'wall mirror' },

  // ── Cars (6 existing + 6 new = 12) ──
  { title: 'Toyota Vitz 2018 Model', description: 'Fuel-efficient compact hatchback with automatic transmission. Clean interior, AC, low mileage, well-maintained service history.', price: 18500000, category: 'cars', condition: 'Used - Good', location: 'Kampala', imgQuery: 'toyota vitz' },
  { title: 'Honda Fit 2020 Hybrid', description: 'Hybrid hatchback with excellent fuel economy. Sporty design, spacious interior, reversing camera, low mileage.', price: 22000000, category: 'cars', condition: 'Used - Good', location: 'Kampala', imgQuery: 'honda fit' },
  { title: 'Bajaj Boxer 150cc Motorcycle', description: 'Reliable and fuel-efficient commuter motorcycle. 150cc engine, electric start, sturdy build, perfect for boda boda.', price: 3200000, category: 'cars', condition: 'New', location: 'Kampala', imgQuery: 'motorcycle' },
  { title: 'Yamaha MT-15 2023', description: 'Streetfighter motorcycle with aggressive styling. 155cc liquid-cooled engine, LED lighting, lightweight chassis.', price: 6500000, category: 'cars', condition: 'New', location: 'Jinja', imgQuery: 'yamaha motorcycle' },
  { title: 'Hero Mountain Bike 21-Speed', description: 'Dual suspension mountain bike with 21-speed Shimano gears. Disc brakes, alloy frame, suitable for trails.', price: 450000, category: 'cars', condition: 'New', location: 'Entebbe', imgQuery: 'mountain bike' },
  { title: 'Electric Scooter 500W', description: 'Foldable electric scooter with 500W motor. 45km range, 25km/h top speed, LED display, regenerative braking.', price: 1800000, category: 'cars', condition: 'New', location: 'Kampala', imgQuery: 'electric scooter' },
  { title: 'Toyota Land Cruiser V8 2021', description: 'Luxury off-road SUV with V8 diesel engine. Leather interior, dual AC, diff lock, 7 seats, excellent condition.', price: 95000000, category: 'cars', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'toyota land cruiser' },
  { title: 'Nissan Note 2019 E-Power', description: 'Hybrid compact hatchback with e-Power drive system. Extremely fuel efficient, automatic, spacious interior.', price: 16000000, category: 'cars', condition: 'Used - Good', location: 'Kampala', imgQuery: 'nissan note' },
  { title: 'BMW 3 Series 2020 Sedan', description: 'Premium German sedan with 2.0L turbo engine. Sport seats, sunroof, navigation, 50k km mileage.', price: 42000000, category: 'cars', condition: 'Used - Good', location: 'Kampala', imgQuery: 'bmw 3 series' },
  { title: 'Suzuki Swift 2022 GL', description: 'Fun compact hatchback with 1.2L engine. Low mileage, fuel efficient, perfect city car, manual transmission.', price: 18000000, category: 'cars', condition: 'Used - Like New', location: 'Jinja', imgQuery: 'suzuki swift' },
  { title: 'Mercedes-Benz C200 2019', description: 'Elegant executive sedan with AMG kit. 1.5L turbo, premium sound system, leather seats, 40k km.', price: 48000000, category: 'cars', condition: 'Used - Good', location: 'Kampala', imgQuery: 'mercedes c class' },
  { title: 'Bajaj Tuk-Tuk 3-Wheeler', description: 'Popular passenger tuk-tuk with 200cc engine. Perfect for transport business, well maintained, valid permits.', price: 8500000, category: 'cars', condition: 'Used - Good', location: 'Kampala', imgQuery: 'tuk tuk' },

  // ── Property (6) ──
  { title: '2-Bedroom Apartment Bugolobi', description: 'Modern second-floor apartment with city views. Open-plan living, fitted kitchen, balcony, parking, 24hr security.', price: 350000000, category: 'property', condition: 'New', location: 'Kampala', imgQuery: 'modern apartment' },
  { title: 'Land for Sale Najjera', description: 'Prime residential plot measuring 50x100ft. Ready for construction, surveyed, title deed available.', price: 80000000, category: 'property', condition: 'Available', location: 'Kampala', imgQuery: 'land property' },
  { title: 'Shop Space Jinja Road', description: 'High-traffic retail shop in commercial area. 20x30ft with mezzanine, glass front, fitted with AC.', price: 5000000, category: 'property', condition: 'Available', location: 'Kampala', imgQuery: 'retail shop' },
  { title: 'Office Space Kololo', description: 'Class A office space on ground floor. Open plan, conference room, kitchen, parking for 4 cars.', price: 12000000, category: 'property', condition: 'Available', location: 'Kampala', imgQuery: 'office space' },
  { title: '3-Bedroom House Muyenga', description: 'Detached bungalow with garden. Master ensuite, walking closet, modern kitchen, carport, staff quarters.', price: 250000000, category: 'property', condition: 'New', location: 'Kampala', imgQuery: 'house garden' },
  { title: 'Warehouse Namanve Industrial', description: 'Spacious warehouse with loading bay. 5,000 sqft, high ceiling, 3-phase power, 24hr security, truck access.', price: 15000000, category: 'property', condition: 'Available', location: 'Kampala', imgQuery: 'warehouse' },

  // ── Hobbies (6) ──
  { title: 'Fender Stratocaster Electric Guitar', description: 'Iconic American electric guitar with rosewood fretboard. Maple neck, 3 single-coil pickups, includes hard case.', price: 3200000, category: 'hobbies', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'fender guitar' },
  { title: 'Pioneer DJ Controller DDJ-400', description: 'Professional 2-channel DJ controller with rekordbox. Perfect for beginners and mobile DJs, USB powered.', price: 1200000, category: 'hobbies', condition: 'New', location: 'Jinja', imgQuery: 'dj controller' },
  { title: 'Professional Oil Painting Set', description: 'Complete oil painting kit with 48 colors. Includes brushes, canvases, easel, palette, and instructional guide.', price: 250000, category: 'hobbies', condition: 'New', location: 'Kampala', imgQuery: 'oil painting' },
  { title: 'Celestron Telescope 130EQ', description: 'Powerful reflector telescope with 130mm aperture. Motorized mount, smartphone adapter, perfect for stargazing.', price: 850000, category: 'hobbies', condition: 'New', location: 'Entebbe', imgQuery: 'telescope' },
  { title: 'Premium Board Game Collection', description: '10 award-winning board games including Catan, Carcassonne, Ticket to Ride, Pandemic, and Azul. Family fun.', price: 350000, category: 'hobbies', condition: 'New', location: 'Kampala', imgQuery: 'board games' },
  { title: 'Photography Drone Kit', description: 'Beginner-friendly drone with 1080P camera. Altitude hold, gesture control, 25-min flight, includes extra batteries.', price: 450000, category: 'hobbies', condition: 'New', location: 'Gulu', imgQuery: 'drone' },

  // ── Books (6) ──
  { title: 'Python Crash Course 3rd Edition', description: 'Best-selling programming book covering Python basics to projects. Perfect for beginners and self-taught developers.', price: 85000, category: 'books', condition: 'New', location: 'Kampala', imgQuery: 'python book' },
  { title: 'Business Ethics Textbook University', description: 'Comprehensive business ethics textbook used in Ugandan universities. Latest edition, like new condition.', price: 65000, category: 'books', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'business textbook' },
  { title: 'A History of Uganda Since Independence', description: 'Detailed historical account of Uganda from 1962 to present. Essential reading for students and history enthusiasts.', price: 55000, category: 'books', condition: 'New', location: 'Jinja', imgQuery: 'history book' },
  { title: 'Children\'s Storybook Set 10-Pack', description: 'Colorful illustrated storybooks for ages 3-8. Includes fairy tales, African folktales, and educational stories.', price: 75000, category: 'books', condition: 'New', location: 'Kampala', imgQuery: 'children books' },
  { title: 'African Literature Collection Set', description: 'Set of 5 classic African novels including Things Fall Apart, Weep Not Child, and The River Between. Timeless.', price: 95000, category: 'books', condition: 'New', location: 'Entebbe', imgQuery: 'african literature' },
  { title: 'Economics for East Africa Textbook', description: 'Complete A-Level and university economics textbook covering East African context. Includes practice questions.', price: 70000, category: 'books', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'economics textbook' },

  // ── Sports (6) ──
  { title: 'Home Gym Bench & Weights Set', description: 'Adjustable weight bench with 50kg weight set. Incline/decline positions, includes barbell and dumbbells.', price: 850000, category: 'sports', condition: 'New', location: 'Kampala', imgQuery: 'gym weights' },
  { title: 'Treadmill 2HP Folding', description: 'Motorized folding treadmill with 2HP motor. 12 preset programs, heart rate monitor, 120kg capacity.', price: 2200000, category: 'sports', condition: 'New', location: 'Kampala', imgQuery: 'treadmill' },
  { title: 'Premium Yoga Mat Set', description: 'Extra thick eco-friendly yoga mat with carrying strap. Includes 2 yoga blocks and resistance bands, non-slip surface.', price: 85000, category: 'sports', condition: 'New', location: 'Jinja', imgQuery: 'yoga mat' },
  { title: '4-Person Camping Tent', description: 'Waterproof family tent with 3-season rating. Easy pop-up setup, mesh windows, rainfly, carry bag included.', price: 320000, category: 'sports', condition: 'New', location: 'Kampala', imgQuery: 'camping tent' },
  { title: 'Official Size 5 Football', description: 'FIFA-approved match ball with stitched PU casing. Butyl bladder for air retention, suitable for all surfaces.', price: 55000, category: 'sports', condition: 'New', location: 'Gulu', imgQuery: 'soccer ball' },
  { title: 'Fishing Rod & Reel Combo', description: '6.6ft carbon fiber fishing rod with spinning reel. Ball bearings, smooth drag, includes tackle box.', price: 150000, category: 'sports', condition: 'New', location: 'Entebbe', imgQuery: 'fishing rod' },

  // ── Other (8) ──
  { title: 'Fender Acoustic Guitar', description: 'Full-size dreadnought acoustic guitar with spruce top. Rich warm tone, steel strings, includes padded gig bag.', price: 450000, category: 'other', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'acoustic guitar' },
  { title: 'Nikon D5600 DSLR Bundle', description: '24.2MP DSLR with 18-55mm lens kit. 3.2" vari-angle touchscreen, SnapBridge connectivity, full HD video.', price: 1900000, category: 'other', condition: 'Used - Good', location: 'Kampala', imgQuery: 'dslr camera bundle' },
  { title: 'Coffee Table Art Book Collection', description: 'Set of 5 premium art books covering photography, architecture, and modern art. Hardcover, large format.', price: 180000, category: 'other', condition: 'New', location: 'Kampala', imgQuery: 'art books' },
  { title: 'Catan Board Game Collection', description: 'Complete Catan base game plus 2 expansions. Strategy board game for 3-6 players, award-winning gameplay.', price: 95000, category: 'other', condition: 'Used - Like New', location: 'Jinja', imgQuery: 'board game' },
  { title: 'Mechanical Gaming Keyboard RGB', description: 'Full-size mechanical keyboard with Cherry MX Blue switches. Per-key RGB lighting, aluminum frame, detachable USB-C.', price: 210000, category: 'other', condition: 'New', location: 'Kampala', imgQuery: 'gaming keyboard' },
  { title: 'DJI Mini 4 Pro Drone Fly More', description: 'Ultra-light foldable drone with 4K/60fps HDR video. Obstacle sensing, 34-min flight time, RC 2 controller included.', price: 3800000, category: 'other', condition: 'New', location: 'Entebbe', imgQuery: 'dji drone' },
  { title: 'Vintage Vinyl Record Collection', description: 'Set of 20 classic vinyl records from the 70s and 80s. Includes Beatles, Michael Jackson, Queen, and more. Mint condition.', price: 350000, category: 'other', condition: 'Used - Like New', location: 'Kampala', imgQuery: 'vinyl records' },
  { title: 'Handmade African Crafts Bundle', description: 'Collection of authentic Ugandan crafts including barkcloth, baskets, jewelry, and wooden sculptures. Unique gifts.', price: 150000, category: 'other', condition: 'New', location: 'Entebbe', imgQuery: 'african crafts' },
];

const cache = {};

async function searchUnsplash(query, perPage = 30) {
  if (cache[query]) return cache[query];
  const url = `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=squarish`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${res.statusText}`);
  const data = await res.json();
  const urls = data.results.map(p => `${p.urls.raw}&w=400&h=400&fit=crop&auto=format`);
  cache[query] = urls;
  return urls;
}

async function getPhotos(imgQuery, title) {
  let pool = [];
  try {
    pool = await searchUnsplash(imgQuery);
    if (pool.length >= 5) return pool.slice(0, 5);
  } catch {}
  try {
    pool = await searchUnsplash(imgQuery.split(' ').slice(-1)[0]);
    if (pool.length >= 5) return pool.slice(0, 5);
  } catch {}
  return Array.from({ length: 5 }, (_, i) =>
    `https://picsum.photos/seed/${encodeURIComponent(title + i)}/400/400`
  );
}

async function seed() {
  const start = Date.now();

  const user = await db.query('SELECT id FROM users WHERE email=$1', [ADMIN_EMAIL]);
  if (user.rows.length === 0) {
    console.error('Admin user not found. Run migration or register first.');
    process.exit(1);
  }
  const userId = user.rows[0].id;
  console.log(`Using admin user ID: ${userId}`);

  const failed = [];
  let totalInserted = 0;

  for (const p of products) {
    try {
      const photos = await getPhotos(p.imgQuery, p.title);

      await db.query(
         `INSERT INTO listings (user_id, title, description, price, category, condition, location, photos, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')`,
        [userId, p.title, p.description, p.price, p.category, p.condition, p.location, photos]
      );
      totalInserted++;
      process.stdout.write('.');
    } catch (err) {
      failed.push({ title: p.title, error: err.message });
      process.stdout.write('x');
    }
  }

  console.log(`\n\nSeed complete in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  console.log(`Inserted: ${totalInserted}/${products.length}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length}`);
    failed.forEach(f => console.log(`  - ${f.title}: ${f.error}`));
  }

  db.end().then(() => process.exit(0));
}

seed();
