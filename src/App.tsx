import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  RenderCustomAvatar, 
  AvatarCloset, 
  RewardUnlockCelebration, 
  getAvatarItems, 
  getRarityTheme 
} from "./components/AvatarSystem";
import {
  AnimatedAchievementBadge,
  BadgeUnlockCelebration,
  BadgeDetailModal,
  AnimatedPointsCounter,
  getBadgeGradient,
  GoalCompletedCelebration
} from "./components/AnimatedAchievementBadge";
import { MascotHub } from "./components/MascotHub";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Cpu, 
  Database, 
  AlertCircle, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Heart, 
  Smile, 
  MessageCircle, 
  User, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Coins,
  Shield,
  Activity,
  Award,
  Bell,
  Send,
  Paperclip,
  Trash2,
  Calendar,
  Lock,
  Moon,
  Clock,
  Compass,
  FileText,
  Flame,
  Trophy,
  Star,
  ShoppingBag,
  Backpack
} from "lucide-react";

interface Quest {
  t: string;      // Title
  p: string;      // Points (+5, +10, etc)
  tm: string;     // Time or Metadata description
  tint: string;   // Background color tint for icon
  fg: string;     // Icon foreground color
  iconPaths: string[]; // Custom SVG paths
  done: boolean;  // Built-in status
  image?: string; // Image override
}

interface RewardItem {
  t: string;      // Title
  c: number;      // Cost in coins
  tint: string;   // Bg tint
  fg: string;     // Fg color
  iconPaths: string[];
}

const getThemeFromQuestColors = (fg: string): 'teal' | 'amber' | 'emerald' | 'sapphire' | 'ruby' | 'amethyst' | 'neutral' | 'orange' | 'rose' | 'pink' | 'purple' | 'blue' | 'yellow' => {
  const color = fg.toLowerCase();
  if (color.includes('1f8a5b') || color.includes('green') || color.includes('emerald') || color.includes('1db954')) return 'emerald';
  if (color.includes('17806b') || color.includes('teal') || color.includes('24796b')) return 'teal';
  if (color.includes('3b6fd4') || color.includes('blue') || color.includes('sky') || color.includes('sapphire')) return 'sapphire';
  if (color.includes('b06a12') || color.includes('orange') || color.includes('amber') || color.includes('gold')) return 'amber';
  if (color.includes('6d54d8') || color.includes('purple') || color.includes('violet') || color.includes('amethyst')) return 'amethyst';
  if (color.includes('red') || color.includes('ruby')) return 'ruby';
  if (color.includes('pink') || color.includes('rose')) return 'rose';
  return 'teal';
};

const ThreeDAnimatedIcon: React.FC<{
  paths?: string[];
  lucideIcon?: React.ReactNode;
  colorTheme?: 'teal' | 'amber' | 'emerald' | 'sapphire' | 'ruby' | 'amethyst' | 'neutral' | 'orange' | 'rose' | 'pink' | 'purple' | 'blue' | 'yellow';
  size?: number;
  containerSize?: number;
  floatDelay?: number;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  image?: string;
}> = ({ paths, lucideIcon, colorTheme = 'teal', size = 18, containerSize = 36, floatDelay = 0, onClick, title, image }) => {
  const themeStyles = {
    teal: {
      bg: "bg-gradient-to-br from-[#33bfae] via-[#1f917b] to-[#0f6b5b]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(31,145,123,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(31,145,123,0.15)",
      border: "border-emerald-300/40"
    },
    amber: {
      bg: "bg-gradient-to-br from-[#fcc93c] via-[#f58c1f] to-[#d45d00]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(245,140,31,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(245,140,31,0.15)",
      border: "border-amber-300/40"
    },
    emerald: {
      bg: "bg-gradient-to-br from-[#6fcf97] via-[#27ae60] to-[#1e8449]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(39,174,96,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(39,174,96,0.15)",
      border: "border-green-300/40"
    },
    sapphire: {
      bg: "bg-gradient-to-br from-[#56ccf2] via-[#2f80ed] to-[#1b4f72]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(47,128,237,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(47,128,237,0.15)",
      border: "border-blue-300/40"
    },
    ruby: {
      bg: "bg-gradient-to-br from-[#ff6b6b] via-[#ee5253] to-[#c0392b]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(238,82,83,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(238,82,83,0.15)",
      border: "border-red-300/40"
    },
    amethyst: {
      bg: "bg-gradient-to-br from-[#a55eea] via-[#8854d0] to-[#4b148c]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(136,84,208,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(136,84,208,0.15)",
      border: "border-purple-300/40"
    },
    neutral: {
      bg: "bg-gradient-to-br from-[#94a3b8] via-[#475569] to-[#1e293b]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(71,85,105,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(71,85,105,0.15)",
      border: "border-slate-300/40"
    },
    orange: {
      bg: "bg-gradient-to-br from-[#ff9f43] via-[#ff6b6b] to-[#ee5253]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(255,107,107,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(255,107,107,0.15)",
      border: "border-orange-300/40"
    },
    rose: {
      bg: "bg-gradient-to-br from-[#f78fb3] via-[#e66767] to-[#cf6a87]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(230,103,103,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(230,103,103,0.15)",
      border: "border-pink-300/40"
    },
    pink: {
      bg: "bg-gradient-to-br from-[#ff9ff3] via-[#f368e0] to-[#ab0e86]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(243,104,224,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(243,104,224,0.15)",
      border: "border-pink-300/40"
    },
    purple: {
      bg: "bg-gradient-to-br from-[#d6a2e8] via-[#82589f] to-[#512da8]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(130,88,159,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(130,88,159,0.15)",
      border: "border-violet-300/40"
    },
    blue: {
      bg: "bg-gradient-to-br from-[#4fc3f7] via-[#0288d1] to-[#01579b]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(2,136,209,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(2,136,209,0.15)",
      border: "border-sky-300/40"
    },
    yellow: {
      bg: "bg-gradient-to-br from-[#ffe082] via-[#ffb300] to-[#ff8f00]",
      shadow: "shadow-[0_6px_14px_-2px_rgba(255,179,0,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]",
      glow: "rgba(255,179,0,0.15)",
      border: "border-yellow-300/40"
    }
  };

  const currentTheme = themeStyles[colorTheme] || themeStyles.teal;

  return (
    <motion.div
      onClick={onClick}
      title={title}
      animate={{ y: [0, -3, 0] }}
      transition={{
        y: {
          repeat: Infinity,
          duration: 3.5 + Math.random() * 1.5,
          delay: floatDelay,
          ease: "easeInOut"
        }
      }}
      whileHover={{ 
        scale: 1.25, 
        rotate: [0, -12, 12, -6, 6, 0],
        y: -6,
        filter: "brightness(1.15) contrast(1.05)",
        boxShadow: "0 16px 32px -4px var(--glow-color, rgba(0,0,0,0.5)), 0 0 16px 4px var(--glow-color, rgba(0,0,0,0.3))"
      }}
      whileTap={{ 
        scale: 0.90, 
        rotate: 0,
        y: 1
      }}
      style={{ 
        width: containerSize, 
        height: containerSize,
        "--glow-color": currentTheme.glow
      } as any}
      className={`relative rounded-xl flex items-center justify-center cursor-pointer select-none border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.shadow} shrink-0`}
    >
      {/* 3D Gloss Highlight Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/35 rounded-xl pointer-events-none" />

      {/* 3D Sphere Curve Reflection */}
      <div className="absolute top-[1px] left-[1px] right-[1px] h-[45%] bg-gradient-to-b from-white/25 to-white/0 rounded-t-lg pointer-events-none" />
      
      {/* Depth Shadow Layer */}
      <div className="absolute bottom-[1px] left-[1px] right-[1px] h-[25%] bg-gradient-to-t from-black/15 to-transparent rounded-b-lg pointer-events-none" />

      {/* Icon Content */}
      <div 
        className="relative flex items-center justify-center text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.3)]"
        style={{ width: size, height: size }}
      >
        {image ? (
          <img 
            src={image} 
            alt="icon" 
            className="w-full h-full object-contain rounded-md" 
            referrerPolicy="no-referrer"
          />
        ) : lucideIcon ? (
          <div className="text-white fill-white/10 stroke-[2.2] w-full h-full flex items-center justify-center">
            {lucideIcon}
          </div>
        ) : paths ? (
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2.2} 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-full h-full text-white"
          >
            {paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
        ) : null}
      </div>
    </motion.div>
  );
};

