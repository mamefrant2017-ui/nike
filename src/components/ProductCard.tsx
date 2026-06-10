import React from 'react';
import { Product } from '../types';
import { Star, Heart, Bookmark } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, productId: string) => void;
}

export function ProductCard({ product, onSelect, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const finalPrice = product.discountPrice || product.price;
  const isDiscounted = !!product.discountPrice;
  const discountPercent = isDiscounted 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl border border-neutral-100 overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Visual Canvas containing high-contrast gradients and brand logo overtop */}
      <div className="relative pt-[120%] w-full overflow-hidden bg-neutral-50 flex items-center justify-center p-4">
        {/* Dynamic decorative backdrop circles */}
        <div className="absolute inset-0 bg-radial from-neutral-200/40 via-transparent to-transparent opacity-60"></div>
        
        {/* Colorful Gradient Backdrop Box that represents raw shoe energy */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full opacity-15 blur-2xl transition-transform duration-500 group-hover:scale-125 ${product.images[0]}`}></div>
        
        {/* Rendered CSS abstract sneaker representation */}
        <div className="absolute inset-x-6 top-8 bottom-8 flex flex-col justify-between z-10 select-none">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">{product.brand}</span>
            {isDiscounted && (
              <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">-{discountPercent}%</span>
            )}
          </div>
          
          {/* SNEAKER ILLUSTRATIVE ARTWORK: Pure CSS isometric premium layout representation */}
          <div className="relative w-full h-32 flex items-center justify-center my-auto">
            {/* Sole shadow */}
            <div className="absolute bottom-4 w-4/5 h-3 bg-neutral-900/10 rounded-full blur-[4px] group-hover:w-11/12 group-hover:opacity-60 transition-all duration-500 transform group-hover:scale-x-105"></div>
            
            {/* High-fidelity CSS stylized sneaker body */}
            <div className={`relative w-[130px] h-[75px] rounded-[16px_50px_32px_16px] ${product.images[0]} shadow-md transform -rotate-[15deg] group-hover:rotate-[-10deg] group-hover:-translate-y-2 transition-all duration-500 border border-white/20 flex flex-col justify-between p-3 overflow-hidden`}>
              {/* Laces graphic */}
              <div className="absolute top-1 right-8 w-12 h-0.5 bg-white/40 rotate-[35deg]"></div>
              <div className="absolute top-2 right-10 w-10 h-0.5 bg-white/40 rotate-[35deg]"></div>
              <div className="absolute top-3 right-12 w-8 h-0.5 bg-white/40 rotate-[35deg]"></div>
              {/* Swoosh/Stripes details */}
              <div className="w-14 h-4 rounded-full border-t-2 border-r-2 border-white/30 absolute bottom-4 left-4 rotate-[15deg]"></div>
              <div className="w-14 h-4 rounded-full border-t border-white/10 absolute bottom-5 left-6 rotate-[15deg]"></div>
              
              <span className="text-[9px] font-mono tracking-tighter text-white/40 uppercase self-end mt-1 font-bold">{product.brand} LOGO</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-neutral-400 font-medium">
            <span>Est. {product.releaseYear}</span>
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span className="font-semibold text-neutral-700">{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Wishlist Heart Toggle floating button */}
        <button
          id={`wishlist-button-${product.id}`}
          onClick={(e) => onToggleWishlist(e, product.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow active:scale-95 transition-all text-neutral-400 hover:text-red-500 z-20 group/heart"
        >
          <Heart 
            className={`w-4 h-4 transition-all ${isWishlisted ? 'fill-red-500 stroke-red-500 text-red-500 scale-110' : 'group-hover/heart:scale-110'}`} 
          />
        </button>
      </div>

      {/* Sneaker specs summary text details description */}
      <div className="p-4 flex flex-col flex-1 justify-between select-none border-t border-neutral-50 bg-white">
        <div>
          <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-0.5">{product.brand}</h4>
          <h3 className="font-semibold text-neutral-900 text-[14px] leading-tight group-hover:text-neutral-700 transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-[11px] text-neutral-400 mt-1">{product.category} • {product.gender}</p>
        </div>

        <div className="flex items-baseline justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-neutral-900 text-base font-mono">${finalPrice}</span>
            {isDiscounted && (
              <span className="text-[12px] text-neutral-400 line-through font-mono">${product.price}</span>
            )}
          </div>
          
          <span className={`text-[10px] font-bold uppercase ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} In Stock` : 'Sold Out'}
          </span>
        </div>
      </div>
    </div>
  );
}
