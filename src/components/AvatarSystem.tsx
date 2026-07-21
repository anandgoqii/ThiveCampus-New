import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, Flame, Coins, Trophy, Sparkle,
  Lock, Check, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Compass, Backpack, ShoppingBag, Eye,
  HelpCircle, Award, Heart, CheckCircle2, UserCheck, Play
} from 'lucide-react';

// TYPES DEFINITION
export type AvatarCategory = 
  | 'FACE' 
  | 'HAIR' 
  | 'TOPS' 
  | 'BOTTOMS' 
  | 'SHOES' 
  | 'HEADWEAR' 
  | 'GLASSES' 
  | 'ACCESSORIES' 
  | 'BACKGROUNDS' 
  | 'EFFECTS';

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface AvatarItem {
  id: string;
  name: string;
  category: AvatarCategory;
  rarity: Rarity;
  unlockRequirement: string;
  need: number;
  have: number;
  unlocked: boolean;
  ctaText?: string;
  ctaSection?: string;
}

export interface EquippedItems {
  FACE: string;
  HAIR: string;
  TOPS: string;
  BOTTOMS: string;
  SHOES: string;
  HEADWEAR: string;
  GLASSES: string;
  ACCESSORIES: string;
  BACKGROUNDS: string;
  EFFECTS: string;
}

// THE AVATAR DATASETS & ASSET PATHS
export const SKIN_TONES = [
  { id: 'skin-1', name: 'Soft Sand', color: '#f5c69d' },
  { id: 'skin-2', name: 'Warm Honey', color: '#e0a370' },
  { id: 'skin-3', name: 'Rich Bronze', color: '#bc804c' },
  { id: 'skin-4', name: 'Deep Cocoa', color: '#8d5524' },
  { id: 'skin-5', name: 'Sleek Ebony', color: '#563312' },
];

export const HAIR_COLORS = [
  { id: 'hair-black', name: 'Classic Charcoal', color: '#2b2d31' },
  { id: 'hair-brown', name: 'Chestnut Brown', color: '#593e25' },
  { id: 'hair-blonde', name: 'Golden Amber', color: '#e3ad5d' },
  { id: 'hair-red', name: 'Crimson Flame', color: '#b83b27' },
  { id: 'hair-blue', name: 'Cosmic Blue', color: '#3173e6' },
];

export const INITIAL_EQUIPPED: EquippedItems = {
  FACE: 'face-happy',
  HAIR: 'hair-short',
  TOPS: 'top-common',
  BOTTOMS: 'bottom-jeans',
  SHOES: 'shoes-trainers',
  HEADWEAR: 'headwear-none',
  GLASSES: 'glasses-none',
  ACCESSORIES: 'accessory-none',
  BACKGROUNDS: 'bg-sunny',
  EFFECTS: 'effect-none',
};

// STATIC DATA FOR ITEMS
export const getAvatarItems = (stats: {
  points: number;
  coins: number;
  streak: number;
  waterCount: number;
  sleepHours: number;
  breathingCount: number;
  schoolTasksDone: number;
}): AvatarItem[] => {
  return [
    // FACE
    { id: 'face-happy', name: 'Cheerful Grin', category: 'FACE', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'face-cool', name: 'Chill Smile', category: 'FACE', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'face-sparkle', name: 'Joyful Starburst', category: 'FACE', rarity: 'RARE', unlockRequirement: 'Complete 3 daily quests today', need: 3, have: stats.waterCount >= 6 ? 3 : 2, unlocked: true },
    { id: 'face-determined', name: 'Determined Focus', category: 'FACE', rarity: 'EPIC', unlockRequirement: 'Complete a school challenge', need: 1, have: 1, unlocked: true },

    // HAIR
    { id: 'hair-short', name: 'Classic Crop', category: 'HAIR', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'hair-long', name: 'Waves of Flow', category: 'HAIR', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'hair-spike', name: 'Spiky Trim', category: 'HAIR', rarity: 'RARE', unlockRequirement: 'Maintain a 3-Day streak', need: 3, have: stats.streak, unlocked: stats.streak >= 3 },
    { id: 'hair-bun', name: 'High Top Bun', category: 'HAIR', rarity: 'RARE', unlockRequirement: 'Maintain a 5-Day streak', need: 5, have: stats.streak, unlocked: stats.streak >= 5 },

    // TOPS
    { id: 'top-common', name: 'Classic Teal Tee', category: 'TOPS', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'top-aqua', name: 'Aqua Hydration Hoodie', category: 'TOPS', rarity: 'RARE', unlockRequirement: 'Log water 20 days (Hydration Hero)', need: 20, have: 24, unlocked: true }, // earned
    { id: 'top-champion', name: 'Thrive Champion Jacket', category: 'TOPS', rarity: 'EPIC', unlockRequirement: 'Complete every daily quest for 7 days', need: 7, have: 5, unlocked: false, ctaText: 'View Today\'s Quests', ctaSection: 'today' },
    { id: 'top-scholar', name: 'Scholar Blazer', category: 'TOPS', rarity: 'RARE', unlockRequirement: 'Complete 25 school tasks', need: 25, have: 18, unlocked: false, ctaText: 'View School Tasks', ctaSection: 'today' },
    { id: 'top-gold', name: 'Gold Thrive Jacket', category: 'TOPS', rarity: 'LEGENDARY', unlockRequirement: 'Reach Gold Tier (2,500 TP)', need: 2500, have: stats.points, unlocked: stats.points >= 2500, ctaText: 'Check Points Table', ctaSection: 'rewards' },

    // BOTTOMS
    { id: 'bottom-jeans', name: 'Comfort Denim Jeans', category: 'BOTTOMS', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'bottom-shorts', name: 'Active Athlete Shorts', category: 'BOTTOMS', rarity: 'RARE', unlockRequirement: 'Complete 5 fitness goals', need: 5, have: 5, unlocked: true },
    { id: 'bottom-scholar', name: 'Sleek School Trousers', category: 'BOTTOMS', rarity: 'RARE', unlockRequirement: 'Complete 15 study quests', need: 15, have: 8, unlocked: false, ctaText: 'View Study Quests', ctaSection: 'today' },
    { id: 'bottom-gold', name: 'Gold Trim Sweats', category: 'BOTTOMS', rarity: 'LEGENDARY', unlockRequirement: 'Reach Gold Tier (2,500 TP)', need: 2500, have: stats.points, unlocked: stats.points >= 2500, ctaText: 'Check Points Table', ctaSection: 'rewards' },

    // SHOES
    { id: 'shoes-trainers', name: 'Standard Sport Runners', category: 'SHOES', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'shoes-slides', name: 'Aqua turquoise slides', category: 'SHOES', rarity: 'RARE', unlockRequirement: 'Log water 5 times', need: 5, have: 5, unlocked: true },
    { id: 'shoes-gold', name: '3D Golden Sneakers', category: 'SHOES', rarity: 'EPIC', unlockRequirement: 'Complete movement goal for 7 days', need: 7, have: 5, unlocked: false, ctaText: 'View Movement Quest', ctaSection: 'today' },

    // HEADWEAR
    { id: 'headwear-none', name: 'No Headwear', category: 'HEADWEAR', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'headwear-moon', name: 'Moonlit Cap', category: 'HEADWEAR', rarity: 'RARE', unlockRequirement: 'Log sleep 15 nights (Dream Champion)', need: 15, have: 18, unlocked: true }, // earned
    { id: 'headwear-band', name: 'Champion Star Headband', category: 'HEADWEAR', rarity: 'EPIC', unlockRequirement: 'Win or complete a School Challenge', need: 1, have: 0, unlocked: false, ctaText: 'Explore School Challenges', ctaSection: 'challenges' },
    { id: 'headwear-scholar', name: 'Scholar Mortarboard', category: 'HEADWEAR', rarity: 'LEGENDARY', unlockRequirement: 'Complete 15 study quests', need: 15, have: 8, unlocked: false, ctaText: 'Do Study Quest', ctaSection: 'today' },

    // GLASSES
    { id: 'glasses-none', name: 'No Glasses', category: 'GLASSES', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'glasses-specs', name: 'Sleek Circular Wireframes', category: 'GLASSES', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'glasses-happy', name: 'Happy Vibes Glasses', category: 'GLASSES', rarity: 'RARE', unlockRequirement: 'Mood check-ins for 20 days (Sunny Soul)', need: 20, have: 20, unlocked: true }, // earned
    { id: 'glasses-stars', name: 'Cosmic Star Shades', category: 'GLASSES', rarity: 'EPIC', unlockRequirement: 'Complete 12 wellness logs', need: 12, have: 12, unlocked: true },

    // ACCESSORIES
    { id: 'accessory-none', name: 'No Accessory', category: 'ACCESSORIES', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'accessory-backpack', name: 'Scholar Orange Backpack', category: 'ACCESSORIES', rarity: 'RARE', unlockRequirement: 'Complete 25 School Tasks (Scholar)', need: 25, have: 18, unlocked: false, ctaText: 'View School Tasks', ctaSection: 'today' },
    { id: 'accessory-band', name: 'Neon Active Wellness Band', category: 'ACCESSORIES', rarity: 'COMMON', unlockRequirement: 'Log movement activity 10 times', need: 10, have: 10, unlocked: true },

    // BACKGROUNDS
    { id: 'bg-sunny', name: 'Sunny Courtyard', category: 'BACKGROUNDS', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'bg-campfire', name: 'Warm Cozy Campfire', category: 'BACKGROUNDS', rarity: 'RARE', unlockRequirement: 'Log sleep 10 times', need: 10, have: 10, unlocked: true },
    { id: 'bg-study', name: 'Grand Study Hall', category: 'BACKGROUNDS', rarity: 'RARE', unlockRequirement: 'Finish 5 study quests', need: 5, have: 5, unlocked: true },
    { id: 'bg-nebula', name: 'Deep Space Nebula', category: 'BACKGROUNDS', rarity: 'EPIC', unlockRequirement: 'Dream Champion Badge unlocked', need: 1, have: 1, unlocked: true },
    { id: 'bg-peaks', name: 'Glorious Sunset Peaks', category: 'BACKGROUNDS', rarity: 'LEGENDARY', unlockRequirement: 'Move 20 days (Trailblazer)', need: 20, have: 15, unlocked: false, ctaText: 'Go to Movement Goals', ctaSection: 'today' },

    // SPECIAL EFFECTS
    { id: 'effect-none', name: 'No Visual Effects', category: 'EFFECTS', rarity: 'COMMON', unlockRequirement: 'Available by default', need: 0, have: 0, unlocked: true },
    { id: 'effect-aura', name: 'Calm Healing Aura', category: 'EFFECTS', rarity: 'RARE', unlockRequirement: '10 Breathing sessions (Zen Master)', need: 10, have: 12, unlocked: true }, // earned
    { id: 'effect-glow', name: 'Hydration Radiance Glow', category: 'EFFECTS', rarity: 'EPIC', unlockRequirement: 'Hydration Hero Badge', need: 1, have: 1, unlocked: true },
    { id: 'effect-streak', name: 'Streak Flame Ring', category: 'EFFECTS', rarity: 'EPIC', unlockRequirement: 'Maintain 10-day streak', need: 10, have: 19, unlocked: true },
    { id: 'effect-sparkle', name: 'Perfect Day Sparkles', category: 'EFFECTS', rarity: 'LEGENDARY', unlockRequirement: 'Complete all daily quests', need: 1, have: 1, unlocked: true },
  ];
};

