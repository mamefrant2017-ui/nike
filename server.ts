import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_PRODUCTS, SPECIAL_OFFERS } from "./src/data";
import { Product, Order, Notification, Review } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to durable local database
const DB_FILE = path.join(process.cwd(), "database.json");

// Define state interface
interface DBState {
  products: Product[];
  orders: Order[];
  notifications: Notification[];
}

// Load or initialize DB state
let state: DBState = {
  products: INITIAL_PRODUCTS,
  orders: [],
  notifications: [
    {
      id: "n-welcome",
      title: "Welcome to SneakerHub!",
      message: "Discover exclusive drops, premium running retros, and personalized AI recommendations.",
      time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      read: false,
      type: "system"
    },
    {
      id: "n-offer",
      title: "Get 20% Off Your First Pair",
      message: "Unlock your summer run. Use promo code SNEAKERHUB20 during checkout.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      type: "offer"
    }
  ]
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      // Gracefully merge default products or structural fields
      state.products = parsed.products || INITIAL_PRODUCTS;
      state.orders = parsed.orders || [];
      state.notifications = parsed.notifications || state.notifications;
      console.log("Database successfully loaded from database.json");
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error("Failed to load database.json, using defaults.", err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to database.json", err);
  }
}

loadDatabase();

// -------------------------------------------------------------
// Initialize Gemini SDK with recommended pattern
// -------------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log("Gemini AI SDK successfully loaded with provided API key.");
} else {
  console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to rule-based mock advisor response.");
}

// -------------------------------------------------------------
// Server REST API Endpoints
// -------------------------------------------------------------

// Active checking header
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConnected: !!ai });
});

// GET manifest.json for PWA installation support
app.get("/manifest.json", (req, res) => {
  res.json({
    short_name: "SneakerHub",
    name: "SneakerHub — Premium Sports Footwear & Curation",
    icons: [
      {
        src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=192&h=192&fit=crop&q=80",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=512&h=512&fit=crop&q=80",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    start_url: "/",
    background_color: "#ffffff",
    theme_color: "#171717",
    display: "standalone",
    orientation: "portrait"
  });
});

// GET sw.js PWA Service Worker dynamic generation
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`
    const CACHE_NAME = 'sneakerhub-cache-v1';
    self.addEventListener('install', (e) => {
      self.skipWaiting();
    });
    self.addEventListener('activate', (e) => {
      e.waitUntil(clients.claim());
    });
    self.addEventListener('fetch', (e) => {
      // Pass-through routing
      e.respondWith(fetch(e.request));
    });
  `);
});

// GET catalog list
app.get("/api/products", (req, res) => {
  res.json(state.products);
});

// POST review for a sneaker product
app.post("/api/products/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { userName, rating, comment } = req.body;

  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: "Missing required review fields (userName, rating, comment)" });
  }

  const product = state.products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    userName,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  product.reviews.unshift(newReview);
  product.reviewsCount = product.reviews.length;
  
  // Recalculate average rating
  const runningSum = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = Number((runningSum / product.reviews.length).toFixed(1));

  saveDatabase();
  res.status(201).json(product);
});