export default function App() {
  // Navigation & View State
  const [section, setSection] = useState("today"); // 'today' | 'challenges' | 'rewards' | 'messages' | 'profile' | 'coach' | 'settings' | 'summary'

  // Thrive Points State (Effort Score)
  const [thrivePoints, setThrivePoints] = useState(() => {
    const saved = localStorage.getItem('thrivecampus_points');
    return saved ? parseInt(saved, 10) : 1610;
  });

  useEffect(() => {
    localStorage.setItem('thrivecampus_points', thrivePoints.toString());
  }, [thrivePoints]);

  // Badges state for our 10 dynamic 3D-styled badges
  const [badgeState, setBadgeState] = useState<any[]>(() => {
    const saved = localStorage.getItem('thrivecampus_badges_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const imageMap: Record<string, string> = {
          month: 'https://appcdn.goqii.com/storeimg/79465_1784618108.png',
          water: 'https://appcdn.goqii.com/storeimg/53114_1784618074.png',
          mood: 'https://appcdn.goqii.com/storeimg/63590_1784618224.png',
          sleep: 'https://appcdn.goqii.com/storeimg/12128_1784618195.png',
          movement: 'https://appcdn.goqii.com/storeimg/67044_1784618264.png',
          breathing: 'https://appcdn.goqii.com/storeimg/92650_1784618285.png',
          learning: 'https://appcdn.goqii.com/storeimg/85596_1784618142.png',
          'perfect-day': 'https://appcdn.goqii.com/storeimg/12539_1784618167.png',
          'streak-7': 'https://appcdn.goqii.com/storeimg/83980_1784618010.png',
          'streak-30': 'https://appcdn.goqii.com/storeimg/14787_1784618034.png'
        };
        return parsed.map((b: any) => {
          if (imageMap[b.id]) {
            return { 
              ...b, 
              image: imageMap[b.id] 
            };
          }
          return b;
        });
      } catch (e) {
        // Fallback to default below
      }
    }

    return [
      {
        id: 'month',
        name: 'July Champion',
        description: 'You completed your July ThriveCampus challenge!',
        points: 100,
        isUnlocked: true,
        image: 'https://appcdn.goqii.com/storeimg/79465_1784618108.png',
        colorTheme: 'gold',
        iconType: 'trophy',
        avatarReward: { id: 'top-champion', name: 'Thrive Champion Jacket', category: 'TOPS', rarity: 'EPIC' },
        have: 1,
        need: 1,
        dateEarned: 'Jul 18, 2026'
      },
      {
        id: 'water',
        name: 'Hydration Hero',
        description: 'Log water 20 days to stay fully hydrated!',
        points: 100,
        isUnlocked: true,
        image: 'https://appcdn.goqii.com/storeimg/53114_1784618074.png',
        colorTheme: 'water',
        iconType: 'water',
        avatarReward: { id: 'top-aqua', name: 'Aqua Hydration Hoodie', category: 'TOPS', rarity: 'RARE' },
        have: 24,
        need: 20,
        dateEarned: 'Jul 15, 2026'
      },
      {
        id: 'mood',
        name: 'Sunny Soul',
        description: 'Check-in your mood daily for 20 days!',
        points: 100,
        isUnlocked: true,
        image: 'https://appcdn.goqii.com/storeimg/63590_1784618224.png',
        colorTheme: 'mood',
        iconType: 'mood',
        avatarReward: { id: 'glasses-happy', name: 'Happy Vibes Glasses', category: 'GLASSES', rarity: 'RARE' },
        have: 20,
        need: 20,
        dateEarned: 'Jul 14, 2026'
      },
      {
        id: 'sleep',
        name: 'Dream Big',
        description: 'Log sleep 15 nights to earn sweet dreams!',
        points: 100,
        isUnlocked: true,
        image: 'https://appcdn.goqii.com/storeimg/12128_1784618195.png',
        colorTheme: 'sleep',
        iconType: 'sleep',
        avatarReward: { id: 'headwear-moon', name: 'Moonlit Cap', category: 'HEADWEAR', rarity: 'RARE' },
        have: 18,
        need: 15,
        dateEarned: 'Jul 12, 2026'
      },
      {
        id: 'movement',
        name: 'Trailblazer',
        description: 'Move 20 days and blaze your fitness trail!',
        points: 100,
        isUnlocked: true,
        image: 'https://appcdn.goqii.com/storeimg/67044_1784618264.png',
        colorTheme: 'movement',
        iconType: 'movement',
        avatarReward: { id: 'shoes-gold', name: '3D Golden Sneakers', category: 'SHOES', rarity: 'EPIC' },
        have: 20,
        need: 20,
        dateEarned: 'Jul 16, 2026'
      },
      {
        id: 'breathing',
        name: 'Zen Master',
        description: 'Complete 10 breathing sessions for ultimate mindfulness!',
        points: 100,
        isUnlocked: true,
        image: 'https://appcdn.goqii.com/storeimg/92650_1784618285.png',
        colorTheme: 'breathing',
        iconType: 'breathing',
        avatarReward: { id: 'effect-aura', name: 'Calm Healing Aura', category: 'EFFECTS', rarity: 'RARE' },
        have: 12,
        need: 10,
        dateEarned: 'Jul 10, 2026'
      },
      {
        id: 'learning',
        name: 'Bright Mind',
        description: 'Finish 15 study quests to sharpen your mind!',
        points: 100,
        isUnlocked: false,
        image: 'https://appcdn.goqii.com/storeimg/85596_1784618142.png',
        colorTheme: 'learning',
        iconType: 'learning',
        avatarReward: { id: 'accessory-backpack', name: 'Scholar Orange Backpack', category: 'ACCESSORIES', rarity: 'RARE' },
        have: 8,
        need: 15
      },
      {
        id: 'perfect-day',
        name: 'Perfect Day',
        description: 'Complete all daily habits in a single day!',
        points: 100,
        isUnlocked: false,
        image: 'https://appcdn.goqii.com/storeimg/12539_1784618167.png',
        colorTheme: 'rainbow',
        iconType: 'sparkle',
        avatarReward: { id: 'effect-sparkle', name: 'Perfect Day Sparkles', category: 'EFFECTS', rarity: 'LEGENDARY' },
        have: 0,
        need: 1
      },
      {
        id: 'streak-7',
        name: '7-Day Streak',
        description: 'Keep a 7-day health habit streak alive!',
        points: 100,
        isUnlocked: false,
        image: 'https://appcdn.goqii.com/storeimg/83980_1784618010.png',
        colorTheme: 'streak-7',
        iconType: 'movement',
        avatarReward: { id: 'effect-streak', name: 'Streak Flame Ring', category: 'EFFECTS', rarity: 'EPIC' },
        have: 5,
        need: 7
      },
      {
        id: 'streak-30',
        name: '30-Day Champion',
        description: 'Keep a 30-day health habit streak alive!',
        points: 200,
        isUnlocked: false,
        image: 'https://appcdn.goqii.com/storeimg/14787_1784618034.png',
        colorTheme: 'streak-30',
        iconType: 'trophy',
        avatarReward: { id: 'bg-nebula', name: 'Deep Space Nebula', category: 'BACKGROUNDS', rarity: 'EPIC' },
        have: 19,
        need: 30
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('thrivecampus_badges_state', JSON.stringify(badgeState));
  }, [badgeState]);

  // Modals and testing state
  const [liveUnlockedBadge, setLiveUnlockedBadge] = useState<any | null>(null);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<any | null>(null);

  const triggerLiveBadgeUnlock = (badgeId: string) => {
    const badge = badgeState.find(b => b.id === badgeId);
    if (!badge) return;

    // Unlock if currently locked
    if (!badge.isUnlocked) {
      setBadgeState(prev => prev.map(b => b.id === badgeId ? { ...b, isUnlocked: true, dateEarned: 'Today' } : b));
      setThrivePoints(prev => prev + badge.points);
      if (badge.avatarReward) {
        setUnlockedItemIds(prev => {
          if (prev.includes(badge.avatarReward.id)) return prev;
          return [...prev, badge.avatarReward.id];
        });
      }
    }

    setLiveUnlockedBadge({
      ...badge,
      isUnlocked: true
    });
  };

  const [completedGoalInfo, setCompletedGoalInfo] = useState<{
    questTitle: string;
    points: number;
    badge: any;
  } | null>(null);

  const [pendingBadgeUnlock, setPendingBadgeUnlock] = useState<any | null>(null);

  const questToBadgeIdMap: Record<string, string> = {
    "Log Your Mood": "mood",
    "Add Last Night's Sleep": "sleep",
    "Drink Water": "water",
    "Add Your Movement": "movement",
    "3-Minute Breathing": "breathing",
    "Submit Math Homework": "learning",
    "Science Lab Report": "learning",
    "Read Science Chapter 4": "learning",
    "Daily Reflection": "learning"
  };

  const completeQuest = (questTitle: string) => {
    if (logged.includes(questTitle)) return;

    // Get the points for this quest
    const q = quests().find(x => x.t === questTitle);
    const points = q ? parseInt(q.p.replace("+", "")) : 5;

    // Find the associated badge ID
    const badgeId = questToBadgeIdMap[questTitle];

    // Determine updated badge state
    let updatedBadge: any = null;
    let didUnlockBadge = false;

    setBadgeState(prev => {
      return prev.map(b => {
        if (b.id === badgeId) {
          const newHave = b.have + 1;
          const meetsRequirement = newHave >= b.need;
          const isNewlyUnlocked = meetsRequirement && !b.isUnlocked;

          updatedBadge = {
            ...b,
            have: newHave,
            isUnlocked: b.isUnlocked || meetsRequirement,
            dateEarned: isNewlyUnlocked ? "Today" : b.dateEarned
          };

          if (isNewlyUnlocked) {
            didUnlockBadge = true;
          }

          return updatedBadge;
        }
        return b;
      });
    });

    // Check if ALL quests of the day are completed (9 quests total)
    setLogged(prev => {
      const nextLogged = [...prev, questTitle];
      const totalQuests = quests().length;

      if (nextLogged.length === totalQuests) {
        // Unlock "Perfect Day" badge
        setTimeout(() => {
          setBadgeState(currentBadges => {
            return currentBadges.map(b => {
              if (b.id === "perfect-day" && !b.isUnlocked) {
                const perfectDayBadge = {
                  ...b,
                  have: 1,
                  isUnlocked: true,
                  dateEarned: "Today"
                };
                
                // Add points
                setThrivePoints(p => p + b.points);
                
                // Add reward
                if (b.avatarReward) {
                  setUnlockedItemIds(unlocked => [...unlocked, b.avatarReward.id]);
                }

                // Show badge unlock celebration
                setLiveUnlockedBadge(perfectDayBadge);
                
                return perfectDayBadge;
              }
              return b;
            });
          });
        }, 800);
      }

      return nextLogged;
    });

    // Award points
    setThrivePoints(prev => prev + points);

    // If a badge is newly unlocked, award its points and items
    if (didUnlockBadge && updatedBadge) {
      const bPoints = updatedBadge.points;
      setThrivePoints(prev => prev + bPoints);
      if (updatedBadge.avatarReward) {
        setUnlockedItemIds(prev => {
          if (prev.includes(updatedBadge.avatarReward.id)) return prev;
          return [...prev, updatedBadge.avatarReward.id];
        });
      }
      
      // Delay slightly to let the student digest the Goal completion first
      setPendingBadgeUnlock(updatedBadge);
    }

    // Set completed goal info to display the magnificent GoalCompletedCelebration popup!
    setTimeout(() => {
      setCompletedGoalInfo({
        questTitle,
        points,
        badge: updatedBadge || badgeState.find(b => b.id === badgeId)
      });
    }, 100);
  };

  const [view, setView] = useState("desktop"); // 'mobile' | 'desktop'
  const [gender, setGender] = useState("boys"); // 'boys' | 'girls'
  const [avatar, setAvatar] = useState(1); // index 0-4
  const [selDay, setSelDay] = useState(14); // selected day of July (1 to 14)
  const [msgThread, setMsgThread] = useState<string | null>(null); // selected teacher message thread
  const [redeemed, setRedeemed] = useState<string[]>([]); // list of redeemed reward titles
  const [openQuest, setOpenQuest] = useState<string | null>(null); // currently selected quest to log
  const [unreadNotifications, setUnreadNotifications] = useState(true); // unread state for notification panel
  
  // Interactive Quest Tracking State
  const [logged, setLogged] = useState<string[]>([
    "Log Your Mood",
    "Add Last Night's Sleep",
    "Drink Water",
    "Add Your Movement"
  ]); // starting with some quests logged
  
  // Custom Logged values
  const [moodSel, setMoodSel] = useState<string | null>("Good");
  const [waterCount, setWaterCount] = useState(6);
  const [sleepH, setSleepH] = useState(7.5);
  const [moveSel, setMoveSel] = useState("Walk");
  const [moveMin, setMoveMin] = useState(30);
  const [readDone, setReadDone] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({});

  // Custom Avatar State persistent storage
  const [equipped, setEquipped] = useState<any>(() => {
    const saved = localStorage.getItem('thrivecampus_avatar_equipped');
    return saved ? JSON.parse(saved) : {
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
  });

  const [skinId, setSkinId] = useState(() => {
    return localStorage.getItem('thrivecampus_avatar_skin') || 'skin-1';
  });

  const [hairColorId, setHairColorId] = useState(() => {
    return localStorage.getItem('thrivecampus_avatar_haircolor') || 'hair-black';
  });

  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('thrivecampus_avatar_unlocked_ids');
    if (saved) return JSON.parse(saved);
    return [
      'face-happy', 'face-cool', 'hair-short', 'hair-long', 'top-common', 
      'bottom-jeans', 'shoes-trainers', 'headwear-none', 'glasses-none', 
      'glasses-specs', 'accessory-none', 'bg-sunny'
    ];
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationItem, setCelebrationItem] = useState<any>(null);
  const [newUnlockNotification, setNewUnlockNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('thrivecampus_avatar_unlocked_ids', JSON.stringify(unlockedItemIds));
  }, [unlockedItemIds]);

  const triggerItemUnlock = (itemId: string) => {
    if (unlockedItemIds.includes(itemId)) return;
    setUnlockedItemIds(prev => [...prev, itemId]);
    const itemsList = getAvatarItems({
      points: thrivePoints,
      coins: 320,
      streak: 19,
      waterCount: waterCount,
      sleepHours: sleepH,
      breathingCount: 12,
      schoolTasksDone: 18
    });
    const item = itemsList.find(i => i.id === itemId);
    if (item) {
      setCelebrationItem(item);
      setShowCelebration(true);
      setNewUnlockNotification(item.name);
    }
  };

  useEffect(() => {
    if (logged.includes("3-Minute Breathing")) {
      triggerItemUnlock("effect-aura");
    }
    if (logged.includes("Add Your Movement")) {
      triggerItemUnlock("shoes-gold");
    }
  }, [logged]);

  useEffect(() => {
    // Sync custom avatar state with localStorage whenever section changes
    const savedEquipped = localStorage.getItem('thrivecampus_avatar_equipped');
    if (savedEquipped) {
      setEquipped(JSON.parse(savedEquipped));
    }
    const savedSkin = localStorage.getItem('thrivecampus_avatar_skin');
    if (savedSkin) {
      setSkinId(savedSkin);
    }
    const savedHair = localStorage.getItem('thrivecampus_avatar_haircolor');
    if (savedHair) {
      setHairColorId(savedHair);
    }
    const savedUnlocked = localStorage.getItem('thrivecampus_avatar_unlocked_ids');
    if (savedUnlocked) {
      setUnlockedItemIds(JSON.parse(savedUnlocked));
    }
  }, [section]);

  useEffect(() => {
    if (waterCount >= 8) {
      triggerItemUnlock("top-aqua");
    }
  }, [waterCount]);

  const renderAvatarInstance = (size: number) => {
    return (
      <RenderCustomAvatar
        equipped={equipped}
        skinId={skinId}
        hairColorId={hairColorId}
        size={size}
      />
    );
  };

  const [activeUploadQuest, setActiveUploadQuest] = useState<string | null>(null);
  
  // Application Settings State
  const [settings, setSettings] = useState({
    reminders: true,
    coachMsgs: true,
    teacherMsgs: true,
    challengeAlerts: false,
    sound: true
  });

  // Chat message databases
  const [customMsgs, setCustomMsgs] = useState<Record<string, { text: string; me: boolean; t: string }[]>>({
    'Ms. Anjali Menon': [
      { text: "Hi Aarav, well done keeping your streak going this week!", me: false, t: "9:12 AM" },
      { text: "There is a permission form for the science trip on Friday.", me: false, t: "9:13 AM" },
      { text: "Please bring the signed form tomorrow.", me: false, t: "9:14 AM" },
      { text: "Sure Ms. Anjali, I’ll get it signed tonight.", me: true, t: "9:15 AM" }
    ],
    'Mr. Verma': [
      { text: "Great improvement in the last test, Aarav!", me: false, t: "Yesterday" },
      { text: "Keep practising the geometry problems this week.", me: false, t: "Yesterday" },
      { text: "Thank you sir, I will!", me: true, t: "Yesterday" }
    ],
    'Ms. Nair': [
      { text: "Lab report submissions are due Friday.", me: false, t: "Monday" },
      { text: "Remember to include the observation table.", me: false, t: "Monday" },
      { text: "Noted, thank you.", me: true, t: "Monday" }
    ],
    'Coach Priya': [
      { text: "Great work with your sleep routine this week, Aarav!", me: false, t: "Yesterday" },
      { text: "Try to complete your breathing quest before the day ends — it really helps before exams.", me: false, t: "Yesterday" },
      { text: "Thanks Coach! I’ll do it after lunch.", me: true, t: "Yesterday" }
    ]
  });
  const [typedMsg, setTypedMsg] = useState("");

  // Base configurations and colors
  const appBg = "#f4eee0";
  const tealA = "#24796b";

  // Helper to render custom SVGs
  const icon = (paths: string[], opts: { size?: number; fill?: string; sw?: number } = {}) => {
    const fill = opts.fill || "none";
    return (
      <svg 
        width={opts.size || 19} 
        height={opts.size || 19} 
        viewBox="0 0 24 24" 
        fill={fill} 
        stroke={fill === "none" ? "currentColor" : "none"} 
        strokeWidth={opts.sw || 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  };

  // Avatar SVG generator
  const avatarSvg = (gender: string, idx: number, size: number) => {
    const skins = ["#f2c9a3", "#e8b489", "#cf9b6f", "#a9754b", "#7c5334"];
    const hairC = ["#2a2e36", "#4b3524", "#6d4a2c", "#141414", "#8a5a2b"];
    const bg = ["#e7eefc", "#e4f6ec", "#fdeccf", "#ece8fb", "#e0f3ee"];
    const skin = skins[idx % skins.length];
    const hc = hairC[(idx + (gender === "girls" ? 2 : 0)) % hairC.length];
    const P = (d: string, f: string) => <path d={d} fill={f} />;
    
    const head = [
      <ellipse key="ear1" cx={20} cy={35} rx={3} ry={4} fill={skin} />,
      <ellipse key="ear2" cx={44} cy={35} rx={3} ry={4} fill={skin} />,
      <rect key="neck" x={27} y={44} width={10} height={8} rx={3} fill={skin} />,
      <ellipse key="head" cx={32} cy={33} rx={12.5} ry={14} fill={skin} />,
      <circle key="e1" cx={27.5} cy={32} r={1.7} fill="#2a2e36" />,
      <circle key="e2" cx={36.5} cy={32} r={1.7} fill="#2a2e36" />,
      <path key="sm" d="M28.5 38.5c1.6 1.6 5.4 1.6 7 0" stroke="#b5714e" strokeWidth={1.6} fill="none" strokeLinecap="round" />,
    ];

    let hair: any[] = [];
    if (gender === "boys") {
      const styles = [
        [P("M19.5 30c0-8 5.5-13 12.5-13s12.5 5 12.5 13c0-4-3-9-12.5-9S19.5 26 19.5 30z", hc)],
        [P("M20 29l4-8 3 6 3-7 3 7 3-6 4 8c0-8-5-13-10-13s-10 5-13 13z", hc)],
        [P("M19.5 30c0-8 5.5-13 12.5-13s12.5 5 12.5 13c0-3-2-7-6-8l-3 4-2-4c-8 0-13 4-14 8z", hc)],
        [P("M20 30c-1-3 1-6 2-6 0-2 2-4 4-4 1-2 4-3 6-3s5 1 6 3c2 0 4 2 4 4 1 0 3 3 2 6-1-4-6-7-12-7s-11 3-12 7z", hc)],
        [P("M20.5 31c0-7 5-11 11.5-11s11.5 4 11.5 11c-1-3-5-6-11.5-6s-10.5 3-11.5 6z", hc)],
      ];
      hair = styles[idx % 5];
    } else {
      const styles = [
        [P("M18 44c-1-4-0.5-9 0-14 1-9 7-13 14-13s13 4 14 13c0.5 5 1 10 0 14l-4-1c1-4 1-8 0.5-12-2 3-7 4-10.5 4s-8.5-1-10.5-4c-0.5 4-0.5 8 0.5 12z", hc)],
        [P("M19 38c-1-5 0-16 13-16s14 11 13 16l-4 1c1-4 1-8 0-11-2 2-6 3-9 3s-7-1-9-3c-1 3-1 7 0 11z", hc)],
        [P("M20 30c0-8 5-13 12-13s12 5 12 13c0-3-2-7-6-8l-3 4-2-4c-8 0-12 4-13 8z", hc), <circle key="bun" cx={32} cy={15} r={4.5} fill={hc} />],
        [P("M18.5 33c0-9 6-14 13.5-14s13.5 5 13.5 14c-1-3-2-5-4-6 0 2-2 3-3 2 0 2-2 3-4 2 0 2-3 3-4 1-1 2-4 2-4 0-2 1-4-1-4-3-2 1-3 3-4 4z", hc)],
        [P("M18 40c-1-5-1-18 14-18s15 13 14 18l-4-1c1-3 1-7 0-10-3 2-6 2-10 2s-7 0-10-2c-1 3-1 7 0 10z", hc), P("M22 21c3-2 6-3 10-3s7 1 10 3l-2 3c-2-2-5-2-8-2s-6 0-8 2z", hc)],
      ];
      hair = styles[idx % 5];
    }

    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className="block rounded-full shadow-sm">
        <circle cx={32} cy={32} r={32} fill={bg[idx % bg.length]} />
        <g>
          {head[2]}
          {hair[0]}
          {head[0]}
          {head[1]}
          {head[3]}
          {head[4]}
          {head[5]}
          {head[6]}
          {hair[1] || null}
        </g>
      </svg>
    );
  };

  // Mountain Scene climbing component
  const MountainScene = ({ tall }: { tall: boolean }) => {
    const h = tall ? 220 : 170;
    const flags = [
      { x: "14%", y: "82%", label: "Bronze", done: true, c: "#c98a3c" },
      { x: "40%", y: "58%", label: "Silver", done: true, cur: true, c: "#8b97a8" },
      { x: "64%", y: "38%", label: "Gold", done: false, c: "#d9a41e" },
      { x: "87%", y: "18%", label: "Platinum", done: false, c: "#5db1c9" },
    ];

    return (
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200" style={{ height: h }}>
        {/* Background / Sun / Peaks */}
        <div className="absolute inset-0 bg-[#dfeaf6]" />
        <div className="absolute top-[34px] right-[40px] w-10 h-10 rounded-full bg-[#fbe3a6]" />
        
        {/* Mountain Shapes */}
        <svg className="absolute inset-0 w-full h-100%" viewBox="0 0 340 200" preserveAspectRatio="none">
          <path d="M0 200 L70 96 L120 140 L180 70 L230 118 L300 40 L340 92 L340 200Z" fill="#c3d4e6" />
          <path d="M0 200 L60 132 L110 168 L175 96 L235 150 L300 84 L340 128 L340 200Z" fill={tealA} opacity={0.92} />
          {/* Snowy Peaks */}
          <path d="M175 96 l14 22 -28 0Z" fill="#fff" opacity={0.85} />
          <path d="M300 84 l12 20 -24 0Z" fill="#fff" opacity={0.85} />
          {/* Progress Lines */}
          <polyline points="48,166 136,116 218,76 296,36" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={3} strokeLinecap="round" strokeDasharray="1 9" />
          <polyline points="48,166 136,116" fill="none" stroke="#f5b544" strokeWidth={4} strokeLinecap="round" />
        </svg>

        {/* Current Active Avatar placement */}
        <div className="absolute left-[40%] top-[58%] -translate-x-1/2 -translate-y-[100%] shadow-lg transition-all duration-300" style={{ width: tall ? 44 : 38, height: tall ? 44 : 38 }}>
          {renderAvatarInstance(tall ? 44 : 38)}
        </div>

        {/* Interactive Milestones Flags */}
        <div className="absolute inset-0">
          {flags.map((f, i) => (
            <div key={i} className="absolute flex flex-col items-center gap-1" style={{ left: f.x, top: f.y, transform: "translate(-50%,-50%)" }}>
              <div 
                className="w-3.5 h-3.5 rounded-full shadow-md transition-transform duration-200" 
                style={{ 
                  background: f.done ? f.c : "#fff", 
                  border: `2px solid ${f.done ? f.c : "#c4ccdb"}`,
                  transform: f.cur ? "scale(1.25)" : "scale(1)"
                }} 
              />
              <div 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                style={{ 
                  color: f.done ? "#fff" : "#6b7688", 
                  background: f.done ? f.c : "rgba(255,255,255,0.85)", 
                  whiteSpace: "nowrap" 
                }}
              >
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Quests metadata config
  const quests = (): Quest[] => [
    { t: "Log Your Mood", p: "+5", tm: "Logged 7:40 AM", tint: "#e4f6ec", fg: "#1f8a5b", iconPaths: ['M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'], done: true },
    { t: "Add Last Night's Sleep", p: "+5", tm: "Logged 7:41 AM", tint: "#ece8fb", fg: "#6d54d8", iconPaths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'], done: true },
    { t: "Drink Water", p: "+5", tm: "Logged 10:15 AM", tint: "#e7eefc", fg: "#3b6fd4", iconPaths: ['M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'], done: true, image: 'https://appcdn.goqii.com/storeimg/53114_1784618074.png' },
    { t: "Add Your Movement", p: "+10", tm: "Logged 8:05 AM", tint: "#e4f6ec", fg: "#1f8a5b", iconPaths: ['M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z', 'M9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7'], done: true },
    { t: "3-Minute Breathing", p: "+5", tm: "Logged 8:20 AM", tint: "#e4f6ec", fg: "#17806b", iconPaths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'], done: true },
    { t: "Submit Math Homework", p: "+15", tm: "Due 4:00 PM", tint: "#fdeccf", fg: "#b06a12", iconPaths: ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z'], done: false },
    { t: "Science Lab Report", p: "+20", tm: "Due tomorrow", tint: "#e7eefc", fg: "#3b6fd4", iconPaths: ['M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3', 'M8 3h8', 'M7 15h10'], done: false },
    { t: "Read Science Chapter 4", p: "+10", tm: "10 min", tint: "#fdeccf", fg: "#b06a12", iconPaths: ['M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z', 'M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z'], done: false },
    { t: "Daily Reflection", p: "+5", tm: "2 min", tint: "#ece8fb", fg: "#6d54d8", iconPaths: ['M9 2h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1z', 'M9 12l2 2 4-4'], done: false },
  ];

  const kindFor = (t: string) => {
    const m: Record<string, string> = { 
      'Log Your Mood': 'mood', 
      "Add Last Night's Sleep": 'sleep', 
      'Drink Water': 'water', 
      'Add Your Movement': 'movement', 
      '3-Minute Breathing': 'breathing', 
      'Submit Math Homework': 'submission', 
      'Science Lab Report': 'submission', 
      'Read Science Chapter 4': 'reading', 
      'Daily Reflection': 'reflection' 
    };
    return m[t] || 'reflection';
  };

  const triggerFilePick = (questTitle: string) => {
    setActiveUploadQuest(questTitle);
    const el = document.getElementById("hidden-quest-file-picker");
    if (el) {
      (el as HTMLInputElement).value = '';
      el.click();
    }
  };

  const handleUploadFile = (questTitle: string, file: File) => {
    setFiles(prev => ({ ...prev, [questTitle]: file.name }));
    if (!logged.includes(questTitle)) {
      completeQuest(questTitle);
    }
  };

  const removeAttachedFile = (questTitle: string) => {
    setFiles(prev => {
      const copy = { ...prev };
      delete copy[questTitle];
      return copy;
    });
    setLogged(prev => prev.filter(x => x !== questTitle));
  };

  const handlePickFile = (questTitle: string) => {
    triggerFilePick(questTitle);
  };

  // Render a Single Quest Item Row
  const renderQuestRow = (q: Quest) => {
    const isSub = kindFor(q.t) === 'submission';
    const isDone = logged.includes(q.t);
    const hasFile = files[q.t];

    const toggleQuest = () => {
      if (logged.includes(q.t)) {
        setLogged(prev => prev.filter(x => x !== q.t));
        if (files[q.t]) {
          const updatedFiles = { ...files };
          delete updatedFiles[q.t];
          setFiles(updatedFiles);
        }
      } else {
        if (isSub) {
          triggerFilePick(q.t);
        } else {
          completeQuest(q.t);
        }
      }
    };

    return (
      <div 
        key={q.t} 
        className={`flex items-center gap-3 bg-white border border-neutral-200/70 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 ${isDone ? 'opacity-70 bg-neutral-50/50' : ''}`}
      >
        {/* Icon Badge */}
        <ThreeDAnimatedIcon 
          paths={q.image ? undefined : q.iconPaths} 
          image={q.image}
          colorTheme={getThemeFromQuestColors(q.fg)}
          size={20}
          containerSize={40}
          onClick={() => setOpenQuest(q.t)}
          title="View Activity Detail"
        />

        {/* Quest Info */}
        <div onClick={() => setOpenQuest(q.t)} className="flex-1 min-w-0 cursor-pointer">
          <div className={`text-sm font-semibold text-neutral-900 ${isDone ? 'line-through text-neutral-400' : ''}`}>
            {q.t}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-400">
            <span className="font-bold text-emerald-600">{q.p} TP</span>
            <span>·</span>
            <span className="truncate">
              {isDone ? (isSub ? `Submitted · ${hasFile || 'doc.pdf'}` : 'Logged') : q.tm}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          {isSub && (
            <button 
              onClick={() => handlePickFile(q.t)}
              className={`p-1.5 rounded-lg border transition-colors ${isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/50' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-800'}`}
              title={isDone ? "Change Attached File" : "Attach File"}
            >
              <Paperclip className="w-4 h-4" />
            </button>
          )}
          {!isSub && (
            <button 
              onClick={toggleQuest}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 text-white' : 'border-2 border-neutral-300 hover:border-emerald-500 text-transparent hover:text-emerald-500'}`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Water, Sleep, Movement Custom logs
  const renderLogControl = (kind: string, qTitle: string) => {
    const wrap = (label: string, body: React.ReactNode) => (
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-neutral-800">{label}</label>
        {body}
      </div>
    );

    if (kind === 'mood') {
      const moods = [
        { label: 'Great', c: '#1f8a5b', bg: '#e4f6ec' }, 
        { label: 'Good', c: '#3b6fd4', bg: '#e7eefc' }, 
        { label: 'Okay', c: '#b06a12', bg: '#fdeccf' }, 
        { label: 'Low', c: '#6d54d8', bg: '#ece8fb' }, 
        { label: 'Stressed', c: '#c14b4b', bg: '#fbe4e4' }
      ];
      return wrap('How are you feeling right now?', (
        <div className="grid grid-cols-5 gap-2">
          {moods.map(m => (
            <button
              key={m.label}
              onClick={() => setMoodSel(m.label)}
              className="text-center py-3.5 rounded-xl border-2 font-bold text-xs transition-all duration-200"
              style={{
                borderColor: moodSel === m.label ? m.c : '#e2e8f0',
                background: moodSel === m.label ? m.bg : '#fff',
                color: moodSel === m.label ? m.c : '#475569'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      ));
    }

    if (kind === 'water') {
      return wrap('How many glasses of water today?', (
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setWaterCount(Math.max(0, waterCount - 1))}
              className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center font-bold text-lg text-neutral-600 hover:bg-neutral-50"
            >
              −
            </button>
            <div className="text-center min-w-[70px]">
              <div className="text-3xl font-extrabold text-neutral-900">{waterCount}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">glasses</div>
            </div>
            <button 
              onClick={() => setWaterCount(waterCount + 1)}
              className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center font-bold text-lg text-neutral-600 hover:bg-neutral-50"
            >
              +
            </button>
          </div>
          {/* Cup visualizations */}
          <div className="flex gap-1.5 flex-wrap justify-center mt-2">
            {Array.from({ length: Math.max(8, waterCount) }).map((_, i) => (
              <svg 
                key={i} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={i < waterCount ? '#3b6fd4' : 'none'} 
                stroke={i < waterCount ? 'none' : '#cbd5e1'} 
                strokeWidth={2}
              >
                <path d="M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
              </svg>
            ))}
          </div>
        </div>
      ));
    }

    if (kind === 'sleep') {
      return wrap('How long did you sleep last night?', (
        <div className="flex flex-col gap-3">
          <div className="text-center text-2xl font-extrabold text-neutral-900">
            {Math.floor(sleepH)}h {Math.round((sleepH % 1) * 60)}m
          </div>
          <input 
            type="range" 
            min="0" 
            max="12" 
            step="0.5" 
            value={sleepH} 
            onChange={(e) => setSleepH(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: tealA }}
          />
          <div className="flex justify-between text-[11px] font-bold text-neutral-400">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </div>
      ));
    }

    if (kind === 'movement') {
      const activities = ['Walk', 'Run', 'Sports', 'Cycle', 'Yoga'];
      return wrap('What physical activity did you complete?', (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap justify-center">
            {activities.map(a => (
              <button
                key={a}
                onClick={() => setMoveSel(a)}
                className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${moveSel === a ? 'border-neutral-800 bg-neutral-100 text-neutral-900' : 'border-neutral-200 bg-white text-neutral-600'}`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 justify-center">
            <button 
              onClick={() => setMoveMin(Math.max(0, moveMin - 5))}
              className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center font-bold text-lg text-neutral-600 hover:bg-neutral-50"
            >
              −
            </button>
            <div className="text-center min-w-[70px]">
              <div className="text-3xl font-extrabold text-neutral-900">{moveMin}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">minutes</div>
            </div>
            <button 
              onClick={() => setMoveMin(moveMin + 5)}
              className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center font-bold text-lg text-neutral-600 hover:bg-neutral-50"
            >
              +
            </button>
          </div>
        </div>
      ));
    }

    if (kind === 'breathing') {
      return wrap('Take deep breaths to find your focus', (
        <div className="text-center py-6">
          <div className="w-28 h-28 rounded-full bg-teal-50 border-2 border-[#24796b] flex items-center justify-center text-[#24796b] font-bold text-sm mx-auto mb-4 animate-breathe">
            Breathe
          </div>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Find a quiet spot. Follow the pulse: breathe in as it expands, out as it contracts. Repeat for 3 minutes.
          </p>
        </div>
      ));
    }

    if (kind === 'reading') {
      return wrap('Track your self-study reading goals', (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setReadDone(!readDone)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${readDone ? 'border-emerald-500 bg-emerald-50/50' : 'border-neutral-200 bg-white'}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${readDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 transparent'}`}>
              {readDone && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
            <span className="text-sm font-bold text-neutral-800">I completed reading Science Chapter 4</span>
          </button>
        </div>
      ));
    }

    if (kind === 'submission') {
      const attachedFileName = files[qTitle];
      return wrap('Attach and upload your task file', (
        <div 
          onClick={() => triggerFilePick(qTitle)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              handleUploadFile(qTitle, file);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            attachedFileName 
              ? 'border-emerald-500 bg-emerald-50/10' 
              : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50/50'
          }`}
        >
          {attachedFileName ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-neutral-800 truncate max-w-xs">{attachedFileName}</div>
              <div className="text-[11px] text-emerald-600 font-bold">Successfully attached!</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeAttachedFile(qTitle);
                }}
                className="mt-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Paperclip className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-neutral-700">Drag and drop your file here, or click to browse</div>
              <div className="text-[11px] text-neutral-400 mt-1">Supports PDF, DOCX, PNG, JPG (Max 10MB)</div>
            </div>
          )}
        </div>
      ));
    }

    // Default Reflection
    return wrap('Reflect on what went well or what you learned today', (
      <textarea 
        placeholder="Type your notes or reflection here..."
        rows={4}
        className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all font-sans resize-y"
      />
    ));
  };

  // Quest Logging modal/panel view
  const renderQuestLogPanel = (wide: boolean) => {
    const all = quests();
    const q = all.find(x => x.t === openQuest) || all[0];
    const isDone = logged.includes(q.t);
    const kind = kindFor(q.t);

    const logAndEarn = () => {
      if (!logged.includes(q.t)) {
        completeQuest(q.t);
      }
      setOpenQuest(null);
    };

    return (
      <div className="flex flex-col gap-4">
        {/* Back Button */}
        <button 
          onClick={() => setOpenQuest(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24796b] hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to My Activities
        </button>

        {/* Content Wrapper Split */}
        <div className={`grid grid-cols-1 ${wide ? 'lg:grid-cols-12' : ''} gap-6`}>
          <div className={`${wide ? 'lg:col-span-7' : ''} bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm`}>
            {/* Header Detail */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: q.tint, color: q.fg }}>
                {q.image ? (
                  <img 
                    src={q.image} 
                    alt={q.t} 
                    className="w-9 h-9 object-contain" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  icon(q.iconPaths, { size: 24 })
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">{q.t}</h3>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                  <span className="font-bold text-emerald-600">{q.p} TP</span>
                  <span>·</span>
                  <span>{isDone ? 'Logged' : q.tm}</span>
                </p>
              </div>
            </div>

            {/* Custom Interactive Log Content */}
            {renderLogControl(kind, q.t)}

            {/* Submit / Log Button */}
            {isDone ? (
              <div className="mt-6 w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-center text-sm border border-emerald-200">
                ✓ Logged — nice work!
              </div>
            ) : (
              <button
                onClick={logAndEarn}
                disabled={kind === 'submission' && !files[q.t]}
                className={`mt-6 w-full py-3.5 rounded-xl text-white font-bold text-center text-sm shadow-sm transition-colors ${
                  kind === 'submission' && !files[q.t]
                    ? 'bg-neutral-300 cursor-not-allowed'
                    : 'hover:opacity-95'
                }`}
                style={{ background: kind === 'submission' && !files[q.t] ? '#d4d4d4' : tealA }}
              >
                {kind === 'submission' && !files[q.t] ? 'Attach file to submit' : `Log & earn ${q.p} TP`}
              </button>
            )}
          </div>

          {/* Pending / Side Quest list inside Logging Flow */}
          <div className={`${wide ? 'lg:col-span-5' : ''} flex flex-col gap-4`}>
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-neutral-800">Still to do today</span>
                <span className="text-xs font-bold text-neutral-400">
                  {all.filter(x => !logged.includes(x.t) && x.t !== q.t).length} left
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {all.filter(x => !logged.includes(x.t) && x.t !== q.t).slice(0, 3).map(p => (
                  <div 
                    key={p.t} 
                    onClick={() => setOpenQuest(p.t)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-300 bg-neutral-50/50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: p.tint, color: p.fg }}>
                      {icon(p.iconPaths, { size: 16 })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-neutral-800 truncate">{p.t}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{p.p} TP · {p.tm}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Profile and Avatar Designer Panel
  const renderProfilePanel = (wide: boolean) => {
    const bd = badgeData();
    const earnedCount = bd.filter(b => b.earned).length;
    const items = getAvatarItems({
      points: thrivePoints,
      coins: 320,
      streak: 19,
      waterCount: waterCount,
      sleepHours: sleepH,
      breathingCount: 12,
      schoolTasksDone: 18
    });

    return (
      <div className="flex flex-col gap-6">
        {/* Upper Grid Split */}
        <div className={`grid grid-cols-1 ${wide ? 'lg:grid-cols-12' : ''} gap-6`}>
          {/* My Avatar Display Card */}
          <div className={`${wide ? 'lg:col-span-5' : ''} bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-center`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
              My Avatar
            </span>
            <div className="w-48 h-56 mb-4 flex items-center justify-center bg-neutral-50/50 border border-neutral-100 rounded-2xl shadow-inner relative overflow-hidden group">
              <RenderCustomAvatar
                equipped={equipped}
                skinId={skinId}
                hairColorId={hairColorId}
                size={200}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-white/95 text-neutral-800 text-[9px] font-black px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Compass className="w-3 h-3 animate-spin" /> Interactive Closet
                </span>
              </div>
            </div>

            <h3 className="text-lg font-black text-neutral-900 leading-tight">Aarav Sharma</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#24796b] bg-[#e4f6ec] border border-[#c2ecd6] px-3 py-0.5 rounded-full mt-1.5">
              SILVER TIER
            </span>

            <div className="flex flex-col gap-2 mt-5 w-full max-w-xs text-left text-xs font-bold text-neutral-500">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Thrive Points</span>
                <span className="text-neutral-900 font-extrabold">⭐ <AnimatedPointsCounter value={thrivePoints} /> TP</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> Current Streak</span>
                <span className="text-neutral-900 font-extrabold">🔥 19 Day Streak</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-indigo-500" /> Badges Earned</span>
                <span className="text-neutral-900 font-extrabold">🏆 {earnedCount} Badges</span>
              </div>
            </div>

            <button
              onClick={() => setSection('avatar_customize')}
              className="mt-6 w-full bg-[#24796b] hover:bg-[#1a5b51] text-white text-xs font-black py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              CUSTOMIZE AVATAR
            </button>
          </div>

          {/* Badges Grid Collection with rewards mappings */}
          <div className={`${wide ? 'lg:col-span-7' : ''} bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-neutral-800">Your Badges & Reward Unlocks</h4>
              <span className="text-xs font-bold text-neutral-400">{earnedCount} of {bd.length} earned</span>
            </div>
            <p className="text-xs text-neutral-500 leading-normal mb-5">
              Each badge unlocks an exclusive game item for your avatar closet. Complete goals to unlock!
            </p>



            {/* Badges Flow Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {bd.map(b => {
                const reward = b.avatarReward;
                const isRewardEquipped = reward ? Object.values(equipped).includes(reward.id) : false;
                const isUnlocked = b.earned || (reward ? unlockedItemIds.includes(reward.id) : false);

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBadgeDetail(b)}
                    className="text-center flex flex-col items-center justify-start border border-neutral-100/40 p-2.5 rounded-xl bg-neutral-50/20 hover:bg-neutral-50/75 cursor-pointer hover:shadow-sm transition-all relative group"
                    title="Click to inspect in 3D"
                  >
                    <div className="mb-2 shrink-0 pointer-events-none">
                      <AnimatedAchievementBadge
                        image={b.image}
                        badgeName={b.name}
                        description={b.description}
                        points={b.points}
                        isUnlocked={b.earned}
                        colorTheme={b.colorTheme}
                        iconType={b.iconType}
                        size={52}
                      />
                    </div>
                    <div className={`text-[10px] font-black ${b.earned ? 'text-neutral-800' : 'text-neutral-400'} line-clamp-1`}>
                      {b.name}
                    </div>
                    {b.earned ? (
                      <div className="text-[8.5px] font-black text-emerald-600 uppercase tracking-wider mt-0.5">Earned</div>
                    ) : (
                      <div className="w-full max-w-[64px] mt-1">
                        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ background: b.disc, width: `${(b.have / b.need) * 100}%` }} />
                        </div>
                        <div className="text-[8px] text-neutral-400 mt-0.5">{b.have}/{b.need}</div>
                      </div>
                    )}
                    {/* Visual Rewards Connector */}
                    {reward && (
                      <div className="mt-2.5 w-full pt-1.5 border-t border-neutral-100/80">
                        <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Unlocks:</span>
                        <div className="text-[8.5px] font-bold text-neutral-700 leading-tight truncate mt-0.5" title={reward.name}>
                          🎁 {reward.name}
                        </div>
                        {isUnlocked ? (
                          <span className={`block text-[8px] font-black mt-1 uppercase ${isRewardEquipped ? 'text-emerald-600' : 'text-neutral-500'}`}>
                            {isRewardEquipped ? 'EQUIPPED' : 'UNLOCKED'}
                          </span>
                        ) : (
                          <span className="block text-[8px] font-black text-neutral-400 mt-1 uppercase flex items-center justify-center gap-0.5">
                            <Lock className="w-2 h-2" /> LOCKED
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mountain Journey Track */}
        <MountainScene tall={wide} />

        {/* Avatar Collection Progress Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-black text-neutral-800">My Collection Progress</h4>
            <span className="text-xs font-bold text-neutral-400">
              {items.filter(i => unlockedItemIds.includes(i.id)).length} of {items.length} unlocked
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-normal mb-5">
            Collect special items by completing school quests, keeping streaks alive, and logging wellness objectives daily.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Outfits', icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />, have: items.filter(i => (i.category === 'TOPS' || i.category === 'BOTTOMS') && unlockedItemIds.includes(i.id)).length, total: items.filter(i => i.category === 'TOPS' || i.category === 'BOTTOMS').length },
              { label: 'Accessories', icon: <Backpack className="w-4 h-4 text-orange-500" />, have: items.filter(i => i.category === 'ACCESSORIES' && unlockedItemIds.includes(i.id)).length, total: items.filter(i => i.category === 'ACCESSORIES').length },
              { label: 'Shoes', icon: <Compass className="w-4 h-4 text-amber-500" />, have: items.filter(i => i.category === 'SHOES' && unlockedItemIds.includes(i.id)).length, total: items.filter(i => i.category === 'SHOES').length },
              { label: 'Headwear', icon: <Award className="w-4 h-4 text-indigo-500" />, have: items.filter(i => i.category === 'HEADWEAR' && unlockedItemIds.includes(i.id)).length, total: items.filter(i => i.category === 'HEADWEAR').length },
              { label: 'Special Effects', icon: <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />, have: items.filter(i => i.category === 'EFFECTS' && unlockedItemIds.includes(i.id)).length, total: items.filter(i => i.category === 'EFFECTS').length },
            ].map((c, i) => (
              <div key={i} className="bg-neutral-50 border border-neutral-200/50 rounded-xl p-3 flex flex-col justify-between shadow-inner">
                <div className="flex items-center gap-1.5">
                  {c.icon}
                  <span className="text-[10px] font-black text-neutral-700">{c.label}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>{c.have} / {c.total}</span>
                    <span className="text-[9px] text-neutral-400">{Math.round((c.have / c.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(c.have / c.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Avatar Customizer Closet Panel
  const renderAvatarCustomizePanel = (wide: boolean) => {
    return (
      <AvatarCloset
        stats={{
          points: thrivePoints,
          coins: 320,
          streak: 19,
          waterCount: waterCount,
          sleepHours: sleepH,
          breathingCount: logged.includes("3-Minute Breathing") ? 13 : 12,
          schoolTasksDone: 18
        }}
        onClose={() => setSection('profile')}
        onNavigateToQuest={(targetSec) => setSection(targetSec)}
      />
    );
  };

  // Teacher Messages Panel
  const renderMessagesPanel = (wide: boolean) => {
    const teachers = [
      { name: 'Ms. Anjali Menon', d: 'Class Teacher · 8B', i: 'AM', bg: '#e7eefc', fg: '#3b6fd4', last: 'Please bring the signed form tomorrow.', t: '9:12 AM' },
      { name: 'Mr. Verma', d: 'Mathematics', i: 'RV', bg: '#e4f6ec', fg: '#1f8a5b', last: 'Great improvement in the last test!', t: 'Yesterday' },
      { name: 'Ms. Nair', d: 'Science', i: 'SN', bg: '#fdeccf', fg: '#b06a12', last: 'Lab report submissions are due Friday.', t: 'Mon' }
    ];

    const currentThreadName = msgThread || teachers[0].name;
    const currentTeacher = teachers.find(t => t.name === currentThreadName) || teachers[0];
    const messages = customMsgs[currentThreadName] || [];

    const handleSendMessage = () => {
      if (!typedMsg.trim()) return;
      const newMsg = { text: typedMsg, me: true, t: "Just now" };
      setCustomMsgs(prev => ({
        ...prev,
        [currentThreadName]: [...(prev[currentThreadName] || []), newMsg]
      }));
      setTypedMsg("");
    };

    const threadList = (
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-1">Teachers</h4>
        <div className="flex flex-col gap-1">
          {teachers.map(t => {
            const isActive = t.name === currentThreadName;
            return (
              <button
                key={t.name}
                onClick={() => setMsgThread(t.name)}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all text-left ${isActive ? 'bg-neutral-100 border border-neutral-200/60' : 'hover:bg-neutral-50'}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: t.bg, color: t.fg }}>
                  {t.i}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-900">{t.name}</span>
                    <span className="text-[10px] text-neutral-400">{t.t}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-neutral-500 mt-0.5">{t.d}</div>
                  <div className="text-[11px] text-neutral-400 mt-1 truncate">{t.last}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );

    const chatWindow = (
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col min-h-[460px]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: currentTeacher.bg, color: currentTeacher.fg }}>
            {currentTeacher.i}
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy-900">{currentTeacher.name}</h4>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active · {currentTeacher.d}
            </div>
          </div>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2.5">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${m.me ? 'bg-neutral-900 text-white self-end rounded-tr-none' : 'bg-neutral-100 text-neutral-800 self-start rounded-tl-none border border-neutral-200/50'}`}
              style={m.me ? { background: tealA } : {}}
            >
              <div>{m.text}</div>
              <div className={`text-[9px] mt-1.5 text-right ${m.me ? 'text-white/60' : 'text-neutral-400'}`}>
                {m.t}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Controls */}
        <div className="flex gap-2 items-center bg-neutral-50 border border-neutral-200/80 rounded-full p-1.5 pl-4">
          <input 
            type="text" 
            value={typedMsg}
            onChange={(e) => setTypedMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${currentTeacher.name.split(' ')[0]}...`}
            className="flex-1 text-sm bg-transparent border-none outline-none text-neutral-800 placeholder-neutral-400"
          />
          <button 
            onClick={handleSendMessage}
            className="w-9 h-9 rounded-full bg-neutral-950 hover:bg-neutral-900 text-white flex items-center justify-center shrink-0 transition-colors"
            style={{ background: tealA }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    if (wide) {
      return (
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Messages · Teachers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">{threadList}</div>
            <div className="md:col-span-7">{chatWindow}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {threadList}
        {chatWindow}
      </div>
    );
  };

  // Wellness Coach Priya chat view
  const renderCoachPanel = (wide: boolean) => {
    const currentTeacher = { name: "Coach Priya", i: "CP", bg: "#d7efe6", fg: "#17806b", d: "Wellness Mentor" };
    const messages = customMsgs["Coach Priya"] || [];

    const handleSendMessage = () => {
      if (!typedMsg.trim()) return;
      const newMsg = { text: typedMsg, me: true, t: "Just now" };
      setCustomMsgs(prev => ({
        ...prev,
        "Coach Priya": [...(prev["Coach Priya"] || []), newMsg]
      }));
      setTypedMsg("");
    };

    return (
      <div className="max-w-2xl mx-auto w-full bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col min-h-[460px]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-xl bg-[#d7efe6] text-[#17806b] flex items-center justify-center font-bold text-sm shrink-0">
            CP
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy-900">Coach Priya</h4>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active · Wellness Mentor
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-normal my-3 p-3 bg-neutral-50 rounded-xl">
          Coach Priya is your wellness counselor, here to guide you with habit consistency, sleep, and fitness goals. For curriculum homework questions, please message your classroom teachers.
        </p>

        {/* Message Bubble List */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2.5">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${m.me ? 'bg-neutral-900 text-white self-end rounded-tr-none' : 'bg-neutral-100 text-neutral-800 self-start rounded-tl-none border border-neutral-200/50'}`}
              style={m.me ? { background: tealA } : {}}
            >
              <div>{m.text}</div>
              <div className={`text-[9px] mt-1.5 text-right ${m.me ? 'text-white/60' : 'text-neutral-400'}`}>
                {m.t}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Controls */}
        <div className="flex gap-2 items-center bg-neutral-50 border border-neutral-200/80 rounded-full p-1.5 pl-4">
          <input 
            type="text" 
            value={typedMsg}
            onChange={(e) => setTypedMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message Coach Priya..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-neutral-800 placeholder-neutral-400"
          />
          <button 
            onClick={handleSendMessage}
            className="w-9 h-9 rounded-full bg-neutral-950 hover:bg-neutral-900 text-white flex items-center justify-center shrink-0 transition-colors"
            style={{ background: tealA }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Core activities overview (Home / Today view)
  const renderTodayPanel = (wide: boolean) => {
    const qList = quests();
    const loggedCount = qList.filter(q => q.done || logged.includes(q.t)).length;
    const totalCount = qList.length;
    const remainingCount = totalCount - loggedCount;

    const ringSz = wide ? 118 : 96;
    const strokeWidth = 11;
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference * (loggedCount / totalCount);
    const fb = featuredBadge();

    const mainContent = (
      <div className="flex flex-col gap-6">
        {/* NEW AVATAR ITEM UNLOCKED BANNER */}
        {newUnlockNotification && (
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-3 animate-bounce border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/90">New Reward Unlocked!</div>
                <div className="text-xs font-extrabold">{newUnlockNotification} is now available in your closet.</div>
              </div>
            </div>
            <button
              onClick={() => {
                setSection('profile');
                setNewUnlockNotification(null);
              }}
              className="bg-white text-amber-600 hover:bg-neutral-100 text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              [ View Closet ]
            </button>
          </div>
        )}

        {/* Daily Goal Progress Hero */}
        <div 
          className="rounded-2xl p-5 text-white flex items-center justify-between gap-4 shadow-md transition-shadow"
          style={{ background: tealA }}
        >
          <div className="flex items-center gap-4">
            {/* Progress Ring */}
            <div className="relative shrink-0" style={{ width: ringSz, height: ringSz }}>
              <svg width={ringSz} height={ringSz} viewBox="0 0 110 110" className="transform -rotate-90">
                <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={strokeWidth} />
                <circle 
                  cx="55" 
                  cy="55" 
                  r={radius} 
                  fill="none" 
                  stroke="#f5b544" 
                  strokeWidth={strokeWidth} 
                  strokeDasharray={`${progressOffset} ${circumference}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-2xl font-black">{loggedCount}<span className="text-sm font-semibold opacity-70">/{totalCount}</span></div>
                <div className="text-[9px] font-bold uppercase tracking-wider opacity-82 mt-0.5">quests</div>
              </div>
            </div>

            {/* Header Stats */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-82">DAILY GOAL</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full text-xs font-bold text-amber-300">
                  🔥 19
                </span>
              </div>
              <h2 className="text-lg font-bold mt-2 leading-tight">Keep going, Aarav</h2>
              <p className="text-xs opacity-90 mt-1">
                {loggedCount} of {totalCount} quests done · {remainingCount} to go
              </p>
              <button 
                onClick={() => setSection('summary')}
                className="inline-flex items-center gap-1 bg-white text-neutral-900 px-3.5 py-1.5 rounded-lg text-xs font-bold mt-4 shadow-sm hover:bg-neutral-50 transition-colors"
                style={{ color: tealA }}
              >
                View today's summary
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Top Featured Badge */}
          {fb && (
            <div className="flex flex-col items-center justify-center shrink-0 border-l border-white/10 pl-5">
              {royalBadge(fb, 56, 'banner')}
              <div className="text-xs font-bold text-white mt-1.5 text-center leading-tight max-w-[90px] truncate">{fb.name}</div>
              <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider text-center mt-0.5">TOP BADGE</div>
            </div>
          )}
        </div>

        {/* Quest List Calendar */}
        {renderCalendarCard(wide)}

        {selDay === 14 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-800">Complete today’s quests</h3>
              <span className="text-xs font-bold text-neutral-400">{loggedCount} of {totalCount} done</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {qList.map(q => renderQuestRow(q))}
            </div>
          </div>
        ) : (
          renderDayDetail()
        )}
      </div>
    );

    if (wide) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Quest Content Area */}
          <div className="lg:col-span-8">
            {mainContent}
          </div>

          {/* Sidebar Area: Day Streak, TH Coins, Silver Tier & Notifications */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Day Streak */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <ThreeDAnimatedIcon 
                  lucideIcon={<Flame className="w-4 h-4 text-white fill-white/20" />}
                  colorTheme="orange"
                  size={16}
                  containerSize={36}
                />
                <span className="text-xl font-extrabold text-neutral-900 mt-2">19</span>
                <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-wider leading-none">Day Streak</span>
              </div>

              {/* Coins */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <ThreeDAnimatedIcon 
                  lucideIcon={<Coins className="w-4 h-4 text-white fill-white/20" />}
                  colorTheme="yellow"
                  size={16}
                  containerSize={36}
                />
                <span className="text-xl font-extrabold text-neutral-900 mt-2">320</span>
                <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-wider leading-none">TH Coins</span>
              </div>

              {/* Tier */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <ThreeDAnimatedIcon 
                  lucideIcon={<Shield className="w-4 h-4 text-white fill-white/20" />}
                  colorTheme="neutral"
                  size={16}
                  containerSize={36}
                />
                <span className="text-xl font-extrabold text-neutral-900 mt-2">Silver</span>
                <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-wider leading-none">Tier</span>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-800">Notifications</h3>
                  {unreadNotifications && (
                    <span className="bg-[#24796b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      2
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setUnreadNotifications(false)}
                  className="text-xs font-semibold text-[#24796b] hover:opacity-80 transition-opacity"
                >
                  Mark all read
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-1">From your coach, teachers &amp; school</p>

              <div className="flex flex-col gap-4 mt-5">
                {/* Item 1: Coach Priya */}
                <div className="flex items-start gap-3">
                  <ThreeDAnimatedIcon 
                    lucideIcon={<MessageCircle className="w-4.5 h-4.5 text-white fill-white/20" />}
                    colorTheme="teal"
                    size={18}
                    containerSize={36}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">Coach Priya</span>
                      <span className="text-[10px] text-neutral-400">2m</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                      Finish your breathing quest before the day ends.
                    </p>
                  </div>
                  {unreadNotifications && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  )}
                </div>

                {/* Item 2: Ms. Anjali */}
                <div className="flex items-start gap-3 pt-3 border-t border-neutral-100">
                  <ThreeDAnimatedIcon 
                    lucideIcon={<MessageCircle className="w-4.5 h-4.5 text-white fill-white/20" />}
                    colorTheme="sapphire"
                    size={18}
                    containerSize={36}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">Ms. Anjali · Class Teacher</span>
                      <span className="text-[10px] text-neutral-400">1h</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                      Please bring the signed science-trip form tomorrow.
                    </p>
                  </div>
                  {unreadNotifications && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  )}
                </div>

                {/* Item 3: Challenge */}
                <div className="flex items-start gap-3 pt-3 border-t border-neutral-100">
                  <ThreeDAnimatedIcon 
                    lucideIcon={<Trophy className="w-4.5 h-4.5 text-white fill-white/20" />}
                    colorTheme="amber"
                    size={18}
                    containerSize={36}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">Challenge</span>
                      <span className="text-[10px] text-neutral-400">3h</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                      You slipped to rank 40 in “Around the World” — log steps to climb back.
                    </p>
                  </div>
                </div>

                {/* Item 4: Notice board */}
                <div className="flex items-start gap-3 pt-3 border-t border-neutral-100">
                  <ThreeDAnimatedIcon 
                    lucideIcon={<Star className="w-4.5 h-4.5 text-white fill-white/20" />}
                    colorTheme="emerald"
                    size={18}
                    containerSize={36}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">Notice board</span>
                      <span className="text-[10px] text-neutral-400">Today</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                      Sports Day trials open — sign up by Friday.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return mainContent;
  };

  // Challenges/Competition Panel
  const renderChallengesPanel = (wide: boolean) => {
    const data = [
      { t: 'Class Step Challenge', s: '8B vs 8A · ends in 3 days', pct: 68, meta: '8B leading by 4,200 steps', rew: '+120', tint: '#e4f6ec', fg: '#1f8a5b', paths: ['M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z', 'M9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7'], cta: 'Continue' },
      { t: 'Hydration Hero', s: '5-day water streak', pct: 60, meta: 'Day 3 of 5', rew: '+60', tint: '#e7eefc', fg: '#3b6fd4', paths: ['M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'], cta: 'Continue', image: 'https://appcdn.goqii.com/storeimg/53114_1784618074.png' },
      { t: 'Focus Week', s: 'Finish all study quests, 5 days', pct: 40, meta: '2 of 5 days', rew: '+100', tint: '#fdeccf', fg: '#b06a12', paths: ['M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z', 'M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z'], cta: 'Continue' },
      { t: 'Calm Mind', s: '10 breathing sessions', pct: 0, meta: 'Not started', rew: '+80', tint: '#ece8fb', fg: '#6d54d8', paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'], cta: 'Join' },
    ];

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          In progress school challenges
        </h2>
        <div className={`grid grid-cols-1 ${wide ? 'lg:grid-cols-2' : ''} gap-4`}>
          {data.map(c => (
            <div key={c.t} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <ThreeDAnimatedIcon 
                  paths={c.image ? undefined : c.paths}
                  image={c.image}
                  colorTheme={getThemeFromQuestColors(c.fg)}
                  size={20}
                  containerSize={40}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-neutral-900 truncate">{c.t}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{c.s}</div>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-full pl-1.5 pr-2.5 py-1 text-xs font-extrabold shrink-0 shadow-sm hover:scale-105 transition-transform">
                  <ThreeDAnimatedIcon 
                    lucideIcon={<Coins className="w-3 h-3 text-white fill-white/20" />}
                    colorTheme="yellow"
                    size={12}
                    containerSize={22}
                  />
                  {c.rew}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden my-4">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.fg }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-semibold">{c.meta}</span>
                <button 
                  onClick={() => alert(`Joined ${c.t}!`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: tealA }}
                >
                  {c.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Rewards & coins marketplace
  const renderRewardsPanel = (wide: boolean) => {
    const rewards: RewardItem[] = [
      { t: 'Canteen voucher', c: 250, tint: '#fdeccf', fg: '#b06a12', iconPaths: ['M6 2l1 4h10l1-4', 'M4 6h16l-1.5 14a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2z'] },
      { t: 'Extra library time', c: 150, tint: '#e7eefc', fg: '#3b6fd4', iconPaths: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
      { t: 'Homework pass', c: 400, tint: '#e4f6ec', fg: '#1f8a5b', iconPaths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 15l2 2 4-4'] },
      { t: 'Pick sports period', c: 300, tint: '#ece8fb', fg: '#6d54d8', iconPaths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 2a15 15 0 0 1 0 20', 'M12 2a15 15 0 0 0 0 20', 'M2 12h20'] },
      { t: 'Digital badge', c: 100, tint: '#e0f3ee', fg: '#17806b', iconPaths: ['M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M8.5 13.5L7 22l5-3 5 3-1.5-8.5'] },
      { t: 'Movie afternoon', c: 500, tint: '#e7eefc', fg: '#3b6fd4', iconPaths: ['M2 6h20v12H2z', 'M2 10h20', 'M7 6v4M12 6v4M17 6v4'] },
    ];

    const currentCoins = 320; // user's total spendable coin reserve

    const claimReward = (rTitle: string, rCost: number) => {
      if (currentCoins < rCost) return;
      setRedeemed(prev => [...prev, rTitle]);
    };

    return (
      <div className="flex flex-col gap-6">
        {/* Split Header Info */}
        <div className={`grid grid-cols-1 ${wide ? 'md:grid-cols-2' : ''} gap-6`}>
          {/* Tier points overview */}
          <div className="rounded-2xl p-5 text-white flex flex-col justify-between shadow-md" style={{ background: tealA }}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-82">Tier points (Effort score)</span>
                <h3 className="text-3xl font-extrabold mt-2 leading-none">
                  <AnimatedPointsCounter value={thrivePoints} /> <span className="text-sm font-semibold opacity-70">TP</span>
                </h3>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Award className="w-8 h-8 text-neutral-200" />
                <span className="text-xs font-bold">Silver</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden my-4">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '64%' }} />
            </div>
            <p className="text-xs opacity-90">890 Tier Points to Gold Tier</p>
          </div>

          {/* Spendable Coins Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Coins className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">TH Coins (Spendable)</span>
                <div className="text-2xl font-black text-neutral-900">{currentCoins}</div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mt-4">
              TH Coins are spendable — redeem them for campus rewards. Earn them by completing activities set by your school.
            </p>
          </div>
        </div>

        {/* Active Rewards Program */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: tealA, color: '#fff' }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-neutral-900">Term 2 Wellness Rewards</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Active program · set by your school · ends 30 Sep</div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
            Live
          </span>
        </div>

        {/* Rewards Market grid */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Redeem with TH Coins</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {rewards.map(r => {
              const affordable = currentCoins >= r.c;
              const isRedeemed = redeemed.includes(r.t);
              const btnTxt = isRedeemed ? 'Pending Approval' : (affordable ? 'Redeem' : 'Not enough');

              return (
                <div key={r.t} className="bg-white border border-neutral-200 rounded-2xl p-4 text-center shadow-sm flex flex-col justify-between">
                  <div className="flex justify-center mb-3">
                    <ThreeDAnimatedIcon 
                      paths={r.iconPaths}
                      colorTheme={getThemeFromQuestColors(r.fg)}
                      size={20}
                      containerSize={42}
                    />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">{r.t}</h4>
                  <div className="flex items-center justify-center gap-1.5 my-3 bg-amber-50/70 border border-amber-100/80 rounded-full px-2.5 py-1 w-fit mx-auto shadow-sm">
                    <ThreeDAnimatedIcon 
                      lucideIcon={<Coins className="w-3.5 h-3.5 text-white fill-white/20" />}
                      colorTheme="yellow"
                      size={12}
                      containerSize={20}
                    />
                    <span className="text-xs font-black text-amber-800">{r.c} coins</span>
                  </div>
                  <button
                    onClick={() => claimReward(r.t, r.c)}
                    disabled={!affordable || isRedeemed}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${isRedeemed ? 'bg-amber-50 text-amber-700 border border-amber-200' : (affordable ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed')}`}
                    style={affordable && !isRedeemed ? { background: tealA } : {}}
                  >
                    {btnTxt}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Calendar strip component
  const renderCalendarCard = (wide: boolean) => {
    const data = historyData();
    const dowShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const center = selDay;
    const MIND = 1;
    const MAXD = 15;

    let start = center - 2;
    let end = center + 2;
    if (start < MIND) {
      end += (MIND - start);
      start = MIND;
    }
    if (end > 31) {
      start -= (end - 31);
      end = 31;
    }

    const days = [];
    for (let d = start; d <= end; d++) {
      days.push(d);
    }

    const chev = (dir: number) => {
      const canGo = dir < 0 ? center > MIND : center < MAXD;
      return (
        <button 
          onClick={canGo ? () => setSelDay(center + dir) : undefined}
          disabled={!canGo}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${canGo ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' : 'text-neutral-300'}`}
        >
          {dir < 0 ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      );
    };

    return (
      <div className={`flex items-center gap-3 bg-white p-3 ${wide ? 'border border-neutral-200 rounded-2xl shadow-sm' : 'border-b border-neutral-200'}`}>
        <button 
          onClick={() => setSelDay(14)}
          className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 shrink-0"
          title="Back to Today"
        >
          <Calendar className="w-5 h-5" />
        </button>
        {chev(-1)}
        <div className="flex-1 flex items-center justify-between gap-2.5">
          {days.map(d => {
            const isCenter = d === center;
            const isToday = d === 14;
            const future = d > 14;
            const info = data[d];
            const dot = (info && !future && d !== 14) ? { perfect: '#1f8a5b', good: '#3b6fd4', partial: '#b06a12', rest: '#94a3b8' }[info.st] : null;

            if (isCenter) {
              return (
                <div 
                  key={d} 
                  className="px-4 py-2 rounded-full text-xs font-bold shadow-sm text-white shrink-0"
                  style={{ background: tealA }}
                >
                  {(isToday ? 'Today, ' : dowShort[(2 + d) % 7] + ', ') + d + ' Jul'}
                </div>
              );
            }

            return (
              <button
                key={d}
                onClick={future ? undefined : () => setSelDay(d)}
                disabled={future}
                className="flex flex-col items-center justify-center gap-1 shrink-0 min-w-[36px]"
              >
                <span className={`text-base font-bold ${future ? 'text-neutral-200' : 'text-neutral-500'}`}>{d}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot || 'transparent' }} />
              </button>
            );
          })}
        </div>
        {chev(1)}
      </div>
    );
  };

  // Day logs builder based on history statuses
  const dayLogs = (day: number) => {
    const info = historyData()[day];
    if (!info || info.st === 'rest') return [];
    const W = [
      { l: 'Mood', v: 'Good — feeling focused', p: '+5', tint: '#e4f6ec', fg: '#1f8a5b', paths: ['M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'] },
      { l: 'Sleep', v: '7h 20m', p: '+5', tint: '#ece8fb', fg: '#6d54d8', paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'] },
      { l: 'Water', v: '6 glasses', p: '+5', tint: '#e7eefc', fg: '#3b6fd4', paths: ['M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'] },
      { l: 'Movement', v: '32 min walk', p: '+10', tint: '#e4f6ec', fg: '#1f8a5b', paths: ['M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z', 'M9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7'] },
      { l: 'Breathing', v: '3 min session', p: '+5', tint: '#e4f6ec', fg: '#17806b', paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'] },
    ];
    const T = [
      { l: 'Math Homework', v: 'Submitted', p: '+15', tint: '#fdeccf', fg: '#b06a12', paths: ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z'] },
      { l: 'Science Lab Report', v: 'Submitted', p: '+20', tint: '#e7eefc', fg: '#3b6fd4', paths: ['M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3', 'M8 3h8', 'M7 15h10'] },
      { l: 'Read Science Chapter 4', v: 'Completed', p: '+10', tint: '#fdeccf', fg: '#b06a12', paths: ['M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z', 'M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z'] },
    ];
    let wc = 5, tc = 2;
    if (info.st === 'perfect') { wc = 5; tc = 3; }
    else if (info.st === 'good') { wc = 5; tc = 1; }
    else if (info.st === 'partial') { wc = 3; tc = 1; }
    else if (info.st === 'today') { wc = 5; tc = 0; }
    return W.slice(0, wc).concat(T.slice(0, tc));
  };

  const renderDayDetail = () => {
    const day = selDay;
    const info = historyData()[day];
    const isFuture = day > 14;
    const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const wd = dowNames[(2 + day) % 7];
    const stMeta: Record<string, [string, string, string]> = { 
      perfect: ['Perfect day', '#1f8a5b', '#e4f6ec'], 
      good: ['Good day', '#3b6fd4', '#e7eefc'], 
      partial: ['Partial day', '#b06a12', '#fdeccf'], 
      rest: ['Rest day', '#94a3b8', '#eef1f6'], 
      today: ['In progress', tealA, 'rgba(28,28,28,0.1)'] 
    };
    const m = isFuture ? ['Upcoming', tealA, 'rgba(28,28,28,0.1)'] : (info ? stMeta[info.st] : ['No activity', '#94a3b8', '#eef1f6']);
    const logs = dayLogs(day);

    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-neutral-800">{(day === 14 ? 'Today · ' : '') + wd + ' · ' + day + ' July'}</h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: m[1], background: m[2] }}>
            {m[0]}
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-normal mb-4">
          {isFuture ? 'Quests unlock at midnight — come back to log them.' : (info ? (info.pts + ' Tier Points earned · ' + logs.length + ' activities logged') : 'Nothing logged this day')}
        </p>

        <div className="flex flex-col gap-2.5">
          {logs.map(it => (
            <div key={it.l} className="flex items-center gap-3 py-2 border-t border-neutral-100 first:border-none">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: it.tint, color: it.fg }}>
                {icon(it.paths, { size: 16 })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-800">{it.l}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{it.v}</div>
              </div>
              <span className="text-xs font-bold text-emerald-600">{it.p} TP</span>
            </div>
          ))}

          {!logs.length && (
            <div className="text-center py-6 text-xs text-neutral-400 italic">
              {isFuture ? 'Upcoming day — your quests appear here once the day begins.' : (info && info.st === 'rest' ? 'Rest day — no quests logged. That’s okay!' : 'No activities logged.')}
            </div>
          )}
        </div>
      </div>
    );
  };

  // State maps
  const historyData = (): Record<number, { pts: number; st: string }> => ({ 
    1: { pts: 80, st: 'perfect' }, 
    2: { pts: 45, st: 'partial' }, 
    3: { pts: 60, st: 'good' }, 
    4: { pts: 80, st: 'perfect' }, 
    5: { pts: 76, st: 'good' }, 
    6: { pts: 0, st: 'rest' }, 
    7: { pts: 40, st: 'partial' }, 
    8: { pts: 68, st: 'good' }, 
    9: { pts: 80, st: 'perfect' }, 
    10: { pts: 55, st: 'partial' }, 
    11: { pts: 80, st: 'perfect' }, 
    12: { pts: 72, st: 'good' }, 
    13: { pts: 80, st: 'perfect' }, 
    14: { pts: 30, st: 'today' } 
  });

  const badgeData = () => {
    return badgeState.map(b => ({
      ...b,
      earned: b.isUnlocked,
      disc: getBadgeGradient(b.colorTheme).disc,
      paths: b.paths || []
    }));
  };

  const featuredBadge = () => {
    const l = badgeData().filter(b => b.id !== 'month' && b.earned);
    const useList = l.length ? l : badgeData().filter(b => b.id !== 'month');
    return useList.sort((a, b) => b.have - a.have)[0];
  };

  const royalBadge = (b: any, size: number, ctx: string) => {
    const earned = b.earned;
    const uid = 'bdg_' + b.id + '_' + (ctx || '');
    const spikes = 16, cx = 50, cy = 50, rO = 49, rI = 41, pts = [];
    for (let i = 0; i < spikes * 2; i++) { 
      const r = i % 2 ? rI : rO; 
      const a = Math.PI * i / spikes - Math.PI / 2; 
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); 
    }

    return (
      <div 
        className="relative shrink-0" 
        style={{ 
          width: size, 
          height: size, 
          margin: '0 auto', 
          filter: earned ? 'drop-shadow(0 4px 6px rgba(180,128,31,0.3))' : 'grayscale(1)', 
          opacity: earned ? 1 : 0.45 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" className="block">
          <defs>
            <radialGradient id={uid + 'gold'} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#fff0bf" />
              <stop offset="45%" stopColor="#f3c24e" />
              <stop offset="100%" stopColor="#b8801f" />
            </radialGradient>
            <radialGradient id={uid + 'disc'} cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor={b.disc} stopOpacity={0.82} />
              <stop offset="100%" stopColor={b.disc} />
            </radialGradient>
          </defs>
          <polygon points={pts.join(' ')} fill={`url(#${uid}gold)`} stroke="#a9741a" strokeWidth={1} strokeLinejoin="round" />
          <circle cx={50} cy={50} r={34} fill="#fff" />
          <circle cx={50} cy={50} r={31} fill={`url(#${uid}disc)`} />
          <circle cx={50} cy={50} r={31} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          {b.image ? (
            <g>
              <defs>
                <clipPath id={uid + 'clip'}>
                  <circle cx={50} cy={50} r={31} />
                </clipPath>
              </defs>
              <image 
                href={b.image} 
                x={19}
                y={19}
                width={62} 
                height={62} 
                clipPath={`url(#${uid}clip)`}
              />
            </g>
          ) : (
            <g transform="translate(34, 34) scale(1.3)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {b.paths.map((d: string, i: number) => <path key={i} d={d} />)}
              </svg>
            </g>
          )}
        </svg>
        {earned && <div className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none animate-shine" style={{ background: 'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.85) 50%, transparent 62%)', backgroundSize: '250% 250%' }} />}
      </div>
    );
  };

  // Notifications area
  const renderNotifications = () => {
    const items = [
      { icon: ['M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'], tint: '#d7efe6', fg: '#17806b', from: 'Coach Priya', txt: 'Finish your breathing quest before the day ends.', t: '2m', unread: true, go: 'coach' },
      { icon: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'], tint: '#e7eefc', fg: '#3b6fd4', from: 'Ms. Anjali Menon · Class Teacher', txt: 'Please bring the signed science-trip form tomorrow.', t: '1h', unread: true, go: 'messages' },
      { icon: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2z'], tint: '#fdeccf', fg: '#b06a12', from: 'Challenge Alert', txt: 'You slipped to rank 40 in “Around the World” — log steps to climb back.', t: '3h', unread: false, go: 'challenges' }
    ];

    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-800">Notifications</span>
            <span className="w-5 h-5 rounded-full bg-[#24796b] text-white font-bold text-[10px] flex items-center justify-center">2</span>
          </div>
          <button className="text-xs font-bold text-[#24796b]">Mark read</button>
        </div>
        <div className="flex flex-col gap-2.5">
          {items.map((n, idx) => (
            <div 
              key={idx} 
              onClick={() => n.go && setSection(n.go)} 
              className={`flex gap-3 p-2.5 rounded-xl border border-transparent ${n.go ? 'cursor-pointer hover:bg-neutral-50' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: n.tint, color: n.fg }}>
                {icon(n.icon, { size: 16 })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800">{n.from}</span>
                  <span className="text-neutral-400">{n.t}</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1 leading-normal">{n.txt}</div>
              </div>
              {n.unread && <span className="w-2 h-2 rounded-full bg-[#24796b] shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Settings screen builder
  const renderSettingsPanel = () => {
    const s = settings;
    const toggle = (key: 'reminders' | 'coachMsgs' | 'teacherMsgs' | 'challengeAlerts' | 'sound') => (
      <button 
        onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
        className={`w-11 h-6 rounded-full relative p-0.5 transition-colors ${s[key] ? 'bg-[#24796b]' : 'bg-neutral-200'}`}
      >
        <span className={`w-5 h-5 bg-white rounded-full block shadow-sm transform transition-all ${s[key] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    );

    return (
      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
        {/* Account Info */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-neutral-50 border border-neutral-100 rounded-xl overflow-hidden">
            {renderAvatarInstance(56)}
          </div>
          <div>
            <h4 className="text-base font-bold text-neutral-900">Aarav Sharma</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Class 8B · Roll 22 · Silver Tier</p>
          </div>
        </div>

        {/* Toggle Settings Clusters */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h4 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2">Preferences</h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-800">Daily quest reminders</div>
              <div className="text-xs text-neutral-500 mt-0.5">A nudge if you haven’t logged by evening</div>
            </div>
            {toggle('reminders')}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-800">Coach messages</div>
              <div className="text-xs text-neutral-500 mt-0.5">Alerts when your coach writes to you</div>
            </div>
            {toggle('coachMsgs')}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-800">Teacher messages</div>
              <div className="text-xs text-neutral-500 mt-0.5">Alerts from classroom teachers</div>
            </div>
            {toggle('teacherMsgs')}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-800">Challenge alerts</div>
              <div className="text-xs text-neutral-500 mt-0.5">Rank changes and weekly challenges</div>
            </div>
            {toggle('challengeAlerts')}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-800">Sound &amp; haptics</div>
              <div className="text-xs text-neutral-500 mt-0.5">Feedback sounds when earning points</div>
            </div>
            {toggle('sound')}
          </div>
        </div>

        {/* Informational Cluster */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h4 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2">Support</h4>
          <div className="flex justify-between items-center text-sm font-medium text-neutral-700">
            <span>Help Center &amp; FAQ</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-neutral-700">
            <span>Privacy Policy</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-neutral-700">
            <span>Terms of Service</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>
    );
  };

  // Summary Categories Helper
  const summaryCategories = () => {
    const isMoodDone = logged.includes('Log Your Mood');
    const isSleepDone = logged.includes("Add Last Night's Sleep");
    const isWaterDone = logged.includes('Drink Water');
    const isMoveDone = logged.includes('Add Your Movement');
    const isBreathingDone = logged.includes('3-Minute Breathing');
    const isMathDone = logged.includes('Submit Math Homework');
    const isScienceDone = logged.includes('Science Lab Report');
    const isReadingDone = logged.includes('Read Science Chapter 4');
    const isReflectionDone = logged.includes('Daily Reflection');

    return [
      {
        name: 'Wellness Quests',
        tint: '#e4f6ec',
        fg: '#1f8a5b',
        done: [isMoodDone, isSleepDone, isWaterDone, isMoveDone, isBreathingDone, isReflectionDone].filter(Boolean).length,
        total: 6,
        pts: [isMoodDone ? 5 : 0, isSleepDone ? 5 : 0, isWaterDone ? 5 : 0, isMoveDone ? 10 : 0, isBreathingDone ? 5 : 0, isReflectionDone ? 5 : 0].reduce((a, b) => a + b, 0),
        paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
        items: [
          { label: 'Log Your Mood', value: moodSel || 'Good', points: 5, logged: isMoodDone, tint: '#e4f6ec', fg: '#1f8a5b', paths: ['M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'] },
          { label: "Add Last Night's Sleep", value: `${Math.floor(sleepH)}h ${Math.round((sleepH % 1) * 60)}m`, points: 5, logged: isSleepDone, tint: '#ece8fb', fg: '#6d54d8', paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'] },
          { label: 'Drink Water', value: `${waterCount} glasses`, points: 5, logged: isWaterDone, tint: '#e7eefc', fg: '#3b6fd4', paths: ['M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'] },
          { label: 'Add Your Movement', value: `${moveMin} min ${moveSel.toLowerCase()}`, points: 10, logged: isMoveDone, tint: '#e4f6ec', fg: '#1f8a5b', paths: ['M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z', 'M9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7'] },
          { label: '3-Minute Breathing', value: 'Completed', points: 5, logged: isBreathingDone, tint: '#e4f6ec', fg: '#17806b', paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'] },
          { label: 'Daily Reflection', value: 'Completed', points: 5, logged: isReflectionDone, tint: '#ece8fb', fg: '#6d54d8', paths: ['M9 2h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1z', 'M9 12l2 2 4-4'] },
        ]
      },
      {
        name: 'Learning Quests',
        tint: '#fdeccf',
        fg: '#b06a12',
        done: [isMathDone, isScienceDone, isReadingDone].filter(Boolean).length,
        total: 3,
        pts: [isMathDone ? 15 : 0, isScienceDone ? 20 : 0, isReadingDone ? 10 : 0].reduce((a, b) => a + b, 0),
        paths: ['M22 10L12 5 2 10l10 5 10-5z', 'M6 12v5c0 1 3 3 6 3s6-2 6-3v-5'],
        items: [
          { label: 'Submit Math Homework', value: files['Submit Math Homework'] || 'homework_done.pdf', points: 15, logged: isMathDone, tint: '#fdeccf', fg: '#b06a12', paths: ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z'] },
          { label: 'Science Lab Report', value: files['Science Lab Report'] || 'lab_draft.docx', points: 20, logged: isScienceDone, tint: '#e7eefc', fg: '#3b6fd4', paths: ['M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3', 'M8 3h8', 'M7 15h10'] },
          { label: 'Read Science Chapter 4', value: 'Completed', points: 10, logged: isReadingDone, tint: '#fdeccf', fg: '#b06a12', paths: ['M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z', 'M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z'] },
        ]
      }
    ];
  };

  // Daily Summary Review Panel
  const renderSummaryPanel = (wide: boolean) => {
    const cats = summaryCategories();

    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Summary Hero Header */}
        <div className="rounded-2xl p-6 text-white flex flex-col justify-between" style={{ background: tealA }}>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-82">Monday · 14 July · Summary</div>
            <h3 className="text-2xl font-black mt-1">Your day at a glance</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div>
              <div className="text-2xl font-black">30</div>
              <div className="text-[10px] opacity-75 mt-0.5">Tier Points earned</div>
            </div>
            <div>
              <div className="text-2xl font-black">5</div>
              <div className="text-[10px] opacity-75 mt-0.5">activities logged</div>
            </div>
            <div>
              <div className="text-2xl font-black">4</div>
              <div className="text-[10px] opacity-75 mt-0.5">still to go</div>
            </div>
            <div>
              <div className="text-2xl font-black">56%</div>
              <div className="text-[10px] opacity-75 mt-0.5">daily goal progress</div>
            </div>
          </div>
        </div>

        {/* Section Breakdown Card List */}
        <div className={`grid grid-cols-1 ${wide ? 'lg:grid-cols-2' : ''} gap-5`}>
          {cats.map(c => (
            <div key={c.name} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <ThreeDAnimatedIcon 
                  paths={c.paths}
                  colorTheme={getThemeFromQuestColors(c.fg)}
                  size={18}
                  containerSize={36}
                />
                <div className="flex-1">
                  <div className="text-sm font-bold text-neutral-900">{c.name}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{c.done} of {c.total} logged</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold" style={{ color: c.fg }}>+{c.pts}</div>
                  <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">TP</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden my-3">
                <div className="h-full rounded-full" style={{ width: `${(c.done / c.total) * 100}%`, background: c.fg }} />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {c.items.map(it => (
                  <div key={it.label} className="flex items-center gap-3 py-1.5 border-t border-neutral-100 first:border-none">
                    <ThreeDAnimatedIcon 
                      paths={it.paths}
                      colorTheme={getThemeFromQuestColors(it.fg)}
                      size={12}
                      containerSize={26}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-800 truncate">{it.label}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{it.logged ? it.value : 'Not logged yet'}</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{it.logged ? `${it.points} TP` : '0 TP'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Nav Items Definitions for Sidebar and Bottom Bar
  const navItemsList = [
    { id: 'today', label: 'My Activities', short: 'Today', paths: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'] },
    { id: 'challenges', label: 'Challenges', short: 'Challenges', paths: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2z'] },
    { id: 'rewards', label: 'Rewards', short: 'Rewards', paths: ['M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7C10 7 7 4 8.5 3S12 5 12 7z', 'M12 7c2 0 5-3 3.5-4S12 5 12 7z'] },
    { id: 'mascot', label: 'Meet Mascot', short: 'Mascot', paths: ['M12 2a5 5 0 0 1 5 5v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5z', 'M6 10a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4'] },
    { id: 'messages', label: 'Messages', short: 'Messages', paths: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] },
    { id: 'profile', label: 'Profile', short: 'Profile', paths: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
  ];

  // Dynamic Header title generator
  const getHeaderInfo = () => {
    const heads: Record<string, [string, string]> = { 
      today: ['Good morning', 'Aarav Sharma'], 
      challenges: ['Keep it going', 'Challenges'], 
      rewards: ['Earn & redeem', 'Rewards'], 
      mascot: ['Your Campus Companion', 'Mascot Hub'],
      messages: ['Your teachers', 'Messages'], 
      profile: ['Your account', 'Profile'], 
      coach: ['Message your mentor', 'Coach'], 
      summary: ['Daily recap', "Today's summary"], 
      settings: ['Preferences', 'Settings'] 
    };
    return heads[section] || heads.today;
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#dfeaf6] py-8 px-4 sm:px-6 lg:px-8 selection:bg-neutral-200">
      <div className="max-w-6xl mx-auto">
        {/* Outer Application Header Design Doc */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between border-b border-neutral-300/80 pb-6 gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              ThriveCampus · Student gamification App
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
              Design your avatar. Climb your Journey.
            </h1>
            <p className="text-xs text-neutral-600 mt-1 max-w-xl leading-relaxed">
              Interact with both mock designs. Click the sidebar or tabs to navigate between 
              My Activities, Challenges, Rewards, and Profile views.
            </p>
          </div>

          {/* Device Mockup Toggle Buttons */}
          <div className="inline-flex bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md border border-neutral-200 shrink-0 self-start">
            <button
              onClick={() => { setView('mobile'); setOpenQuest(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'mobile' ? 'bg-[#24796b] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile View
            </button>
            <button
              onClick={() => { setView('desktop'); setOpenQuest(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'desktop' ? 'bg-[#24796b] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop View
            </button>
          </div>
        </header>

        {/* -------------------- DEVICE VIEWS -------------------- */}

        {view === 'mobile' ? (
          /* --- MOBILE SIMULATION WRAPPER --- */
          <div className="flex justify-center">
            <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] border-[10px] border-neutral-900 shadow-2xl overflow-hidden flex flex-col">
              {/* App Status Header */}
              <div className="px-5 pt-8 pb-3 flex items-center gap-3 bg-[#f4eee0] shrink-0 border-b border-neutral-100">
                <div onClick={() => setSection('profile')} className="w-10 h-10 shrink-0 cursor-pointer flex items-center justify-center bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
                  {renderAvatarInstance(40)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{headerInfo[0]}</div>
                  <div className="text-sm font-extrabold text-neutral-900 truncate">{headerInfo[1]}</div>
                </div>
                {/* Coach icon */}
                <button 
                  onClick={() => setSection('coach')}
                  className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 relative shadow-sm"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-[#24796b]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                </button>
              </div>

              {/* Mobile Viewport Body */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#f4eee0]">
                {section === 'today' && openQuest ? (
                  renderQuestLogPanel(false)
                ) : (
                  <>
                    {section === 'today' && renderTodayPanel(false)}
                    {section === 'challenges' && renderChallengesPanel(false)}
                    {section === 'rewards' && renderRewardsPanel(false)}
                    {section === 'mascot' && (
                      <MascotHub 
                        thrivePoints={thrivePoints} 
                        setThrivePoints={setThrivePoints} 
                      />
                    )}
                    {section === 'messages' && renderMessagesPanel(false)}
                    {section === 'profile' && renderProfilePanel(false)}
                    {section === 'avatar_customize' && renderAvatarCustomizePanel(false)}
                    {section === 'coach' && renderCoachPanel(false)}
                    {section === 'settings' && renderSettingsPanel()}
                    {section === 'summary' && renderSummaryPanel(false)}
                  </>
                )}
              </div>

              {/* Bottom Tab Navigation Bar */}
              <div className="bg-white border-t border-neutral-100 py-2 px-3 flex items-center justify-between shrink-0 shadow-lg">
                {navItemsList.map(item => {
                  const active = section === item.id;
                  const navThemes: Record<string, 'teal' | 'amber' | 'emerald' | 'sapphire' | 'ruby' | 'amethyst' | 'neutral' | 'orange' | 'rose' | 'pink' | 'purple' | 'blue' | 'yellow'> = {
                    today: 'teal',
                    challenges: 'amber',
                    rewards: 'rose',
                    mascot: 'emerald',
                    messages: 'sapphire',
                    profile: 'amethyst'
                  };
                  const colorTheme = active ? (navThemes[item.id] || 'teal') : 'neutral';
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSection(item.id); setOpenQuest(null); }}
                      className={`flex flex-col items-center gap-1.5 flex-1 py-1 ${active ? 'text-[#24796b]' : 'text-neutral-400 hover:text-neutral-800'}`}
                    >
                      <ThreeDAnimatedIcon 
                        paths={item.paths}
                        colorTheme={colorTheme}
                        size={18}
                        containerSize={32}
                      />
                      <span className="text-[9px] font-bold">{item.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* --- DESKTOP VIEWPORT LAYOUT --- */
          <div className="bg-white border border-neutral-200 rounded-3xl shadow-xl overflow-hidden flex min-h-[700px]">
            {/* Desktop Left Sidebar */}
            <aside className="w-56 shrink-0 bg-white border-r border-neutral-200 p-5 flex flex-col justify-between">
              <div className="flex flex-col gap-6 w-full">
                {/* Brand Wordmark */}
                <div className="flex items-center gap-2.5 px-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#24796b] text-white font-extrabold text-base flex items-center justify-center">
                    T
                  </div>
                  <span className="text-base font-bold text-neutral-900">ThriveCampus</span>
                </div>

                {/* Sidebar Nav List */}
                <nav className="flex flex-col gap-1.5 w-full">
                  {navItemsList.map(item => {
                    const active = section === item.id;
                    const navThemes: Record<string, 'teal' | 'amber' | 'emerald' | 'sapphire' | 'ruby' | 'amethyst' | 'neutral' | 'orange' | 'rose' | 'pink' | 'purple' | 'blue' | 'yellow'> = {
                      today: 'teal',
                      challenges: 'amber',
                      rewards: 'rose',
                      mascot: 'emerald',
                      messages: 'sapphire',
                      profile: 'amethyst'
                    };
                    const colorTheme = active ? (navThemes[item.id] || 'teal') : 'neutral';
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setSection(item.id); setOpenQuest(null); }}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-left ${active ? 'bg-neutral-100 text-[#24796b]' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                      >
                        <ThreeDAnimatedIcon 
                          paths={item.paths}
                          colorTheme={colorTheme}
                          size={16}
                          containerSize={30}
                        />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Settings Trigger */}
              <button 
                onClick={() => { setSection('settings'); setOpenQuest(null); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left w-full border-t border-neutral-100 pt-4 ${section === 'settings' ? 'bg-neutral-100 text-[#24796b]' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
              >
                <ThreeDAnimatedIcon 
                  lucideIcon={<SettingsIcon />}
                  colorTheme={section === 'settings' ? 'teal' : 'neutral'}
                  size={16}
                  containerSize={30}
                />
                Settings
              </button>
            </aside>

            {/* Desktop Core Workspace Body */}
            <main className="flex-1 bg-[#f4eee0] p-6 flex flex-col gap-5 min-w-0">
              {/* Desktop Workspace Header */}
              {!(section === 'today' && openQuest) && (
                <div className="flex items-center gap-3">
                  <div onClick={() => setSection('profile')} className="w-11 h-11 shrink-0 cursor-pointer flex items-center justify-center bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
                    {renderAvatarInstance(44)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{headerInfo[0]}</div>
                    <h2 className="text-xl font-bold text-neutral-900 leading-tight">{headerInfo[1]}</h2>
                  </div>
                  {/* Coach Action Button */}
                  <button 
                    onClick={() => setSection('coach')}
                    className="flex items-center gap-2 bg-[#24796b] text-white px-4 py-2 rounded-full text-xs font-bold hover:opacity-95 shadow-sm transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Coach
                  </button>
                </div>
              )}

              {/* Panel Render Split Grid */}
              <div className="flex-1 overflow-y-auto">
                {section === 'today' && openQuest ? (
                  renderQuestLogPanel(true)
                ) : (
                  <>
                    {section === 'today' && renderTodayPanel(true)}
                    {section === 'challenges' && renderChallengesPanel(true)}
                    {section === 'rewards' && renderRewardsPanel(true)}
                    {section === 'mascot' && (
                      <MascotHub 
                        thrivePoints={thrivePoints} 
                        setThrivePoints={setThrivePoints} 
                      />
                    )}
                    {section === 'messages' && renderMessagesPanel(true)}
                    {section === 'profile' && renderProfilePanel(true)}
                    {section === 'avatar_customize' && renderAvatarCustomizePanel(true)}
                    {section === 'coach' && renderCoachPanel(true)}
                    {section === 'settings' && renderSettingsPanel()}
                    {section === 'summary' && renderSummaryPanel(true)}
                  </>
                )}
              </div>
            </main>
          </div>
        )}
      </div>
      <input 
        type="file" 
        id="hidden-quest-file-picker" 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && activeUploadQuest) {
            handleUploadFile(activeUploadQuest, file);
          }
        }}
      />

      {showCelebration && celebrationItem && (
        <RewardUnlockCelebration
          item={celebrationItem}
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          onEquip={() => {
            const cat = celebrationItem.category;
            const updatedEquipped = { ...equipped, [cat]: celebrationItem.id };
            setEquipped(updatedEquipped);
            localStorage.setItem('thrivecampus_avatar_equipped', JSON.stringify(updatedEquipped));
            setShowCelebration(false);
          }}
        />
      )}

      {/* 3D BADGE CELEBRATION UNLOCK MODAL */}
      {liveUnlockedBadge && (
        <BadgeUnlockCelebration
          item={liveUnlockedBadge}
          onClose={() => setLiveUnlockedBadge(null)}
          onEquip={() => {
            const cat = liveUnlockedBadge.avatarReward?.category;
            const itemid = liveUnlockedBadge.avatarReward?.id;
            if (cat && itemid) {
              const updatedEquipped = { ...equipped, [cat]: itemid };
              setEquipped(updatedEquipped);
              localStorage.setItem('thrivecampus_avatar_equipped', JSON.stringify(updatedEquipped));
            }
            setLiveUnlockedBadge(null);
            setSection('avatar_customize');
          }}
        />
      )}

      {/* 3D BADGE DETAIL INSPECT MODAL */}
      {selectedBadgeDetail && (
        <BadgeDetailModal
          item={selectedBadgeDetail}
          onClose={() => setSelectedBadgeDetail(null)}
          onNavigateToCloset={() => {
            setSelectedBadgeDetail(null);
            setSection('avatar_customize');
          }}
        />
      )}

      {/* GOAL COMPLETED CELEBRATION MODAL WITH ANIMATED POPUP BADGE */}
      {completedGoalInfo && (
        <GoalCompletedCelebration
          questTitle={completedGoalInfo.questTitle}
          points={completedGoalInfo.points}
          badge={completedGoalInfo.badge}
          onClose={() => {
            setCompletedGoalInfo(null);
            if (pendingBadgeUnlock) {
              setLiveUnlockedBadge(pendingBadgeUnlock);
              setPendingBadgeUnlock(null);
            }
          }}
        />
      )}
    </div>
  );
}
