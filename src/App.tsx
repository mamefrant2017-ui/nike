import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Heart, User, Search, Filter, Compass, 
  MessageSquare, Sliders, ChevronRight, Star, Plus, Minus, 
  Trash2, CreditCard, Sparkles, CheckCircle, Package, Send, 
  MapPin, Bell, Receipt, Award, ArrowLeft, RefreshCw, Eye, 
  ShieldCheck, Database, ListOrdered, Tag, Clock, Circle
} from 'lucide-react';
import { Product, CartItem, Order, Notification, ChatMessage, SneakerCategory } from './types';
import { SPECIAL_OFFERS } from './data';
import { DeviceFrame } from './components/DeviceFrame';
import { ProductCard } from './components/ProductCard';

export default function App() {
  // --- STATE SYSTEM ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'assistant' | 'wishlist' | 'cart' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication State
  const [user, setUser] = useState({
    name: 'Mame Frant',
    email: 'mamefrant2017@gmail.com',
    budget: 200,
    address: '1048 Premium Avenue',
    city: 'New York',
    zip: '10001'
  });

  // Filtering / Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(300);

  // Interactive Product Detail states
  const [detailSelectedSize, setDetailSelectedSize] = useState<number | null>(null);
  const [detailSelectedColor, setDetailSelectedColor] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  // Custom Reviews Form State
  const [reviewName, setReviewName] = useState('Mame Frant');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Offers state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountDesc: string } | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Checkout Form State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutName, setCheckoutName] = useState('Mame Frant');
  const [checkoutEmail, setCheckoutEmail] = useState('mamefrant2017@gmail.com');
  const [checkoutAddress, setCheckoutAddress] = useState('1048 Premium Avenue');
  const [checkoutCity, setCheckoutCity] = useState('New York');
  const [checkoutZip, setCheckoutZip] = useState('10001');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'complete'>('cart');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Real-time Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: 'model',
      text: "Welcome to SneakerHub! I'm your Gemini AI personal shopper. Tell me about your training goals, favorite colors, or dynamic fits, and I will recommend the absolute best sneakers from our catalog.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Administrative Tool state
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminProductForm, setAdminProductForm] = useState({
    name: '',
    brand: 'Nike',
    category: 'Running' as SneakerCategory,
    price: '',
    discountPrice: '',
    description: '',
    gender: 'Unisex' as 'Men' | 'Women' | 'Unisex',
    stock: '15'
  });
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  // --- API INTEGRATION ---
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.warn("Could not connect to SneakerHub server, falling back manually.", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrdersAndNotifications = async () => {
    try {
      const resOrders = await fetch('/api/orders');
      if (resOrders.ok) {
        const data = await resOrders.json();
        setOrders(data);
      }
      const resNotif = await fetch('/api/notifications');
      if (resNotif.ok) {
        const data = await resNotif.json();
        setNotifications(data);
      }
    } catch (e) {
      console.log("Could not sync orders & notifications", e);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchOrdersAndNotifications();
    const timer = setInterval(fetchOrdersAndNotifications, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    // Scroll mobile panel up on screen changes
    const container = document.getElementById('device-shell');
    if (container) {
      container.scrollTop = 0;
    }
  }, [activeTab, selectedProduct]);

  // --- ACTION HANDLERS ---
  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const addToCartDetail = (product: Product) => {
    if (!detailSelectedSize) {
      alert("Please select a sneaker size.");
      return;
    }
    const colorSelected = detailSelectedColor || product.colors[0];
    const itemId = `${product.id}-${detailSelectedSize}-${colorSelected.replace(/\s+/g, '')}`;

    const existingIndex = cart.findIndex(c => c.id === itemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images[0],
        size: detailSelectedSize,
        color: colorSelected,
        quantity: 1
      };
      setCart(prev => [...prev, newItem]);
    }

    // Trigger feedback simulation
    alert(`Success! 1 pair of ${product.name} (Size ${detailSelectedSize}) added to your cart.`);
  };

  const modifyCartQuantity = (itemId: string, diff: number) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === itemId);
      if (idx === -1) return prev;
      const updated = [...prev];
      const newQty = updated[idx].quantity + diff;
      if (newQty <= 0) {
        return prev.filter(item => item.id !== itemId);
      } else {
        updated[idx].quantity = newQty;
        return updated;
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const applyPromoCode = () => {
    setPromoError('');
    const code = promoInput.toUpperCase().trim();
    if (!code) return;

    if (code === 'SNEAKERHUB20') {
      setAppliedCoupon({ code, discountDesc: '20% discount applied!' });
    } else if (code === 'AIRGROUND') {
      setAppliedCoupon({ code, discountDesc: '$30 off coupon applied!' });
    } else {
      setPromoError('Invalid promo coupon code.');
    }
  };

  // Checkout system
  const submitOrder = async () => {
    const subtotal = cartCalculatedSubtotal;
    const shipping = subtotal > 150 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax - (appliedCoupon ? (appliedCoupon.code === 'SNEAKERHUB20' ? subtotal * 0.2 : 30) : 0);

    const orderPayload = {
      items: cart,
      shippingAddress: {
        name: checkoutName,
        email: checkoutEmail,
        address: checkoutAddress,
        city: checkoutCity,
        zip: checkoutZip
      },
      subtotal,
      shipping,
      tax,
      total
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const responseData = await res.json() as Order;
        setLastPlacedOrder(responseData);
        setOrders(prev => [responseData, ...prev]);
        setCart([]); // Reset Cart
        setAppliedCoupon(null);
        setCheckoutStep('complete');
        fetchOrdersAndNotifications(); // immediate sync
      } else {
        alert("Failed to create order on server. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Connection failed. Order simulated locally.");
      // Simulated Fallback
      const tracking = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackOrder: Order = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split('T')[0],
        items: cart,
        subtotal,
        shipping,
        tax,
        total,
        status: 'Processing',
        shippingAddress: orderPayload.shippingAddress,
        trackingNumber: tracking,
        trackingSteps: [
          { title: 'Order Confirmed', desc: 'Securely registered in memory.', time: '09:41', completed: true, status: 'success' },
          { title: 'Warehouse Packing', desc: 'Sizing match.', time: 'Active', completed: false, status: 'active' },
          { title: 'Transit Delivery', desc: 'Shipping via runner courier.', time: 'Pending', completed: false, status: 'pending' },
          { title: 'Delivered', desc: 'Arrived!', time: 'Pending', completed: false, status: 'pending' }
        ]
      };
      setLastPlacedOrder(fallbackOrder);
      setOrders(prev => [fallbackOrder, ...prev]);
      setCart([]);
      setAppliedCoupon(null);
      setCheckoutStep('complete');
    }
  };

  // Submit product review
  const submitReview = async (productId: string) => {
    if (!reviewName || !reviewComment) {
      alert("Please fill your name and feedback comment.");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (res.ok) {
        const updatedProduct = await res.json() as Product;
        setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
        setSelectedProduct(updatedProduct);
        setReviewComment('');
        alert("Thank you! Your verified purchase feedback is listed.");
      }
    } catch (e) {
      console.warn("Using offline review injection", e);
      // fallback mock update
      if (selectedProduct) {
        const dummyReview = {
          id: `rev-${Date.now()}`,
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [dummyReview, ...selectedProduct.reviews];
        const avg = Number((updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length).toFixed(1));
        const offlinePrd = {
          ...selectedProduct,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avg
        };
        setProducts(prev => prev.map(p => p.id === productId ? offlinePrd : p));
        setSelectedProduct(offlinePrd);
        setReviewComment('');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Send request context to Gemini
  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsGeneratingChat(true);

    try {
      // Format history logs
      const historyPayload = chatMessages.slice(-5).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyPayload,
          message: text
        })
      });

      if (res.ok) {
        const data = await res.json();
        const serverMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProductIds: data.recommendedProductIds
        };
        setChatMessages(prev => [...prev, serverMsg]);
      } else {
        throw new Error("Bad status");
      }
    } catch (e) {
      console.warn("Chat server connection dropped, utilizing expert automated lookup system.", e);
      const serverMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'model',
        text: "Apologies, I'm experiencing high volume on the server. Try querying running shoes, jordan styles, or casual retro runners for instant custom advice!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, serverMsg]);
    } finally {
      setIsGeneratingChat(false);
    }
  };

  const handleCreateProductAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg('');
    const { name, brand, category, price, discountPrice, description, gender, stock } = adminProductForm;
    if (!name || !price) {
      alert("Name and Price are required.");
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, brand, category,
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
          description, gender,
          stock: parseInt(stock) || 12
        })
      });

      if (res.ok) {
        const added = await res.json();
        setProducts(prev => [...prev, added]);
        setAdminSuccessMsg("Product successfully registered in remote catalog!");
        setAdminProductForm({
          name: '',
          brand: 'Nike',
          category: 'Running',
          price: '',
          discountPrice: '',
          description: '',
          gender: 'Unisex',
          stock: '15'
        });
        fetchInventory();
      }
    } catch (err) {
      alert("Admin connection failed. Simulating local insert.");
      const demoProd: Product = {
        id: `custom-${Date.now()}`,
        name,
        brand,
        category: category as any,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        rating: 5.0,
        reviewsCount: 0,
        description: description || "Fresh release sneaker.",
        features: ["Retro elements", "Premium build comfort."],
        images: ["bg-gradient-to-br from-indigo-500 to-black"],
        colors: ["Triple White"],
        sizes: [8, 9, 10, 11],
        stock: parseInt(stock) || 10,
        reviews: [],
        gender: gender as any,
        releaseYear: 2026
      };
      setProducts(prev => [...prev, demoProd]);
      setAdminSuccessMsg("Simulated creation successfully added key row.");
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    } catch (e) {}
  };

  // --- DERIVED SYSTEM CALCULATIONS ---
  const brands = ['All', 'Nike', 'Adidas', 'New Balance', 'Asics', 'Puma', 'Reebok'];
  const categories = ['All', 'Running', 'Sneakers', 'Basketball', 'Training', 'Outdoor'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesGender = selectedGender === 'All' || p.gender.toLowerCase() === selectedGender.toLowerCase() || p.gender === 'Unisex';
    const matchesPrice = (p.discountPrice || p.price) <= maxPrice;
    return matchesSearch && matchesBrand && matchesCategory && matchesGender && matchesPrice;
  });

  const cartCalculatedSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.discountPrice || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.code === 'SNEAKERHUB20' ? cartCalculatedSubtotal * 0.2 : 30) 
    : 0;

  const finalCheckTotal = cartCalculatedSubtotal > 0
    ? (cartCalculatedSubtotal + (cartCalculatedSubtotal > 150 ? 0 : 15) + (cartCalculatedSubtotal * 0.08) - discountAmount)
    : 0;

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 text-black font-sans selection:bg-neutral-900 selection:text-white flex flex-col antialiased">
      
      {/* Dynamic Header - Styled Bold Typography Theme */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter leading-none text-neutral-900 flex items-center gap-2">
              SNEAKERHUB
              <span className="text-[10px] bg-neutral-900 text-white font-extrabold px-1.5 py-0.5 rounded tracking-widest uppercase">PRO</span>
            </h1>
            <span className="text-[10px] text-neutral-400 tracking-wider">Premium Athletics Applet</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-neutral-500">
            <button 
              onClick={() => { setSelectedProduct(null); setActiveTab('home'); setSelectedBrand('All'); }}
              className={`hover:text-black transition-colors ${activeTab === 'home' ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
            >
              Collection drops
            </button>
            <button 
              onClick={() => { setSelectedProduct(null); setActiveTab('search'); }}
              className={`hover:text-black transition-colors ${activeTab === 'search' ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
            >
              Browse sneakers
            </button>
            <button 
              onClick={() => { setSelectedProduct(null); setActiveTab('assistant'); }}
              className={`hover:text-black transition-colors ${activeTab === 'assistant' ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
            >
              AI Consultant
            </button>
            <span className="text-neutral-200">|</span>
            <button 
              onClick={() => setShowAdminPanel(!showAdminPanel)} 
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full border border-neutral-300 flex items-center gap-1.5 transition-colors ${showAdminPanel ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-white text-neutral-700 hover:bg-neutral-50'}`}
            >
              <Database className="w-3.5 h-3.5" />
              Developer Panel
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex text-right flex-col mr-2">
            <span className="text-xs font-black text-neutral-800">{user.name}</span>
            <span className="text-[11px] text-neutral-400">{user.email}</span>
          </div>
          <button 
            onClick={() => { setSelectedProduct(null); setActiveTab('profile'); }}
            className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-100 flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform"
          >
            <User className="w-5 h-5 text-neutral-800" />
          </button>
        </div>
      </header>

      {/* Main Multi-Pane Visual Layout Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / CENTER PANE: Dynamic Admin Tools View & Desktop Preview Assist controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Welcome Jumbotron with Elite Callout */}
          <div className="relative overflow-hidden rounded-[32px] bg-neutral-950 p-8 text-white shadow-xl">
            {/* Ambient Graphic Backdrop overlay */}
            <div className="absolute right-0 bottom-0 opacity-10 font-black text-[130px] leading-none pointer-events-none select-none tracking-tighter">
              9060
            </div>
            
            <span className="text-[10px] font-black tracking-[0.3em] uppercase bg-white/20 px-3 py-1 rounded-full text-white inline-block mb-4">
              Premium Release Spotlight
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight">
              NIKE VAPORFLY 3
            </h2>
            <p className="text-xs text-neutral-300 mt-2 max-w-sm font-medium">
              Equipped with full length Carbon carbon fiber plates to achieve marathon elite velocity. Click product in catalog inside the device to purchase.
            </p>
            
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button 
                onClick={() => {
                  const vp = products.find(p => p.id === 'nike-vaporfly-3');
                  if (vp) {
                    setSelectedProduct(vp);
                    setActiveTab('home');
                  }
                }}
                className="bg-white text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform"
              >
                Inspect Specs
              </button>
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Offers matching: AIRGROUND coupon</span>
              </div>
            </div>
          </div>

          {/* SNEAKERHUB INTERACTIVE ADMINISTRATIVE PANEL */}
          {showAdminPanel && (
            <div className="bg-white rounded-[24px] border border-neutral-200 p-6 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-neutral-900" />
                  <h3 className="font-black text-sm uppercase tracking-wider">Enterprise Catalog & Mock Order System</h3>
                </div>
                <button 
                  onClick={() => setShowAdminPanel(false)}
                  className="text-xs font-bold text-neutral-400 hover:text-black hover:underline"
                >
                  Hide
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-neutral-100 flex flex-col">
                  <span className="text-neutral-400 font-semibold uppercase text-[10px]">Active Shoe SKUs</span>
                  <span className="text-lg font-black mt-1 text-neutral-900">{products.length} Products</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-neutral-100 flex flex-col">
                  <span className="text-neutral-400 font-semibold uppercase text-[10px]">Mock Orders Processed</span>
                  <span className="text-lg font-black mt-1 text-neutral-900">{orders.length} Deliveries</span>
                </div>
              </div>

              {/* Developer Database Schema layout view for verification transparency */}
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-2 font-mono">
                  📂 DATA ARCHITECTURE & API REQUIREMENTS
                </span>
                <div className="bg-neutral-950 rounded-xl p-4 text-white font-mono text-[10px] overflow-x-auto max-h-[160px] space-y-1 select-all">
                  <div className="text-emerald-400">// SQLite / Firestore Product Schema:</div>
                  <div>{"{"}</div>
                  <div className="pl-4">{"id: string, name: string, brand: string,"}</div>
                  <div className="pl-4">{"category: 'Running' | 'Sneakers' | 'Basketball',"}</div>
                  <div className="pl-4">{"price: number, discountPrice?: number, colors: string[],"}</div>
                  <div className="pl-4">{"sizes: number[], stock: number, reviews: Review[]"}</div>
                  <div>{"}"}</div>
                  <div className="text-slate-500">// API endpoints supported in server.ts:</div>
                  <div>GET /api/products - Returns catalog list</div>
                  <div>POST /api/products/:id/reviews - Creates rating feedback</div>
                  <div>POST /api/orders - Saves user checkout & decrements inventory</div>
                </div>
              </div>

              {/* Form to submit custom design sneaker directly into inventory */}
              <form onSubmit={handleCreateProductAdmin} className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-700">Add Premium Shoe Drop</h4>
                
                {adminSuccessMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{adminSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Shoe Style Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dunk Retro Vintage"
                      value={adminProductForm.name}
                      onChange={e => setAdminProductForm({...adminProductForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Brand</label>
                    <select 
                      value={adminProductForm.brand}
                      onChange={e => setAdminProductForm({...adminProductForm, brand: e.target.value})}
                      className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option>Nike</option>
                      <option>Adidas</option>
                      <option>Puma</option>
                      <option>New Balance</option>
                      <option>Asics</option>
                      <option>Reebok</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Category</label>
                    <select 
                      value={adminProductForm.category}
                      onChange={e => setAdminProductForm({...adminProductForm, category: e.target.value as SneakerCategory})}
                      className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option>Running</option>
                      <option>Sneakers</option>
                      <option>Basketball</option>
                      <option>Training</option>
                      <option>Outdoor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Stock Level</label>
                    <input 
                      type="number" 
                      placeholder="15"
                      value={adminProductForm.stock}
                      onChange={e => setAdminProductForm({...adminProductForm, stock: e.target.value})}
                      className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Regular Price ($)</label>
                    <input 
                      type="number" 
                      placeholder="180"
                      value={adminProductForm.price}
                      onChange={e => setAdminProductForm({...adminProductForm, price: e.target.value})}
                      className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Discount Price (Optional)</label>
                    <input 
                      type="number" 
                      placeholder="145"
                      value={adminProductForm.discountPrice}
                      onChange={e => setAdminProductForm({...adminProductForm, discountPrice: e.target.value})}
                      className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Description</label>
                  <textarea 
                    placeholder="Premium material specs..."
                    rows={2}
                    value={adminProductForm.description}
                    onChange={e => setAdminProductForm({...adminProductForm, description: e.target.value})}
                    className="w-full bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-400">Creates real reactive instance</span>
                  <button 
                    type="submit"
                    className="bg-neutral-900 text-white font-extrabold uppercase text-[11px] tracking-wider px-6 py-2 rounded-lg hover:bg-neutral-800 transition"
                  >
                    Deploy New Shoe
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* REALTIME SYSTEM NOTIFICATIONS DRAWER */}
          <div className="bg-white rounded-[24px] border border-neutral-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-neutral-900" />
                <h3 className="font-black text-sm uppercase tracking-wider">
                  Live Notifications ({unreadNotificationCount})
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-2">
              {notifications.length === 0 ? (
                <div className="text-xs text-neutral-400 py-2">No system logs registered.</div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleMarkNotificationRead(n.id)}
                    className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${n.read ? 'bg-slate-50 border-neutral-100 opacity-60' : 'bg-amber-50/40 border-amber-100 hover:bg-amber-50/80'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-neutral-900">{n.title}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">
                        {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                    {!n.read && (
                      <span className="text-[10px] text-amber-700 font-bold block mt-1 uppercase tracking-widest hover:underline">
                        ✓ Mark Read
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVE ADVISORY COUPONS ROW */}
          <div className="bg-white rounded-[24px] border border-neutral-200 p-6 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">ACTIVE PROMO OFFERS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPECIAL_OFFERS.map(off => (
                <div key={off.id} className="border border-dashed border-neutral-300 rounded-2xl p-4 bg-slate-50/50 relative overflow-hidden">
                  <span className="absolute -right-4 -bottom-4 font-black text-neutral-100 text-[42px] select-none">
                    {off.code}
                  </span>
                  <div className="flex justify-between items-start">
                    <span className="font-black text-xs text-neutral-950 uppercase">{off.title}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-mono">
                      {off.discount}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 mr-4">{off.desc}</p>
                  <div className="mt-3 flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-mono font-bold bg-white border border-neutral-200 px-2.5 py-1 rounded-md text-neutral-800">
                      {off.code}
                    </span>
                    <button 
                      onClick={() => {
                        setPromoInput(off.code);
                        setActiveTab('cart');
                        alert(`Coupon code "${off.code}" copied automatically into shopping bag!`);
                      }}
                      className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-900 hover:underline"
                    >
                      Use Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>


        {/* RIGHT PANE: The Virtual Android Smartphone Device Shell Emulator */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div className="w-full text-center mb-4 select-none">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-neutral-400 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-2xs">
              📱 SNEAKERHUB VIRTUAL PHONE APLET
            </span>
            <p className="text-[11px] text-neutral-400 mt-2">
              Browse, add sizing, submit live verified reviews & order via mock transaction APIs.
            </p>
          </div>

          <DeviceFrame 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            canGoBack={selectedProduct !== null}
            onBack={() => setSelectedProduct(null)}
          >
            {/* -------------------------------------------------------------
                SCREEN LAYOUT 1: SNEAKER PRODUCT DETAIL
            ------------------------------------------------------------- */}
            {selectedProduct ? (
              <div className="bg-white flex-1 flex flex-col pb-6 text-neutral-900 animation-fade-in">
                {/* Brand Banner */}
                <div className="px-5 pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{selectedProduct.brand} Premium</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                    <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Main Dynamic Large Product Title */}
                <div className="px-5 mt-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">{selectedProduct.name}</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">{selectedProduct.category} High Performance Series</p>
                </div>

                {/* Premium Image Gallery Loop */}
                <div className="relative w-full aspect-square bg-slate-50 mt-4 flex items-center justify-center overflow-hidden">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-20 blur-2xl ${selectedProduct.images[galleryIndex]}`}></div>
                  
                  {/* Styled Isometric Sneaker */}
                  <div className="relative w-[180px] h-[100px] flex items-center justify-center z-10 select-none">
                    <div className="absolute bottom-1 w-4/5 h-4 bg-neutral-900/10 rounded-full blur-[6px]"></div>
                    <div className={`relative w-[170px] h-[95px] rounded-[24px_64px_48px_24px] ${selectedProduct.images[galleryIndex]} shadow-lg transform -rotate-[12deg] transition-all duration-300 border-2 border-white/20 flex flex-col justify-between p-4 overflow-hidden`}>
                      <div className="absolute top-1 right-12 w-14 h-0.5 bg-white/40 rotate-[35deg]"></div>
                      <div className="absolute top-2 right-14 w-12 h-0.5 bg-white/40 rotate-[35deg]"></div>
                      <div className="w-[84px] h-[24px] rounded-full border-t-2 border-r-2 border-white/30 absolute bottom-5 left-5 rotate-[15deg]"></div>
                    </div>
                  </div>

                  {/* Dot Index Selectors */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {selectedProduct.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setGalleryIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${galleryIndex === idx ? 'bg-neutral-900 w-5' : 'bg-neutral-300'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizing, Fit Selector, & Interactive Price info */}
                <div className="p-5 space-y-5 bg-white flex-1">
                  
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-mono font-black text-neutral-900">
                        ${selectedProduct.discountPrice || selectedProduct.price}
                      </span>
                      {selectedProduct.discountPrice && (
                        <span className="text-sm text-neutral-400 line-through font-mono">
                          ${selectedProduct.price}
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold ${selectedProduct.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {selectedProduct.stock > 0 ? `IN STOCK (${selectedProduct.stock} Pairs)` : 'SOLD OUT'}
                    </span>
                  </div>

                  {/* Sizing Segment */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-900">Sizing Fit (US Men)</span>
                      <span className="text-[11px] text-neutral-400">Regular Width (D)</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setDetailSelectedSize(size)}
                          className={`py-2 text-xs font-black rounded-lg border leading-none transition-all ${detailSelectedSize === size ? 'bg-neutral-900 border-neutral-900 text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-900'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors Selector */}
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block mb-2">Color Setup Curation</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map(col => (
                        <button 
                          key={col}
                          onClick={() => setDetailSelectedColor(col)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${detailSelectedColor === col ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-slate-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Narrative & Highlights */}
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block mb-1">Product Description</span>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">{selectedProduct.description}</p>
                    
                    <ul className="mt-2.5 space-y-1.5">
                      {selectedProduct.features.map((feat, ix) => (
                        <li key={ix} className="text-[11px] text-neutral-500 flex items-start gap-1.5 font-normal">
                          <span className="font-extrabold text-neutral-900 mt-0.5">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Customer verified reviews */}
                  <div className="pt-4 border-t border-neutral-100">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block mb-3">Customer Verified Reviews</span>
                    
                    {/* Add Review Box inside listing details */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-neutral-150 mb-4 space-y-3">
                      <span className="text-[11px] font-black uppercase text-neutral-800 block">Write Verified Review</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="My Name"
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          className="bg-white border border-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-neutral-900"
                        />
                        <select 
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="bg-white border border-neutral-200 text-xs rounded-lg px-2.5 py-1.5 outline-none"
                        >
                          <option value="5">★★★★★ (5)</option>
                          <option value="4">★★★★☆ (4)</option>
                          <option value="3">★★★☆☆ (3)</option>
                          <option value="2">★★☆☆☆ (2)</option>
                        </select>
                      </div>
                      <textarea 
                        placeholder="Share your fitting feedback size details..."
                        rows={2}
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-xs rounded-lg p-2.5 focus:outline-neutral-900"
                      />
                      <button 
                        onClick={() => submitReview(selectedProduct.id)}
                        disabled={isSubmittingReview}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white w-full py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        {isSubmittingReview ? "Submitting feedback..." : "Publish Review"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedProduct.reviews.map(rev => (
                        <div key={rev.id} className="text-xs pb-3 border-b border-neutral-100 last:border-b-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-neutral-900">{rev.userName}</span>
                            <span className="text-[9px] text-neutral-400 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex gap-0.5 mb-1 text-amber-500 text-[10px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 stroke-amber-500' : 'text-neutral-200'}`} />
                            ))}
                          </div>
                          <p className="text-neutral-600 font-normal">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Fixed Purchase Bar Footer */}
                <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4 grid grid-cols-12 gap-3">
                  <button 
                    onClick={() => {
                      const itemIsWish = wishlist.includes(selectedProduct.id);
                      setWishlist(prev => 
                        itemIsWish ? prev.filter(id => id !== selectedProduct.id) : [...prev, selectedProduct.id]
                      );
                    }}
                    className={`col-span-3 border border-neutral-200 rounded-xl flex items-center justify-center transition-colors ${wishlist.includes(selectedProduct.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white text-neutral-500'}`}
                  >
                    <Heart className="w-5 h-5" fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => addToCartDetail(selectedProduct)}
                    className="col-span-9 bg-neutral-900 hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to shopping bag
                  </button>
                </div>
              </div>
            ) : (
              /* ELSE SHOW TAB SYSTEMS */
              <div className="flex flex-col flex-1 bg-white">
                
                {/* -------------------------------------------------------------
                    SCREEN: EXPLORE DROPS (HOME)
                ------------------------------------------------------------- */}
                {activeTab === 'home' && (
                  <div className="flex flex-col flex-1 pb-20">
                    
                    {/* Welcome Banner inside emulator */}
                    <div className="p-5 pb-2 bg-white">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#998b7a]">WELCOME DROPBACK</span>
                          <h2 className="text-2xl font-black italic tracking-tighter text-neutral-900">SNEAKERHUB</h2>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>

                      {/* Brand Quick horizontal filters */}
                      <div className="flex gap-2 overflow-x-auto mt-4 pb-2 no-scrollbar select-none">
                        {brands.map(brand => (
                          <button 
                            key={brand}
                            onClick={() => setSelectedBrand(brand)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${selectedBrand === brand ? 'bg-neutral-900 text-white shadow-sm' : 'bg-slate-50 text-neutral-500 hover:text-black hover:bg-slate-100'}`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Featured Sneaker Lists */}
                    <div className="px-5 py-2 flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900">Active Releases</span>
                        <span className="text-[11px] text-neutral-400">{filteredProducts.length} models listed</span>
                      </div>

                      {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-xs text-neutral-400 uppercase tracking-widest gap-2">
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span>loading catalogs...</span>
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <div className="py-12 text-center text-xs text-neutral-400 uppercase tracking-widest bg-slate-50 rounded-2xl p-6 border border-dashed border-neutral-200">
                          No matching drops found. Check your filters or prompt Gemini!
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {filteredProducts.map(p => (
                            <ProductCard 
                              key={p.id} 
                              product={p} 
                              onSelect={(prod) => { setSelectedProduct(prod); setGalleryIndex(0); }}
                              isWishlisted={wishlist.includes(p.id)}
                              onToggleWishlist={toggleWishlist}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    SCREEN: DISCOVER FILTERS (SEARCH)
                ------------------------------------------------------------- */}
                {activeTab === 'search' && (
                  <div className="p-5 flex flex-col flex-1 pb-20">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#998b7a] mb-0.5">FILTERS STATION</span>
                    <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">Search Curation</h2>

                    {/* Rich text search field */}
                    <div className="relative mt-4">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="Search model, brand, elements..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    {/* Brand select */}
                    <div className="space-y-3 mt-5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-neutral-800">Curation Brand</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {brands.map(b => (
                          <button 
                            key={b}
                            onClick={() => setSelectedBrand(b)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedBrand === b ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' : 'bg-slate-50 border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2 mt-5">
                      <span className="text-xs font-black uppercase text-neutral-800 block">Performance Category</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {categories.map(c => (
                          <button 
                            key={c}
                            onClick={() => setSelectedCategory(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedCategory === c ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-slate-50 border-neutral-200 text-neutral-600'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender select */}
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      {['All', 'Men', 'Women', 'Unisex'].map(g => (
                        <button 
                          key={g} 
                          onClick={() => setSelectedGender(g)}
                          className={`py-1.5 text-xs font-black rounded-lg border transition-all ${selectedGender === g ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' : 'bg-slate-50 border-neutral-200 text-neutral-600'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>

                    {/* Price Slider controls */}
                    <div className="space-y-2 mt-5">
                      <div className="flex justify-between items-center text-xs font-black uppercase text-neutral-800">
                        <span>Max Sneaker Cost</span>
                        <span className="text-neutral-900 font-mono">${maxPrice}</span>
                      </div>
                      <input 
                        type="range" 
                        min="80" 
                        max="300" 
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                      />
                      <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                        <span>$80</span>
                        <span>$300</span>
                      </div>
                    </div>

                    {/* Action Filter Apply Result counter button */}
                    <button 
                      onClick={() => setActiveTab('home')}
                      className="bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl mt-6 w-full shadow-sm"
                    >
                      Apply Filter Selection ({filteredProducts.length})
                    </button>

                  </div>
                )}

                {/* -------------------------------------------------------------
                    SCREEN: GEMINI SHOPPING ASSISTANTCHAT
                ------------------------------------------------------------- */}
                {activeTab === 'assistant' && (
                  <div className="flex-1 flex flex-col pb-20 h-full relative">
                    {/* Header bar inside */}
                    <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-neutral-900 flex items-center justify-center text-white">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900">SneakerHub Gemini AI</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[480px]">
                      {chatMessages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end ml-auto' : 'self-start mr-auot'}`}
                        >
                          <div 
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${msg.role === 'user' ? 'bg-neutral-900 text-white rounded-tr-none' : 'bg-slate-100 text-neutral-800 rounded-tl-none border border-neutral-150'}`}
                          >
                            <p className="whitespace-pre-line font-normal">{msg.text}</p>
                            
                            {/* If there are AI recommended items associated, render cards inline */}
                            {msg.role === 'model' && msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                              <div className="mt-3.5 pt-3.5 border-t border-dashed border-neutral-200 space-y-2">
                                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">Recommended Sneakers:</span>
                                {msg.recommendedProductIds.map(pid => {
                                  const prodObj = products.find(p => p.id === pid);
                                  if (!prodObj) return null;
                                  return (
                                    <div 
                                      key={pid}
                                      onClick={() => setSelectedProduct(prodObj)}
                                      className="bg-white p-2 rounded-xl flex items-center justify-between cursor-pointer hover:shadow transition-shadow border border-neutral-150"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-8 h-6 rounded ${prodObj.images[0]} opacity-20`} />
                                        <div className="flex flex-col text-left">
                                          <span className="text-[11px] font-black text-neutral-800 leading-tight">{prodObj.name}</span>
                                          <span className="text-[9px] text-neutral-400">{prodObj.brand} • ${prodObj.price}</span>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] text-neutral-400 font-mono mt-1 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      ))}

                      {isGeneratingChat && (
                        <div className="self-start bg-slate-100 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 border border-neutral-150">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-neutral-500">Consulting AI Catalog...</span>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Footer Box */}
                    <div className="absolute bottom-20 left-0 right-0 px-4 bg-white/95 py-2.5 border-t border-neutral-100">
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          placeholder="Ask Gemini: e.g. stability shoe for flat feet ..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                          className="w-full bg-slate-100 border border-neutral-200 rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-neutral-900"
                        />
                        <button 
                          onClick={sendChatMessage}
                          className="absolute right-2 p-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    SCREEN: WISHLIST ACCUMULATION
                ------------------------------------------------------------- */}
                {activeTab === 'wishlist' && (
                  <div className="p-5 flex flex-col flex-1 pb-20">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#998b7a] mb-0.5">MY CURATED BAG</span>
                    <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">Wishlisted Drops</h2>

                    {wishlist.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center justify-center text-xs text-neutral-400 uppercase tracking-widest gap-2">
                        <Heart className="w-8 h-8 text-neutral-200" />
                        <span>your list is currently empty.</span>
                        <button 
                          onClick={() => setActiveTab('home')}
                          className="bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-4 rounded-xl mt-3 uppercase tracking-wider"
                        >
                          Spot shoes
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {wishlist.map(id => {
                          const p = products.find(prod => prod.id === id);
                          if (!p) return null;
                          return (
                            <ProductCard 
                              key={p.id} 
                              product={p} 
                              onSelect={(prod) => { setSelectedProduct(prod); setGalleryIndex(0); }}
                              isWishlisted={true}
                              onToggleWishlist={toggleWishlist}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------------
                    SCREEN: SHOPPING CART & INTEGRATED CHECKOUT
                ------------------------------------------------------------- */}
                {activeTab === 'cart' && (
                  <div className="flex-1 flex flex-col pb-20">
                    
                    {/* Integrated Checkout Steps */}
                    {isCheckingOut ? (
                      <div className="p-5 space-y-5">
                        
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setIsCheckingOut(false)}
                            className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1 hover:text-black"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Bag
                          </button>
                          
                          <div className="flex gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${checkoutStep === 'shipping' ? 'bg-neutral-950' : 'bg-neutral-200'}`} />
                            <span className={`w-2.5 h-2.5 rounded-full ${checkoutStep === 'complete' ? 'bg-neutral-950' : 'bg-neutral-200'}`} />
                          </div>
                        </div>

                        {checkoutStep === 'shipping' && (
                          <div className="space-y-4">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black uppercase text-[#998b7a]">SECURE CHECKOUT API</span>
                              <h3 className="text-xl font-black text-neutral-950 uppercase">Shipping Destination</h3>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Full Name</label>
                                <input 
                                  type="text" 
                                  value={checkoutName}
                                  onChange={e => setCheckoutName(e.target.value)}
                                  className="w-full bg-slate-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-black"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Email Address</label>
                                <input 
                                  type="email" 
                                  value={checkoutEmail}
                                  onChange={e => setCheckoutEmail(e.target.value)}
                                  className="w-full bg-slate-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-black"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Street Address</label>
                                <input 
                                  type="text" 
                                  value={checkoutAddress}
                                  onChange={e => setCheckoutAddress(e.target.value)}
                                  className="w-full bg-slate-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">City</label>
                                  <input 
                                    type="text" 
                                    value={checkoutCity}
                                    onChange={e => setCheckoutCity(e.target.value)}
                                    className="w-full bg-slate-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">ZIP / Postal Code</label>
                                  <input 
                                    type="text" 
                                    value={checkoutZip}
                                    onChange={e => setCheckoutZip(e.target.value)}
                                    className="w-full bg-slate-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Secure Card visual elements */}
                            <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-2 relative overflow-hidden">
                              <span className="absolute -right-6 -bottom-6 font-black text-white/5 text-[54px] tracking-tighter select-none">
                                CREDITS
                              </span>
                              <div className="flex justify-between items-center text-xs mb-2">
                                <span className="font-extrabold tracking-widest uppercase">Verified Mock Visa Card</span>
                                <CreditCard className="w-4.5 h-4.5" />
                              </div>
                              <p className="font-mono text-sm">•••• •••• •••• 9924</p>
                              <div className="flex justify-between text-[10px] text-neutral-400 uppercase font-mono mt-2">
                                <span>Exp: 09/29</span>
                                <span>CVC: 440</span>
                              </div>
                            </div>

                            {/* Order Recap list inside checkingout shipping stage */}
                            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                              <div className="flex justify-between text-xs text-neutral-500">
                                <span>Purchase Subtotal:</span>
                                <span className="font-mono">${cartCalculatedSubtotal.toFixed(2)}</span>
                              </div>
                              {appliedCoupon && (
                                <div className="flex justify-between text-xs text-red-600 font-bold">
                                  <span>Coupon Discount:</span>
                                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-xs text-neutral-500">
                                <span>Carbon Delivery Fee:</span>
                                <span className="font-mono">${(cartCalculatedSubtotal > 150 ? 0 : 15).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm font-black text-neutral-950 pt-2 border-t border-neutral-100 uppercase">
                                <span>Total:</span>
                                <span className="font-mono">${finalCheckTotal.toFixed(2)}</span>
                              </div>
                            </div>

                            <button 
                              onClick={submitOrder}
                              className="w-full bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                            >
                              Place Verified Mock Order
                            </button>
                          </div>
                        )}

                        {checkoutStep === 'complete' && lastPlacedOrder && (
                          <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                              <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-black text-neutral-900 uppercase">Purchase Complete!</h3>
                            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                              Your order was registered successfully. Product stock has been updated and a tracking parcel created.
                            </p>
                            
                            <div className="bg-slate-50 p-4 rounded-xl text-left border border-neutral-150 space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-neutral-400 block font-bold">Tracking ID:</span>
                                <span className="font-mono font-black text-neutral-900">{lastPlacedOrder.trackingNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400 block font-bold">Estimated Delivery:</span>
                                <span className="text-neutral-800">Runner courier transit</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-dashed border-neutral-200">
                                <span className="text-neutral-400 block font-bold">Mock Total Charge:</span>
                                <span className="font-mono font-black text-neutral-900">${lastPlacedOrder.total.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="pt-4 space-y-2">
                              <button 
                                onClick={() => {
                                  setIsCheckingOut(false);
                                  setSelectedProduct(null);
                                  setActiveTab('profile');
                                }}
                                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black py-2.5 rounded-lg uppercase tracking-wider transition"
                              >
                                View Delivery Status
                              </button>
                              <button 
                                onClick={() => {
                                  setIsCheckingOut(false);
                                  setSelectedProduct(null);
                                  setActiveTab('home');
                                }}
                                className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-black py-2.5 rounded-lg uppercase tracking-wider transition"
                              >
                                Continue Shopping
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    ) : (
                      /* MAIN SHOPPING BAG VIEW */
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-widest text-[#998b7a] mb-0.5">YOUR BAG</span>
                          <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">Shopping Cart</h2>

                          {cart.length === 0 ? (
                            <div className="text-center py-16 flex flex-col items-center justify-center text-xs text-neutral-400 uppercase tracking-widest gap-2">
                              <ShoppingBag className="w-8 h-8 text-neutral-200" />
                              <span>your shopping bag is currently empty.</span>
                              <button 
                                onClick={() => setActiveTab('home')}
                                className="bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-4 rounded-xl mt-3 uppercase tracking-wider"
                              >
                                Spot arrivals
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 mt-4">
                              {cart.map(item => {
                                const finalPrice = item.discountPrice || item.price;
                                return (
                                  <div key={item.id} className="flex gap-3 pb-3 border-b border-neutral-100">
                                    <div className={`w-14 h-14 rounded-xl ${item.image} opacity-30 shrink-0 border border-neutral-150 relative overflow-hidden`} />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider block">{item.brand}</span>
                                      <h4 className="font-bold text-xs text-neutral-900 truncate">{item.name}</h4>
                                      <p className="text-[10px] text-neutral-500 font-medium">Size {item.size} • {item.color}</p>
                                      
                                      <div className="flex items-center justify-between mt-2.5">
                                        <span className="font-bold text-xs font-mono">${finalPrice}</span>
                                        
                                        <div className="flex items-center gap-2 bg-slate-50 border border-neutral-200 rounded-lg px-1.5 py-0.5 select-none">
                                          <button 
                                            onClick={() => modifyCartQuantity(item.id, -1)}
                                            className="p-0.5 text-neutral-500 hover:text-black"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                                          <button 
                                            onClick={() => modifyCartQuantity(item.id, 1)}
                                            className="p-0.5 text-neutral-500 hover:text-black"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <button 
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-neutral-400 hover:text-red-500 p-1 self-start"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {cart.length > 0 && (
                          <div className="space-y-4 pt-4 border-t border-neutral-150">
                            
                            {/* Promo Code input field */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-neutral-500 block">Apply Promocode</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="e.g. SNEAKERHUB20"
                                  value={promoInput}
                                  onChange={e => setPromoInput(e.target.value)}
                                  className="flex-1 bg-slate-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                                />
                                <button 
                                  onClick={applyPromoCode}
                                  className="bg-neutral-900 text-white text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-wider hover:bg-neutral-800"
                                >
                                  Apply
                                </button>
                              </div>
                              {promoError && (
                                <span className="text-[10px] text-red-600 font-bold block">{promoError}</span>
                              )}
                              {appliedCoupon && (
                                <span className="text-[10px] text-emerald-600 font-bold block">{appliedCoupon.discountDesc}</span>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs text-neutral-500">
                                <span>Cart Subtotal</span>
                                <span className="font-mono">${cartCalculatedSubtotal.toFixed(2)}</span>
                              </div>
                              {appliedCoupon && (
                                <div className="flex justify-between items-center text-xs text-red-600 font-bold">
                                  <span>Coupon Discount</span>
                                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center text-xs text-neutral-500">
                                <span>Carbon Delivery Fee</span>
                                <span className="font-mono">${(cartCalculatedSubtotal > 150 ? 0 : 15).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-black text-neutral-900 uppercase pt-2 border-t border-neutral-100">
                                <span>Total Price</span>
                                <span className="font-mono">${finalCheckTotal.toFixed(2)}</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setIsCheckingOut(true);
                                setCheckoutStep('shipping');
                              }}
                              className="w-full bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <CreditCard className="w-4 h-4" />
                              Proceed to Mock Checkout
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                )}

                {/* -------------------------------------------------------------
                    SCREEN: ACCOUNT USER PROFILE (ORDERS STATS)
                ------------------------------------------------------------- */}
                {activeTab === 'profile' && (
                  <div className="p-5 flex flex-col flex-1 pb-20 overflow-y-auto">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#998b7a] mb-0.5">MEMBER LOGS</span>
                    <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">User Profile</h2>

                    {/* Member Profile info */}
                    <div className="bg-slate-50 border border-neutral-150 rounded-2xl p-4 mt-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black">
                        MF
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-neutral-900 leading-tight">{user.name}</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{user.email}</p>
                        <span className="text-[10px] font-bold text-neutral-400 bg-white border px-2 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wider">
                          Loyalty Member Gold
                        </span>
                      </div>
                    </div>

                    {/* Mock Settings elements to satisfy interactive feel */}
                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex justify-between items-center py-2.5 border-b border-neutral-100">
                        <span className="text-neutral-500 font-bold uppercase text-[10px]">Mock Shipping Location</span>
                        <span className="text-neutral-800 font-medium">{user.address}, {user.city}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-neutral-100">
                        <span className="text-neutral-500 font-bold uppercase text-[10px]">Member Coupon Status</span>
                        <span className="text-emerald-600 font-bold uppercase">SNEAKERHUB20 Active</span>
                      </div>
                    </div>

                    {/* Order History Accumulator with Live Track Support */}
                    <div className="mt-6">
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block mb-3 leading-none">
                        Mock Order History ({orders.length})
                      </span>

                      {orders.length === 0 ? (
                        <div className="text-center py-8 text-xs text-neutral-400 uppercase tracking-widest bg-slate-50 rounded-2xl p-4 border border-dashed border-neutral-200">
                          no purchases logged yet
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map(order => (
                            <div key={order.id} className="bg-slate-50 border border-neutral-150 rounded-2xl p-4">
                              <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200 mb-2.5">
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-neutral-900 uppercase">{order.id}</span>
                                  <span className="text-[9px] text-neutral-400 font-mono">{order.date}</span>
                                </div>
                                <span className="text-[10px] font-bold text-white bg-neutral-900 px-2.5 py-0.5 rounded-full uppercase">
                                  {order.status}
                                </span>
                              </div>

                              {/* Mini items listings inside ordered history */}
                              <div className="space-y-1.5 mb-3.5">
                                {order.items.map(it => (
                                  <div key={it.id} className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-600 font-medium truncate max-w-[140px]">
                                      {it.name} (Size {it.size})
                                    </span>
                                    <span className="font-bold text-neutral-800">x{it.quantity}</span>
                                  </div>
                                ))}
                              </div>

                              {/* PARCEL TRACKING STEPS - LIVE MOCK PROCESS OR TRACK INDICATOR */}
                              <div className="pt-2 border-t border-dashed border-neutral-200 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black uppercase text-neutral-400">Tracking Parcel: {order.trackingNumber}</span>
                                  <span className="text-[9px] font-mono leading-none bg-emerald-50 text-emerald-700 px-1 rounded font-bold uppercase">ACTIVE courier</span>
                                </div>

                                <div className="space-y-3.5 relative pl-3 border-l-2 border-slate-200">
                                  {order.trackingSteps.map((step, idx) => (
                                    <div key={idx} className="relative">
                                      {/* Indicator bullet */}
                                      <div className={`absolute -left-[18px] top-1.5 w-2 h-2 rounded-full ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                      <div className="flex flex-col text-left text-xs leading-none">
                                        <span className={`font-bold uppercase text-[11px] ${step.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                          {step.title}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 font-normal mt-1 leading-normal">{step.desc}</span>
                                        <span className="text-[9px] text-neutral-400 font-mono mt-0.5">{step.time}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-3 mt-3 border-t border-neutral-200 text-xs">
                                <span className="text-neutral-400 font-bold uppercase text-[10px]">Total Mock Charge:</span>
                                <span className="font-mono font-black text-neutral-900 text-sm">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        if (confirm("Reset current simulator state database back to defaults? Handlers will recreate clean collection rows.")) {
                          setCart([]);
                          setWishlist([]);
                          setActiveTab('home');
                          alert("Memory items and parameters purged.");
                        }
                      }}
                      className="border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-black uppercase tracking-wider py-2 rounded-xl mt-6 cursor-pointer"
                    >
                      Delete Simulated Local DB State
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* -------------------------------------------------------------
                NAVIGATION BOTTOM BAR (STATICALLY LOCKED TO PHONE SCREEN)
            ------------------------------------------------------------- */}
            {selectedProduct === null && (
              <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-neutral-200 flex justify-around items-center px-4 z-40 select-none">
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center justify-center p-1.5 ${activeTab === 'home' ? 'text-black font-extrabold' : 'text-neutral-400 hover:text-neutral-700'}`}
                >
                  <Compass className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">Explore</span>
                </button>
                <button 
                  onClick={() => setActiveTab('search')}
                  className={`flex flex-col items-center justify-center p-1.5 ${activeTab === 'search' ? 'text-black font-extrabold' : 'text-neutral-400 hover:text-neutral-700'}`}
                >
                  <Filter className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">Sort</span>
                </button>
                <button 
                  onClick={() => setActiveTab('assistant')}
                  className={`flex flex-col items-center justify-center p-1.5 ${activeTab === 'assistant' ? 'text-black font-extrabold bg-[#e5ebf5]/30 rounded-full px-3 py-1' : 'text-neutral-400 hover:text-neutral-700'}`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">Assist</span>
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex flex-col items-center justify-center p-1.5 relative ${activeTab === 'wishlist' ? 'text-black font-extrabold' : 'text-neutral-400 hover:text-neutral-700'}`}
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">Curated</span>
                </button>
                <button 
                  onClick={() => setActiveTab('cart')}
                  className={`flex flex-col items-center justify-center p-1.5 relative ${activeTab === 'cart' ? 'text-black font-extrabold' : 'text-neutral-400 hover:text-neutral-700'}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-1.5 bg-neutral-900 border border-white text-white font-mono text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.reduce((s, c) => s + c.quantity, 0)}
                    </span>
                  )}
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">Bag</span>
                </button>
              </div>
            )}
          </DeviceFrame>

        </div>

      </main>

      {/* Corporate Footnotes matching the requested Bold Typography footer details */}
      <footer className="bg-neutral-950 text-white text-[10px] font-black uppercase tracking-[0.2em] py-6 px-12 mt-12 flex flex-col md:flex-row items-center justify-between border-t border-neutral-900">
        <div className="flex gap-8 mb-4 md:mb-0 select-none">
          <span className="hover:underline cursor-pointer">SneakerHub shipping policies</span>
          <span className="hover:underline cursor-pointer font-bold">Sustainability standard</span>
          <span className="hover:underline cursor-pointer">Corporate privacy rules</span>
        </div>
        <div className="flex items-center gap-2 select-none">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-neutral-400 font-mono">Durable Cloud-Run VM System Online</span>
        </div>
      </footer>

    </div>
  );
}
