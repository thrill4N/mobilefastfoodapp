import React, { useState, useMemo } from 'react';
import { Award, Sparkles, Trophy, Gift, CheckCircle2, AlertCircle, Clock, RotateCcw, ShoppingBag, ChevronDown, ChevronUp, User, Mail, Phone, MapPin, CreditCard, LogOut, FileText, Check, Ticket, Volume2, VolumeX, Smartphone } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LoyaltyRewards, RewardItem, Order, CartItem } from '../types';
import { REWARD_ITEMS } from '../data/menu';

interface LoyaltyViewProps {
  loyalty: LoyaltyRewards;
  onRedeemReward: (reward: RewardItem) => void;
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (val: string) => void;
  paymentPreference: 'card' | 'wallet' | 'points';
  setPaymentPreference: (val: 'card' | 'wallet' | 'points') => void;
  pastOrders: Order[];
  onReorderItem: (item: CartItem) => void;
  onReorderWholeOrder: (order: Order) => void;
  setActiveTab: (tab: 'home' | 'menu' | 'cart' | 'loyalty' | 'tracking') => void;
  onSignOut: () => void;
  onViewReceipt: (order: Order) => void;
}

export default function LoyaltyView({
  loyalty,
  onRedeemReward,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  deliveryAddress,
  setDeliveryAddress,
  paymentPreference,
  setPaymentPreference,
  pastOrders,
  onReorderItem,
  onReorderWholeOrder,
  setActiveTab,
  onSignOut,
  onViewReceipt,
}: LoyaltyViewProps) {
  // Local state for expandable/collapsible order accordions
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({
    '4921': true // First seed order expanded by default
  });

  // Profile preferences toggler state
  const [profileExpanded, setProfileExpanded] = useState(false);

  // QR Scanner Settings state sync with localStorage
  const [scanSoundsEnabled, setScanSoundsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lekker_scan_sounds') !== 'false';
  });
  const [hapticIntensity, setHapticIntensity] = useState<'off' | 'low' | 'medium' | 'high'>(() => {
    return (localStorage.getItem('lekker_haptic_intensity') as 'off' | 'low' | 'medium' | 'high') || 'medium';
  });

  const toggleScanSounds = () => {
    const newVal = !scanSoundsEnabled;
    setScanSoundsEnabled(newVal);
    localStorage.setItem('lekker_scan_sounds', String(newVal));
    triggerToast(`Scan sounds ${newVal ? 'enabled 🔊' : 'muted 🔇'}`);
  };

  const changeHapticIntensity = (intensity: 'off' | 'low' | 'medium' | 'high') => {
    setHapticIntensity(intensity);
    localStorage.setItem('lekker_haptic_intensity', intensity);
    triggerToast(`Haptic feedback set to ${intensity.toUpperCase()} 📳`);
    
    // Test vibration feedback
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        if (intensity === 'low') navigator.vibrate(40);
        else if (intensity === 'medium') navigator.vibrate([90, 50, 90]);
        else if (intensity === 'high') navigator.vibrate([150, 50, 150, 50, 150]);
      }
    } catch (e) {
      console.warn('Vibration rejected by host sandbox:', e);
    }
  };
  
  // Sorting state for Order History section
  const [orderSortBy, setOrderSortBy] = useState<'date' | 'cost'>('date');
  const [orderSortDirection, setOrderSortDirection] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Parse order date helper supporting standard and relative date string patterns
  const parseOrderDate = (timestamp: string): number => {
    if (!timestamp) return 0;
    
    const parsed = Date.parse(timestamp);
    if (!isNaN(parsed)) return parsed;
    
    const lower = timestamp.toLowerCase();
    
    if (lower.includes('today')) {
      const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
      const d = new Date();
      if (timeMatch) {
         d.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
      }
      return d.getTime();
    }
    
    if (lower.includes('yesterday')) {
      const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
      const d = new Date();
      d.setDate(d.getDate() - 1);
      if (timeMatch) {
         d.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
      }
      return d.getTime();
    }
    
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    for (let i = 0; i < months.length; i++) {
      if (lower.includes(months[i])) {
        const parts = lower.split(/[\s,]+/);
        const dayPart = parts.find(p => !isNaN(Number(p)) && Number(p) <= 31);
        const day = dayPart ? parseInt(dayPart, 10) : 1;
        const year = new Date().getFullYear();
        
        const d = new Date(year, i, day);
        const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          d.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
        } else {
          d.setHours(12, 0, 0, 0);
        }
        return d.getTime();
      }
    }
    
    const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const d = new Date();
      d.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
      return d.getTime();
    }
    
    return 0;
  };

  // Memoized sorted orders mapping
  const sortedPastOrders = useMemo(() => {
    return [...pastOrders].sort((a, b) => {
      if (orderSortBy === 'date') {
        const timeA = parseOrderDate(a.timestamp);
        const timeB = parseOrderDate(b.timestamp);
        
        if (timeA === timeB) {
          const idA = parseInt(a.id, 10);
          const idB = parseInt(b.id, 10);
          if (!isNaN(idA) && !isNaN(idB)) {
            return orderSortDirection === 'newest' ? idB - idA : idA - idB;
          }
          return orderSortDirection === 'newest' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
        }
        
        return orderSortDirection === 'newest' ? timeB - timeA : timeA - timeB;
      } else {
        return orderSortDirection === 'highest' ? b.total - a.total : a.total - b.total;
      }
    });
  }, [pastOrders, orderSortBy, orderSortDirection]);

  // Aggregate monthly spending velocity trends for the AreaChart
  const monthlySpendingData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    
    // Create chronological buckets for the last 6 months
    const monthlyBuckets: { month: string; monthIndex: number; year: number; spend: number; ordersCount: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyBuckets.push({
        month: `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        spend: 0,
        ordersCount: 0,
      });
    }

    // Allocate actual database orders to respective buckets
    pastOrders.forEach((order) => {
      const ms = parseOrderDate(order.timestamp);
      if (ms > 0) {
        const d = new Date(ms);
        const oMonth = d.getMonth();
        const oYear = d.getFullYear();
        
        const bucket = monthlyBuckets.find(b => b.monthIndex === oMonth && b.year === oYear);
        if (bucket) {
          bucket.spend += order.total;
          bucket.ordersCount += 1;
        }
      } else {
        // Fallback for Today/Yesterday relative dates matching the current month
        const d = new Date();
        const bucket = monthlyBuckets.find(b => b.monthIndex === d.getMonth() && b.year === d.getFullYear());
        if (bucket) {
          bucket.spend += order.total;
          bucket.ordersCount += 1;
        }
      }
    });

    // Baseline historical simulation to render elegant graphs for new users
    const mockBaselines = [185.00, 290.00, 140.00, 310.00, 225.05, 0.00];
    
    return monthlyBuckets.map((bucket, index) => {
      const baseline = mockBaselines[index] || 0;
      const totalSpend = bucket.spend + baseline;
      return {
        month: bucket.month,
        'Spend (R)': parseFloat(totalSpend.toFixed(2)),
        'Orders': bucket.ordersCount + (baseline > 0 ? Math.ceil(baseline / 90) : 0),
        'Coins Earned': Math.round(totalSpend * 0.1) // 10% cash back estimate
      };
    });
  }, [pastOrders]);
  
  // Local temporary edits state
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [tempPhone, setTempPhone] = useState(userPhone);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);
  const [tempPayment, setTempPayment] = useState(paymentPreference);

  // Hot feedback alert toast
  const [successToast, setSuccessToast] = useState<string | null>(null);


  const toggleOrderExpand = (id: string) => {
    setExpandedOrderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  
  // Choose badge color based on tier
  const getTierColor = () => {
    switch (loyalty.tier) {
      case 'Golden Chef':
        return 'from-amber-400 via-yellow-500 to-orange-500 text-yellow-300 border-yellow-500/30';
      case 'Silver Feast':
        return 'from-slate-300 via-zinc-400 to-slate-500 text-zinc-300 border-zinc-500/30';
      default: // Gold or Bronze Star
        return 'from-amber-600 to-amber-800 text-amber-300 border-amber-700/30';
    }
  };

  return (
    <div id="loyalty-view-container" className="flex flex-col p-4 pb-12 w-full text-white space-y-5">
      {/* Title page header */}
      <div>
        <span className="text-neutral-400 text-xs font-mono tracking-wider block">MZANSI SPECIAL REWARDS</span>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
          Lekker Club 🇿🇦
        </h2>
      </div>

      {/* Main Stats Card */}
      <div
        className="rounded-3xl border p-5 relative overflow-hidden glass-panel border-amber-500/15"
        style={{
          background: 'radial-gradient(130% 115% at 0% 0%, rgba(245, 158, 11, 0.22) 0%, rgba(234, 88, 12, 0.1) 50%, rgba(0,0,0,0) 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.08), 0 12px 32px 0 rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase font-bold">Lekker Coins Balance</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-amber-400 font-mono tracking-tighter glow-amber-soft">
                {loyalty.pointsBalance}
              </span>
              <span className="text-xs text-amber-200 font-extrabold font-mono">LC</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-500 font-mono tracking-wider block font-bold">TIER LEVEL</span>
            <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 justify-end ${loyalty.tier === 'Golden Chef' ? 'text-yellow-400 glow-amber-soft' : 'text-neutral-200'}`}>
              <Sparkles size={11} className="text-amber-400 animate-spin-slow glow-amber-soft" />
              {loyalty.tier}
            </span>
          </div>
        </div>

        {/* Level indicators or milestones */}
        <div className="mt-6 pt-5 border-t border-white/5 flex justify-between text-center gap-2">
          <div className="flex-1">
            <span className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase block">Bronze Star</span>
            <span className="text-[10px] font-extrabold text-neutral-400 font-mono">0 - 299 LC</span>
          </div>
          <div className="w-[1px] bg-white/5 self-stretch my-1" />
          <div className="flex-1">
            <span className="text-[9px] text-neutral-400 font-mono tracking-wider uppercase block font-medium">Silver Feast</span>
            <span className="text-[10px] font-extrabold text-amber-200/80 font-mono">300 - 699 LC</span>
          </div>
          <div className="w-[1px] bg-white/5 self-stretch my-1" />
          <div className="flex-1">
            <span className="text-[9px] text-amber-400 font-mono tracking-wider uppercase block font-bold">Golden Chef</span>
            <span className="text-[10px] font-black text-amber-400 font-mono glow-amber-soft">700+ LC</span>
          </div>
        </div>

        {/* Tier cash reward level info */}
        <div className="mt-4 p-3 rounded-2xl bg-neutral-950/40 border border-white/5 text-[10px] text-neutral-300 flex items-center gap-2.5">
          <Trophy size={14} className="text-amber-400 shrink-0 glow-amber-soft" />
          <span>
            {loyalty.tier === 'Golden Chef' && '🌟 Golden Tier: You earn 10% Cashback points & enjoy priority kitchen preparation!'}
            {loyalty.tier === 'Silver Feast' && '⭐ Silver Tier: You earn 5% Cashback points & enjoy free delivery option on orders!'}
            {loyalty.tier === 'Bronze Star' && '🥉 Bronze Tier: You earn 2% Cashback points on every Rand spent.'}
          </span>
        </div>
      </div>

      {/* 🏆 NEW: Gamey XP Level Progress Dashboard & Promo Coupon Reward Central */}
      <div
        id="xp-level-coupons-programme"
        className="rounded-3xl border border-orange-500/10 p-5 space-y-4 shadow-xl text-left"
        style={{
          background: 'linear-gradient(145deg, rgba(234, 88, 12, 0.08) 0%, rgba(12, 7, 5, 0.95) 100%)'
        }}
      >
        <div className="flex justify-between items-center bg-orange-600/5 p-2 rounded-2xl border border-orange-550/10 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
              <Trophy size={15} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[8px] font-mono text-orange-400 font-extrabold uppercase tracking-widest block text-left">XP LOYALTY LEVEL</span>
              <h4 className="text-xs font-black uppercase text-white tracking-tight text-left">
                Level {loyalty.xpLevel || 2}: {
                  (loyalty.xpLevel === 4 && 'Lekker Legend 👑') ||
                  (loyalty.xpLevel === 3 && 'Pretoria Prince 👑') ||
                  (loyalty.xpLevel === 2 && 'Gauteng Gourmet 🍖') ||
                  'Starter Chommie 🌱'
                }
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400">
            {loyalty.xpPoints || 3450} XP
          </span>
        </div>

        {/* Dynamic XP Progress Line */}
        <div className="space-y-1.5 pt-1 text-left">
          <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase font-black">
            <span>XP Accumulated</span>
            <span>
              {loyalty.xpPoints || 3450} / {
                ((loyalty.xpLevel || 2) === 4 && '15000 XP') ||
                ((loyalty.xpLevel || 2) === 3 && '10000 XP') ||
                ((loyalty.xpLevel || 2) === 2 && '5000 XP') ||
                '1000 XP'
              }
            </span>
          </div>
          <div className="w-full bg-[#0a0503] h-2.5 rounded-full p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-300 animate-pulse"
              style={{
                width: `${Math.min(100, Math.floor(((loyalty.xpPoints || 3450) / (
                  ((loyalty.xpLevel || 2) === 4 && 15000) ||
                  ((loyalty.xpLevel || 2) === 3 && 10000) ||
                  ((loyalty.xpLevel || 2) === 2 && 5000) ||
                  1000
                )) * 100))}%`
              }}
            />
          </div>
          <p className="text-[8.5px] text-zinc-400 leading-normal">
            💡 Earn **10 XP per R1 spent**, plus a **+250 XP bonus** for scanning food table items using the QR queue-buster scanner!
          </p>
        </div>

        {/* Unlocked / Redeemable Coupon Cards list */}
        <div className="space-y-2 pt-2 border-t border-white/5 text-left">
          <span className="text-[9px] font-mono text-zinc-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
            <Ticket size={11} className="text-[#fbbf24] shrink-0" />
            Promo Coupons Reward Programme:
          </span>

          <div className="grid grid-cols-1 gap-2">
            {[
              {
                code: 'QUEUESKIP',
                title: '15% Off Skip-Queue Coupon',
                desc: 'Enjoy immediate 15% discount on all custom meals scanned via table QR codes.',
                reqLevel: 1,
              },
              {
                code: 'LEKKER50',
                title: 'R50 Off Gauteng Celebration Gift',
                desc: 'Flat R50 deduction on single orders totaling R100 or higher.',
                reqLevel: 2,
              },
              {
                code: 'GOLDFEAST',
                title: 'R120 Off Lekker Executive Meal-Pack',
                desc: 'Spectacular R120 discount on single orders of R200 or more.',
                reqLevel: 3,
              }
            ].map((coupon) => {
              const currentLevel = loyalty.xpLevel || 1;
              const isUnlocked = currentLevel >= coupon.reqLevel;

              return (
                <div
                  key={coupon.code}
                  className={`border rounded-2xl p-3 flex flex-col justify-between gap-2.5 transition-all text-left ${
                    isUnlocked
                      ? 'bg-neutral-950/40 border-orange-500/10'
                      : 'bg-neutral-950/20 border-white/5 opacity-55'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-[10px] font-extrabold text-neutral-100 uppercase">{coupon.title}</h5>
                      <p className="text-[9px] text-zinc-400 mt-0.5 leading-tight">{coupon.desc}</p>
                    </div>
                    <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded leading-none shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                    }`}>
                      {isUnlocked ? 'Unlocked' : `Requires Lvl ${coupon.reqLevel}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                    <span className="font-mono text-[10px] text-amber-500 font-extrabold">
                      CODE: {isUnlocked ? coupon.code : '••••••••'}
                    </span>

                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(coupon.code);
                          }
                          triggerToast(`Successfully copied promo coupon code "${coupon.code}"! Use it inside your Cart! 📋`);
                        }}
                        className="text-[9px] bg-amber-500 text-neutral-950 px-2.5 py-1 font-extrabold rounded-lg hover:bg-amber-400 transition-colors uppercase cursor-pointer"
                      >
                        Copy Promo
                      </button>
                    ) : (
                      <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">
                        🔒 Reach lvl {coupon.reqLevel} to reveal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 👤 NEW: Mobile-First Profile & Preferences Manager */}
      <div id="customer-profile-management-card" className="glass-panel border-amber-500/10 rounded-3xl p-4 space-y-3">
        <button
          onClick={() => setProfileExpanded(!profileExpanded)}
          className="w-full flex justify-between items-center text-xs font-black uppercase tracking-wider text-neutral-200 hover:text-white cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <User size={14} className="text-amber-400" />
            My Mzansi Profile & Saved Preferences
          </span>
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold leading-none">
            {profileExpanded ? 'COLLAPSE' : 'EDIT'}
          </span>
        </button>

        {!profileExpanded ? (
          <div className="text-[10px] text-neutral-405 text-neutral-450 grid grid-cols-2 gap-2.5 pt-1">
            <div className="space-y-0.5">
              <span className="text-neutral-500 font-mono text-[8px] uppercase tracking-wider block">CUSTOMER NAME</span>
              <span className="text-white font-bold block truncate">{userName}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-neutral-500 font-mono text-[8px] uppercase tracking-wider block">CONTACT PHONE</span>
              <span className="text-white font-bold block truncate">{userPhone || 'Not Saved'}</span>
            </div>
            <div className="space-y-0.5 col-span-2">
              <span className="text-neutral-500 font-mono text-[8px] uppercase tracking-wider block font-bold">SAVED DELIVERY ADDRESS</span>
              <span className="text-white font-semibold flex items-center gap-1.5 leading-tight">
                <MapPin size={10} className="text-amber-400 shrink-0" />
                <span className="truncate">{deliveryAddress || 'No Address Saved yet'}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2.5 border-t border-white/5 animate-fade-in text-[10.5px]">
            {/* Name Input */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block leading-none">CHAMPION FULL NAME:</span>
              <div className="flex bg-neutral-950/40 p-2 rounded-xl border border-white/5 items-center gap-2">
                <User size={12} className="text-amber-500/70" />
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full font-bold"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block leading-none">SECURE EMAIL:</span>
              <div className="flex bg-neutral-950/40 p-2 rounded-xl border border-white/5 items-center gap-2">
                <Mail size={12} className="text-amber-500/70" />
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full"
                  placeholder="name@example.co.za"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block leading-none">CONTACT MOBILE PHONE:</span>
              <div className="flex bg-neutral-950/40 p-2 rounded-xl border border-white/5 items-center gap-2">
                <Phone size={12} className="text-amber-500/70" />
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full font-mono font-bold"
                  placeholder="082 555 1234"
                />
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block leading-none">DEFAULT SAVED ADDRESS:</span>
              <div className="flex bg-neutral-950/40 p-2 rounded-xl border border-white/5 items-start gap-2">
                <MapPin size={12} className="text-amber-500/70 mt-0.5" />
                <textarea
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  rows={2}
                  className="bg-transparent text-xs text-white outline-none w-full leading-relaxed resize-none"
                  placeholder="Enter full physical address for delivery hot-drops"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block leading-none">PREFFERED WALLET CHANNEL:</span>
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setTempPayment('card')}
                  className={`py-1.5 text-center text-[9px] font-bold rounded-lg border transition-all ${
                    tempPayment === 'card'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-950 border-white/5 text-neutral-400'
                  }`}
                >
                  💳 Card (Yoco)
                </button>
                <button
                  type="button"
                  onClick={() => setTempPayment('wallet')}
                  className={`py-1.5 text-center text-[9px] font-bold rounded-lg border transition-all ${
                    tempPayment === 'wallet'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-950 border-white/5 text-neutral-400'
                  }`}
                >
                  📱 Google Pay
                </button>
                <button
                  type="button"
                  onClick={() => setTempPayment('points')}
                  className={`py-1.5 text-center text-[9px] font-bold rounded-lg border transition-all ${
                    tempPayment === 'points'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-950 border-white/5 text-neutral-400'
                  }`}
                >
                  🪙 Coins Wallet
                </button>
              </div>
            </div>

            {/* Actions button group */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUserName(tempName);
                  setUserEmail(tempEmail);
                  setUserPhone(tempPhone);
                  setDeliveryAddress(tempAddress);
                  setPaymentPreference(tempPayment);
                  localStorage.setItem('lekker_username', tempName);
                  localStorage.setItem('lekker_email', tempEmail);
                  localStorage.setItem('lekker_phone', tempPhone);
                  localStorage.setItem('lekker_address', tempAddress);
                  localStorage.setItem('lekker_payment_pref', tempPayment);
                  setProfileExpanded(false);
                  triggerToast('Excellent, chommie! Saved profile updates successfully. 💾');
                }}
                className="flex-1 py-2 text-center bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-black tracking-wider text-[9px] uppercase rounded-xl cursor-pointer hover:opacity-95 text-shadow"
              >
                Save Settings 💾
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="px-3 py-2 border border-red-500/20 hover:border-red-500/50 text-red-400 text-[9px] font-mono tracking-wider uppercase rounded-xl cursor-pointer hover:bg-red-500/5 flex items-center gap-1 shrink-0"
              >
                <LogOut size={10} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ⚙️ QR SCANNER SETTINGS SECTION */}
      <div id="qr-scanner-settings-card" className="glass-panel border-amber-500/10 rounded-3xl p-4 space-y-3 text-left">
        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200 flex items-center gap-2">
          <Smartphone size={14} className="text-amber-400 rotate-12" />
          QR Queue-Buster Preferences
        </h4>
        <p className="text-[9.5px] text-neutral-400 leading-normal">
          Customize instant audio alerts and sensory physical feedback behaviors when scanning Lekker table QR codes.
        </p>

        <div className="space-y-4 pt-1 border-t border-white/5">
          {/* Toggle Scan Sounds */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 w-2/3">
              <span className="text-[10px] font-extrabold uppercase text-neutral-300 block">Scan Sounds</span>
              <span className="text-[8.5px] text-neutral-500 block">Synthesize cash-register chime rewards</span>
            </div>
            
            <button
              onClick={toggleScanSounds}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9.5px] font-mono tracking-wider uppercase font-bold cursor-pointer transition-all shrink-0 ${
                scanSoundsEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-neutral-950 border-white/5 text-neutral-500 hover:text-white'
              }`}
            >
              {scanSoundsEnabled ? (
                <>
                  <Volume2 size={13} className="text-amber-400 animate-pulse" />
                  ENABLED (ON)
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  MUTED (OFF)
                </>
              )}
            </button>
          </div>

          {/* Haptic Feedback Intensity */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-neutral-300 block">Haptic Feedback Intensity</span>
              <span className="text-[8.5px] text-neutral-500 block">Sensory mobile vibration trigger levels upon QR detections</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {(['off', 'low', 'medium', 'high'] as const).map((level) => {
                const isActive = hapticIntensity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => changeHapticIntensity(level)}
                    className={`py-1.5 text-center text-[9px] font-bold rounded-lg border transition-all uppercase font-mono cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 glow-amber-soft font-black'
                        : 'bg-neutral-950 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* How to earn details */}
      <div className="space-y-2.5">
        <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
          <Award size={13} className="text-amber-500" /> How to Burn & Earn
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-panel p-3 rounded-2xl text-[11px] leading-tight space-y-1">
            <span className="text-orange-400 font-black font-mono block">R1.00 = 1 LC</span>
            <p className="text-neutral-450 text-[10px]">Earn points with every meal purchase automatically.</p>
          </div>
          <div className="glass-panel p-3 rounded-2xl text-[11px] leading-tight space-y-1">
            <span className="text-amber-400 font-black font-mono block">10 LC = R1.00 Off</span>
            <p className="text-neutral-450 text-[10px]">Spend cash discount at checkout inside your cart.</p>
          </div>
        </div>
      </div>

      {/* 🧾 NEW: Order History & Quick Re-order section */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Clock size={13} className="text-amber-400 animate-pulse" /> Past Orders & Fast Re-order
            </span>
            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono">
              {pastOrders.length} Order{pastOrders.length !== 1 ? 's' : ''}
            </span>
          </h3>

          {/* 📈 Spends & Appetites Telemetry AreaChart */}
          <div 
            className="border p-4 rounded-[24px] space-y-3 shadow-xl"
            style={{
              background: 'radial-gradient(120% 110% at 50% 10%, rgba(245, 158, 11, 0.08) 0%, rgba(0, 0, 0, 0.35) 75%, rgba(0,0,0,0.7) 100%)',
              borderColor: 'rgba(245, 158, 11, 0.12)'
            }}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono text-amber-500 uppercase font-black tracking-wider block">
                  Spend Telemetry (Past 6 Months)
                </span>
                <h4 className="text-xs font-black text-neutral-100 uppercase tracking-tight">Monthly Spending Velocity</h4>
              </div>
              <span className="text-[7.5px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="h-32 w-full pr-1" id="monthly-spend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlySpendingData}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e130c" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#78716c"
                    fontSize={8}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#78716c"
                    fontSize={8}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `R${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0503',
                      border: '1px solid #451a03',
                      borderRadius: '12px',
                      fontSize: '9px',
                      color: '#fff',
                      fontFamily: 'monospace'
                    }}
                    formatter={(value: any) => [`R ${value}`, 'Total Spend']}
                  />
                  <Area
                    type="monotone"
                    dataKey="Spend (R)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Core insights overlay row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-zinc-400">
              <div>
                <span className="text-[7.5px] font-mono text-zinc-500 uppercase block font-bold">TOTAL DISBURSED</span>
                <span className="text-[11px] font-mono font-black text-amber-200">
                  R {monthlySpendingData.reduce((sum, curr) => sum + curr['Spend (R)'], 0).toFixed(2)}
                </span>
              </div>
              <div className="border-x border-white/5">
                <span className="text-[7.5px] font-mono text-zinc-500 uppercase block font-bold">COINS ACCRUED</span>
                <span className="text-[11px] font-mono font-black text-amber-400">
                  {monthlySpendingData.reduce((sum, curr) => sum + curr['Coins Earned'], 0)} LC
                </span>
              </div>
              <div>
                <span className="text-[7.5px] font-mono text-zinc-500 uppercase block font-bold">TOTAL VISITS</span>
                <span className="text-[11px] font-mono font-black text-neutral-350">
                  {monthlySpendingData.reduce((sum, curr) => sum + curr['Orders'], 0)} Meals
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Sorting Selector Bar mapped directly to toggling sorting properties */}
          {pastOrders.length > 0 && (
            <div id="past-orders-sorting-bar" className="flex items-center justify-between gap-2 bg-neutral-955/40 p-2 rounded-2xl border border-white/5 text-[10px]">
              <div className="flex items-center gap-1 px-1">
                <span className="text-neutral-500 font-mono text-[8.5px] uppercase tracking-normal font-bold">Sort:</span>
                <span className="text-[8.5px] font-mono text-amber-400 font-black uppercase">
                  {orderSortBy === 'date' 
                    ? (orderSortDirection === 'newest' ? 'Newest' : 'Oldest')
                    : (orderSortDirection === 'highest' ? 'Highest Price' : 'Lowest Price')
                  }
                </span>
              </div>
              
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="sort-by-date-toggle"
                  onClick={() => {
                    if (orderSortBy === 'date') {
                      setOrderSortDirection(prev => prev === 'newest' ? 'oldest' : 'newest');
                    } else {
                      setOrderSortBy('date');
                      setOrderSortDirection('newest');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl border text-[8.5px] font-mono tracking-wider uppercase transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                    orderSortBy === 'date'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-[#120a06]/20 border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  Date {orderSortBy === 'date' && (orderSortDirection === 'newest' ? '↓' : '↑')}
                </button>

                <button
                  type="button"
                  id="sort-by-cost-toggle"
                  onClick={() => {
                    if (orderSortBy === 'cost') {
                      setOrderSortDirection(prev => prev === 'highest' ? 'lowest' : 'highest');
                    } else {
                      setOrderSortBy('cost');
                      setOrderSortDirection('highest');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl border text-[8.5px] font-mono tracking-wider uppercase transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                    orderSortBy === 'cost'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-[#120a06]/20 border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  Total Cost {orderSortBy === 'cost' && (orderSortDirection === 'highest' ? '↓' : '↑')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visual toast/notification when a successful item has been added to their cart */}
        {successToast && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl flex items-center justify-between gap-2.5 animate-bounce-short">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse animate-ping" />
              <span className="leading-tight font-black">{successToast}</span>
            </div>
            <button
              onClick={() => setActiveTab('cart')}
              className="px-2.5 py-1 bg-emerald-500 text-neutral-950 text-[9px] font-black uppercase tracking-wider rounded-lg shrink-0 cursor-pointer hover:bg-emerald-400 transition-colors"
            >
              Go to Cart 🛒
            </button>
          </div>
        )}

        <div className="space-y-3">
          {pastOrders.length === 0 ? (
            <div className="glass-panel p-5 rounded-3xl text-center space-y-2 border-white/5 bg-neutral-950/45">
              <span className="text-3xl">🍲</span>
              <h4 className="text-[11px] font-extrabold text-[#d97706] uppercase tracking-wider">No Past Orders Found</h4>
              <p className="text-[10px] text-neutral-450 max-w-xs mx-auto leading-normal">
                Order some mouthwatering Gauteng snacks from the main Menu to stack up your Lekker Coins!
              </p>
            </div>
          ) : (
            sortedPastOrders.map((order) => {
              const isExpanded = !!expandedOrderIds[order.id];
              return (
                <div
                  key={order.id}
                  id={`past-order-card-${order.id}`}
                  className="rounded-3xl border border-white/5 bg-[#120a06]/40 overflow-hidden shadow-md transition-all duration-200"
                >
                  {/* Order summary header */}
                  <div className="p-3.5 flex items-center justify-between gap-2 bg-neutral-950/30 border-b border-white/5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold font-mono text-amber-400 tracking-tight text-xs uppercase">
                          Order #{order.id}
                        </span>
                        <span className="text-[7.5px] border border-orange-500/20 bg-orange-600/10 text-orange-400 font-bold px-1.5 py-0.2 rounded-full font-mono uppercase">
                          {order.diningOption}
                        </span>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-medium block">
                        📆 {order.timestamp}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <div className="text-xs font-black font-mono tracking-tight text-white">
                        R {order.total.toFixed(2)}
                      </div>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-bold font-mono">
                        DELIVERED ✓
                      </span>
                    </div>
                  </div>

                  {/* Expand button and rapid action bar */}
                  <div className="p-2.5 px-3.5 flex items-center justify-between gap-3 text-[10px] bg-neutral-950/25 border-b border-white/5">
                    <button
                      onClick={() => toggleOrderExpand(order.id)}
                      className="flex items-center gap-1 text-[10px] text-neutral-300 font-bold hover:text-white cursor-pointer transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={12} className="text-amber-500" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} className="text-amber-500" />
                          Show {order.items.reduce((total, item) => total + item.quantity, 0)} Item(s)
                        </>
                      )}
                    </button>

                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() => onViewReceipt(order)}
                        className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-855 border border-white/10 text-neutral-200 font-extrabold font-mono text-[8px] uppercase tracking-wider px-2 py-1 rounded-xl cursor-pointer transition-all active:scale-95 text-shadow"
                      >
                        <FileText size={10} className="text-amber-400" />
                        Receipt 📄
                      </button>

                      <button
                        onClick={() => {
                          onReorderWholeOrder(order);
                          triggerToast(`Entire order #${order.id} has been added to your cart!`);
                        }}
                        className="flex items-center gap-1 bg-[#d97706]/15 hover:bg-[#d97706]/25 border border-[#d97706]/35 text-amber-200 font-extrabold font-mono text-[8px] uppercase tracking-wider px-2 py-1 rounded-xl cursor-pointer transition-all active:scale-95 text-amber-300"
                      >
                        <RotateCcw size={10} className="text-amber-400" />
                        Re-order 🔁
                      </button>
                    </div>
                  </div>

                  {/* Items detailed breakdown list - toggled expand */}
                  {isExpanded && (
                    <div className="p-3.5 space-y-2.5 bg-[#0e0705]/40 duration-200">
                      {order.items.map((item, idx) => {
                        const toppingsList = item.selectedToppings.map(t => t.name).join(', ');
                        const toppingsSum = item.selectedToppings.reduce((acc, t) => acc + t.price, 0);
                        const itemSinglePrice = item.menuItem.price + toppingsSum;
                        
                        return (
                          <div
                            key={idx}
                            id={`past-order-item-${order.id}-${idx}`}
                            className="bg-neutral-950/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-3.5 text-[10.5px]"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-extrabold text-amber-500 text-[10.5px] font-mono">
                                  {item.quantity}x
                                </span>
                                <span className="font-bold text-neutral-100 block truncate">
                                  {item.menuItem.name}
                                </span>
                              </div>
                              {toppingsList && (
                                <p className="text-[9px] text-zinc-400 mt-0.5 leading-tight italic">
                                  +{toppingsList}
                                </p>
                              )}
                              {item.note && (
                                <p className="text-[8.5px] text-orange-400/80 mt-0.5 font-mono">
                                  Note: "{item.note}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-mono text-[10px] text-neutral-350">
                                R {(itemSinglePrice * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => {
                                  onReorderItem(item);
                                  triggerToast(`"${item.menuItem.name}" added to your cart!`);
                                }}
                                title="Re-order this item"
                                className="p-1.5 bg-neutral-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-amber-400 cursor-pointer transition-colors"
                              >
                                <ShoppingBag size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Gamified Active Streaks & Challenges */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
          <Trophy size={13} className="text-yellow-500" /> Streaks & Active Chommie Challenges
        </h3>
        
        <div className="glass-panel p-4 rounded-3xl border border-orange-500/10 space-y-3.5">
          {/* Daily Streak Indicator */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider block font-bold">DAILY ORDER STREAK</span>
              <span className="text-xs font-extrabold text-neutral-100 flex items-center gap-1">
                🔥 4-Day Lekker Streak! <span className="text-[10px] text-amber-500 font-mono">(Keep going)</span>
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="w-5.5 h-5.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-[10px] font-mono text-orange-400 font-black flex items-center justify-center glow-amber-soft">
                  ✓
                </span>
              ))}
              <span className="w-5.5 h-5.5 rounded-full bg-zinc-900 border border-zinc-805 text-[10px] font-mono text-neutral-500 font-bold flex items-center justify-center animate-pulse">
                5
              </span>
            </div>
          </div>

          <div className="w-full bg-[#0c0705] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: '80%' }} />
          </div>

          <span className="text-[9px] text-neutral-450 block leading-tight">
            Order one more Gauteng snack tomorrow to hits a **5-day streak reward** of 50 Lekker Coins!
          </span>

          <div className="h-[1px] bg-white/5" />

          {/* Quick Challenges list */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono tracking-wide text-zinc-500 uppercase font-black">WEEKLY BONUSES</span>
              <span className="text-[8px] bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold font-mono px-1.5 py-0.2 rounded">R100+ Value</span>
            </div>

            <div className="flex items-start gap-2.5 text-[10px]">
              <span className="text-[11px] bg-neutral-950 p-1.5 rounded-xl border border-white/5">🍛</span>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between font-bold text-neutral-200">
                  <span>Bunny-Chow Fanatic</span>
                  <span className="text-amber-400 text-[9px] font-mono hover:underline">1 / 2 Orders</span>
                </div>
                <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '50%' }} />
                </div>
                <p className="text-[8.5px] text-neutral-450 leading-none">Order 2 Bunny Chows this month • Progress: 1. Reward: <span className="font-mono text-amber-500 font-bold">+150 LC</span></p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[10px]">
              <span className="text-[11px] bg-neutral-950 p-1.5 rounded-xl border border-white/5">🌙</span>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between font-bold text-neutral-200">
                  <span>Midnight Snacker</span>
                  <span className="text-neutral-500 text-[9px] font-mono">0 / 1 Done</span>
                </div>
                <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '0%' }} />
                </div>
                <p className="text-[8.5px] text-neutral-450 leading-none">Order after 21:00 to satisfy late cravings • Reward: <span className="font-mono text-amber-500 font-bold">Free Vetkoek Coupon</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Redeem Store */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
          <Gift size={13} className="text-rose-500 animate-bounce" /> Redeem Free Mzansi Snacks
        </h3>

        <div className="space-y-2.5">
          {REWARD_ITEMS.map((reward) => {
            const progress = loyalty.pointsBalance;
            const canAfford = progress >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className={`border p-3 rounded-2xl flex items-center justify-between gap-3.5 transition-all ${
                  canAfford
                    ? 'border-orange-500/15 bg-[#120a06]/50 shadow-md'
                    : 'border-white/5 bg-neutral-950/40 opacity-70'
                }`}
              >
                {/* Visual left */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[11px] text-white tracking-wide block">{reward.title}</span>
                    <span className={`text-[9px] font-mono border font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${canAfford ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-neutral-950 border-white/5 text-neutral-500'}`}>
                      {reward.pointsCost} LC
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    {reward.description}
                  </p>
                </div>

                {/* Redeem Trigger state */}
                <div>
                  {canAfford ? (
                    <button
                      id={`redeem-btn-${reward.id}`}
                      onClick={() => onRedeemReward(reward)}
                      className="px-3.5 py-2 font-black font-mono text-[9px] uppercase tracking-wider rounded-xl zest-gradient-bg zest-gradient-hover text-neutral-950 transition-all cursor-pointer transform active:scale-95 shadow-md shadow-orange-500/10"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <div className="text-right whitespace-nowrap space-y-0.5">
                      <div className="text-[9px] font-mono text-zinc-650 font-bold flex items-center gap-0.5 justify-end text-neutral-550">
                        <AlertCircle size={9.5} /> LOCKED
                      </div>
                      <span className="text-[8px] font-mono text-neutral-500 block font-semibold">Need {reward.pointsCost - progress} LC</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