// HELPER FOR RARITY COLOR FRAMES
export const getRarityTheme = (rarity: Rarity) => {
  switch (rarity) {
    case 'COMMON':
      return {
        bg: 'bg-neutral-50 border-neutral-200/80',
        text: 'text-neutral-500',
        badge: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        glow: 'shadow-sm border-neutral-100',
        color: 'rgba(115,115,115,0.1)'
      };
    case 'RARE':
      return {
        bg: 'bg-[#e4f6ec]/40 border-[#c2ecd6]',
        text: 'text-emerald-700',
        badge: 'bg-[#e4f6ec] text-emerald-800 border-[#c2ecd6]',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)] border-emerald-100',
        color: 'rgba(16,185,129,0.3)'
      };
    case 'EPIC':
      return {
        bg: 'bg-amber-50/40 border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        glow: 'shadow-[0_0_14px_rgba(245,158,11,0.2)] border-amber-100',
        color: 'rgba(245,158,11,0.4)'
      };
    case 'LEGENDARY':
      return {
        bg: 'bg-yellow-50/50 border-yellow-300',
        text: 'text-yellow-800 font-extrabold',
        badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.35)] border-yellow-200 animate-pulse',
        color: 'rgba(234,179,8,0.6)'
      };
  }
};

// THE VECTOR AVATAR RENDERER
export const RenderCustomAvatar: React.FC<{
  equipped: EquippedItems;
  skinId: string;
  hairColorId: string;
  size: number;
  rotationY?: number;
  zoom?: number;
}> = ({ equipped, skinId, hairColorId, size, rotationY = 0, zoom = 1 }) => {
  const skinColor = SKIN_TONES.find(s => s.id === skinId)?.color || '#f5c69d';
  const hairColor = HAIR_COLORS.find(h => h.id === hairColorId)?.color || '#2b2d31';

  // Background Styles
  const getBackgroundContent = () => {
    switch (equipped.BACKGROUNDS) {
      case 'bg-campfire':
        return (
          <>
            <defs>
              <linearGradient id="campfire-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#311c1c" />
              </linearGradient>
            </defs>
            <rect width="100" height="130" fill="url(#campfire-grad)" />
            {/* Stars */}
            <circle cx="20" cy="20" r="0.8" fill="#fff" opacity="0.6"/>
            <circle cx="80" cy="15" r="0.8" fill="#fff" opacity="0.8"/>
            <circle cx="50" cy="10" r="0.5" fill="#fff" opacity="0.5"/>
            <circle cx="85" cy="40" r="0.6" fill="#fff" opacity="0.4"/>
            {/* Campfire glow in bottom */}
            <circle cx="50" cy="120" r="30" fill="#f97316" opacity="0.25" filter="blur(8px)"/>
            <path d="M42 120 L46 110 L50 120 Z" fill="#ef4444" opacity="0.7"/>
            <path d="M48 122 L52 108 L56 122 Z" fill="#f97316" opacity="0.8"/>
            <path d="M45 125 L50 115 L55 125 Z" fill="#facc15" opacity="0.9"/>
          </>
        );
      case 'bg-study':
        return (
          <>
            <defs>
              <linearGradient id="study-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="100" height="130" fill="url(#study-grad)" />
            {/* Arch columns outline */}
            <path d="M10 130 L10 50 Q10 20, 50 20 Q90 20, 90 50 L90 130" fill="none" stroke="#334155" strokeWidth="2.5" opacity="0.6"/>
            <path d="M25 130 L25 65 Q25 40, 50 40 Q75 40, 75 65 L75 130" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.4"/>
            {/* Glowing lantern */}
            <circle cx="50" cy="20" r="4" fill="#fbbf24" opacity="0.2" filter="blur(4px)"/>
            <circle cx="50" cy="20" r="1.5" fill="#fff"/>
          </>
        );
      case 'bg-nebula':
        return (
          <>
            <defs>
              <linearGradient id="space-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#03001e" />
                <stop offset="50%" stopColor="#7303c0" />
                <stop offset="100%" stopColor="#ec38bc" />
              </linearGradient>
            </defs>
            <rect width="100" height="130" fill="url(#space-grad)" />
            {/* Stars */}
            <circle cx="15" cy="30" r="1" fill="#fff" opacity="0.9"/>
            <circle cx="75" cy="25" r="1.5" fill="#fff" opacity="0.8" filter="blur(0.5px)"/>
            <circle cx="85" cy="80" r="0.8" fill="#fff" opacity="0.5"/>
            <path d="M15 30 L10 30" stroke="#fff" strokeWidth="0.5" opacity="0.5"/>
            <path d="M15 30 L15 25" stroke="#fff" strokeWidth="0.5" opacity="0.5"/>
            {/* Cosmic dust blobs */}
            <circle cx="40" cy="40" r="15" fill="#06b6d4" opacity="0.15" filter="blur(10px)"/>
            <circle cx="65" cy="70" r="22" fill="#ec4899" opacity="0.1" filter="blur(12px)"/>
          </>
        );
      case 'bg-peaks':
        return (
          <>
            <defs>
              <linearGradient id="peaks-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="60%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
            <rect width="100" height="130" fill="url(#peaks-grad)" />
            {/* Giant setting sun */}
            <circle cx="50" cy="80" r="24" fill="#fef08a" opacity="0.4" />
            {/* Mountain Peaks */}
            <path d="M-10 130 L30 75 L70 130 Z" fill="#4c0519" opacity="0.9"/>
            <path d="M40 130 L75 60 L110 130 Z" fill="#5c0620" opacity="0.85"/>
            <path d="M15 130 L55 85 L90 130 Z" fill="#31000e" opacity="0.95"/>
            {/* Birds */}
            <path d="M20 30 Q25 25, 30 30" fill="none" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
            <path d="M28 35 Q32 31, 36 35" fill="none" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
          </>
        );
      case 'bg-sunny':
      default:
        return (
          <>
            <defs>
              <linearGradient id="sunny-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="60%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#f0fdf4" />
              </linearGradient>
            </defs>
            <rect width="100" height="130" fill="url(#sunny-grad)" />
            {/* Soft fluffy clouds */}
            <circle cx="15" cy="25" r="10" fill="#fff" opacity="0.65" />
            <circle cx="25" cy="25" r="7" fill="#fff" opacity="0.65" />
            <circle cx="85" cy="30" r="12" fill="#fff" opacity="0.5" />
            <circle cx="75" cy="32" r="8" fill="#fff" opacity="0.5" />
            {/* Grass horizon outline */}
            <rect x="0" y="115" width="100" height="15" fill="#dcfce7" />
            <circle cx="50" cy="130" r="40" fill="#bbf7d0" opacity="0.4" />
          </>
        );
    }
  };

  // Special Effects Styles
  const renderSpecialEffects = () => {
    switch (equipped.EFFECTS) {
      case 'effect-aura':
        return (
          <g>
            {/* Calm Aura radial pulse */}
            <circle cx="50" cy="50" r="28" fill="none" stroke="#0ea5e9" strokeWidth="3" opacity="0.15" className="animate-pulse" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.08" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#0ea5e9" strokeWidth="5" opacity="0.2" />
          </g>
        );
      case 'effect-glow':
        return (
          <g>
            {/* Glowing neon water rings */}
            <ellipse cx="50" cy="115" rx="35" ry="8" fill="none" stroke="#22d3ee" strokeWidth="2.5" opacity="0.6" />
            <ellipse cx="50" cy="115" rx="24" ry="5.5" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
            {/* Hydration floating droplets */}
            <circle cx="20" cy="95" r="2.5" fill="#22d3ee" opacity="0.8" />
            <circle cx="80" cy="85" r="1.8" fill="#22d3ee" opacity="0.7" />
            <circle cx="15" cy="65" r="1.5" fill="#22d3ee" opacity="0.6" />
            <circle cx="82" cy="105" r="2.2" fill="#22d3ee" opacity="0.8" />
          </g>
        );
      case 'effect-streak':
        return (
          <g>
            {/* Flame Frame / Glowing Fire ring */}
            <ellipse cx="50" cy="118" rx="40" ry="10" fill="none" stroke="#f97316" strokeWidth="4" opacity="0.3" filter="blur(2px)"/>
            <ellipse cx="50" cy="118" rx="40" ry="10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
            {/* Sparkles / Ember particles */}
            <path d="M22 100 L24 95 L26 100 L24 105 Z" fill="#ef4444" opacity="0.8"/>
            <path d="M78 90 L80 85 L82 90 L80 95 Z" fill="#f97316" opacity="0.9"/>
            <path d="M12 75 L14 71 L16 75 L14 79 Z" fill="#f59e0b" opacity="0.8"/>
            <path d="M85 65 L87 61 L89 65 L87 69 Z" fill="#ef4444" opacity="0.8"/>
          </g>
        );
      case 'effect-sparkle':
        return (
          <g>
            {/* Perfect Day Sparkle stars */}
            <path d="M20 40 L22 35 L24 40 L22 45 Z" fill="#facc15" className="animate-bounce" style={{ animationDelay: '0.2s' } as any}/>
            <path d="M78 30 L80 25 L82 30 L80 35 Z" fill="#facc15" className="animate-bounce" style={{ animationDelay: '0.7s' } as any}/>
            <path d="M15 90 L17 86 L19 90 L17 94 Z" fill="#67e8f9" className="animate-bounce" style={{ animationDelay: '0.4s' } as any}/>
            <path d="M84 95 L86 91 L88 95 L86 99 Z" fill="#a78bfa" className="animate-bounce" style={{ animationDelay: '0.9s' } as any}/>
            {/* Sparkle star atop of head */}
            <path d="M50 15 L52 8 L54 15 L52 22 Z" fill="#facc15" opacity="0.9"/>
          </g>
        );
      case 'effect-none':
      default:
        return null;
    }
  };

  const hasHat = equipped.HEADWEAR !== 'headwear-none';
  const hasHeadband = equipped.HEADWEAR === 'headwear-band';

  let hairClipUrl: string | undefined = undefined;
  if (equipped.HEADWEAR === 'headwear-moon') {
    hairClipUrl = 'hair-clip-cap';
  } else if (equipped.HEADWEAR === 'headwear-scholar') {
    hairClipUrl = 'hair-clip-scholar';
  }

  return (
    <div 
      className="relative flex items-center justify-center select-none overflow-hidden rounded-2xl shadow-inner border border-neutral-200/50 bg-neutral-900/5"
      style={{ 
        width: size, 
        height: size, 
        aspectRatio: '100 / 130' 
      }}
    >
      {/* RENDER THE FULL BODY AVATAR LAYER STACK */}
      <svg 
        viewBox="0 0 100 130" 
        width="100%" 
        height="100%" 
        className="transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) rotateY(${rotationY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <defs>
          {/* Cropped Hair Masks to prevent hairs peaking out from the top of hats */}
          <clipPath id="hair-clip-cap">
            <rect x="0" y="28" width="100" height="102" />
          </clipPath>
          <clipPath id="hair-clip-scholar">
            <rect x="0" y="23.5" width="100" height="106.5" />
          </clipPath>
        </defs>

        {/* Layer 1: Background Scene */}
        <g id="layer-background">
          {getBackgroundContent()}
        </g>

        {/* Layer 2: Special Effects (Aura/Glows) */}
        <g id="layer-effects">
          {renderSpecialEffects()}
        </g>

        {/* GROUNDED / STATIC GROUP (Legs, Bottoms, Shoes stay locked on ground) */}
        <g id="group-grounded">
          {/* Legs (Skin Base) */}
          <rect x="41" y="90" width="7.5" height="22" fill={skinColor} rx="3" />
          <rect x="51.5" y="90" width="7.5" height="22" fill={skinColor} rx="3" />

          {/* Layer 5: Bottoms Clothing */}
          <g id="layer-bottoms">
            {(() => {
              switch (equipped.BOTTOMS) {
                case 'bottom-shorts':
                  return (
                    <g>
                      {/* Active Shorts - emerald green */}
                      <path d="M35.5 88 L64.5 88 L64.5 101 L51 101 L51 90 L49 90 L49 101 L35.5 101 Z" fill="#10b981" />
                      {/* White drawstrings & trim */}
                      <rect x="48.5" y="88" width="3" height="4" fill="#fff" />
                      <line x1="35.5" y1="100" x2="49" y2="100" stroke="#fff" strokeWidth="1" />
                      <line x1="51" y1="100" x2="64.5" y2="100" stroke="#fff" strokeWidth="1" />
                    </g>
                  );
                case 'bottom-scholar':
                  return (
                    <g>
                      {/* Sleek Charcoal Trousers */}
                      <rect x="40.5" y="88" width="8.5" height="23" fill="#374151" rx="2" />
                      <rect x="51" y="88" width="8.5" height="23" fill="#374151" rx="2" />
                      <rect x="35.5" y="88" width="29" height="5" fill="#374151" />
                      <line x1="44.5" y1="91" x2="44.5" y2="111" stroke="#4b5563" strokeWidth="1" />
                      <line x1="55" y1="91" x2="55" y2="111" stroke="#4b5563" strokeWidth="1" />
                    </g>
                  );
                case 'bottom-gold':
                  return (
                    <g>
                      {/* Black sweats with gold side trim */}
                      <rect x="40" y="88" width="9" height="23" fill="#171717" rx="3" />
                      <rect x="51" y="88" width="9" height="23" fill="#171717" rx="3" />
                      <rect x="35.5" y="88" width="29" height="6" fill="#171717" />
                      {/* Golden stripes */}
                      <line x1="41" y1="90" x2="41" y2="111" stroke="#eab308" strokeWidth="1.2" />
                      <line x1="59" y1="90" x2="59" y2="111" stroke="#eab308" strokeWidth="1.2" />
                    </g>
                  );
                case 'bottom-jeans':
                default:
                  return (
                    <g>
                      {/* Comfort Denim Jeans */}
                      <rect x="40" y="88" width="9" height="23" fill="#2563eb" rx="2.5" />
                      <rect x="51" y="88" width="9" height="23" fill="#2563eb" rx="2.5" />
                      <rect x="35.5" y="88" width="29" height="6" fill="#2563eb" />
                      {/* Pocket stitches */}
                      <path d="M38 90 C38 92, 42 92, 42 90" fill="none" stroke="#facc15" strokeWidth="0.8" />
                      <path d="M58 90 C58 92, 62 92, 62 90" fill="none" stroke="#facc15" strokeWidth="0.8" />
                    </g>
                  );
              }
            })()}
          </g>

          {/* Layer 6: Shoes */}
          <g id="layer-shoes">
            {(() => {
              switch (equipped.SHOES) {
                case 'shoes-slides':
                  return (
                    <g>
                      {/* Turquoise beach slides over skin feet */}
                      <rect x="37" y="109" width="13" height="4.5" fill="#22d3ee" rx="2" />
                      <rect x="50" y="109" width="13" height="4.5" fill="#22d3ee" rx="2" />
                      <rect x="39" y="106" width="9" height="2.5" fill="#0891b2" />
                      <rect x="52" y="106" width="9" height="2.5" fill="#0891b2" />
                    </g>
                  );
                case 'shoes-gold':
                  return (
                    <g>
                      {/* Shimmering Golden Sneakers */}
                      <path d="M35 109 L49 109 L49 113.5 L35 113.5 Z" fill="#eab308" />
                      <path d="M37 106 L47 106 L47 109 L35 109 Z" fill="#facc15" />
                      <circle cx="45" cy="110" r="1.5" fill="#fff" />

                      <path d="M51 109 L65 109 L65 113.5 L51 113.5 Z" fill="#eab308" />
                      <path d="M53 106 L63 106 L65 109 L51 109 Z" fill="#facc15" />
                      <circle cx="55" cy="110" r="1.5" fill="#fff" />
                    </g>
                  );
                case 'shoes-trainers':
                default:
                  return (
                    <g>
                      {/* Red/White Sport Trainers */}
                      <path d="M35 109 L49 109 L49 113 L35 113 Z" fill="#ffffff" />
                      <path d="M37 106 L47 106 L47 109 L35 109 Z" fill="#dc2626" />
                      <line x1="41" y1="106" x2="44" y2="109" stroke="#fff" strokeWidth="1" />

                      <path d="M51 109 L65 109 L65 113 L51 113 Z" fill="#ffffff" />
                      <path d="M53 106 L63 106 L65 109 L51 109 Z" fill="#dc2626" />
                      <line x1="56" y1="106" x2="59" y2="109" stroke="#fff" strokeWidth="1" />
                    </g>
                  );
              }
            })()}
          </g>
        </g>

        {/* ANIMATED UPPER BODY / TORSO GROUP (Torso scales and moves gently for breathing loop) */}
        <motion.g 
          id="group-torso"
          animate={{
            y: [0, -0.8, 0],
            scaleY: [1, 1.02, 1],
            scaleX: [1, 1.006, 1],
          }}
          transition={{
            duration: 4.0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transformOrigin: "50px 92px"
          }}
        >
          {/* Layer 3: Accessory Behind Torso (like Backpack) */}
          {equipped.ACCESSORIES === 'accessory-backpack' && (
            <g id="layer-backpack">
              {/* Large school backpack behind body */}
              <rect x="35" y="66" width="30" height="28" rx="8" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
              <rect x="41" y="72" width="18" height="15" rx="4" fill="#ea580c" />
              {/* Top loop handle */}
              <path d="M43 66 Q50 58, 57 66" fill="none" stroke="#f97316" strokeWidth="3" />
            </g>
          )}

          {/* Skin Torso, Neck, and Arms */}
          {/* Torso Base */}
          <path d="M36 68 C36 58, 64 58, 64 68 L64 92 L36 92 Z" fill={skinColor} />

          {/* Neck */}
          <rect x="46" y="52" width="8" height="8" fill={skinColor} rx="2" />

          {/* Left Arm (Skin) */}
          <path d="M36 64 C28 72, 28 85, 31 92" fill="none" stroke={skinColor} strokeWidth="6.5" strokeLinecap="round" />
          {/* Right Arm (Skin) */}
          <path d="M64 64 C72 72, 72 85, 69 92" fill="none" stroke={skinColor} strokeWidth="6.5" strokeLinecap="round" />

          {/* Layer 7: Tops Clothing */}
          <g id="layer-tops">
            {(() => {
              switch (equipped.TOPS) {
                case 'top-aqua':
                  return (
                    <g>
                      {/* Aqua Hydration Hoodie */}
                      <path d="M36 64 C36 56, 64 56, 64 64 L64 90 L36 90 Z" fill="#06b6d4" />
                      {/* Sleeves */}
                      <path d="M36 64 C28 72, 28 85, 31 88" fill="none" stroke="#0891b2" strokeWidth="7" strokeLinecap="round" />
                      <path d="M64 64 C72 72, 72 85, 69 88" fill="none" stroke="#0891b2" strokeWidth="7" strokeLinecap="round" />
                      {/* Large glowing water drop logo on front */}
                      <path d="M50 72 C47 75, 47 79, 50 82 C53 79, 53 75, 50 72 Z" fill="#22d3ee" />
                      {/* White drawstrings */}
                      <line x1="47" y1="62" x2="47" y2="70" stroke="#fff" strokeWidth="1" />
                      <line x1="53" y1="62" x2="53" y2="70" stroke="#fff" strokeWidth="1" />
                    </g>
                  );
                case 'top-champion':
                  return (
                    <g>
                      {/* Thrive Champion Jacket - Crimson Red & White sleeves */}
                      <path d="M36 64 C36 56, 64 56, 64 64 L64 90 L36 90 Z" fill="#dc2626" />
                      {/* White contrast raglan sleeves */}
                      <path d="M36 64 C28 72, 28 85, 31 88" fill="none" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
                      <path d="M64 64 C72 72, 72 85, 69 88" fill="none" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
                      {/* Gold star on center chest */}
                      <path d="M50 70 L51.5 73.5 L55 73.5 L52 75.5 L53 79 L50 77 L47 79 L48 75.5 L45 73.5 L48.5 73.5 Z" fill="#fbbf24" />
                      {/* Striped collar & waistband */}
                      <rect x="42" y="58" width="16" height="3" fill="#1e293b" />
                      <rect x="36" y="88" width="28" height="2" fill="#1e293b" />
                    </g>
                  );
                case 'top-scholar':
                  return (
                    <g>
                      {/* Scholar blazer - Navy & Gold button detail */}
                      <path d="M35 64 C35 56, 65 56, 65 64 L65 90 L35 90 Z" fill="#1e3a8a" />
                      {/* Sleeves */}
                      <path d="M36 64 C28 72, 28 85, 31 88" fill="none" stroke="#1e3a8a" strokeWidth="7.5" strokeLinecap="round" />
                      <path d="M64 64 C72 72, 72 85, 69 88" fill="none" stroke="#1e3a8a" strokeWidth="7.5" strokeLinecap="round" />
                      {/* Yellow tie & white shirt peeking */}
                      <path d="M47 58 L53 58 L50 66 Z" fill="#ffffff" />
                      <path d="M49 61 L51 61 L52 72 L50 74 L48 72 Z" fill="#fbbf24" />
                      {/* Blazer collar */}
                      <path d="M43 58 L47 68 L36 78" fill="none" stroke="#172554" strokeWidth="2.5" />
                      <path d="M57 58 L53 68 L64 78" fill="none" stroke="#172554" strokeWidth="2.5" />
                      {/* Gold buttons */}
                      <circle cx="48" cy="76" r="1.2" fill="#f59e0b" />
                      <circle cx="48" cy="82" r="1.2" fill="#f59e0b" />
                    </g>
                  );
                case 'top-gold':
                  return (
                    <g>
                      {/* Gold Thrive Jacket - Metallic gold gradient & black trims */}
                      <defs>
                        <linearGradient id="gold-jacket-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ca8a04" />
                        </linearGradient>
                      </defs>
                      <path d="M36 64 C36 56, 64 56, 64 64 L64 90 L36 90 Z" fill="url(#gold-jacket-grad)" />
                      {/* Sleeves */}
                      <path d="M36 64 C28 72, 28 85, 31 88" fill="none" stroke="#eab308" strokeWidth="7" strokeLinecap="round" />
                      <path d="M64 64 C72 72, 72 85, 69 88" fill="none" stroke="#eab308" strokeWidth="7" strokeLinecap="round" />
                      {/* Black zipper line */}
                      <line x1="50" y1="58" x2="50" y2="90" stroke="#171717" strokeWidth="1.8" />
                      {/* Glowing golden emblem on right chest */}
                      <circle cx="45" cy="70" r="1.5" fill="#ffffff" opacity="0.8" className="animate-pulse" />
                    </g>
                  );
                case 'top-common':
                default:
                  return (
                    <g>
                      {/* Simple Teal Tee */}
                      <path d="M36 64 C36 56, 64 56, 64 64 L64 90 L36 90 Z" fill="#0d9488" />
                      <path d="M36 64 C28 72, 28 85, 31 88" fill="none" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
                      <path d="M64 64 C72 72, 72 85, 69 88" fill="none" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
                      {/* Neck trim */}
                      <ellipse cx="50" cy="58" rx="7" ry="2" fill="#115e59" />
                    </g>
                  );
              }
            })()}
          </g>

          {/* Layer 12: Hand Accessory (Wellness Band/etc.) */}
          {equipped.ACCESSORIES === 'accessory-band' && (
            <g id="layer-accessories">
              {/* Bright neon fitness band on wrist */}
              <rect x="28.5" y="79" width="4.2" height="2.2" fill="#22c55e" rx="0.5" />
            </g>
          )}
        </motion.g>

        {/* ANIMATED HEAD GROUP (Bobbing lags slightly behind torso with secondary rotation & phase shift) */}
        <motion.g 
          id="group-head"
          animate={{
            y: [-0.2, -1.2, -0.2, 0, -0.2],
            rotate: [-0.4, 0.8, -0.8, -0.4],
          }}
          transition={{
            duration: 4.0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transformOrigin: "50px 52px"
          }}
        >
          {/* Sculpted Head Shape (Graceful jaw tapering down to a soft, rounded chin) */}
          <path 
            d="M 34.5 35 C 34.5 24, 65.5 24, 65.5 35 C 65.5 44, 60.2 52.2, 50 52.8 C 39.8 52.2, 34.5 44, 34.5 35 Z" 
            fill={skinColor} 
          />
          {/* Left Ear with inner shadow depth */}
          <circle cx="34" cy="39" r="3.2" fill={skinColor} />
          <circle cx="34.5" cy="39" r="1.6" fill="#8c4f2b" opacity="0.22" />
          
          {/* Right Ear with inner shadow depth */}
          <circle cx="66" cy="39" r="3.2" fill={skinColor} />
          <circle cx="65.5" cy="39" r="1.6" fill="#8c4f2b" opacity="0.22" />

          {/* Sweet Rosy Cheeks (Soft blush overlays) */}
          <ellipse cx="39.5" cy="41.5" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.22" />
          <ellipse cx="60.5" cy="41.5" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.22" />

          {/* Cute subtle button nose curve */}
          <path d="M48.8 39.5 Q50 40.7, 51.2 39.5" fill="none" stroke="#8c4f2b" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" />

          {/* Layer 8: Face Detail Expressions (Eyes with cute dynamic blink overlay) */}
          <g id="layer-face">
            {(() => {
              switch (equipped.FACE) {
                case 'face-cool':
                  return (
                    <g>
                      {/* Eyes with Blink */}
                      <motion.g
                        animate={{ scaleY: [1, 1, 1, 0.1, 1, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.85, 0.88, 0.9, 0.92, 1], ease: "easeInOut" }}
                        style={{ transformOrigin: "50px 36px" }}
                      >
                        <ellipse cx="45" cy="36" rx="1.5" ry="2" fill="#1e293b" />
                        <ellipse cx="55" cy="36" rx="1.5" ry="2" fill="#1e293b" />
                        {/* Eye catchlight highlights */}
                        <circle cx="44.4" cy="35.2" r="0.5" fill="#ffffff" />
                        <circle cx="54.4" cy="35.2" r="0.5" fill="#ffffff" />
                      </motion.g>
                      {/* Eyebrows flat */}
                      <line x1="41.5" y1="31" x2="48" y2="31" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="52" y1="31" x2="58.5" y2="31" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                      {/* Grin smile to side */}
                      <path d="M47 43.5 Q51 45.5, 54 43" fill="none" stroke="#8c4f2b" strokeWidth="1.8" strokeLinecap="round" />
                    </g>
                  );
                case 'face-sparkle':
                  return (
                    <g>
                      {/* Sparkle Eyes with Blink */}
                      <motion.g
                        animate={{ scaleY: [1, 1, 1, 0.1, 1, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.85, 0.88, 0.9, 0.92, 1], ease: "easeInOut" }}
                        style={{ transformOrigin: "50px 36px" }}
                      >
                        <path d="M42 36 L44 34 L46 36 L44 38 Z" fill="#fbbf24" />
                        <path d="M54 36 L56 34 L58 36 L56 38 Z" fill="#fbbf24" />
                      </motion.g>
                      {/* Cheerful wide open happy mouth */}
                      <path d="M44 43 Q50 49, 56 43 Z" fill="#b91c1c" />
                      <ellipse cx="50" cy="46" rx="4" ry="1.5" fill="#f43f5e" />
                    </g>
                  );
                case 'face-determined':
                  return (
                    <g>
                      {/* Determined Eyes with Blink */}
                      <motion.g
                        animate={{ scaleY: [1, 1, 1, 0.1, 1, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.85, 0.88, 0.9, 0.92, 1], ease: "easeInOut" }}
                        style={{ transformOrigin: "50px 36px" }}
                      >
                        <path d="M42 36.5 L47 35.5" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M53 35.5 L58 36.5" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                      </motion.g>
                      {/* Eyebrows slanted down */}
                      <line x1="41.5" y1="31" x2="47" y2="33" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="53" y1="33" x2="58.5" y2="31" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
                      {/* Confident smirk */}
                      <path d="M46 44 L54 44" stroke="#8c4f2b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  );
                case 'face-happy':
                default:
                  return (
                    <g>
                      {/* Eyes with Blink */}
                      <motion.g
                        animate={{ scaleY: [1, 1, 1, 0.1, 1, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.85, 0.88, 0.9, 0.92, 1], ease: "easeInOut" }}
                        style={{ transformOrigin: "50px 36px" }}
                      >
                        <circle cx="44.5" cy="36" r="1.8" fill="#1e293b" />
                        <circle cx="55.5" cy="36" r="1.8" fill="#1e293b" />
                        {/* High-quality 3D dual-catchlight eye highlights */}
                        <circle cx="43.8" cy="35.2" r="0.6" fill="#ffffff" />
                        <circle cx="45.1" cy="36.7" r="0.3" fill="#ffffff" opacity="0.8" />
                        
                        <circle cx="54.8" cy="35.2" r="0.6" fill="#ffffff" />
                        <circle cx="56.1" cy="36.7" r="0.3" fill="#ffffff" opacity="0.8" />
                      </motion.g>
                      {/* Friendly Eyebrows */}
                      <path d="M41 31.5 Q44.5 29.5, 47.5 31.5" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M52.5 31.5 Q55.5 29.5, 59 31.5" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                      {/* Broad sweet smile */}
                      <path d="M44.5 42 C46 45, 54 45, 55.5 42" fill="none" stroke="#8c4f2b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  );
              }
            })()}
          </g>

          {/* Layer 9: Hair Style with dynamic secondary physics and hat clipping path */}
          <motion.g 
            id="layer-hair"
            clipPath={hairClipUrl ? `url(#${hairClipUrl})` : undefined}
            animate={{
              rotate: [0.6, -0.6, 0.6],
              y: [0, 0.3, 0],
            }}
            transition={{
              duration: 4.0,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              transformOrigin: "50px 25px"
            }}
          >
            {(() => {
              switch (equipped.HAIR) {
                case 'hair-long':
                  return (
                    <g>
                      {/* Long wavy hair falling back */}
                      <path 
                        d={hasHat && !hasHeadband
                          ? "M33 32 C33 26, 67 26, 67 32 C67 45, 68 55, 64 62 C59 58, 41 58, 36 62 C32 55, 33 45, 33 32 Z"
                          : "M33 32 C33 21, 67 21, 67 32 C67 45, 68 55, 64 62 C59 58, 41 58, 36 62 C32 55, 33 45, 33 32 Z"
                        } 
                        fill={hairColor} 
                      />
                      <path d="M34 32 C35 24, 45 24, 48 30 C51 24, 63 24, 65 32" fill="none" stroke={hairColor} strokeWidth="2.5" />
                      
                      {/* Flowing shoulder waves and locks with secondary soft swing */}
                      <motion.g
                        animate={{
                          rotate: [1.8, -1.8, 1.8],
                          skewX: [1.2, -1.2, 1.2],
                          y: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 4.0,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          transformOrigin: "50px 35px"
                        }}
                      >
                        <path d="M32.5 35 Q29 50, 31 70 Q32 75, 34 72 Q35 68, 36 55 Z" fill={hairColor} />
                        <path d="M67.5 35 Q71 50, 69 70 Q68 75, 66 72 Q65 68, 64 55 Z" fill={hairColor} />
                        {/* Highlights */}
                        <path d="M33 38 Q30.5 50, 32.5 65" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.18" />
                        <path d="M67 38 Q69.5 50, 67.5 65" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.18" />
                      </motion.g>
                    </g>
                  );
                case 'hair-spike':
                  return (
                    <motion.g
                      animate={{
                        scaleY: [1, 0.97, 1],
                        scaleX: [1, 1.01, 1],
                      }}
                      transition={{
                        duration: 4.0,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        transformOrigin: "50px 35px"
                      }}
                    >
                      {/* Cool Spiky Hair */}
                      {hasHat && !hasHeadband ? (
                        /* Flatter spikes logic to prevent clipping out of hats */
                        <path 
                          d="M33 34 L35 28 L38 30 L41 26 L45 28 L50 24 L55 27 L60 25 L62 29 L65 27 L67 34 Q67 35, 67 42 L64 36 C59 33, 56 35, 54 37 C48 33, 44 35, 42 37 C38 34, 35 36, 33 42 Z" 
                          fill={hairColor} 
                        />
                      ) : (
                        /* Full glorious spiky hair */
                        <path 
                          d="M33 34 L35 23 L38 27 L41 16 L45 21 L50 12 L55 19 L60 15 L62 24 L65 22 L67 34 Q67 35, 67 42 L64 36 C59 33, 56 35, 54 37 C48 33, 44 35, 42 37 C38 34, 35 36, 33 42 Z" 
                          fill={hairColor} 
                        />
                      )}
                      {/* High-fidelity spiky inner textures */}
                      <path d="M38 29 L41 21 L43 28" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.15" />
                      <path d="M48 24 L50 16 L52 23" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.15" />
                    </motion.g>
                  );
                case 'hair-bun':
                  return (
                    <g>
                      {/* Top bun hair with springy secondary sway (hidden when wearing clipping hats) */}
                      {(!hasHat || hasHeadband) ? (
                        <motion.g
                          animate={{
                            rotate: [1.8, -1.8, 1.8],
                            x: [0.3, -0.3, 0.3],
                          }}
                          transition={{
                            duration: 4.0,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{
                            transformOrigin: "50px 24px"
                          }}
                        >
                          <circle cx="50" cy="17" r="7" fill={hairColor} />
                          {/* Braid textures */}
                          <path d="M47 17 C48 14, 52 14, 53 17" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />
                          <path d="M45 19 C47 16, 53 16, 55 19" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />
                          <rect x="44.5" y="21" width="11" height="2.2" fill="#fbbf24" rx="0.5" /> {/* Golden hair tie */}
                        </motion.g>
                      ) : null}
                      {/* Redesigned base with sideburns and swept front styling */}
                      <path d="M33 42 Q33 36, 32 34 C32 23, 68 23, 68 34 Q67 36, 67 42 L64 37 C61 34, 55 33, 50 35 C45 33, 39 34, 36 37 Z" fill={hairColor} />
                    </g>
                  );
                case 'hair-short':
                default:
                  return (
                    <g>
                      {/* Classic clean short hair crop with sideburns and soft bangs */}
                      <path 
                        d="M33 42 Q33 36, 32 35 C32 21, 68 21, 68 35 Q67 36, 67 42 L64.5 37 C62 31, 57 29, 54 32 C52 29, 44 29, 42 32 C40 30, 36 32, 34 37 Z" 
                        fill={hairColor} 
                      />
                      {/* Highlighted curves for 3D hair volume */}
                      <path d="M34 32 C37 26, 45 25, 50 25 C55 25, 63 26, 66 32" fill="none" stroke={hairColor} strokeWidth="1.5" opacity="0.4" />
                      {/* Small stylish dynamic cowlick with soft breeze waggle if not covered by a hat */}
                      {!hasHat && (
                        <motion.path 
                          d="M48 21 Q47 18, 49 16 Q51 18, 50 21 Z" 
                          fill={hairColor} 
                          animate={{
                            rotate: [4, -4, 4],
                          }}
                          transition={{
                            duration: 4.0,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{
                            transformOrigin: "49px 21px"
                          }}
                        />
                      )}
                    </g>
                  );
              }
            })()}
          </motion.g>

          {/* Layer 10: Glasses */}
          <g id="layer-glasses">
            {(() => {
              switch (equipped.GLASSES) {
                case 'glasses-specs':
                  return (
                    <g>
                      {/* Smart thin circular wireframes */}
                      <circle cx="44" cy="36" r="5.5" fill="none" stroke="#475569" strokeWidth="1.2" />
                      <circle cx="56" cy="36" r="5.5" fill="none" stroke="#475569" strokeWidth="1.2" />
                      <line x1="49.5" y1="36" x2="50.5" y2="36" stroke="#475569" strokeWidth="1.2" />
                      {/* Side ears support */}
                      <line x1="38.5" y1="35" x2="34" y2="36" stroke="#475569" strokeWidth="1" />
                      <line x1="61.5" y1="35" x2="66" y2="36" stroke="#475569" strokeWidth="1" />
                    </g>
                  );
                case 'glasses-happy':
                  return (
                    <g>
                      {/* Happy Vibes Glasses - pink tinted circle specs with gold stars */}
                      <circle cx="43.5" cy="36" r="6.5" fill="#f472b6" fillOpacity="0.4" stroke="#db2777" strokeWidth="1.5" />
                      <circle cx="56.5" cy="36" r="6.5" fill="#f472b6" fillOpacity="0.4" stroke="#db2777" strokeWidth="1.5" />
                      <line x1="50" y1="36" x2="50" y2="36" stroke="#db2777" strokeWidth="1.5" />
                      {/* Star glare reflection */}
                      <path d="M42 34.5 L43.5 34 L45 34.5 L43.5 35 Z" fill="#fff" />
                      <path d="M55 34.5 L56.5 34 L58 34.5 L56.5 35 Z" fill="#fff" />
                    </g>
                  );
                case 'glasses-stars':
                  return (
                    <g>
                      {/* Cool Star Shades */}
                      <path d="M36 36 L41 31 L47 33 L45 39 L39 39 Z" fill="#ea580c" stroke="#f97316" strokeWidth="1" opacity="0.9" />
                      <path d="M64 36 L59 31 L53 33 L55 39 L61 39 Z" fill="#ea580c" stroke="#f97316" strokeWidth="1" opacity="0.9" />
                      <line x1="47" y1="34" x2="53" y2="34" stroke="#f97316" strokeWidth="1.5" />
                    </g>
                  );
                case 'glasses-none':
                default:
                  return null;
              }
            })()}
          </g>

          {/* Layer 11: Headwear */}
          <g id="layer-headwear">
            {(() => {
              switch (equipped.HEADWEAR) {
                case 'headwear-moon':
                  return (
                    <g>
                      {/* Moonlit Indigo Baseball Cap */}
                      <path d="M32.5 28 C32.5 16, 67.5 16, 67.5 28 L32.5 28 Z" fill="#1e1b4b" />
                      {/* Cap brim/visor */}
                      <ellipse cx="50" cy="28.5" rx="19.5" ry="3.5" fill="#312e81" />
                      {/* Glowing yellow crescent moon symbol */}
                      <path d="M50 21.5 A 3 3 0 1 0 54 24.5 A 2 2 0 1 1 50 21.5" fill="#fbbf24" />
                    </g>
                  );
                case 'headwear-band':
                  return (
                    <g>
                      {/* Champion Headband */}
                      <rect x="33.5" y="26.5" width="33" height="5.5" fill="#dc2626" rx="1.5" />
                      {/* Gold star in the middle */}
                      <path d="M50 26.5 L51 28.5 L53 28.5 L51.5 29.5 L52 31.5 L50 30.5 L48 31.5 L48.5 29.5 L47 28.5 L49 28.5 Z" fill="#facc15" />
                    </g>
                  );
                case 'headwear-scholar':
                  return (
                    <g>
                      {/* Traditional black mortarboard hat */}
                      <polygon points="26,17 50,11 74,17 50,23" fill="#111827" stroke="#374151" strokeWidth="0.8" />
                      <rect x="42" y="21" width="16" height="4.5" fill="#1f2937" />
                      {/* Hanging gold tassel */}
                      <line x1="50" y1="17" x2="68" y2="21" stroke="#fbbf24" strokeWidth="1" />
                      <rect x="67" y="21" width="2" height="6.5" fill="#fbbf24" rx="0.5" />
                    </g>
                  );
                case 'headwear-none':
                default:
                  return null;
              }
            })()}
          </g>
        </motion.g>
      </svg>
    </div>
  );
};

// THE INTERACTIVE AVATAR VIEWER CONTROLS
export const AvatarViewerControls: React.FC<{
  rotationY: number;
  setRotationY: (r: number) => void;
  zoom: number;
  setZoom: (z: number) => void;
}> = ({ rotationY, setRotationY, zoom, setZoom }) => {
  return (
    <div className="flex items-center justify-between gap-2.5 bg-neutral-50 border border-neutral-200/50 rounded-xl px-3.5 py-2 mt-4 text-xs font-bold text-neutral-500 shadow-sm">
      {/* 3D Rotate Buttons */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => setRotationY(rotationY - 45)}
          className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 active:bg-neutral-100 transition-all text-neutral-600 shrink-0"
          title="Rotate Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] uppercase font-mono tracking-wider w-16 text-center select-none">
          Rotate 3D
        </span>
        <button 
          onClick={() => setRotationY(rotationY + 45)}
          className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 active:bg-neutral-100 transition-all text-neutral-600 shrink-0"
          title="Rotate Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Auto Rotate Trigger */}
      <button
        onClick={() => setRotationY(rotationY + 360)}
        className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 active:bg-neutral-100 transition-all text-neutral-600 flex items-center gap-1"
        title="360 Rotation"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="text-[9px] uppercase font-mono">360°</span>
      </button>

      {/* Zoom Buttons */}
      <div className="flex items-center gap-1 border-l border-neutral-200 pl-2.5">
        <button 
          onClick={() => setZoom(Math.min(zoom + 0.15, 1.6))}
          className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 active:bg-neutral-100 transition-all text-neutral-600 shrink-0"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => setZoom(Math.max(zoom - 0.15, 0.7))}
          className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 active:bg-neutral-100 transition-all text-neutral-600 shrink-0"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => { setZoom(1); setRotationY(0); }}
          className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 active:bg-neutral-100 transition-all text-neutral-600 text-[9px] font-mono font-black shrink-0"
          title="Reset View"
        >
          RESET
        </button>
      </div>
    </div>
  );
};

// THE REWARD UNLOCK CELEBRATION MODAL
export const RewardUnlockCelebration: React.FC<{
  item: AvatarItem;
  isOpen: boolean;
  onClose: () => void;
  onEquip: () => void;
}> = ({ item, isOpen, onClose, onEquip }) => {
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRotated(false);
      const t = setTimeout(() => {
        setRotated(true);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const theme = getRarityTheme(item.rarity);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          className="relative w-full max-w-md bg-white border border-neutral-100 rounded-3xl p-6 shadow-2xl text-center overflow-hidden"
        >
          {/* Confetti & Glow rings */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute -top-12 -left-12 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="absolute -bottom-12 -right-12 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl"
            />
          </div>

          {/* Sparkles / Stars floating */}
          <div className="flex justify-center gap-1.5 text-yellow-400 mb-1">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <Sparkle className="w-5 h-5 animate-bounce" />
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
            Achievement Unlocked!
          </span>

          <h3 className="text-xl font-black text-neutral-900 mt-4 leading-tight">
            {item.unlockRequirement}
          </h3>

          <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto">
            Your persistence paid off! You earned a rare digital keepsake for your ThriveCampus journey.
          </p>

          {/* Large rotating showcase box */}
          <div className="relative my-7 bg-neutral-50/50 border border-neutral-100 rounded-2xl p-6 flex flex-col items-center justify-center h-44 shadow-inner">
            <div className={`absolute inset-0 rounded-2xl border-2 ${theme.glow} pointer-events-none opacity-50`} />
            
            {/* The Item Logo/Art (Fake 3D rotate item) */}
            <motion.div
              animate={rotated ? { rotateY: 360, scale: [1, 1.12, 1] } : { rotateY: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border bg-white ${theme.bg} ${theme.glow}`}
            >
              {item.category === 'SHOES' && <Compass className="w-11 h-11 text-amber-500" />}
              {item.category === 'TOPS' && <ShoppingBag className="w-11 h-11 text-teal-600" />}
              {item.category === 'HEADWEAR' && <Award className="w-11 h-11 text-indigo-600" />}
              {item.category === 'GLASSES' && <Eye className="w-11 h-11 text-pink-500" />}
              {item.category === 'ACCESSORIES' && <Backpack className="w-11 h-11 text-orange-500" />}
              {item.category === 'BACKGROUNDS' && <Compass className="w-11 h-11 text-blue-500" />}
              {item.category === 'EFFECTS' && <Sparkles className="w-11 h-11 text-yellow-500 animate-pulse" />}
            </motion.div>

            {/* Rarity and name banner */}
            <div className="mt-3.5">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${theme.badge}`}>
                {item.rarity} Item
              </span>
              <h4 className="text-sm font-black text-neutral-800 mt-1.5">{item.name}</h4>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={onEquip}
              className="w-full bg-neutral-900 text-white rounded-xl py-3 text-xs font-black hover:bg-neutral-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              EQUIP NOW
            </button>
            <button
              onClick={onClose}
              className="w-full bg-neutral-100 hover:bg-neutral-100/80 active:scale-95 text-neutral-500 rounded-xl py-2.5 text-xs font-bold transition-all"
            >
              VIEW LATER
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// THE COMPLETE AVATAR CLOSET CUSTOMIZATION PAGE
interface AvatarClosetProps {
  stats: {
    points: number;
    coins: number;
    streak: number;
    waterCount: number;
    sleepHours: number;
    breathingCount: number;
    schoolTasksDone: number;
  };
  onClose: () => void;
  onNavigateToQuest: (section: string) => void;
}

export const AvatarCloset: React.FC<AvatarClosetProps> = ({ stats, onClose, onNavigateToQuest }) => {
  // Persistence state
  const [equipped, setEquipped] = useState<EquippedItems>(() => {
    const saved = localStorage.getItem('thrivecampus_avatar_equipped');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPPED;
  });

  const [skinId, setSkinId] = useState(() => {
    return localStorage.getItem('thrivecampus_avatar_skin') || 'skin-1';
  });

  const [hairColorId, setHairColorId] = useState(() => {
    return localStorage.getItem('thrivecampus_avatar_haircolor') || 'hair-black';
  });

  // Current selected Category Tab
  const [activeTab, setActiveTab] = useState<AvatarCategory>('FACE');

  // Interactive rotation and scale
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Celebratory Banner States
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  // Load all items
  const items = getAvatarItems(stats);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('thrivecampus_avatar_equipped', JSON.stringify(equipped));
  }, [equipped]);

  useEffect(() => {
    localStorage.setItem('thrivecampus_avatar_skin', skinId);
  }, [skinId]);

  useEffect(() => {
    localStorage.setItem('thrivecampus_avatar_haircolor', hairColorId);
  }, [hairColorId]);

  const equipItem = (itemId: string, category: AvatarCategory) => {
    setEquipped(prev => ({
      ...prev,
      [category]: itemId
    }));

    const itemName = items.find(i => i.id === itemId)?.name || 'Item';
    setCelebrationBanner(`LOOKING GREAT! ${itemName} equipped.`);

    // Auto clear banner
    setTimeout(() => {
      setCelebrationBanner(null);
    }, 4000);
  };

  const activeCategoryItems = items.filter(i => i.category === activeTab);

  // Tab List Definitions
  const tabs: { id: AvatarCategory; label: string }[] = [
    { id: 'FACE', label: 'Face' },
    { id: 'HAIR', label: 'Hair' },
    { id: 'TOPS', label: 'Tops' },
    { id: 'BOTTOMS', label: 'Bottoms' },
    { id: 'SHOES', label: 'Shoes' },
    { id: 'HEADWEAR', label: 'Headwear' },
    { id: 'GLASSES', label: 'Glasses' },
    { id: 'ACCESSORIES', label: 'Accessories' },
    { id: 'BACKGROUNDS', label: 'Backgrounds' },
    { id: 'EFFECTS', label: 'Effects' }
  ];

  // Collection unlocks stats
  const unlockedCount = items.filter(i => i.unlocked).length;
  const totalCount = items.length;

  const categoryProgress = (cat: AvatarCategory) => {
    const total = items.filter(i => i.category === cat).length;
    const unlocked = items.filter(i => i.category === cat && i.unlocked).length;
    return { unlocked, total };
  };

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm">
      {/* Celebration overlay bar */}
      <AnimatePresence>
        {celebrationBanner && (
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 mb-4 mx-auto max-w-md text-center"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {celebrationBanner}
            <Sparkles className="w-4 h-4 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-teal-600" />
            Student Avatar Closet
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">Customize your digital identity using wellness accomplishments.</p>
        </div>
        <button 
          onClick={onClose}
          className="text-xs font-extrabold text-[#24796b] bg-[#e4f6ec] hover:bg-[#d1ebd9] px-3 py-1.5 rounded-xl transition-all shadow-sm shrink-0"
        >
          ← Save & Return
        </button>
      </div>

      {/* CLOSET LAYOUT: THREE PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL 1: LEFT SIDEBAR - CATEGORIES (COLS: 3) */}
        <div className="lg:col-span-3 flex flex-col gap-2.5 w-full">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-2.5">
            Categories
          </h3>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              const { unlocked, total } = categoryProgress(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink ${active ? 'bg-neutral-100 text-[#24796b]' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#24796b]' : 'bg-transparent'}`} />
                    {tab.label}
                  </span>
                  <span className="text-[9.5px] bg-neutral-200/50 text-neutral-600 px-1.5 py-0.5 rounded-md font-mono">
                    {unlocked}/{total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Collection Status Progress Bar */}
          <div className="mt-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-3.5 shadow-inner hidden lg:block">
            <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest">
              My Collection
            </span>
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-xs font-black text-neutral-800">{unlockedCount} / {totalCount} Items</span>
              <span className="text-[10px] font-bold text-teal-600">{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
            <div className="h-2 bg-neutral-200/80 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-[#24796b] rounded-full transition-all duration-300" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* PANEL 2: CENTER - LARGE 3D INTERACTIVE AVATAR PREVIEW (COLS: 4) */}
        <div className="lg:col-span-4 bg-neutral-50/50 border border-neutral-200/70 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">
            Interactive Avatar Preview
          </span>

          {/* The Live Render Container */}
          <div className="relative w-full max-w-[240px] flex items-center justify-center">
            <RenderCustomAvatar 
              equipped={equipped}
              skinId={skinId}
              hairColorId={hairColorId}
              size={240}
              rotationY={rotationY}
              zoom={zoom}
            />

            {/* Float tags */}
            {equipped.EFFECTS !== 'effect-none' && (
              <span className="absolute bottom-3 left-3 bg-yellow-100 text-yellow-900 text-[8.5px] font-black uppercase px-2 py-0.5 rounded border border-yellow-300 shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 animate-spin" />
                Active VFX
              </span>
            )}
          </div>

          {/* View control tools (rotate left/right/360, zoom, reset) */}
          <AvatarViewerControls 
            rotationY={rotationY} 
            setRotationY={setRotationY} 
            zoom={zoom} 
            setZoom={setZoom} 
          />

          {/* Skin and Hair Color options quick-bar */}
          <div className="w-full mt-4 border-t border-neutral-200/60 pt-4 flex flex-col gap-2.5">
            <div>
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-wider">
                Skin Tone
              </span>
              <div className="flex gap-2 mt-1.5">
                {SKIN_TONES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSkinId(s.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${skinId === s.id ? 'border-[#24796b] scale-110 shadow-md' : 'border-transparent'}`}
                    style={{ backgroundColor: s.color }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-wider">
                Hair Colour
              </span>
              <div className="flex gap-2 mt-1.5">
                {HAIR_COLORS.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setHairColorId(h.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${hairColorId === h.id ? 'border-[#24796b] scale-110 shadow-md' : 'border-transparent'}`}
                    style={{ backgroundColor: h.color }}
                    title={h.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: RIGHT PANEL - ITEMS SELECTION CLOSET (COLS: 5) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">
              {activeTab} Items
            </h3>
            <span className="text-[10px] font-bold text-neutral-400">
              Category items unlocked
            </span>
          </div>

          {/* Grid list of items inside active category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {activeCategoryItems.map(item => {
              const isEquipped = equipped[item.category] === item.id;
              const theme = getRarityTheme(item.rarity);

              return (
                <div 
                  key={item.id} 
                  className={`border rounded-2xl p-3.5 flex flex-col justify-between shadow-sm transition-all relative ${theme.bg} ${isEquipped ? 'border-2 border-emerald-500' : 'border-neutral-200'}`}
                >
                  {/* Top corner stats or state tags */}
                  <div className="flex justify-between items-start gap-1">
                    <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${theme.badge}`}>
                      {item.rarity}
                    </span>
                    
                    {!item.unlocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                    {item.unlocked && isEquipped && (
                      <span className="text-[8.5px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-black flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3" /> EQUIPPED
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="my-3 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 leading-tight">
                      {item.name}
                    </h4>
                    
                    {!item.unlocked ? (
                      <div className="mt-1.5">
                        <p className="text-[9.5px] font-semibold text-neutral-500 leading-relaxed">
                          🔒 {item.unlockRequirement}
                        </p>
                        
                        {item.need > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-[8px] font-bold text-neutral-400">
                              <span>Progress</span>
                              <span>{item.have} / {item.need}</span>
                            </div>
                            <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mt-0.5">
                              <div 
                                className="h-full bg-neutral-400 rounded-full" 
                                style={{ width: `${Math.min((item.have / item.need) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Unlocked and ready to wear!
                      </p>
                    )}
                  </div>

                  {/* CTA BUTTON */}
                  <div className="mt-2 border-t border-neutral-100/60 pt-2">
                    {item.unlocked ? (
                      isEquipped ? (
                        <button
                          disabled
                          className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black py-1.5 rounded-lg text-center cursor-default"
                        >
                          EQUIPPED
                        </button>
                      ) : (
                        <button
                          onClick={() => equipItem(item.id, item.category)}
                          className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] font-black py-1.5 rounded-lg text-center transition-all shadow-sm active:scale-95"
                        >
                          EQUIP ITEM
                        </button>
                      )
                    ) : (
                      item.ctaText && (
                        <button
                          onClick={() => onNavigateToQuest(item.ctaSection || 'today')}
                          className="w-full border border-neutral-200 bg-white hover:bg-neutral-50 text-[10px] font-black text-neutral-700 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5" />
                          {item.ctaText}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
