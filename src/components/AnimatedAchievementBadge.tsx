import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "motion/react";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Lock, 
  Unlock,
  Check, 
  Droplet, 
  Sun, 
  Moon, 
  Flame, 
  Wind, 
  BookOpen, 
  Heart,
  Calendar,
  X,
  Compass,
  Briefcase,
  Award
} from "lucide-react";

// Types for our Badge System
export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  points: number;
  isUnlocked: boolean;
  image?: string; // e.g. July Champion PNG
  iconType?: string; // fallback icon category
  colorTheme?: string; // primary color for procedural badge
  avatarReward?: {
    id: string;
    name: string;
    category: string;
    rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  };
  dateEarned?: string;
}

// Particle interface for the golden sparkles explosion
interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface AnimatedAchievementBadgeProps {
  id?: string;
  image?: string;
  badgeName: string;
  description: string;
  points: number;
  isUnlocked: boolean;
  onAnimationComplete?: () => void;
  avatarReward?: BadgeItem["avatarReward"];
  size?: number;
  onClick?: () => void;
  colorTheme?: string;
  iconType?: string;
}

// Custom hook to detect prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);

    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return reduced;
}

// Helper to get Lucide icons for procedural fallback badges
export const getBadgeIcon = (iconType: string, className = "w-6 h-6 text-white") => {
  switch (iconType) {
    case "water":
      return <Droplet className={className} />;
    case "mood":
      return <Sun className={className} />;
    case "sleep":
      return <Moon className={className} />;
    case "movement":
      return <Flame className={className} />;
    case "breathing":
      return <Wind className={className} />;
    case "learning":
      return <BookOpen className={className} />;
    case "sparkle":
      return <Sparkles className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    case "trophy":
    default:
      return <Trophy className={className} />;
  }
};

// Helper for procedural color themes
export const getBadgeGradient = (theme?: string) => {
  switch (theme) {
    case "water":
      return {
        bg: "from-blue-600 via-blue-500 to-indigo-600",
        border: "border-blue-400",
        glow: "rgba(59, 111, 212, 0.4)",
        disc: "#3b6fd4"
      };
    case "mood":
      return {
        bg: "from-amber-500 via-orange-500 to-yellow-600",
        border: "border-amber-400",
        glow: "rgba(232, 165, 48, 0.4)",
        disc: "#e8a530"
      };
    case "sleep":
      return {
        bg: "from-indigo-700 via-purple-600 to-slate-900",
        border: "border-indigo-400",
        glow: "rgba(109, 84, 216, 0.4)",
        disc: "#6d54d8"
      };
    case "movement":
      return {
        bg: "from-emerald-600 via-teal-500 to-green-600",
        border: "border-emerald-400",
        glow: "rgba(31, 138, 91, 0.4)",
        disc: "#1f8a5b"
      };
    case "breathing":
      return {
        bg: "from-teal-600 via-emerald-500 to-cyan-600",
        border: "border-teal-400",
        glow: "rgba(23, 128, 107, 0.4)",
        disc: "#17806b"
      };
    case "learning":
      return {
        bg: "from-amber-700 via-yellow-600 to-amber-900",
        border: "border-amber-500",
        glow: "rgba(176, 106, 18, 0.4)",
        disc: "#b06a12"
      };
    case "rainbow":
      return {
        bg: "from-pink-500 via-amber-400 to-blue-500",
        border: "border-white",
        glow: "rgba(246, 166, 35, 0.5)",
        disc: "#e8a530"
      };
    case "streak-7":
      return {
        bg: "from-orange-600 via-red-500 to-amber-500",
        border: "border-orange-400",
        glow: "rgba(249, 115, 22, 0.4)",
        disc: "#ea580c"
      };
    case "streak-30":
      return {
        bg: "from-indigo-900 via-fuchsia-800 to-slate-950",
        border: "border-indigo-400",
        glow: "rgba(99, 102, 241, 0.4)",
        disc: "#4338ca"
      };
    default:
      return {
        bg: "from-amber-500 via-yellow-400 to-amber-600",
        border: "border-amber-400",
        glow: "rgba(246, 166, 35, 0.4)",
        disc: "#c9a227"
      };
  }
};