// Admin endpoint to add products / modify stock
app.post("/api/admin/products", (req, res) => {
  const { name, brand, category, price, discountPrice, description, features, colors, sizes, stock, gender } = req.body;
  
  if (!name || !brand || !category || !price) {
    return res.status(400).json({ error: "Missing product parameters" });
  }

  const newProduct: Product = {
    id: `product-${Date.now()}`,
    name,
    brand,
    category,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    rating: 5.0,
    reviewsCount: 0,
    description: description || "Premium style and performance sneakers.",
    features: features || ["Premium design", "Engineered for maximum utility."],
    images: ["bg-gradient-to-br from-indigo-500 to-black"],
    colors: colors || ["Core Black"],
    sizes: sizes || [8, 9, 10, 11],
    stock: stock ? Number(stock) : 10,
    reviews: [],
    gender: gender || "Unisex",
    releaseYear: new Date().getFullYear()
  };

  state.products.push(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

// Get placed orders
app.get("/api/orders", (req, res) => {
  res.json(state.orders);
});

// Create Order (Simulated Checkout)
app.post("/api/orders", (req, res) => {
  const { items, shippingAddress, subtotal, shipping, tax, total } = req.body;

  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: "Incomplete order data" });
  }

  // Deduct stock for each shoe in order
  items.forEach((item: any) => {
    const parentPrd = state.products.find(p => p.id === item.productId);
    if (parentPrd) {
      parentPrd.stock = Math.max(0, parentPrd.stock - item.quantity);
    }
  });

  const trackingNum = `SH-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderTime = new Date().toISOString();
  const formatTime = (offsetMin: number) => {
    return new Date(Date.now() + offsetMin * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const newOrder: Order = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    date: orderTime.split('T')[0],
    items,
    subtotal: Number(subtotal),
    shipping: Number(shipping),
    tax: Number(tax),
    total: Number(total),
    status: 'Processing',
    shippingAddress,
    trackingNumber: trackingNum,
    trackingSteps: [
      { title: 'Order Confirmed', desc: 'Your sneaker purchase is verified.', time: formatTime(0), completed: true, status: 'success' },
      { title: 'Warehouse Packing', desc: 'Securely wrapping SneakerHub box.', time: 'In Progress', completed: false, status: 'active' },
      { title: 'Transit Delivery', desc: 'Courier picking up package.', time: 'Pending', completed: false, status: 'pending' },
      { title: 'Delivered', desc: 'Drop off at your doorstep.', time: 'Pending', completed: false, status: 'pending' }
    ]
  };

  state.orders.push(newOrder);

  // Push new notification for the placed order
  const orderNotif: Notification = {
    id: `n-${Date.now()}`,
    title: "Order Placed Successfully ✨",
    message: `Your tracking code is ${trackingNum}. Total order amount: $${total.toFixed(2)}.`,
    time: orderTime,
    read: false,
    type: "order"
  };
  state.notifications.unshift(orderNotif);

  saveDatabase();
  res.status(201).json(newOrder);
});

// Get user notifications
app.get("/api/notifications", (req, res) => {
  res.json(state.notifications);
});

// Mark notification as read
app.post("/api/notifications/:id/read", (req, res) => {
  const { id } = req.params;
  const notif = state.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    saveDatabase();
  }
  res.json({ success: true, notifications: state.notifications });
});

// -------------------------------------------------------------
// Gemini-Powered Shopping Assistant API Route
// -------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message parameter." });
  }

  // Format products list for model context injections
  const productCatalogDetails = state.products.map(p => {
    return `- [ID: "${p.id}"] ${p.brand} - ${p.name} (${p.category} Shoe): $${p.discountPrice || p.price} USD. Colors: ${p.colors.join(', ')}. Sizes: ${p.sizes.join(', ')}. Stock level: ${p.stock}. Key Focus: ${p.description}`;
  }).join("\n");

  const systemInstruction = `You are "SneakerHub AI", a world-class premium sneaker specialist and custom shopping assistant for sport, street, and running shoes. You help customers choose shoes from our physical SneakerHub shop collections.

YOUR BRAND IDENTITIES:
- Courteous, stylish, deeply knowledgeable of athletics and sneaker culture (comparable to elite consultants at flagship Nike, Adidas, and Foot Locker channels).
- Strictly objective, premium, and zero hype or fluff. Use elegant markdown to emphasize fits.

YOUR CORE RULES:
1. ONLY recommend shoe styles that exist in the catalog provided below.
2. Under no circumstances should you invent or assume other brand collections that we do not sell.
3. Every recommendation you propose MUST point out the exact [ID: "..."] and quote the exact style name and price.
4. When recommended, provide helpful advice on specific sport fits, runner profiles, sizing tips, and budget preferences.
5. Provide standard markdown formatting where helpful.

SNEAKERHUB ACTIVE CATALOG CONTEXT:
${productCatalogDetails}

SPECIAL DEALS ACTIVE:
- Coupon: Use "SNEAKERHUB20" for 20% off running and street models.
- Coupon: Use "AIRGROUND" for $30 off elite carbon items (Nike ZoomX Vaporfly, Puma Deviate Nitro).`;

  try {
    if (ai) {
      // Structure prompt contents
      const chatContents: any[] = [];
      
      // Inject prior conversational logs
      if (history && history.length > 0) {
        history.forEach((h: any) => {
          chatContents.push({
            role: h.role,
            parts: [{ text: h.text }]
          });
        });
      }

      // Add actual last prompt
      chatContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const answerText = response.text || "I was unable to analyze your query. How can I assist you with sneakers today?";
      
      // We can scan the response string for ID matches in our catalog to attach "recommendedProductIds" automatically!
      const recommendedProductIds: string[] = [];
      state.products.forEach(p => {
        if (answerText.toLowerCase().includes(p.id.toLowerCase()) || answerText.toLowerCase().includes(p.name.toLowerCase())) {
          recommendedProductIds.push(p.id);
        }
      });

      return res.json({
        text: answerText,
        recommendedProductIds: recommendedProductIds.slice(0, 3) // limit to top 3
      });
    } else {
      // -----------------------------------------------------------------
      // Fallback Engine if GEMINI_API_KEY is not configured
      // -----------------------------------------------------------------
      const lower = message.toLowerCase();
      let reply = "Hello! I am your SneakerHub AI Specialist. ";
      let recommendations: string[] = [];

      if (lower.includes("run") || lower.includes("marathon") || lower.includes("jog")) {
        reply += "For running or speed performance, I highly recommend our high-tier carbon plate racing shoes:\n\n";
        reply += "- **Nike ZoomX Vaporfly Next% 3** ($245 USD): A lightweight masterpiece with built-in carbon flight plate, perfect for setting personal records in long distances.\n";
        reply += "- **Adidas Ultraboost Light 23** ($159 USD): Excellent daily coach with lightweight foam cushioning.\n\nAre you training for a race, or seeking everyday joint safety?";
        recommendations = ["nike-vaporfly-3", "adidas-ub-light"];
      } else if (lower.includes("court") || lower.includes("basketball") || lower.includes("jordan") || lower.includes("dunk")) {
        reply += "For standard court hoops or retro street aesthetics, we have incredible selections:\n\n";
        reply += "- **Air Jordan 1 Retro High OG** ($165 USD): An timeless basketball masterpiece with ankle lock wings support standard.\n";
        reply += "- **New Balance 550 White/Green** ($110 USD): A clean low-top vintage trainer.\n\nWould you prefer mid-top ankle cuffs, or low street cuts?";
        recommendations = ["nike-aj1-retro", "nb-550-retro"];
      } else if (lower.includes("style") || lower.includes("casual") || lower.includes("streetwear") || lower.includes("vintage") || lower.includes("samba") || lower.includes("chunky")) {
        reply += "For everyday street curation and unmatched aesthetics, these sneakers stand tall:\n\n";
        reply += "- **New Balance 9060 Macadamia** ($160 USD): Beautiful dual-density chunky silhouette.\n";
        reply += "- **Reebok Club C 85 Vintage** ($90 USD): Clean tennis chalk leather profile.\n\nWhich color palette fits your rotation best?";
        recommendations = ["nb-9060-grey", "reebok-club-c"];
      } else if (lower.includes("budget") || lower.includes("cheap") || lower.includes("low price") || lower.includes("under")) {
        reply += "If you are minded on value and premium comfort under $130, these pairs are outstanding:\n\n";
        reply += "- **Reebok Club C 85 Vintage** ($90 USD): Timeless chalk white garment leather.\n";
        reply += "- **Puma RS-X 3D Evolution** ($99 USD): Retro chunky sneaker loaded with bouncy cushioning.\n\nWould you like to apply your first-timer 20% discount coupon *SNEAKERHUB20*?";
        recommendations = ["reebok-club-c", "puma-rs-x3"];
      } else {
        reply += "Our sneaker catalog features world-class choices from Nike, Adidas, Puma, New Balance, Asics, and Reebok. Ask me about:\n\n";
        reply += "1. **Elite Running Shoes** (ZoomX Vaporfly, Elite Nitrogen cushioning).\n";
        reply += "2. **Retro Retro Models & High-tops** (Air Jordan 1 OG, NB 550).\n";
        reply += "3. **Chunky Lifestyle Favorites** (New Balance 9060, Puma RS-X 3D).\n";
        reply += "4. **Comfort Shoes** (GEL-Kayano 30 Platinum with 4D Guidance).\n\nWhat kind of sport or style goal are you looking to achieve?";
        // return random popular sneakers
        recommendations = ["nike-aj1-retro", "asics-kayano-30", "nb-9060-grey"];
      }

      return res.json({
        text: reply,
        recommendedProductIds: recommendations
      });
    }
  } catch (error: any) {
    console.error("Gemini Assistant handler failure:", error);
    res.status(500).json({ error: "Sorry, I had an error consulting the intelligence engine. Please retry." });
  }
});

// -------------------------------------------------------------
// Vite Single Page App static assets serving & fallback
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted successfully onto Express.");
  } else {
    // production static builds
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Serving static production build from ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SneakerHub server running successfully on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
