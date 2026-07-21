import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Layers, 
  Compass, 
  BookOpen, 
  Crown, 
  Sliders, 
  Download, 
  Flame, 
  Eye, 
  Info, 
  MessageCircle, 
  CheckCircle,
  HelpCircle,
  Dribbble,
  Heart,
  Palette,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Award,
  Zap,
  Clock
} from "lucide-react";

// Types for Mascot Hub State
export type MascotEmotion = 
  | "happy" 
  | "excited" 
  | "thinking" 
  | "celebrating" 
  | "sleeping" 
  | "encouraging" 
  | "surprised" 
  | "focused" 
  | "sad" 
  | "proud";

export type MascotOutfit = 
  | "none" 
  | "school" 
  | "sports" 
  | "hoodie" 
  | "champion" 
  | "explorer" 
  | "graduation" 
  | "festival";

export interface MascotAccessories {
  backpack: boolean;
  shoes: boolean;
  waterBottle: boolean;
  headphones: boolean;
  books: boolean;
  smartWatch: boolean;
  crown: boolean;
  cape: boolean;
  aura: boolean;
}

interface MascotHubProps {
  thrivePoints: number;
  setThrivePoints: React.Dispatch<React.SetStateAction<number>>;
  onClose?: () => void;
}

export function MascotHub({ thrivePoints, setThrivePoints, onClose }: MascotHubProps) {
  const [emotion, setEmotion] = useState<MascotEmotion>("happy");
  const [outfit, setOutfit] = useState<MascotOutfit>("none");
  const [viewAngle, setViewAngle] = useState<"front" | "side" | "threeQuarter">("front");
  const [accessories, setAccessories] = useState<MascotAccessories>({
    backpack: false,
    shoes: false,
    waterBottle: false,
    headphones: false,
    books: false,
    smartWatch: false,
    crown: false,
    cape: false,
    aura: false,
  });

  const [riggingOverlay, setRiggingOverlay] = useState(false);
  const [selectedRigPart, setSelectedRigPart] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"persona" | "gallery" | "rigging" | "interaction">("persona");
  
  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "thrivee"; text: string; time: string }>>([
    { 
      sender: "thrivee", 
      text: "Hi there, champion! I'm Thrivee, your personal campus companion. I'm here to support your learning, health, and mindfulness habits. Try dressing me up or changing my emotions!", 
      time: "Just now" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleAccessory = (key: keyof MascotAccessories) => {
    setAccessories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMascotResponse = (userText: string) => {
    if (!userText.trim()) return;
    
    // Add user message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLog(prev => [...prev, { sender: "user", text: userText, time: now }]);
    setChatMessage("");
    setIsTyping(true);

    // Dynamic responsive dialogues based on selected emotion
    setTimeout(() => {
      let reply = "I'm right here cheering you on! Let's complete some daily quests together.";
      
      const responsesByEmotion: Record<MascotEmotion, string[]> = {
        happy: [
          "Completing activities makes my heart smile! You're doing incredible today.",
          "Awesome job! A happy mind leads to a thriving life. Let's keep this streak going!",
          "I love learning new things with you! What's next on our agenda?"
        ],
        excited: [
          "OH MY GOSH! You completed that streak! Let's absolutely crush the rest of the day!",
          "WOOHOO! Your ThrivePoints are soaring! Let's unlock some epic shop rewards next!",
          "Yes! Yes! Yes! Your energy is absolutely contagious today! Let's go!"
        ],
        thinking: [
          "Hmm, fascinating... Let's break this math problem down step-by-step. You've got this!",
          "Curiosity is the fuel of intelligence. What an intriguing question to ponder!",
          "I'm analyzing our daily habits. We are making serious, sustainable progress. Keep reflecting!"
        ],
        celebrating: [
          "CELEBRATION TIME! 🎉 You earned that brand new shiny achievement badge! Wear it proud!",
          "Clap your hands, wave your flippers! This is a major milestone you just crossed!",
          "Confetti in the air, high-fives everywhere! You are the definition of a champion!"
        ],
        sleeping: [
          "shhh... (Thrivee is sleeping soundly, dreaming of stars and positive goals) *Zzz*...",
          "Sleep is essential for your brilliant brain cells to recharge! Make sure you rest up tonight too.",
          "Zzz... Deep breathing engaged... positive vibes incubating... *mumble*... good job..."
        ],
        encouraging: [
          "Don't worry if it gets tough. Every mistake is just a stepping stone to mastery!",
          "Take a deep breath. Focus on one small step at a time. I believe in you fully!",
          "You have a brilliant mind and a kind soul. Keep pushing, you are stronger than you think!"
        ],
        surprised: [
          "WHOA! A triple bonus score?! That is absolutely mind-blowing!",
          "Oh my! I didn't expect us to exceed our steps goal so early! You are a speed demon!",
          "Incredible! Your dedication is truly extraordinary!"
        ],
        focused: [
          "Focus mode: ENGAGED. Put away the distractions, let's lock in and conquer this session!",
          "Deep focus is where genius is refined. Let's work in peace for 25 minutes.",
          "Eyes on the prize. Your concentration is like a laser beam today. Let's do this!"
        ],
        sad: [
          "It's okay to feel down or overwhelmed sometimes. I'm here for you, no matter what.",
          "Even on cloudy days, your inner sun is still there. Let's take a slow 3-minute breath together.",
          "I'm sending you the biggest, warmest squishy hug ever. You are not alone, classmate."
        ],
        proud: [
          "Look at how far you've come! I am incredibly honored to be your companion.",
          "You carried yourself with such grit and grace today. Wear your progress like a crown!",
          "An absolute masterpiece of effort. I'm telling everyone on campus about your success!"
        ]
      };

      const options = responsesByEmotion[emotion] || responsesByEmotion.happy;
      reply = options[Math.floor(Math.random() * options.length)];

      setChatLog(prev => [...prev, { sender: "thrivee", text: reply, time: now }]);
      setIsTyping(false);
    }, 1000);
  };

  // Preset prompt quick answers
  const quickPrompts = [
    { text: "How can I earn more badges?", emotion: "thinking" as const },
    { text: "I need some motivation today!", emotion: "encouraging" as const },
    { text: "Tell me a joke!", emotion: "excited" as const },
    { text: "How should I design my daily schedule?", emotion: "focused" as const }
  ];

  const handleQuickPrompt = (promptObj: typeof quickPrompts[0]) => {
    setEmotion(promptObj.emotion);
    let userText = promptObj.text;
    
    // Add user message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLog(prev => [...prev, { sender: "user", text: userText, time: now }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      if (promptObj.text.includes("badges")) {
        reply = "To earn shiny badges, go to the 'Challenges' tab! Completing Daily Quests like Logging Mood, Drinking Water, and Submitting Homework stacks up your badge criteria. Plus, unlocking badges awards you epic avatar items and 100 ThrivePoints each!";
      } else if (promptObj.text.includes("motivation")) {
        reply = "Remember: you don't have to be perfect to make progress. Just showing up today is a huge victory! Every glass of water, every homework check, and every deep breath builds a stronger, happier you. You've got this, and I've got your back!";
      } else if (promptObj.text.includes("joke")) {
        reply = "Why did the computer go to school? To get more 'bytes'! 🖥️ 😄 And why did the clock complete its homework? To save 'time'! *ba-dum tss*! Keep smiling, it looks great on you!";
      } else {
        reply = "A great schedule has a perfect balance! Mix smart 'Learning' blocks with 'Movement' (like a 10-minute walk), and don't forget 'Hydration' and 'Mindfulness' breaks. Try using our Pomodoro timer to focus, then log your success here!";
      }

      setChatLog(prev => [...prev, { sender: "thrivee", text: reply, time: now }]);
      setIsTyping(false);
    }, 1000);
  };

  // Rigging Node Definitions
  const riggingNodes = [
    { id: "head_pivot", label: "Head Pivot (Neck Bone)", x: "50%", y: "45%", info: "Anchors head rotations and nods. Rigged for subtle idle bobbing. Parent of Face and Accessories." },
    { id: "eye_l", label: "Left Eye Anchor", x: "41%", y: "38%", info: "Controls Left eye scaling, blinking, and pupil focus tracking. Target coordinates: [41, 38]." },
    { id: "eye_r", label: "Right Eye Anchor", x: "59%", y: "38%", info: "Controls Right eye scaling, blinking, and pupil focus tracking. Target coordinates: [59, 38]." },
    { id: "mouth_joint", label: "Mouth Bezier Control", x: "50%", y: "46%", info: "Hosts the dynamic spline interpolator for jaw/mouth expressions. Supports morph targets." },
    { id: "arm_l", label: "Left Shoulder Joint", x: "28%", y: "58%", info: "Left Flipper attachment. Supports wave animations and item holdings. Rotation range: -45° to +90°." },
    { id: "arm_r", label: "Right Shoulder Joint", x: "72%", y: "58%", info: "Right Flipper attachment. Holds sports items and books. Rotation range: -90° to +45°." },
    { id: "leg_l", label: "Left Hip (Leg Anchor)", x: "41%", y: "83%", info: "Left foot anchor. Coordinates vertical jump squashes and run cycle stride lengths." },
    { id: "leg_r", label: "Right Hip (Leg Anchor)", x: "59%", y: "83%", info: "Right foot anchor. Coordinates vertical jump squashes and run cycle stride lengths." },
    { id: "center_mass", label: "Spine / Root Node", x: "50%", y: "62%", info: "Main character origin (0,0). Anchors overall scale squashes and physical inertia forces." }
  ];

  return (
    <div className="bg-gradient-to-br from-[#111e25] via-[#162a35] to-[#0c161d] text-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col min-h-[640px] relative max-w-5xl mx-auto">
      
      {/* Decorative ambient background sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,118,110,0.15),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.1),transparent_40%)] pointer-events-none" />

      {/* Top Brand Header Bar */}
      <div className="px-6 py-5 border-b border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0f766e] to-[#f97316] flex items-center justify-center shadow-lg shadow-black/30">
            <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white font-sans">Meet Thrivee</h2>
              <span className="bg-[#f97316] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider animate-bounce">Official Mascot</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">Pixar-Inspired 3D Brand Mascot Studio for ThriveCampus</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#11242c] border border-[#1d4d5e] rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-neutral-300">Campus Trust Level:</span>
            <span className="text-xs font-black text-white">MAX</span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 z-10">
        
        {/* LEFT COLUMN: Interactive 3D SVG Canvas */}
        <div className="w-full lg:w-[46%] border-r border-neutral-800/60 p-6 flex flex-col justify-between bg-[#0e1b21]/40 relative">
          
          {/* Quick Stats Overlays */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-1.5">
              <button 
                onClick={() => setViewAngle("front")}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${viewAngle === "front" ? "bg-[#0f766e] border-[#139c91] text-white shadow-sm shadow-emerald-950" : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"}`}
              >
                Front
              </button>
              <button 
                onClick={() => setViewAngle("threeQuarter")}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${viewAngle === "threeQuarter" ? "bg-[#0f766e] border-[#139c91] text-white shadow-sm shadow-emerald-950" : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"}`}
              >
                3/4 View
              </button>
              <button 
                onClick={() => setViewAngle("side")}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${viewAngle === "side" ? "bg-[#0f766e] border-[#139c91] text-white shadow-sm shadow-emerald-950" : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"}`}
              >
                Profile
              </button>
            </div>

            <button 
              onClick={() => {
                setRiggingOverlay(!riggingOverlay);
                setSelectedRigPart(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${riggingOverlay ? "bg-[#f97316] border-[#ff9142] text-white shadow-sm shadow-orange-950 animate-pulse" : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"}`}
            >
              <Sliders className="w-3 h-3" />
              {riggingOverlay ? "Rig Info ON" : "Rig Blueprint"}
            </button>
          </div>

          {/* Interactive Rigging Banner Info */}
          {riggingOverlay && (
            <div className="bg-neutral-950/80 border border-emerald-900/50 p-2.5 rounded-xl mb-3 text-[10px] text-emerald-400 leading-relaxed font-mono flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block mb-0.5">Rive/Lottie Animator Bones Layer:</span>
                {selectedRigPart ? (
                  <span>
                    <strong className="text-amber-400">{selectedRigPart.toUpperCase()}:</strong> {riggingNodes.find(n => n.id === selectedRigPart)?.info}
                  </span>
                ) : (
                  <span>Interactive overlay active. Click any flashing joint point on Thrivee to inspect coordinate metrics and bones.</span>
                )}
              </div>
            </div>
          )}

          {/* THE SVG INTERACTIVE MASCOT CANVAS CONTAINER */}
          <div className="flex-1 min-h-[340px] flex items-center justify-center relative select-none rounded-2xl bg-neutral-950/40 border border-neutral-900 overflow-hidden group">
            
            {/* Soft ambient environment aura behind character */}
            <div className={`absolute w-64 h-64 rounded-full filter blur-[50px] opacity-10 transition-all duration-700 ${emotion === 'sleeping' ? 'bg-indigo-500' : emotion === 'excited' ? 'bg-orange-500' : 'bg-emerald-500'}`} />

            <svg 
              viewBox="0 0 100 100" 
              className="w-4/5 h-4/5 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] overflow-visible"
            >
              <defs>
                {/* Real-time soft 3D Gradients */}
                <radialGradient id="thriveeSkin" cx="45%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#2dd4bf" /> {/* Warm Teal */}
                  <stop offset="50%" stopColor="#0d9488" /> {/* Rich Emerald-Teal */}
                  <stop offset="100%" stopColor="#115e59" /> {/* Shadow Teal */}
                </radialGradient>
                
                <radialGradient id="bellySkin" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.4" />
                </radialGradient>

                <linearGradient id="orangeLimb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>

                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                <radialGradient id="eyeHighlight" cx="35%" cy="35%" r="40%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </radialGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* FLOOR SHADOW - Pulses dynamically */}
              <motion.ellipse 
                cx="50" 
                cy="89" 
                rx="20" 
                ry="3" 
                fill="#000000" 
                opacity="0.35"
                animate={{
                  rx: emotion === "sleeping" ? [18, 19, 18] : [19, 23, 19],
                  opacity: emotion === "sleeping" ? [0.38, 0.32, 0.38] : [0.4, 0.22, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* ACCESSORY: Magic Aura Ring (Orbiting in background) */}
              {accessories.aura && (
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "50px 58px" }}
                >
                  {/* Glowing ring */}
                  <ellipse cx="50" cy="58" rx="34" ry="12" fill="none" stroke="url(#goldGradient)" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.8" filter="url(#glow)" />
                  {/* Flashing particles */}
                  <circle cx="22" cy="52" r="1.5" fill="#38bdf8" filter="url(#glow)" />
                  <circle cx="78" cy="64" r="1.5" fill="#fb923c" filter="url(#glow)" />
                  <circle cx="50" cy="46" r="1.2" fill="#34d399" filter="url(#glow)" />
                </motion.g>
              )}

              {/* ACCESSORY: Golden Cape (Behind body) */}
              {accessories.cape && (
                <motion.path 
                  d="M34 56 C20 60, 12 76, 18 84 C26 78, 32 75, 34 68 Z M66 56 C80 60, 88 76, 82 84 C74 78, 68 75, 66 68 Z"
                  fill="url(#goldGradient)"
                  stroke="#b45309"
                  strokeWidth="0.5"
                  opacity="0.9"
                  animate={{
                    d: [
                      "M34 56 C20 60, 12 76, 18 84 C26 78, 32 75, 34 68 Z M66 56 C80 60, 88 76, 82 84 C74 78, 68 75, 66 68 Z",
                      "M34 56 C18 63, 10 74, 16 85 C25 79, 31 74, 34 68 Z M66 56 C82 63, 90 74, 84 85 C75 79, 69 74, 66 68 Z",
                      "M34 56 C20 60, 12 76, 18 84 C26 78, 32 75, 34 68 Z M66 56 C80 60, 88 76, 82 84 C74 78, 68 75, 66 68 Z"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* CHARACTER BASE ROOT (Hovering & Squashing) */}
              <motion.g
                animate={{
                  y: emotion === "sleeping" ? [0, 1, 0] : [0, -3, 0],
                  scaleY: emotion === "sleeping" ? [1, 1.01, 1] : [1, 0.97, 1]
                }}
                transition={{
                  duration: emotion === "sleeping" ? 4.5 : 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transformOrigin: "50px 85px" }}
              >
                
                {/* FEET / LEGS (Layered underneath body) */}
                <g id="layer-legs">
                  {/* Left Foot */}
                  <motion.path 
                    d={viewAngle === "side" ? "M 44 83 Q 48 88, 42 88 Q 36 88, 40 83 Z" : "M 36 81 C 36 86, 44 86, 44 81 Z"}
                    fill={accessories.shoes ? "#ea580c" : "url(#orangeLimb)"}
                    stroke={accessories.shoes ? "#ffffff" : "none"}
                    strokeWidth={accessories.shoes ? "0.6" : "0"}
                  />
                  {/* Right Foot */}
                  {viewAngle !== "side" && (
                    <motion.path 
                      d="M 56 81 C 56 86, 64 86, 64 81 Z"
                      fill={accessories.shoes ? "#ea580c" : "url(#orangeLimb)"}
                      stroke={accessories.shoes ? "#ffffff" : "none"}
                      strokeWidth={accessories.shoes ? "0.6" : "0"}
                    />
                  )}
                </g>

                {/* ACCESSORY: Backpack (Back details showing outside body margins) */}
                {accessories.backpack && viewAngle !== "side" && (
                  <g id="layer-backpack-body">
                    <rect x="25" y="55" width="10" height="20" rx="3" fill="#ea580c" stroke="#c2410c" strokeWidth="0.5" />
                    <rect x="65" y="55" width="10" height="20" rx="3" fill="#ea580c" stroke="#c2410c" strokeWidth="0.5" />
                  </g>
                )}

                {/* MAIN BODY: Rounded organic droplet shape */}
                <path 
                  d={
                    viewAngle === "side"
                      ? "M 50 28 C 30 28, 30 83, 50 84 C 65 84, 66 28, 50 28 Z" // Side profile
                      : viewAngle === "threeQuarter"
                      ? "M 50 26 C 31 26, 26 84, 48 85 C 68 85, 71 26, 50 26 Z" // 3/4 view
                      : "M 50 25 C 28 25, 23 83, 50 84 C 77 83, 72 25, 50 25 Z" // Front view
                  }
                  fill="url(#thriveeSkin)"
                  stroke="#0f766e"
                  strokeWidth="0.8"
                />

                {/* BELLY CAPE: Lighter soft organic front oval */}
                {viewAngle !== "side" && (
                  <path 
                    d={
                      viewAngle === "threeQuarter"
                        ? "M 46 54 C 33 54, 30 82, 46 82 C 60 82, 59 54, 46 54 Z"
                        : "M 50 54 C 34 54, 34 82, 50 82 C 66 82, 66 54, 50 54 Z"
                    }
                    fill="url(#bellySkin)"
                  />
                )}

                {/* OUTFITS (Conditional vectors drawn over body) */}
                {outfit !== "none" && (
                  <g id="layer-outfit" className="transition-all">
                    {/* 1. SCHOOL UNIFORM: Smart vest & Orange striped tie */}
                    {outfit === "school" && (
                      <g>
                        {/* Gray Vest body */}
                        <path d="M34 68 C34 83, 66 83, 66 68 L62 55 L38 55 Z" fill="#64748b" stroke="#475569" strokeWidth="0.4" />
                        {/* White shirt collar */}
                        <path d="M43 55 L50 63 L47 55 Z" fill="#ffffff" />
                        <path d="M57 55 L50 63 L53 55 Z" fill="#ffffff" />
                        {/* Tie */}
                        <path d="M49.2 61 L50.8 61 L52 74 L50 78 L48 74 Z" fill="#f97316" />
                        <line x1="49.5" y1="65" x2="51.5" y2="67" stroke="#ffffff" strokeWidth="0.6" />
                        <line x1="49" y1="70" x2="51.2" y2="72" stroke="#ffffff" strokeWidth="0.6" />
                      </g>
                    )}

                    {/* 2. SPORTS UNIFORM: Tank top with 'T' logo */}
                    {outfit === "sports" && (
                      <g>
                        <path d="M34 64 C34 83, 66 83, 66 64 C66 58, 62 57, 62 57 L58 63 L42 63 L38 57 C38 57, 34 58, 34 64 Z" fill="#0f766e" />
                        {/* Orange dynamic trim */}
                        <path d="M34 64 C34 83, 66 83, 66 64" fill="none" stroke="#f97316" strokeWidth="1.2" />
                        {/* 'T' mascot team logo */}
                        <text x="50" y="75" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif">T</text>
                      </g>
                    )}

                    {/* 3. WINTER HOODIE: Cozy oversized hoodie */}
                    {outfit === "hoodie" && (
                      <g>
                        {/* Body of hoodie */}
                        <path d="M32 58 C32 84, 68 84, 68 58 C68 52, 60 50, 50 50 C40 50, 32 52, 32 58 Z" fill="#047857" stroke="#065f46" strokeWidth="0.4" />
                        {/* Front pocket */}
                        <path d="M40 70 C40 81, 60 81, 60 70 Z" fill="#065f46" />
                        {/* Drawstrings */}
                        <circle cx="47" cy="55" r="1" fill="#f97316" />
                        <line x1="47" y1="55" x2="45" y2="67" stroke="#f97316" strokeWidth="0.6" strokeLinecap="round" />
                        <circle cx="53" cy="55" r="1" fill="#f97316" />
                        <line x1="53" y1="55" x2="55" y2="65" stroke="#f97316" strokeWidth="0.6" strokeLinecap="round" />
                      </g>
                    )}

                    {/* 4. CHAMPION OUTFIT: Navy & Gold Varsity Letterman */}
                    {outfit === "champion" && (
                      <g>
                        {/* Navy body */}
                        <path d="M33 59 C33 84, 67 84, 67 59 L62 53 L38 53 Z" fill="#1e3a8a" />
                        {/* Gold trim sleeves */}
                        <path d="M33 59 C31 63, 31 75, 33 80" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M67 59 C69 63, 69 75, 67 80" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round" />
                        {/* Gold button lines */}
                        <circle cx="50" cy="60" r="0.8" fill="url(#goldGradient)" />
                        <circle cx="50" cy="67" r="0.8" fill="url(#goldGradient)" />
                        <circle cx="50" cy="74" r="0.8" fill="url(#goldGradient)" />
                        {/* Gold letter 'C' */}
                        <text x="41" y="66" fill="url(#goldGradient)" fontSize="7" fontWeight="900">C</text>
                      </g>
                    )}

                    {/* 5. EXPLORER OUTFIT: Tan utility vest with pockets */}
                    {outfit === "explorer" && (
                      <g>
                        {/* Vest base */}
                        <path d="M34 58 C34 83, 66 83, 66 58 L60 52 L40 52 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
                        {/* Multi pockets */}
                        <rect x="37" y="64" width="7" height="6" rx="1" fill="#78350f" />
                        <rect x="56" y="64" width="7" height="6" rx="1" fill="#78350f" />
                        <rect x="37" y="72" width="8" height="7" rx="1" fill="#78350f" />
                        <rect x="55" y="72" width="8" height="7" rx="1" fill="#78350f" />
                        {/* Little compass buckle */}
                        <circle cx="50" cy="57" r="2.5" fill="#e2e8f0" stroke="#475569" strokeWidth="0.5" />
                        <line x1="50" y1="55" x2="50" y2="59" stroke="#f97316" strokeWidth="0.5" />
                      </g>
                    )}

                    {/* 6. GRADUATION OUTFIT: Black & Emerald academic gown */}
                    {outfit === "graduation" && (
                      <g>
                        <path d="M33 55 C33 83, 67 83, 67 55 L61 48 L39 48 Z" fill="#1e293b" />
                        {/* Emerald panels */}
                        <path d="M42 48 L46 83 L42 83 Z" fill="#047857" />
                        <path d="M58 48 L54 83 L58 83 Z" fill="#047857" />
                        {/* Golden Sash */}
                        <path d="M48 48 L50 75 L52 48 Z" fill="url(#goldGradient)" />
                      </g>
                    )}

                    {/* 7. FESTIVAL OUTFIT: Vibrant color-blocked school jersey */}
                    {outfit === "festival" && (
                      <g>
                        {/* Dynamic split diagonal design */}
                        <path d="M34 57 C34 83, 50 83, 50 57 Z" fill="#f97316" />
                        <path d="M50 57 C50 83, 66 83, 66 57 Z" fill="#0f766e" />
                        {/* Sparkly white star */}
                        <polygon points="50,62 52,66 56,66 53,69 54,73 50,71 46,73 47,69 44,66 48,66" fill="#ffffff" />
                      </g>
                    )}
                  </g>
                )}

                {/* THE FACE EXPRESSION LAYER (Eyes & Mouth) */}
                <g id="layer-face" className="transition-all">
                  
                  {/* Rosy Cheeks Blush */}
                  <g opacity={emotion === "sleeping" ? "0.1" : "0.35"}>
                    <ellipse cx={viewAngle === "threeQuarter" ? "38" : "36"} cy="42" rx="3.5" ry="2" fill="#f43f5e" />
                    <ellipse cx={viewAngle === "threeQuarter" ? "56" : "64"} cy="42" rx="3.5" ry="2" fill="#f43f5e" />
                  </g>

                  {/* 1. EYES: Expressive vector shapes based on selected Emotion */}
                  <g id="eyes" className="transition-all">
                    
                    {/* SLEEPING: Closed happy curve arcs */}
                    {emotion === "sleeping" ? (
                      <g>
                        <path d="M31 38 Q36 41, 41 38" fill="none" stroke="#042f2e" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M59 38 Q64 41, 69 38" fill="none" stroke="#042f2e" strokeWidth="1.8" strokeLinecap="round" />
                      </g>
                    ) : emotion === "sad" ? (
                      // SAD: Drooping slanted eyes with tear glands
                      <g>
                        <path d="M31 39 Q36 36, 41 41" fill="none" stroke="#042f2e" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M59 41 Q64 36, 69 39" fill="none" stroke="#042f2e" strokeWidth="1.6" strokeLinecap="round" />
                        {/* Tiny tear */}
                        <circle cx="33" cy="43" r="1.5" fill="#38bdf8" filter="url(#glow)" />
                        <path d="M33 43 L31.5 45 L34.5 45 Z" fill="#38bdf8" />
                      </g>
                    ) : emotion === "excited" || emotion === "celebrating" ? (
                      // EXCITED: Upward curved happy eyes (Anime style)
                      <g>
                        <path d="M32 40 Q36.5 35, 41 40" fill="none" stroke="#042f2e" strokeWidth="2" strokeLinecap="round" />
                        <path d="M59 40 Q63.5 35, 68 40" fill="none" stroke="#042f2e" strokeWidth="2" strokeLinecap="round" />
                        {/* Sparkling overlay sparks */}
                        <polygon points="36,31 37.5,33 39,31 37.5,29" fill="#f59e0b" />
                        <polygon points="63,31 64.5,33 66,31 64.5,29" fill="#f59e0b" />
                      </g>
                    ) : (
                      // STANDARD & OTHER EMOTIONS: Large, glossy circular irises
                      <g>
                        {/* Left Eye */}
                        <circle cx={viewAngle === "threeQuarter" ? "42" : "36"} cy="38" r="5" fill="#111827" />
                        <circle cx={viewAngle === "threeQuarter" ? "42" : "36"} cy="38" r="4" fill="#0f766e" /> {/* Teal Iris */}
                        <circle cx={viewAngle === "threeQuarter" ? "42" : "36"} cy="38" r="2.8" fill="#111827" /> {/* Pupil */}
                        {/* Double Gloss Highlights */}
                        <circle cx={viewAngle === "threeQuarter" ? "40.5" : "34.5"} cy="36.5" r="1.2" fill="#ffffff" />
                        <circle cx={viewAngle === "threeQuarter" ? "43.5" : "37.5"} cy="39.5" r="0.6" fill="#ffffff" opacity="0.8" />

                        {/* Right Eye */}
                        {viewAngle !== "side" && (
                          <g>
                            <circle cx={viewAngle === "threeQuarter" ? "58" : "64"} cy="38" r="5" fill="#111827" />
                            <circle cx={viewAngle === "threeQuarter" ? "58" : "64"} cy="38" r="4" fill="#0f766e" /> {/* Teal Iris */}
                            <circle cx={viewAngle === "threeQuarter" ? "58" : "64"} cy="38" r="2.8" fill="#111827" /> {/* Pupil */}
                            {/* Double Gloss Highlights */}
                            <circle cx={viewAngle === "threeQuarter" ? "56.5" : "62.5"} cy="36.5" r="1.2" fill="#ffffff" />
                            <circle cx={viewAngle === "threeQuarter" ? "59.5" : "65.5"} cy="39.5" r="0.6" fill="#ffffff" opacity="0.8" />
                          </g>
                        )}
                      </g>
                    )}
                  </g>

                  {/* 2. EYEBROWS: Dynamic rotations based on mental state */}
                  <g id="eyebrows">
                    {emotion === "thinking" ? (
                      // Slanted curious eyebrows
                      <g>
                        <line x1="31" y1="31" x2="38" y2="33" stroke="#042f2e" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="62" y1="33" x2="69" y2="30" stroke="#042f2e" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    ) : emotion === "focused" ? (
                      // Flat furrowed concentration
                      <g>
                        <line x1="32" y1="32" x2="39" y2="33" stroke="#042f2e" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="61" y1="33" x2="68" y2="32" stroke="#042f2e" strokeWidth="1.8" strokeLinecap="round" />
                      </g>
                    ) : emotion === "surprised" ? (
                      // High arched raised eyebrows
                      <g>
                        <path d="M31 30 Q36 27, 41 30" fill="none" stroke="#042f2e" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M59 30 Q64 27, 69 30" fill="none" stroke="#042f2e" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    ) : (
                      // Gentle neutral/friendly curve
                      <g>
                        <path d="M31 32 Q36 30, 41 32" fill="none" stroke="#042f2e" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M59 32 Q64 30, 69 32" fill="none" stroke="#042f2e" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    )}
                  </g>

                  {/* 3. MOUTH: Dynamic curves expressing emotion */}
                  <g id="mouth">
                    {emotion === "happy" || emotion === "encouraging" ? (
                      // Wide friendly curved smile
                      <path d="M43 47 Q50 53, 57 47" fill="none" stroke="#042f2e" strokeWidth="2.2" strokeLinecap="round" />
                    ) : emotion === "excited" || emotion === "celebrating" ? (
                      // Open laughing/singing mouth with tongue details
                      <g>
                        <path d="M42 46 C42 53, 58 53, 58 46 Z" fill="#be123c" />
                        <path d="M46 50 C46 48, 54 48, 54 50" fill="none" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M42 46 L58 46" stroke="#042f2e" strokeWidth="1.5" />
                      </g>
                    ) : emotion === "thinking" ? (
                      // Smart tiny side-smirk line
                      <path d="M46 48 Q52 47, 54 49" fill="none" stroke="#042f2e" strokeWidth="1.8" strokeLinecap="round" />
                    ) : emotion === "sleeping" ? (
                      // Cute tiny O-shaped blowing bubble breathing
                      <g>
                        <circle cx="50" cy="48" r="1.5" fill="none" stroke="#042f2e" strokeWidth="1.5" />
                        {/* Sleeping letter 'Z' elements */}
                        <motion.text 
                          x="70" 
                          y="25" 
                          fill="#38bdf8" 
                          fontSize="7" 
                          fontWeight="bold"
                          animate={{ y: [25, 18, 25], opacity: [0, 1, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        >z</motion.text>
                        <motion.text 
                          x="75" 
                          y="18" 
                          fill="#38bdf8" 
                          fontSize="10" 
                          fontWeight="bold"
                          animate={{ y: [18, 8, 18], opacity: [0, 1, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        >Z</motion.text>
                      </g>
                    ) : emotion === "surprised" ? (
                      // Perfect small O mouth
                      <ellipse cx="50" cy="48" rx="2.5" ry="3.5" fill="#be123c" stroke="#042f2e" strokeWidth="1" />
                    ) : emotion === "sad" ? (
                      // Downward curved droop
                      <path d="M44 50 Q50 46, 56 50" fill="none" stroke="#042f2e" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      // Standard cute neutral line
                      <line x1="45" y1="48" x2="55" y2="48" stroke="#042f2e" strokeWidth="1.8" strokeLinecap="round" />
                    )}
                  </g>
                </g>

                {/* ARMS / FLIPPERS (Foreground attachment joints) */}
                <g id="layer-arms">
                  {/* Left Arm / Flipper */}
                  <motion.path 
                    d={viewAngle === "side" ? "M 34 58 Q 22 62, 28 68 Z" : "M 28 58 Q 16 54, 18 64 Q 22 68, 28 62 Z"}
                    fill="url(#thriveeSkin)"
                    stroke="#0f766e"
                    strokeWidth="0.5"
                    animate={{
                      rotate: emotion === "excited" || emotion === "celebrating" ? [-15, 30, -15] : [0, 4, 0]
                    }}
                    transition={{
                      duration: emotion === "excited" ? 0.4 : 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ transformOrigin: "28px 58px" }}
                  />

                  {/* Right Arm / Flipper */}
                  {viewAngle !== "side" && (
                    <motion.path 
                      d="M 72 58 Q 84 54, 82 64 Q 78 68, 72 62 Z"
                      fill="url(#thriveeSkin)"
                      stroke="#0f766e"
                      strokeWidth="0.5"
                      animate={{
                        rotate: emotion === "excited" || emotion === "celebrating" ? [15, -30, 15] : [0, -4, 0]
                      }}
                      transition={{
                        duration: emotion === "excited" ? 0.4 : 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ transformOrigin: "72px 58px" }}
                    />
                  )}
                </g>

                {/* ACCESSORY: Backpack Straps (Drawn in front of body) */}
                {accessories.backpack && outfit === "none" && viewAngle !== "side" && (
                  <g id="layer-backpack-straps">
                    <path d="M34 52 Q38 66, 36 78" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M66 52 Q62 66, 64 78" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
                  </g>
                )}

                {/* ACCESSORY: Smart Watch on Left Flipper */}
                {accessories.smartWatch && (
                  <g id="layer-smartwatch">
                    <rect x="20" y="58" width="4" height="2" fill="#1e293b" />
                    <rect x="19" y="59" width="3" height="3" rx="0.5" fill="#0f766e" stroke="#34d399" strokeWidth="0.3" filter="url(#glow)" />
                  </g>
                )}

              </motion.g>

              {/* ACCESSORY: Headphones (Layered over head) */}
              {accessories.headphones && (
                <g id="layer-headphones">
                  {/* Outer glowing band */}
                  <path d="M28 35 A22 22 0 0 1 72 35" fill="none" stroke="#115e59" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Left glowing cup */}
                  <rect x="25" y="32" width="4.5" height="10" rx="2" fill="#f97316" stroke="#c2410c" strokeWidth="0.5" filter="url(#glow)" />
                  {/* Right cup */}
                  <rect x="70.5" y="32" width="4.5" height="10" rx="2" fill="#f97316" stroke="#c2410c" strokeWidth="0.5" filter="url(#glow)" />
                </g>
              )}

              {/* ACCESSORY: Champion Crown (Floats dynamically above head) */}
              {accessories.crown && (
                <motion.g
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <polygon points="36,24 39,28 44,21 50,28 56,21 61,28 64,24 64,29 36,29" fill="url(#goldGradient)" stroke="#b45309" strokeWidth="0.5" />
                  <line x1="36" y1="28.5" x2="64" y2="28.5" stroke="#ffffff" strokeWidth="0.8" />
                  {/* Glowing teal crystals */}
                  <circle cx="50" cy="25" r="0.8" fill="#2dd4bf" filter="url(#glow)" />
                  <circle cx="44" cy="23" r="0.6" fill="#2dd4bf" filter="url(#glow)" />
                  <circle cx="56" cy="23" r="0.6" fill="#2dd4bf" filter="url(#glow)" />
                </motion.g>
              )}

              {/* ACCESSORY: Standing elements: Water Bottle and Textbook Stack */}
              {accessories.waterBottle && (
                <g id="layer-waterbottle" transform="translate(14, 0)">
                  {/* Translucent water flask */}
                  <rect x="58" y="74" width="6" height="12" rx="1.5" fill="#38bdf8" fillOpacity="0.75" stroke="#0284c7" strokeWidth="0.4" />
                  <rect x="59.5" y="72" width="3" height="2" fill="#f97316" />
                  {/* Level bubble */}
                  <circle cx="61" cy="79" r="0.6" fill="#ffffff" opacity="0.6" />
                </g>
              )}

              {accessories.books && (
                <g id="layer-textbooks" transform="translate(-32, 0)">
                  {/* textbook stack */}
                  <rect x="56" y="81" width="10" height="2" rx="0.5" fill="#0f766e" stroke="#115e59" strokeWidth="0.3" />
                  <rect x="57" y="79" width="9" height="2" rx="0.5" fill="#f97316" stroke="#c2410c" strokeWidth="0.3" />
                  <rect x="55" y="83" width="11" height="2.2" rx="0.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.3" />
                </g>
              )}

              {/* OVERLAYS: Blueprint Rigging skeleton overlays when active */}
              {riggingOverlay && (
                <g id="layer-rigging-skeleton" opacity="0.85">
                  {/* Interconnected skeleton lines */}
                  <line x1="50" y1="45" x2="41" y2="38" stroke="#10b981" strokeWidth="0.6" strokeDasharray="1 1" />
                  <line x1="50" y1="45" x2="59" y2="38" stroke="#10b981" strokeWidth="0.6" strokeDasharray="1 1" />
                  <line x1="50" y1="45" x2="50" y2="46" stroke="#10b981" strokeWidth="0.6" />
                  <line x1="50" y1="45" x2="50" y2="62" stroke="#10b981" strokeWidth="0.8" />
                  <line x1="50" y1="62" x2="28" y2="58" stroke="#10b981" strokeWidth="0.6" />
                  <line x1="50" y1="62" x2="72" y2="58" stroke="#10b981" strokeWidth="0.6" />
                  <line x1="50" y1="62" x2="41" y2="83" stroke="#10b981" strokeWidth="0.6" />
                  <line x1="50" y1="62" x2="59" y2="83" stroke="#10b981" strokeWidth="0.6" />

                  {/* Interactive bones flashing target knobs */}
                  {riggingNodes.map((node) => {
                    const isSelected = selectedRigPart === node.id;
                    return (
                      <g 
                        key={node.id} 
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRigPart(node.id);
                        }}
                      >
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={isSelected ? "2.5" : "1.8"} 
                          fill={isSelected ? "#f97316" : "#10b981"} 
                          stroke="#ffffff" 
                          strokeWidth="0.4"
                          className="animate-pulse"
                        />
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r="4" 
                          fill="transparent" 
                        />
                      </g>
                    );
                  })}
                </g>
              )}

            </svg>

            {/* Quick floating status tag */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400 border border-neutral-800">
              State: <span className="text-[#34d399]">{emotion}</span>
            </div>
            
            {accessories.aura && (
              <div className="absolute top-4 left-4 bg-[#f97316]/25 border border-[#f97316]/50 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-[#fda4af]">
                Aura Active
              </div>
            )}
          </div>

          {/* Interactive prompt code block metadata */}
          <div className="mt-4 text-[10px] text-neutral-500 font-mono text-center">
            Vector Specs: 12 Layers · 100% Vector Scalable (SVG) · Lottie Bound
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Configurations & Lore */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#112028]">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-neutral-800 bg-neutral-950/20 shrink-0">
            <button
              onClick={() => setActiveTab("persona")}
              className={`flex-1 py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeTab === "persona" ? "text-white border-[#0f766e] bg-[#142831]/50" : "text-neutral-400 border-transparent hover:text-neutral-200"}`}
            >
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              <span>Persona & Lore</span>
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex-1 py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeTab === "gallery" ? "text-white border-[#0f766e] bg-[#142831]/50" : "text-neutral-400 border-transparent hover:text-neutral-200"}`}
            >
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              <span>3D Concept Art</span>
            </button>
            <button
              onClick={() => setActiveTab("rigging")}
              className={`flex-1 py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeTab === "rigging" ? "text-white border-[#0f766e] bg-[#142831]/50" : "text-neutral-400 border-transparent hover:text-neutral-200"}`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              <span>Animator Rigging</span>
            </button>
            <button
              onClick={() => setActiveTab("interaction")}
              className={`flex-1 py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeTab === "interaction" ? "text-white border-[#0f766e] bg-[#142831]/50" : "text-neutral-400 border-transparent hover:text-neutral-200"}`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-pink-500" />
              <span>Interactions ({chatLog.length})</span>
            </button>
          </div>

          {/* TAB CONTENTS (Scrollable container) */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* TAB 1: Mascot Persona & Lore */}
            {activeTab === "persona" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-2">The Story of Thrivee</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Designed to be the ultimate friendly companion, <strong>Thrivee</strong> is neither a sterile machine-robot nor a cold medical caregiver. Thrivee represents the perfect blend of <strong>mindfulness, physical health, and educational curiosity</strong>. Its soft organic shape is highly approachable and gender-neutral, specifically engineered to connect with school students aged 10–18.
                  </p>
                </div>

                {/* Grid of Personality Traits */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-3">Core Personality Traits</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#152731] p-3 rounded-xl border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-black text-white">Supportive</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Always responds with constructive, kind growth-mindset advice.</span>
                    </div>
                    <div className="bg-[#152731] p-3 rounded-xl border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-xs font-black text-white">Playful</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Enjoys wearing customized uniforms, silly caps, and jumping on goal completion.</span>
                    </div>
                    <div className="bg-[#152731] p-3 rounded-xl border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        <span className="text-xs font-black text-white">Motivating</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Celebrates every tiny habit streak, turning chores into epic achievements.</span>
                    </div>
                    <div className="bg-[#152731] p-3 rounded-xl border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-xs font-black text-white">Intelligent</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Acts as a helpful learning mentor, offering homework tips and focused study help.</span>
                    </div>
                  </div>
                </div>

                {/* Color Spectrum */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-3">Brand Color Palette</h4>
                  <div className="flex gap-2.5">
                    <div className="flex-1 flex items-center gap-2 bg-[#152731] p-2 rounded-xl border border-neutral-800">
                      <div className="w-6 h-6 rounded-lg bg-[#0f766e] shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold block text-white">Thrive Teal</span>
                        <span className="text-[8px] font-mono text-neutral-400">#0f766e (60%)</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 bg-[#152731] p-2 rounded-xl border border-neutral-800">
                      <div className="w-6 h-6 rounded-lg bg-[#047857] shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold block text-white">Thrive Emerald</span>
                        <span className="text-[8px] font-mono text-neutral-400">#047857 (30%)</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 bg-[#152731] p-2 rounded-xl border border-neutral-800">
                      <div className="w-6 h-6 rounded-lg bg-[#f97316] shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold block text-white">Thrive Orange</span>
                        <span className="text-[8px] font-mono text-neutral-400">#f97316 (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Design Rules banner */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 space-y-1.5 leading-relaxed">
                  <span className="font-bold text-white block">🚫 Strict Design Safeguards</span>
                  <div>• <strong>No robot antenna or metal screws</strong> to maintain biological emotional empathy.</div>
                  <div>• <strong>No stethoscopes, red crosses or clinical whites</strong> to avoid a hospital or recovery aesthetic.</div>
                  <div>• <strong>Never use dark gothic colors or sharp spikes</strong>; lines remain smooth, friendly, and organic.</div>
                </div>
              </div>
            )}

            {/* TAB 2: Pixar 3D Concept Art Gallery */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-2">Official Pixar-Style 3D Art</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    This is the master design concept generated dynamically via our premium 3D design pipeline. Notice the rich depth, clay-like tactile textures, warm studio highlight catches, and soft ambient falloff.
                  </p>

                  {/* Elegant Museum Mock Frame */}
                  <div className="bg-neutral-950 p-4 rounded-2xl border-4 border-[#1c2c34] shadow-2xl relative group overflow-hidden">
                    <img 
                      src="/src/assets/images/thrivee_mascot_hero_1784618020598.jpg" 
                      alt="Thrivee Pixar 3D mascot"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto aspect-square object-cover rounded-lg shadow-inner group-hover:scale-[1.02] transition-all duration-500"
                    />
                    
                    {/* Glowing highlight lens flares */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
                    
                    <div className="mt-3.5 pt-3.5 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400">
                      <div>
                        <span className="font-bold text-white block">Thrivee Master Concept V1</span>
                        <span className="text-[9px] text-neutral-500 font-mono">Rendered: 1024x1024 px · Lossless JPG</span>
                      </div>
                      <div className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono">
                        APPROVED
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prompts info card */}
                <div className="bg-[#152731] border border-neutral-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-black text-white uppercase block">Creative Prompts Spec:</span>
                  <p className="text-[10px] text-neutral-400 font-mono leading-relaxed bg-black/30 p-2.5 rounded-lg border border-neutral-900 select-all">
                    "A premium Pixar-inspired 3D character design of 'Thrivee', the official brand mascot for a school app. It has a rounded, gender-neutral, friendly, droplet-like organic body, large expressive eyes, and a sweet smile. Its color palette consists of soft gradients of teal, emerald green, and vibrant orange."
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Animator Rigging Specification */}
            {activeTab === "rigging" && (
              <div className="space-y-6 font-mono">
                
                <div className="space-y-2 font-sans">
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider">Lottie & Rive Integration Blueprint</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    To maintain crisp 120 FPS high-refresh animations on both mobile and web clients, Thrivee is constructed of <strong>distinct vector groupings</strong> mapped to coordinate pivots.
                  </p>
                </div>

                {/* Bone joints selection info */}
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#10b981] uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      Dynamic Anchor Targets
                    </span>
                    <span className="text-[10px] text-neutral-500">9 bones detected</span>
                  </div>
                  
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {riggingNodes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          setRiggingOverlay(true);
                          setSelectedRigPart(n.id);
                        }}
                        className={`w-full text-left p-2 rounded-xl border text-[11px] transition-all flex items-center justify-between ${selectedRigPart === n.id ? "bg-emerald-950/40 border-[#10b981] text-white" : "bg-[#112028] border-neutral-800 text-neutral-300 hover:border-neutral-700"}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${selectedRigPart === n.id ? "bg-[#f97316]" : "bg-[#10b981]"}`} />
                          <span className="font-mono text-[10px]">{n.label}</span>
                        </div>
                        <span className="text-neutral-500 text-[10px] font-mono">{n.x}, {n.y}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Code Export Sandbox */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      Asset Export Center
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Download the structured master vector set to instantly compile custom animations, or generate full-body rigging JSON for Adobe After Effects (Bodymovin).
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setThrivePoints(p => p + 10);
                        alert("Thrivee SVG Asset Pack exported successfully to downloads folder! Enjoy rigging!");
                      }}
                      className="flex-1 bg-[#152731] border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 py-2 rounded-xl text-xs font-bold text-neutral-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Get Master .SVG</span>
                    </button>
                    <button 
                      onClick={() => {
                        setThrivePoints(p => p + 10);
                        alert("Rigging skeleton configuration successfully saved as thrivee_rive_rig.json!");
                      }}
                      className="flex-1 bg-[#152731] border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 py-2 rounded-xl text-xs font-bold text-neutral-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Get Skeleton .JSON</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: Interactions Chat Sandbox */}
            {activeTab === "interaction" && (
              <div className="flex flex-col h-[320px] bg-neutral-950/60 rounded-2xl border border-neutral-800 overflow-hidden font-sans">
                
                {/* Chat Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col scroll-smooth">
                  {chatLog.map((chat, idx) => {
                    const isThrivee = chat.sender === "thrivee";
                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col max-w-[85%] ${isThrivee ? "self-start" : "self-end items-end"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-bold ${isThrivee ? "text-emerald-400" : "text-sky-400"}`}>
                            {isThrivee ? "THRIVEE" : "YOU"}
                          </span>
                          <span className="text-[8px] text-neutral-600 font-mono">{chat.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${isThrivee ? "bg-[#152731] text-neutral-100 rounded-tl-none border border-neutral-800" : "bg-[#0f766e] text-white rounded-tr-none"}`}>
                          {chat.text}
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="self-start flex flex-col max-w-[80%]">
                      <span className="text-[9px] font-bold text-emerald-400 mb-0.5">THRIVEE IS REFLECTING...</span>
                      <div className="bg-[#152731] p-3 rounded-2xl rounded-tl-none border border-neutral-800 text-xs flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts List */}
                <div className="px-4 py-2 bg-neutral-950/40 border-t border-neutral-900 overflow-x-auto whitespace-nowrap flex gap-2 custom-scrollbar">
                  {quickPrompts.map((qp, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(qp)}
                      className="inline-block bg-[#112028] border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-neutral-300 hover:text-white px-3 py-1 rounded-full text-[10px] font-bold transition-all"
                    >
                      {qp.text}
                    </button>
                  ))}
                </div>

                {/* Input Action Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleMascotResponse(chatMessage);
                  }}
                  className="p-2 bg-neutral-950 border-t border-neutral-900 flex gap-2"
                >
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={`Chat with Thrivee... (Emotion: ${emotion})`}
                    className="flex-1 bg-[#112028] text-xs text-white border border-neutral-800 focus:border-[#0f766e] focus:outline-none rounded-xl px-4 py-2 transition-all placeholder:text-neutral-600"
                  />
                  <button
                    type="submit"
                    className="bg-[#0f766e] hover:bg-[#0d9488] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    Send
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* LOWER CONFIGURATIONS PANEL */}
          <div className="p-6 border-t border-neutral-800 bg-neutral-950/40 shrink-0">
            
            {/* Mascot Emotion presets list */}
            <div className="space-y-3 mb-4">
              <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Set Emotional State</label>
              <div className="flex flex-wrap gap-1.5">
                {(["happy", "excited", "thinking", "celebrating", "sleeping", "encouraging", "surprised", "focused", "sad", "proud"] as MascotEmotion[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setEmotion(e);
                      // Auto trigger first quick greeting text response
                      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      let presetTexts: Record<MascotEmotion, string> = {
                        happy: "I feel wonderful, Aarav Sharma! Smiling and staying positive is key.",
                        excited: "Oh yeah! That is super awesome!",
                        thinking: "Hmm, let me look at that habit goal carefully...",
                        celebrating: "Hooray! Great job!",
                        sleeping: "shhh... recharge time...",
                        encouraging: "You've got this! One step at a time.",
                        surprised: "Wow! Amazing progress!",
                        focused: "Let's lock in and ignore the distraction.",
                        sad: "I'm right here if you need a warm companion.",
                        proud: "You are truly a master student!"
                      };
                      setChatLog(prev => [...prev, { sender: "thrivee", text: presetTexts[e], time: now }]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${emotion === e ? "bg-emerald-950 border-[#10b981] text-[#34d399] shadow-sm" : "bg-[#112028]/80 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfits selection list */}
            <div className="space-y-3 mb-4">
              <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Equip Outfit Variation</label>
              <div className="flex flex-wrap gap-1.5">
                {(["none", "school", "sports", "hoodie", "champion", "explorer", "graduation", "festival"] as MascotOutfit[]).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOutfit(o)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${outfit === o ? "bg-orange-950 border-[#f97316] text-[#ff9142] shadow-sm" : "bg-[#112028]/80 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`}
                  >
                    {o === "none" ? "No Outfit" : `${o} Uniform`}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories toggle checks */}
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Attach Accessories</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(accessories) as Array<keyof MascotAccessories>).map((acc) => {
                  const active = accessories[acc];
                  return (
                    <button
                      key={acc}
                      onClick={() => toggleAccessory(acc)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold text-center border transition-all truncate flex items-center justify-center gap-1.5 ${active ? "bg-neutral-800 border-neutral-600 text-white" : "bg-[#112028]/60 border-neutral-800/80 text-neutral-500 hover:text-neutral-300"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#f97316]" : "bg-neutral-700"}`} />
                      <span className="capitalize">{acc.replace(/([A-Z])/g, ' $1')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