export const AnimatedAchievementBadge: React.FC<AnimatedAchievementBadgeProps> = ({
  image,
  badgeName,
  description,
  points,
  isUnlocked,
  avatarReward,
  size = 72,
  onClick,
  colorTheme = "gold",
  iconType = "trophy"
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for tilt return
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 18,
    mass: 0.5
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 180,
    damping: 18,
    mass: 0.5
  });
  const scale = useSpring(1, { stiffness: 180, damping: 18, mass: 0.5 });

  // Light reflection mapping
  const reflectionX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), {
    stiffness: 180,
    damping: 18,
    mass: 0.5
  });
  const reflectionY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), {
    stiffness: 180,
    damping: 18,
    mass: 0.5
  });

  // Track mouse move for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
    scale.set(1.03);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  // Mobile interactions (Touch devices press and hold)
  const [touchActive, setTouchActive] = useState(false);
  const handleTouchStart = () => {
    if (prefersReducedMotion) return;
    setTouchActive(true);
  };
  const handleTouchEnd = () => {
    setTouchActive(false);
  };

  // Floating animation setup
  const floatingYAnimation = prefersReducedMotion 
    ? {} 
    : {
        y: [0, -3, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };

  // Render fallback procedural high-fidelity 3D badge if PNG is not present
  const renderBadgeCore = () => {
    if (image) {
      return (
        <img
          src={image}
          alt={badgeName}
          className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] select-none"
          referrerPolicy="no-referrer"
          style={{ willChange: "transform" }}
        />
      );
    }

    // High fidelity vector-based 3D badge
    const grad = getBadgeGradient(colorTheme);
    return (
      <div 
        className={`w-full h-full rounded-full relative flex items-center justify-center p-1.5 shadow-md border ${grad.border} select-none`}
        style={{
          background: `linear-gradient(135deg, #fff0bf 0%, ${grad.disc} 50%, #b8801f 100%)`,
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 10px ${grad.glow}`
        }}
      >
        <div 
          className={`w-full h-full rounded-full bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-inner border border-white/10 relative overflow-hidden`}
        >
          {getBadgeIcon(iconType, "w-8 h-8 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] animate-pulse")}
          
          {/* Outer Ring Decoration */}
          <div className="absolute inset-1 rounded-full border border-white/15 pointer-events-none" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onClick}
        animate={(touchActive ? { scale: 1.04, rotateY: 5 } : floatingYAnimation) as any}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          scale: prefersReducedMotion ? 1 : scale,
          width: size,
          height: size,
          cursor: "pointer"
        }}
        className={`relative flex items-center justify-center ${!isUnlocked ? "grayscale opacity-40 hover:grayscale-0 hover:opacity-100" : ""} transition-all duration-300`}
      >
        {/* Render central badge graphic */}
        {renderBadgeCore()}

        {/* Continuous premium shine effect */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-10">
            <motion.div
              className="w-[35%] h-[180%] bg-gradient-to-r from-transparent via-white/50 to-transparent absolute top-[-40%]"
              style={{
                skewX: -25,
              }}
              initial={{ left: "-120%" }}
              animate={{
                left: ["-120%", "240%"]
              }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                repeatDelay: 3.0,
                ease: "easeInOut"
              }}
            />
            {isUnlocked && (
              <motion.div
                className="absolute top-1 right-2"
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.1, 0],
                  opacity: [0, 0.9, 0],
                  rotate: [0, 180]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 4.5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white filter drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] fill-white" />
              </motion.div>
            )}
          </div>
        )}

        {/* Glossy light sweep overlay */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen overflow-hidden"
            style={{
              borderRadius: "50%"
            }}
          >
            <motion.div
              className="w-[200%] h-[200%] absolute"
              style={{
                top: "-50%",
                left: "-50%",
                background: `linear-gradient(
                  115deg,
                  transparent 25%,
                  rgba(255,255,255,0.35) 45%,
                  rgba(255,255,255,0.12) 55%,
                  transparent 70%
                )`,
                x: useTransform(reflectionX, [0, 100], [-30, 30]),
                y: useTransform(reflectionY, [0, 100], [-30, 30])
              }}
            />
          </motion.div>
        )}

        {/* Lock icon overlay for locked badges */}
        {!isUnlocked && (
          <div className="absolute bottom-0 right-0 bg-neutral-900/90 border border-neutral-700 p-1 rounded-full text-white shadow-md">
            <Lock className="w-3 h-3" />
          </div>
        )}
      </motion.div>
    </div>
  );
};


// 1. REUSABLE ACHIEVEMENT UNLOCK CELEBRATION MODAL COMPONENT
interface BadgeUnlockCelebrationProps {
  item: BadgeItem;
  onClose: () => void;
  onEquip?: () => void;
}

export const BadgeUnlockCelebration: React.FC<BadgeUnlockCelebrationProps> = ({
  item,
  onClose,
  onEquip
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(1);
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  // Trigger animations steps
  useEffect(() => {
    // Generate random sparkle coordinates
    const pList: SparkleParticle[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160, // random offset X between -80px and 80px
      y: (Math.random() - 0.5) * 160, // random offset Y between -80px and 80px
      size: Math.random() * 8 + 8,     // sparkle size
      delay: Math.random() * 0.2 + 0.1,
      duration: Math.random() * 0.3 + 0.6 // 600ms to 900ms
    }));
    setParticles(pList);

    // Timed progression of unlock steps
    // Step 1: Entrance (700ms)
    // Step 2: Impact (350ms)
    // Step 3: Sparkles explosion (after impact, i.e., around 800ms)
    // Step 4 & 5: Texts & points display
    const timerText = setTimeout(() => {
      setStep(4);
    }, 800);

    return () => {
      clearTimeout(timerText);
    };
  }, []);

  // Glow background style
  const glowStyle = {
    background: `radial-gradient(
      circle,
      rgba(246,166,35,0.30) 0%,
      rgba(246,166,35,0.10) 40%,
      transparent 70%
    )`
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Lightweight Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white border border-neutral-100 rounded-[24px] p-6 shadow-2xl relative w-full max-w-[420px] text-center overflow-hidden z-10 flex flex-col items-center"
        >
          {/* Subtle radial glow container behind badge */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none select-none z-0 overflow-hidden rounded-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 1, 0.4], scale: [0.7, 1.15, 1.15] }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
              className="w-full h-full"
              style={glowStyle}
            />
          </div>

          {/* Golden Sparkles Explosion */}
          {!prefersReducedMotion && (
            <div className="absolute top-[110px] left-1/2 pointer-events-none z-30">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0], 
                    x: p.x, 
                    y: p.y 
                  }}
                  transition={{
                    delay: p.delay + 0.6, // fires upon impact (at ~0.6-0.8s)
                    duration: p.duration,
                    ease: "easeOut"
                  }}
                  className="absolute"
                >
                  <Sparkles className="text-amber-500 w-4 h-4" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full transition-all z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* STEP 1 & 2 — BADGE ANIMATION */}
          <div className="h-44 flex items-center justify-center relative z-10 mt-2">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0, scale: 0.95 } : {
                opacity: 0,
                scale: 0.4,
                rotateY: -70,
                rotateX: 15,
                y: 30
              }}
              animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : {
                opacity: 1,
                scale: [0.4, 1, 1.08, 1], // includes Step 2 Impact scales
                rotateY: 0,
                rotateX: 0,
                y: 0
              }}
              transition={{
                duration: 1.05, // Step 1 + 2 combined (700ms entrance + 350ms impact)
                times: [0, 0.66, 0.85, 1],
                ease: [0.22, 1, 0.36, 1]
              }}
              className="relative"
            >
              <AnimatedAchievementBadge
                image={item.image}
                badgeName={item.name}
                description={item.description}
                points={item.points}
                isUnlocked={true}
                colorTheme={item.colorTheme}
                iconType={item.iconType}
                size={110}
              />
            </motion.div>
          </div>

          {/* STEP 4 & 5 — ACHIEVEMENT TEXTS & POINTS */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            {/* Header Lock title */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-[12px] font-semibold text-[#F6A623] uppercase tracking-widest block font-sans"
              style={{ letterSpacing: "1.5px" }}
            >
              🎉 ACHIEVEMENT UNLOCKED!
            </motion.span>

            {/* Badge Name */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="text-22px font-bold text-[#172033] mt-1 font-sans leading-tight"
            >
              {item.name}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="text-xs text-[#64748B] font-normal leading-relaxed max-w-[320px] mt-1.5 font-sans"
            >
              {item.description}
            </motion.p>

            {/* Points Reward */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="flex items-center gap-2 mt-4 bg-amber-50 border border-amber-200/60 px-4 py-2 rounded-2xl shadow-sm"
            >
              <Star className="w-4 h-4 text-[#F6A623] fill-[#F6A623] animate-spin" style={{ animationDuration: "12s" }} />
              <span className="text-sm font-extrabold text-[#F6A623] font-sans">
                +{item.points} Thrive Points
              </span>
            </motion.div>

            {/* Avatar Closet Reward info */}
            {item.avatarReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.4 }}
                className="mt-4 p-3 bg-neutral-50/70 border border-neutral-100 rounded-2xl flex items-center gap-2 w-full text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                  <Award className="w-5 h-5 animate-bounce" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Avatar Item Earned</span>
                  <span className="block text-xs font-bold text-neutral-800 truncate leading-tight">{item.avatarReward.name}</span>
                  <span className="block text-[9.5px] text-indigo-600 font-black uppercase mt-0.5">{item.avatarReward.rarity} Item</span>
                </div>
              </motion.div>
            )}

            {/* Buttons Group */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex gap-2 w-full mt-6 shrink-0"
            >
              {item.avatarReward && onEquip && (
                <button
                  onClick={onEquip}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-3 rounded-xl shadow-md transition-all active:scale-95 border border-indigo-400/20"
                >
                  Equip Item
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-[#24796b] hover:bg-[#1a5b51] text-white text-xs font-black py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


// 2. BADGE DETAILED MODAL FOR CLICK INTERACTIONS
interface BadgeDetailModalProps {
  item: BadgeItem;
  onClose: () => void;
  onNavigateToCloset?: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  item,
  onClose,
  onNavigateToCloset
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white border border-neutral-200 rounded-[24px] p-6 shadow-2xl relative w-full max-w-[420px] text-center overflow-hidden z-10 flex flex-col items-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-2 mb-4">
            Badge Inspector
          </span>

          {/* Interactive Large 3D Badge container */}
          <div className="w-48 h-48 bg-neutral-50/50 border border-neutral-100 rounded-2xl flex items-center justify-center relative shadow-inner mb-6">
            <AnimatedAchievementBadge
              image={item.image}
              badgeName={item.name}
              description={item.description}
              points={item.points}
              isUnlocked={item.isUnlocked}
              colorTheme={item.colorTheme}
              iconType={item.iconType}
              size={120}
            />
            {/* Tilt Helper Prompt */}
            {item.isUnlocked && (
              <span className="absolute bottom-2 bg-white/90 text-neutral-800 text-[8.5px] font-bold px-2 py-0.5 rounded-full border border-neutral-100 shadow-sm pointer-events-none">
                🖱️ Move mouse to rotate 3D
              </span>
            )}
          </div>

          {/* Badge Title */}
          <h3 className="text-xl font-bold text-neutral-900 leading-tight">
            {item.name}
          </h3>

          {/* Unlocked / Earned Tag */}
          <div className="mt-2">
            {item.isUnlocked ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> EARNED · {item.dateEarned || "Jul 20, 2026"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-100 border border-neutral-200 px-3 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> LOCKED
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-500 font-normal mt-4 leading-relaxed max-w-[320px]">
            {item.description}
          </p>

          {/* Reward Status Row */}
          <div className="mt-5 w-full border-t border-neutral-100 pt-4 flex flex-col gap-2.5 text-left text-xs font-bold text-neutral-500">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#F6A623]" /> Thrive Reward</span>
              <span className="text-neutral-900 font-extrabold text-[#F6A623]">⭐ +{item.points} TP</span>
            </div>

            {/* Avatar reward detail */}
            {item.avatarReward && (
              <div className="flex flex-col gap-1.5 border-t border-neutral-50 pt-2.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Gamer Closet Unlock</span>
                <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100/70 rounded-xl p-2.5 mt-0.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                      <Award className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-neutral-800">{item.avatarReward.name}</span>
                      <span className="block text-[8px] text-neutral-400 uppercase tracking-wider">{item.avatarReward.rarity} {item.avatarReward.category}</span>
                    </div>
                  </div>
                  {item.isUnlocked ? (
                    <span className="text-[8.5px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 font-bold uppercase shrink-0">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[8.5px] text-neutral-400 bg-neutral-100 border border-neutral-200 rounded-full px-2 py-0.5 font-bold uppercase shrink-0 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Button CTAs */}
          <div className="mt-6 flex gap-2 w-full">
            {item.isUnlocked && item.avatarReward && onNavigateToCloset && (
              <button
                onClick={onNavigateToCloset}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                Go to Avatar Closet
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-[#24796b] hover:bg-[#1a5b51] text-white text-xs font-black py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// 3. ANIMATED POINTS COUNTER FOR NUMBER TRANSITION
export const AnimatedPointsCounter: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 1200; // 1.2 seconds for nice count up
    const startTime = performance.now();

    let animationFrameId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setDisplayValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
};


// 4. GOAL COMPLETED CELEBRATION MODAL WITH ANIMATED POPUP BADGE
interface GoalCompletedCelebrationProps {
  questTitle: string;
  points: number;
  badge: any;
  onClose: () => void;
}

export const GoalCompletedCelebration: React.FC<GoalCompletedCelebrationProps> = ({
  questTitle,
  points,
  badge,
  onClose
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    // Generate particles
    const pList: SparkleParticle[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 160,
      size: Math.random() * 6 + 6,
      delay: Math.random() * 0.15 + 0.05,
      duration: Math.random() * 0.3 + 0.5
    }));
    setParticles(pList);
  }, []);

  const glowStyle = {
    background: `radial-gradient(
      circle,
      rgba(36,121,107,0.25) 0%,
      rgba(36,121,107,0.08) 40%,
      transparent 70%
    )`
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        />

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="bg-white border border-neutral-100 rounded-[28px] p-6 shadow-2xl relative w-full max-w-[370px] text-center overflow-hidden z-10 flex flex-col items-center"
        >
          {/* Subtle radial glow */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none select-none z-0 overflow-hidden rounded-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0.4], scale: [0.8, 1.2, 1.2] }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full h-full"
              style={glowStyle}
            />
          </div>

          {/* Golden Sparkles Explosion */}
          {!prefersReducedMotion && (
            <div className="absolute top-[105px] left-1/2 pointer-events-none z-30">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.2, 0], 
                    x: p.x, 
                    y: p.y 
                  }}
                  transition={{
                    delay: p.delay + 0.25,
                    duration: p.duration,
                    ease: "easeOut"
                  }}
                  className="absolute"
                >
                  <Sparkles className="text-emerald-500 w-4 h-4" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full transition-all z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Goal/Badge Icon */}
          <div className="h-32 flex items-center justify-center relative z-10 mt-3 mb-2">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0, scale: 0.9 } : {
                opacity: 0,
                scale: 0.3,
                rotateY: -90,
                y: 20
              }}
              animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : {
                opacity: 1,
                scale: [0.3, 1.1, 0.96, 1],
                rotateY: 0,
                y: 0
              }}
              transition={{
                duration: 0.8,
                times: [0, 0.6, 0.85, 1],
                ease: "easeOut"
              }}
              className="relative"
            >
              <AnimatedAchievementBadge
                image={badge?.image}
                badgeName={badge?.name || "Thrive Campus"}
                description={badge?.description || ""}
                points={badge?.points || 0}
                isUnlocked={badge?.isUnlocked}
                colorTheme={badge?.colorTheme}
                iconType={badge?.iconType}
                size={82}
              />
            </motion.div>
          </div>

          {/* Achievement Title */}
          <div className="flex flex-col items-center gap-1 z-10 mt-2">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest block font-sans"
              style={{ letterSpacing: "2px" }}
            >
              🌟 GOAL COMPLETED!
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base font-extrabold text-neutral-800 font-sans leading-snug max-w-[280px]"
            >
              {questTitle}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-neutral-500 font-normal leading-relaxed max-w-[280px] mt-1 font-sans"
            >
              Great job! You logged this wellness objective and earned rewards.
            </motion.p>

            {/* Points Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-1.5 mt-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl shadow-sm"
            >
              <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 font-sans">
                +{points} Thrive Points
              </span>
            </motion.div>

            {/* Badge Progress Status */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 p-3 bg-neutral-50 border border-neutral-100 rounded-xl w-full text-center"
              >
                <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1.5">
                  <span>Badge Progress: {badge.name}</span>
                  <span className="text-emerald-600">{badge.have} / {badge.need}</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-emerald-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (badge.have / badge.need) * 100)}%` }}
                    transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="block text-[9px] text-neutral-400 mt-1.5 leading-tight">
                  {badge.isUnlocked 
                    ? "🎉 This badge is unlocked! Equipped its reward in your Closet."
                    : `Log ${badge.need - badge.have} more days to unlock the ${badge.name} badge and Avatar reward!`
                  }
                </span>
              </motion.div>
            )}

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="mt-5 w-full bg-[#24796b] hover:bg-[#1a5b51] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Awesome, keep going!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

