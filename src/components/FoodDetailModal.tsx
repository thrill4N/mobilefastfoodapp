import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Clock, Star } from 'lucide-react';
import { MenuItem, ToppingOption, CartItem } from '../types';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: Omit<CartItem, 'id'>) => void;
  diningOption: 'dine-in' | 'takeaway';
}

export default function FoodDetailModal({
  item,
  onClose,
  onAddToCart,
  diningOption: defaultDiningOption,
}: FoodDetailModalProps) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [diningOption, setDiningOption] = useState<'dine-in' | 'takeaway'>(defaultDiningOption);
  const [customNote, setCustomNote] = useState('');
  const [pricePerItem, setPricePerItem] = useState(item.price);

  // Sync dining option from parent
  useEffect(() => {
    setDiningOption(defaultDiningOption);
  }, [defaultDiningOption, item]);

  // Recalculate cost when toppings change
  useEffect(() => {
    const toppingsCost = selectedToppings.reduce((acc, current) => acc + current.price, 0);
    setPricePerItem(item.price + toppingsCost);
  }, [selectedToppings, item]);

  const toggleTopping = (topping: ToppingOption) => {
    const exists = selectedToppings.some((t) => t.name === topping.name);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddAction = () => {
    onAddToCart({
      menuItem: item,
      selectedToppings,
      quantity,
      diningOption,
      note: customNote.trim() || undefined,
    });
    onClose();
  };

  const finalTotal = pricePerItem * quantity;

  return (
    <div id="food-modal-backdrop" className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-end justify-center animate-fade-in select-none">
      <div
        id="food-modal-sheet"
        className="w-full max-w-[412px] bg-[#100a07]/95 border-t border-orange-500/20 rounded-t-[32px] overflow-hidden flex flex-col max-h-[85%] backdrop-blur-xl"
        style={{
          boxShadow: '0 -20px 48px rgba(0, 0, 0, 0.75)'
        }}
      >
        {/* Header Area with Close button */}
        <div className="relative h-44 shrink-0 bg-[#0a0503]">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100a07] via-transparent to-[#100a07]/60" />
          
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-950/80 border border-white/10 flex items-center justify-center text-white/85 hover:text-white transition-all hover:scale-105"
          >
            <X size={16} />
          </button>

          {/* Core metadata overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full uppercase font-bold">
              {item.category}
            </span>
            <h3 className="text-lg font-black text-white leading-tight mt-1 line-clamp-1">{item.name}</h3>
            <div className="flex items-center gap-3 text-[10px] text-neutral-300 font-mono mt-0.5">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star size={10} className="fill-amber-500" />
                <span>{item.rating} ({item.ratingCount})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Clock size={10} />
                <span>{item.preparationTime} min prep</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Customize Section */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none text-white text-xs">
          {/* Item description */}
          <div className="space-y-1">
            <h4 className="text-[10px] tracking-wider uppercase text-neutral-500 font-mono font-bold">About this dish</h4>
            <p className="text-neutral-300 leading-relaxed text-xs">{item.description}</p>
          </div>

          {/* Dining Option Segment */}
          <div className="glass-panel p-3 rounded-xl space-y-2">
            <h4 className="text-[10px] tracking-wider uppercase text-neutral-500 font-mono font-bold">Dine Preference</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDiningOption('dine-in')}
                className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                  diningOption === 'dine-in'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-transparent border-white/5 text-neutral-400'
                }`}
              >
                🍽️ Dine-In Table
              </button>
              <button
                type="button"
                onClick={() => setDiningOption('takeaway')}
                className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                  diningOption === 'takeaway'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-transparent border-white/5 text-neutral-400'
                }`}
              >
                🥡 Takeaway Bag
              </button>
            </div>
          </div>

          {/* Toppings Options (if available) */}
          {item.availableToppings && item.availableToppings.length > 0 && (
            <div id="toppings-customizer-box" className="space-y-2.5">
              <div className="flex justify-between items-center bg-neutral-950/20 px-2 py-1 rounded-lg">
                <h4 className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono font-bold">
                  {item.optionsLabel || 'Add Toppings'}
                </h4>
                <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Optional</span>
              </div>
              <div className="space-y-1.5">
                {item.availableToppings.map((topping) => {
                  const isChecked = selectedToppings.some((t) => t.name === topping.name);
                  return (
                    <div
                      key={topping.name}
                      onClick={() => toggleTopping(topping)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-sm'
                          : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-750 border-white/10'
                        }`}>
                          {isChecked && <Check size={11} className="stroke-[3.5px]" />}
                        </div>
                        <span className="text-[11px] font-semibold">{topping.name}</span>
                      </div>
                      {topping.price > 0 && (
                        <span className={`text-[10px] font-mono font-bold ${isChecked ? 'text-amber-400' : 'text-neutral-500'}`}>
                          + R {topping.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen instructions comment textbox */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] tracking-wider uppercase text-neutral-500 font-mono font-bold">Special Requests</h4>
            <textarea
              placeholder="e.g. Make curry extremely hot, no onions, extra serviettes please..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              maxLength={120}
              className="w-full h-14 p-2.5 bg-neutral-950/80 border border-white/5 rounded-xl outline-none focus:border-amber-500/30 text-[11px] text-neutral-350 placeholder-neutral-600 resize-none font-medium text-white"
            />
          </div>
        </div>

        {/* Sticky Drawer bottom details & quantity & trigger bar */}
        <div id="modal-bottom-pane" className="border-t border-white/5 p-5 bg-[#0e0806]/95 backdrop-blur-md space-y-4 shrink-0">
          <div className="flex justify-between items-center">
            {/* Left Quantity Controller */}
            <div className="flex items-center gap-3.5 bg-[#170e0a] border border-orange-500/15 px-3.5 py-1.5 rounded-full">
              <button
                id="qty-decrement"
                onClick={handleDecrement}
                className="w-5 h-5 rounded-full bg-neutral-950 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus size={12} className="stroke-[3px]" />
              </button>
              <span id="qty-indicator" className="text-xs font-black font-mono tracking-wider w-4 text-center text-white glow-amber-soft">{quantity}</span>
              <button
                id="qty-increment"
                onClick={handleIncrement}
                className="w-5 h-5 rounded-full bg-neutral-950 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={12} className="stroke-[3px]" />
              </button>
            </div>

            {/* Right instant dynamic totals */}
            <div className="text-right">
              <span className="text-[9px] text-neutral-500 font-mono tracking-wider block">TOTAL AMT</span>
              <span id="quantity-price-total" className="text-lg font-black text-amber-400 font-mono tracking-tighter glow-amber-soft">
                R {finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            id="modal-add-to-cart-action"
            onClick={handleAddAction}
            className="w-full h-11 zest-gradient-bg zest-gradient-hover rounded-2xl text-neutral-950 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transform active:scale-98 transition-all duration-100 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <ShoppingBag size={14} className="stroke-[2.5px]" />
            Add To Order Basket
          </button>
        </div>
      </div>
    </div>
  );
}
