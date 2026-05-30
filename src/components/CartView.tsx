import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Trash2, ShieldCheck, HelpCircle, Ticket, CreditCard, ChevronRight, Minimize2, Plus, Minus, Check, MapPin, Tablet, Sparkles, TrendingUp, Gift, Trophy } from 'lucide-react';
import { CartItem, LoyaltyRewards } from '../types';

interface CartViewProps {
  cart: CartItem[];
  cartCount: number;
  onUpdateCartQuantity: (id: string, qty: number) => void;
  onRemoveCartItem: (id: string) => void;
  diningOption: 'dine-in' | 'takeaway';
  setDiningOption: (opt: 'dine-in' | 'takeaway') => void;
  tableNumber: string;
  setTableNumber: (num: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
  loyalty: LoyaltyRewards;
  onCheckout: (
    paymentMethod: 'card' | 'wallet' | 'points',
    pointsDiscount: number,
    gateway: 'Yoco' | 'PayFast',
    couponCode?: string,
    couponDiscount?: number
  ) => void;
}

export default function CartView({
  cart,
  cartCount,
  onUpdateCartQuantity,
  onRemoveCartItem,
  diningOption,
  setDiningOption,
  tableNumber,
  setTableNumber,
  deliveryAddress,
  setDeliveryAddress,
  loyalty,
  onCheckout,
}: CartViewProps) {
  
  const [usePointsDiscount, setUsePointsDiscount] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'Yoco' | 'PayFast'>('Yoco');
  const [paymentWallet, setPaymentWallet] = useState<'card' | 'google-pay' | 'instant-eft'>('card');
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'authorizing' | 'success'>('idle');
  const [authBank, setAuthBank] = useState('Standard Bank');

  // Promo / Coupon Coupon Rewards States
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discountAmount: number; isPercent?: boolean } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Calculate prices
  const calculateSubtotal = () => {
    return cart.reduce((total, cartItem) => {
      const toppingsCost = cartItem.selectedToppings.reduce((tCost, current) => tCost + current.price, 0);
      const itemUnitTotal = cartItem.menuItem.price + toppingsCost;
      return total + itemUnitTotal * cartItem.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  // Loyalty Points conversion: 10 LC = R1.00 Discount rate
  const availablePointsPointsVal = loyalty.pointsBalance;
  // Maximum R discount points can buy
  const maxPointsDiscountVal = Math.floor(availablePointsPointsVal / 10);
  // Cap points discount at subtotal to prevent negative payment of course!
  const pointsDiscount = usePointsDiscount ? Math.min(maxPointsDiscountVal, subtotal) : 0;
  const pointsDeducted = pointsDiscount * 10;

  // Coupon discount calculation
  const couponDiscount = activeCoupon ? activeCoupon.discountAmount : 0;

  // Delivery Fee: R35, but Free if Dine-In, OR Free if Silver Feast/Golden Chef level loyalty tier!
  const isDeliveryFree = diningOption === 'dine-in' || loyalty.tier === 'Silver Feast' || loyalty.tier === 'Golden Chef';
  const deliveryFee = isDeliveryFree ? 0 : 35.00;

  const total = Math.max(0, subtotal - pointsDiscount - couponDiscount + deliveryFee);

  // Dynamic milestone & upselling recommendation engine
  const recommendations = useMemo(() => {
    const list: {
      type: 'coupon' | 'loyalty';
      title: string;
      description: string;
      diffAmount: number;
      targetName: string;
      tierName?: string;
      couponCode?: string;
    }[] = [];

    if (subtotal <= 0) return list;

    // 1. Coupon Level thresholds:
    // LEKKER50 requires R100 subtotal
    if (subtotal < 100) {
      const diff = 100 - subtotal;
      list.push({
        type: 'coupon',
        title: '🔒 LEKKER50 Coupon Milestone',
        description: `Add R ${diff.toFixed(2)} more to your basket to qualify for your R50.00 Mzansi off coupon!`,
        diffAmount: diff,
        targetName: 'LEKKER50 Coupon',
        couponCode: 'LEKKER50'
      });
    }

    // GOLDFEAST requires R200 subtotal
    if (subtotal < 200) {
      const diff = 200 - subtotal;
      list.push({
        type: 'coupon',
        title: '🔒 GOLDFEAST Coupon Milestone',
        description: `Add R ${diff.toFixed(2)} more to qualify for your R120.00 Golden Chef reward coupon!`,
        diffAmount: diff,
        targetName: 'GOLDFEAST Coupon',
        couponCode: 'GOLDFEAST'
      });
    }

    // 2. Loyalty level points thresholds:
    // Every R5 spent earns 1 Lekker Coin
    const pointsToEarn = Math.floor(subtotal / 5);
    const estimatedTotalPoints = loyalty.pointsBalance + pointsToEarn;

    if (loyalty.pointsBalance < 300) {
      const pointsDiff = 300 - estimatedTotalPoints;
      if (pointsDiff > 0) {
        const zarDiff = pointsDiff * 5;
        list.push({
          type: 'loyalty',
          title: '🚀 Silver Feast Tier Milestone',
          description: `Spend R ${zarDiff.toFixed(2)} more (earning ${pointsDiff} more coins) to reach the 300 point milestone and claim Silver Feast for FREE standard deliveries forever!`,
          diffAmount: zarDiff,
          targetName: 'Silver Feast Status',
          tierName: 'Silver Feast'
        });
      }
    } else if (loyalty.pointsBalance < 700) {
      const pointsDiff = 700 - estimatedTotalPoints;
      if (pointsDiff > 0) {
        const zarDiff = pointsDiff * 5;
        list.push({
          type: 'loyalty',
          title: '👑 Golden Chef Elite Milestone',
          description: `Spend R ${zarDiff.toFixed(2)} more (earning ${pointsDiff} more coins) to reach the 700 point milestone and claim Golden Chef status!`,
          diffAmount: zarDiff,
          targetName: 'Golden Chef Status',
          tierName: 'Golden Chef'
        });
      }
    }

    // Sort by diffAmount ascending (nearest milestone first)
    return list.sort((a, b) => a.diffAmount - b.diffAmount);
  }, [subtotal, loyalty.pointsBalance]);

  const handleApplyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setPromoError('');
    setPromoSuccess('');

    if (!cleanCode) {
      setPromoError('Please enter a coupon code.');
      return;
    }

    if (cleanCode === 'QUEUESKIP') {
      const discount = parseFloat((subtotal * 0.15).toFixed(2));
      setActiveCoupon({ code: 'QUEUESKIP', discountAmount: discount, isPercent: true });
      setPromoSuccess('Promo Applied: 15% Skip Queue Discount! 🎉');
    } else if (cleanCode === 'LEKKER50') {
      if (subtotal < 100) {
        setPromoError('Subtotal must be R 100.00 or more for LEKKER50!');
        return;
      }
      setActiveCoupon({ code: 'LEKKER50', discountAmount: 50 });
      setPromoSuccess('Promo Applied: R 50.00 Off Mzansi Feast! 🎉');
    } else if (cleanCode === 'GOLDFEAST') {
      if (subtotal < 200) {
        setPromoError('Subtotal must be R 200.00 or more for GOLDFEAST!');
        return;
      }
      setActiveCoupon({ code: 'GOLDFEAST', discountAmount: 120 });
      setPromoSuccess('Promo Applied: R 120.00 Off Chef reward! 👑');
    } else {
      setPromoError('Invalid coupon. Try QUEUESKIP or look up active Lekker Club rewards!');
    }
  };

  // Auto-set the authorization bank just for a realistic SA mock
  const banks = ['Standard Bank', 'Capitec Bank', 'FNB', 'Nedbank', 'ABSA', 'TymeBank'];
  useEffect(() => {
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    setAuthBank(randomBank);
  }, []);

  const handleProcessPayment = () => {
    if (cart.length === 0) return;
    
    setCheckoutStep('processing');
    
    // Simulate gateway delay
    setTimeout(() => {
      setCheckoutStep('authorizing');
      
      // Simulate bank authentication delay (3D secure)
      setTimeout(() => {
        setCheckoutStep('success');
        
        // Final state trigger to parent order manager
        setTimeout(() => {
          onCheckout(
            paymentWallet === 'card' ? 'card' : paymentWallet === 'google-pay' ? 'wallet' : 'points',
            pointsDiscount,
            selectedGateway,
            activeCoupon?.code || undefined,
            couponDiscount || undefined
          );
        }, 1500);
      }, 2000);
    }, 1800);
  };

  // If checkout has simulations running
  if (checkoutStep !== 'idle') {
    return (
      <div id="cart-simulation-overlay" className="flex-1 w-full bg-[#0c0705] flex flex-col items-center justify-center p-6 text-white text-center select-none font-sans">
        {checkoutStep === 'processing' && (
          <div className="space-y-4 animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mx-auto glow-amber-soft" />
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
              Connecting to {selectedGateway}...
            </h3>
            <p className="text-[10px] text-neutral-400 max-w-xs leading-relaxed">
              Directing tokenized payment credentials securely to {selectedGateway === 'Yoco' ? 'Yoco Go card reader SDK' : 'PayFast Secure Instant EFT platform'}. Please do not close or lock your device.
            </p>
          </div>
        )}

        {checkoutStep === 'authorizing' && (
          <div className="space-y-4 max-w-xs glass-panel p-5 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 animate-[loading-progress_2s_ease-in-out_infinite]" />
            <div className="text-3xl">🛡️ Mzansi 3D-Secure</div>
            <h3 className="text-sm font-bold text-white mt-1">
              Authorizing with {authBank}
            </h3>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              Your bank has sent a secure push notification or SMS OTP to approve this transaction of <span className="font-mono text-amber-500 font-bold">R {total.toFixed(2)}</span>.
            </p>
            <div className="bg-neutral-950 p-2 rounded-lg text-[9px] font-mono text-amber-400 font-bold">
              VERIFICATION STATUS: PENDING PUSH
            </div>
            <span className="text-[8px] text-neutral-500 font-mono block">Secured by EMVCo Gateway Protocols</span>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="space-y-3 animate-bounce">
            <div className="w-14 h-14 zest-gradient-bg rounded-full flex items-center justify-center text-neutral-950 mx-auto text-xl font-bold shadow-lg shadow-orange-500/20">
              ✓
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400">
              Payment Authorized!
            </h3>
            <p className="text-[10px] text-neutral-450">
              Excellent! R {total.toFixed(2)} successfully captured via {selectedGateway}. Creating your order tracker now...
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="cart-view-container" className="flex flex-col p-4 pb-12 w-full text-white space-y-4">
      {/* Title block */}
      <div>
        <span className="text-neutral-400 text-xs font-mono tracking-wider block">YOUR SELECTED MZANSI BASKET</span>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
          Order Cart ({cartCount})
        </h2>
      </div>

      {cart.length === 0 ? (
        <div id="cart-empty-basket" className="text-center py-20 text-neutral-500 space-y-4">
          <div className="relative w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center mx-auto border border-white/5">
            <ShoppingBag size={24} className="text-neutral-605 text-neutral-400" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-600 rounded-full text-[8px] text-white flex items-center justify-center font-bold">0</span>
          </div>
          <div className="space-y-1">
            <p className="text-neutral-400 text-xs font-bold">Your curry basket is empty!</p>
            <p className="text-neutral-500 text-[10px]">Tap on the Menu section to search our authentic African curries, hot vetkoeks & delicious desserts.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cart items listing */}
          <div className="space-y-2.5">
            {cart.map((cartItem) => {
              const toppingsCost = cartItem.selectedToppings.reduce((acc, t) => acc + t.price, 0);
              const singleSumPerQty = cartItem.menuItem.price + toppingsCost;
              const hasToppings = cartItem.selectedToppings.length > 0;
              return (
                <div
                  key={cartItem.id}
                  className="glass-panel-interactive rounded-2xl p-3.5 flex gap-3.5 items-start"
                >
                  {/* Small delicious image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1e120c] shrink-0">
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata middle block */}
                  <div className="flex-1 min-w-0 py-0.5 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white leading-tight pr-2 line-clamp-1">{cartItem.menuItem.name}</h4>
                      <button
                        onClick={() => onRemoveCartItem(cartItem.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Show selected toppings and notes under the food item */}
                    {hasToppings ? (
                      <div className="text-[9px] text-amber-500 font-medium font-sans flex flex-wrap gap-1 leading-none pt-0.5">
                        <span className="text-neutral-550 mr-1 uppercase tracking-widest text-[8px] font-mono font-bold">Toppings:</span>
                        {cartItem.selectedToppings.map((t, idx) => (
                          <span key={idx} className="bg-amber-500/15 border border-amber-500/20 px-1 py-0.5 rounded">
                            {t.name} (+R{t.price})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[9px] text-neutral-500 font-mono tracking-widest leading-none pt-0.5 block italic">Original Style</span>
                    )}

                    {cartItem.note && (
                      <p className="text-[9px] text-neutral-400 font-sans italic line-clamp-1">
                        ✍️ Request: "{cartItem.note}"
                      </p>
                    )}

                    {/* Quantity controls and price inline */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2.5 bg-[#0c0705] border border-zinc-850/80 rounded-full px-2.5 py-1">
                        <button
                          onClick={() => onUpdateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="text-neutral-550 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus size={10} className="stroke-[3.5px]" />
                        </button>
                        <span className="text-[10px] font-black font-mono text-white">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="text-neutral-550 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus size={10} className="stroke-[3.5px]" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-amber-400 font-mono glow-amber-soft">
                        R {(singleSumPerQty * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Number or Delivery address quick editor container under order items */}
          <div className="glass-panel p-3.5 rounded-2xl space-y-3">
            <h3 className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase font-bold flex items-center justify-between">
              📍 Dining & Logistics details
              <span className="text-[9px] text-amber-450 font-black cursor-pointer bg-amber-500/15 border border-amber-500/35 px-2 py-0.5 rounded" onClick={() => setDiningOption(diningOption === 'dine-in' ? 'takeaway' : 'dine-in')}>
                {diningOption === 'dine-in' ? 'Switch to Delivery' : 'Switch to Dine-In'}
              </span>
            </h3>

            {diningOption === 'dine-in' ? (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-neutral-400">Serving Option:</span>
                  <span className="text-amber-300 font-bold">Dine-In (At Lekker Store)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#120a06]/85 border border-orange-500/15 p-2.5 h-9 rounded-xl">
                  <span className="text-[9px] text-amber-500 font-mono font-bold shrink-0">TABLE NO:</span>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Provide table number for serving"
                    className="w-full bg-transparent text-xs text-neutral-200 outline-none placeholder-zinc-750 font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-neutral-400">Serving Option:</span>
                  <span className="text-amber-300 font-bold">Takeaway / Delivery Delivery (+R35)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#120a06]/85 border border-orange-500/15 p-2.5 h-9 rounded-xl">
                  <span className="text-[9px] text-amber-500 font-mono font-bold shrink-0">ADDRESS:</span>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street no, suburb, city"
                    className="w-full bg-transparent text-xs text-neutral-200 outline-none placeholder-zinc-750 font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Recommended Reward Alert Panel */}
          {recommendations.length > 0 && (
            <div id="recommended-reward-alert" className="glass-panel p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-2.5 text-left relative overflow-hidden animate-fade-in shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
              
              <div className="flex justify-between items-center">
                <span className="text-[9.5px] font-mono tracking-wider text-amber-500 font-extrabold flex items-center gap-1.5 uppercase">
                  <Sparkles size={12} className="text-amber-500 animate-pulse" />
                  RECOMMENDED REWARD
                </span>
                <span className="text-[7.5px] bg-[#fbbf24]/20 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold text-amber-300 uppercase shrink-0">
                  Target Achievable
                </span>
              </div>
              
              <div className="flex gap-2.5 items-start">
                <span className="text-xl bg-amber-500/10 border border-amber-500/15 h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
                  {recommendations[0].type === 'coupon' ? <Gift size={16} className="text-amber-400" /> : <Trophy size={16} className="text-amber-400" />}
                </span>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[10.5px] font-black text-amber-200 block">
                    {recommendations[0].title}
                  </span>
                  <p className="text-[9.2px] text-neutral-400 leading-normal">
                    {recommendations[0].description}
                  </p>
                </div>
              </div>

              {/* Progress bar visualizer to the threshold */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex justify-between text-[8px] font-mono text-neutral-500 uppercase">
                  <span>Current subtotal: R {subtotal.toFixed(2)}</span>
                  <span>Target due: R {(subtotal + recommendations[0].diffAmount).toFixed(2)}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((subtotal / (subtotal + recommendations[0].diffAmount)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Smart Upselling Combo Promotions Box */}
          <div className="glass-panel p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/12 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono tracking-widest text-[#d97706] font-extrabold block">
                🔥 SMART COMBO ACCELERATOR
              </span>
              <span className="text-[7.5px] bg-red-600 px-1.5 py-0.2 rounded font-mono font-bold text-white uppercase animate-pulse">BEST MATCH</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-2xl shrink-0">🥤🧁</span>
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[10px] font-bold text-neutral-100 block truncate">Complete Your Gauteng Feast</span>
                <span className="text-[8.5px] text-neutral-450 block leading-tight">Add a nostalgia Sparletta Cream Soda Float or Warm Malva Custard from the full Menu for maximum loyalty multipliers today!</span>
              </div>
            </div>
          </div>

          {/* 🎟️ NEW: Dynamic Promo Coupon Reward Code block */}
          <div className="space-y-1.5 bg-[#120a06]/40 border border-white/5 rounded-2xl p-3.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <Ticket size={11} className="text-amber-500 animate-pulse" />
                Promo / Coupon Code
              </label>
              {activeCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCoupon(null);
                    setPromoSuccess('');
                    setPromoCodeInput('');
                  }}
                  className="text-[8px] font-mono text-red-400 underline uppercase hover:text-red-300 cursor-pointer"
                >
                  Clear Coupon
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="E.g. QUEUESKIP, LEKKER50..."
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="flex-1 bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500/40 font-mono uppercase"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo(promoCodeInput)}
                className="p-2 px-4 bg-amber-500 text-neutral-950 text-xs font-black uppercase rounded-xl hover:bg-amber-400 cursor-pointer"
              >
                Apply
              </button>
            </div>
            
            {promoError && <p className="text-[9px] text-rose-500 font-semibold">{promoError}</p>}
            {promoSuccess && <p className="text-[9.5px] text-emerald-400 font-bold">{promoSuccess}</p>}

            {/* Fast Coupon Tap List based on loyalty.xpLevel */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[7.5px] font-mono text-zinc-500 uppercase font-black block">Your Unlocked Coupe Rewards:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { code: 'QUEUESKIP', label: '15% Off (Queues)', levelReq: 1 },
                  { code: 'LEKKER50', label: 'R50 Off (Meals)', levelReq: 2 },
                  { code: 'GOLDFEAST', label: 'R120 Off (Feast)', levelReq: 3 }
                ].map((cp) => {
                  const userLevel = loyalty.xpLevel || 1;
                  const isUnlocked = userLevel >= cp.levelReq;
                  
                  return (
                    <button
                      key={cp.code}
                      type="button"
                      onClick={() => {
                        if (isUnlocked) {
                          setPromoCodeInput(cp.code);
                          handleApplyPromo(cp.code);
                        }
                      }}
                      disabled={!isUnlocked}
                      className={`px-2 py-1 rounded text-[8px] font-mono font-bold border transition-all ${
                        !isUnlocked
                          ? 'bg-neutral-950/20 border-white/5 text-zinc-600 cursor-not-allowed line-through'
                          : activeCoupon?.code === cp.code
                          ? 'bg-amber-500/10 border-amber-500/45 text-amber-300 font-black'
                          : 'bg-zinc-900 border-white/5 text-neutral-450 hover:bg-neutral-850 hover:text-white cursor-pointer'
                      }`}
                    >
                      {isUnlocked ? `🔓 ${cp.label}` : `🔒 Level ${cp.levelReq}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Loyalty coins rebate check integration */}
          {availablePointsPointsVal >= 10 && (
            <div
              className={`rounded-2xl border p-3.5 flex items-center justify-between transition-all cursor-pointer ${
                usePointsDiscount
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-orange-500/10 bg-[#120a06]/40 hover:border-orange-500/25'
              }`}
              onClick={() => setUsePointsDiscount(!usePointsDiscount)}
            >
              <div className="flex gap-2.5 items-center">
                <Ticket size={16} className={usePointsDiscount ? 'text-amber-400' : 'text-neutral-500'} />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-neutral-200 block">Burn Lekker Coins for Discount</span>
                  <span className="text-[9px] text-neutral-500 block">
                    Available: {availablePointsPointsVal} Coins = Max R{maxPointsDiscountVal.toFixed(2)} Off
                  </span>
                </div>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                usePointsDiscount ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-700'
              }`}>
                {usePointsDiscount && <Check size={11} className="stroke-[3.5px]" />}
              </div>
            </div>
          )}

          {/* South African Payment Gateway Gate choice toggler */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
              💳 Local Payment Gateway
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedGateway('Yoco')}
                className={`flex-1 py-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  selectedGateway === 'Yoco'
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-450 font-black glow-amber-soft'
                    : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:border-white/10'
                }`}
              >
                <span className="text-[11px] tracking-widest font-mono font-extrabold text-blue-400">YOCO</span>
                <span className="text-[8px] font-mono text-neutral-500 uppercase font-bold tracking-wider">Fast QR & Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGateway('PayFast')}
                className={`flex-1 py-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  selectedGateway === 'PayFast'
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-450 font-black glow-amber-soft'
                    : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:border-white/10'
                }`}
              >
                <span className="text-[11px] tracking-tight font-sans font-black text-rose-500">pf <span className="text-slate-100 italic">payfast</span></span>
                <span className="text-[8px] font-mono text-neutral-500 uppercase font-bold tracking-wider">EFT & Wallets</span>
              </button>
            </div>
          </div>

          {/* Payment instrument method toggle */}
          <div className="bg-[#120a06]/60 border border-orange-500/10 rounded-2xl overflow-hidden p-1 flex">
            <button
              id="inst-credit-card"
              type="button"
              onClick={() => setPaymentWallet('card')}
              className={`flex-1 py-1 px-1 rounded-xl text-[9px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                paymentWallet === 'card' ? 'bg-zinc-800 text-amber-400 border border-white/5 shadow-md' : 'text-neutral-500'
              }`}
            >
              <CreditCard size={10} /> Credit Card
            </button>
            <button
              id="inst-gpay"
              type="button"
              onClick={() => setPaymentWallet('google-pay')}
              className={`flex-1 py-1 px-1 rounded-xl text-[9px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                paymentWallet === 'google-pay' ? 'bg-zinc-800 text-amber-400 border border-white/5 shadow-md' : 'text-neutral-500'
              }`}
            >
              📱 Google Pay
            </button>
            <button
              id="inst-eft"
              type="button"
              onClick={() => setPaymentWallet('instant-eft')}
              className={`flex-1 py-1 px-1 rounded-xl text-[9px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                paymentWallet === 'instant-eft' ? 'bg-zinc-800 text-amber-400 border border-white/5 shadow-md' : 'text-neutral-500'
              }`}
            >
              🏦 Capitec / EFT
            </button>
          </div>

          {/* Pricing calculations details ledger */}
          <div className="glass-panel rounded-2xl p-4 text-[11px] text-neutral-400 space-y-2.5">
            <div className="flex justify-between items-center font-medium">
              <span>Cart Subtotal</span>
              <span className="font-mono text-neutral-300">R {subtotal.toFixed(2)}</span>
            </div>
            {usePointsDiscount && pointsDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-400 font-semibold font-sans">
                <span>Lekker Coins Redemptions Discount</span>
                <span className="font-mono">- R {pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            {activeCoupon && couponDiscount > 0 && (
              <div className="flex justify-between items-center text-[#fbbf24] font-semibold font-sans animate-pulse">
                <span>Coupon ({activeCoupon.code}) Discount</span>
                <span className="font-mono">- R {couponDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-medium">
              <span>
                Logistics & Service Fee {isDeliveryFree && <span className="text-[8px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1 py-0.2 rounded font-mono ml-1 uppercase">FREE TIER</span>}
              </span>
              <span className="font-mono text-neutral-300">
                {deliveryFee > 0 ? `R ${deliveryFee.toFixed(2)}` : 'R 0.00'}
              </span>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between items-center font-bold">
              <span className="text-white">Amount Due</span>
              <span id="cart-ledger-total" className="text-base text-amber-400 font-mono tracking-tight font-black glow-amber-soft">
                R {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout checkout triggers button */}
          <div className="space-y-2">
            <button
              id="cart-submit-checkout-btn"
              onClick={handleProcessPayment}
              className="w-full h-11 zest-gradient-bg zest-gradient-hover rounded-2xl text-neutral-950 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transform active:scale-98 transition-transform shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              <ShieldCheck size={14} className="stroke-[2.5px]" />
              Secure Pay using {selectedGateway}
            </button>
            <span className="text-[9px] text-neutral-500 font-mono flex items-center justify-center gap-1 select-none">
              🔒 SSL Encrypted • Yoco Level 1 PCI Compliant Platform
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
