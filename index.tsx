import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Upload, Image as ImageIcon, Sparkles, Film, ArrowRight, Wand2, RefreshCcw, Download, X, Ruler, Clock, Camera, Aperture, Lightbulb, ChevronRight, ChevronDown, FileText, Video, BrainCircuit, Copy, Check, Layers, Clapperboard, RotateCcw, Music, History, Trash2, ShoppingBag, MapPin } from 'lucide-react';

// --- Import all constants from modular files ---
import {
   TIKTOK_SHOP_SYSTEM_INSTRUCTION,
   VIDEO_REFINEMENT_INSTRUCTION,
   STUDIO_MODE_GUIDE,
   TRENDING_INTELLIGENCE,
   CINEMATIC_FASHION_SCENES,
   SPORTSWEAR_RULES,
   EMOTIONAL_ARC_GUIDE,
   WALKIN_CINEMATIC_RULES,
   PRODUCT_PHYSICS_RULES,
   TRANSFORMATION_SCENES,
   MARKETING_INTIMATE_SCENES,
   VEO_SAFE_MOTION_KEYWORDS,
   AFFILIATE_OPTIMIZATION,
   SAFETY_VOCABULARY_GUIDE,
   VIRAL_HOOKS_MASTERY,
   VOICE_SCRIPT_PRO,
   TRY_ON_MODE_GUIDE,
   ASMR_CINEMATIC_GUIDE,
   STORYTELLING_CINEMATIC_GUIDE,
   UNBOXING_CINEMATIC_GUIDE,
   REVIEW_CINEMATIC_GUIDE,
   TIKTOK_BANNED_WORDS_GUIDE,
   REAL_LOCATION_RULES,
   NO_VOICE_PRODUCT_FOCUS,
   INITIAL_BRIEF,
   BODY_TEMPLATES,
   PRODUCT_TYPE_GROUPS,
   LOCATION_REGIONS,
   STUDIO_CATEGORIES,
   FACE_PRESETS,
} from './constants';

// --- Components ---

const CopyButton = ({ text }: { text: string }) => {
   const [copied, setCopied] = useState(false);

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(text);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error('Failed to copy', err);
      }
   };

   return (
      <button
         onClick={handleCopy}
         className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all border z-20
        ${copied
               ? 'bg-green-500/15 border-green-500/50 text-green-400 shadow-sm shadow-green-500/10'
               : 'bg-zinc-900/80 border-zinc-700/40 text-zinc-400 hover:text-white hover:bg-zinc-800/80'}`}
         title="Copy to clipboard"
      >
         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
   );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
   <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all
      ${active
            ? 'bg-purple-500/15 text-purple-200 border border-purple-500/30 shadow-sm shadow-purple-500/5'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 border border-transparent'}`}
   >
      <Icon className="w-3 h-3" />
      {label}
   </button>
);

// 👗 BEFORE OUTFITS — trang phục "trước khi thay" cho try-on / transform / unboxing
const BEFORE_OUTFITS = [
   'wearing a seamless yoga set with breathable mesh panels',
   'wearing a snug pointelle knit lounge set',
   'a minimalist nude yoga set (tank top and leggings)',
   'wearing a beige ribbed seamless base layer',
   'wearing a lightweight crochet lounge set',
];
const getRandomBeforeOutfit = () => BEFORE_OUTFITS[Math.floor(Math.random() * BEFORE_OUTFITS.length)];
const getBeforeOutfitList = () => BEFORE_OUTFITS.map((o, i) => `${i + 1}. ${o}`).join('\n');

const App = () => {
   // State
   const [step, setStep] = useState<'input' | 'director'>('input');
   
   // 🎯 AFFILIATE MODE - Unified Optimization (DUY NHẤT)
   const [affiliatePlatform, setAffiliatePlatform] = useState<'tiktok' | 'facebook' | 'both'>('both');
   const [affiliateAudience, setAffiliateAudience] = useState<'cold' | 'warm' | 'hot'>('hot');
   const [affiliateGoal, setAffiliateGoal] = useState<'views' | 'engagement' | 'conversion'>('conversion');
   
   // 📦 PRODUCT DISPLAY TYPE (cách trình bày sản phẩm)
   const [displayType, setDisplayType] = useState<'fashion_model' | 'product_focus' | 'mixed'>('fashion_model');
   
   // 🚀 OPTIMIZATION LEVEL (mức độ tối ưu)
   const [optimizationLevel, setOptimizationLevel] = useState<'standard' | 'competitive'>('standard');
   
   // 📝 PRODUCT INFO (tùy chọn - cho AI phân tích tốt hơn)
   const [productInfo, setProductInfo] = useState<string>(''); // Tên SP, giá, chất liệu, USP
   
   const [activeTab, setActiveTab] = useState<'master' | 'keyframes' | 'scenes' | 'refined' | 'production'>('master');

   // 🔒 UNIFIED AFFILIATE VIDEO MODE - Duy nhất 1 mode

   const [faceImage, setFaceImage] = useState<string | null>(null);
   const [facePreset, setFacePreset] = useState<string>('douyin_doll');
   const [outfitImage, setOutfitImage] = useState<string | null>(null);

   // Body Configuration
   const [gender, setGender] = useState('Female');
   const [bodyMode, setBodyMode] = useState<'preset' | 'custom'>('preset');
   const [bodyType, setBodyType] = useState('Balanced');
   const [measurements, setMeasurements] = useState({
      height: '175',
      weight: '55',
      bust: '86',
      waist: '60',
      hips: '90',
      size: 'M'
   });

   // Product type for TikTok Shop (default to auto-detect)
   const [productType, setProductType] = useState<string>('auto');

   // Video style for TikTok Shop (including Beauty & Personal Care styles + Mirror OOTD + Handheld Voice + Viral Trending 2025-2026 + Áo Dài + Transformation + Fashion Walk-In + Trending 2026 Mid-Year)
   const [videoStyle, setVideoStyle] = useState<'body_real' | 'before_after' | 'before_after_fashion_show' | 'ao_dai_traditional' | 'ao_dai_transition' | 'ao_dai_catwalk' | 'ao_dai_modern' | 'fabric_focus' | 'sleepwear_cozy' | 'editorial_inner' | 'flatlay_inner' | 'handheld_inner' | 'handheld_voice' | 'mannequin_inner' | 'asmr_fabric' | 'floor_display' | 'beauty_demo' | 'device_review' | 'body_shaper_demo' | 'skincare_routine' | 'makeup_tutorial' | 'mirror_ootd' | 'ootd_novoice' | 'grwm' | 'outfit_change_viral' | 'ootd_grwm' | 'try_on_haul' | 'personal_branding' | 'fit_check' | 'style_challenge' | 'unbox_demo' | 'problem_solution' | 'feature_showcase' | 'before_after_home' | 'day_in_life' | 'comparison_test' | 'installation_guide' | 'smart_home_tour' | 'transform_viral' | 'transform_glowup' | 'transform_day_night' | 'fashion_walkin' | 'fashion_walkin_beauty' | 'cinematic_hook_reveal' | 'aesthetic_grwm' | 'outfit_challenge' | 'reaction_reveal' | 'coquette_aesthetic' | 'office_siren' | 'quiet_luxury' | 'trend_mashup' | 'pov_storytelling' | 'split_screen_compare' | 'asmr_unbox' | 'speed_styling' | 'closet_raid' | 'price_reveal_game' | 'mini_vlog_style' | 'rating_review' | 'hack_tutorial' | 'side_by_side' | 'aesthetic_flatlay' | 'countdown_reveal' | 'overlay_demo' | 'overlay_compare' | 'overlay_size'>('body_real');

   // Product Details for TikTok Shop (user input)
   const [fabricMaterial, setFabricMaterial] = useState<string>('');
   const [productHighlights, setProductHighlights] = useState<string>('');
   const [availableSizes, setAvailableSizes] = useState<string>('S-XXL');

   // Product Color for Studio Color Contrast validation
   const [productColor, setProductColor] = useState<string>('');

   // Additional Description - User custom notes
   const [additionalDescription, setAdditionalDescription] = useState<string>('');

   // Video Duration - 8s increments (8-48s), default 24s optimal for affiliate
   const [videoDuration, setVideoDuration] = useState<number>(24);

   const [brief, setBrief] = useState(INITIAL_BRIEF);

   // Location Region preference
   const [locationRegion, setLocationRegion] = useState<string>('auto');

   // Studio Mode - Professional themed studio backgrounds for TikTok affiliate
   const [studioMode, setStudioMode] = useState<boolean>(false);

   // 🎬 CINEMA FEATURES - Integrated into Affiliate Mode
   // Cinematic Style - hoàn toàn compatible với displayType
   const [cinematicStyle, setCinematicStyle] = useState<'standard' | 'transform_viral' | 'fashion_walkin' | 'marketing_intimate' | 'try_on' | 'asmr_cinematic' | 'storytelling' | 'unboxing' | 'review'>('standard');
   
   // Walk-In Options (chỉ active khi cinematicStyle === 'fashion_walkin')
   const [walkinVariant, setWalkinVariant] = useState<'auto' | 'classical' | 'digital'>('auto');
   const [walkinTimeOfDay, setWalkinTimeOfDay] = useState<'auto' | 'golden_hour' | 'blue_hour' | 'city_night'>('auto');
   const [walkinVibe, setWalkinVibe] = useState<'auto' | 'romantic' | 'power' | 'goddess' | 'minimal' | 'allure'>('auto');
   const [walkinPersonality, setWalkinPersonality] = useState<'auto' | 'casual_natural' | 'shy_timid' | 'confident_bold' | 'playful_flirty'>('auto');
   
   // Try-On Options (chỉ active khi cinematicStyle === 'try_on')
   const [tryOnVariant, setTryOnVariant] = useState<'auto' | 'fitting_room' | 'home_tryon' | 'haul_review' | 'mix_match' | 'outfit_battle' | 'loosely_draped'>('auto');
   const [tryOnTransition, setTryOnTransition] = useState<'auto' | 'door_reveal' | 'curtain_pull' | 'spin_change' | 'mirror_turn' | 'snap_cut' | 'fabric_slide'>('auto');
   const [tryOnPacing, setTryOnPacing] = useState<'auto' | 'quick_fire' | 'detailed_review' | 'storytelling'>('auto');
   
   // Aesthetic options - áp dụng cho fashion_model displayType
   const [aestheticVibe, setAestheticVibe] = useState<'auto' | 'romantic' | 'power' | 'goddess' | 'minimal' | 'allure'>('auto');
   const [modelPersonality, setModelPersonality] = useState<'auto' | 'casual_natural' | 'shy_timid' | 'confident_bold' | 'playful_flirty'>('auto');

   // 🎙️ Voice Style - Consistent voice across all scenes for Veo 3.1 native audio
   const [voiceStyle, setVoiceStyle] = useState<'saigon_female' | 'saigon_male' | 'hanoi_female' | 'hanoi_male' | 'no_voice'>('saigon_female');

   // Editorial Mode (18+) - foundation-free silhouette
   const [editorialMode, setEditorialMode] = useState<boolean>(false);

   // Wallpaper Mode - phone wallpaper friendly composition
   const [wallpaperMode, setWallpaperMode] = useState<boolean>(false);

   // Lookbook Mode - 10 images only, no video
   const [lookbookMode, setLookbookMode] = useState<boolean>(false);

   // Seductive Mode - TikTok safe alluring style
   const [seductiveMode, setSeductiveMode] = useState<boolean>(false);

   // Sexy Mode - Private mode for Nano Banana Pro & Veo 3.1
   const [sexyMode, setSexyMode] = useState<boolean>(false);

   // Auto-disable Seductive when Sexy Mode is ON (vocabulary conflict)
   React.useEffect(() => {
      if (sexyMode && seductiveMode) {
         setSeductiveMode(false);
      }
   }, [sexyMode]);

   // Reset sub-mode state when switching cinematicStyle
   React.useEffect(() => {
      if (cinematicStyle !== 'fashion_walkin') {
         setWalkinVariant('auto');
         setWalkinTimeOfDay('auto');
         setWalkinVibe('auto');
         setWalkinPersonality('auto');
      }
      if (cinematicStyle !== 'try_on') {
         setTryOnVariant('auto');
         setTryOnTransition('auto');
         setTryOnPacing('auto');
      }
      if (cinematicStyle !== 'standard') {
         setAestheticVibe('auto');
         setModelPersonality('auto');
      }
   }, [cinematicStyle]);

   // Aspect Ratio - 9:16 (vertical) or 16:9 (horizontal)
   const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');

   // API Key - Gemini API key with localStorage persistence
   const [apiKey, setApiKey] = useState<string>(() => {
      if (typeof window !== 'undefined') {
         return localStorage.getItem('gemini_api_key') || 'AIzaSyAuU0dc583Vhq-6eEiEdNyvSb_n0_P0kvo';
      }
      return 'AIzaSyAuU0dc583Vhq-6eEiEdNyvSb_n0_P0kvo';
   });
   const [showApiKey, setShowApiKey] = useState(false);

   // Gemini Model Selection - with localStorage persistence
   const [geminiModel, setGeminiModel] = useState<'gemini-2.5-flash' | 'gemini-3-flash-preview'>(() => {
      if (typeof window !== 'undefined') {
         const saved = localStorage.getItem('gemini_model');
         return (saved === 'gemini-3-flash-preview' ? 'gemini-3-flash-preview' : 'gemini-2.5-flash') as 'gemini-2.5-flash' | 'gemini-3-flash-preview';
      }
      return 'gemini-2.5-flash';
   });

   // Persist API Key
   useEffect(() => {
      if (apiKey) {
         localStorage.setItem('gemini_api_key', apiKey);
      }
   }, [apiKey]);

   // Persist Gemini Model
   useEffect(() => {
      localStorage.setItem('gemini_model', geminiModel);
   }, [geminiModel]);

   // 🎯 SMART VIDEO STYLE AUTO-MAPPING — Covers ALL product types with style pools for rotation
   // Each product type has a pool of suitable styles → random pick prevents repetition
   const VIDEO_STYLE_POOLS: Record<string, string[]> = {
      // === DRESSES ===
      dress: ['body_real', 'grwm', 'cinematic_hook_reveal', 'ootd_grwm', 'mirror_ootd', 'aesthetic_grwm', 'closet_raid', 'outfit_challenge', 'transform_day_night'],
      maxi_dress: ['body_real', 'fashion_walkin', 'cinematic_hook_reveal', 'before_after_fashion_show', 'ootd_novoice', 'mini_vlog_style'],
      mini_dress: ['fit_check', 'mirror_ootd', 'outfit_change_viral', 'body_real', 'reaction_reveal', 'coquette_aesthetic', 'trend_mashup'],
      bodycon: ['body_real', 'fit_check', 'mirror_ootd', 'before_after', 'cinematic_hook_reveal', 'side_by_side', 'transform_viral'],
      // === TOPS ===
      top: ['mirror_ootd', 'ootd_novoice', 'grwm', 'fit_check', 'try_on_haul', 'closet_raid', 'speed_styling'],
      blouse: ['mirror_ootd', 'office_siren', 'quiet_luxury', 'grwm', 'aesthetic_grwm', 'ootd_grwm', 'transform_day_night'],
      tshirt: ['fit_check', 'ootd_novoice', 'body_real', 'mirror_ootd', 'try_on_haul', 'side_by_side'],
      croptop: ['fit_check', 'mirror_ootd', 'outfit_change_viral', 'body_real', 'coquette_aesthetic', 'speed_styling', 'trend_mashup'],
      sweater: ['grwm', 'ootd_grwm', 'mirror_ootd', 'aesthetic_grwm', 'closet_raid', 'mini_vlog_style'],
      jacket: ['before_after', 'outfit_change_viral', 'body_real', 'mirror_ootd', 'cinematic_hook_reveal', 'style_challenge'],
      // === BOTTOMS ===
      pants: ['fit_check', 'mirror_ootd', 'body_real', 'try_on_haul', 'side_by_side', 'speed_styling'],
      jeans: ['fit_check', 'mirror_ootd', 'body_real', 'before_after', 'try_on_haul', 'side_by_side'],
      wide_pants: ['fashion_walkin', 'body_real', 'mirror_ootd', 'fit_check', 'ootd_novoice', 'cinematic_hook_reveal'],
      shorts: ['fit_check', 'mirror_ootd', 'body_real', 'ootd_novoice', 'speed_styling', 'closet_raid'],
      skirt: ['body_real', 'mirror_ootd', 'fit_check', 'grwm', 'coquette_aesthetic', 'outfit_change_viral'],
      // === SETS ===
      set: ['body_real', 'try_on_haul', 'grwm', 'ootd_grwm', 'aesthetic_grwm', 'closet_raid', 'speed_styling', 'outfit_challenge', 'floor_display'],
      suit: ['office_siren', 'quiet_luxury', 'fashion_walkin', 'cinematic_hook_reveal', 'body_real', 'personal_branding', 'transform_day_night'],
      jumpsuit: ['body_real', 'fashion_walkin', 'fit_check', 'mirror_ootd', 'cinematic_hook_reveal', 'before_after'],
      // === SPECIAL ===
      aodai: ['ao_dai_traditional', 'ao_dai_transition', 'ao_dai_catwalk', 'ao_dai_modern', 'fabric_focus'],
      bikini: ['editorial_inner', 'flatlay_inner', 'overlay_demo', 'handheld_inner', 'asmr_fabric', 'overlay_size', 'fabric_focus'],
      sleepwear: ['sleepwear_cozy', 'asmr_fabric', 'flatlay_inner', 'handheld_voice', 'aesthetic_flatlay', 'fabric_focus', 'floor_display'],
      lingerie: ['editorial_inner', 'mannequin_inner', 'flatlay_inner', 'handheld_inner', 'handheld_voice', 'overlay_demo', 'overlay_compare', 'overlay_size', 'fabric_focus'],
      sport: ['body_real', 'fit_check', 'before_after', 'grwm', 'speed_styling', 'try_on_haul', 'transform_viral'],
      bigsize: ['try_on_haul', 'body_real', 'fit_check', 'mirror_ootd', 'grwm', 'reaction_reveal', 'side_by_side', 'transform_viral'],
      // === BEAUTY & PERSONAL CARE ===
      facial_device: ['beauty_demo', 'device_review', 'skincare_routine', 'before_after', 'hack_tutorial', 'rating_review', 'transform_glowup', 'pov_storytelling'],
      serum: ['beauty_demo', 'skincare_routine', 'before_after', 'asmr_unbox', 'rating_review', 'hack_tutorial', 'pov_storytelling'],
      makeup: ['makeup_tutorial', 'beauty_demo', 'grwm', 'aesthetic_grwm', 'before_after', 'rating_review', 'transform_glowup', 'fashion_walkin_beauty'],
      body_shaper: ['body_shaper_demo', 'before_after', 'overlay_demo', 'overlay_compare', 'side_by_side', 'hack_tutorial', 'split_screen_compare'],
      massage_device: ['device_review', 'beauty_demo', 'asmr_unbox', 'problem_solution', 'rating_review', 'hack_tutorial', 'pov_storytelling'],
      skincare_set: ['skincare_routine', 'beauty_demo', 'asmr_unbox', 'try_on_haul', 'aesthetic_flatlay', 'countdown_reveal', 'transform_glowup'],
      hair_device: ['device_review', 'beauty_demo', 'before_after', 'hack_tutorial', 'rating_review', 'problem_solution'],
      nail_beauty: ['beauty_demo', 'asmr_fabric', 'aesthetic_flatlay', 'hack_tutorial', 'speed_styling', 'rating_review'],
      // === SMART HOME ===
      robot_vacuum: ['unbox_demo', 'before_after_home', 'problem_solution', 'comparison_test', 'day_in_life', 'rating_review'],
      air_purifier: ['unbox_demo', 'feature_showcase', 'problem_solution', 'comparison_test', 'day_in_life', 'rating_review'],
      smart_kitchen: ['unbox_demo', 'feature_showcase', 'hack_tutorial', 'day_in_life', 'problem_solution', 'asmr_unbox'],
      water_purifier: ['unbox_demo', 'comparison_test', 'feature_showcase', 'problem_solution', 'installation_guide', 'rating_review'],
      smart_fan: ['unbox_demo', 'feature_showcase', 'comparison_test', 'day_in_life', 'problem_solution', 'rating_review'],
      smart_light: ['unbox_demo', 'smart_home_tour', 'before_after_home', 'feature_showcase', 'installation_guide', 'aesthetic_flatlay'],
      security_cam: ['unbox_demo', 'installation_guide', 'feature_showcase', 'problem_solution', 'smart_home_tour', 'comparison_test'],
      smart_lock: ['unbox_demo', 'installation_guide', 'feature_showcase', 'problem_solution', 'comparison_test', 'rating_review'],
      cleaning_device: ['unbox_demo', 'before_after_home', 'problem_solution', 'comparison_test', 'hack_tutorial', 'asmr_unbox', 'split_screen_compare'],
      steam_device: ['unbox_demo', 'before_after', 'feature_showcase', 'hack_tutorial', 'problem_solution', 'comparison_test'],
      organizer: ['before_after_home', 'unbox_demo', 'hack_tutorial', 'aesthetic_flatlay', 'smart_home_tour', 'problem_solution'],
      pet_device: ['unbox_demo', 'day_in_life', 'feature_showcase', 'problem_solution', 'asmr_unbox', 'rating_review'],
      // === FALLBACK ===
      auto: ['body_real', 'mirror_ootd', 'grwm', 'fit_check', 'cinematic_hook_reveal', 'aesthetic_grwm', 'try_on_haul', 'outfit_challenge', 'trend_mashup'],
      combo: ['try_on_haul', 'body_real', 'grwm', 'ootd_grwm', 'speed_styling', 'closet_raid', 'aesthetic_grwm', 'price_reveal_game'],
   };

   // Style Vault - tracks recently used styles to prevent repetition  
   const [styleVault, setStyleVault] = useState<string[]>(() => {
      if (typeof window !== 'undefined') {
         const saved = localStorage.getItem('style_vault');
         return saved ? JSON.parse(saved) : [];
      }
      return [];
   });

   // Persist style vault
   useEffect(() => {
      localStorage.setItem('style_vault', JSON.stringify(styleVault.slice(-20)));
   }, [styleVault]);

   // Smart style picker: random from pool, avoiding recently used styles
   const pickSmartStyle = (pool: string[]): string => {
      // Filter out recently used styles (last 5 uses per product type)
      const available = pool.filter(s => !styleVault.slice(-5).includes(s));
      // If all filtered out, use full pool
      const finalPool = available.length > 0 ? available : pool;
      return finalPool[Math.floor(Math.random() * finalPool.length)];
   };

   // Auto-select Video Style based on Product Type (Affiliate Optimized - Smart Rotation)
   React.useEffect(() => {
      const pool = VIDEO_STYLE_POOLS[productType] || VIDEO_STYLE_POOLS['auto'];
      const selected = pickSmartStyle(pool);
      setVideoStyle(selected as any);
      
      // Track used style
      setStyleVault(prev => [...prev.slice(-19), selected]);

      // Special: Áo Dài always sets location
      if (productType === 'aodai') {
         setLocationRegion('for_aodai');
      }
   }, [productType]);

   // Location Vault State - now stores detailed location history
   const [locationVault, setLocationVault] = useState<{
      id: string;
      location: string;
      region: string;
      timestamp: number;
      productType?: string;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('cinematic_location_vault_v2');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Script Vault State - stores script hooks to avoid repetition
   const [scriptVault, setScriptVault] = useState<{
      id: string;
      hook: string; // Scene 1 script (the unique opener)
      productType: string;
      timestamp: number;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('tiktok_script_vault');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Persist Location Vault
   useEffect(() => {
      localStorage.setItem('cinematic_location_vault_v2', JSON.stringify(locationVault));
   }, [locationVault]);

   // Persist Script Vault
   useEffect(() => {
      localStorage.setItem('tiktok_script_vault', JSON.stringify(scriptVault));
   }, [scriptVault]);

   // Add script hook to vault
   const addToScriptVault = (hook: string, productType: string) => {
      const newEntry = {
         id: Date.now().toString(),
         hook: hook.trim(),
         productType,
         timestamp: Date.now()
      };
      setScriptVault(prev => [newEntry, ...prev].slice(0, 30)); // Keep last 30 hooks
   };

   // Clear script vault
   const clearScriptVault = () => {
      if (confirm("Xóa lịch sử script? AI có thể tạo script tương tự.")) {
         setScriptVault([]);
         localStorage.removeItem('tiktok_script_vault');
      }
   };

   // Get script hooks blocklist
   const getScriptBlocklist = () => {
      return scriptVault.map(item => item.hook);
   };

   // Studio Category preference (for Studio Mode)
   const [studioCategory, setStudioCategory] = useState<string>('auto');

   // Studio Vault State - stores used studios to avoid repetition
   const [studioVault, setStudioVault] = useState<{
      id: string;
      studio: string;
      category: string;
      timestamp: number;
      productType?: string;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('studio_vault');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Persist Studio Vault
   useEffect(() => {
      localStorage.setItem('studio_vault', JSON.stringify(studioVault));
   }, [studioVault]);

   // Add studio to vault
   const addToStudioVault = (studio: string, category: string, productType?: string) => {
      const newEntry = {
         id: Date.now().toString(),
         studio: studio.trim().slice(0, 100), // Store only first 100 chars for comparison
         category,
         timestamp: Date.now(),
         productType
      };
      setStudioVault(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
   };

   // Get studio blocklist
   const getStudioBlocklist = () => {
      return studioVault.map(item => item.studio);
   };

   // Get random studios from category (excluding used ones and filtering by color contrast)
   const getRandomStudios = (category: string, count: number = 5, productColorInput?: string) => {
      const usedStudios = getStudioBlocklist();

      if (category === 'auto') {
         // Collect studios from all categories
         const allStudios: string[] = [];
         STUDIO_CATEGORIES.forEach(cat => {
            if (cat.value !== 'auto' && cat.studios) {
               allStudios.push(...cat.studios);
            }
         });

         // Filter used studios
         let available = allStudios.filter(studio => {
            const studioShort = studio.split(' | ')[0].toLowerCase();
            return !usedStudios.some(used =>
               used.toLowerCase().includes(studioShort) ||
               studioShort.includes(used.toLowerCase().slice(0, 30))
            );
         });

         // Apply color contrast filter if product color is provided
         if (productColorInput) {
            available = filterStudiosByColorContrast(available, productColorInput);
         }

         // Fisher-Yates shuffle
         const shuffled = [...available];
         for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
         }
         return shuffled.slice(0, count);
      }

      // For specific category
      const categoryData = STUDIO_CATEGORIES.find(c => c.value === category);
      if (!categoryData || !categoryData.studios) return [];

      let available = categoryData.studios.filter(studio => {
         const studioShort = studio.split(' | ')[0].toLowerCase();
         return !usedStudios.some(used =>
            used.toLowerCase().includes(studioShort) ||
            studioShort.includes(used.toLowerCase().slice(0, 30))
         );
      });

      // Apply color contrast filter if product color is provided
      if (productColorInput) {
         available = filterStudiosByColorContrast(available, productColorInput);
      }

      // Fisher-Yates shuffle
      const shuffled = [...available];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
   };

   // Clear studio vault
   const clearStudioVault = () => {
      if (confirm("Xóa lịch sử studio? AI có thể tái sử dụng các studio cũ.")) {
         setStudioVault([]);
         localStorage.removeItem('studio_vault');
      }
   };

   // ================================================
   // 🎯 POSE DIRECTION VAULT (Video Mode Only)
   // ================================================
   // Tracks used camera angles to avoid pose direction repetition
   type PoseDirection = 'front' | 'back' | '3/4-front-left' | '3/4-front-right' | '3/4-back-left' | '3/4-back-right' | 'side-left' | 'side-right';

   const [poseDirectionVault, setPoseDirectionVault] = useState<{
      id: string;
      direction: PoseDirection;
      keyframeIndex: number;
      productType?: string;
      timestamp: number;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('pose_direction_vault');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Persist Pose Direction Vault
   useEffect(() => {
      localStorage.setItem('pose_direction_vault', JSON.stringify(poseDirectionVault));
   }, [poseDirectionVault]);

   // Add pose direction to vault
   const addToPoseVault = (direction: PoseDirection, keyframeIndex: number, productType?: string) => {
      const newEntry = {
         id: Date.now().toString(),
         direction,
         keyframeIndex,
         timestamp: Date.now(),
         productType
      };
      setPoseDirectionVault(prev => [newEntry, ...prev].slice(0, 30)); // Keep last 30
   };

   // Clear pose direction vault
   const clearPoseVault = () => {
      if (confirm("Xóa lịch sử hướng pose? AI có thể tái sử dụng các góc camera cũ.")) {
         setPoseDirectionVault([]);
         localStorage.removeItem('pose_direction_vault');
      }
   };

   // Get pose direction blocklist (for AI prompt)
   const getPoseBlocklist = (): string[] => {
      return poseDirectionVault.map(item => item.direction);
   };

   // Get unique used directions for display
   const getUsedPoseDirections = (): PoseDirection[] => {
      return [...new Set(poseDirectionVault.map(item => item.direction))] as PoseDirection[];
   };


   // ================================================

   // 🎨 STUDIO COLOR CONTRAST VALIDATION
   // ================================================
   const WARM_COLORS = ['red', 'đỏ', 'pink', 'hồng', 'orange', 'cam', 'yellow', 'vàng', 'coral', 'rose', 'gold', 'burgundy', 'magenta', 'salmon', 'peach'];
   const COOL_COLORS = ['blue', 'xanh dương', 'green', 'xanh lá', 'purple', 'tím', 'teal', 'navy', 'sage', 'mint', 'lavender', 'cyan', 'turquoise', 'emerald', 'olive'];
   const NEUTRAL_COLORS = ['black', 'đen', 'white', 'trắng', 'gray', 'xám', 'cream', 'beige', 'ivory', 'brown', 'nâu', 'taupe', 'charcoal'];

   // Filter studios by color contrast with product
   const filterStudiosByColorContrast = (studios: string[], productColor: string): string[] => {
      if (!productColor || productColor === 'auto') return studios;

      const colorLower = productColor.toLowerCase();
      const isProductWarm = WARM_COLORS.some(c => colorLower.includes(c));
      const isProductCool = COOL_COLORS.some(c => colorLower.includes(c));
      const isProductBlack = colorLower.includes('black') || colorLower.includes('đen');
      const isProductWhite = colorLower.includes('white') || colorLower.includes('trắng');

      return studios.filter(studio => {
         const studioLower = studio.toLowerCase();

         // If product is WARM, reject studios with dominant WARM backdrop
         if (isProductWarm) {
            const hasWarmBackdrop = WARM_COLORS.some(c =>
               studioLower.includes(`backdrop ${c}`) ||
               studioLower.includes(`${c} backdrop`) ||
               studioLower.includes(`${c} gradient`) ||
               studioLower.includes(`deep ${c}`) ||
               (studioLower.includes(c) && studioLower.indexOf(c) < 50) // Color in studio name
            );
            if (hasWarmBackdrop) return false;
         }

         // If product is COOL, reject studios with dominant COOL backdrop
         if (isProductCool) {
            const hasCoolBackdrop = COOL_COLORS.some(c =>
               studioLower.includes(`backdrop ${c}`) ||
               studioLower.includes(`${c} backdrop`) ||
               studioLower.includes(`${c} gradient`) ||
               studioLower.includes(`deep ${c}`)
            );
            if (hasCoolBackdrop) return false;
         }

         // If product is BLACK, reject dark backdrops
         if (isProductBlack) {
            if (studioLower.includes('charcoal') || studioLower.includes('dark') || studioLower.includes('black backdrop')) {
               return false;
            }
         }

         // If product is WHITE, reject pure white backdrops
         if (isProductWhite) {
            if (studioLower.includes('pure white') || studioLower.includes('white infinity') || studioLower.includes('white cyclorama')) {
               return false;
            }
         }

         return true;
      });
   };

   // Color contrast rules for AI prompt injection (optimized)
   const COLOR_CONTRAST_STUDIO_RULES = `
🎨 BACKDROP COLOR CONTRAST (MANDATORY):
Product WARM (red/pink/orange/yellow) → Backdrop COOL/NEUTRAL (grey/cream/blue)
Product COOL (blue/purple/green) → Backdrop WARM/NEUTRAL (beige/cream/yellow)
Product DARK (black/navy) → Backdrop LIGHT (white/cream/pastel)
Product LIGHT (white/cream) → Backdrop with texture/color (grey/color)
→ Ensure product POPS from background for max affiliate conversion`;


   // Add new location to vault
   const addToLocationVault = (location: string, region: string, productType?: string) => {
      const newEntry = {
         id: Date.now().toString(),
         location: location.trim(),
         region,
         timestamp: Date.now(),
         productType
      };
      setLocationVault(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
   };

   // Remove specific location from vault
   const removeFromVault = (id: string) => {
      setLocationVault(prev => prev.filter(item => item.id !== id));
   };

   const clearLocationVault = () => {
      if (confirm("Xóa toàn bộ lịch sử bối cảnh? AI có thể tái sử dụng các bối cảnh cũ.")) {
         setLocationVault([]);
         localStorage.removeItem('cinematic_location_vault_v2');
      }
   };

   // Get unique locations as blocklist
   const getLocationBlocklist = () => {
      return locationVault.map(item => item.location);
   };

   // Get suggested locations based on region (excluding used ones) - RANDOM selection
   const getSuggestedLocations = (region: string, count: number = 10) => {
      const regionData = LOCATION_REGIONS.find(r => r.value === region);
      if (!regionData || region === 'auto') return [];

      const usedLocations = getLocationBlocklist();
      const availableLocations = regionData.locations.filter(loc =>
         !usedLocations.some(used =>
            used.toLowerCase().includes(loc.toLowerCase().slice(0, 20)) ||
            loc.toLowerCase().includes(used.toLowerCase().slice(0, 20))
         )
      );

      // Shuffle array randomly using Fisher-Yates algorithm
      const shuffled = [...availableLocations];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled.slice(0, count);
   };

   // Get random locations from multiple regions for AI Auto mode
   const getRandomLocationsForAuto = (count: number = 5) => {
      const allLocations: string[] = [];
      const usedLocations = getLocationBlocklist();

      // Collect all locations from all regions
      LOCATION_REGIONS.forEach(region => {
         if (region.value !== 'auto' && region.locations) {
            const available = region.locations.filter(loc =>
               !usedLocations.some(used =>
                  used.toLowerCase().includes(loc.toLowerCase().slice(0, 20)) ||
                  loc.toLowerCase().includes(used.toLowerCase().slice(0, 20))
               )
            );
            allLocations.push(...available);
         }
      });

      // Shuffle and return random selection
      const shuffled = [...allLocations];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled.slice(0, count);
   };

   // Processing State
   const [directorThinking, setDirectorThinking] = useState(false);
   const [videoRefining, setVideoRefining] = useState(false);
   const [directorOutput, setDirectorOutput] = useState<{
      fullText: string;
      sections: {
         master: string;
         keyframes: string;
         scenes: string;
         production: string;
         metadata: string;
         refinedScenes?: string;
      };
      jsonData?: any;
   } | null>(null);

   const fileInputFaceRef = useRef<HTMLInputElement>(null);
   const fileInputOutfitRef = useRef<HTMLInputElement>(null);
   const outputSectionRef = useRef<HTMLDivElement>(null);

   // --- Handlers ---

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setter(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const applyTemplate = (template: typeof BODY_TEMPLATES[0]) => {
      setGender(template.gender);
      setBodyMode(template.mode);
      setBodyType(template.bodyType);
      setMeasurements(template.measurements);
   };

   const parseDirectorOutput = (text: string) => {
      // ================================================
      // TRY JSON FORMAT FIRST (Nano Banana Pro / Veo 3.1 optimized)
      // ================================================
      try {
         // Extract JSON from response (may be wrapped in ```json ... ```)
         let jsonText = text;
         const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
         if (jsonMatch) {
            jsonText = jsonMatch[1];
         } else {
            // Try to find raw JSON object
            const rawJsonMatch = text.match(/\{[\s\S]*"masterPrompt"[\s\S]*\}/);
            if (rawJsonMatch) {
               jsonText = rawJsonMatch[0];
            }
         }

         const jsonData = JSON.parse(jsonText);

         // Support both video mode (keyframes) and lookbook mode (images only)
         if (jsonData.masterPrompt && (jsonData.keyframes || jsonData.images)) {
            // Successfully parsed JSON - convert to display format

            // Build Master Prompt string from JSON
            const mp = jsonData.masterPrompt;
            const masterContent = [
               ...(displayType === 'product_focus'
                  ? [
                     mp.subject || 'Product displayed on a professional mannequin torso, no human face visible'
                  ]
                  : [
                     // CRITICAL: Face preservation MUST be first
                     mp.facePreservation || "Exact facial features of the reference image, mirroring the subject's unique facial structure, eye shape, nose bridge, lip contour, and skin tone with photorealistic fidelity",
                     mp.subject
                  ]),
               mp.outfit,
               mp.pose,
               `Shot on location at ${mp.environment}`,
               mp.lighting,
               mp.camera,
               mp.style
            ].filter(Boolean).join('. ');

            // Build Keyframes string from JSON array (support both 'keyframes' and 'images')
            const keyframesArray = jsonData.keyframes || jsonData.images || [];
            const keyframesContent = keyframesArray.map((kf: any, index: number) => {
               // Defensive: handle missing fields gracefully
               const id = kf.id || (index + 1);
               const timestamp = kf.timestamp || `${index * 8}s`;

               // PRIORITY 1: Check if AI returned full prompt in single field (most common for lookbook)
               const fullPrompt = kf.imagePrompt || kf.prompt || kf.description;
               if (fullPrompt) {
                  return `Image ${id} (${timestamp}): ${fullPrompt}`;
               }

               // PRIORITY 2: Structured fields - display each field on labeled lines for clarity
               const subject = kf.subject || '';
               const action = kf.action || '';
               const environment = kf.environment || '';
               const backgroundPrompt = kf.backgroundPrompt || '';
               const lighting = kf.lighting || '';
               const camera = kf.camera || '';
               const style = kf.style || '';

               // PRIORITY 3: Fallback if no data
               if (!subject && !action && !environment && !camera) {
                  return `Image ${id} (${timestamp}): [Data missing - check Full Output]`;
               }

               // Build structured display with clear labels
               const lines = [`Image ${id} (${timestamp}):`];
               if (subject) lines.push(`  SUBJECT: ${subject}`);
               if (action) lines.push(`  ACTION: ${action}`);
               if (environment) lines.push(`  LOCATION: ${environment}`);
               else lines.push(`  ⚠️ LOCATION: [MISSING - should specify exact position in scene]`);
               if (camera) lines.push(`  CAMERA: ${camera}`);
               else lines.push(`  ⚠️ CAMERA: [MISSING - should specify angle + lens]`);
               if (lighting) lines.push(`  LIGHTING: ${lighting}`);
               if (backgroundPrompt) lines.push(`  BG_PROMPT: ${backgroundPrompt}`);
               if (style) lines.push(`  STYLE: ${style}`);

               return lines.join('\n');
            }).join('\n\n');

            // Build Scenes string from JSON array
            const scenesContent = jsonData.scenes ? jsonData.scenes.map((sc: any) => {
               // PRIORITY 1: Simplified format with single prompt field
               if (sc.prompt) {
                  let sceneText = `Scene ${sc.id} (${sc.timeRange}): ${sc.prompt}`;
                  if (sc.startPose) sceneText += `\nSTART_POSE: ${sc.startPose}`;
                  if (sc.endPose) sceneText += `\nEND_POSE: ${sc.endPose}`;
                  if (sc.script) sceneText += `\nSCRIPT: "${sc.script}"`;
                  if (sc.voiceConfig) {
                     if (sc.voiceConfig.voice_profile) {
                        sceneText += `\nVOICE: ${sc.voiceConfig.voice_profile} | Tone: ${sc.voiceConfig.vocal_tone || 'natural'}${sc.voiceConfig.dialogue_style ? ` | Style: ${sc.voiceConfig.dialogue_style}` : ''} | Sync: ${sc.voiceConfig.sync || 'voiceover'}`;
                     }
                  } else {
                     sceneText += `\n⚠️ VOICE: [MISSING - voiceConfig should be present for ALL scenes]`;
                  }
                  return sceneText;
               }

               // PRIORITY 2: Legacy format with separate fields
               let sceneText = `Scene ${sc.id} (${sc.timeRange}):`;
               if (sc.shotType) sceneText += ` ${sc.shotType}.`;
               if (sc.subjectMotion) sceneText += ` ${sc.subjectMotion}.`;
               if (sc.cameraMotion) sceneText += ` Camera: ${sc.cameraMotion}.`;
               if (sc.atmosphere) sceneText += ` Atmosphere: ${sc.atmosphere}.`;
               if (sc.startPose) sceneText += `\nSTART_POSE: ${sc.startPose}`;
               if (sc.endPose) sceneText += `\nEND_POSE: ${sc.endPose}`;
               if (sc.script) {
                  sceneText += `\nSCRIPT: "${sc.script}"`;
               }
               if (sc.voiceConfig) {
                  // Support new Veo 3.1 voice anchor format + legacy fallbacks
                  if (sc.voiceConfig.voice_profile) {
                     sceneText += `\nVOICE: ${sc.voiceConfig.voice_profile} | Tone: ${sc.voiceConfig.vocal_tone || 'natural'}${sc.voiceConfig.dialogue_style ? ` | Style: ${sc.voiceConfig.dialogue_style}` : ''} | Sync: ${sc.voiceConfig.sync || 'voiceover'}`;
                  } else if (sc.voiceConfig.voice) {
                     // Legacy format fallback
                     sceneText += `\nVOICE: ${sc.voiceConfig.voice}${sc.voiceConfig.accent ? ` | Accent: ${sc.voiceConfig.accent}` : ''} | Speed: ${sc.voiceConfig.speed} | Pitch: ${sc.voiceConfig.pitch}`;
                  }
               } else {
                  sceneText += `\n⚠️ VOICE: [MISSING - voiceConfig required for ALL scenes, not just Scene 1]`;
               }
               return sceneText;
            }).join('\n\n') : '';

            // Build Metadata string
            const meta = jsonData.metadata || {};
            const metadataContent = [
               meta.location ? `Specific Location: ${meta.location}` : '',
               meta.duration ? `Duration: ${meta.duration}s` : '',
               meta.aspectRatio ? `Aspect Ratio: ${meta.aspectRatio}` : '',
               meta.productType ? `Product Type: ${meta.productType}` : '',
               meta.musicVibe ? `Music Vibe: ${meta.musicVibe}` : ''
            ].filter(Boolean).join('\n');

            console.log(`✅ JSON format parsed successfully (${jsonData.images ? 'Lookbook Mode' : 'Video Mode'} - Nano Banana Pro / Veo 3.1 optimized)`);

            return {
               master: masterContent,
               keyframes: keyframesContent,
               scenes: scenesContent,
               production: '',
               metadata: metadataContent,
               refinedScenes: '', // Will be populated by Phase 2
               jsonData: jsonData // Keep original JSON for advanced usage
            };
         }
      } catch (e) {
         // JSON parsing failed, fall back to text parsing
         console.log('ℹ️ JSON parsing failed, using text format parser');
      }

      // ================================================
      // FALLBACK: TEXT FORMAT PARSING (Legacy support)
      // ================================================
      // Robust parsing based on sections - support multiple formats
      // Try SECTION X: format first
      let masterMatch = text.match(/SECTION 1:[\s\S]*?(?=SECTION 2:|Image 1|SCENE 1|$)/i);
      let keyframesMatch = text.match(/SECTION 2:[\s\S]*?(?=SECTION 3:|SCENE 1|$)/i);
      let scenesMatch = text.match(/SECTION 3:[\s\S]*?(?=SECTION 4:|SECTION 5:|PRODUCTION|$)/i);
      let productionMatch = text.match(/SECTION 4:[\s\S]*?(?=SECTION 5:|METADATA|$)/i);
      let metadataMatch = text.match(/SECTION 5:[\s\S]*$/i) || text.match(/SECTION 4:\s*METADATA[\s\S]*$/i);

      // If SECTION format not found, try alternative formats
      if (!masterMatch) {
         masterMatch = text.match(/(?:MASTER PROMPT|COMMON MASTER PROMPT)[:\s]*[\s\S]*?(?=KEYFRAME|IMAGE 1|SCENE 1|$)/i);
      }
      if (!keyframesMatch) {
         // Try Image 1, Image 2... format (common in TikTok Shop mode)
         keyframesMatch = text.match(/(?:KEYFRAME PROMPTS?|IMAGE SEQUENCE)[:\s]*[\s\S]*?(?=SCENE|VEO|$)/i);
         if (!keyframesMatch) {
            // Try to find Image 1 through Image 5 directly
            const imageMatch = text.match(/Image 1[\s\S]*?(?=SCENE 1|\*\*\*VOICE|$)/i);
            if (imageMatch) keyframesMatch = imageMatch;
         }
      }
      if (!scenesMatch) {
         // Try SCENE 1, SCENE 2... format (TikTok Shop mode)
         scenesMatch = text.match(/(?:SCENE PROMPTS?|VEO SCENE|SCENES? & SCRIPT)[:\s]*[\s\S]*?(?=PRODUCTION|METADATA|SECTION 4|$)/i);
         if (!scenesMatch) {
            // Try to find SCENE 1 through SCENE 4 directly
            const sceneMatch = text.match(/(?:\*\*\*VOICE SETTING|\bSCENE 1\b)[\s\S]*?(?=SECTION 4:|PRODUCTION|METADATA|$)/i);
            if (sceneMatch) scenesMatch = sceneMatch;
         }
      }
      if (!productionMatch) {
         productionMatch = text.match(/(?:PRODUCTION NOTES?|SECTION 4:\s*PRODUCTION)[:\s]*[\s\S]*?(?=METADATA|SECTION 5|$)/i);
      }
      if (!metadataMatch) {
         metadataMatch = text.match(/(?:METADATA|Specific Location:)[:\s]*[\s\S]*$/i);
      }

      const cleanSection = (raw: string, sectionHeaderRegex: RegExp) => {
         if (!raw) return "";
         // Remove the main section header (e.g. "SECTION 1: ...")
         let content = raw.replace(sectionHeaderRegex, '').trim();

         // Remove common redundant sub-headers that models sometimes add
         const redundantHeaders = [
            /^SECTION \d+:?\s*[^\n]*\n?/i,
            /^Common Master Prompt:?\s*/i,
            /^Master Prompt:?\s*/i,
            /^Keyframe Prompts?:?\s*/i,
            /^Image Sequence:?\s*/i,
            /^Veo Scene Prompts?:?\s*/i,
            /^Scene Prompts?.*?:?\s*/i,
            /^Scenes? & Script.*?:?\s*/i,
            /^Production Notes?:?\s*/i,
            /^Prompts?:?\s*/i,
            /^Output:?\s*/i,
            /^\*+[^\n]*\*+\s*/i,
            /^---+\s*/i,
         ];

         for (const regex of redundantHeaders) {
            content = content.replace(regex, '');
         }
         return content.trim();
      };

      // If still no master prompt found, try to extract first substantial paragraph
      let masterContent = masterMatch ? cleanSection(masterMatch[0], /SECTION 1:.*?\n?|MASTER PROMPT:?\s*|COMMON MASTER PROMPT:?\s*/i) : "";
      if (!masterContent && displayType !== 'product_focus' && text.includes("Exact facial features")) {
         const exactMatch = text.match(/Exact facial features[\s\S]*?(?=\n\n|Image 1|SCENE 1|$)/i);
         if (exactMatch) masterContent = exactMatch[0].trim();
      }

      // Extract keyframes - handle both Image X format and SECTION 2 format
      let keyframesContent = "";
      if (keyframesMatch) {
         keyframesContent = cleanSection(keyframesMatch[0], /SECTION 2:.*?\n?|KEYFRAME PROMPTS?:?\s*|IMAGE SEQUENCE:?\s*/i);
      }
      if (!keyframesContent || keyframesContent === "Keyframes unavailable") {
         // Try to extract Image 1, Image 2... directly from text
         const allImages = text.match(/Image \d+\s*\([^)]+\):[\s\S]*?(?=Image \d+|SCENE 1|\*\*\*VOICE|SECTION|$)/gi);
         if (allImages && allImages.length > 0) {
            keyframesContent = allImages.join('\n\n');
         }
      }

      // Extract scenes - handle SCENE 1, SCENE 2... format
      let scenesContent = "";
      if (scenesMatch) {
         scenesContent = cleanSection(scenesMatch[0], /SECTION 3:.*?\n?|SCENE PROMPTS?.*?:?\s*|VEO SCENE.*?:?\s*/i);
      }
      if (!scenesContent || scenesContent === "Scenes unavailable") {
         // Try to extract SCENE 1, SCENE 2... directly
         const allScenes = text.match(/SCENE \d+\s*\([^)]+\)[\s\S]*?(?=SCENE \d+\s*\(|SECTION 4|PRODUCTION|METADATA|$)/gi);
         if (allScenes && allScenes.length > 0) {
            scenesContent = allScenes.join('\n\n');
         }
      }

      return {
         master: masterContent || "Master prompt unavailable - AI may have used different format. Check full output.",
         keyframes: keyframesContent || "Keyframes unavailable",
         scenes: scenesContent || "Scenes unavailable",
         production: productionMatch ? cleanSection(productionMatch[0], /SECTION 4:.*?\n?|PRODUCTION NOTES?:?\s*/i) : "",
         metadata: metadataMatch ? cleanSection(metadataMatch[0], /SECTION 5:.*?\n?|METADATA:?\s*/i) : "",
         refinedScenes: '' // Will be populated by Phase 2
      };
   };

   // Improved parser for Keyframes and Scenes to handle individual copying
   const parseSegments = (text: string, type: 'image' | 'scene') => {
      const segments: { title: string; content: string }[] = [];

      // Multiple regex patterns to match various AI output formats
      const patterns = type === 'image'
         ? [
            /(Image \d+[^:\n]*:)/gi,           // "Image 1 (00s):" or "Image 1:"
            /(\d+s\s*:)/gi,                     // "00s:" or "08s :"
            /(\(\d+s\)\s*:)/gi,                 // "(00s):" 
            /(Keyframe \d+[^:\n]*:)/gi,        // "Keyframe 1:"
         ]
         : [
            /(Scene \d+[^:\n]*:)/gi,           // "Scene 1 (00s-08s):"
            /(\d+s\s*-\s*\d+s\s*:)/gi,         // "00s-08s:"
            /(\(\d+s-\d+s\)\s*:)/gi,           // "(00s-08s):"
         ];

      let matches: { match: string; index: number }[] = [];

      // Try each pattern until we find matches
      for (const regex of patterns) {
         matches = [];
         let match;
         // Reset regex
         regex.lastIndex = 0;
         while ((match = regex.exec(text)) !== null) {
            matches.push({ match: match[0], index: match.index });
         }
         if (matches.length >= 2) break; // Found valid segments
      }

      // If still no matches, try line-by-line split for numbered format
      if (matches.length < 2) {
         const lines = text.split('\n').filter(line => line.trim());
         const lineMatches: { match: string; index: number; content: string }[] = [];

         for (const line of lines) {
            // Match patterns like "00s: content" or "1. (00s): content"
            const lineMatch = line.match(/^(\d+s|\d+\.\s*\(?\d+s\)?|Image \d+[^:]*)\s*:\s*(.+)$/i);
            if (lineMatch) {
               lineMatches.push({
                  match: lineMatch[1],
                  index: 0,
                  content: lineMatch[2].trim()
               });
            }
         }

         if (lineMatches.length >= 2) {
            return lineMatches.map((m, idx) => ({
               title: type === 'image' ? `Image ${idx + 1} (${m.match})` : `Scene ${idx + 1} (${m.match})`,
               content: m.content
            }));
         }
      }

      // If still no matches, return as single block
      if (matches.length === 0) {
         return [{ title: type === 'image' ? 'All Keyframes' : 'All Scenes', content: text.trim() }];
      }

      // Extract content between matches
      for (let i = 0; i < matches.length; i++) {
         const currentMatch = matches[i];
         const nextMatch = matches[i + 1];

         let title = currentMatch.match.replace(/:$/, '').trim();
         // Make title more readable
         if (/^\d+s$/.test(title)) {
            title = `Image ${i + 1} (${title})`;
         }

         const startIndex = currentMatch.index + currentMatch.match.length;
         const endIndex = nextMatch ? nextMatch.index : text.length;
         const content = text.slice(startIndex, endIndex).trim();

         if (title && content) {
            segments.push({ title, content });
         }
      }

      return segments.length > 0
         ? segments
         : [{ title: type === 'image' ? 'All Keyframes' : 'All Scenes', content: text.trim() }];
   };

   const getBase64AndMime = (dataUrl: string) => {
      const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
         return { mimeType: 'image/png', data: dataUrl.split(',')[1] || '' };
      }
      return { mimeType: matches[1], data: matches[2] };
   };

   // ================================================
   // 🎬 VIDEO REFINEMENT FUNCTION (PHASE 2)
   // ================================================
   // Đọc lại keyframe prompts và tạo scene prompts liền mạch hơn
   const refineVideoScenes = async (masterPrompt: string, keyframes: string, existingScenes: string, jsonData?: any) => {
      setVideoRefining(true);

      try {
         const ai = new GoogleGenAI({ apiKey });

         // Extract beatSync info from jsonData if available
         let beatSyncInfo = "";
         if (jsonData?.beatSync) {
            beatSyncInfo = `
BEAT SYNC INFO:
BPM: ${jsonData.beatSync.bpm || 128}
Pattern: ${jsonData.beatSync.beatPattern || 'remix-drop-pattern'}
Music Mood: ${jsonData.beatSync.musicMood || 'EDM-remix-high-energy'}
Drop Timestamps: ${jsonData.beatSync.dropTimestamps?.join(', ') || '12.0s, 24.0s'}
`;
         } else {
            // Default remix pattern
            beatSyncInfo = `
BEAT SYNC INFO:
BPM: 128 (default remix)
Pattern: remix-drop-pattern
Music Mood: EDM-remix-high-energy
Drop Timestamps: 12.0s, 16.0s, 24.0s, 28.0s (typical remix structure)
`;
         }

         // Product physics context for Phase 2 refinement
         const pt = productType.toLowerCase();
         const noFlowTypes = ['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'];
         const flowTypes = ['maxi_dress', 'skirt', 'wide_pants', 'aodai', 'dress', 'mini_dress'];
         const semiFlowTypes = ['blouse', 'set', 'jumpsuit'];
         let productPhysicsContext = '';
         if (noFlowTypes.includes(pt)) {
            productPhysicsContext = `\n\n⚠️ PRODUCT PHYSICS CONSTRAINT: "${pt}" = STRUCTURED FABRIC (NO-FLOW)
- ❌ KHÔNG DÙNG: "flowing", "flutter", "cascade", "billowing", "dramatic sway"
- ✅ CHỈ DÙNG: structured fit, minimal fabric movement, holds shape
- Khi mô tả FABRIC_PHYSICS trong mỗi scene → garment giữ nguyên form, không bay/flutter`;
         } else if (flowTypes.includes(pt)) {
            productPhysicsContext = `\n\n⚠️ PRODUCT PHYSICS CONSTRAINT: "${pt}" = FLOW FABRIC
- ✅ CÓ THỂ DÙNG: "flowing", "sway", "flutter", "fabric cascades"
- ❌ KHÔNG DÙNG: "rigid", "stiff", "no movement"
- Khi mô tả FABRIC_PHYSICS → fabric responds to movement, wind, and turns naturally`;
         } else if (semiFlowTypes.includes(pt)) {
            productPhysicsContext = `\n\n⚠️ PRODUCT PHYSICS CONSTRAINT: "${pt}" = SEMI-FLOW FABRIC
- ✅ CÓ THỂ: gentle sway, subtle movement, soft shift
- ❌ KHÔNG DÙNG: "dramatic flow", "billowing", NOR "completely rigid"
- Khi mô tả FABRIC_PHYSICS → moderate, natural movement`;
         }

         const refinementPrompt = `
PHASE 2: VIDEO REFINEMENT
=========================

Analyze the keyframe prompts below and create SEAMLESS, REFINED scene prompts for Veo 3.1.
${productPhysicsContext}

**YOUR TASK:**
1. Read the MASTER PROMPT for character/outfit/environment details
2. Analyze each KEYFRAME (frozen pose) 
3. Create REFINED SCENES that animate between keyframes with perfect continuity
4. Ensure CHARACTER, OUTFIT, and ENVIRONMENT are 100% consistent
5. Sync all motions to the BEAT pattern

---

MASTER PROMPT:
${masterPrompt}

---

KEYFRAMES (Static Images - Frozen Poses):
${keyframes}

---

EXISTING SCENES (for reference - IMPROVE these):
${existingScenes}

---

${beatSyncInfo}

---

**OUTPUT FORMAT:**
Create refined scene prompts that are MORE DETAILED and MORE SEAMLESS than the existing ones.

For each scene, output:

REFINED SCENE X (XXs-XXs):
CHARACTER: [Brief identifier - SAME in all scenes]
OUTFIT: [Exact outfit description - IDENTICAL in all scenes]
START_POSE: [EXACT match to previous keyframe end pose]
MOTION: [Detailed continuous motion with beat markers]
  - Beat 1 (XX.0s): [specific action - e.g., "sharp hip snap to right"]
  - Beat 3 (XX.5s): [specific action - e.g., "hair begins flowing left"]
  - Beat 5 (XX.0s): [specific action - e.g., "fabric catches air peak"]
  - Beat 7 (XX.5s): [specific action - e.g., "weight shifts to front foot"]
END_POSE: [EXACT position for next scene start]
CAMERA: [Movement + Pacing synced to music]
  - Movement: [e.g., "slow orbit then crash zoom on drop"]
  - Pacing: [e.g., "slow orbit (3s) → hold (2s) → quick push-in (1s) → steady (2s)"]
  - Focus: [e.g., "rack focus from background → product detail → face"]
ENVIRONMENT: [Location + AMBIENT MOTION - wind, light, background movement]
LIGHTING_DYNAMICS: [How light CHANGES during this 8s scene]
  - e.g., "Sun shifts through tree canopy, dappled light pattern moves across model"
  - e.g., "Walking from doorway shadow into direct sunlight, outfit color temperature shifts warm"
  - e.g., "Neon sign flicker casts alternating pink-blue on silk fabric"
PHYSICAL_INTERACTIONS: [Model ↔ environment contact]
  - e.g., "hand trails along iron railing, heel clicks on marble, leaves scatter from stride"
  - e.g., "wind catches skirt hem upward, model brushes hair behind ear"
AMBIENT_AUDIO: [Environmental sounds for Veo 3.1 native audio]
  - e.g., "soft heel clicks on marble, distant city traffic hum, gentle breeze through leaves"
  - e.g., "fabric rustling with each stride, birds chirping overhead, muffled cafe chatter"
FABRIC_PHYSICS: [How outfit behaves - silk flows, hem rises, etc.]
TRANSITION_TO_NEXT: [How this flows to next scene]

---

**CRITICAL RULES:**
1. CHARACTER must be IDENTICAL in every scene description
2. OUTFIT details must be EXACTLY THE SAME - no color/pattern drift
3. END_POSE of Scene N MUST equal START_POSE of Scene N+1
4. Every scene MUST have AMBIENT MOTION in environment
5. BEAT MARKERS must align with BPM and drop timestamps
6. Use: "smoothly," "fluidly," "gradually" - NOT "suddenly," "cuts to"
11. LIGHTING_DYNAMICS must describe how light CHANGES (shifting shadows, moving sun, flickering neon) — NOT static
12. AMBIENT_AUDIO must include 2-3 environmental sounds matching the location (heel clicks, fabric rustling, traffic hum, etc.)
13. PHYSICAL_INTERACTIONS must describe at least 1 model↔environment contact per scene (hand on railing, feet on ground, wind on fabric)
14. CAMERA Pacing must specify temporal breakdown of movement within the 8s scene
7. EVERY SCENE must START with "[Subject] in [COLOR] [GARMENT_TYPE]" — outfit anchor (Veo 3.1 generates each clip independently and will forget outfit if not repeated)
8. EVERY SCENE must INCLUDE "[SAME_LOCATION], [LIGHTING]" — environment anchor (prevents background drift)
9. EVERY SCENE must END with garment physics: how the fabric behaves during the motion described
10. ACCESSORIES (hat, bag, jewelry, sunglasses) must be mentioned in EVERY scene — they disappear if not reminded
15. VISIBILITY CONTINUITY: When scene N+1 reveals a detail hidden in scene N (e.g., model turns showing back), describe that detail in scene N's prompt: "red dress with V-neck front AND criss-cross back straps, model begins turning..." — prevents AI hallucinating unseen details
16. 360° OUTFIT ANCHOR: Every scene MUST include both VISIBLE and OCCLUDED outfit details — e.g., "fitted bodice (front visible), open back with thin straps (rear, revealed when turning)"
17. LIP-SYNC: When model faces camera + speaks → sync: "lip-sync", MAX 15 words/scene. When model's back is shown or product close-up → sync: "voiceover", no word limit. Each scene voiceConfig MUST specify sync type explicitly.

Now create the REFINED SCENES:
`;

         const response = await ai.models.generateContent({
            model: geminiModel,
            contents: { parts: [{ text: refinementPrompt }] },
            config: {
               systemInstruction: VIDEO_REFINEMENT_INSTRUCTION,
               safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
               ]
            }
         });

         const refinedText = response.text;

         if (refinedText) {
            console.log('✅ Video scenes refined successfully (Phase 2)');
            return refinedText;
         }

         return null;
      } catch (error) {
         console.error('❌ Video refinement failed:', error);
         return null;
      } finally {
         setVideoRefining(false);
      }
   };

   const runDirector = async () => {
      if (!outfitImage) {
         alert("Please upload outfit reference image. (Face reference is optional - will use default editorial style face if not provided)");
         return;
      }

      setStep('director');
      setDirectorThinking(true);
      setDirectorOutput(null);

      // Auto-scroll to output section so user can see the loading/results
      setTimeout(() => {
         outputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      try {
         const ai = new GoogleGenAI({ apiKey });

         let bodyDataString = "";
         if (bodyMode === 'preset') {
            bodyDataString = `Body Silhouette: ${bodyType} (use safe fashion vocabulary from BODY TYPE MAPPING - NO raw numbers in output)`;
         } else {
            // Translate raw measurements to safe vocabulary tiers for AI
            const h = parseInt(measurements.height) || 165;
            const b = parseInt(measurements.bust) || 86;
            const w = parseInt(measurements.waist) || 64;
            const hp = parseInt(measurements.hips) || 90;
            const upperTier = b >= 100 ? 'generous upper frame' : b >= 90 ? 'elegant upper silhouette' : 'refined feminine upper silhouette';
            const waistTier = w <= 65 ? 'tapered cinched midsection' : w <= 75 ? 'sculpted inward curvature' : 'softly sculpted midsection';
            const lowerTier = hp >= 105 ? 'graceful full lower silhouette' : hp >= 95 ? 'classic hourglass lower profile' : 'elegant lower-body curvature';
            const frameTier = h >= 175 ? 'tall statuesque frame' : h >= 165 ? 'moderate proportionate frame' : 'petite graceful frame';
            bodyDataString = `Body Silhouette (SAFE VOCABULARY ONLY - NO raw numbers/cm in output): ${frameTier}, ${upperTier}, ${waistTier}, ${lowerTier}`;
         }

         // User Additional Description for ALL MODES
         const userAdditionalDescText = additionalDescription ? `\n\n📝 USER CUSTOM REQUIREMENTS / YÊU CẦU TÙY CHỈNH TỪ NGƯỜI DÙNG:
"""${additionalDescription}"""
⚠️ AI PHẢI đọc kỹ và tích hợp các yêu cầu trên vào video/ảnh (nếu hợp lý và không vi phạm rules).
- Ưu tiên thực hiện theo yêu cầu người dùng nếu khả thi
- Nếu yêu cầu mâu thuẫn với rules an toàn → bỏ qua và dùng phiên bản safe
- Nếu yêu cầu về layering/styling → áp dụng cho TẤT CẢ scenes/images` : '';

         // For TikTok Shop, use product details instead of personal measurements
         const isAutoDetect = productType === 'auto';
         const isComboMode = productType === 'combo';
         const shopModelInfo = `\n\nPRODUCT INFO FOR VIETNAMESE SCRIPT (USE THESE DETAILS):
- Product Type: ${isAutoDetect ? '🤖 AUTO-DETECT (AI phân tích từ ảnh sản phẩm)' : isComboMode ? '🎀 COMBO/MIX (Nhiều món kết hợp)' : productType.toUpperCase()}
- Video Style: ${videoStyle.toUpperCase()}
- Fabric/Material: ${fabricMaterial || (isAutoDetect || isComboMode ? '🤖 AUTO-DETECT từ ảnh' : 'Analyze from image')}
- Key Highlights: ${productHighlights || (isAutoDetect || isComboMode ? '🤖 AUTO-DETECT từ ảnh' : 'Analyze from image')}
- Available Sizes: ${availableSizes}

${isAutoDetect ? `🤖 AUTO-DETECTION MODE ACTIVATED (NÂNG CAO):
AI PHẢI phân tích ẢNH SẢN PHẨM KỸ LƯỠNG và xác định:

📦 1. LOẠI SẢN PHẨM (Product Category):
   - Phân loại chính xác: Đầm (maxi/midi/mini/bodycon/A-line/wrap/slip) / Áo (sơ mi/thun/crop/hai dây/structured bodice) / Quần (dài/ống rộng/skinny/short) / Đặc biệt (áo dài/jumpsuit/swim set/loungewear)
   - Ghi cả tiếng Việt và EN term
   
   👙 NẾU PHÁT HIỆN LÀ FASHION FOUNDATIONS/DELICATE WEAR:
   → TỰ ĐỘNG ÁP DỤNG FASHION-SAFE VOCABULARY (xem section riêng)
   → PHẢI dùng từ: "Corsetry-style bodice", "Fitted bodice", "Vintage glamour coordinates", "Balletcore set"
   → Dùng: "intimate fashion coordinates", "lounge coordinates", "foundation garment"
   → Mô tả như buổi chụp catalog thời trang chuyên nghiệp

🧵 2. CHẤT LIỆU VẢI (Fabric Analysis):
   - Độ bóng: Bóng láng (satin/silk) / Bóng mờ (polyester) / Mờ (cotton/linen)
   - Độ dày: Rất mỏng xuyên sáng (chiffon) / Mỏng rủ (silk) / Trung bình (cotton) / Dày (denim/velvet)
   - Texture: Trơn / Ren lỗ / Nhăn tự nhiên / Gân ribbed / Hoa văn nổi
   - Co giãn: Cao (ôm sát body) / Trung bình / Không co giãn
   
   👙 NẾU LÀ FASHION FOUNDATIONS - CHẤT LIỆU ĐẶC BIỆT:
   - Ren: "Intricate Chantilly lace" / "Delicate eyelash lace" / "Guipure lace appliqué"
   - Satin: "Lustrous satin finish" / "High-sheen charmeuse"
   - Silk: "Mulberry silk draping" / "Liquid silk fabric"
   - Mesh: "Fine power mesh" / "Diaphanous tulle overlay"

📐 3. KÍCH CỠ & FIT:
   - Fit: Ôm sát (slim) / Ôm vừa (regular) / Rộng (relaxed) / Oversize
   - Chiều dài: Mini/Midi/Maxi (váy) | Cropped/Regular/Longline (áo)
   - Kiểu tay: Sleeveless/Short/3-4/Long/Puff/Bell

🎨 4. MÀU SẮC (Cụ thể):
   - KHÔNG dùng "đỏ" → Dùng "đỏ rượu vang/cherry/coral"
   - KHÔNG dùng "xanh" → Dùng "navy/cobalt/mint/emerald"
   - Ghi cả tone: Warm/Cool/Neutral

🔍 5. CHI TIẾT THIẾT KẾ:
   - Kiểu cổ: V-neck/Round/Square/Halter/Off-shoulder/Sweetheart
   - Chi tiết đặc biệt: Xẻ tà/Hở lưng/Cut-out/Bèo nhún/Nơ/Xếp ly

🔗 6. COMBO CHECK:
   - Có nhiều món đồ trong ảnh không?
   - Nếu có: Liệt kê item chính + item phụ + kiểu kết hợp

👙 7. FASHION FOUNDATIONS AUTO-APPLY (TỰ ĐỘNG ÁP DỤNG NẾU DETECT DELICATE WEAR):
   Khi phát hiện sản phẩm là: Soft top, Structured bodice, Bodysuit, Loungewear, Swimwear...
   
   ✅ TỰ ĐỘNG LÀM:
   - Dùng "Editorial fashion photograph for fashion coordinates catalog"
   - Dùng "Elegant confident pose", "Editorial pose"
   - Dùng "Professional studio lighting" / "Luxury setting"
   - Mô tả chất liệu chi tiết: Chantilly lace, charmeuse satin, mulberry silk, Swiss dot mesh
   - Script tiếng Việt: "Soft top ren tinh tế", "Set thời trang thanh lịch"
   - Dùng vocabulary: "couture fashion coordinates", "lounge coordinates", "fitted bodice"
   - Phong cách: professional catalog editorial photography

📝 GHI KẾT QUẢ VÀO METADATA SECTION theo format chuẩn.` : ''}

${isComboMode ? `🎀 COMBO/MIX MODE ACTIVATED (CHI TIẾT):
Ảnh sản phẩm có NHIỀU MÓN ĐỒ kết hợp. AI PHẢI:

📦 1. NHẬN DIỆN TẤT CẢ CÁC MÓN:
   - Item chính (outer/main): [Loại + Màu + Chất liệu]
   - Item phụ (inner/accessory): [Loại + Màu + Chất liệu]

🧵 2. PHÂN TÍCH TỪNG MÓN RIÊNG:
   - Mô tả chi tiết từng item (không gộp chung)
   - Xác định chất liệu riêng cho mỗi item

🔗 3. XÁC ĐỊNH KIỂU KẾT HỢP:
   - Layering: Mặc lớp ngoài + lớp trong
   - Lightweight overlay: Vải mỏng nhẹ phủ item bên trong
   - Matching set: Bộ đồng bộ thiết kế
   - Mix & Match: Phối đồ khác style

📝 4. SCRIPT PHẢI NHẮC ĐẾN TẤT CẢ:
   - Ví dụ: "Váy ren đi kèm soft top bên trong, an tâm không lo!"
   - Ví dụ: "Set này có áo crop và quần ống rộng, mua về là mặc liền!"

Các kiểu combo phổ biến:
- 👗 Váy/Đầm lightweight overlay + Inner (soft top/slip) bên trong
- 🧥 Áo khoác/Blazer + Áo trong (croptop/structured bodice)
- 🌙 Loungewear silk + Coordinating set matching
- 👙 Swim set + Kimono/Cover-up phủ ngoài
- 👚 Áo sơ mi cài hở + Soft layering top bên trong
- 👖 Set quần + áo đồng bộ (co-ord set)` : ''}

⚠️ IMPORTANT: This is AI-generated video. DO NOT say "Mình cao X nặng Y" - instead describe the PRODUCT and how it looks on the MODEL's body type.`;

         // 🎬 VIDEO STYLE CHOREOGRAPHY — Detailed style-specific instructions for AI
         const getVideoStyleChoreography = (): string => {
            const styleMap: Record<string, string> = {
               // Fashion basics
               body_real: '💪 BODY REAL: Model mặc thử + xoay 360° | Scene flow: Outfit reveal → Front pose → Spin showcase → Detail close-up | Camera: Medium tracking, low angle power shot | Must show: Fit on body, fabric movement, full silhouette',
               before_after: '✨ BEFORE-AFTER: Cầm đồ → Mặc vào → Wow | Scene flow: Holding product → Quick transition → Full outfit styled | Camera: Static → jump cut → tracking | Hook: "Wait for it..."',
               before_after_fashion_show: '👗 BEFORE-AFTER FASHION SHOW: Biến hình + Catwalk | Scene flow: Casual look → transition → runway walk | Camera: Static → slow-mo → tracking | NO voice, pure visual | Beat-sync: Pose snap on drops, walk on beats, reveal on bass drop | Text: Hook "Wait..." → Feature → CTA',
               mirror_ootd: '🪞 MIRROR OOTD: Phone selfie mirror style | Scene flow: Walk to mirror → Show outfit → Pose → Detail | Camera: Simulated phone-held, mirror reflection | Voice: Commentary on outfit',
               fit_check: '✅ FIT CHECK: Quick outfit beats | Scene flow: Front snap → Side → Back → Full | Camera: Quick cuts on beat drop, minimum 4 angle changes/scene | NO voice, music-synced, trending beat | Beat-sync: Every pose = 1 beat, transition = beat drop | Text overlay: Size/fit info per scene | Motion: Snap poses, confident energy, continuous movement',
               grwm: '💅 GRWM: Getting ready narrative | Scene flow: Base → Makeup/Hair → Outfit selection → Full look reveal | Camera: Close-up → medium → full body | Voice: Storytelling, casual',
               try_on_haul: '🛍️ TRY-ON HAUL: Multi-piece showcase | Scene flow: Unpack → Try each piece → Rate/Review → Best pick | Camera: Mix close-up + full body | Voice: Honest review commentary',
               ootd_novoice: '📸 OOTD PURE: Clean outfit showcase | Scene flow: Full look → Movement → Detail → Pose | Camera: Cinematic, clean cuts, ≥4 angle changes/scene | NO voice/script | Beat-sync: All movement on beat (walk=beat, pose snap=drop, spin=bar change) | Text overlays: Hook text scene 1, feature text mid, CTA text final | Motion: Walk-in → confident pose → spin reveal → detail zoom → hair toss → final pose | Ambient: Trending music 80% + fabric sounds + heels/footsteps | Energy: Professional TikToker — mỗi 2s đổi angle/pose',
               ootd_grwm: '👗 OOTD+GRWM: Lifestyle getting ready | Scene flow: Morning routine → Outfit pick → Get dressed → Final reveal + exit | Camera: Lifestyle vlog | Voice: Day story',
               personal_branding: '⭐ PERSONAL BRANDING: Day in life + style | Scene flow: Morning → Work/Activity → Style moment → Signature pose | Camera: Vlog + cinematic | Voice: Brand story',
               style_challenge: '🎯 STYLE CHALLENGE: Themed outfit series | Scene flow: Challenge reveal → Attempt → Showcase → Rate | Camera: Dynamic, split possible | Voice: Engaging commentary',
               outfit_change_viral: '🔄 OUTFIT CHANGE: Beat-synced changes | Scene flow: Pose → Kick/Jump/Spin → New outfit → Repeat | Camera: Static, quick cuts EXACTLY on beat | NO voice, trending music MUST | Beat-sync: Outfit change = bass drop, pose = beat, transition = bar | Text: Hook "X outfit trong Xs" scene 1, CTA scene cuối | Motion: Snap/kick trigger → instant change → confident pose → repeat | Each outfit ≤ 2s screen time',
               // Viral 2026
               cinematic_hook_reveal: '🎬 CINEMATIC REVEAL: Mystery → Reveal | Scene flow: Silhouette/blur → Build curiosity → Beat drop → Full stunning reveal | Camera: Slow push-in → pull-back reveal | Hook: Maximum curiosity in 2s',
               aesthetic_grwm: '✨ AESTHETIC GRWM: Soft girl prep | Scene flow: Soft wake up → Skincare → Makeup → Outfit → Mirror check | Camera: Warm tones, dreamy | Voice: Soft, ASMR-adjacent',
               outfit_challenge: '🔥 OUTFIT CHALLENGE: Style comparison | Scene flow: Challenge prompt → Option A → Option B → Option C → Vote/Pick | Camera: Clean cuts, comparison frames | Hook: "3 ways to style..."',
               reaction_reveal: '😱 REACTION REVEAL: Social proof | Scene flow: Unbox/Get dressed → Show to friend/family → Capture reaction → Confidence | Camera: Split/POV | Hook: Genuine surprise reaction',
               coquette_aesthetic: '🎀 COQUETTE: Soft girl energy | Scene flow: Pastel setup → Bow ribbon details → Soft pose → Romantic finish | Camera: Warm soft filter, close-up details | Vibe: Bows, pastels, feminine',
               office_siren: '💼 OFFICE SIREN: Work→Party transform | Scene flow: Morning office look → "5pm hits" → Transformation → Night look | Camera: Split/transition | Hook: "9-5 me vs 6pm me"',
               quiet_luxury: '🤍 QUIET LUXURY: No-logo premium | Scene flow: Detail textures → Slow reveal → Editorial poses → Lifestyle | Camera: Slow, deliberate, minimal | Vibe: Whisper luxury, quality fabric focus',
               trend_mashup: '🔀 TREND MASHUP: Multi-trend combo | Scene flow: Trend 1 element → Trend 2 overlay → Combined result → Street test | Camera: Fast cuts + slow-mo mix | Hook: "Mixing every trend..."',
               // New 2026 mid-year
               pov_storytelling: '📖 POV: First-person narrative | Scene flow: "POV: bạn là..." text → Immersive product experience → Emotional payoff → CTA | Camera: POV angles, first-person | Hook: Strong POV text',
               split_screen_compare: '📱 SPLIT SCREEN: Visual proof | Scene flow: Before/After side by side OR 2 products compared → Winner reveal | Camera: Fixed split | Hook: "Cái nào TỐT hơn?"',
               asmr_unbox: '🎧 ASMR UNBOX: Satisfying unbox | Scene flow: Package close-up → Slow open → Texture sounds → Product reveal | Camera: Macro close-ups | NO voice, ASMR sounds only | Beat-sync: Gentle — slow cuts on soft beats | Audio: Packaging crinkle 90%, tape peel, fabric unfold, product placement sounds | Text: Product name + price scene 1, quality callout mid, CTA final | Motion: Slow deliberate hands, satisfying reveals, texture appreciation',
               speed_styling: '⚡ SPEED STYLING: Timelapse dress-up | Scene flow: Basic start → Sped-up styling → Real-time final reveal → Pose | Camera: Static → speed up → slow-mo reveal | Music: Upbeat',
               closet_raid: '👗 CLOSET RAID: Wardrobe browse | Scene flow: Open closet → Browse → Pull out pieces → Try on → Final look | Camera: POV + mirror | Voice: Natural decision process',
               price_reveal_game: '💰 VALUE REVEAL: Guess the value | Scene flow: Show product → "Đoán xem chất lượng sao?" text → Build tension → Quality reveal | Camera: Close-up → reveal | Hook: Engaging question, max engagement',
               mini_vlog_style: '📹 MINI VLOG: Day snippet | Scene flow: Wake/Go out → Activity + outfit context → Product moment → Natural ending | Camera: Handheld vlog | Voice: Authentic, diary',
               rating_review: '⭐ HONEST RATING: X/10 format | Scene flow: First impression → Test/Use → Pros & Cons → Final rating | Camera: Mix close-up + full | Voice: Honest, credible',
               hack_tutorial: '💡 STYLE HACK: Educational viral | Scene flow: "Mẹo mà ít ai biết..." → Demo hack → Before/After → Mind blown | Camera: Clear tutorial | Hook: Hack/tip revelation',
               side_by_side: '🔄 SIDE BY SIDE: Expect vs Reality | Scene flow: Website/Ad image → Real product → Honest comparison → Verdict | Camera: Split screen | Hook: Trust-building format',
               aesthetic_flatlay: '🎨 AESTHETIC FLATLAY: Product arrangement | Scene flow: Layout setup → Overhead reveal → Detail zoom → Styled shot | Camera: Top-down, bird eye | NO model needed, aesthetic focus',
               countdown_reveal: '⏰ COUNTDOWN: Top N reveal | Scene flow: "#3..." → "#2..." → "#1 Hero product" → Final showcase | Camera: Quick cuts + hero shot | Hook: Countdown tension builder',
               // Product/intimate
               fabric_focus: '🔍 FABRIC FOCUS: Texture close-up | Scene flow: Wide shot → Macro texture → Stretch/drape test → Quality proof | Camera: Macro lens | ASMR fabric sounds',
               asmr_fabric: '🎧 ASMR FABRIC: Satisfying textures | Scene flow: Touch → Stretch → Fold → Smooth | Camera: Extreme close-up | NO voice, pure fabric ASMR',
               floor_display: '🪵 FLOOR DISPLAY: Flat product layout | Scene flow: Top-down arrange → Detail zoom → Styling props → Complete set | Camera: Overhead | NO model',
               // Beauty
               beauty_demo: '💄 BEAUTY DEMO: Real-time application | Scene flow: Before skin → Apply product → Wait/massage → After reveal | Camera: Face close-up | Voice: Product explanation',
               device_review: '🔌 DEVICE REVIEW: Gadget showcase | Scene flow: Unbox → Features tour → Real demo on skin/body → Results | Camera: Close-up + medium | Voice: Review commentary',
               skincare_routine: '🧴 SKINCARE ROUTINE: Full regimen | Scene flow: Cleanse → Tone → Serum → Moisturize → Sunscreen → Final glow | Camera: Mirror/close-up | ASMR-optional',
               makeup_tutorial: '💋 MAKEUP TUTORIAL: Step-by-step | Scene flow: Base → Eyes → Lips → Contour → Final look | Camera: Extreme close-up + reveal | Voice: Tutorial guide',
               // Smart home  
               unbox_demo: '📦 UNBOX & DEMO: Classic unboxing | Scene flow: Package → Open → Show components → Power on → Demo use | Camera: POV hands + wide | Voice: First impression',
               problem_solution: '💡 PROBLEM→SOLUTION: Pain point hook | Scene flow: Show problem (dirty/messy/broken) → Product intro → Live demo → Clean result | Camera: Before/After | Hook: Relatable problem',
               feature_showcase: '⚡ FEATURE SHOWCASE: Wow features | Scene flow: Feature 1 demo → Feature 2 demo → Feature 3 demo → Full capability | Camera: Close-up per feature | Voice: Excited showcase',
               before_after_home: '🏠 HOME BEFORE-AFTER: Transformation | Scene flow: Messy/dirty before → Using product → Clean/organized after → Satisfaction | Camera: Static compare | Hook: Satisfying cleanup',
               comparison_test: '⚔️ COMPARISON TEST: Proof format | Scene flow: Traditional method → Product method → Side-by-side results → Winner clear | Camera: Split screen | Hook: Scientific proof feel',
               // Áo Dài styles
               ao_dai_traditional: '🏮 ÁO DÀI TRUYỀN THỐNG: Heritage beauty | Scene flow: Wide establishing shot → Model standing gracefully → Wind-blown fabric → Walking elegance → Detail embroidery close-up | Camera: Slow tracking, golden hour | Vibe: Timeless Vietnamese beauty, gentle movement',
               ao_dai_transition: '✨ ÁO DÀI TRANSITION: Modern meets tradition | Scene flow: Casual outfit → Magic transition → Áo dài reveal → Confident walk → Pose | Camera: Static → jump cut → tracking | Hook: "Biến hình áo dài" dramatic change',
               ao_dai_catwalk: '👠 ÁO DÀI CATWALK: Runway elegance | Scene flow: End-of-runway pose → Turn → Walk toward camera → Fabric flow → Final pose | Camera: Low angle, tracking | NO voice, cinematic music, slow-mo fabric',
               ao_dai_modern: '🌸 ÁO DÀI MODERN: Contemporary styled | Scene flow: Street/cafe setting → Casual pose → Movement showcase → Detail styling (belt/accessories) → Lifestyle moment | Camera: Handheld vlog style | Voice: Modern styling tips',
               // Intimate/Sleepwear styles
               sleepwear_cozy: '🌙 SLEEPWEAR COZY: Comfort showcase | Scene flow: Cozy bedroom setting → Fabric touch → Stretch/move freely → Relaxed pose → Material close-up | Camera: Warm soft lighting | Vibe: Soothing comfort, ASMR-adjacent',
               editorial_inner: '📸 EDITORIAL INNER: High-fashion intimate | Scene flow: Dramatic lighting setup → Model pose → Angle change → Shadow play → Product detail | Camera: Studio editorial, dramatic shadows | NO voice, luxe magazine feel',
               flatlay_inner: '🎨 FLATLAY INNER: Artistic product layout | Scene flow: Top-down arrangement → Props styling → Product reveal → Detail zoom → Full set | Camera: Overhead bird-eye | NO model, aesthetic arrangement focus',
               handheld_inner: '📱 HANDHELD INNER: Authentic review | Scene flow: Product in hand → Fabric texture demo → Quality close-up → Packaging detail → Final display | Camera: Handheld POV, natural | Voice: Honest texture review',
               handheld_voice: '🎙️ HANDHELD VOICE: Review commentary | Scene flow: Product intro → Touch/feel demo → Detail inspection → Pros highlight → Final recommendation | Camera: Handheld, natural lighting | Voice: Authentic product talk',
               mannequin_inner: '👗 MANNEQUIN DISPLAY: Clean product view | Scene flow: Full mannequin reveal → 360° rotation → Detail focus → Fabric drape → Size reference | Camera: Clean studio, rotating | NO model, pure product display',
               overlay_demo: '📐 OVERLAY DEMO: Product visualization | Scene flow: Product flat → Overlay measurement graphics → Size reference → Fit guide → Shopping info | Camera: Static top-down | Text overlay with key specs',
               overlay_compare: '🔄 OVERLAY COMPARE: Visual comparison | Scene flow: Product A display → Product B display → Side-by-side overlay → Key differences highlighted → Winner pick | Camera: Static, split | Text: Comparison data points',
               overlay_size: '📏 SIZE GUIDE OVERLAY: Sizing help | Scene flow: Product flat → Measurement overlay → Size chart reference → Fit on body type → Recommendation | Camera: Static, info-graphic | Text: Size data, measurement numbers',
               // Body shaper
               body_shaper_demo: '⏳ BODY SHAPER DEMO: Before-after fit | Scene flow: Before silhouette → Put on shaper → Smoothing demo → Outfit over → Side comparison | Camera: Medium, static compare | Hook: Visible transformation proof',
               // Transform styles
               transform_viral: '🔥 TRANSFORM VIRAL: Trending transformation | Scene flow: "Ordinary" opening → Beat drop → Instant glam transformation → Confident walk → Pose | Camera: Static → beat-synced cut → tracking | Hook: Maximum wow factor transition',
               transform_glowup: '💎 GLOW UP: Full makeover journey | Scene flow: No-makeup/plain start → Step-by-step glow up → Hair → Makeup → Outfit → Final stunning reveal | Camera: Time-lapse feel → slow-mo reveal | Hook: "Glow up challenge"',
               transform_day_night: '🌙 DAY TO NIGHT: Outfit transition | Scene flow: Daytime office/casual look → "5pm hits..." → Quick change → Night out look → Going out | Camera: Split/jump cut | Hook: "Same pieces, 2 vibes"',
               // Walk-In styles
               fashion_walkin: '🚶‍♀️ FASHION WALK-IN: Entrance moment | Scene flow: Door/corridor → Confident walk toward camera → Slow-mo fabric movement → Pause + pose → Turn | Camera: Low angle tracking, slow-mo | Music-driven, NO voice',
               fashion_walkin_beauty: '💄 FASHION WALK-IN BEAUTY: Glam entrance | Scene flow: Beauty close-up (lips/eyes) → Pull back → Full outfit walking → Hair flip → Confident pose | Camera: Macro → wide tracking | Glamorous, makeup focus + fashion',
               // Smart Home/Lifestyle styles
               day_in_life: '📅 DAY IN LIFE: Product integration | Scene flow: Morning routine → Product usage moment → Afternoon activity → Evening use → Natural lifestyle | Camera: Vlog handheld | Voice: Natural narration, product woven into daily story',
               installation_guide: '🔧 INSTALLATION GUIDE: Easy setup | Scene flow: Unbox → Step 1 setup → Step 2 connect → Step 3 configure → Working demo | Camera: Clear tutorial POV, overhead | Voice: Clear step instructions, reassuring',
               smart_home_tour: '🏠 SMART HOME TOUR: Connected living | Scene flow: Room entry → Device 1 demo → Device 2 demo → All working together → Lifestyle wow | Camera: Smooth tracking through rooms | Voice: Tour guide, excited showcase',
            };
            const instruction = styleMap[videoStyle];
            return instruction ? `\n\n🎬 VIDEO STYLE CHOREOGRAPHY — ${videoStyle.toUpperCase()}:\n${instruction}` : '';
         };
         const videoStyleChoreography = getVideoStyleChoreography();

         // Video duration - user configurable 8-54s
         const finalDuration = videoDuration;
         const scenes = Math.floor(finalDuration / 8);

         // Duration-specific affiliate strategy
         const getAffiliateDurationStrategy = (dur: number): string => {
            if (dur <= 8) return `

💰 AFFILIATE DURATION STRATEGY: FLASH AD (${dur}s)
- 1 scene duy nhất, tối ưu cho retargeting & story ads
- 0-2s: Product hero shot + text overlay (KHÔNG nêu giá cụ thể)
- 2-5s: 1 USP mạnh nhất + social proof nhẹ ("Được nhiều bạn yêu thích")
- 5-${dur}s: CTA nhẹ nhàng ("Link dưới nha") + trust signal
- Script: MAX 15 từ, chia sẻ trải nghiệm ngắn gọn
- Rewatch trigger: Curiosity gap → force replay`;
            if (dur <= 16) return `

💰 AFFILIATE DURATION STRATEGY: QUICK SHARE (${dur}s)
- 2 scenes, Hook → Experience Share
- Scene 1 (0-8s): HOOK — Product reveal + trải nghiệm cá nhân + 1 USP
- Scene 2 (8-${dur}s): HONEST TAKE + CTA — Nhận xét thật + soft CTA
- Script: MAX 30 từ, tự nhiên như chia sẻ bạn bè
- Approach: Chia sẻ trải nghiệm, KHÔNG hard sell
- Target: Completion rate 70%+, trust-driven`;
            if (dur <= 24) return `

💰 AFFILIATE DURATION STRATEGY: EXPERIENCE REVIEW (${dur}s) ⭐ OPTIMAL
- 3 scenes, chuẩn reviewer trải nghiệm tự nhiên
- Scene 1 (0-8s): HOOK — First impression + unbox/try-on reaction
- Scene 2 (8-16s): EXPERIENCE — Trải nghiệm thật + pros/cons nhẹ + cảm nhận
- Scene 3 (16-${dur}s): VERDICT + CTA — Đánh giá tổng thể + soft CTA
- Script structure: Trải nghiệm → Cảm nhận → Chia sẻ
- CTA: Soft @20s ("Link dưới, bạn nào quan tâm tham khảo nha")
- Tone: Tự nhiên, honest, như kể chuyện mua sắm cho bạn
- Target: Completion 60%+, trust-driven conversion`;
            if (dur <= 32) return `

💰 AFFILIATE DURATION STRATEGY: STORY MODE (${dur}s)
- 4 scenes, story-driven với trải nghiệm thật
- Scene 1 (0-8s): HOOK — Curiosity/first impression + cảm xúc thật
- Scene 2 (8-16s): EXPERIENCE — Feature showcase + cảm nhận cá nhân
- Scene 3 (16-24s): PROOF — Before/After hoặc comparison + honest take
- Scene 4 (24-${dur}s): VERDICT + CTA — Tổng kết + soft CTA
- CTA: @16s engagement nhẹ ("Ai từng mua?") + @28s soft CTA ("Link dưới nha")
- Tone: Storytelling tự nhiên, như kể chuyện
- Target: Algorithm boost từ engagement + trust conversion`;
            if (dur <= 40) return `

💰 AFFILIATE DURATION STRATEGY: DEEP REVIEW (${dur}s)
- 5 scenes, tối ưu cho review chi tiết
- Scene 1 (0-8s): HOOK — Problem/curiosity + first impression
- Scene 2 (8-16s): UNBOX — Mở hộp + cảm nhận ban đầu
- Scene 3 (16-24s): DETAIL — Close-up chi tiết, chất liệu, chất lượng
- Scene 4 (24-32s): TRY-ON — Mặc thử + honest pros/cons
- Scene 5 (32-${dur}s): VERDICT — Rating tổng thể + soft CTA
- CTA: @12s tease + @24s social + @36s soft conversion
- Target: Cho sản phẩm cần build trust, honest review`;
            return `

💰 AFFILIATE DURATION STRATEGY: STORYTELLING (${dur}s)
- ${scenes} scenes, full customer journey narrative
- ACT 1 (0-16s): HOOK + PROBLEM — Relatable experience + curiosity builder
- ACT 2 (16-32s): EXPERIENCE + REVIEW — Product in daily life + honest take + USPs
- ACT 3 (32-${dur}s): VERDICT + CTA — Tổng kết + lifestyle proof + soft CTA
- Multi-CTA: @16s curiosity + @32s social proof + @${dur - 8}s soft conversion
- Tone: Storytelling tự nhiên, diary-vibe
- Best for: Sản phẩm cần storytelling, premium, complex features
- Target: Watch time priority, trust-driven conversion`;
         };
         const affiliateDurationStrategy = getAffiliateDurationStrategy(finalDuration);

         // � AFFILIATE PLATFORM STRATEGY
         const getAffiliatePlatformStrategy = (): string => {
            if (affiliatePlatform === 'tiktok') return `\n\n📱 PLATFORM: TIKTOK\n- Format: 9:16 vertical, auto-play with sound ON\n- Hook: 0-1.5s scroll-stop (curiosity / first impression / experience hook)\n- Music: Trending sound/remix, beat-sync quan trọng\n- CTA: "Link dưới nha" / "Link trong bio" / "Inbox mình nè"\n- Hashtags: #TikTokMadeMeBuyIt #ReviewThật #Viral\n- Algorithm priority: Completion rate > Like > Comment > Share\n- Optimize: Watch time + replay + save\n- Tone: Casual gen-Z, tự nhiên, chia sẻ bạn bè, dùng "nè/hen/luôn/quá trời"\n- ⚠️ KHÔNG: Nêu giá cụ thể, hard sell, FOMO giả, CTA quá pushy\n- Trending: Duet-friendly structure, stitch hooks`;
            if (affiliatePlatform === 'facebook') return `\n\n📱 PLATFORM: FACEBOOK\n- Format: Reels 9:16 hoặc Feed, auto-play MUTED by default\n- ⚠️ TEXT OVERLAY bắt buộc (80%+ viewers xem không bật tiếng)\n- CTA: "Comment MUỐN để nhận link" / "Inbox shop" / "Link bình luận đầu tiên"\n- Algorithm priority: Share > Comment > Reaction > Watch time\n- Optimize: Shareability, comment bait, community engagement\n- Tone: Thân thiện chị em, dùng "ạ/nhé", mature hơn TikTok\n- Đặc biệt: Captions + text overlays CRITICAL vì auto-mute\n- Group sharing: Content dễ share vào group mua sắm`;
            return `\n\n📱 PLATFORM: TIKTOK + FACEBOOK (ĐA NỀN TẢNG)\n- Tạo content phù hợp CẢ HAI platform\n- Hook: Visual hook (hoạt động cả có/không tiếng) + Text overlay\n- CTA đa dạng: "Link ghim" (TikTok) + "Comment MUỐN" (Facebook)\n- Tone: Cân bằng casual (TT) và thân thiện (FB)\n- Beat-sync cho TikTok + Text overlay cho Facebook muted viewers\n- Optimize: Watch time (TikTok) + Shareability (Facebook)`;
         };

         // 🎯 AFFILIATE AUDIENCE STRATEGY
         const getAffiliateAudienceStrategy = (): string => {
            if (affiliateAudience === 'cold') return `\n\n❄️ AUDIENCE: COLD (CHƯA BIẾT SẢN PHẨM)\n- Approach: CHIA SẺ TRẢI NGHIỆM + TẠO TÒ MÒ — Giới thiệu qua trải nghiệm thật\n- Hook: Curiosity ("Mình tìm được cái này hay lắm...") hoặc Story ("Hôm qua thử...")\n- Trust: Social proof nhẹ nhàng ("Bạn mình cũng mua", "Mọi người hỏi mua ở đâu")\n- Price: KHÔNG nêu giá cụ thể — chỉ "giá hợp lý" / "hợp túi tiền"\n- CTA: Soft — "Link dưới, bạn nào quan tâm tham khảo" / KHÔNG push mua\n- Script: Tự nhiên, kể chuyện, build awareness qua trải nghiệm\n- Phân bổ: 60% trải nghiệm + honest take, 40% soft CTA`;
            if (affiliateAudience === 'warm') return `\n\n🔥 AUDIENCE: WARM (ĐÃ QUAN TÂM, CHƯA MUA)\n- Approach: REVIEW CHI TIẾT + SO SÁNH — Cho thêm thông tin để tự quyết\n- Hook: Experience ("So với mấy cái trước mình mua...") hoặc Demo ("Mặc thử cho coi nha")\n- Trust: Before/After, honest pros/cons, trải nghiệm thực tế\n- Price: KHÔNG nêu giá cụ thể — "đang có đợt giá tốt" / "giá mình hài lòng"\n- CTA: Medium — "Link dưới, đang có đợt giá tốt" / KHÔNG tạo FOMO giả\n- Script: Honest review, address objections tự nhiên\n- Phân bổ: 40% review chi tiết, 30% trải nghiệm, 30% soft CTA`;
            return `\n\n🔥🔥 AUDIENCE: HOT (ĐÃ TIN TƯỞNG, SẴN SÀNG)\n- Approach: CHIA SẺ NHANH + CTA RÕ RÀNG — Nhẹ nhàng nhưng clear\n- Hook: Experience ("Mua lại lần 2 rồi nè!") hoặc Social proof ("Mấy bạn mình cũng mua")\n- Trust: Đã có — focus vào trải nghiệm mới, cập nhật\n- Price: KHÔNG nêu giá cụ thể — "đang có đợt tốt" nếu cần\n- CTA: Medium — "Link dưới nha, đang có đợt giá tốt!" / KHÔNG quá pushy\n- Script: Tự nhiên, nhanh gọn, confident\n- Phân bổ: 30% hook, 30% quick review, 40% CTA\n- Tone: Thân thiện, như nhắn tin cho bạn biết có đồ hay`;
         };

         // 🎯 AFFILIATE GOAL STRATEGY
         const getAffiliateGoalStrategy = (): string => {
            if (affiliateGoal === 'views') return `\n\n🏆 GOAL: MAXIMIZE VIEWS (REACH)\n- Priority: Algorithm-friendly → nhiều người thấy video\n- Hook: MUST scroll-stop trong 1s (curiosity, first impression, relatable moment)\n- Content: Emotional triggers, relatable, shareable, trải nghiệm thật\n- Engagement bait: "Tag bạn nào thích style này!"\n- Music: Trending sounds → algorithm boost\n- CTA: Soft — focus entertainment value, không push bán\n- Metrics: View-through rate 40%+, share rate 3%+\n- Script: Short, punchy, gây cảm xúc, tự nhiên`;
            if (affiliateGoal === 'engagement') return `\n\n🏆 GOAL: MAXIMIZE ENGAGEMENT (LIKES + COMMENTS)\n- Priority: Interaction → algorithm push → organic reach\n- Hook: Question/Poll ("Chọn A hay B?" / "Ai thích style này?")\n- Comment triggers BẮT BUỘC (≥2):\n  • "Bạn thích kiểu nào? Comment nha!"\n  • "Bạn mặc size gì? Comment để tư vấn"\n  • "Theo bạn cái nào đẹp hơn? 👇"\n- Engagement: Quiz, comparison, debate ("Cái này hay cái kia?")\n- CTA: Engage-first → "Comment/Like chia sẻ ý kiến"\n- Metrics: Engagement rate 8%+, comment rate 3%+`;
            return `\n\n🏆 GOAL: MAXIMIZE CONVERSION (TRUST-DRIVEN)\n- Priority: Mỗi element phải BUILD TRUST → người xem TỰ muốn mua\n- Hook: Experience/Curiosity ("Mình tìm được cái này..." / "So với cái cũ...")\n- Trust building: Honest review, pros/cons, trải nghiệm thật\n- Social proof tự nhiên: "Bạn mình cũng mua" / "Được nhiều bạn yêu thích"\n- Price: KHÔNG nêu giá cụ thể — "giá hợp lý" / "đang có đợt tốt"\n- CTA: SOFT → Medium — Dual CTA (@giữa + @cuối)\n  • "Link dưới nha, bạn nào quan tâm tham khảo"\n  • "Mình để link, đang có đợt giá tốt"\n- Objection handling: Honest review, quality proof, real experience\n- Metrics: Trust-driven conversion, sustainable engagement`;
         };

         const affiliatePlatformStrategy = getAffiliatePlatformStrategy();
         const affiliateAudienceStrategy = getAffiliateAudienceStrategy();
         const affiliateGoalStrategy = getAffiliateGoalStrategy();

         // �🎙️ Voice Anchor Instruction - Consistent voice across all scenes
         const getVoiceAnchorInstruction = (): string => {
            if (voiceStyle === 'no_voice') return `

🎙️ VOICE MODE: NO VOICE — PRODUCT-FOCUSED (MUSIC + TEXT + MOTION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL: Chế độ KHÔNG có giọng nói — Video "nói" bằng HÌNH ẢNH + ÂM NHẠC + CHỮ.

📌 RULES BẮT BUỘC:
1. KHÔNG tạo voiceConfig, script, dialogue cho bất kỳ scene nào
2. masterPrompt.voiceAnchor = null
3. Music/beat-sync là BACKBONE — mọi chuyển động theo nhịp nhạc
4. TEXT OVERLAYS thay thế voice — ít nhất 1 text overlay per scene
5. Product screen time ≥ 80% — sản phẩm LUÔN visible
6. Camera angle changes ≥ 3 per scene (viewer không bored)
7. Ambient sounds phải describe (fabric rustling, heels, environment)

🎵 BEAT-SYNC CHOREOGRAPHY (BẮT BUỘC):
- Mỗi scene 8s phải có ≥2 beat-drop moments
- Model movement ON BEAT (mỗi bước = 1 beat)
- Pose changes SNAP on beat drops
- Camera transitions on beat
- JSON PHẢI có "beatSync" object với BPM + dropTimestamps + motionCues

📝 TEXT OVERLAY SYSTEM (THAY THẾ VOICE):
- Scene 1: Hook text (max 5 từ, bold, pop-up effect)
- Scene 2+: Product feature text (material, fit, quality)
- Scene cuối: CTA text ("Link dưới nha 👇" / "Save lại mua nhé!")
- Position: TOP 15% hoặc BOTTOM 15% (KHÔNG che sản phẩm)
- JSON PHẢI có "textOverlays" array

💃 PROFESSIONAL TIKTOKER MOTION:
- THE CONFIDENT WALK-IN: 4 bước = 4 beats, drop → pose snap
- THE SPIN REVEAL: Still → drop → 360° spin → fabric settles
- THE FIT SNAP: Quick pose changes on EVERY beat drop
- THE SLOW GLIDE: Ultra slow-mo, mỗi step = 2-3 beats
- THE DETAIL HUNT: Macro zoom-in on drop, pull back between
- THE HAIR TOSS: Walk → drop → hair toss + confident look
- THE TRANSITION SNAP: Snap/clap → instant outfit change

🔊 AMBIENT SOUND (thay thế voice):
- Layer 1: Music bed (trending sound, 70-80% volume)
- Layer 2: Product sounds (fabric rustling, zipper, heels)
- Layer 3: Environment (room tone, street ambience)
- Mỗi scene prompt PHẢI mô tả: "No dialogue. Music at [BPM] BPM. [ambient sounds]."

📦 JSON OUTPUT — NO voiceConfig:
- scenes[].voiceConfig = KHÔNG CÓ
- scenes[].script = KHÔNG CÓ
- Thay bằng: scenes[].textOverlay = { text, position, timing, style }
- metadata.beatSync = { bpm, musicMood, dropTimestamps }
- metadata.textOverlays = [...all text overlays...]`;

            const voiceProfiles: Record<string, { profile: string; characteristics: string; accent: string; emotional: string }> = {
               'saigon_female': {
                  profile: 'Young Vietnamese woman, 22-25 years old, Southern Ho Chi Minh City accent (giọng Sài Gòn chuẩn), warm and naturally friendly',
                  characteristics: 'Medium-high pitch, slightly fast natural pace, clear pronunciation, soft breathiness on sentence endings, melodic rising intonation',
                  accent: 'Southern Vietnamese Saigon accent (giọng miền Nam Sài Gòn) - soft consonants (d/gi/r merged), melodic tonal flow, casual friendly register, natural "dạ/vâng" softness, uses "nè/hen/nghen" particles',
                  emotional: 'Warm, enthusiastic, trustworthy - like a close friend (chị em) sharing a great find. Natural excitement without being fake. Slightly playful.'
               },
               'saigon_male': {
                  profile: 'Young Vietnamese man, 24-28 years old, Southern Ho Chi Minh City accent (giọng Sài Gòn), confident and approachable',
                  characteristics: 'Medium pitch, steady natural pace, clear deep voice, relaxed articulation, casual but polished',
                  accent: 'Southern Vietnamese Saigon accent (giọng miền Nam Sài Gòn) - soft consonants, relaxed tonal flow, friendly register, uses "nè/hen" particles naturally',
                  emotional: 'Confident, genuine, knowledgeable - like a trusted friend recommending something. Calm energy with conviction.'
               },
               'hanoi_female': {
                  profile: 'Young Vietnamese woman, 22-25 years old, Northern Hanoi accent (giọng Hà Nội chuẩn), elegant and clear',
                  characteristics: 'Clear high pitch, measured pace, crisp pronunciation, distinct tonal accuracy, polished articulation',
                  accent: 'Northern Vietnamese Hanoi accent (giọng miền Bắc Hà Nội) - clear consonant distinction (d/gi/r separate), precise tones, formal-casual register, uses "ạ/vâng" naturally',
                  emotional: 'Elegant, trustworthy, articulate - refined and persuasive. Warm but maintains clarity and authority.'
               },
               'hanoi_male': {
                  profile: 'Young Vietnamese man, 24-28 years old, Northern Hanoi accent (giọng Hà Nội), authoritative and warm',
                  characteristics: 'Medium-deep pitch, clear measured pace, precise pronunciation, strong articulation, polished delivery',
                  accent: 'Northern Vietnamese Hanoi accent (giọng miền Bắc Hà Nội) - clear consonant distinction, precise tonal accuracy, professional register',
                  emotional: 'Authoritative yet warm, knowledgeable, trustworthy - professional recommendation style.'
               }
            };

            const v = voiceProfiles[voiceStyle];
            if (!v) return '';

            return `

🎙️ VOICE ANCHOR - VEO 3.1 NATIVE AUDIO (BẮT BUỘC)
⚠️ CRITICAL: Dùng CÙNG MỘT GIỌNG cho TẤT CẢ scenes để video liền mạch!

masterPrompt.voiceAnchor PHẢI chứa:
- voice_profile: "${v.profile}"
- vocal_characteristics: "${v.characteristics}"
- accent_details: "${v.accent}"
- emotional_range: "${v.emotional}"

📋 RULES CHO MỖI SCENE (BẮT BUỘC - TẤT CẢ SCENES):
1. voiceConfig.voice_profile = COPY NGUYÊN VĂN từ masterPrompt.voiceAnchor.voice_profile (GIỐNG NHAU cho Scene 1, 2, 3, 4...)
2. voiceConfig.vocal_tone = Chỉ thay đổi EMOTION theo context scene (excited/calm/urgent), KHÔNG đổi giọng
3. voiceConfig.dialogue_style = Cách nói trong scene: "voiceover" | "lip-sync" | "whisper" | "exclaim"
4. voiceConfig.sync = "lip-sync" (khi model quay mặt vào camera) hoặc "voiceover" (khi quay lưng/close-up sản phẩm)
5. script = Vietnamese script BẮT BUỘC cho mỗi scene (15-25 từ)

⚠️ CRITICAL: voiceConfig phải có trong TẤT CẢ scenes, KHÔNG CHỈ Scene 1!
❌ SAI: Scene 1 có voiceConfig, Scene 2-4 không có
✅ ĐÚNG: Scene 1, 2, 3, 4 đều có voiceConfig với CÙNG voice_profile

🎤 LIP-SYNC vs VOICEOVER GUIDE:
- Model QUAY MẶT vào camera + đang nói → sync: "lip-sync" (miệng chuyển động khớp script)
- Model QUAY LƯNG / Close-up sản phẩm → sync: "voiceover" (giọng nền, model không nói)
- Model NGHIÊNG MẶT / 3/4 angle → sync: "lip-sync" (vẫn thấy miệng)
- Mặc định: "lip-sync" cho hầu hết scenes (model thường đối diện camera)

🎬 VEO 3.1 AUDIO PROMPTING TIPS:
- Mô tả voice trong scene prompt: "A young woman with a warm Southern Vietnamese accent narrates..."
- Dialogue dùng dấu ngoặc kép: Model nói: "Chị em ơi, set này xinh quá luôn nè!"
- Ambient sound: Mô tả rõ background audio (cafe noise, street sounds, music beat)
- QUAN TRỌNG: Mỗi scene prompt PHẢI nhắc lại voice description để Veo 3.1 giữ consistency
- Vietnamese script: Viết tự nhiên, ${voiceStyle.includes('saigon') ? 'giọng miền Nam - dùng "nè", "hen", "nghen", "luôn", "quá trời"' : 'giọng miền Bắc - dùng "nhé", "ạ", "cực kỳ", "tuyệt vời"'}

🎯 VOICE STYLE: REVIEWER TRẢI NGHIỆM TỰ NHIÊN (BẮT BUỘC):
- Nói như chia sẻ trải nghiệm thật, KHÔNG NHƯ QUẢNG CÁO
- ❌ KHÔNG nêu giá cụ thể (199K, 500K...) → Nói "giá hợp lý", "hợp túi tiền"
- ❌ KHÔNG hard sell (MUA NGAY! CHỐT! NHANH TAY!) → Nói "link dưới nha", "tham khảo"
- ❌ KHÔNG tạo FOMO giả (chỉ còn 3 cái, sale hôm nay!) → Nói "đang có đợt giá tốt" nếu cần
- ✅ Kể trải nghiệm thật: mua → mở → dùng → cảm nhận
- ✅ Honest take: có ưu điểm VÀ nhược điểm nhỏ
- ✅ CTA mềm: "link dưới", "bạn nào quan tâm tham khảo"
- ✅ Filler tự nhiên: "Hmm...", "Nè...", "Mà...", "Thì..."`;
         };
         const voiceAnchorInstruction = getVoiceAnchorInstruction();

         const faceData = faceImage ? getBase64AndMime(faceImage) : null;
         const outfitData = getBase64AndMime(outfitImage);

         // Prepare Blocklist - use location strings from vault
         const historyBlocklist = locationVault.length > 0
            ? locationVault.map(item => item.location).join(", ")
            : "None (Fresh Start)";

         // Prepare Location Region preference
         const selectedRegionData = LOCATION_REGIONS.find(r => r.value === locationRegion);
         const regionName = selectedRegionData?.label || 'Auto';
         const regionDescription = selectedRegionData?.desc || 'AI chọn tự do';

         // Get RANDOM suggested locations for the region (excluding used ones)
         const suggestedLocs = locationRegion === 'auto'
            ? getRandomLocationsForAuto(5)  // Random from all regions for Auto mode
            : getSuggestedLocations(locationRegion, 5);  // Random from selected region

         // 🎬 CINEMATIC STYLE → LOCATION CONSTRAINT
         // Override suggested locations with style-appropriate ones to prevent logical mismatches
         // e.g., try_on = indoor only, walkin = outdoor walkable path, etc.
         const getStyleLocationConstraint = () => {
            const indoorLocations = [
               'Bright modern bedroom with full-length mirror — clean white wall, natural window light',
               'Minimalist fitting room with warm LED panels — neutral backdrop, clothes rack visible',
               'Cozy apartment living room with sofa and soft rug — lifestyle home setting',
               'Professional studio with white/grey seamless backdrop — ring light, tripod visible for authenticity',
               'Walk-in closet with organized wardrobe — well-lit, personal fashion space',
               'Modern bathroom mirror area — bright vanity lights, clean marble counter',
               'Stylish open-plan loft — concrete floor, industrial warm lighting, fashion mood',
               'Bedroom morning light — white bedding, sunlight through curtains, getting-ready vibe',
            ];
            const walkableOutdoorLocations = [
               'Tree-lined boulevard with golden hour light — long straight path, symmetric perspective',
               'Hanoi Old Quarter Hang Dao silk street morning — narrow atmospheric walkway',
               'Hoi An Ancient Town yellow wall lanterns — cobblestone path, warm evening',
               'Nguyen Hue Walking Street Saigon — wide promenade, modern urban backdrop',
               'Dalat Pine Forest road — cool highland path, dappled light through trees',
               'Park pathway with canopy of trees — soft morning light, natural corridor',
               'European-style covered arcade — marble floor, high ceiling, elegant approach',
               'Beachfront boardwalk sunset — long clean path, golden rim light',
            ];
            const fixedStageLocations = [
               'Seamless studio backdrop with even lighting — dramatic single spotlight accent',
               'Minimalist room with one feature wall — clean floor, controlled lighting',
               'Industrial loft space — concrete wall, large windows, single fixed framing',
               'Neutral gradient backdrop — professional 3-point lighting setup',
            ];

            switch (cinematicStyle) {
               case 'try_on':
                  return {
                     override: true,
                     locations: indoorLocations,
                     instruction: `\n\n🏠 LOCATION CONSTRAINT — THỬ ĐỒ / TRY-ON:
⚠️ BẮT BUỘC BỐI CẢNH INDOOR! Try-on video phải ở NƠI THAY ĐỒ HỢP LÝ.
✅ CHO PHÉP: Phòng ngủ, phòng thử đồ, walk-in closet, phòng khách, studio
❌ CẤM: Đường phố, sân tòa nhà, quán cafe ngoài trời, công viên, bãi biển
Logic: Người thử đồ phải ở nơi có thể THAY ĐỒ — không ai thay đồ giữa đường!
masterPrompt.environment PHẢI là indoor setting.`
                  };
               case 'unboxing':
                  return {
                     override: true,
                     locations: indoorLocations.slice(0, 5),
                     instruction: `\n\n🏠 LOCATION CONSTRAINT — MỞ HỘP / UNBOXING:
⚠️ BẮT BUỘC BỐI CẢNH INDOOR! Unboxing phải ở NƠI NHẬN HÀNG.
✅ CHO PHÉP: Phòng ngủ, bàn làm việc, phòng khách, sofa, bàn ăn
❌ CẤM: Ngoài trời, đường phố, công viên, sân tòa nhà, bãi biển
Logic: Mở hộp tại nhà hoặc studio — có bàn/giường để đặt hàng.
masterPrompt.environment PHẢI là indoor home/studio setting.`
                  };
               case 'review':
                  return {
                     override: true,
                     locations: indoorLocations,
                     instruction: `\n\n🏠 LOCATION CONSTRAINT — REVIEW:
⚠️ BẮT BUỘC BỐI CẢNH INDOOR/CỐ ĐỊNH! Review cần background nhất quán.
✅ CHO PHÉP: Phòng ngủ, studio, phòng khách, nơi có gương full-body
❌ CẤM: Ngoài trời thay đổi, đường phố ồn ào, bối cảnh không kiểm soát
Logic: Review cần background ổn định, lighting đều, camera cố định — để focus vào sản phẩm.
masterPrompt.environment PHẢI là indoor controlled setting.`
                  };
               case 'asmr_cinematic':
                  return {
                     override: true,
                     locations: [
                        'Quiet bedroom with soft morning window light — minimal ambient noise, clean surface',
                        'Professional studio dark background — single spotlight on product, silence',
                        'Minimalist desk setup — warm lamp light, fabric surface, zero background noise',
                        'Cozy vanity area — soft warm bulbs, mirror, quiet intimate space',
                     ],
                     instruction: `\n\n🏠 LOCATION CONSTRAINT — ASMR:
⚠️ BẮT BUỘC BỐI CẢNH QUIET INDOOR! ASMR cần im lặng tuyệt đối.
✅ CHO PHÉP: Phòng ngủ yên tĩnh, studio tối, bàn làm việc, vanity
❌ CẤM: Ngoài trời (tiếng xe/gió), quán cafe (tiếng ồn), đường phố, công viên
Logic: ASMR = tiếng sản phẩm là star → background phải HOÀN TOÀN IM LẶNG.
masterPrompt.environment PHẢI là quiet indoor, zero ambient noise.`
                  };
               case 'fashion_walkin':
                  return {
                     override: locationRegion === 'auto', // Only override if user didn't pick specific region
                     locations: walkableOutdoorLocations,
                     instruction: `\n\n🚶 LOCATION CONSTRAINT — FASHION WALK-IN:
⚠️ BẮT BUỘC BỐI CẢNH CÓ ĐƯỜNG ĐI DÀI! Walk-in cần path để model BƯỚC ĐI.
✅ CHO PHÉP: Đại lộ, phố cổ, con đường trong công viên, hành lang dài, boardwalk
❌ CẤM: Phòng ngủ, studio nhỏ, fitting room, bàn, ghế ngồi
Logic: Model bước về phía camera → cần ĐƯỜNG ĐI THẲNG ít nhất 4-5m.
masterPrompt.environment PHẢI là long walkable path/corridor.`
                  };
               case 'transform_viral':
                  return {
                     override: locationRegion === 'auto',
                     locations: fixedStageLocations,
                     instruction: `\n\n🎭 LOCATION CONSTRAINT — BIẾN HÌNH:
⚠️ BẮT BUỘC BỐI CẢNH CỐ ĐỊNH! Biến hình cần 1 background DUY NHẤT.
✅ CHO PHÉP: Studio backdrop, phòng sáng cố định, 1 góc tường đẹp
❌ CẤM: Bối cảnh thay đổi giữa các scene, outdoor với ánh sáng biến đổi
Logic: Transformation xảy ra trên MODEL — background phải ĐỨNG YÊN để contrast rõ.
masterPrompt.environment PHẢI là single fixed elegant background.`
                  };
               case 'storytelling':
                  return {
                     override: false,
                     locations: [],
                     instruction: `\n\n📖 LOCATION CONSTRAINT — KỂ CHUYỆN:
Storytelling cho phép đa dạng bối cảnh theo mạch truyện.
✅ Phòng ngủ → quán cafe → đường phố = OK (theo logic câu chuyện)
⚠️ Mỗi scene phải CÓ LÝ DO tại sao ở đó (không nhảy random).`
                  };
               default: // standard, marketing_intimate
                  return { override: false, locations: [], instruction: '' };
            }
         };

         const styleLocationConstraint = getStyleLocationConstraint();

         // Apply style-aware location override when needed
         const finalSuggestedLocs = styleLocationConstraint.override
            ? styleLocationConstraint.locations
            : suggestedLocs;

         const suggestedLocationsText = finalSuggestedLocs.length > 0
            ? `\n\n🎲 SUGGESTED LOCATIONS (Random selection - Pick ONE):\n${finalSuggestedLocs.map((loc, i) => `${i + 1}. ${loc}`).join('\n')}\n\n⚠️ IMPORTANT: Choose RANDOMLY from above list. Do NOT always pick #1.`
            : '';

         const styleLocationInstructionText = styleLocationConstraint.instruction;

         const locationPreferenceText = locationRegion !== 'auto'
            ? `\n\nPREFERRED LOCATION REGION: ${regionName}\nRegion Description: ${regionDescription}${suggestedLocationsText}${styleLocationInstructionText}`
            : `\n\nLOCATION MODE: AI Auto (Random from all regions)${suggestedLocationsText}${styleLocationInstructionText}`;

         // Editorial Mode (18+) flag
         const editorialModeText = editorialMode
            ? `\n\n🔞 EDITORIAL_MODE: ON\nApply foundation-free silhouette vocabulary. Use visual descriptions like "seamless foundation-free silhouette," "uninterrupted natural fabric drape," "clean garment lines without undergarment interference."`
            : '';

         // Wallpaper Mode flag
         const wallpaperModeText = wallpaperMode
            ? `\n\n📱 WALLPAPER_MODE: ON\nCreate phone wallpaper-friendly composition:\n⚠️ CRITICAL: DO NOT draw any UI elements (clock, icons, notifications) in the image!\n⚠️ FRAMING: Model MUST occupy 90% of frame HEIGHT (same as Lookbook Mode)\n- Model full-body from head to toe, 90% frame height\n- Head near top edge (5-10% margin) - phone clock will overlay this area\n- Feet near bottom edge (5% margin) - phone dock will overlay this area\n- Use beautiful gradient backgrounds: sunset, twilight, bokeh city lights\n- Background around head/feet should be simple for UI overlay\n- Soft rim lighting, dreamy aesthetic\n- Colors: warm golden, soft pastels, or dramatic twilight tones\n- Output is PURE IMAGE only - no interface elements, no text overlays\n\n⚠️ BODY VOCABULARY (SAFE FASHION TERMS ONLY):\n- Describe GARMENT FIT on body, NOT body anatomy directly\n- Use: elegant figure, classic hourglass silhouette, graceful silhouette\n- NEVER use raw measurements, body part sizes, or anatomical descriptions\n- Wallpaper mode affects FRAMING only — body described through FASHION vocabulary`
            : '';

         // Lookbook Mode flag
         const lookbookModeText = lookbookMode
            ? `\n\n📸 LOOKBOOK_MODE: ON\n⚠️ CHỈ TẠO IMAGE PROMPTS - KHÔNG TẠO VIDEO/SCENES\n\n🔧 JSON OUTPUT FORMAT FOR LOOKBOOK (CONCRETE EXAMPLE):\n\`\`\`json\n{\n  "masterPrompt": {\n    "facePreservation": "Exact facial features...",\n    "subject": "Elegant Vietnamese model...",\n    "outfit": "Flowing silk ao dai...",\n    "environment": "Shot on location at...",\n    "lighting": "Golden hour...",\n    "camera": "Full body...",\n    "style": "Photorealistic"\n  },\n  "images": [\n    {\n      "id": 1,\n      "timestamp": "00s",\n      "imagePrompt": "Elegant Vietnamese model in flowing silk ao dai, standing gracefully with vạt panels draped naturally. Shot on location at ancient temple courtyard. Golden hour lighting, warm amber glow. Full body shot, 85mm f/1.4, 90% frame height. Photorealistic fashion photography"\n    },\n    {\n      "id": 2,\n      "timestamp": "08s",\n      "imagePrompt": "Same model in ao dai, seated on ornate wooden chair, panels spread elegantly. Environment unchanged. Soft window light from left. Medium shot capturing upper body and vạt details. Natural color grading"\n    }\n  ],\n  "metadata": {\n    "location": "Văn Miếu Quốc Tử Giám, Hanoi",\n    "aspectRatio": "9:16"\n  }\n}\n\`\`\`\n\n⚠️ CRITICAL: Each image object MUST have:\n- "imagePrompt" field (FULL prompt describing the entire image in ONE string)\n- OR "prompt" field (alternative field name)\n- DO NOT split into subject/action/environment - combine ALL into imagePrompt\n\n⛔ KHÔNG BAO GỒM:\n- "scenes" array (lãng phí tài nguyên)\n- "beatSync" object (không cần cho ảnh tĩnh)\n- "emotionalJourney" object (không cần cho ảnh tĩnh)\n- "referenceAngles" array (không cần cho lookbook)\n- "keyframes" array (dùng "images" thay thế)\n\n✅ CHỈ CẦN: masterPrompt + images + metadata${aspectRatio === '16:9' ? `\n\n📐 LOOKBOOK 16:9 OPTIMIZATION:\n- BỐ CỤC NGANG: Model chiếm 60-80% chiều CAO frame (không phải 90% như 9:16)\n- MODEL VỊ TRÍ: Đặt model ở 1/3 trái hoặc phải theo rule of thirds\n- BACKGROUND: Rõ nét hơn, có storytelling, environment quan trọng\n- LYING POSES: ƯU TIÊN - Model nằm ngang chiếm trọn chiều RỘNG frame\n- SQUAT/KNEELING: Phù hợp vì model thấp hơn, background visible\n- STANDING: Camera xa hơn (2-4m) để capture full body + bối cảnh\n- DEPTH OF FIELD: Sâu hơn (f/4-f/8), không blur background quá mạnh\n- USE CASE: Desktop wallpaper, YouTube thumbnail, Website banner, Print\n- YOGA POSES: Samakonasana (xoạc ngang 180°) RẤT PHÙ HỢP cho 16:9 vì chân mở rộng theo chiều ngang` : `\n\n📱 LOOKBOOK 9:16 OPTIMIZATION:\n- BỐ CỤC DỌC: Model chiếm 90% chiều CAO frame (head-to-toe visible)\n- STANDING POSES: ƯU TIÊN - Tận dụng chiều dọc\n- LYING POSES: Model nằm chéo hoặc dọc trong frame\n- USE CASE: Phone wallpaper, Instagram Story, TikTok thumbnail`}\n\n🚫 QUY TẮC BẮT BUỘC CHO ÁO DÀI (NẾU LÀ ÁO DÀI):\n- KHÔNG XẺ TÀ: Vạt áo LIỀN MẠCH từ eo xuống, KHÔNG có đường xẻ dọc trên vạt\n- KHÔNG XẺ VẠT: Vạt trước và vạt sau RIÊNG BIỆT, KHÔNG rách, KHÔNG xẻ\n- GIỮ NGUYÊN VẠT TRƯỚC: Phủ từ ngực đến đầu gối, có thể bay nhẹ\n- GIỮ NGUYÊN VẠT SAU: Phủ từ lưng đến đầu gối, có thể kéo sang bên\n- CHỈ CÓ XẺ HÔNG: Xẻ ở hai bên hông (từ eo xuống) để thấy quần lụa\n- EN: "ao dai with INTACT panels, NO slits on panels, side openings at hip only"\n\n🌸 NẾU OUTFIT LÀ ÁO DÀI: TẠO 52 IMAGE PROMPTS theo Áo Dài Special Sequence MỞ RỘNG:\n- Image 1-4: Standing + Vạt Áo (Flow, Butterfly, Walking, Back Walking)\n- Image 5-7: Seated poses (Chair, Back Glance, Side Profile)\n- Image 8-10: Deep Squat poses (3/4 Back, Full Back, Side)\n- Image 11-12: Dynamic poses (Wind, Spin)\n- Image 13-14: Elegant Squat poses\n- Image 15-17: Artistic + Lifestyle (Vạt Frame, Leaning, Table Lean)\n- Image 18-22: Hair Touch, Low Angle, Detail, Environment, Closing Hero\n- Image 23-27: Upper Body poses (Arms Up, Crossed Arms, Hand on Chest, Shoulder Glance, Neck)\n- Image 28: Squat 3/4 Back Vạt Không Che\n- Image 29: Kneeling 3/4 Back Ưỡn Hông Vạt Không Che\n- Image 30-39: Lying poses ${aspectRatio === '16:9' ? 'TỐI ƯU cho 16:9' : 'cho 16:9'} (Side, Dreamy, Mermaid, Head Support, Cross Legs, Knees Up, Reading, Vạt Spread)\n- Image 40-43: UPPER SILHOUETTE (Bodice Architecture, Corsetry Lean, Vintage Profile, Balletcore Arch)\n- Image 44-48: LOWER SILHOUETTE (Hip Architecture Back, Gothic Squat, Kneeling Sweep, S-Curve Profile, Floor Silhouette)\n- Image 49: HOURGLASS FINALE (Closing Power Pose)\n- Image 50-52: YOGA FLEXIBILITY (Samakonasana Side Split 180°${aspectRatio === '16:9' ? ' - RẤT PHÙ HỢP 16:9' : ''}, Supta Baddha Konasana Hip Opener, Upavistha Konasana Forward Fold - Lower Silhouette Focus)\n\n📷 NẾU KHÔNG PHẢI ÁO DÀI: TẠO 35 IMAGE PROMPTS MỞ RỘNG (SAFE VOCABULARY):\n- Image 1-6: Standing poses (front, side, back, 3/4, over-shoulder, full back)\n- Image 7-10: Dynamic poses (walk, spin, wind, runway)\n- Image 11-14: Seated poses (chair, floor, side, back)\n- Image 15-17: Squat poses (3/4 curves, back, low angle)\n- Image 18-22: Bodice & Silhouette Focus (décolletage architecture, S-line, hip architecture, balletcore lean, vintage profile)\n- Image 23-24: Fabric Detail (hair touch, texture)\n- Image 25-28: Lower Silhouette Focus (gothic squat, kneeling, back hip, floor curves)\n- Image 29-32: Upper Architecture Focus (arms up, lean forward, crossed arms, shoulder drop)\n- Image 33: Closing Hero (hip pop finale)\n- Image 34-35: YOGA FLEXIBILITY (Samakonasana Side Split 180°${aspectRatio === '16:9' ? ' - RẤT PHÙ HỢP 16:9' : ''}, Supta Baddha Konasana Hip Opener)\n\n🔐 SAFE VOCABULARY (BẮT BUỘC — ĐỒNG BỘ VỚI SAFETY_VOCABULARY_GUIDE):\n- UPPER: "elegant décolletage line", "refined neckline", "structured bodice architecture", "upper body silhouette"\n- LOWER: "graceful lower silhouette", "elegant lower contour", "defined waistline silhouette", "long elegant lines"\n- STYLE: "balletcore", "gothic romantic", "vintage glamour", "corsetry-style", "classic hourglass silhouette"\n- ⚠️ TUYỆT ĐỐI KHÔNG: body measurements, body part sizes, anatomical descriptions, "heavy chest", "opulent contours", "sweeping hip line", "thighs", "gym-toned"\n\n🧊 FROZEN STATE RULES — ẢNH TĨNH (BẮT BUỘC CHO MỌI IMAGE PROMPT):\n\n📷 GROUP 1 — SUBJECT = KHOẢNH KHẮC ĐÓNG BĂNG:\n- MỌI pose PHẢI mô tả KHOẢNH KHẮC ĐÓNG BĂNG — dùng trạng thái hiện tại hoặc quá khứ phân từ\n- ✅ "Standing with hand resting on hip, fabric caught mid-air" | "Mid-stride freeze, left foot forward, skirt frozen in sway"\n- ✅ "Seated with legs crossed, chin resting on hand" | "Leaning against wall, arms folded"\n- ❌ CẤM: "walking forward", "spinning around", "swaying", "turning", "moving" (động từ chuyển động = CHỈ DÀNH CHO VIDEO)\n- Lookbook pose động = mô tả ĐỈNH ĐÓNG BĂNG của chuyển động đó\n\n📷 GROUP 2 — MÔI TRƯỜNG = SẮP ĐẶT TĨNH:\n- Background PHẢI đóng băng — không gió, không vật thể di chuyển, không nước chảy\n- ✅ "softly blurred buildings in bokeh" | "fixed cafe furniture in background" | "parked vintage car"\n- ✅ "still lake reflection" | "frozen fountain spray" | "motionless tree branches"\n- ❌ CẤM: "wind blowing curtains", "pedestrians walking", "leaves falling", "clouds moving" (chuyển động môi trường = CHỈ VIDEO)\n\n📷 GROUP 3 — CAMERA = BỐ CỤC CỐ ĐỊNH:\n- Không dùng động từ di chuyển camera. Dùng: "shot at", "framed with", "composed using", "captured from"\n- ✅ "Shot at 85mm f/1.4, eye level" | "Framed with rule of thirds, model at left third"\n- ❌ CẤM HOÀN TOÀN: dolly, tracking, orbit, push-in, pan, tilt, crane, gimbal, follow, pull-back, zoom-in (di chuyển camera = CHỈ VIDEO)\n\n📷 GROUP 4 — ÁNH SÁNG = TRẠNG THÁI CỐ ĐỊNH:\n- Mô tả MỘT khoảnh khắc ánh sáng duy nhất. Không thay đổi theo thời gian.\n- ✅ "golden hour glow casting long shadows to the right" | "soft window light from upper left, Rembrandt triangle on cheek"\n- ✅ "overcast diffused light, no harsh shadows" | "single spotlight from above, deep shadows below chin"\n- ❌ CẤM: "light shifting", "shadows moving", "sun filtering through moving leaves", "flickering", "fading" (thay đổi ánh sáng = CHỈ VIDEO)\n\n📷 GROUP 5 — KẾT CẤU SIÊU THỰC (HYPER-REALISTIC RENDERING):\n- Visible skin pores, individual hair strands, flyaway hair caught in light\n- Fabric weave pattern visible at close-up: thread count on silk, knit texture on wool, lace threadwork detail\n- Micro-scratches on jewelry hardware, fingerprint smudges on metal buckle, patina on vintage accessories\n- Surface imperfections: dust motes frozen in sunbeam, condensation droplets on glass, water beads on leather\n- Fabric texture rendering: silk sheen gradient reflecting environment, leather grain pattern with natural creases, denim fade pattern at stress points\n- Skin rendering: natural skin texture without airbrushing, visible beauty marks, subtle under-eye shadows\n- EVERY image prompt SHOULD include 1-2 hyper-realistic texture details relevant to the outfit and environment`
            : '';

         // Seductive Mode flag (TikTok safe alluring style)
         // Note: Auto-disabled when sexyMode is ON (vocabulary conflict)
         const seductiveModeText = seductiveMode && !sexyMode
            ? `\n\n💋 ALLURE_LITE_MODE: ON (TIKTOK-SAFE VOCABULARY)\nTạo video/hình ảnh quyến rũ, thu hút nhưng AN TOÀN cho TikTok.\n\n✅ TIKTOK SAFE VOCABULARY - CHỈ DÙNG CÁC TỪ NÀY:\n- magnetic presence, captivating aura, effortless allure, mysterious mystique\n- intoxicating elegance, hypnotic charm, irresistible confidence\n\n😏 EXPRESSION & GAZE:\n- Smoldering gaze, dreamy half-lidded gaze, inviting confident look\n- Piercing eye contact, languid gaze, soft gaze through lashes\n- Slight knowing smile, confident smirk, mischievous grin\n\n💃 BODY LANGUAGE:\n- Slow deliberate movements, languid stretching, confident strut\n- Hip sway with purpose, shoulder drop revealing collarbone\n- Neck tilt, graceful back arch\n- Hair toss in slow motion, hand flowing through hair slowly\n\n🎭 POSES (TIKTOK SAFE):\n- Standing: Wall Lean, The Turn, Power Stance, Arms Up Stretch\n- Sitting: Throne Pose, Elegant Recline, Edge Sit\n- Movement: Runway Walk, Spin Around, Hair Play${lookbookMode ? '' : `\n\n🎬 CAMERA WORK (VIDEO ONLY):\n- Slow push-in on face, circling orbit shot, low angle power shot\n- Soft focus transition, lingering close-up, slow pan from toe to face\n- Over-shoulder mystery shot, silhouette rim lighting`}\n\n💡 LIGHTING:\n- Warm golden hour glow, dramatic chiaroscuro, soft candlelight ambiance\n- Neon glow reflection, backlit silhouette, rim light defining elegant silhouette`
            : '';

         // Sexy Mode flag (Private mode for Nano Banana Pro & Veo 3.1)
         // Adapts to: Wallpaper Mode (elegant sexy), Lookbook Mode (no scene flow)
         // ⚠️ SFW VOCABULARY - Optimized for Nano Banana Pro content filters
         // CHỈ DÙNG YOGA SANSKRIT cho POSES KHÓ hoặc DỄ BỊ FLAG
         const sexyModeText = sexyMode
            ? `\n\n🔥 ALLURE_MODE: ON (FASHION-SAFE VOCABULARY - NANO BANANA PRO OPTIMIZED)\nChế độ tạo nội dung thời trang quyến rũ - DÙNG VOCABULARY CHUYÊN NGÀNH.\n\n✅ CHỈ DÙNG FASHION VOCABULARY:\n📌 UPPER BODY: décolletage line, V-neckline, neckline depth, upper body silhouette, bodice architecture, heart opening, fitted bodice\n📌 FULL BODY: alluring, captivating, magnetic, confident gaze, magnetic presence, self-assured elegance\n📌 FABRIC: lightweight fabric, flowing material, glossy finish, reflective surface\n📌 GAZE: half-lidded dreamy gaze, confident knowing gaze, soft gaze through lashes\n📌 OUTFIT: lounge coordinates, loungewear set, two-piece swimwear, swim fashion set, intimate fashion coordinates${wallpaperMode ? `\n\n📱 WALLPAPER + ALLURE COMBINATION:\n- Tạo hình nền elegant nhưng TINH TẾ, phù hợp làm lock screen\n- Poses: elegant standing, confident lean, soft recline\n- Expression: half-lidded gaze, knowing smile - confident not intense\n- Background: dreamy gradient, bokeh lights - beautiful for wallpaper\n- Model 90% frame như Wallpaper Mode yêu cầu` : ''}\n\n⚠️ QUY TẮC ÁO DÀI:\n- Áo dài VẪN PHẢI tuân thủ: KHÔNG XẺ TÀ, VẠT LIỀN MẠCH\n- Allure qua: form-fitting silhouette, thin silk fabric, deep back scoop, wind-blown panels\n- EN: "ao dai INTACT panels, elegant via fitted silhouette and flowing fabric, NO panel slits"\n\n💃 BODY VOCABULARY:\n- Graceful silhouette, elegant figure, hourglass silhouette\n- Generous figure, elegant curves, slender waist\n- Smooth radiant skin, long elegant lines\n\n👗 OUTFIT VOCABULARY:\n- Form-fitting dress, bodycon, deep V-neckline, backless\n- High slit, lightweight fabric, lace overlay, strapless\n- Loungewear set, silk robe, two-piece swimwear\n- ⚠️ NGOẠI TRỪ ÁO DÀI: chỉ form-fitting, thin silk, NO slits on panels\n\n🧘 YOGA POSES CHO TƯ THẾ KHÓ/DỄ FLAG:\n| Pose | Yoga Sanskrit | Dùng Khi |\n|------|--------------|----------|\n| Xoạc ngang 180° | Samakonasana (Straight Angle) | Thay "180° splits" |\n| Xoạc cúi trước | Upavistha Konasana (Wide-Angle Forward Bend) | Wide-angle seated forward |\n| Nằm mở hông | Supta Baddha Konasana (Reclined Bound Angle) | Reclined hip opener |\n| Cong lưng sâu | Bhujangasana/Ustrasana (Cobra/Camel) | Deep backbend |\n\n🎭 ELEGANT POSES:${wallpaperMode ? `\n- Elegant standing with hip tilt, confident lean\n- Graceful back arch, hand on hip, over-shoulder glance\n- Hair toss, subtle fabric touch - tinh tế cho wallpaper` : `\n- Graceful back arch, hip tilt, leaning forward\n- Wall lean, confident arch, styled poses\n- Elegant recline, relaxed poses, dynamic movement\n- Hair styling, fabric draping, strap adjusting`}\n\n📸 CAMERA:\n- Low angle looking up, bird's eye view\n- Slow pan up body, circling orbit, push-in close\n\n💡 LIGHTING:\n- Warm amber key light, strong rim/backlight glow\n- Single spotlight, candle flicker, neon glow\n- Pattern shadows, dramatic chiaroscuro${lookbookMode ? '' : `\n\n🎬 SCENE FLOW (VIDEO ONLY):\n- Scene 1: Introduction - elegant silhouette emerging\n- Scene 2: Reveal - full body spotlight showcase\n- Scene 3: Highlight - peak captivating moment\n- Scene 4: Finale - confident elegant close, smile`}`
            : '';

         // 🎬 VIDEO TEMPORAL DYNAMICS — Only for video mode (Groups 1-5 Video Side)
         const videoTemporalText = !lookbookMode
            ? `\n\n🎬 VIDEO TEMPORAL DYNAMICS (BẮT BUỘC CHO MỌI VIDEO SCENE — Veo 3.1):

🎥 GROUP 1 — SUBJECT = CHUYỂN ĐỘNG LIÊN TỤC:
- MỌI scene PHẢI có continuous motion — nhân vật KHÔNG BAO GIỜ đứng yên
- ✅ "walks forward confidently, mid-stride left foot hits ground" | "turns slowly, hair swings following momentum"
- ✅ "leans into doorframe, shifts weight gradually" | "spins 180°, skirt flares outward"
- ❌ CẤM cho video: "standing still", "frozen pose", "static position" (tĩnh = CHỈ DÀNH CHO ẢNH)

🌿 GROUP 2 — MÔI TRƯỜNG = BIẾN ĐỔI VẬT LÝ:
- Background PHẢI có ambient motion — thế giới xung quanh SỐNG ĐỘNG
- ✅ "gentle breeze moves tree leaves, pedestrians blur past in background" | "café steam rises, traffic flows behind"
- ✅ "clouds drift overhead shifting shadow patterns" | "water ripples in nearby fountain"
- Mỗi scene PHẢI có ít nhất 1 environmental motion element

🎥 GROUP 3 — CAMERA = QUỸ ĐẠO DI CHUYỂN:
- Camera PHẢI có movement trajectory — KHÔNG BAO GIỜ static locked tripod
- ✅ "slow dolly forward 3s → hold 2s → orbit right 3s" | "tracking shot following model walk"
- ✅ "crane up revealing cityscape → push-in to face" | "gimbal follow, slight float"
- Mỗi scene cần camera pacing: breakdown di chuyển trong 8s

💡 GROUP 4 — ÁNH SÁNG = THAY ĐỔI THEO THỜI GIAN:
- Ánh sáng PHẢI thay đổi trong mỗi scene 8s — KHÔNG BAO GIỜ static flat lighting
- ✅ "sun shifts through canopy, dappled light pattern moves across model" | "walking from shadow into direct sunlight"
- ✅ "neon sign flicker casts alternating pink-blue" | "passing car headlights sweep across silk"
- ✅ "golden hour glow deepens as scene progresses" | "cloud movement creates shifting shadow patterns"

🔊 GROUP 5 — AMBIENT AUDIO (Veo 3.1 NATIVE AUDIO):
- Mỗi scene PHẢI có 2-3 environmental sounds phù hợp location
- ✅ Street: "heel clicks on pavement, distant traffic hum, muffled conversation"
- ✅ Café: "coffee machine steaming, soft jazz, cup clinks"
- ✅ Nature: "birds chirping, wind through leaves, distant water"
- ✅ Indoor: "fabric rustling with movement, soft footsteps on wood, ambient room tone"
- Audio PHẢI match với physical interactions trong scene

👁️ GROUP 6 — VISIBILITY CONTINUITY (CHỐNG HALLUCINATE CHI TIẾT BỊ KHUẤT):
- Khi scene sau REVEAL chi tiết bị khuất ở scene trước → MÔ TẢ chi tiết đó TRƯỚC KHI nó xuất hiện
- ✅ "red dress with V-neck front AND criss-cross back straps" (mô tả cả mặt trước + sau DÙ chưa thấy sau)
- ✅ "model begins turning, revealing open back with thin spaghetti straps" (mô tả TRƯỚC KHI xoay xong)
- ❌ CẤM: Để AI tự tưởng tượng mặt sau/bên chưa thấy — SẼ HALLUCINATE sai màu/pattern/chi tiết
- masterPrompt.outfit PHẢI chứa MÔ TẢ 360°: FRONT (neckline, bodice) + BACK (open/closed, zipper, strap) + SIDES (seam, pocket) + HEM
- Mỗi scene PHẢI ghi: VISIBLE (đang thấy) + WILL_REVEAL (sẽ thấy khi chuyển scene/xoay)
- PHỤ KIỆN (mũ, kính, túi, vòng) bị che tạm thời → ghi note: "clutch bag at left hip (temporarily hidden, visible next scene)"
- COLOR ANCHOR: Ghi hex color + nhắc lại mỗi scene (tránh color drift: đỏ → hồng)${voiceStyle === 'no_voice' ? `

🎵 GROUP 7 — NO-VOICE BEAT-SYNC MOTION (KHI KHÔNG CÓ GIỌNG NÓI):
- Music là BACKBONE — mọi chuyển động PHẢI theo nhịp nhạc
- Beat map: 1 beat = 1 bước chân HOẶC 1 micro-movement
- Beat DROP = pose SNAP / outfit REVEAL / camera CUT (moment lớn nhất)
- Bar change (mỗi 4-8 beats) = scene transition, angle switch
- Pose variety ≥ 5 unique poses per 8s scene (đổi pose mỗi 1.5s)
- KHÔNG BAO GIỜ đứng yên > 1.5s — luôn có micro-movement (hair touch, weight shift, fabric adjust)` : ''}`
            : '';

         // � DISPLAY TYPE INSTRUCTIONS - Unified affiliate mode
         let displayInstructions = '';
         
         if (displayType === 'product_focus') {
            displayInstructions = `
📦 PRODUCT-FOCUSED DISPLAY MODE:
Sản phẩm là NGÔI SAO — mọi góc quay, ánh sáng, chuyển động đều phục vụ sản phẩm.
Product screen time ≥ 80% — sản phẩm LUÔN visible và là focal point.

🎯 CÁCH THỰC HIỆN DUY NHẤT (BẮT BUỘC):

🧍 STYLE — MANNEQUIN/TORSO ONLY:
Sản phẩm trên mannequin hoặc torso — clean, professional, catalog style.
KHÔNG dùng người mẫu thật. KHÔNG mô tả khuôn mặt. KHÔNG face close-up.
- Subject bắt buộc: mannequin / torso / product only
- Cấm từ khóa: model face, facial features, eyes, lips, smile, hair, makeup, portrait
- Camera tập trung 100% vào sản phẩm, form dáng, chất liệu, chi tiết hoàn thiện
- Professional white torso mannequin (thân người trắng mờ)
- 3-point lighting: 5000K key + 4500K fill + rim backlight
- 9ft seamless white/grey backdrop
- Rotate 15-30° giữa các scenes
- 85mm f/8 lens, ISO 100, product focus sharp
- Scene flow:
  Scene 1: Front view rotation (0° → 45°)
  Scene 2: Detail zoom (macro stitching, fabric, hardware)
  Scene 3: Side/back view (90° → 180°)
  Scene 4: Full 360° glamour shot

📌 BỔ SUNG (OPTIONAL): Flatlay/overhead được phép như scene phụ, nhưng vẫn no-face/no-person.

📝 TEXT OVERLAYS (BẮT BUỘC cho Product Focus):
- Scene 1: Hook (first impression, curiosity trigger)
- Scene 2: Feature (chất liệu, thiết kế đặc biệt)
- Scene 3: Benefit (tôn dáng, thoải mái, trải nghiệm)
- Scene 4: CTA (link, chia sẻ, tham khảo)

📷 CAMERA TECHNIQUE (ÁP DỤNG CHO CẢ 3 STYLES):
- Macro lens moments: ≥1 scene có macro close-up (texture, weave, print)
- Focus pull: Foreground product sharp ↔ background soft
- Slow orbit/rotation: Sản phẩm hoặc camera xoay chậm
- Dynamic angles: ≥3 angle changes per scene (top, side, front, 45°, low)
- Lighting shifts: Rim light catch fabric sheen, backlight silhouette

📦 FASHION FOUNDATIONS VOCABULARY (nếu là delicate wear):
✅ USE: "corsetry-style bodice", "fitted architecture", "supportive construction", "shaping technology"
✅ USE: "couture fashion coordinates", "lounge coordinates", "editorial catalog pose"
✅ STYLE: Professional catalog editorial, confident elegant posing, luxury fabric detail
`;
         } else if (displayType === 'fashion_model') {
            displayInstructions = `
👗 FASHION MODEL DISPLAY MODE:
Model mặc sản phẩm, di chuyển tự nhiên, poses động. Phù hợp cho: váy, áo, quần thời trang.
${studioMode 
   ? '\n🎬 STUDIO: Lifestyle themed backdrop, 2-3 props (chair/plant/frame), warm aesthetic lighting' 
   : '\n📍 LOCATION: Natural environment (street/park/café), lifestyle context, ambient light'}


🎬 SCENE STRUCTURE (24s):
- Scene 1 (0-8s): Entrance/reveal - model xuất hiện tự tin, viral hook
- Scene 2 (8-16s): Movement - đi lại, xoay người, váy bay tự nhiên
- Scene 3 (16-24s): Details - close-up fabric, body movement, curves

💃 MOVEMENT RULES:
- Natural walking (KHÔNG catwalk cứng nhắc)
- Hip sway nhẹ, shoulders relaxed
- Hands: chạm váy/tóc, KHÔNG cứng đờ
- Expression: Tự tin, thoải mái (KHÔNG cười giả)

📷 CAMERA:
- Tracking shot mượt (slow follow)
- Medium-wide framing (model 75-85% frame height)
- Shallow DoF f/2.0-2.8 (background blur)
- NO zoom, NO low angle, NO static poses
`;
         } else {
            displayInstructions = `
🎨 MIXED DISPLAY MODE:
Kết hợp model + product shots. Đa dụng nhất.
${studioMode 
   ? '\n🎬 STUDIO: Versatile setup - có thể switch backdrop giữa scenes (model scenes + product scenes)' 
   : '\n📍 LOCATION: Flexible - model scenes outdoor, product scenes indoor cho đa dạng'}


🎬 SCENE MIX:
- Scene 1-2: Model wearing (fashion context)
- Scene 3: Product close-up (detail/quality)  
- Scene 4: Model + CTA (conversion)

Lấy ưu điểm của cả 2 modes.
`;
         }

         // � NO-VOICE DISPLAY ENHANCEMENT — Add text overlay + beat-sync to display instructions
         if (voiceStyle === 'no_voice' && !lookbookMode) {
            displayInstructions += `

🔇 NO-VOICE DISPLAY ENHANCEMENT:
Video KHÔNG có giọng nói — TEXT OVERLAYS là cách giao tiếp chính.

📝 TEXT OVERLAY CHOREOGRAPHY (BẮT BUỘC):
- Scene 1 (Hook): Text POP-UP effect (fade-in 0.3s) → max 5 từ → gây tò mò
  Examples: "Đồ 200K mà đỉnh?" / "Outfit dưới 300K" / "Ai nói rẻ xấu?"
- Scene giữa (Feature): TYPEWRITER effect → highlight 1-2 feature key
  Examples: "Vải cotton 100%" / "Co giãn 4 chiều" / "Tôn dáng cực kỳ"
- Scene cuối (CTA): SLIDE-IN effect → urgency + action
  Examples: "Link ở bio nha 👇" / "Save lại mua nhé!" / "Còn ít lắm!"

🎵 MUSIC-DRIVEN PACING (thay thế voice pacing):
- Movement ON BEAT — mỗi bước chân = 1 beat
- Pose changes SNAP on beat drops — không smooth transition
- Camera cuts ALIGNED with music bars (không cut giữa bar)
- Product REVEAL timing = biggest beat drop trong bài

💃 ENHANCED MOTION (bù cho không có voice):
- 3x nhiều camera angle changes hơn video có voice
- Continuous movement — KHÔNG BAO GIỜ đứng yên quá 1.5s
- Dynamic energy: walk-in → spin → pose snap → detail zoom → pull back
- Facial expressions expressive hơn (mỉm cười, ngạc nhiên, tự tin)`;
         }

         // �🛡️ PHẦN CŨ ĐÃ BỊ LOẠI BỎ - bắt đầu phần code tiếp theo
         // REMOVED - All old mode text generation (walkinModeText2, walkinModeText, marketingModeText, walkin16_9Text)
         // Replaced by displayInstructions (fashion_model / product_focus / mixed)

         // 🎬 CINEMATIC STYLE INSTRUCTIONS - Integrated with Affiliate Mode
         let cinematicStyleInstructions = '';
         
         if (cinematicStyle === 'standard') {
            cinematicStyleInstructions = `\n\n🎬 CINEMATIC STYLE: Standard Fashion Editorial (${finalDuration}s)
Professional cinematic fashion video với editorial quality.
- Smooth camera movements (dolly, crane, gimbal)
- Elegant transitions between scenes
- Color grading: Professional with brand consistency
- Pacing: 8s per scene (${scenes} scenes for ${finalDuration}s video)
- Style: High-end fashion editorial cinematography`;
         } else if (cinematicStyle === 'transform_viral') {
            const transformScenes = scenes;
            const transformMidpoint = Math.floor(transformScenes / 2);
            const getTransformStructure = () => {
               if (transformScenes <= 1) return `- Scene 1 (0-${finalDuration}s): Quick flash — Before pose → sparkle burst → After reveal in ONE scene`;
               if (transformScenes === 2) return `- Scene 1 (0-8s): \"Before\" outfit — model ${getRandomBeforeOutfit()}, neutral expression, \"Wait for it...\" energy\n- Scene 2 (8-${finalDuration}s): TRANSFORMATION + REVEAL — sparkle particles → outfit morphs → confidence glow-up`;
               if (transformScenes === 3) return `- Scene 1 (0-8s): \"Before\" outfit — model ${getRandomBeforeOutfit()}, neutral expression\n- Scene 2 (8-16s): TRANSFORMATION — sparkle particles, lens flare transition, outfit morphs\n- Scene 3 (16-${finalDuration}s): \"After\" reveal — stunning new outfit, confidence glow-up`;
               // 4+ scenes
               let structure = `- Scene 1 (0-8s): \"Before\" outfit — model ${getRandomBeforeOutfit()}, neutral expression\n- Scene 2 (8-16s): Transition prep — model touches outfit/spins, build anticipation`;
               for (let i = 3; i <= transformScenes - 1; i++) {
                  const start = (i - 1) * 8;
                  const end = i * 8;
                  structure += `\n- Scene ${i} (${start}s-${end}s): TRANSFORMATION — sparkle particles, lens flare transition, outfit morphing`;
               }
               structure += `\n- Scene ${transformScenes} (${(transformScenes - 1) * 8}s-${finalDuration}s): \"After\" reveal — stunning new outfit, confidence glow-up`;
               return structure;
            };
            cinematicStyleInstructions = `\n\n✨ CINEMATIC STYLE: Biến Hình Viral (${finalDuration}s)
AI morph outfit transformation - TikTok viral trend format.

🎬 STRUCTURE (${finalDuration}s — ${transformScenes} scenes):
${getTransformStructure()}

✨ TRANSFORMATION EFFECTS:
- Sparkle particles bursting from center
- Soft golden glow during transition
- Quick cut or smooth morph between outfits
- Camera slightly push-in during reveal

🎯 VIRAL ELEMENTS:
- Hook: \"Wait for it...\" energy in Scene 1
- Peak: Transformation at ~${transformMidpoint * 8}s (mid-video retention)
- Payoff: Wow reveal in final scene
- KHÔNG có voice/text overlays - pure visual transformation

📹 CAMERA:
- Early scenes: Static or slow push
- Transform scene: Quick zoom in during sparkle
- Final scene: Pull back to reveal full transformation`;
         } else if (cinematicStyle === 'fashion_walkin') {
            // Walk-In Mode với các tùy chọn chi tiết
            const walkinVariantText = walkinVariant === 'auto' ? 'AI Auto-select phù hợp với outfit' :
                                       walkinVariant === 'classical' ? 'Nàng thơ đi dạo - Classical elegance, no hook, natural fade' :
                                       'Digital Modern - Urban energy, TikTok trending';
            
            const timeOfDayText = walkinTimeOfDay === 'auto' ? 'AI Auto-select lighting' :
                                  walkinTimeOfDay === 'golden_hour' ? 'Golden Hour (5-7PM) - Warm amber rim light' :
                                  walkinTimeOfDay === 'blue_hour' ? 'Blue Hour (6-7AM/7-8PM) - Cool twilight glow' :
                                  'City Night - Urban neon lights, bokeh background';
            
            const vibeText = walkinVibe === 'auto' ? 'AI detect outfit → auto vibe' :
                             walkinVibe === 'romantic' ? 'Romantic - Soft, warm, feminine energy' :
                             walkinVibe === 'power' ? 'Power - Strong, confident, boss energy' :
                             walkinVibe === 'goddess' ? 'Goddess - Elevated, majestic, commanding presence' :
                             walkinVibe === 'minimal' ? 'Minimal - Clean, modern, understated elegance' :
                             'Allure - Magnetic, captivating, subtle intrigue';
            
            const personalityText = walkinPersonality === 'auto' ? 'AI detect outfit → auto personality' :
                                    walkinPersonality === 'casual_natural' ? 'Casual Natural - Relaxed smile, easy-going walk' :
                                    walkinPersonality === 'shy_timid' ? 'Shy Timid - Gentle gaze down, soft movements' :
                                    walkinPersonality === 'confident_bold' ? 'Confident Bold - Direct eye contact, powerful stride' :
                                    'Playful Flirty - Mischievous smile, light bounce';

            cinematicStyleInstructions = `\n\n👗 CINEMATIC STYLE: Fashion Walk-In
Model bước về phía camera - Cinematic fashion approach - Quiet allure, confident energy.

🎬 VARIANT: ${walkinVariantText}
☀️ LIGHTING: ${timeOfDayText}
🎨 VIBE: ${vibeText}
👤 PERSONALITY: ${personalityText}

📹 CAMERA SETUP:
- ANGLE: Eye-level to slightly low (flattering)
- FRAMING: Start full-body, end medium shot
- MOVEMENT: Slow push-in OR static with model approaching
- DISTANCE: Start 4-5m, end 1.5-2m (intimate but safe)
- LENS: 50-85mm equivalent (natural compression)

🚶 WALK CHOREOGRAPHY:
- Scene 1 (0-8s): Model starts walking from distance, establishing shot
- Scene 2 (8-16s): Medium shot, confident stride, fabric movement visible
- Scene 3 (16-24s): Medium-close, upper body focus, expression clear
- Scene 4 (24-32s): Close-up face/outfit detail OR final pose

💃 MODEL BEHAVIOR:
- Natural walking pace (NOT fashion runway speed)
- Arms swing naturally at sides
- Occasional hair touch or outfit adjustment
- Gaze: Straight to camera (confident) OR slightly away (mysterious)
- Expression: Subtle smile or calm confidence (không cười giả)

${walkinVariant === 'classical' ? `\n🌸 CLASSICAL VARIANT SPECIFIC:
- NO viral hooks, NO CTA, NO text overlays
- Pure cinematic beauty, artistic approach
- Fade out naturally at end (không cần closing CTA)
- Focus on elegance, grace, timeless aesthetics
- Music suggestion: Classical piano, ambient strings` : ''}

${walkinVariant === 'digital' ? `\n⚡ DIGITAL VARIANT SPECIFIC:
- Optional: Subtle digital glitch effects
- Modern color grading (teal-orange, high contrast)
- Urban backgrounds preferred
- Trending TikTok-style energy
- Music suggestion: Electronic, modern beats` : ''}`;
         } else if (cinematicStyle === 'marketing_intimate') {
            cinematicStyleInstructions = `\n\n📢 CINEMATIC STYLE: Marketing Fashion Foundations
Professional fashion foundations advertising - TikTok-safe approach for delicate wear.

⚠️ TIKTOK-SAFE PRIORITIES:
1. Professional styling (không phản cảm)
2. Focus on comfort, fit, quality (không focus vào body)
3. Use safe vocabulary (elegant silhouette, supportive design, comfortable fit)

🎬 SHOT TYPES:
- Scene 1: Product showcase (mannequin hoặc flatlay) - establish quality
- Scene 2: Fit demonstration (model wearing under sheer robe/shirt) - TikTok safe
- Scene 3: Fabric/detail close-up (ren, dây, material quality)
- Scene 4: Lifestyle context (getting ready, bedroom aesthetic but SFW)

📦 PRODUCT FOCUS:
- Lighting: Soft, flattering but not moody
- Background: Clean, professional (white studio hoặc minimal setting)
- Props: Minimal (mirror, hanger, packaging)
- Model behavior: Confident, checking fit in mirror (editorial poses only)

💬 MARKETING APPROACH:
- Hook: "Support top tốt nhất cho mọi outfit" / "Gen nịt eo size nào cũng vừa"
- USP: Comfortable, invisible under clothes, affordable luxury
- Social proof: Reviews, before-after fit comparison
- CTA: Link ghim, discount code, bundle deals

✅ SAFE VOCABULARY:
- Elegant silhouette, supportive construction, comfortable design
- Flattering fit, invisible lines, breathable fabric
- Fashion-forward, editorial quality, professional catalog aesthetic`;
         } else if (cinematicStyle === 'try_on') {
            const tryOnScenes = scenes;
            const tryOnVariantText = tryOnVariant === 'auto' ? 'AI Auto-select phù hợp với product type' :
                                    tryOnVariant === 'fitting_room' ? 'Fitting Room — Phòng thử đồ, door/curtain reveal' :
                                    tryOnVariant === 'home_tryon' ? 'Home Try-On — Thử đồ ở nhà, cozy lifestyle' :
                                    tryOnVariant === 'haul_review' ? 'Haul Review — Review nhiều món, rating format' :
                                    tryOnVariant === 'mix_match' ? 'Mix & Match — 1 item nhiều cách phối' :
                                    tryOnVariant === 'outfit_battle' ? 'Outfit Battle — So sánh 2+ outfit, vote engagement' :
                                    'Loosely Draped — Mặc hờ / thả hờ, effortless chic editorial';
            
            const tryOnTransitionText = tryOnTransition === 'auto' ? 'AI selects best transition for variant' :
                                       tryOnTransition === 'door_reveal' ? 'Door Reveal — Mở cửa phòng thử, step out' :
                                       tryOnTransition === 'curtain_pull' ? 'Curtain Pull — Kéo rèm reveal' :
                                       tryOnTransition === 'spin_change' ? 'Spin Change — Xoay 360° đổi outfit' :
                                       tryOnTransition === 'mirror_turn' ? 'Mirror Turn — Quay từ gương về camera' :
                                       tryOnTransition === 'snap_cut' ? 'Snap Cut — Búng tay/vỗ tay jump cut' :
                                       'Fabric Slide — Vải trượt rơi khỏi vai, drape on mới';

            const tryOnPacingText = tryOnPacing === 'auto' ? 'AI selects based on duration & number of outfits' :
                                   tryOnPacing === 'quick_fire' ? 'Quick Fire — ~4s/outfit, 2 outfits per scene, beat-synced, minimal voice' :
                                   tryOnPacing === 'detailed_review' ? 'Detailed Review — 8s/outfit, full commentary, rating format' :
                                   'Storytelling — 8-16s/outfit, narrative weaving outfits into context';

            const outfitCount = tryOnPacing === 'quick_fire' ? tryOnScenes * 2 :
                               tryOnPacing === 'storytelling' ? Math.max(2, Math.ceil(tryOnScenes * 0.7)) :
                               tryOnScenes;

            cinematicStyleInstructions = `\n\n👗 CINEMATIC STYLE: Thử Đồ / Try-On (${finalDuration}s)
Virtual try-on & outfit change — TikTok trending format, multiple outfits per video.

🎭 VARIANT: ${tryOnVariantText}
🔄 TRANSITION: ${tryOnTransitionText}
⏱️ PACING: ${tryOnPacingText}
👗 ESTIMATED OUTFITS: ${outfitCount} outfits in ${finalDuration}s (${tryOnScenes} scenes)

📹 CAMERA SETUP:
- POSITION: Tripod, eye-level to slightly above (flattering)
- FRAME: Full body visible, ~20% headroom, SAME framing for ALL outfits
- LENS: 35-50mm equivalent (natural, no distortion)
- CONSISTENCY: Same background, lighting, model appearance across all scenes

👗 INITIAL OUTFIT (trước khi thay):
Model bắt đầu video ${getRandomBeforeOutfit()} — trang phục "base" trước khi try-on.
Outfit này xuất hiện trong HOOK scene, tạo contrast rõ khi chuyển sang outfit đầu tiên.

🎬 SCENE STRUCTURE (${finalDuration}s — ${tryOnScenes} scenes):
- Scene 1 (0-8s): HOOK (0-3s) model mặc initial outfit ở trên + First outfit try-on (3-8s)
  Hook examples: "Thử ${outfitCount} set đồ hot nhất!" / "${outfitCount} outfit dưới 300K"
- Scenes 2-${tryOnScenes - 1}: Individual outfit try-on per scene
  Each: Transition → Outfit reveal → Pose/showcase → Voice review
- Scene ${tryOnScenes} (last 8s): BEST PICK highlight + CTA

🔄 TRANSITION CHOREOGRAPHY:
${tryOnTransition === 'door_reveal' || tryOnVariant === 'fitting_room' ? '- Door opens outward → model steps out in new outfit → confident pause → mirror check' : ''}
${tryOnTransition === 'curtain_pull' ? '- Hand pulls curtain aside → model revealed → pose → twirl' : ''}
${tryOnTransition === 'spin_change' || tryOnVariant === 'home_tryon' ? '- Model spins 360° → cut on back-facing → new outfit on completion' : ''}
${tryOnTransition === 'mirror_turn' ? '- Model checks mirror → turns to camera → full outfit reveal' : ''}
${tryOnTransition === 'snap_cut' || tryOnVariant === 'haul_review' ? '- Model snaps fingers → instant jump cut → new outfit' : ''}
${tryOnTransition === 'fabric_slide' || tryOnVariant === 'loosely_draped' ? '- Fabric slides off shoulder in slow-mo → cut → new garment draped on, shallow depth-of-field' : ''}
${tryOnTransition === 'auto' ? '- AI selects natural transition matching variant and outfit type' : ''}

💬 VOICE PATTERN:
${tryOnPacing === 'quick_fire' ? '- SHORT reactions per outfit: "Yêu!", "Hmm...", "9 điểm!", "YES!"' : ''}
${tryOnPacing === 'detailed_review' || tryOnVariant === 'haul_review' ? '- FULL review per outfit: Fabric comment → Fit comment → Rating X/10' : ''}
${tryOnPacing === 'storytelling' ? '- NARRATIVE: "Sáng đi làm set này...", "Chiều đi cafe...", "Tối đi date..."' : ''}
${tryOnPacing === 'auto' ? '- Voice matches pacing: quick reactions for fast pace, detailed reviews for slow pace' : ''}

${tryOnVariant === 'mix_match' ? `\n🔀 MIX & MATCH SPECIFIC:
- Show base item(s) first → then combine with different pieces each scene
- Voice: "Cùng 1 chiếc [item] mà phối ${outfitCount} set khác nhau!"
- Show versatility: casual → office → date → party` : ''}

${tryOnVariant === 'outfit_battle' ? `\n⚔️ OUTFIT BATTLE SPECIFIC:
- IDENTICAL framing for fair comparison
- Voice: "Team 1 hay Team 2?" / "Set nào đẹp hơn?"
- End with vote CTA: "Comment bên nào bạn chọn!"
- Each outfit gets equal screen time` : ''}

${tryOnVariant === 'loosely_draped' ? `\n👘 MẶC HỜ / LOOSELY DRAPED SPECIFIC:
- DRAPING STYLES: Shoulder drape (khoác hờ 1 vai), Open layer (mở không cài), Half-tuck (nhét hờ 1 bên), Wrap casual (quấn lỏng), Thrown-on (quăng lên người)
- CAMERA: Shallow depth-of-field (fabric detail sharp, background soft), warm morning/golden light
- MOTION: Slow gentle movements — fabric naturally sliding, catching light, cascading
- FOCUS PULL: Face → fabric drape detail → full silhouette
- EACH SCENE: Different draping style with same OR different garment
- FABRIC SOUNDS: Veo 3.1 native audio — fabric rustling, soft sliding sounds
- MOOD: Nonchalant elegance, effortless editorial
- DO: Natural casual gestures (adjust collar, run hand through hair, hold coffee)
- PRODUCT FOCUS: Show how fabric drapes, falls, moves — selling point is the "effortless" look` : ''}

${(() => {
   const pt = productType.toLowerCase();
   // Garment-specific try-on choreography
   const garmentChoreography: Record<string, string> = {
      // DRESS GROUP
      dress: `👗 GARMENT CHOREOGRAPHY — DRESS:
- REVEAL: Model bước ra, hai tay nhẹ nắm vạt váy
- SHOWCASE: Twirl 360° (fabric tung bay), walk 3-4 bước (xem flow), đứng yên để vải rơi tự nhiên
- DETAIL CLOSE-UP: Hem flutter, fabric drape, waist seam, neckline
- FIT TEST: Walk (vải có vướng?), Sit (dài/ngắn ok?), Spin (fabric flow)
- ANGLES: Full-body front → side walk → back reveal → twirl medium shot
- Veo: "Model twirls gracefully, flowing skirt catches light, fabric cascading, walks forward showing dress movement"`,
      maxi_dress: `👗 GARMENT CHOREOGRAPHY — MAXI DRESS:
- REVEAL: Model bước ra, vải dài chạm sàn, tay nắm nhẹ vạt
- SHOWCASE: Walk chậm (xem fabric trail), twirl (vải bay rộng), stand yên (drape tự nhiên)
- DETAIL CLOSE-UP: Hem length floor-touch, fabric cascade, waist, neckline
- FIT TEST: Walk (hem có quét sàn?), Spin slow (flow test), Sit (bunching?)
- ANGLES: Full body → walk side (trail) → twirl → hem close-up
- Veo: "Model in maxi dress walks slowly, fabric trailing gracefully, then twirls showing full skirt volume"`,
      mini_dress: `👗 GARMENT CHOREOGRAPHY — MINI DRESS:
- REVEAL: Confident step out — hands on hips, energy cao
- SHOWCASE: Side profile (silhouette), hip sway nhẹ, turn show back, walk 2-3 bước
- DETAIL CLOSE-UP: Hem length, stretch fabric, seam lines, side view
- FIT TEST: Sit-stand (có bị vén?), Arm raise (có kéo lên?), Side view (body curve)
- ANGLES: Medium front → side profile → back → sit check
- Veo: "Model in mini dress turns slowly showing side silhouette, runs hand along hip, walks confidently"`,
      bodycon: `👗 GARMENT CHOREOGRAPHY — BODYCON:
- REVEAL: Bước ra từ từ, confident — focus silhouette
- SHOWCASE: 90° turn (side profile — QUAN TRỌNG), slow walk, mirror check, smooth hand along body
- DETAIL CLOSE-UP: Body curve silhouette, fabric stretch, waist fit, neckline
- FIT TEST: Breathe deep (stretch), arm raise, sit-stand, squat test
- ANGLES: Front medium → side profile (CRITICAL!) → back → mirror reflection
- Veo: "Model in bodycon stands side-on showing fitted silhouette, turns forward, runs hand along waistline"`,
      // TOP GROUP
      top: `👚 GARMENT CHOREOGRAPHY — TOP/BLOUSE:
- REVEAL: Cầm áo trước ngực → cut → đã mặc, chỉnh cổ/tay
- SHOWCASE: Collar adjust, tuck-in/untuck demo, sleeve roll, back turn
- DETAIL CLOSE-UP: Collar shape, button line, fabric texture, sleeve, back fit
- FIT TEST: Arm raise (fit nách/vai?), tuck in (dáng tucked?), lean forward (rộng/chật?)
- ANGLES: Front bust-up → full body tucked → untucked → back
- Veo: "Model adjusts collar, tucks front into waistband showing both styled looks, touches sleeve cuff detail"`,
      blouse: `👔 GARMENT CHOREOGRAPHY — BLOUSE/SƠ MI:
- REVEAL: Đã mặc sẵn, chỉnh cổ áo, tay áo
- SHOWCASE: Collar adjust, button open/close 1 nút, tuck-in demo, sleeve roll up
- DETAIL CLOSE-UP: Collar shape, button line, cuff detail, fabric texture
- FIT TEST: Arm raise, tuck in, lean forward, side view (form)
- ANGLES: Bust-up front → tucked full body → untucked → side
- Veo: "Model in blouse adjusts collar, rolls sleeves to elbow, tucks front showing styled look"`,
      tshirt: `👕 GARMENT CHOREOGRAPHY — T-SHIRT:
- REVEAL: Pull on (overhead) hoặc casual step out
- SHOWCASE: Front print/logo show, tug hem, sleeve fit pat, casual arm cross
- DETAIL CLOSE-UP: Print/logo, neckline ribbing, sleeve fit, fabric weight
- FIT TEST: Arm raise (độ dài?), pull hem (stretch?), side view (form?)
- ANGLES: Front focus print → side (fit) → casual pose
- Veo: "Model wearing tshirt casually tugs at hem, shows front graphic, crosses arms with relaxed smile"`,
      croptop: `👙 GARMENT CHOREOGRAPHY — CROPTOP:
- REVEAL: Confident — hand on waist, midriff visible
- SHOWCASE: Arm raise (show crop length), pair demo high-waist bottom, dance sway
- DETAIL CLOSE-UP: Crop hem line, neckline, back detail, midriff line
- FIT TEST: Arm up (ride-up?), dance sway, pair different bottoms
- ANGLES: Medium front → close crop line → full body with bottom → fun pose
- Veo: "Model in croptop raises arms showing crop length, pairs with high-waist jeans, hands on hips"`,
      sweater: `🧥 GARMENT CHOREOGRAPHY — SWEATER/ÁO LEN:
- REVEAL: Đang ôm sweater → cut → đã mặc, kéo tay áo dài
- SHOWCASE: Cozy hug gesture, sleeve stretch over hands, collar detail, layer demo
- DETAIL CLOSE-UP: Knit texture, weave pattern, ribbing, cuff detail, thickness
- FIT TEST: Arm stretch (chất liệu?), layer over shirt, hug self (cozy fit)
- ANGLES: Front cozy → close-up knit → layering demo → full body
- Veo: "Model in sweater pulls sleeves over hands cozy gesture, hugs self, shows knit texture to camera"`,
      jacket: `🧥 GARMENT CHOREOGRAPHY — JACKET/ÁO KHOÁC:
- REVEAL: Khoác từ sau → zip/button → spread arms
- SHOWCASE: Open-close (cài/mở), shoulder check, collar pop, arms out, drape off 1 shoulder
- DETAIL CLOSE-UP: Zipper/button, collar, pocket, lining (lật ra), shoulder seam
- FIT TEST: Zip up/down (snug?), arm raise (mobility?), reach behind (fit vai?)
- ANGLES: Front open → front closed → side shoulder → back
- Veo: "Model puts on jacket, zips up, pats shoulders checking fit, unzips showing inner layer, turns showing back"`,
      // BOTTOM GROUP
      pants: `👖 GARMENT CHOREOGRAPHY — QUẦN DÀI:
- REVEAL: Camera focus eo xuống → pan up full body
- SHOWCASE: Walk 4-5 bước (drape/leg), side profile (form), pocket pat, waistband pull
- DETAIL CLOSE-UP: Waistband fit, pocket stitching, hem break, knee area
- FIT TEST: Squat test (stretch?), walk (baggy/tight?), sit (waist gap?), side view (thigh fit?)
- ANGLES: Front full body → side profile (CRITICAL cho quần) → back pocket → walk-away
- Veo: "Model in pants walks forward, camera shows leg drape, turns side-on showing fit, pats front pockets"`,
      jeans: `👖 GARMENT CHOREOGRAPHY — JEANS:
- REVEAL: Confident walk in, denim texture visible
- SHOWCASE: Walk (xem drape), side profile, pocket detail, waistband, back pocket
- DETAIL CLOSE-UP: Denim wash, pocket stitching, waistband, hem/ankle, distress detail
- FIT TEST: Squat deep (stretch?), walk (stiff/flexible?), sit (waist gap?), side (thigh fit?)
- ANGLES: Front → side profile → back (pocket stitching) → squat test
- Veo: "Model in jeans walks showing denim drape, turns for side profile, does squat test demonstrating stretch"`,
      wide_pants: `👖 GARMENT CHOREOGRAPHY — QUẦN ỐNG RỘNG:
- REVEAL: Walk in — ống quần tung bay
- SHOWCASE: Walk stride (ống rộng sway), spin nhẹ (fabric flow), stand wide
- DETAIL CLOSE-UP: Leg width, fabric drape, waistband, hem length
- FIT TEST: Walk with purpose (flow?), spin (fan effect?), stand still (fall/drape?)
- ANGLES: Front full body → walking side → spin → close-up leg flow
- Veo: "Model in wide-leg pants walks with long strides, wide legs flowing naturally, spins showing full width"`,
      shorts: `🩳 GARMENT CHOREOGRAPHY — SHORTS:
- REVEAL: Casual step out, hands in pockets
- SHOWCASE: Walk, one knee up on ledge, sit casual, leg movement
- DETAIL CLOSE-UP: Hem length, waistband, pocket, fit
- FIT TEST: Sit (ride-up?), walk (comfortable?), step up (length?)
- ANGLES: Front full body → side (length) → casual pose
- Veo: "Model in shorts walks casually, steps up on ledge showing length, stands with hands in pockets"`,
      skirt: `👗 GARMENT CHOREOGRAPHY — CHÂN VÁY:
- REVEAL: Bước ra, tay nhẹ nắm vạt váy
- SHOWCASE: Mini twirl (flow), walk (movement), sit-cross legs, slit reveal (nếu có)
- DETAIL CLOSE-UP: Waistband, hem line, pleats/folds, fabric drape
- FIT TEST: Walk (twist?), twirl (flow?), sit (coverage?), side view (shape?)
- ANGLES: Front full body → twirl medium → side sit → back
- Veo: "Model in skirt does gentle half-twirl, skirt sways, walks showing movement, checks waistband fit"`,
      // SET GROUP
      set: `🎽 GARMENT CHOREOGRAPHY — BỘ ĐỒ/SET:
- REVEAL: Show top alone → bottom alone → cut → full set
- SHOWCASE: Point top → point bottom, 360° full body, separate demo, mix suggestion
- DETAIL CLOSE-UP: Top-bottom junction, individual piece, color coordination
- FIT TEST: Top fit → bottom fit → overall proportion → walk full set
- ANGLES: Top half → bottom half → full body front → full body 360°
- Veo: "Model first shows top piece, then bottom, then wearing complete set spins 360 showing coordination"`,
      suit: `🤵 GARMENT CHOREOGRAPHY — SUIT/VEST:
- REVEAL: Button jacket walking in, power stance
- SHOWCASE: Button/unbutton jacket, lapel touch, straighten collar, power walk
- DETAIL CLOSE-UP: Lapel shape, button, pocket square, shoulder line, trouser crease
- FIT TEST: Button test (snug?), sit (wrinkle?), arm raise (shoulder?), walk (drape?)
- ANGLES: Front power pose → side shoulder → back → walking
- Veo: "Model in suit buttons jacket confidently, adjusts lapels, takes power-walk steps, sharp tailored silhouette"`,
      jumpsuit: `🥻 GARMENT CHOREOGRAPHY — JUMPSUIT:
- REVEAL: Zip up one motion
- SHOWCASE: Walk (silhouette), belt adjust, turn back detail, arms out
- DETAIL CLOSE-UP: Zipper, waist area, neckline, back detail, belt/sash
- FIT TEST: Walk (drape?), sit (comfort?), arm raise (stretch?), bend (waist?)
- ANGLES: Front full body → side silhouette → back closure → walk
- Veo: "Model in jumpsuit walks forward showing silhouette, adjusts belt at waist, turns showing back detail"`,
      // SPECIAL GROUP
      aodai: `🌸 GARMENT CHOREOGRAPHY — ÁO DÀI:
- REVEAL: Walk in — vạt áo dài bay nhẹ, tay nắm nhẹ 1 vạt
- SHOWCASE: Walk chậm (panels flutter), stand gió nhẹ, thả 2 tay sang 2 bên, quay 90°
- DETAIL CLOSE-UP: Panel length, embroidery, collar (cổ tàu), waist fit, fabric flow
- FIT TEST: Walk straight (panels bay?), arm raise (fit body?), side view (silhouette?)
- ANGLES: Full body front → walking panels flutter → side → embroidery detail
- Veo: "Model in ao dai walks slowly, traditional panels flowing with each step, hand gently holding panel edge"`,
      sport: `🏃 GARMENT CHOREOGRAPHY — ĐỒ THỂ THAO:
- REVEAL: Active entrance — jog in, jump, dynamic
- SHOWCASE: Stretch arm/leg, jog in place, squat, jump, active pose
- DETAIL CLOSE-UP: Fabric stretch, breathability mesh, elastic band, reflective detail
- FIT TEST: Squat deep (stretch?), arm raise (mobility?), jump (support?), run (comfort?)
- ANGLES: Action front → stretch close-up → active side → full body dynamic
- Veo: "Model in sportswear does warm-up stretches, squats showing fabric stretch, jogs with energetic smile"`,
      sleepwear: `🌙 GARMENT CHOREOGRAPHY — ĐỒ NGỦ/LOUNGEWEAR:
- REVEAL: Just woke up vibe — stretch, yawn gesture, cozy walk
- SHOWCASE: Stretch arms up, cozy wrap, sit on bed edge, coffee hold
- DETAIL CLOSE-UP: Fabric softness, lace/trim, tie/belt, button detail
- FIT TEST: Stretch (comfortable?), sit lounge (drape?), walk lazy (cozy?)
- ANGLES: Medium cozy → full body standing → lounging → fabric detail
- Veo: "Model in sleepwear stretches lazily, sits on bed edge with coffee, touches soft fabric with content smile"`,
      bikini: `👙 GARMENT CHOREOGRAPHY — BIKINI/ĐỒ BƠI:
- REVEAL: Confident walk in, resort editorial style
- SHOWCASE: Confident pose, light turn, hand on hip, walk 2-3 steps
- DETAIL CLOSE-UP: Strap design, pattern, hardware, coverage line
- FIT TEST: Arm raise (support?), walk (comfortable?), turn (back?)
- ANGLES: Front medium → side → back (tasteful) → strap detail
- Veo: "Model in swimwear walks poolside, confident hand-on-hip pose, turns showing side silhouette"`,
      bigsize: `✨ GARMENT CHOREOGRAPHY — BIG SIZE:
- REVEAL: Confident entrance — smile, comfortable body language
- SHOWCASE: Comfortable walk, twirl (flow cho loose items), confidence pose
- DETAIL CLOSE-UP: Fabric drape, size-inclusive fit, comfort, stretch panels
- FIT TEST: Walk (drape?), sit (không bó?), arm raise (mobility?), smile (confidence!)
- ANGLES: Full body front → flattering 3/4 angle → side → comfortable pose
- Veo: "Model walks confidently, shows comfortable fit, genuine smile, twirls showing fabric drape beautifully"`,
      lingerie: `🎀 GARMENT CHOREOGRAPHY — INNER/FOUNDATION:
- REVEAL: Outfit as shown in reference (tasteful editorial)
- SHOWCASE: Smooth silhouette check, fabric quality, construction detail
- DETAIL CLOSE-UP: Construction, fabric quality, support structure
- FIT TEST: Comfortable posture, smooth lines under clothing demo
- ANGLES: Medium front → side → detail construction
- Veo: "Model showcases supportive construction, smooth silhouette, professional catalog aesthetic"`
   };
   // Map aliases
   garmentChoreography['combo'] = garmentChoreography['set'];
   
   // 💄 BEAUTY & CARE PRODUCT CHOREOGRAPHY
   garmentChoreography['facial_device'] = `🧴 PRODUCT CHOREOGRAPHY — FACIAL DEVICE:
- UNBOX: Lift device from premium packaging, show build quality + weight
- DEMO: Apply to face — forehead, cheeks, jawline sequence (show technique)
- DETAIL: Close-up device head/bristles, LED indicators, charging port
- RESULT: Before/after skin texture comparison, luminous skin close-up
- ANGLES: Product hero shot → application demo → result evidence
- Veo: "Model gently glides facial device across cheek, soft LED glow, clean bathroom lighting, skincare routine video"`;
   garmentChoreography['serum'] = `💧 PRODUCT CHOREOGRAPHY — SERUM/ESSENCE:
- DISPLAY: Hold bottle to camera, show texture through glass, label details
- APPLICATION: Dropper → palm → pat onto face, show absorption speed
- DETAIL: Macro close-up of serum texture, droplet on skin, dewy finish
- RESULT: Skin glow comparison, touch face to show smooth texture
- ANGLES: Product hero → application sequence → skin result macro
- Veo: "Model applies serum drops to fingertips, gently pats onto face, skin glistening under soft ring light, beauty routine"`;
   garmentChoreography['makeup'] = `💄 PRODUCT CHOREOGRAPHY — MAKEUP (Son/Cushion/Phấn):
- SWATCH: Arm swatch showing true color, blend demo
- APPLICATION: Apply to lips/face with proper technique, show coverage
- DETAIL: Macro product texture, packaging open/close mechanism
- RESULT: Full face result, different angles catching light
- ANGLES: Product packaging → swatch → application → final look
- Veo: "Model applies lipstick with confident smile, presses lips together, checks mirror, satisfied expression, beauty tutorial energy"`;
   garmentChoreography['body_shaper'] = `🩱 PRODUCT CHOREOGRAPHY — BODY SHAPER/GEN NỊT:
- DISPLAY: Show product structure, elasticity test (stretch & snap back)
- COMPARE: Side-by-side silhouette — without vs with product
- DETAIL: Close-up material quality, stitching, compression zones
- COMFORT: Movement test — sit, bend, walk naturally while wearing
- ANGLES: Product flat → wearing side view → movement demo → before/after
- Veo: "Split comparison showing silhouette difference, model moves comfortably, smooth fabric under clothing, natural demonstration"`;
   garmentChoreography['massage_device'] = `✨ PRODUCT CHOREOGRAPHY — MASSAGE DEVICE:
- UNBOX: Premium reveal, show attachments/heads variety
- DEMO: Use on target area (neck/face/body), show vibration levels
- DETAIL: Close-up attachment heads, control panel, build quality
- REACTION: Relaxation expression, genuine comfort feedback
- ANGLES: Product overview → in-use demo → detail → reaction
- Veo: "Model uses massage device on neck area, eyes closed with relaxed expression, soft ambient lighting, self-care content"`;
   garmentChoreography['skincare_set'] = `🧖 PRODUCT CHOREOGRAPHY — SKINCARE SET:
- DISPLAY: Arrange full set aesthetically, show each product
- ROUTINE: Step-by-step application sequence (cleanser → toner → serum → cream)
- DETAIL: Each product texture macro, ingredient highlights
- RESULT: Final luminous skin result, touch-test smoothness
- ANGLES: Set flatlay → step-by-step demo → skin result
- Veo: "Model applies skincare products in sequence, each step clean and deliberate, bathroom mirror, morning routine aesthetic"`;
   garmentChoreography['hair_device'] = `💇 PRODUCT CHOREOGRAPHY — HAIR DEVICE:
- DISPLAY: Show device + temperature settings, plate/barrel quality
- DEMO: Style hair section by section, show technique and result
- DETAIL: Close-up heat plate, steam, cord quality
- RESULT: Before/after hair comparison, bounce/curl test
- ANGLES: Device hero → sectioning → styling demo → final result
- Veo: "Model uses hair styling device, hair transforms from straight to beautiful curls, mirror reflection, getting-ready video"`;
   garmentChoreography['nail_beauty'] = `💅 PRODUCT CHOREOGRAPHY — NAIL BEAUTY:
- DISPLAY: Show colors/products arranged aesthetically
- APPLICATION: Step-by-step nail application technique
- DETAIL: Macro nail finish, color accuracy, texture
- RESULT: Finished nails showcase, hand poses showing design
- ANGLES: Product display → application → macro detail → styled hand poses
- Veo: "Close-up of elegant hand, freshly styled nails catching light, gentle hand movements showing nail art details"`;
   
   // 🏠 SMART HOME PRODUCT CHOREOGRAPHY
   garmentChoreography['robot_vacuum'] = `🤖 PRODUCT CHOREOGRAPHY — ROBOT VACUUM:
- UNBOX: Lift from box, show sensor array, charging dock setup
- DEMO: POV room sweep — robot navigating furniture, edge detection, carpet transition
- DETAIL: Close-up mopping pad, dustbin capacity, app control screen
- RESULT: Before/after floor comparison, dust collection evidence
- ANGLES: Product hero → room demo POV → detail → clean result
- Veo: "Robot vacuum glides across living room floor, navigating chair legs smoothly, clean path visible behind it, smart home demo"`;
   garmentChoreography['air_purifier'] = `🌬️ PRODUCT CHOREOGRAPHY — AIR PURIFIER:
- DISPLAY: Show unit design, filter system reveal, air quality display
- DEMO: Power on sequence, airflow visualization (fabric ribbon/smoke), noise levels
- DETAIL: Close-up filter layers, air quality sensor, control panel
- RESULT: Air quality number improvement on display
- ANGLES: Product hero → filter reveal → operation demo → results
- Veo: "Air purifier powers on with gentle hum, air quality display showing numbers improving, clean modern living room"`;
   garmentChoreography['smart_kitchen'] = `🍳 PRODUCT CHOREOGRAPHY — SMART KITCHEN:
- DISPLAY: Product hero shot, show controls, capacity
- DEMO: Cook a quick item from start to finish (oil-free frying, steaming, etc.)
- DETAIL: Close-up cooking chamber, temperature display, timer
- RESULT: Finished food reveal, golden crispy/perfectly cooked outcome
- ANGLES: Product overview → ingredients in → cooking process → food reveal
- Veo: "Smart kitchen appliance in action, steam rising, timer counting down, finished food lifted out looking perfectly cooked"`;
   garmentChoreography['water_purifier'] = `💧 PRODUCT CHOREOGRAPHY — WATER PURIFIER:
- DISPLAY: Full unit, show filter stages, water temperature options
- DEMO: Pour water, show filtration speed, temperature switching
- DETAIL: Close-up filter cross-section, TDS meter comparison (tap vs filtered)
- RESULT: Crystal clear water in glass, taste test reaction
- ANGLES: Unit overview → filter detail → pour demo → water quality test
- Veo: "Crystal clear water pours from purifier into glass, light refracting through water, clean kitchen countertop"`;
   garmentChoreography['smart_fan'] = `❄️ PRODUCT CHOREOGRAPHY — SMART FAN/AC:
- DISPLAY: Show unit design, oscillation range, remote/app control
- DEMO: Power on, show airflow (hair/ribbon movement), speed levels
- DETAIL: Close-up motor, blade design, noise level demonstration
- RESULT: Comfort demonstration, temperature comparison
- ANGLES: Product hero → operation → airflow demo → comfort result
- Veo: "Smart fan oscillating smoothly, gentle breeze moving curtain fabric, peaceful bedroom setting, comfortable ambient"`;
   garmentChoreography['smart_light'] = `💡 PRODUCT CHOREOGRAPHY — SMART LIGHT:
- DISPLAY: Show light design, packaging, size reference
- DEMO: Scene changes — warm reading → bright working → ambient mood → party color
- DETAIL: Close-up LED quality, app control screen, dimming levels
- RESULT: Room ambiance transformation before/after
- ANGLES: Product → installation → scene demos → room transformation
- Veo: "Room lighting transforms from warm cozy glow to bright white to ambient purple, smart light changing colors smoothly"`;
   garmentChoreography['security_cam'] = `📹 PRODUCT CHOREOGRAPHY — SECURITY CAMERA:
- DISPLAY: Camera unit comparison to hand (size reference), mount hardware
- DEMO: App feed live view, night vision toggle, motion tracking demo
- DETAIL: Close-up lens, speaker/mic, weather resistance
- RESULT: Clear footage quality demo (day + night), motion alert notification
- ANGLES: Product hero → mounting → live feed demo → day/night comparison
- Veo: "Security camera mounted on wall, phone showing clear live feed, notification pops up with motion detection alert"`;
   garmentChoreography['smart_lock'] = `🔐 PRODUCT CHOREOGRAPHY — SMART LOCK:
- DISPLAY: Lock unit, show fingerprint pad, keypad, app
- DEMO: Fingerprint unlock → keypad code → app remote unlock → mechanical key backup
- DETAIL: Close-up fingerprint sensor, build quality, installation
- RESULT: Speed test (unlock in <1s), multiple user demo
- ANGLES: Product hero → unlock methods demo → detail → speed test
- Veo: "Finger touches smart lock sensor, green light confirmation, door opens smoothly, secure smart home entrance"`;
   garmentChoreography['cleaning_device'] = `🧹 PRODUCT CHOREOGRAPHY — CLEANING DEVICE:
- DISPLAY: Show main unit + attachments, suction modes
- DEMO: Clean different surfaces — hard floor, carpet, crevice, upholstery
- DETAIL: Close-up cyclone/filter, dustbin with collected debris
- RESULT: Before/after cleaning comparison, satisfying dirt collection
- ANGLES: Product overview → multi-surface demo → detail → before/after
- Veo: "Handheld vacuum cleaning sofa crevice, dust particles visible in light beam, satisfying cleaning demonstration"`;
   garmentChoreography['steam_device'] = `♨️ PRODUCT CHOREOGRAPHY — STEAM DEVICE:
- DISPLAY: Show device, water tank, steam nozzle
- DEMO: Steam a wrinkled garment — before wrinkled → steaming process → smooth result
- DETAIL: Close-up steam output, temperature, water capacity
- RESULT: Before/after fabric wrinkle comparison
- ANGLES: Product hero → wrinkled garment → steaming action → smooth result
- Veo: "Steam iron releasing steady steam onto wrinkled shirt, fabric smoothing out visibly, satisfying transformation"`;
   garmentChoreography['organizer'] = `📦 PRODUCT CHOREOGRAPHY — ORGANIZER:
- DISPLAY: Show product folded/flat, then assembled/opened
- DEMO: Load items into organizer, show capacity and fit
- DETAIL: Close-up material quality, zippers, dividers, labels
- RESULT: Before/after space — messy → organized transformation
- ANGLES: Product flat → assembly → loading demo → before/after
- Veo: "Hands placing items neatly into organizer compartments, satisfying organization transformation, clean minimalist space"`;
   garmentChoreography['pet_device'] = `🐾 PRODUCT CHOREOGRAPHY — PET DEVICE:
- DISPLAY: Show product, fill/assemble with pet food/water
- DEMO: Pet interacting with device (eating, drinking, playing), automatic function
- DETAIL: Close-up dispensing mechanism, app control, capacity
- RESULT: Happy pet, owner convenience, smart scheduling
- ANGLES: Product setup → pet interaction → detail mechanism → happy result
- Veo: "Cat approaching automatic feeder, food dispensing on schedule, pet eating happily, cozy home setting, pet care content"`;

   const choreo = garmentChoreography[pt];
   if (pt === 'auto') {
      return `\n👗 GARMENT CHOREOGRAPHY: AUTO-DETECT
- AI detect loại trang phục/sản phẩm từ reference image
- Map vào choreography phù hợp (dress → twirl, device → demo, appliance → before/after...)
- Nếu combo → ưu tiên item chính (dress > top > bottom) hoặc dùng set choreography
- MINIMUM mỗi outfit: walk + side profile + 1 detail close-up
- MINIMUM mỗi device: unbox + demo + detail + result`;
   }
   return choreo ? `\n${choreo}` : `\n👗 GARMENT CHOREOGRAPHY: AI detect từ ảnh, minimum: walk + side profile + detail close-up`;
})()}

🎯 CONVERSION HOOKS:
- Experience: "Set này mặc thoải mái lắm nè!"
- Rating bait: "Set nào đẹp nhất? Comment ngay!"
- Vote: "Bạn chọn set mấy? Comment ngay!"
- Social proof: "Mấy bạn mình cũng ưng set này!"`;
         } else if (cinematicStyle === 'asmr_cinematic') {
            cinematicStyleInstructions = `\n\n🎤 CINEMATIC STYLE: ASMR (${finalDuration}s)
Sound-driven affiliate content — fabric rustling, zipper sounds, texture close-ups.
Veo 3.1 native audio is PRIMARY content, visuals support the sound experience.

📹 CAMERA:
- 70% macro/extreme close-up (fabric weave, stitching, hardware)
- 20% medium close-up (hands interacting with product)
- 10% medium shot (product in context)
- Movement: STATIC or very slow push-in (stability = quality feel)
- Lighting: Soft warm directional, rim light on edges (texture depth)

🔊 AUDIO (CRITICAL — This is the star!):
- ⚠️ NO background music — sounds are the content
- Voice: Whisper/soft-spoken ONLY (nếu có)
- Each scene Veo prompt MUST describe sounds explicitly:
  "audible fabric rustling", "zipper sliding sound", "nails gently scratching surface"
- Sounds matching product type (see guide)

🎬 STRUCTURE (${finalDuration}s — ${scenes} scenes):
- Scene 1: SOUND HOOK (0-3s satisfying sound) + Product intro
- Scenes 2-${scenes - 1}: TEXTURE/DETAIL/SOUND exploration
  Each scene: Different sound trigger + macro close-up
- Scene ${scenes}: WEARING ASMR (close-up adjustments) + whisper CTA

🎯 ASMR RULES:
- SLOW, DELIBERATE movements only
- Each shot minimum 3-5s (NO rapid cuts)
- Sound purpose for EVERY shot
- Whisper CTA: "(soft) Link ghim phía trên nha..."
- Background: Dark or neutral blur`;
         } else if (cinematicStyle === 'storytelling') {
            const storyScenes = scenes;
            const storyAct2End = storyScenes - 1;
            cinematicStyleInstructions = `\n\n📖 CINEMATIC STYLE: Storytelling (${finalDuration}s)
Narrative-driven affiliate — product appears naturally in a STORY.
Not "quảng cáo" but "cuộc sống có sản phẩm" — trust-building → organic conversion.

📖 3-ACT NARRATIVE:
ACT 1 — SETUP (Scene 1, ~8s):
- Establish relatable context (where, when, why)
- Plant the NEED ("Hôm nay có hẹn, mặc gì nhỉ?")
- Camera: Wider establishing shots, lifestyle context

ACT 2 — JOURNEY (Scenes 2-${storyAct2End}, ${(storyAct2End - 1) * 8}s):
- Product discovery / getting ready / experiencing
- Show product IN CONTEXT — living, not just wearing
- Emotional peak: "The moment it clicks"
- Camera: Mix lifestyle + product detail close-ups

ACT 3 — RESOLUTION (Scene ${storyScenes}, ~8s):
- Beautiful payoff: confidence achieved through product
- Soft CTA woven into narrative closure
- Camera: Beautiful closing shot, editorial quality

📹 CAMERA:
- 60% handheld (authentic, following a real person)
- 30% steady cam (product highlight shots)
- 10% detail close-ups
- Lighting: NATURAL preferred (window, outdoor ambient)
- Settings: REAL locations (bedroom, cafe, street)

💬 VOICE:
- ESSENTIAL in storytelling mode
- Tone: Best friend telling about their day (conversational)
- Language: First person casual Vietnamese
- AVOID: "Mua ngay!", "Flash sale!" (too salesy, breaks story)

🎯 STORYTELLING RULES:
- Story FIRST — product is a character IN the story
- Pace: Slower than standard, let moments breathe
- CTA: SOFT ONLY — woven into narrative, never break story
- Product screen time: ~50-60% (rest is story context)
- Emotional arc REQUIRED`;
         } else if (cinematicStyle === 'unboxing') {
            cinematicStyleInstructions = `\n\n📦 CINEMATIC STYLE: Unboxing (${finalDuration}s)
Cinematic unboxing — package arrival → dramatic opening → product reveal → first impression.
Not bình thường unbox — đây là PREMIUM REVEAL EXPERIENCE.
Impulse trigger: "Tôi cũng muốn có trải nghiệm này!"

📦 UNBOXING FLOW:
1. PACKAGE (0-2s): Show package exterior, build anticipation
2. OPENING: Slow deliberate — tape peeling, tissue crinkling, each layer
3. REVEAL: Product hero moment — lift out, first full view, genuine reaction
4. INSPECTION: Close-up quality — stitching, fabric, hardware, color accuracy
5. TRY-ON: First time wearing — mirror reaction, fit check
6. VERDICT: Rating + recommendation + CTA

🎬 STRUCTURE (${finalDuration}s — ${scenes} scenes):
- Scene 1 (0-8s): HOOK + Package opening
  Hook: "Shopee ship về!" / "Haul [price]K có gì?"
  Satisfying opening sounds (Veo native audio)
- Scenes 2-${Math.max(2, scenes - 2)}: REVEAL + DETAIL INSPECTION
  Lift product → touch fabric → quality close-ups
  Genuine reactions throughout
- Scene ${scenes - 1 > 1 ? scenes - 1 : scenes}: TRY-ON first impression
  Quick wear, mirror check, fit assessment
- Scene ${scenes}: VERDICT + CTA
  "Overall [X]/10 — đáng tiền!"

📹 CAMERA:
- Opening: Top-down (bird's eye for clean package angle)
- Reveal: Eye-level or slightly below (hero shot)
- Detail: Macro close-up at 45° (texture visible)
- Try-on: Full body mirror or tripod front
- Lighting: Bright, accurate color (product looks real)

🔊 AUDIO:
- Phase 1-2: Packaging sounds AMPLIFIED (tape, paper, box)
- Phase 3-4: Fabric interaction sounds
- NO music during opening (sounds are content)
- Music OK during try-on/verdict scenes

🎯 UNBOXING RULES:
- BUILD ANTICIPATION — không mở ngay
- Sound matters — Veo prompt MUST describe opening sounds
- GENUINE reactions (honest if product disappoints)
- Close-up quality shots MANDATORY
- Try-on is REQUIRED (unbox without try-on = incomplete)

👗 OUTFIT LOGIC — CRITICAL:
⚠️ Model KHÔNG được mặc sản phẩm trong scenes mở hộp!
- Scenes 1-4 (Package → Opening → Reveal → Inspection): Model mặc BEFORE OUTFIT — chọn 1 trong các outfit sau:
${getBeforeOutfitList()}
- Scene TRY-ON (gần cuối): Model MỚI mặc sản phẩm lần đầu → mirror reaction
- Scene VERDICT (cuối): Model đã mặc sản phẩm → rating + CTA
- masterPrompt.outfit PHẢI mô tả BEFORE OUTFIT (yoga/lounge set), KHÔNG phải product
- Mỗi scene prompt: specify rõ model đang mặc gì
  ✅ Scene 1-4: "Model ${getRandomBeforeOutfit()}, holding package / inspecting product"
  ✅ Scene 5: "Model changes into [product from reference image], first time wearing, mirror reveal"
  ✅ Scene 6: "Model now wearing [product], gives verdict"
  ❌ SAI: Model mặc sản phẩm từ scene 1 — phá vỡ logic unboxing`;
         } else if (cinematicStyle === 'review') {
            cinematicStyleInstructions = `\n\n🔍 CINEMATIC STYLE: Review (${finalDuration}s)
Authority-driven affiliate — structured scoring, evidence-based, honest pros/cons.
Viewer xem xong = đủ thông tin quyết định mua. TRUST → CONVERSION.

📊 REVIEW FRAMEWORK:
- Rate on 4-5 criteria: Chất vải / Form dáng / Thiết kế / Thoải mái / Giá trị
- Each criterion: Score X/10 + close-up EVIDENCE
- Final overall score + clear recommendation

🎬 STRUCTURE (${finalDuration}s — ${scenes} scenes):
- Scene 1 (0-8s): HOOK + Product overview
  "Review thật [product] — [price]K có đáng?"
  Show product, state brand/price/source
${scenes >= 4 ? `- Scene 2 (8-16s): CRITERIA 1-2
  Chất vải → close-up fabric, touch. Score: X/10
  Form dáng → wearing, side view. Score: X/10
- Scene 3 (16-24s): CRITERIA 3-4 + TRY-ON
  Thiết kế → detail, pattern, color. Score: X/10
  Thoải mái → movement test, stretch. Score: X/10
${scenes >= 5 ? `- Scenes 4-${scenes - 1}: CRITERIA 5 + DEEP DIVE
  Giá trị (Value for money) → compare quality vs price. Score: X/10
  Additional angles, before/after, lifestyle use demo` : ''}- Scene ${scenes} (last 8s): FINAL SCORE + VERDICT
  Overall: "[Total]/${scenes >= 5 ? '50' : '40'}" → "Nên mua: YES/NO"
  CTA + link` : `- Scene 2 (8-16s): QUALITY + FIT assessment
  Close-up evidence, wearing demo, scores
- Scene ${scenes} (last 8s): VERDICT + SCORE + CTA`}

📹 CAMERA:
- Evidence shots: Clean, well-lit close-ups (proof of claims)
- Fit shots: Tripod full-body (fair representation)
- Detail: Macro 45° angle (texture/stitching visible)
- Talking: Medium shot, product visible, eye contact camera
- Lighting: BRIGHT, ACCURATE color (5000-5500K daylight)

💬 VOICE — REVIEWER AUTHORITY:
- Tone: Confident, honest, data-driven
- Back every opinion with evidence
- "Professional friend who knows stuff"
- Honest negatives BUILD trust: "Nói thật là... trừ [X] điểm"

📊 VERDICT SCALE (khi đủ 5 tiêu chí / 50 điểm):
- 45-50/50: MUST BUY — Xuất sắc
- 40-44/50: NÊN MUA — Rất tốt
- 35-39/50: OKAY — Tạm ổn, tùy nhu cầu
- 30-34/50: CÂN NHẮC — Có issues
- <30/50: PASS — Không recommend
(Nếu chỉ 4 tiêu chí: scale /40 — quy tương ứng 36/32/28/24)

🎯 REVIEW RULES:
- HONESTY mandatory — fake reviews destroy credibility
- EVIDENCE for every claim (close-up proof)
- CONSISTENT criteria (same standards across reviews)
- CTA after verdict ONLY (not mid-review)`;
         }

         // 🎨 AESTHETIC VIBE & MODEL PERSONALITY - For fashion_model displayType
         let aestheticInstructions = '';
         if (displayType === 'fashion_model' && (aestheticVibe !== 'auto' || modelPersonality !== 'auto')) {
            if (aestheticVibe !== 'auto') {
               const vibeDetails = {
                  romantic: '💕 Romantic Vibe - Soft pastels, warm golden lighting, flowing fabrics, gentle movements',
                  power: '💪 Power Vibe - Bold colors, strong poses, confident stride, boss energy',
                  goddess: '✨ Goddess Vibe - Golden glow, majestic posture, commanding presence, regal elegance',
                  minimal: '◻️ Minimal Vibe - Clean lines, neutral tones, understated elegance, modern simplicity',
                  allure: '🌙 Allure Vibe - Magnetic presence, subtle intrigue, mysterious elegance, captivating aura'
               };
               aestheticInstructions += `\n\n🎨 AESTHETIC VIBE: ${vibeDetails[aestheticVibe] || 'Auto'}`;
            }
            
            if (modelPersonality !== 'auto') {
               const personalityDetails = {
                  casual_natural: '🌸 Casual Natural - Relaxed smile, easy-going walk, friendly approachable energy',
                  shy_timid: '🌷 Shy Timid - Gentle gaze down/away, soft movements, delicate gestures, innocent charm',
                  confident_bold: '💎 Confident Bold - Direct eye contact, powerful stride, assertive presence, fearless',
                  playful_flirty: '✨ Playful Flirty - Mischievous smile, light bounce in step, teasing glances, fun energy'
               };
               aestheticInstructions += `\n\n👤 MODEL PERSONALITY: ${personalityDetails[modelPersonality] || 'Auto'}`;
            }
         }


         // 🎬 STUDIO MODE - Optimized for Affiliate (token-efficient)
         const studioSuggestions = studioMode ? getRandomStudios(studioCategory, 5, productColor || undefined) : [];
         
         // Affiliate-specific studio recommendations based on displayType
         const getStudioAffiliateGuidance = () => {
            if (displayType === 'product_focus') {
               return '\n💡 PRODUCT_FOCUS → Studio: White/grey seamless OR lifestyle backdrop — macro lens, 3-point lighting, product as hero';
            } else if (displayType === 'fashion_model') {
               return '\n💡 FASHION_MODEL → Lifestyle studio: Themed backdrop, 2-3 props (chair/plant/frame), warm lighting';
            } else {
               return '\n💡 MIXED → Versatile studio: Neutral backdrop, flexible props, balanced lighting';
            }
         };
         
         const studioModeText = studioMode
            ? `\n\n🎬 STUDIO MODE: ${studioCategory === 'auto' ? 'Auto' : STUDIO_CATEGORIES.find(c => c.value === studioCategory)?.label}${getStudioAffiliateGuidance()}

⚠️ CRITICAL: STUDIO = Phòng chụp ảnh (backdrop + props) ≠ Địa điểm thật
❌ NO: "Real ballroom", "actual hotel lobby" (siêu thực)
✅ YES: "Professional studio with [backdrop type]" + "Props (background): [1-3 items]" + "[Light temp]K lighting" + "- STUDIO FIXED" tag

📐 TEMPLATE: "Professional photography studio. [Backdrop color/type]. Props (background): [vase/chair/frame]. [3000-5000K] lighting. [Floor type]. [Theme] aesthetic. - STUDIO FIXED"

🎯 SUGGESTED (Random ${studioSuggestions.length}):
${studioSuggestions.length > 0 ? studioSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'All used - AI pick from database'}

⚠️ RULES: Choose 1 from list | Props minimal (1-3, out of focus) | Same studio all keyframes | No equipment visible | Color contrast with product
${COLOR_CONTRAST_STUDIO_RULES}`
            : '';

         // Aspect Ratio flag - Enhanced with mode-specific 16:9 rules
         const aspectRatioText = aspectRatio === '16:9'
            ? `\n\n📐 ASPECT_RATIO: 16:9 (HORIZONTAL - CINEMATIC WIDESCREEN)

🎬 CORE 16:9 RULES (BẮT BUỘC CHO TẤT CẢ MODES):
- Model chiếm 50-70% chiều CAO frame (nhỏ hơn so với 9:16)
- Background rõ nét, có depth và storytelling
- Camera xa hơn (2-4m) để capture người + bối cảnh
- Depth of field: f/4-f/8 (sâu hơn 9:16)
- Rule of thirds: Model ở 1/3 trái hoặc phải
- Horizontal movement ưu tiên (đi ngang qua frame)
- Use case: YouTube, Desktop wallpaper, Website banner, Print

🚶 WALK-IN MODE 16:9 SPECIFIC:
- MOVEMENT: Đi NGANG qua frame (left-to-right hoặc right-to-left)
- FRAMING: Model bắt đầu từ edge, kết thúc ở opposite edge
- ENVIRONMENT: Background chiếm 40-50% tầm quan trọng
- CAMERA: Tracking shot ngang, dolly horizontal
- Scene 1: Model enter từ 1 edge, walk across
- Scene 2: Side tracking với panoramic background
- Scene 3: Mid-body trong cinematic wide shot
- Scene 4: Model exit hoặc center với final pose

🪄 TRANSFORMATION MODE 16:9 SPECIFIC:
- SPLIT COMPOSITION: Before (left) → After (right) possible
- TRANSITION: Horizontal wipe/slide phù hợp hơn vertical
- SCENE 1-2: Model ở 1/3 trái với "before" outfit
- SCENE 3-4: Model ở center hoặc 1/3 phải với "after" outfit
- Particles/sparkles spread HORIZONTALLY across frame

🛍️ TIKTOK SHOP 16:9 SPECIFIC:
- PRODUCT VISIBILITY: Show product + model + context cùng lúc
- TEXT SAFE ZONE: 15% top/bottom cho overlay text
- DEMO SHOTS: Wider context cho sử dụng thực tế
- SPLIT SCREEN: So sánh trước-sau dễ dàng hơn`
            : '';

         // Prepare Script Blocklist (Affiliate Mode)
         const scriptBlocklist = scriptVault.length > 0
            ? `\n\nPREVIOUSLY USED SCRIPTS (BLOCKLIST - DO NOT USE SIMILAR HOOKS):\n${scriptVault.slice(0, 15).map(s => `- "${s.hook}"`).join('\n')}`
            : '';

         // Prepare Pose Direction Blocklist (Video Mode only - NOT Lookbook)
         const poseBlocklistText = !lookbookMode && poseDirectionVault.length > 0
            ? `\n\n🎯 POSE DIRECTION HISTORY (TRÁNH LẶP LẠI):
PREVIOUSLY USED POSES: ${getUsedPoseDirections().join(', ')}
⚠️ TRY TO USE DIFFERENT ANGLES for variety. Prioritize angles NOT in this list.

📐 180° TURN PREVENTION (WARNING):
Khi tạo scene transitions, LƯU Ý:
- Keyframe images chỉ có data cho góc được chụp
- Nếu Scene yêu cầu xoay 180° (front → back), Veo 3.1 sẽ "hallucinate" phần không có image data
- ⚠️ MAX ROTATION: 90° giữa 2 keyframes liên tiếp
- ✅ SAFE: front→3/4, side→front, 3/4-front→3/4-back (có overlap)
- ❌ AVOID: front→back (180°), side-left→side-right (180°)`
            : '';

         // Keyframe count reminder based on duration

         const keyframeCountText = `\n\n⚠️ KEYFRAME COUNT REQUIREMENT:\n- Video ${finalDuration}s = ${Math.floor(finalDuration / 8) + 1} KEYFRAMES bắt buộc\n- Timestamps: ${Array.from({ length: Math.floor(finalDuration / 8) + 1 }, (_, i) => `${i * 8}s`).join(', ')}\n- PHẢI OUTPUT ĐỦ ${Math.floor(finalDuration / 8) + 1} KEYFRAMES, KHÔNG ĐƯỢC THIẾU!\n\n📸 KEYFRAME QUALITY RULES (BẮT BUỘC):\n⚠️ Mỗi keyframe PHẢI là prompt HOÀN CHỈNH, KHÔNG được chỉ có action!\n\n❌ SAI (thiếu location + camera):\n{ "id": 1, "action": "standing with hand on hip" }\n\n✅ ĐÚNG (đầy đủ):\n{\n  "id": 1, "timestamp": "00s",\n  "subject": "The model with exact facial features preserved from reference",\n  "action": "Standing confidently with right hand on hip, left hand touching hair, warm smile",\n  "environment": "Standing at the ornate marble entrance of Caravelle Hotel lobby, vintage brass-framed glass doors behind",\n  "lighting": "Warm tungsten lobby chandelier light with soft fill from left, golden ambient glow",\n  "camera": "Full body shot, 35mm wide angle f/2.8, low angle from hip level, 3/4 front facing",\n  "style": "Photorealistic fashion photography, editorial quality, natural skin texture"\n}\n\n🎯 RULES:\n- environment: VỊ TRÍ CỤ THỂ trong location (không chỉ tên location)\n- camera: GÓC CHỤP + LENS + FRAMING (phải KHÁC nhau giữa các keyframes)\n- lighting: ÁNH SÁNG cụ thể cho frame này\n- KHÔNG ĐƯỢC để trống bất kỳ field nào!`;

         // Real-World Photography Mode (ALWAYS ON) — Enhanced with Veo 3.1 research
         const realWorldPhotoText = `\n\n📸 REAL-WORLD PHOTOGRAPHY MODE (BẮT BUỘC):
⚠️ OUTPUT PHẢI LÀ ẢNH/VIDEO CHỤP THỰC TẾ TẠI ĐỊA ĐIỂM THẬT — KHÔNG PHẢI CGI/3D RENDER!

✅ BẮT BUỘC — 5 QUY TẮC REAL LOCATION:
1. ĐỊA ĐIỂM CỤ THỂ: Mỗi scene PHẢI có tên địa điểm tìm được trên Google Maps
   VD: "Shot at the marble lobby of Continental Hotel Saigon" ✅
   VD: "Beautiful background" ❌ (quá chung → Veo hallucinate)

2. VẬT LIỆU & TEXTURE: Mô tả sàn (marble/terrazzo/wood), tường (brick/stucco/stone), nội thất thật
   VD: "polished terrazzo floor reflecting chandelier light" ✅
   VD: "nice floor" ❌

3. ÁNH SÁNG TỰ NHIÊN: Chỉ rõ NGUỒN + THỜI GIAN + HƯỚNG
   VD: "Golden hour sunlight from behind, long soft shadows on cobblestones" ✅
   VD: "Perfect lighting" ❌ (CGI-looking)

4. CAMERA LANGUAGE = PHOTOGRAPHER THẬT:
   VD: "Shot on 35mm f/1.4, shallow DOF, background bokeh" ✅
   VD: "Cinematic render" ❌ (CGI term)

5. IMPERFECTION = AUTHENTICITY: Thêm 1-2 chi tiết đời thật
   VD: "dust motes in sunbeam, distant pedestrians in soft bokeh" ✅
   VD: "Perfect flawless environment" ❌

❌ TUYỆT ĐỐI CẤM — ANTI-CGI:
- 3D render, CGI background, virtual set, green screen
- Fantasy / Surreal / Fictional locations
- "Ray-traced", "volumetric render", "subsurface scattering" (CGI terms)
- Overly perfect studio look (trông fake)
- Floating objects / Impossible physics / Magical glow
- Evenly lit from all sides (physically impossible on-location)

🎯 PROMPT TEMPLATE MỖI SCENE (Veo 3.1 optimized):
"[Subject in OUTFIT], [ACTION] at [SPECIFIC REAL LOCATION with TEXTURE details], [NATURAL LIGHT SOURCE + TIME], [CAMERA LENS + SETTINGS]. [1-2 real-world ambient details]."

📌 STYLE ANCHOR (chọn 1 cho mỗi video): "shot on 35mm film" | "shot on 8K" | "editorial fashion photography" | "street photography aesthetic"

⚠️ OUTPUT FORMAT: STRICT JSON (cho Nano Banana Pro & Veo 3.1)
AI PHẢI output định dạng JSON để tối ưu workflow Image-to-Video.`;

         // Build parts array with CLEAR LABELS for images
         // Lookup selected face preset
         const selectedFacePreset = FACE_PRESETS.find(p => p.value === facePreset) || FACE_PRESETS[0];

         const faceReferenceText = displayType === 'product_focus'
            ? `\n\n🚫 FACE MODE: DISABLED FOR PRODUCT_FOCUS
⚠️ CRITICAL: Product Focus dùng mannequin/product-only.
- Ignore face reference image and face preset.
- Do NOT describe any human facial features.
- Subject must remain mannequin torso or product layout in all scenes/images.`
            : faceImage
            ? `\n\n🔴 FACE REFERENCE: UPLOADED ✅
⚠️ CRITICAL: Face Reference image is attached FIRST (before outfit).
- Use EXACT facial features from Face Reference image
- OVERRIDE any default face preset - DO NOT USE DEFAULT
- Preserve: Face shape, eyes, nose, lips, skin tone, hair style/color
- Do NOT add any default makeup descriptions
- Do NOT change hair color/style from reference
- Only describe what you SEE in the Face Reference

✅ CORRECT: "Faithful character likeness from reference: [describe actual features seen]"
❌ WRONG: Using any default face description when face is uploaded`
            : `\n\n⚠️ FACE REFERENCE: NOT UPLOADED
→ Use SELECTED FACE PRESET: ${selectedFacePreset.label}
→ FACE DESCRIPTION: ${selectedFacePreset.promptEN}
→ MUST use this exact face description for ALL scenes/images. Do NOT deviate.`;

         // 👙 FASHION FOUNDATIONS DETECTION - Không mô tả chi tiết, chỉ reference ảnh
         // Bao gồm: fashion foundations, swim set, loungewear thời trang
         // Chỉ chứa product types THỰC SỰ CÓ trong PRODUCT_TYPE_GROUPS (data.ts)
         const isIntimateApparel = [
            'lingerie', 'bikini', 'sleepwear'
         ].includes(productType.toLowerCase());

         // Outfit image label - thay đổi dựa trên loại sản phẩm
         const getOutfitLabel = () => {
            // 📦 UNBOXING MODE: Product image = SẢN PHẨM TRONG HỘP, KHÔNG PHẢI outfit model đang mặc
            if (cinematicStyle === 'unboxing') {
               return faceImage
                  ? `\n\n📸 IMAGE 2 & 3 - PRODUCT IN BOX (UNBOXING MODE):
⚠️ CRITICAL — ĐÂY LÀ SẢN PHẨM TRONG HỘP, KHÔNG PHẢI OUTFIT MODEL ĐANG MẶC!
- Ảnh này là sản phẩm sẽ được MỞ HỘP → KHÔNG cho model mặc sẵn
- Model mặc CASUAL/NEUTRAL: plain tee, basic jeans, comfortable everyday clothes
- Sản phẩm CHỈ xuất hiện trên người model ở scene TRY-ON (scene cuối)
- Trước đó: sản phẩm NẰM TRONG HỘP / TRÊN TAY / ĐANG MỞ
→ masterPrompt.outfit = "Casual everyday outfit (plain white tee, jeans)" cho scenes mở hộp
→ CHỈ scene try-on mới dùng: "outfit as shown in product reference image"`
                  : `\n\n📸 PRODUCT IN BOX (UNBOXING MODE):
⚠️ CRITICAL — ĐÂY LÀ SẢN PHẨM TRONG HỘP, KHÔNG PHẢI OUTFIT MODEL ĐANG MẶC!
- Model mặc CASUAL clothing trong scenes mở hộp
- Sản phẩm trong ảnh này CHỈ được mặc ở scene TRY-ON cuối cùng
→ masterPrompt.outfit = "Casual everyday outfit" cho scenes 1-4`;
            }
            if (isIntimateApparel) {
               // Fashion foundations: KHÔNG mô tả chi tiết, chỉ reference từ ảnh
               return faceImage
                  ? `\n\n📸 IMAGE 2 & 3 - OUTFIT REFERENCE (FASHION FOUNDATIONS MODE):
⚠️ CRITICAL - FASHION FOUNDATIONS - KHÔNG MÔ TẢ CHI TIẾT:
- Sử dụng "trang phục chính xác như trong ảnh sản phẩm"
- KHÔNG liệt kê chi tiết: cup, dây, chất liệu cụ thể
- AI chỉ cần nhìn ảnh và sao chép y nguyên outfit
- Dùng từ chung: "elegant loungewear set", "couture fashion coordinates", "editorial fashion piece"
- Mô tả màu sắc + overall vibe ONLY

✅ ĐÚNG: "Model wearing the exact outfit shown in product image - elegant lace coordinates in soft blush tone"

→ CHỈ CẦN: "outfit as shown in reference image" + color/vibe`
                  : `\n\n📸 OUTFIT REFERENCE (FASHION FOUNDATIONS MODE):
⚠️ CRITICAL - FASHION FOUNDATIONS - KHÔNG MÔ TẢ CHI TIẾT:
- Sử dụng "trang phục chính xác như trong ảnh sản phẩm"
- KHÔNG liệt kê chi tiết cấu trúc
- Dùng từ an toàn: "loungewear", "couture coordinates", "editorial fashion piece"
→ CHỈ CẦN: "outfit as shown in reference image" + màu sắc/vibe`;
            }
            // Sản phẩm thông thường: mô tả bình thường
            return faceImage
               ? '\n\n📸 IMAGE 2 - OUTFIT/PRODUCT REFERENCE (Use this product):'
               : '\n\n📸 OUTFIT/PRODUCT REFERENCE:';
         };

         // 👙 FASHION FOUNDATIONS MASTERPROMPT INSTRUCTION - Tell AI to reference product image only
         const intimateApparelInstruction = isIntimateApparel
            ? `\n\n👙 FASHION FOUNDATIONS MODE - MASTERPROMPT.OUTFIT RULE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL: Product là FASHION FOUNDATIONS/SWIM/LOUNGEWEAR - CHỈ tham chiếu ảnh sản phẩm!

✅ LUÔN LUÔN viết masterPrompt.outfit theo cách:
- "Outfit as shown in product reference image - [màu_sắc] [vibe_chung]"
- Mô tả COLOR + OVERALL AESTHETIC + VIBE only
- Dùng từ: "couture fashion coordinates", "lounge coordinates", "editorial fashion piece"
- Để AI nhìn ảnh sản phẩm và tái tạo outfit y nguyên

✅ VÍ DỤ ĐÚNG (masterPrompt.outfit format):
- "Outfit as shown in product reference image - black minimalist swimwear with elegant silhouette"
- "Exact outfit from reference - soft blush couture coordinates, feminine aesthetic"
- "Product outfit as pictured - navy loungewear set, relaxed sophisticated vibe"

🎯 FORMULA: "Outfit as shown in reference image - [COLOR] [GENERAL_STYLE] with [VIBE]"

Lý do: Mô tả chi tiết fashion foundations = trigger safety filters. Chỉ reference ảnh = safe.`
            : '';

         // 👗 PRODUCT PHYSICS INSTRUCTION - Motion behavior validation
         const getPhysicsInstruction = () => {
            const pt = productType.toLowerCase();
            // Skip physics rule for fashion foundations (already has its own rule)
            if (isIntimateApparel) return '';

            // Structured products that CANNOT flow
            const noFlowProducts = ['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'];
            const isNoFlow = noFlowProducts.includes(pt);

            if (pt === 'bodycon') {
               return `\n\n👗 PRODUCT PHYSICS - BODYCON/VÁY ÔM:
❌ KHÔNG DÙNG: "flowing", "flutter", "hem flying", "fabric cascade", "billowing"
✅ CHỈ DÙNG: "form-hugging silhouette", "curves highlighted", "stretch visible with movement"
Lý do: Váy ôm sát cơ thể, không thể bay/flutter.`;
            }

            if (pt === 'jeans') {
               return `\n\n👗 PRODUCT PHYSICS - JEANS/DENIM:
❌ KHÔNG DÙNG: "soft drape", "flowing fabric", "gentle sway", "flutter"
✅ CHỈ DÙNG: "structured denim", "rigid fit", "classic wash visible"
Lý do: Denim là vải cứng, không có drape.`;
            }

            if (pt === 'tshirt') {
               return `\n\n👗 PRODUCT PHYSICS - T-SHIRT/ÁO THUN:
❌ KHÔNG DÙNG: "flowing", "drape", "flutter", "liquid"
✅ CHỈ DÙNG: "casual fit", "relaxed silhouette", "cotton texture"
Lý do: Áo thun cotton không có flow.`;
            }

            if (pt === 'sweater') {
               return `\n\n👗 PRODUCT PHYSICS - SWEATER/ÁO LEN:
❌ KHÔNG DÙNG: "flowing", "flutter", "light drape"
✅ CHỈ DÙNG: "cozy knit texture", "chunky weave", "warm layers"
Lý do: Len nặng và có texture, không flow.`;
            }

            if (pt === 'suit' || pt === 'jacket') {
               return `\n\n👗 PRODUCT PHYSICS - SUIT/BLAZER:
❌ KHÔNG DÙNG: "soft drape", "flowing", "flutter"
✅ CHỈ DÙNG: "sharp tailoring", "structured silhouette", "crisp lines"
Lý do: Vest/Blazer là structured garment.`;
            }

            if (pt === 'aodai') {
               return `\n\n👗 PRODUCT PHYSICS - ÁO DÀI:
⚠️ CHỈ VẠT ÁO được flow, THÂN ÁO không flow
✅ ĐÚNG: "ao dai panels trailing elegantly", "vạt áo bay nhẹ", "fitted bodice maintained"
❌ SAI: "ao dai flowing freely" (toàn bộ áo dài không thể flow)`;
            }

            if (pt === 'wide_pants') {
               return `\n\n👗 PRODUCT PHYSICS - WIDE PANTS/ỐNG RỘNG:
✅ ĐÚNG: "wide leg sways with movement", "palazzo flow", "dramatic leg width"
Loại quần này flow được do ống rộng.`;
            }

            if (pt === 'maxi_dress' || pt === 'skirt') {
               return `\n\n👗 PRODUCT PHYSICS - MAXI/SKIRT:
✅ ĐÚNG: "skirt flowing gracefully", "fabric cascade", "delicate flutter"
Váy xòe/maxi có thể flow tự nhiên.`;
            }

            if (pt === 'dress') {
               return `\n\n👗 PRODUCT PHYSICS - DRESS/VÁY LIỀN:
✅ ĐÚNG: "dress sways with movement", "skirt portion flows naturally", "fitted bodice stays in place"
Tùy kiểu dáng: A-line sway, fit-and-flare fan out, shift dress giữ form.`;
            }

            if (pt === 'mini_dress') {
               return `\n\n👗 PRODUCT PHYSICS - MINI DRESS/VÁY NGẮN:
⚠️ Váy ngắn có giới hạn flow do chiều dài
✅ ĐÚNG: "short skirt sways subtly", "hem lifts slightly with turns", "fitted silhouette"
❌ SAI: "dramatic fabric cascade" (váy ngắn không đủ dài để cascade)`;
            }

            if (pt === 'blouse') {
               return `\n\n👗 PRODUCT PHYSICS - BLOUSE/ÁO KIỂU:
⚠️ Semi-structured: collar/cuffs giữ form, thân áo có thể sway nhẹ
✅ ĐÚNG: "gentle fabric sway", "collar maintains structure", "soft movement at hem"
❌ SAI: "dramatic billowing" (blouse không phải dress/maxi)`;
            }

            if (pt === 'top') {
               return `\n\n👗 PRODUCT PHYSICS - TOP/ÁO:
✅ ĐÚNG: "relaxed casual fit", "slight hem sway", "natural fabric drape"
❌ KHÔNG DÙNG: "flowing", "flutter", "cascade"
Tương tự tshirt — áo ngắn, ít fabric để flow.`;
            }

            if (pt === 'set') {
               return `\n\n👗 PRODUCT PHYSICS - SET/BỘ:
⚠️ Coordinated set: top + bottom di chuyển đồng bộ
✅ ĐÚNG: "unified outfit movement", "top and bottom coordinate naturally"
📌 Mô tả cả top VÀ bottom physics trong mỗi scene.`;
            }

            if (pt === 'jumpsuit') {
               return `\n\n👗 PRODUCT PHYSICS - JUMPSUIT:
⚠️ One-piece garment: thân trên fitted, chân tùy kiểu
✅ ĐÚNG: "single continuous garment moves as one", "waist stays fitted", "legs follow body"
❌ SAI: "top separates from bottom" (jumpsuit là liền thân)`;
            }

            if (pt === 'sport') {
               return `\n\n👗 PRODUCT PHYSICS - SPORTSWEAR/ĐỒ THỂ THAO:
✅ ĐÚNG: "athletic fabric clings", "stretch recovery visible", "moisture-wicking material"
❌ KHÔNG DÙNG: "flowing", "soft drape", "romantic sway"
Performance fabric = structured, body-hugging, functional.`;
            }

            if (pt === 'bigsize') {
               return `\n\n👗 PRODUCT PHYSICS - BIGSIZE/OVERSIZE:
✅ ĐÚNG: "relaxed oversized fit", "comfortable drape", "gentle fabric shift"
❌ KHÔNG DÙNG: body-hugging terms — "form-fitting", "skin-tight", "clings"
Oversize = loose, comfortable, natural movement.`;
            }

            // General reminder for other products
            if (isNoFlow) {
               return `\n\n👗 PRODUCT PHYSICS REMINDER:
Product type "${pt}" = STRUCTURED fabric
❌ Tránh: "flowing", "flutter", "cascade"
✅ Dùng motion phù hợp với loại sản phẩm`;
            }

            return '';
         };

         const productPhysicsInstruction = getPhysicsInstruction();

         // 🚫 VEO 3.1 NEGATIVE PROMPT — Auto-generate negativePrompt based on product type
         const getNegativePromptInstruction = (): string => {
            const pt = productType.toLowerCase();

            // Base negative terms for ALL video generation (Veo 3.1 best practice)
            const baseNegative = [
               'cartoon', 'drawing', 'low quality', 'blurry', 'deformed hands',
               'extra fingers', 'distorted face', 'text overlay rendered in video',
               'watermark', 'logo', 'split screen unless requested'
            ];

            // Anti-CGI negatives — push toward photorealistic real-location output
            const antiCgiNegative = [
               '3D render', 'CGI background', 'virtual set', 'green screen composite',
               'artificial environment', 'studio backdrop', 'digitally created environment',
               'unrealistic perfection', 'plastic-looking skin', 'overly smooth surfaces',
               'impossible lighting angles', 'ray-traced lighting', 'volumetric render'
            ];

            // Product-specific negative terms
            const productNegative: string[] = [];

            // Structured fabrics: prevent flowing/soft artifacts
            if (['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top'].includes(pt)) {
               productNegative.push('flowing fabric', 'billowing material', 'sheer transparency', 'soft drape movement');
            }
            // Flow products: prevent rigid/stiff artifacts
            if (['maxi_dress', 'skirt', 'wide_pants', 'dress', 'mini_dress'].includes(pt)) {
               productNegative.push('stiff fabric', 'rigid garment', 'no movement on fabric', 'plastic-looking material');
            }
            // Semi-flow products: prevent extreme treatments
            if (['blouse', 'set', 'jumpsuit'].includes(pt)) {
               productNegative.push('extreme billowing', 'completely rigid fabric', 'dramatic wind effects on structured parts');
            }
            // Intimate apparel: prevent detail artifacts
            if (isIntimateApparel) {
               productNegative.push('detailed garment construction visible', 'strap mechanisms', 'underwire visible', 'transparent mesh close-up');
            }
            // Denim-specific
            if (pt === 'jeans') {
               productNegative.push('soft satin texture', 'silk sheen on denim', 'wrong fabric texture');
            }
            // Suit/Blazer: prevent casual fabric look
            if (pt === 'suit' || pt === 'jacket') {
               productNegative.push('wrinkled fabric', 'casual cotton texture', 'loose unstructured fit');
            }
            // Áo dài: prevent panel errors
            if (pt === 'aodai') {
               productNegative.push('panel slits', 'torn panels', 'separated bodice', 'western dress silhouette');
            }
            // Sportswear: prevent workout context
            if (pt === 'sport' || pt === 'bigsize') {
               productNegative.push('gym equipment', 'workout activity', 'exercise movement', 'sweat');
            }

            // Environment consistency negatives
            const envNegative = [
               'background changing mid-scene', 'location teleport',
               'inconsistent lighting between cuts', 'floating objects'
            ];

            // Garment-person interaction negatives
            const interactionNegative = [
               'fabric clipping through body', 'disconnected accessories',
               'floating garment parts', 'wrong fabric texture on product',
               'color shift on clothing between scenes'
            ];

            const allNegative = [...baseNegative, ...antiCgiNegative, ...productNegative, ...envNegative, ...interactionNegative];

            return `\n\n🚫 VEO 3.1 NEGATIVE PROMPT GUIDANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Khi tạo scene prompts, AI PHẢI tránh các yếu tố sau (dùng làm negativePrompt nếu API hỗ trợ):

NEGATIVE ELEMENTS: ${allNegative.join(', ')}

📌 CÁCH DÙNG:
- Trong JSON output, thêm field "negativePrompt" vào metadata
- Mô tả cái KHÔNG MUỐN thấy (không dùng từ "no" hoặc "don't")
- Ví dụ: "cartoon, blurry, floating fabric, wrong texture" ✅
- Ví dụ: "No cartoon, don't blur" ❌ (sai cú pháp Veo)

📌 FORMAT:
\"metadata\": {
  ...existing fields...,
  \"negativePrompt\": \"${allNegative.slice(0, 8).join(', ')}\"
}`;
         };

         const negativePromptInstruction = getNegativePromptInstruction();

         // 🎯 SCENE ANCHOR INSTRUCTION — Force outfit + environment repetition in every scene prompt
         const getSceneAnchorInstruction = (): string => {
            if (lookbookMode) return ''; // Lookbook = images only, no scenes

            return `\n\n🔗 SCENE ANCHOR RULES — VEO 3.1 CONSISTENCY (BẮT BUỘC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL: Veo 3.1 generates each 8s clip INDEPENDENTLY.
Nếu scene prompt không nhắc lại outfit + environment → Veo sẽ "quên" và tự hallucinate.

📌 RULE 1 — OUTFIT ANCHOR (BẮT BUỘC trong MỌI scene prompt):
Mỗi scenes[].prompt PHẢI bắt đầu hoặc chứa cụm:
"[Subject description] in [COLOR] [GARMENT_TYPE] [KEY_FEATURE]"

✅ VÍ DỤ ĐÚNG:
- "Young woman in dusty rose silk maxi dress with side slit, standing..."
- "Model in black structured blazer over white tee, turning..."
- "Subject in navy athletic coordinates as shown in reference, posing..."

❌ VÍ DỤ SAI:
- "Model turns gracefully..." (THIẾU outfit → Veo tự đoán trang phục)
- "She walks forward..." (THIẾU cả subject + outfit)

📌 RULE 2 — ENVIRONMENT ANCHOR (BẮT BUỘC trong MỌI scene prompt):
Mỗi scenes[].prompt PHẢI chứa environment reminder:
"...in [SAME_LOCATION], [LIGHTING_CONDITION]"

✅ VÍ DỤ ĐÚNG:
- "...in the sunlit marble lobby of a luxury hotel, warm afternoon light"
- "...in the same cozy bedroom studio with soft ring light"

❌ VÍ DỤ SAI:
- "...beautiful background" (quá chung chung → Veo random background)

📌 RULE 3 — ACCESSORIES ANCHOR:
Nếu outfit có accessories (hat, bag, jewelry, sunglasses, belt), PHẢI nhắc lại trong MỌI scene.
"...wearing gold hoop earrings and carrying tan leather tote bag"

📌 TEMPLATE MỖI SCENE PROMPT:
"[Subject in OUTFIT with KEY_DETAILS], [ACTION/POSE], in [ENVIRONMENT with LIGHTING]. [CAMERA movement]. [Fabric/garment PHYSICS behavior]."

⚠️ VALIDATION: Nếu bất kỳ scene prompt nào THIẾU outfit hoặc environment → AI phải tự thêm vào.`;
         };

         const sceneAnchorInstruction = getSceneAnchorInstruction();

         // 🧵 GARMENT-BODY INTERACTION — Fabric-specific physics per scene (Veo 3.1 optimized)
         const getGarmentInteractionInstruction = (): string => {
            if (lookbookMode) return ''; // Images only
            const pt = productType.toLowerCase();
            if (isIntimateApparel) return ''; // Already handled by fashion foundations rules

            // Build fabric-body interaction template based on product type
            let fabricBehavior = '';
            let motionPhrase = '';

            // NO-FLOW products: rigid, structured
            if (['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'].includes(pt)) {
               const rigidMap: Record<string, { fabric: string; motion: string }> = {
                  bodycon: { fabric: 'stretch fabric', motion: 'maintains body-hugging silhouette, subtle stretch visible at joints during movement' },
                  jeans: { fabric: 'rigid denim', motion: 'holds structured form, visible crease lines at knees during sitting or bending' },
                  tshirt: { fabric: 'cotton jersey', motion: 'relaxed drape, slight swing at hem with movement, no dramatic flow' },
                  sweater: { fabric: 'knit wool/cotton', motion: 'chunky texture holds shape, gentle weight sway, no flutter' },
                  jacket: { fabric: 'structured outer fabric', motion: 'sharp shoulder lines maintained, lapels stay flat, no soft draping' },
                  suit: { fabric: 'tailored wool blend', motion: 'crisp pressed lines, structured shoulder pads, minimal fabric movement' },
                  shorts: { fabric: 'cotton/denim', motion: 'casual relaxed fit, no fabric drama, slight shift with leg movement' },
                  pants: { fabric: 'tailored cotton/wool', motion: 'pressed crease visible, structured fall, clean leg line' },
                  croptop: { fabric: 'fitted stretch', motion: 'fitted crop stays in place, no hem lifting or fabric flutter' },
                  top: { fabric: 'cotton/blend', motion: 'relaxed casual fit, slight hem sway with movement, no dramatic flow' },
                  sport: { fabric: 'athletic performance fabric', motion: 'moisture-wicking fabric clings to body during movement, stretch recovery visible at joints' },
                  bigsize: { fabric: 'comfortable stretch blend', motion: 'relaxed oversized fit drapes naturally, fabric shifts gently with body movement, no tight clinging' }
               };
               const entry = rigidMap[pt];
               if (entry) {
                  fabricBehavior = entry.fabric;
                  motionPhrase = entry.motion;
               }
            }
            // FLOW products: fluid, dramatic
            else if (['maxi_dress', 'skirt', 'wide_pants', 'aodai', 'dress', 'mini_dress'].includes(pt)) {
               const flowMap: Record<string, { fabric: string; motion: string }> = {
                  maxi_dress: { fabric: 'flowing chiffon/silk', motion: 'fabric cascades with each step, hem trails and responds to breeze, skirt swirls during turns' },
                  skirt: { fabric: 'lightweight fabric', motion: 'skirt sways naturally with hip movement, pleats fan during turns, hem lifts with spin' },
                  wide_pants: { fabric: 'lightweight wide-leg', motion: 'palazzo legs sway independently, dramatic width visible in profile, fabric ripples during walk' },
                  aodai: { fabric: 'silk/satin', motion: 'front and back panels trail and flutter with movement, fitted bodice DOES NOT flow, only VẠT panels respond to wind' },
                  dress: { fabric: 'varies by style', motion: 'fabric responds to movement based on cut — A-line sways, fit-and-flare skirt fans, shift dress stays clean' },
                  mini_dress: { fabric: 'light structured fabric', motion: 'short skirt sways subtly with hip movement, fitted bodice stays in place, hem lifts slightly during turns' }
               };
               const entry = flowMap[pt];
               if (entry) {
                  fabricBehavior = entry.fabric;
                  motionPhrase = entry.motion;
               }
            }
            // SEMI-FLOW products
            else if (['blouse', 'set', 'jumpsuit'].includes(pt)) {
               const semiFlowMap: Record<string, { fabric: string; motion: string }> = {
                  blouse: { fabric: 'light semi-structured fabric', motion: 'gentle movement with body, collar and cuffs maintain structure, body of garment has subtle sway' },
                  set: { fabric: 'coordinated set fabric', motion: 'top and bottom move as unified outfit, semi-structured with gentle coordinated movement' },
                  jumpsuit: { fabric: 'single-piece structured fabric', motion: 'moves as one continuous garment, waist stays fitted, legs follow body movement cleanly' }
               };
               const entry = semiFlowMap[pt];
               if (entry) {
                  fabricBehavior = entry.fabric;
                  motionPhrase = entry.motion;
               }
            }

            if (!fabricBehavior) return ''; // Unknown product type, skip

            return `\n\n🧵 GARMENT-BODY INTERACTION — VEO 3.1 FABRIC PHYSICS PER SCENE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Product type: "${pt}" | Fabric: ${fabricBehavior}

📌 RULE: Mỗi scenes[].prompt PHẢI kết thúc bằng mô tả GARMENT PHYSICS:
"...[fabric_type] fabric ${motionPhrase}"

✅ TEMPLATE cho mỗi scene:
"...The ${fabricBehavior} ${motionPhrase}."

📌 INTERACTION MATRIX cho "${pt}":
| Movement | Garment Response |
|----------|------------------|
| Standing still | ${['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'].includes(pt) ? 'Fabric holds shape, clean silhouette visible' : 'Fabric settles naturally, slight ambient movement from air'} |
| Turning 180° | ${['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'].includes(pt) ? 'Garment rotates with body as one unit, no independent fabric motion' : 'Skirt/panels trail behind rotation, fabric catches air, settles 0.5s after body stops'} |
| Hand gesture | ${['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'].includes(pt) ? 'Sleeve shifts minimally, no fabric drama' : 'Sleeve fabric flows with arm movement, catches light'} |
| Hair touch | Garment unaffected, natural body micro-movement only |
| Wind/breeze | ${['bodycon', 'jeans', 'tshirt', 'sweater', 'jacket', 'suit', 'shorts', 'pants', 'croptop', 'top', 'sport', 'bigsize'].includes(pt) ? 'Hair moves, garment STAYS RIGID — no fabric flutter' : 'Hair + loose fabric respond to wind direction, grounded parts stay'} |

⚠️ CRITICAL: Nếu scene prompt mô tả motion KHÔNG PHÙ HỢP với "${pt}" physics → AI PHẢI tự sửa.`;
         };

         const garmentInteractionInstruction = getGarmentInteractionInstruction();

         // Background Consistency: Smart routing based on cinematic style
         const getBackgroundContinuityInstruction = () => {
            if (cinematicStyle === 'fashion_walkin') {
               return `\n\n🎨 BACKGROUND CONTINUITY MODE: LINEAR_PROGRESSION
⚠️ You MUST generate:
1. masterPrompt.environment = Single continuous path with progression direction.
2. keyframes[].backgroundPrompt = Same location, camera advances along path (closer each scene).
3. metadata.visualLogicType = "linear_progression"
Model walks toward camera in ONE continuous location. Background progresses naturally along the walk path.
⚠️ MODEL FRAMING: Model MUST occupy 75-85% of frame HEIGHT.`;
            }
            if (cinematicStyle === 'transform_viral') {
               return `\n\n🎨 BACKGROUND CONTINUITY MODE: FIXED_STAGE
⚠️ You MUST generate:
1. masterPrompt.environment = Single fixed background for before/after consistency.
2. keyframes[].backgroundPrompt = SAME background every scene (transformation happens ON the model, NOT the background).
3. metadata.visualLogicType = "fixed_stage"
Background stays IDENTICAL across all scenes. Only the outfit/model transforms.
⚠️ MODEL FRAMING: Model MUST occupy 75-85% of frame HEIGHT.`;
            }
            if (cinematicStyle === 'try_on' || cinematicStyle === 'review' || cinematicStyle === 'unboxing') {
               return `\n\n🎨 BACKGROUND CONTINUITY MODE: FIXED_STAGE
⚠️ You MUST generate:
1. masterPrompt.environment = Consistent INDOOR setting (fitting room / bedroom / studio / walk-in closet).
2. keyframes[].backgroundPrompt = SAME indoor background for fair outfit comparison and continuity.
3. metadata.visualLogicType = "fixed_stage"
Background stays IDENTICAL. Camera framing consistent. Model/outfit changes are the ONLY visual variable.
⚠️ INDOOR ONLY: Phòng ngủ, phòng thử đồ, studio, walk-in closet. KHÔNG outdoor!
⚠️ MODEL FRAMING: Model MUST occupy 75-85% of frame HEIGHT.`;
            }
            if (cinematicStyle === 'asmr_cinematic') {
               return `\n\n🎨 BACKGROUND CONTINUITY MODE: FIXED_STAGE_QUIET
⚠️ You MUST generate:
1. masterPrompt.environment = Quiet indoor setting (bedroom / studio / desk - ZERO ambient noise).
2. keyframes[].backgroundPrompt = SAME quiet indoor background, dark/neutral tones preferred.
3. metadata.visualLogicType = "fixed_stage"
Background stays IDENTICAL and QUIET. Sound is the star — no outdoor noise pollution.
⚠️ INDOOR QUIET ONLY: Phòng tối, studio, bàn làm việc. KHÔNG outdoor, KHÔNG quán cafe!
⚠️ MODEL FRAMING: Macro/close-up dominant.`;
            }
            if (cinematicStyle === 'standard' || cinematicStyle === 'marketing_intimate') {
               return `\n\n🎨 BACKGROUND CONTINUITY MODE: MULTI_ANGLE_EDITORIAL
⚠️ You MUST generate:
1. masterPrompt.environment = Single location with multiple camera angles.
2. keyframes[].backgroundPrompt = Same location, different framing/angle per scene.
3. metadata.visualLogicType = "multi_angle_editorial"
One location filmed from different angles. Cohesive but visually varied.
⚠️ MODEL FRAMING: Model MUST occupy 75-85% of frame HEIGHT.`;
            }
            // Default: DYNAMIC_VIBE for storytelling, ASMR, and other creative modes
            return `\n\n🎨 BACKGROUND CONTINUITY MODE: DYNAMIC_VIBE
⚠️ You MUST generate:
1. masterPrompt.environment = Consistent color palette and lighting atmosphere.
2. keyframes[].backgroundPrompt = Vibe-consistent backgrounds (same tone/mood, can vary location for energy).
3. metadata.visualLogicType = "dynamic_vibe"
Maintain color palette and lighting atmosphere across scenes. Fast cuts OK but visual tone should be cohesive.
⚠️ MODEL FRAMING: Model MUST occupy 75-85% of frame HEIGHT.`;
         };

         const backgroundContinuityInstruction = getBackgroundContinuityInstruction();

         const parts = [
            { text: `Mode: UNIFIED AFFILIATE\nPlatform: ${affiliatePlatform.toUpperCase()} | Audience: ${affiliateAudience.toUpperCase()} | Goal: ${affiliateGoal.toUpperCase()}\nDisplay: ${displayType.toUpperCase()} | Optimization: ${optimizationLevel.toUpperCase()} | Cinematic: ${cinematicStyle.toUpperCase()}${cinematicStyle === 'fashion_walkin' ? `\n  ↳ Walk-In: ${walkinVariant} | ${walkinTimeOfDay} | ${walkinVibe} | ${walkinPersonality}` : ''}${cinematicStyle === 'try_on' ? `\n  ↳ Try-On: ${tryOnVariant} | Transition: ${tryOnTransition} | Pacing: ${tryOnPacing}` : ''}\nGender: ${gender}\n${bodyDataString}${shopModelInfo}${userAdditionalDescText}${productInfo && productInfo.trim() ? `\n\n📦 PRODUCT INFO:\n${productInfo}` : ''}\n\nTarget: ${finalDuration}s (${scenes} scenes) | Ratio: ${aspectRatio}${keyframeCountText}${affiliateDurationStrategy}${affiliatePlatformStrategy}${affiliateAudienceStrategy}${affiliateGoalStrategy}${voiceAnchorInstruction}${realWorldPhotoText}${locationPreferenceText}${editorialModeText}${wallpaperModeText}${lookbookModeText}${seductiveModeText}${sexyModeText}${videoTemporalText}${cinematicStyleInstructions}${aestheticInstructions}${studioModeText}${aspectRatioText}${poseBlocklistText}${intimateApparelInstruction}${productPhysicsInstruction}${negativePromptInstruction}${sceneAnchorInstruction}${garmentInteractionInstruction}${backgroundContinuityInstruction}${videoStyleChoreography}${displayInstructions}\n\nPREVIOUSLY USED LOCATIONS (COLLISION AVOIDANCE):\n${historyBlocklist}${scriptBlocklist}\n\n🎯 OUTPUT: JSON (Nano Banana Pro & Veo 3.1 optimized)\nCreative Brief:\n${brief}${faceReferenceText}` },


            // Face Reference image FIRST (with label)
            ...(faceImage && displayType !== 'product_focus' ? [{ text: '\n\n📸 IMAGE 1 - FACE REFERENCE (Use this face):' }, { inlineData: { mimeType: faceData.mimeType, data: faceData.data } }] : []),
            // Outfit Reference image SECOND (with label) - FASHION FOUNDATIONS AWARE
            { text: getOutfitLabel() },
            { inlineData: { mimeType: outfitData.mimeType, data: outfitData.data } }
         ];

         // 🧠 SMART MODULE SELECTION — Load only relevant modules based on context
         const isFashionProduct = !['facial_device', 'serum', 'makeup', 'body_shaper', 'massage_device', 'skincare_set', 'hair_device', 'nail_beauty', 'robot_vacuum', 'air_purifier', 'smart_kitchen', 'water_purifier', 'smart_fan', 'smart_light', 'security_cam', 'smart_lock', 'cleaning_device', 'steam_device', 'organizer', 'pet_device'].includes(productType);
         const isBeautyProduct = ['facial_device', 'serum', 'makeup', 'body_shaper', 'massage_device', 'skincare_set', 'hair_device', 'nail_beauty'].includes(productType);
         const isSmartHomeProduct = ['robot_vacuum', 'air_purifier', 'smart_kitchen', 'water_purifier', 'smart_fan', 'smart_light', 'security_cam', 'smart_lock', 'cleaning_device', 'steam_device', 'organizer', 'pet_device'].includes(productType);
         const isIntimateProduct = ['lingerie', 'bikini', 'sleepwear'].includes(productType);
         const needsVoice = voiceStyle !== 'no_voice';
         
         const baseModules: string[] = [
            TIKTOK_SHOP_SYSTEM_INSTRUCTION,
            AFFILIATE_OPTIMIZATION,
            VIRAL_HOOKS_MASTERY,
            VEO_SAFE_MOTION_KEYWORDS,
            TRENDING_INTELLIGENCE,
            EMOTIONAL_ARC_GUIDE,
            TIKTOK_BANNED_WORDS_GUIDE,
            REAL_LOCATION_RULES,
         ];
         // Fashion-specific modules
         if (isFashionProduct) {
            baseModules.push(CINEMATIC_FASHION_SCENES);
            baseModules.push(PRODUCT_PHYSICS_RULES);
            if (['sport', 'bigsize'].includes(productType)) baseModules.push(SPORTSWEAR_RULES);
         }
         // Voice module only when voice is enabled
         if (needsVoice) baseModules.push(VOICE_SCRIPT_PRO);
         // No-voice product focus module — comprehensive guide for music+text+motion driven videos
         if (!needsVoice) baseModules.push(NO_VOICE_PRODUCT_FOCUS);
         // Safety vocabulary for ALL fashion & sensitive products (prevent prompt flagging)
         if (isFashionProduct || isIntimateProduct || isBeautyProduct) baseModules.push(SAFETY_VOCABULARY_GUIDE);
         // Non-fashion products still need basic scene rules
         if (!isFashionProduct) baseModules.push(CINEMATIC_FASHION_SCENES);
         
         let systemInstruction = baseModules.join('\n\n');
         
         // 🏆 COMPETITIVE OPTIMIZATION - Compact version for token efficiency
         if (optimizationLevel === 'competitive') {
            systemInstruction += `\n\n🏆 COMPETITIVE MODE: #1 Ranking Target

🔥 3-TIER HOOK (0-1.5s): Universal curiosity → Product flash → Value promise ("399K→199K!")
💬 DUAL CTA: @12s engagement ("Comment MUỐN") + @22s conversion ("Link ghim 👆")
🎁 COMMENT TRIGGER: Question/game/opinion bait (must include 1+)
📈 GMV TACTICS: Bundles, variants display, urgency ("50 sets left")
✅ TARGETS: 10+ orders/hr, $1K+ GMV/48h, 8-12% CTR\n#1 = 70% traffic | #2-5 = 20% | Winner-take-all`;
         }
         
         // Optional Modules (token-efficient concatenation)
         if (studioMode) systemInstruction += '\n\n' + STUDIO_MODE_GUIDE;

         // Cinematic mode-specific instruction modules
         if (cinematicStyle === 'fashion_walkin') systemInstruction += '\n\n' + WALKIN_CINEMATIC_RULES;
         if (cinematicStyle === 'transform_viral') systemInstruction += '\n\n' + TRANSFORMATION_SCENES;
         if (cinematicStyle === 'marketing_intimate') systemInstruction += '\n\n' + MARKETING_INTIMATE_SCENES;
         if (cinematicStyle === 'try_on') systemInstruction += '\n\n' + TRY_ON_MODE_GUIDE;
         if (cinematicStyle === 'asmr_cinematic') systemInstruction += '\n\n' + ASMR_CINEMATIC_GUIDE;
         if (cinematicStyle === 'storytelling') systemInstruction += '\n\n' + STORYTELLING_CINEMATIC_GUIDE;
         if (cinematicStyle === 'unboxing') systemInstruction += '\n\n' + UNBOXING_CINEMATIC_GUIDE;
         if (cinematicStyle === 'review') systemInstruction += '\n\n' + REVIEW_CINEMATIC_GUIDE;

         // 🔴 VIRAL HOOK ENFORCEMENT — Compact version for token efficiency
         if (!lookbookMode) {
            systemInstruction += `\n\n🔴 VIRAL HOOK (MANDATORY): First 3s = 80% success\nScene 1 MUST have 0-3s hook element. JSON must include "viralHooks" field.\nAffiliate hooks: Curiosity/First impression/Experience sharing/Social proof (trust-driven)\n❌ NO: Static poses, no hook element, slow starts, hard sell, specific prices`;
         }

         // 🎵 NO-VOICE ENFORCEMENT — Text overlay + beat-sync + product-focused motion
         if (!needsVoice && !lookbookMode) {
            systemInstruction += `\n\n🎵 NO-VOICE ENFORCEMENT (MANDATORY):
Video KHÔNG CÓ GIỌNG NÓI — tất cả communication qua TEXT + MUSIC + MOTION.

📌 JSON OUTPUT BẮT BUỘC khi no_voice:
- scenes[].voiceConfig = KHÔNG CÓ (field không tồn tại)
- scenes[].script = KHÔNG CÓ
- scenes[].textOverlay = { text: string, position: "top"|"bottom"|"center", timing: "0-2s", style: "bold_pop"|"typewriter"|"slide_in" }
- metadata.beatSync = { bpm: number, musicMood: string, dropTimestamps: number[] }
- metadata.audioDesign = { musicBed: string, productSounds: string[], ambientLayer: string }
- metadata.textOverlays = [{ sceneIndex: number, text: string, purpose: "hook"|"feature"|"benefit"|"cta" }]

🎵 BEAT-SYNC RULES:
- Mỗi scene 8s = ít nhất 2 beat-drop moments
- Model POSE SNAP on beat drops (chuyển pose đúng nhịp)
- Camera CUT/TRANSITION on beat (không cut giữa beat)
- Product REVEAL on bass drop (moment mạnh nhất = reveal)

📝 TEXT OVERLAY RULES:
- Scene 1: HOOK TEXT (max 5 từ, gây tò mò: "Chiếc váy 200K này..." / "Ai nói đồ rẻ xấu?")
- Scene giữa: FEATURE TEXT (chất liệu, size, thiết kế đặc biệt)
- Scene cuối: CTA TEXT ("Link dưới nha 👇" / "Save lại đi!")
- Font: Bold sans-serif, drop shadow, readable on all backgrounds
- Position: TOP 15% hoặc BOTTOM 15% — KHÔNG BAO GIỜ che sản phẩm

🔇 AMBIENT SOUND DESIGN:
- Music bed: 70-80% volume, trending TikTok sound
- Product sounds: fabric rustling, zipper, heels clicking, packaging
- Room tone: matched to location (street buzz, room silence, nature)
- Mỗi scene prompt PHẢI describe ambient sounds cụ thể`;
         }

         const response = await ai.models.generateContent({
            model: geminiModel,
            contents: { parts },
            config: {
               systemInstruction: systemInstruction,
               safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
               ]
            }
         });

         const text = response.text;

         if (!text) {
            console.error("Director Response Missing Text. Full Response:", response);
            if (response.candidates && response.candidates.length > 0) {
               const reason = response.candidates[0].finishReason;
               if (reason === 'SAFETY') {
                  throw new Error("The Director could not generate the prompt due to Safety Filters. Please try a different image or description.");
               }
            }
            throw new Error("No text response from Director. The model might be overloaded or the input was blocked.");
         }

         // Extract Metadata (Specific Location) - Support both JSON and text format
         let extractedLocation = null;

         // Try JSON format first
         try {
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*"metadata"[\s\S]*\}/);
            if (jsonMatch) {
               const jsonText = jsonMatch[1] || jsonMatch[0];
               const jsonData = JSON.parse(jsonText);
               if (jsonData.metadata && jsonData.metadata.location) {
                  extractedLocation = jsonData.metadata.location;
               }
            }
         } catch (e) {
            // JSON parsing failed, try text format
         }

         // Fallback to text format
         if (!extractedLocation) {
            const metaMatch = text.match(/Specific Location:\s*(.+)/i);
            if (metaMatch && metaMatch[1]) {
               extractedLocation = metaMatch[1].trim();
            }
         }

         if (extractedLocation) {
            const alreadyExists = locationVault.some(item =>
               item.location.toLowerCase() === extractedLocation.toLowerCase()
            );
            if (!alreadyExists) {
               addToLocationVault(extractedLocation, locationRegion, productType);
            }
         }

         // Extract Studio from AI response (for Studio Mode) - save to vault
         if (studioMode) {
            let extractedStudio = null;

            // Try JSON format - look in masterPrompt.environment
            try {
               const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*"masterPrompt"[\s\S]*\}/);
               if (jsonMatch) {
                  const jsonText = jsonMatch[1] || jsonMatch[0];
                  const jsonData = JSON.parse(jsonText);
                  if (jsonData.masterPrompt && jsonData.masterPrompt.environment) {
                     extractedStudio = jsonData.masterPrompt.environment;
                  }
               }
            } catch (e) {
               // JSON parsing failed
            }

            // Fallback: look for "STUDIO FIXED" tag
            if (!extractedStudio) {
               const studioMatch = text.match(/([^.]+)\s*-\s*STUDIO FIXED/i);
               if (studioMatch && studioMatch[1]) {
                  extractedStudio = studioMatch[1].trim();
               }
            }

            if (extractedStudio) {
               const studioShort = extractedStudio.slice(0, 100);
               const studioExists = studioVault.some(s =>
                  s.studio.toLowerCase().slice(0, 30) === studioShort.toLowerCase().slice(0, 30)
               );
               if (!studioExists && studioShort.length > 10) {
                  addToStudioVault(studioShort, studioCategory, productType);
                  console.log('🎬 Studio saved to vault:', studioShort.slice(0, 50) + '...');
               }
            }
         }

         // Extract Scene 1 Script (Hook) for TikTok Shop - save to vault
         // Support both JSON and text format
         {
            let extractedHook = null;

            // Try JSON format
            try {
               const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*"scenes"[\s\S]*\}/);
               if (jsonMatch) {
                  const jsonText = jsonMatch[1] || jsonMatch[0];
                  const jsonData = JSON.parse(jsonText);
                  if (jsonData.scenes && jsonData.scenes[0] && jsonData.scenes[0].script) {
                     extractedHook = jsonData.scenes[0].script;
                  }
               }
            } catch (e) {
               // JSON parsing failed
            }

            // Fallback to text format
            if (!extractedHook) {
               const scene1Match = text.match(/SCENE 1[\s\S]*?SCRIPT:\s*["""]?([^"""]+)["""]?/i);
               if (scene1Match && scene1Match[1]) {
                  extractedHook = scene1Match[1].trim();
               }
            }

            if (extractedHook) {
               const hook = extractedHook.slice(0, 100);
               const hookExists = scriptVault.some(s =>
                  s.hook.toLowerCase().slice(0, 30) === hook.toLowerCase().slice(0, 30)
               );
               if (!hookExists && hook.length > 10) {
                  addToScriptVault(hook, productType);
               }
            }
         }

         const sections = parseDirectorOutput(text);

         // ================================================
         // 🎬 PHASE 2: AUTO VIDEO REFINEMENT
         // ================================================
         // Tự động gọi AI lần 2 để refine scenes liền mạch hơn
         // SKIP for Lookbook Mode (images only, no video)
         let refinedScenesText = null;

         if (sections.keyframes && sections.master && !lookbookMode) {
            console.log('🎬 Starting Phase 2: Video Refinement...');

            // Extract jsonData for beatSync info
            let jsonData = null;
            try {
               const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
               if (jsonMatch) {
                  jsonData = JSON.parse(jsonMatch[1]);
               }
            } catch (e) {
               // JSON parsing failed, proceed without it
            }

            refinedScenesText = await refineVideoScenes(
               sections.master,
               sections.keyframes,
               sections.scenes || '',
               jsonData || (sections as any).jsonData
            );

            if (refinedScenesText) {
               console.log('✅ Phase 2 completed: Refined scenes ready');
               sections.refinedScenes = refinedScenesText;
            }
         } else if (lookbookMode) {
            console.log('⏭️ Phase 2 skipped: Lookbook mode (images only, no video refinement needed)');
         }

         setDirectorOutput({
            fullText: text,
            sections: sections,
            jsonData: (sections as any).jsonData
         });

         setActiveTab('master');

         // Auto-scroll to output after generation completes
         setTimeout(() => {
            outputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }, 200);

      } catch (error: any) {
         console.error("Director Error:", error);

         let message = error.message || "An unexpected error occurred.";

         if (typeof message === 'string' && (message.includes('{') || message.includes('429') || message.includes('404'))) {
            if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || message.includes("quota")) {
               message = "API Quota Exceeded (429). You have reached the usage limit for the Gemini API. Please wait a moment or check your billing details in Google AI Studio.";
            } else if (message.includes("404") || message.includes("NOT_FOUND")) {
               message = "Model Not Found (404). The selected Gemini model is not available. Please try again later or contact support.";
            } else {
               try {
                  const jsonMatch = message.match(/\{.*\}/);
                  if (jsonMatch) {
                     const parsed = JSON.parse(jsonMatch[0]);
                     if (parsed.error && parsed.error.message) {
                        message = parsed.error.message;
                     }
                  }
               } catch (e) { }
            }
         }

         alert(`Director Error: ${message}`);
         setStep('input');
      } finally {
         setDirectorThinking(false);
      }
   };



   const reset = () => {
      setStep('input');
      setDirectorOutput(null);
   };

   // --- Render Steps ---

   return (
      <div className="min-h-screen bg-[#09090b] text-zinc-200 selection:bg-purple-500/30 selection:text-purple-200 font-sans">
         {/* Subtle gradient background */}
         <div className="fixed inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-pink-950/10 pointer-events-none" />
         
         <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10 flex flex-col gap-8">

            {/* Top Section: Inputs & Controls */}
            <div className="flex flex-col gap-6">
               <header className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                     <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                     <span className="text-[10px] font-semibold tracking-[0.15em] text-purple-300 uppercase">AI Video Marketing Studio</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent leading-tight">
                     Affiliate Video Generator Pro
                  </h1>
                  <p className="text-xs text-zinc-500 mt-2 max-w-md">
                     TikTok & Facebook optimized • 60%+ completion rate • CVR-focused hooks • Powered by Gemini + Veo 3.1
                  </p>
               </header>

               <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm shadow-2xl shadow-black/20 overflow-hidden">

                  {/* ═══════════ SECTION: API & Model ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                           <span className="text-xs">🔑</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Configuration</span>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        {/* API Key */}
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1.5">
                              Gemini API Key
                              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                                 className="text-purple-400 hover:text-purple-300 underline text-[9px]">
                                 (Get key)
                              </a>
                           </label>
                           <div className="relative">
                              <input
                                 type={showApiKey ? "text" : "password"}
                                 value={apiKey}
                                 onChange={(e) => setApiKey(e.target.value)}
                                 placeholder="AIzaSy..."
                                 className="w-full px-3 py-2.5 pr-16 text-xs bg-zinc-950/60 border border-zinc-700/60 rounded-xl text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowApiKey(!showApiKey)}
                                 className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 transition-colors"
                              >
                                 {showApiKey ? 'Hide' : 'Show'}
                              </button>
                           </div>
                           {!apiKey && <p className="text-[9px] text-red-400/80">⚠️ Required to generate</p>}
                        </div>

                        {/* Gemini Model */}
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-medium text-zinc-400">AI Model</label>
                           <div className="grid grid-cols-2 gap-2">
                              {[
                                 { value: 'gemini-2.5-flash', label: '2.5 Flash', desc: 'Stable', color: 'purple' },
                                 { value: 'gemini-3-flash-preview', label: '3.0 Preview', desc: 'Latest', color: 'cyan' }
                              ].map(m => (
                                 <button key={m.value}
                                    onClick={() => setGeminiModel(m.value)}
                                    className={`py-2.5 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                       ${geminiModel === m.value
                                          ? `bg-${m.color}-500/15 border-${m.color}-500/50 text-${m.color}-200 shadow-sm shadow-${m.color}-500/5`
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/60'}`}
                                 >
                                    <div className="font-bold text-[11px]">{m.label}</div>
                                    <div className="text-[8px] opacity-60 mt-0.5">{m.desc}</div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* ═══════════ SECTION: Affiliate Strategy ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                           <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Affiliate Strategy</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent ml-2" />
                     </div>
                     
                     <div className="grid md:grid-cols-3 gap-4">
                     {/* Platform Target */}
                     <div className="space-y-2">
                        <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                           Platform
                        </label>
                        <div className="flex flex-col gap-1.5">
                           <button
                              onClick={() => setAffiliatePlatform('tiktok')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all
                                 ${affiliatePlatform === 'tiktok'
                                    ? 'bg-pink-500/15 border-pink-500/50 text-pink-200 shadow-sm shadow-pink-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              🎵 TikTok
                           </button>
                           <button
                              onClick={() => setAffiliatePlatform('facebook')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all
                                 ${affiliatePlatform === 'facebook'
                                    ? 'bg-blue-500/15 border-blue-500/50 text-blue-200 shadow-sm shadow-blue-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              👤 Facebook
                           </button>
                           <button
                              onClick={() => setAffiliatePlatform('both')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all
                                 ${affiliatePlatform === 'both'
                                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              🚀 Both
                           </button>
                        </div>
                     </div>
                     
                     {/* Audience Stage */}
                     <div className="space-y-2">
                        <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                           Audience
                        </label>
                        <div className="flex flex-col gap-1.5">
                           <button
                              onClick={() => setAffiliateAudience('cold')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                 ${affiliateAudience === 'cold'
                                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              <span className="font-bold">❄️ Cold</span>
                              <span className="text-[8px] text-zinc-500 ml-1.5">New audience</span>
                           </button>
                           <button
                              onClick={() => setAffiliateAudience('warm')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                 ${affiliateAudience === 'warm'
                                    ? 'bg-orange-500/15 border-orange-500/50 text-orange-200 shadow-sm shadow-orange-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              <span className="font-bold">🔥 Warm</span>
                              <span className="text-[8px] text-zinc-500 ml-1.5">Engaged</span>
                           </button>
                           <button
                              onClick={() => setAffiliateAudience('hot')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                 ${affiliateAudience === 'hot'
                                    ? 'bg-red-500/15 border-red-500/50 text-red-200 shadow-sm shadow-red-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              <span className="font-bold">🔥🔥 Hot</span>
                              <span className="text-[8px] text-zinc-500 ml-1.5">Ready to buy</span>
                           </button>
                        </div>
                     </div>
                     
                     {/* Goal Metric */}
                     <div className="space-y-2">
                        <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                           Goal
                        </label>
                        <div className="flex flex-col gap-1.5">
                           <button
                              onClick={() => setAffiliateGoal('views')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                 ${affiliateGoal === 'views'
                                    ? 'bg-green-500/15 border-green-500/50 text-green-200 shadow-sm shadow-green-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              <span className="font-bold">👀 Views</span>
                              <span className="text-[8px] text-zinc-500 ml-1.5">Reach</span>
                           </button>
                           <button
                              onClick={() => setAffiliateGoal('engagement')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                 ${affiliateGoal === 'engagement'
                                    ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-200 shadow-sm shadow-yellow-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              <span className="font-bold">👍 Engage</span>
                              <span className="text-[8px] text-zinc-500 ml-1.5">Likes/Comments</span>
                           </button>
                           <button
                              onClick={() => setAffiliateGoal('conversion')}
                              className={`py-2 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                                 ${affiliateGoal === 'conversion'
                                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                           >
                              <span className="font-bold">💰 Sales</span>
                              <span className="text-[8px] text-zinc-500 ml-1.5">CVR Max</span>
                           </button>
                        </div>
                     </div>
                     
                     <div className="text-[8px] text-zinc-500 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/30 mt-1">
                        {affiliateGoal === 'conversion' && <>💰 <strong>Conversion:</strong> 24s optimal, price hooks, urgency CTAs</>}
                        {affiliateGoal === 'engagement' && <>👍 <strong>Engagement:</strong> Comment bait, shareability, educational</>}
                        {affiliateGoal === 'views' && <>👀 <strong>Views:</strong> Viral hooks, emotional triggers, broad appeal</>}
                     </div>
                     </div>
                  </div>

                  {/* ═══════════ SECTION: Display & Optimization ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                           <span className="text-xs">📦</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Display & Optimization</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent ml-2" />
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-5">
                  {/* 📦 PRODUCT DISPLAY TYPE */}
                  <div className="space-y-2">
                     <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Display Type</label>
                     <div className="flex flex-col gap-1.5">
                        <button
                           onClick={() => setDisplayType('fashion_model')}
                           className={`py-2.5 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                              ${displayType === 'fashion_model'
                                 ? 'bg-blue-500/15 border-blue-500/50 text-blue-200 shadow-sm shadow-blue-500/5'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                        >
                           <span className="font-bold">👗 Fashion Model</span>
                           <span className="text-[8px] text-zinc-500 ml-1.5">Person wearing</span>
                        </button>
                        <button
                           onClick={() => setDisplayType('product_focus')}
                           className={`py-2.5 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                              ${displayType === 'product_focus'
                                 ? 'bg-pink-500/15 border-pink-500/50 text-pink-200 shadow-sm shadow-pink-500/5'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                        >
                           <span className="font-bold">📦 Product Focus</span>
                           <span className="text-[8px] text-zinc-500 ml-1.5">Mannequin / Flatlay only (No face)</span>
                        </button>
                        <button
                           onClick={() => setDisplayType('mixed')}
                           className={`py-2.5 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                              ${displayType === 'mixed'
                                 ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                        >
                           <span className="font-bold">🎨 Mixed</span>
                           <span className="text-[8px] text-zinc-500 ml-1.5">Both styles</span>
                        </button>
                     </div>
                     <div className="text-[8px] text-zinc-500 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/30">
                        {displayType === 'fashion_model' && <>👗 Model mặc sản phẩm, poses động</>}
                        {displayType === 'product_focus' && <>📦 Sản phẩm là ngôi sao — chỉ mannequin/flatlay, không mô tả khuôn mặt</>}
                        {displayType === 'mixed' && <>🎨 Model + product shots kết hợp</>}
                     </div>
                  </div>

                  {/* 🚀 OPTIMIZATION LEVEL */}
                  <div className="space-y-2">
                     <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Optimization</label>
                     <div className="flex flex-col gap-1.5">
                        <button
                           onClick={() => setOptimizationLevel('standard')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                              ${optimizationLevel === 'standard'
                                 ? 'bg-green-500/15 border-green-500/50 text-green-200 shadow-sm shadow-green-500/5'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                        >
                           <div className="font-bold text-[11px]">✅ Standard</div>
                           <div className="text-[8px] opacity-60 mt-0.5">3-5% CVR, stable sales</div>
                        </button>
                        <button
                           onClick={() => setOptimizationLevel('competitive')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all text-left
                              ${optimizationLevel === 'competitive'
                                 ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/5'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600'}`}
                        >
                           <div className="font-bold text-[11px]">🏆 Competitive</div>
                           <div className="text-[8px] opacity-60 mt-0.5">8-12% CTR, #1 ranking</div>
                        </button>
                     </div>
                     
                     {optimizationLevel === 'competitive' && (
                        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-2.5 text-[8px] text-amber-200/80">
                           <strong>🏆 Active:</strong> 3-tier hook • Dual CTA • Comment triggers • GMV tactics
                        </div>
                     )}
                  </div>
                     </div>
                  </div>

                  {/* ═══════════ SECTION: Product Info ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                           <span className="text-xs">📝</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Product Info</span>
                        <span className="text-[8px] text-zinc-500 ml-1">(Optional)</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
                     </div>
                     <textarea
                        value={productInfo}
                        onChange={(e) => setProductInfo(e.target.value)}
                        placeholder="Ví dụ: Váy body xẻ tà, 299K flash sale, chất liệu lụa mềm mại..."
                        className="w-full bg-zinc-950/40 border border-zinc-700/40 rounded-xl p-3 text-[10px] text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none resize-none transition-all"
                        rows={2}
                     />
                     <p className="text-[8px] text-zinc-600 mt-1.5">
                        💡 Giá, USP, chất liệu → AI tạo content chính xác hơn
                     </p>
                  </div>

                  {/* ═══════════ SECTION: Cinematic Style ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                           <span className="text-xs">✨</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Cinematic Style</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-transparent ml-2" />
                     </div>
                     <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                        <button
                           onClick={() => setCinematicStyle('standard')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all group
                              ${cinematicStyle === 'standard'
                                 ? 'bg-blue-500/15 border-blue-500/50 text-blue-200 shadow-sm shadow-blue-500/5 ring-1 ring-blue-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">🎬 Standard</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Fashion editorial</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('transform_viral')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'transform_viral'
                                 ? 'bg-pink-500/15 border-pink-500/50 text-pink-200 shadow-sm shadow-pink-500/5 ring-1 ring-pink-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">✨ Biến Hình</div>
                           <div className="text-[7px] opacity-50 mt-0.5">32s viral morph</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('fashion_walkin')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'fashion_walkin'
                                 ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5 ring-1 ring-purple-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">👗 Walk-In</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Model walks to camera</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('marketing_intimate')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'marketing_intimate'
                                 ? 'bg-rose-500/15 border-rose-500/50 text-rose-200 shadow-sm shadow-rose-500/5 ring-1 ring-rose-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">📢 Marketing</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Fashion foundations</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('try_on')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'try_on'
                                 ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">👗 Thử Đồ</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Try-on & outfit change</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('asmr_cinematic')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'asmr_cinematic'
                                 ? 'bg-violet-500/15 border-violet-500/50 text-violet-200 shadow-sm shadow-violet-500/5 ring-1 ring-violet-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">🎤 ASMR</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Sound & texture</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('storytelling')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'storytelling'
                                 ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/5 ring-1 ring-amber-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">📖 Kể Chuyện</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Narrative day-in-life</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('unboxing')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'unboxing'
                                 ? 'bg-orange-500/15 border-orange-500/50 text-orange-200 shadow-sm shadow-orange-500/5 ring-1 ring-orange-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">📦 Mở Hộp</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Cinematic unboxing</div>
                        </button>
                        <button
                           onClick={() => setCinematicStyle('review')}
                           className={`py-3 px-3 rounded-xl text-[10px] font-medium border transition-all
                              ${cinematicStyle === 'review'
                                 ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/5 ring-1 ring-cyan-500/20'
                                 : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                        >
                           <div className="font-bold text-[11px]">🔍 Review</div>
                           <div className="text-[7px] opacity-50 mt-0.5">Rating & verdict</div>
                        </button>
                     </div>
                  </div>

                  {/* 🚶 WALK-IN OPTIONS - Only show when fashion_walkin selected */}
                  {cinematicStyle === 'fashion_walkin' && (
                     <div className="mx-5 mb-3 space-y-3 bg-purple-500/5 border border-purple-500/15 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="text-[9px] font-semibold text-purple-300 flex items-center gap-1">
                           <span className="text-xs">👗</span> Walk-In Configuration
                        </div>
                        
                        {/* Walk-In Variant */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">🎭 Walk-In Variant</label>
                           <div className="grid grid-cols-3 gap-1.5">
                              {[
                                 { value: 'auto', icon: '🤖', label: 'Auto' },
                                 { value: 'classical', icon: '🌸', label: 'Classical' },
                                 { value: 'digital', icon: '⚡', label: 'Digital' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setWalkinVariant(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${walkinVariant === opt.value
                                          ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon} {opt.label}
                                 </button>
                              ))}
                           </div>
                           <div className="text-[7px] text-zinc-500">
                              {walkinVariant === 'classical' && '🌸 Nàng thơ đi dạo — No hook, fade out tự nhiên'}
                              {walkinVariant === 'digital' && '⚡ Urban energy, TikTok trending vibe'}
                              {walkinVariant === 'auto' && '🤖 AI auto-select based on outfit'}
                           </div>
                        </div>

                        {/* Time of Day */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">🌅 Thời Gian (Lighting)</label>
                           <div className="grid grid-cols-4 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'golden_hour', icon: '🌅', label: 'Golden' },
                                 { value: 'blue_hour', icon: '🌆', label: 'Blue' },
                                 { value: 'city_night', icon: '🌃', label: 'Night' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setWalkinTimeOfDay(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${walkinTimeOfDay === opt.value
                                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon}
                                 </button>
                              ))}
                           </div>
                           <div className="text-[7px] text-zinc-500">
                              {walkinTimeOfDay === 'golden_hour' && '🌅 Hoàng hôn 5-7PM - Ánh vàng ấm, rim light'}
                              {walkinTimeOfDay === 'blue_hour' && '🌆 Blue hour twilight - Cool tones'}
                              {walkinTimeOfDay === 'city_night' && '🌃 City night - Neon bokeh'}
                              {walkinTimeOfDay === 'auto' && '✨ AI selects best lighting'}
                           </div>
                        </div>

                        {/* Aesthetic Vibe */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">🎨 Aesthetic Vibe</label>
                           <div className="grid grid-cols-3 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'romantic', icon: '💕', label: 'Romantic' },
                                 { value: 'power', icon: '💪', label: 'Power' },
                                 { value: 'goddess', icon: '✨', label: 'Goddess' },
                                 { value: 'minimal', icon: '◻️', label: 'Minimal' },
                                 { value: 'allure', icon: '🌙', label: 'Allure' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setWalkinVibe(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${walkinVibe === opt.value
                                          ? 'bg-pink-500/15 border-pink-500/50 text-pink-200 shadow-sm shadow-pink-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon}
                                 </button>
                              ))}
                           </div>
                           <div className="text-[7px] text-zinc-500">
                              {walkinVibe === 'auto' && 'AI detect outfit → auto chọn vibe "đời thật" phù hợp nhất'}
                              {walkinVibe !== 'auto' && `${walkinVibe.charAt(0).toUpperCase() + walkinVibe.slice(1)} vibe selected`}
                           </div>
                        </div>

                        {/* Model Personality */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">👤 Model Personality</label>
                           <div className="grid grid-cols-3 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'casual_natural', icon: '🌸', label: 'Casual' },
                                 { value: 'shy_timid', icon: '🌷', label: 'Shy' },
                                 { value: 'confident_bold', icon: '💎', label: 'Confident' },
                                 { value: 'playful_flirty', icon: '✨', label: 'Playful' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setWalkinPersonality(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${walkinPersonality === opt.value
                                          ? 'bg-teal-500/15 border-teal-500/50 text-teal-200 shadow-sm shadow-teal-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon}
                                 </button>
                              ))}
                           </div>
                           <div className="text-[7px] text-zinc-500">
                              {walkinPersonality === 'auto' && 'AI detect outfit → auto chọn personality phù hợp nhất'}
                              {walkinPersonality !== 'auto' && `${walkinPersonality.replace('_', ' ')} personality`}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* 👗 TRY-ON OPTIONS - Only show when try_on selected */}
                  {cinematicStyle === 'try_on' && (
                     <div className="mx-5 mb-3 space-y-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="text-[9px] font-semibold text-emerald-300 flex items-center gap-1">
                           <span className="text-xs">👗</span> Try-On Configuration
                        </div>
                        
                        {/* Try-On Variant */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">🎭 Kiểu Thử Đồ</label>
                           <div className="grid grid-cols-3 gap-1.5">
                              {[
                                 { value: 'auto', icon: '🤖', label: 'Auto' },
                                 { value: 'fitting_room', icon: '🚪', label: 'Phòng Thử' },
                                 { value: 'home_tryon', icon: '🏠', label: 'Ở Nhà' },
                                 { value: 'haul_review', icon: '🛍️', label: 'Haul Review' },
                                 { value: 'mix_match', icon: '🔀', label: 'Mix & Match' },
                                 { value: 'outfit_battle', icon: '⚔️', label: 'Đọ Outfit' },
                                 { value: 'loosely_draped', icon: '👘', label: 'Mặc Hờ' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setTryOnVariant(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${tryOnVariant === opt.value
                                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon} {opt.label}
                                 </button>
                              ))}
                           </div>
                           <div className="text-[7px] text-zinc-500">
                              {tryOnVariant === 'auto' && '🤖 AI tự chọn kiểu phù hợp với sản phẩm'}
                              {tryOnVariant === 'fitting_room' && '🚪 Phòng thử đồ — mở cửa reveal từng outfit'}
                              {tryOnVariant === 'home_tryon' && '🏠 Thử đồ ở nhà — cozy, order online về thử'}
                              {tryOnVariant === 'haul_review' && '🛍️ Review haul — unbox + thử + chấm điểm'}
                              {tryOnVariant === 'mix_match' && '🔀 1 item nhiều cách phối — capsule wardrobe'}
                              {tryOnVariant === 'outfit_battle' && '⚔️ So sánh outfit — vote engagement cao'}
                              {tryOnVariant === 'loosely_draped' && '👘 Mặc hờ / thả hờ — effortless chic, editorial'}
                           </div>
                        </div>

                        {/* Transition Style */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">🔄 Chuyển Outfit</label>
                           <div className="grid grid-cols-4 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'door_reveal', icon: '🚪', label: 'Mở Cửa' },
                                 { value: 'curtain_pull', icon: '🎭', label: 'Kéo Rèm' },
                                 { value: 'spin_change', icon: '🔄', label: 'Xoay Đổi' },
                                 { value: 'mirror_turn', icon: '🪞', label: 'Quay Gương' },
                                 { value: 'snap_cut', icon: '👋', label: 'Búng Tay' },
                                 { value: 'fabric_slide', icon: '🪨', label: 'Trượt Vải' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setTryOnTransition(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${tryOnTransition === opt.value
                                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon} {opt.label}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Pacing */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">⏱️ Tốc Độ</label>
                           <div className="grid grid-cols-4 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'quick_fire', icon: '⚡', label: 'Nhanh' },
                                 { value: 'detailed_review', icon: '📝', label: 'Chi Tiết' },
                                 { value: 'storytelling', icon: '📖', label: 'Kể Chuyện' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setTryOnPacing(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${tryOnPacing === opt.value
                                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon} {opt.label}
                                 </button>
                              ))}
                           </div>
                           <div className="text-[7px] text-zinc-500">
                              {tryOnPacing === 'auto' && '✨ AI chọn tốc độ phù hợp với duration & số outfit'}
                              {tryOnPacing === 'quick_fire' && '⚡ ~4s/outfit, beat-synced, minimal voice'}
                              {tryOnPacing === 'detailed_review' && '📝 8s/outfit, review chi tiết, chấm điểm'}
                              {tryOnPacing === 'storytelling' && '📖 8-16s/outfit, kể chuyện theo ngày/tình huống'}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* 🎨 AESTHETIC OPTIONS - Show for fashion_model displayType */}
                  {displayType === 'fashion_model' && cinematicStyle === 'standard' && (
                     <div className="mx-5 mb-3 space-y-3 bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
                        <div className="text-[9px] font-semibold text-blue-300 flex items-center gap-1">
                           <span className="text-xs">👗</span> Fashion Model Aesthetics
                        </div>
                        
                        {/* Aesthetic Vibe */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">🎨 Vibe</label>
                           <div className="grid grid-cols-3 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'romantic', icon: '💕', label: 'Romantic' },
                                 { value: 'power', icon: '💪', label: 'Power' },
                                 { value: 'goddess', icon: '✨', label: 'Goddess' },
                                 { value: 'minimal', icon: '◻️', label: 'Minimal' },
                                 { value: 'allure', icon: '🌙', label: 'Allure' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setAestheticVibe(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${aestheticVibe === opt.value
                                          ? 'bg-pink-500/15 border-pink-500/50 text-pink-200 shadow-sm shadow-pink-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon} {opt.label}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Model Personality */}
                        <div className="space-y-1.5">
                           <label className="text-[8px] uppercase tracking-wider font-semibold text-zinc-400">👤 Personality</label>
                           <div className="grid grid-cols-3 gap-1.5">
                              {[
                                 { value: 'auto', icon: '✨', label: 'Auto' },
                                 { value: 'casual_natural', icon: '🌸', label: 'Casual' },
                                 { value: 'shy_timid', icon: '🌷', label: 'Shy' },
                                 { value: 'confident_bold', icon: '💎', label: 'Confident' },
                                 { value: 'playful_flirty', icon: '✨', label: 'Playful' }
                              ].map(opt => (
                                 <button
                                    key={opt.value}
                                    onClick={() => setModelPersonality(opt.value as any)}
                                    className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all
                                       ${modelPersonality === opt.value
                                          ? 'bg-teal-500/15 border-teal-500/50 text-teal-200 shadow-sm shadow-teal-500/5'
                                          : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                 >
                                    {opt.icon} {opt.label}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* ═══════════ SECTION: References ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center">
                           <Camera className="w-3.5 h-3.5 text-pink-400" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Reference Images</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-pink-500/20 to-transparent ml-2" />
                     </div>

                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { label: "Face Reference", state: faceImage, setter: setFaceImage, ref: fileInputFaceRef, icon: Upload },
                        { label: "Outfit Reference", state: outfitImage, setter: setOutfitImage, ref: fileInputOutfitRef, icon: ImageIcon }
                     ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                           <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">{item.label}</label>
                           <div
                              onClick={() => item.ref.current?.click()}
                              className={`aspect-[3/4] rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden relative group
                      ${item.state ? 'border-purple-500/40 bg-purple-900/10' : 'border-zinc-700/60 hover:border-zinc-500 bg-zinc-950/40'}`}
                           >
                              {item.state ? (
                                 <img src={item.state} alt="Ref" className="w-full h-full object-cover" />
                              ) : (
                                 <div className="text-center p-4">
                                    <item.icon className="w-5 h-5 mx-auto mb-2 text-zinc-500 group-hover:text-zinc-300" />
                                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Upload</span>
                                 </div>
                              )}
                              {item.state && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-xs font-medium">Change</span></div>}
                           </div>
                           <input type="file" ref={item.ref} onChange={(e) => handleFileUpload(e, item.setter)} className="hidden" accept="image/*" />
                        </div>
                     ))}
                  </div>

                  {/* Face Preset Selection - Only show when no face image uploaded */}
                  {!faceImage && (
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                           <Sparkles className="w-3 h-3" /> Khuôn Mặt Mặc Định
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                           {FACE_PRESETS.map((preset) => (
                              <button
                                 key={preset.value}
                                 onClick={() => setFacePreset(preset.value)}
                                 className={`px-1.5 py-2 rounded-xl border text-center transition-all ${facePreset === preset.value
                                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                    : 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}
                                 title={preset.desc}
                              >
                                 <span className="text-sm block">{preset.emoji}</span>
                                 <span className="text-[8px] leading-tight block mt-0.5 truncate">{preset.label}</span>
                              </button>
                           ))}
                        </div>
                        <p className="text-[9px] text-zinc-600 italic">
                           {FACE_PRESETS.find(p => p.value === facePreset)?.desc || ''}
                        </p>
                     </div>
                  )}
                  {faceImage && (
                     <p className="text-[9px] text-green-500/80 flex items-center gap-1 px-5 pb-3">
                        <Check className="w-3 h-3" /> Sử dụng khuôn mặt từ ảnh đã upload
                     </p>
                  )}
                  </div>

                  {/* ═══════════ SECTION: Model & Product ═══════════ */}
                  <div className="p-5 border-b border-zinc-800/40">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                           <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Model & Product</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/20 to-transparent ml-2" />
                     </div>
                  <div className="space-y-5">

                     {/* 1. Body & Subject - Simplified for Affiliate */}
                     <div className="space-y-3">
                        <div className="space-y-3">
                           <select value={gender} onChange={(e) => setGender(e.target.value)}
                              className="w-full bg-zinc-950/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all">
                              <option>Female</option> <option>Male</option>
                           </select>

                           <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}
                              className="w-full bg-zinc-950/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all">
                              <option>Slim (Model)</option> <option>Athletic</option> <option>Balanced</option> <option>Curvy</option>
                           </select>

                           {/* Product Type Selector - Full PRODUCT_TYPE_GROUPS for Smart Style Pools */}
                           <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                              <div className="flex items-center justify-between mb-2">
                                 <label className="text-[9px] uppercase font-bold ml-1 text-purple-400">
                                    🛍️ Product Category
                                 </label>
                                 {productType === 'auto' && (
                                    <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                       🤖 AI Auto-detect
                                    </span>
                                 )}
                              </div>

                              {/* Auto + Combo quick buttons */}
                              <div className="grid grid-cols-2 gap-1.5 mb-2">
                                 {[
                                    { value: 'auto', emoji: '🤖', label: 'Auto Detect', desc: 'AI phân tích từ ảnh' },
                                    { value: 'combo', emoji: '🎀', label: 'Combo/Mix', desc: 'Nhiều món kết hợp' }
                                 ].map((pt) => (
                                    <button key={pt.value} onClick={() => setProductType(pt.value)}
                                       className={`py-1.5 px-2 rounded-xl text-[9px] font-medium border transition-all flex items-center gap-2
                                          ${productType === pt.value
                                             ? 'bg-green-500/15 border-green-500/50 text-green-200 shadow-sm shadow-green-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-900/40'}`}>
                                       <span className="text-sm">{pt.emoji}</span>
                                       <div className="text-left"><div>{pt.label}</div><div className="text-[7px] opacity-60">{pt.desc}</div></div>
                                    </button>
                                 ))}
                              </div>

                              {/* Product Type Groups - Expandable */}
                              <div className="space-y-1.5">
                                 {PRODUCT_TYPE_GROUPS.map((group) => (
                                    <details key={group.group} className="group" open={PRODUCT_TYPE_GROUPS.flatMap(g => g.items).some(i => i.value === productType && group.items.some(gi => gi.value === productType))}>
                                       <summary className="text-[9px] font-semibold text-zinc-400 cursor-pointer hover:text-zinc-200 flex items-center gap-1 py-1">
                                          <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                                          {group.label}
                                       </summary>
                                       <div className="grid grid-cols-3 gap-1 ml-4 mt-1 mb-1">
                                          {group.items.map((item) => (
                                             <button key={item.value} onClick={() => setProductType(item.value)}
                                                className={`py-1 px-1.5 rounded-xl text-[8px] font-medium border transition-all text-left truncate
                                                   ${productType === item.value
                                                      ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                                      : 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}>
                                                {item.emoji} {item.label}
                                             </button>
                                          ))}
                                       </div>
                                    </details>
                                 ))}
                              </div>

                              {productType === 'auto' && (
                                 <p className="text-[9px] text-green-400/70 mt-2 ml-1">
                                    ✨ AI will analyze your product image to determine category, material, and features automatically
                                 </p>
                              )}
                           </div>

                           {/* Product Details - Collapsed Optional for Affiliate */}
                           <details className="mt-3 pt-3 border-t border-zinc-800/50">
                              <summary className="text-[9px] uppercase text-purple-400 font-bold ml-1 cursor-pointer hover:text-purple-300 flex items-center gap-1">
                                 <ChevronDown className="w-3 h-3" /> 📝 Product Details (Optional)
                              </summary>
                              <div className="mt-2 space-y-2 animate-in fade-in">
                                 <div className="space-y-1">
                                    <label className="text-[9px] text-zinc-500 ml-1">Material / Fabric</label>
                                    <input
                                       type="text"
                                       placeholder="e.g., Premium cotton, Silk blend, Stretch fabric..."
                                       className="w-full bg-zinc-950/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 placeholder:text-zinc-600 transition-all"
                                       value={fabricMaterial}
                                       onChange={(e) => setFabricMaterial(e.target.value)}
                                    />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[9px] text-zinc-500 ml-1">Key Features</label>
                                    <input
                                       type="text"
                                       placeholder="e.g., Flattering fit, Breathable, Easy care..."
                                       className="w-full bg-zinc-950/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 placeholder:text-zinc-600 transition-all"
                                       value={productHighlights}
                                       onChange={(e) => setProductHighlights(e.target.value)}
                                    />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[9px] text-zinc-500 ml-1">Available Sizes</label>
                                    <input
                                       type="text"
                                       placeholder="e.g., S-XXL, One size, XS to 3XL..."
                                       className="w-full bg-zinc-950/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 placeholder:text-zinc-600 transition-all"
                                       value={availableSizes}
                                       onChange={(e) => setAvailableSizes(e.target.value)}
                                    />
                                 </div>
                                 <p className="text-[8px] text-purple-400/60 ml-1">
                                    ✨ These details help AI create more accurate and compelling hooks
                                 </p>
                              </div>
                           </details>

                           {/* Additional Notes - Unified for Affiliate Mode */}
                           <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                              <div className="space-y-1">
                                 <label className="text-[9px] ml-1 flex items-center gap-1 text-purple-400">
                                    <span>✏️</span>
                                    Additional Notes / Special Requirements
                                 </label>
                                 <textarea
                                    placeholder="Add any special requests or notes for your affiliate video...\ne.g., Focus on waist area, warm tones, model smiling, slower transitions, add slow motion in scene 2..."
                                    className="w-full bg-zinc-950/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none placeholder:text-zinc-600 min-h-[70px] resize-y focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
                                    value={additionalDescription}
                                    onChange={(e) => setAdditionalDescription(e.target.value)}
                                    rows={3}
                                 />
                                 <p className="text-[8px] text-zinc-600 ml-1">
                                    💡 AI will integrate these notes into the video. More details = better results!
                                 </p>
                              </div>
                           </div>


                           {/* Location Region Selector */}
                           <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                              <div className="flex items-center justify-between mb-2">
                                 <label className="text-[9px] uppercase text-emerald-400 font-bold ml-1 flex items-center gap-1">
                                    📍 Bối cảnh / Location
                                 </label>
                                 {locationVault.length > 0 && (
                                    <span className="text-[9px] text-zinc-500">{locationVault.length} đã dùng</span>
                                 )}
                              </div>

                              {/* Region Grid */}
                              <div className="grid grid-cols-2 gap-1.5 mb-2">
                                 {LOCATION_REGIONS.slice(0, 6).map((region) => (
                                    <button
                                       key={region.value}
                                       onClick={() => setLocationRegion(region.value)}
                                       className={`py-1.5 px-2 rounded-xl text-left border transition-all flex items-center gap-1.5
                                    ${locationRegion === region.value
                                             ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-900/40'}`}
                                    >
                                       <span className="text-sm">{region.emoji}</span>
                                       <span className="text-[9px] font-medium truncate">{region.label}</span>
                                    </button>
                                 ))}
                              </div>

                              {/* More Regions Dropdown */}
                              <details className="group">
                                 <summary className="text-[9px] text-zinc-500 cursor-pointer hover:text-zinc-300 flex items-center gap-1">
                                    <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                                    Thêm bối cảnh khác
                                 </summary>
                                 <div className="grid grid-cols-2 gap-1.5 mt-2 animate-in fade-in slide-in-from-top-2">
                                    {LOCATION_REGIONS.slice(6).map((region) => (
                                       <button
                                          key={region.value}
                                          onClick={() => setLocationRegion(region.value)}
                                          className={`py-1.5 px-2 rounded-xl text-left border transition-all flex items-center gap-1.5
                                       ${locationRegion === region.value
                                                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/5'
                                                : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-900/40'}`}
                                       >
                                          <span className="text-sm">{region.emoji}</span>
                                          <span className="text-[9px] font-medium truncate">{region.label}</span>
                                       </button>
                                    ))}
                                 </div>
                              </details>

                              {/* Selected Region Info */}
                              {locationRegion !== 'auto' && (
                                 <div className="mt-2 p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[9px] text-emerald-300/80">
                                    <span className="font-bold">{LOCATION_REGIONS.find(r => r.value === locationRegion)?.label}:</span>{' '}
                                    {LOCATION_REGIONS.find(r => r.value === locationRegion)?.desc}
                                    {getSuggestedLocations(locationRegion, 10).length > 0 && (
                                       <p className="mt-1 text-emerald-400/60">
                                          🎲 {getSuggestedLocations(locationRegion, 10).length} bối cảnh ngẫu nhiên sẵn sàng
                                       </p>
                                    )}
                                 </div>
                              )}

                              {/* Auto Mode Info */}
                              {locationRegion === 'auto' && (
                                 <div className="mt-2 p-2 bg-blue-950/20 border border-blue-500/20 rounded-xl text-[9px] text-blue-300/80">
                                    <span className="font-bold">🎲 AI Tự Chọn Ngẫu Nhiên:</span>{' '}
                                    AI sẽ random từ tất cả các vùng dựa trên loại sản phẩm
                                    <p className="mt-1 text-blue-400/60">
                                       ✓ {getRandomLocationsForAuto(20).length} bối cảnh khả dụng từ tất cả vùng
                                    </p>
                                 </div>
                              )}

                              {/* Mode Toggles - Always available in unified Affiliate Mode */}
                              <div className="mt-3 pt-3 border-t border-zinc-800/30">
                                 <button
                                       onClick={() => setEditorialMode(!editorialMode)}
                                       className={`w-full py-2 px-3 rounded-xl border transition-all flex items-center justify-between
                                    ${editorialMode
                                             ? 'bg-rose-500/15 border-rose-500/50 text-rose-200 shadow-sm shadow-rose-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🔞</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Editorial Mode</span>
                                             <span className="text-[8px] opacity-70">Foundation-free silhouette</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${editorialMode ? 'bg-rose-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${editorialMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {editorialMode && (
                                       <p className="mt-1.5 text-[8px] text-rose-300/60 px-1">
                                          ⚠️ Mô tả trang phục với silhouette tự nhiên, không có lớp foundation bên trong
                                       </p>
                                    )}

                                    {/* Wallpaper Mode Toggle */}
                                    <button
                                       onClick={() => setWallpaperMode(!wallpaperMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-xl border transition-all flex items-center justify-between
                                    ${wallpaperMode
                                             ? 'bg-violet-500/15 border-violet-500/50 text-violet-200 shadow-sm shadow-violet-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🖼️</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Wallpaper Mode</span>
                                             <span className="text-[8px] opacity-70">Hình nền điện thoại</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${wallpaperMode ? 'bg-violet-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${wallpaperMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {wallpaperMode && (
                                       <p className="mt-1.5 text-[8px] text-violet-300/60 px-1">
                                          📱 Background đẹp cho lock screen - chừa chỗ cho đồng hồ & icons
                                       </p>
                                    )}

                                    {/* Lookbook Mode Toggle */}
                                    <button
                                       onClick={() => setLookbookMode(!lookbookMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-xl border transition-all flex items-center justify-between
                                    ${lookbookMode
                                             ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">📸</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Lookbook Mode</span>
                                             <span className="text-[8px] opacity-70">35-52 ảnh, không video</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${lookbookMode ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${lookbookMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {lookbookMode && (
                                       <p className="mt-1.5 text-[8px] text-amber-300/60 px-1">
                                          📷 Tạo 35 ảnh (52 nếu áo dài) lookbook: standing, dynamic, seated, squat, upper/lower focus (safe vocabulary)
                                       </p>
                                    )}

                                    {/* Seductive Mode Toggle */}
                                    <button
                                       onClick={() => setSeductiveMode(!seductiveMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-xl border transition-all flex items-center justify-between
                                    ${seductiveMode
                                             ? 'bg-pink-500/15 border-pink-500/50 text-pink-200 shadow-sm shadow-pink-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">💋</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Seductive Mode</span>
                                             <span className="text-[8px] opacity-70">Quyến rũ TikTok-safe</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${seductiveMode ? 'bg-pink-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${seductiveMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {seductiveMode && (
                                       <p className="mt-1.5 text-[8px] text-pink-300/60 px-1">
                                          💃 Video quyến rũ: smoldering gaze, magnetic presence, slow movements
                                       </p>
                                    )}

                                    {/* Sexy Mode Toggle - Private */}
                                    <button
                                       onClick={() => setSexyMode(!sexyMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-xl border transition-all flex items-center justify-between
                                    ${sexyMode
                                             ? 'bg-red-500/15 border-red-500/50 text-red-200 shadow-sm shadow-red-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🔥</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Sexy Mode</span>
                                             <span className="text-[8px] opacity-70">Nano Banana Pro & Veo 3.1</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${sexyMode ? 'bg-red-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${sexyMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {sexyMode && (
                                       <p className="mt-1.5 text-[8px] text-red-300/60 px-1">
                                          🔞 Chế độ riêng tư: nội dung sexy cho AI video tools
                                       </p>
                                    )}

                                    {/* Studio Mode Toggle - Professional TikTok Affiliate backgrounds */}
                                    <button
                                       onClick={() => setStudioMode(!studioMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-xl border transition-all flex items-center justify-between
                                    ${studioMode
                                             ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-200 shadow-sm shadow-indigo-500/5'
                                             : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🎬</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Studio Mode</span>
                                             <span className="text-[8px] opacity-70">Professional themed backgrounds</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${studioMode ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${studioMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {studioMode && (
                                       <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                                          {/* Studio Category Selector */}
                                          <div className="p-2 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                                             <div className="flex items-center justify-between mb-2">
                                                <span className="text-[9px] text-indigo-300 font-medium">🎬 Chọn loại Studio</span>
                                                {studioVault.length > 0 && (
                                                   <button
                                                      onClick={clearStudioVault}
                                                      className="text-[8px] text-red-400 hover:text-red-300 flex items-center gap-1"
                                                   >
                                                      <Trash2 className="w-2.5 h-2.5" /> Xóa vault
                                                   </button>
                                                )}
                                             </div>
                                             <div className="grid grid-cols-2 gap-1">
                                                {STUDIO_CATEGORIES.map((cat) => (
                                                   <button
                                                      key={cat.value}
                                                      onClick={() => setStudioCategory(cat.value)}
                                                      className={`py-1 px-2 rounded-xl text-left border transition-all flex items-center gap-1
                                                         ${studioCategory === cat.value
                                                            ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-200 shadow-sm shadow-indigo-500/5'
                                                            : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-900/40'}`}
                                                   >
                                                      <span className="text-xs">{cat.emoji}</span>
                                                      <span className="text-[8px] font-medium truncate">{cat.label.replace(' Studios', '').replace(' Tết & Hội', '')}</span>
                                                   </button>
                                                ))}
                                             </div>
                                             {/* Selected Category Info */}
                                             <div className="mt-2 text-[8px] text-indigo-300/70">
                                                {studioCategory === 'auto' ? (
                                                   <span>🎲 AI tự chọn từ {STUDIO_CATEGORIES.reduce((acc, c) => acc + (c.studios?.length || 0), 0)} studios</span>
                                                ) : (
                                                   <span>
                                                      {STUDIO_CATEGORIES.find(c => c.value === studioCategory)?.studios?.length || 0} studios -
                                                      {getRandomStudios(studioCategory, 10).length} khả dụng
                                                   </span>
                                                )}
                                             </div>
                                          </div>
                                          {/* Studio Vault History */}
                                          {studioVault.length > 0 && (
                                             <div className="p-2 bg-zinc-800/20 border border-zinc-700/20 rounded-xl">
                                                <div className="flex items-center justify-between mb-1">
                                                   <span className="text-[8px] text-zinc-400 flex items-center gap-1">
                                                      <History className="w-2.5 h-2.5" />
                                                      {studioVault.length} studio đã dùng
                                                   </span>
                                                </div>
                                                <div className="text-[7px] text-zinc-500 space-y-0.5 max-h-16 overflow-y-auto">
                                                   {studioVault.slice(0, 3).map((item, i) => (
                                                      <div key={item.id} className="truncate">
                                                         • {item.studio.split(' | ')[0]}
                                                      </div>
                                                   ))}
                                                   {studioVault.length > 3 && (
                                                      <div className="text-zinc-600">...và {studioVault.length - 3} khác</div>
                                                   )}
                                                </div>
                                             </div>
                                          )}
                                          {/* 🎨 Product Color for Color Contrast */}
                                          <div className="p-2 bg-gradient-to-r from-pink-950/20 to-orange-950/20 border border-pink-500/20 rounded-xl">
                                             <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[9px] text-pink-300 font-medium">🎨 Màu sản phẩm (Studio Contrast)</span>
                                             </div>
                                             <input
                                                type="text"
                                                value={productColor}
                                                onChange={(e) => setProductColor(e.target.value)}
                                                placeholder="VD: đỏ, xanh navy, vàng gold..."
                                                className="w-full px-2 py-1.5 bg-zinc-950/60 border border-zinc-700/40 rounded-xl text-[9px] text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none"
                                             />
                                             <p className="mt-1 text-[7px] text-pink-300/50">
                                                Nhập màu để lọc studio tương phản (để trống = AI tự detect)
                                             </p>
                                          </div>
                                       </div>
                                    )}

                                    {/* Aspect Ratio Selector */}
                                    <div className="mt-3 pt-2 border-t border-zinc-800/50">
                                       <div className="text-[9px] text-zinc-500 mb-2 flex items-center gap-1">
                                          📐 Tỷ lệ khung hình
                                       </div>
                                       <div className="grid grid-cols-2 gap-2">
                                          <button
                                             onClick={() => setAspectRatio('9:16')}
                                             className={`py-2 px-3 rounded-xl border transition-all flex flex-col items-center gap-1
                                          ${aspectRatio === '9:16'
                                                   ? 'bg-blue-500/15 border-blue-500/50 text-blue-200 shadow-sm shadow-blue-500/5'
                                                   : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                          >
                                             <div className={`w-4 h-6 border-2 rounded-sm ${aspectRatio === '9:16' ? 'border-blue-400' : 'border-zinc-500'}`} />
                                             <span className="text-[9px] font-medium">9:16 Dọc</span>
                                             <span className="text-[7px] opacity-60">TikTok, Reels</span>
                                          </button>
                                          <button
                                             onClick={() => setAspectRatio('16:9')}
                                             className={`py-2 px-3 rounded-xl border transition-all flex flex-col items-center gap-1
                                          ${aspectRatio === '16:9'
                                                   ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/5'
                                                   : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/40'}`}
                                          >
                                             <div className={`w-6 h-4 border-2 rounded-sm ${aspectRatio === '16:9' ? 'border-emerald-400' : 'border-zinc-500'}`} />
                                             <span className="text-[9px] font-medium">16:9 Ngang</span>
                                             <span className="text-[7px] opacity-60">Desktop, YouTube</span>
                                          </button>
                                       </div>
                                       {aspectRatio === '16:9' && (
                                          <p className="mt-1.5 text-[8px] text-emerald-300/60 px-1">
                                             🖥️ Khung hình ngang - model nhỏ hơn, background rõ hơn, cinematic
                                          </p>
                                       )}
                                    </div>
                                 </div>
                              </div>

                     {/* 2. Cinematography (Auto) & Location Vault */}
                     <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center text-xs font-semibold text-zinc-400 gap-1.5">
                              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> Auto-Director
                           </div>
                           <span className="text-[9px] uppercase tracking-wider text-purple-400/80 font-medium">AI Active</span>
                        </div>
                        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                           <p className="text-[10px] text-purple-200/70 leading-relaxed">
                              🎯 Real-life production script: AI Director creates optimized {videoDuration}s affiliate video with motion prompts, Vietnamese sales hooks, and production notes for your team.
                           </p>

                           {/* Location History Panel */}
                           {locationVault.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-purple-500/10">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                       <History className="w-3 h-3" /> Lịch sử bối cảnh
                                    </span>
                                    <button
                                       onClick={clearLocationVault}
                                       className="text-[8px] text-red-400/70 hover:text-red-300 flex items-center gap-0.5"
                                    >
                                       <Trash2 className="w-2.5 h-2.5" /> Xóa tất cả
                                    </button>
                                 </div>
                                 <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {locationVault.slice(0, 5).map((item) => (
                                       <div key={item.id} className="flex items-center gap-2 text-[9px] p-1.5 bg-zinc-950/40 rounded-xl group">
                                          <span className="text-zinc-600">
                                             {LOCATION_REGIONS.find(r => r.value === item.region)?.emoji || '📍'}
                                          </span>
                                          <span className="flex-1 text-zinc-400 truncate" title={item.location}>
                                             {item.location.slice(0, 40)}...
                                          </span>
                                          <button
                                             onClick={() => removeFromVault(item.id)}
                                             className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-opacity"
                                          >
                                             <X className="w-3 h-3" />
                                          </button>
                                       </div>
                                    ))}
                                    {locationVault.length > 5 && (
                                       <p className="text-[8px] text-zinc-600 text-center">+{locationVault.length - 5} khác</p>
                                    )}
                                 </div>
                              </div>
                           )}

                           {/* Script History Panel - TikTok Shop only */}
                           {scriptVault.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-orange-500/10">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                       <FileText className="w-3 h-3" /> Script đã dùng ({scriptVault.length})
                                    </span>
                                    <button
                                       onClick={clearScriptVault}
                                       className="text-[8px] text-red-400/70 hover:text-red-300 flex items-center gap-0.5"
                                    >
                                       <Trash2 className="w-2.5 h-2.5" /> Xóa
                                    </button>
                                 </div>
                                 <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {scriptVault.slice(0, 4).map((item) => (
                                       <div key={item.id} className="text-[9px] p-1.5 bg-zinc-950/40 rounded-xl text-zinc-500 truncate" title={item.hook}>
                                          "{item.hook.slice(0, 50)}..."
                                       </div>
                                    ))}
                                    {scriptVault.length > 4 && (
                                       <p className="text-[8px] text-zinc-600 text-center">+{scriptVault.length - 4} khác</p>
                                    )}
                                 </div>
                                 <p className="text-[8px] text-orange-400/60 mt-1.5">AI sẽ tránh các hook tương tự</p>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* 3. Duration - Affiliate Optimized */}
                     <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center justify-between text-xs">
                           <span className="font-semibold text-zinc-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Video Duration</span>
                           <span className={`text-[9px] px-2 py-0.5 rounded ${
                              videoDuration <= 8 ? 'text-orange-400 bg-orange-500/10' :
                              videoDuration <= 16 ? 'text-blue-400 bg-blue-500/10' :
                              videoDuration <= 24 ? 'text-green-400 bg-green-500/10' :
                              videoDuration <= 32 ? 'text-pink-400 bg-pink-500/10' :
                              videoDuration <= 40 ? 'text-amber-400 bg-amber-500/10' :
                              'text-purple-400 bg-purple-500/10'
                           }`}>
                              {videoDuration}s {videoDuration === 24 && '⭐ Best CVR'}
                           </span>
                        </div>
                        
                        {/* Affiliate Presets */}
                        <div className="grid grid-cols-3 gap-1.5">
                           {[
                              { dur: 8, label: 'Flash Ad', desc: 'Reels hook', icon: '⚡' },
                              { dur: 16, label: 'Quick Sell', desc: 'Hook+CTA', icon: '🛒' },
                              { dur: 24, label: 'Conversion', desc: 'Best CVR ⭐', icon: '💰' },
                              { dur: 32, label: 'Viral', desc: 'Story+CTA', icon: '🔥' },
                              { dur: 40, label: 'Deep Sell', desc: 'Demo+Trust', icon: '🎯' },
                              { dur: 48, label: 'Storytelling', desc: 'Full journey', icon: '🎬' }
                           ].map((opt) => (
                              <button 
                                 key={opt.dur} 
                                 onClick={() => setVideoDuration(opt.dur)}
                                 className={`py-2 px-2 rounded-xl border transition-all text-center
                                    ${videoDuration === opt.dur
                                       ? 'bg-purple-600/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/5'
                                       : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-900/40'}`}
                              >
                                 <div className="text-[11px] font-bold">{opt.icon} {opt.dur}s</div>
                                 <div className="text-[8px] opacity-70">{opt.label}</div>
                                 <div className="text-[7px] opacity-50">{opt.desc}</div>
                              </button>
                           ))}
                        </div>
                        
                        {/* Range Slider - 8s increments */}
                        <div className="space-y-2">
                           <input
                              type="range"
                              min="8"
                              max="48"
                              step="8"
                              value={videoDuration}
                              onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-700/50 rounded-xl appearance-none cursor-pointer accent-purple-500"
                           />
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] text-zinc-300 font-medium">{videoDuration}s = {Math.floor(videoDuration / 8)} scenes × 8s</span>
                              <span className="text-[9px] text-zinc-500 ml-auto">Veo 3.1: 8s/clip</span>
                           </div>
                        </div>
                        
                        {/* Dynamic affiliate tip based on selected duration */}
                        <div className="text-[9px] bg-zinc-950/40 border border-zinc-800/30 rounded-xl p-2 space-y-0.5">
                           {videoDuration <= 8 && <>
                              <p className="text-orange-400 font-semibold">⚡ Flash Ad (8s): 1 scene duy nhất</p>
                              <p className="text-zinc-500">Hook mạnh + giá shock + CTA ngay. Dùng cho retargeting, story ads.</p>
                           </>}
                           {videoDuration > 8 && videoDuration <= 16 && <>
                              <p className="text-blue-400 font-semibold">🛒 Quick Sell (16s): Hook → CTA nhanh</p>
                              <p className="text-zinc-500">2 scenes: Product flash + Price reveal → Urgency CTA. Completion rate 70%+.</p>
                           </>}
                           {videoDuration > 16 && videoDuration <= 24 && <>
                              <p className="text-green-400 font-semibold">💰 Conversion Mode (24s): Best CVR cho affiliate</p>
                              <p className="text-zinc-500">3 scenes: Hook+Price → USP showcase → CTA+Urgency. Completion 60%+, CVR 3-6%.</p>
                           </>}
                           {videoDuration > 24 && videoDuration <= 32 && <>
                              <p className="text-pink-400 font-semibold">🔥 Viral Mode (32s): Story + Dual CTA</p>
                              <p className="text-zinc-500">4 scenes: Hook → USP → Social proof → CTA. Dual CTA @16s + @28s. Algorithm boost.</p>
                           </>}
                           {videoDuration > 32 && videoDuration <= 40 && <>
                              <p className="text-amber-400 font-semibold">🎯 Deep Sell (40s): Demo + Trust building</p>
                              <p className="text-zinc-500">5 scenes: Hook → Detail demo → Before/After → Trust signals → Strong CTA.</p>
                           </>}
                           {videoDuration > 40 && <>
                              <p className="text-purple-400 font-semibold">🎬 Storytelling ({videoDuration}s): Full customer journey</p>
                              <p className="text-zinc-500">6+ scenes: Hook → Problem → Solution → Demo → Proof → CTA. Cho sản phẩm cần giải thích.</p>
                           </>}
                        </div>
                     </div>
                  </div>

                  {/* 4. Voice Style - Veo 3.1 Native Audio */}
                  <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                     <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-400 flex items-center gap-1.5">🎙️ Voice Style</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded ${
                           voiceStyle === 'no_voice' ? 'text-zinc-500 bg-zinc-800/50' : 'text-emerald-400 bg-emerald-500/10'
                        }`}>
                           {voiceStyle === 'no_voice' ? '🎵 Product Focus' : 
                            voiceStyle === 'saigon_female' ? '🇻🇳 Sài Gòn Nữ' :
                            voiceStyle === 'saigon_male' ? '🇻🇳 Sài Gòn Nam' :
                            voiceStyle === 'hanoi_female' ? '🇻🇳 Hà Nội Nữ' : '🇻🇳 Hà Nội Nam'}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-5 gap-1.5">
                        {[
                           { value: 'saigon_female' as const, label: 'SG Nữ', icon: '👩', desc: 'Giọng Sài Gòn nữ' },
                           { value: 'saigon_male' as const, label: 'SG Nam', icon: '👨', desc: 'Giọng Sài Gòn nam' },
                           { value: 'hanoi_female' as const, label: 'HN Nữ', icon: '👩', desc: 'Giọng Hà Nội nữ' },
                           { value: 'hanoi_male' as const, label: 'HN Nam', icon: '👨', desc: 'Giọng Hà Nội nam' },
                           { value: 'no_voice' as const, label: 'No Voice', icon: '🔇', desc: 'Music + Text + Motion' }
                        ].map(opt => (
                           <button
                              key={opt.value}
                              onClick={() => setVoiceStyle(opt.value)}
                              className={`py-2 px-1 rounded-xl border transition-all text-center
                                 ${voiceStyle === opt.value
                                    ? 'bg-emerald-600/15 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/5'
                                    : 'bg-zinc-950/40 border-zinc-700/40 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-900/40'}`}
                           >
                              <div className="text-[11px]">{opt.icon}</div>
                              <div className="text-[8px] font-medium mt-0.5">{opt.label}</div>
                           </button>
                        ))}
                     </div>
                     
                     <p className="text-[9px] text-emerald-400/70">
                        {lookbookMode
                           ? '⚠️ Lookbook Mode = chỉ ảnh tĩnh — voice không được sử dụng. Tắt Lookbook để dùng voice.'
                           : voiceStyle === 'no_voice' 
                              ? '🎵 Product Focus — Music + Text overlays + Beat-sync motion. Không voice, sản phẩm là ngôi sao!'
                              : `🎙️ Veo 3.1 tạo giọng ${voiceStyle.includes('saigon') ? 'miền Nam Sài Gòn' : 'miền Bắc Hà Nội'} — cùng 1 giọng cho tất cả scenes`}
                     </p>
                     
                     {/* No-voice feature highlights */}
                     {voiceStyle === 'no_voice' && !lookbookMode && (
                        <div className="bg-zinc-900/60 rounded-lg p-2.5 border border-zinc-700/30 space-y-1">
                           <div className="text-[9px] font-semibold text-purple-400">✨ No-Voice Product Focus Mode</div>
                           <div className="grid grid-cols-2 gap-1">
                              {[
                                 { icon: '🎵', text: 'Beat-sync motion' },
                                 { icon: '📝', text: 'Text overlays thay voice' },
                                 { icon: '💃', text: 'TikToker choreography' },
                                 { icon: '📦', text: 'Product 80%+ screen time' },
                              ].map(f => (
                                 <div key={f.text} className="flex items-center gap-1 text-[8px] text-zinc-400">
                                    <span>{f.icon}</span>{f.text}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* ═══════════ SECTION: Generate ═══════════ */}
                  <div className="p-5">
                  {/* Brief Input */}
                  <div className="relative mb-4">
                     <textarea
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        className="w-full h-20 bg-zinc-950/40 border border-zinc-700/40 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10 resize-none transition-all"
                        placeholder="Additional creative details... (mood, styling, special requests)"
                     />
                  </div>

                  {/* Generate Button */}
                  <button
                     onClick={runDirector}
                     disabled={!outfitImage || directorThinking}
                     className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5
                        ${outfitImage && !directorThinking
                           ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99]'
                           : 'bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-700/30'}`}
                  >
                     {directorThinking ? <><RefreshCcw className="w-4 h-4 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4" /> Generate Affiliate Video</>}
                  </button>
                  </div>

               </div>
            </div>

            {/* Bottom Section: Results Output */}
            <div ref={outputSectionRef} className="flex flex-col min-h-[600px]">
               <div className="rounded-2xl flex-1 flex flex-col relative overflow-hidden border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm shadow-2xl shadow-black/20">

                  {/* 1. Director View */}
                  {step === 'director' && (
                     <div className="absolute inset-0 z-10 flex flex-col bg-[#09090b]">

                        {(directorThinking || videoRefining) ? (
                           <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                              <div className="relative">
                                 <div className="w-16 h-16 border-4 border-zinc-800 rounded-full"></div>
                                 <div className={`w-16 h-16 border-4 ${videoRefining ? 'border-pink-500' : 'border-purple-500'} border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
                              </div>
                              <div className="text-center">
                                 {videoRefining ? (
                                    <>
                                       <h3 className="text-lg font-display text-white flex items-center justify-center gap-2">
                                          <Sparkles className="w-5 h-5 text-pink-400" />
                                          Phase 2: Refining Video Scenes
                                       </h3>
                                       <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">
                                          AI đang tối ưu scene prompts liền mạch hơn
                                       </p>
                                       <div className="mt-4 text-[10px] text-pink-400 space-y-1">
                                          <p>✓ Checking character consistency</p>
                                          <p>✓ Verifying outfit preservation</p>
                                          <p>✓ Ensuring seamless transitions</p>
                                          <p className="animate-pulse">⟳ Syncing to beat pattern...</p>
                                       </div>
                                    </>
                                 ) : (
                                    <>
                                       <h3 className="text-lg font-display text-white">
                                          Phase 1: AI Director Filming
                                       </h3>
                                       <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">
                                          Creating Optimized {videoDuration}s Affiliate Video
                                       </p>
                                       <p className="text-[10px] text-purple-400 mt-3">
                                          Phase 2 (Video Refinement) will run automatically
                                       </p>
                                    </>
                                 )}
                                 {locationVault.length > 0 && !videoRefining && (
                                    <p className="text-[10px] text-purple-400 mt-2">
                                       Avoiding {locationVault.length} previous locations
                                    </p>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <>
                              {/* Tab Header */}
                              <div className="flex items-center gap-1.5 p-4 border-b border-zinc-800/40 bg-zinc-900/60 backdrop-blur-sm flex-wrap">
                                 <>
                                    <TabButton active={activeTab === 'master'} onClick={() => setActiveTab('master')} icon={Camera} label="Master Prompt" />
                                    <TabButton active={activeTab === 'keyframes'} onClick={() => setActiveTab('keyframes')} icon={Layers} label="Keyframes" />
                                    <TabButton active={activeTab === 'scenes'} onClick={() => setActiveTab('scenes')} icon={Clapperboard} label="Scenes & Script" />
                                    {directorOutput?.sections.refinedScenes && (
                                       <TabButton active={activeTab === 'refined'} onClick={() => setActiveTab('refined')} icon={Sparkles} label="✨ Refined Scenes" />
                                    )}
                                    {directorOutput?.sections.production && (
                                       <TabButton active={activeTab === 'production'} onClick={() => setActiveTab('production')} icon={FileText} label="Production Notes" />
                                    )}
                                 </>
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 overflow-y-auto p-6 relative">
                                 <div className="font-mono text-sm leading-relaxed text-zinc-300">

                                    {activeTab === 'master' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 relative">
                                          <div>
                                             <h4 className="text-purple-400 mb-2 text-xs font-bold uppercase tracking-widest">Common Master Prompt</h4>
                                             <div className="bg-zinc-950/40 p-6 rounded-xl border border-zinc-800/30 whitespace-pre-wrap relative group">
                                                {directorOutput?.sections.master}
                                                <CopyButton text={directorOutput?.sections.master || ''} />
                                             </div>
                                             <p className="mt-2 text-[10px] text-zinc-500">
                                                Use this prompt as the "Common Prompt" in your generation tool. It defines the character, outfit, and style for the entire video.
                                             </p>
                                          </div>
                                       </div>
                                    )}
                                    {activeTab === 'keyframes' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <h4 className="text-blue-400 mb-2 text-xs font-bold uppercase tracking-widest">Image Sequence</h4>
                                          {parseSegments(directorOutput?.sections.keyframes || '', 'image').map((segment, idx) => (
                                             <div key={idx} className="bg-zinc-950/40 rounded-xl border border-zinc-800/30 overflow-hidden relative group">
                                                <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800/30 flex justify-between items-center">
                                                   <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">{segment.title}</span>
                                                </div>
                                                <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300">
                                                   {segment.content}
                                                </div>
                                                <CopyButton text={segment.content} />
                                             </div>
                                          ))}
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             Copy individual prompts to generate keyframes (Start, Middle, End).
                                          </p>
                                       </div>
                                    )}
                                    {activeTab === 'scenes' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <h4 className="text-green-400 mb-2 text-xs font-bold uppercase tracking-widest">
                                             Scene Prompts & Vietnamese Script
                                          </h4>
                                          {directorOutput?.sections.refinedScenes && (
                                             <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
                                                <p className="text-xs text-purple-300">
                                                   💡 <strong>Tip:</strong> Check the <span className="text-pink-400 font-bold">✨ Refined Scenes</span> tab for improved video continuity!
                                                </p>
                                             </div>
                                          )}
                                          {parseSegments(directorOutput?.sections.scenes || '', 'scene').map((segment, idx) => (
                                             <div key={idx} className="bg-zinc-950/40 rounded-xl border border-zinc-800/30 overflow-hidden relative group">
                                                <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800/30 flex justify-between items-center">
                                                   <span className="text-[10px] font-bold text-green-300 uppercase tracking-wider">{segment.title}</span>
                                                </div>
                                                <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300">
                                                   {segment.content}
                                                </div>
                                                <CopyButton text={segment.content} />
                                             </div>
                                          ))}
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             Each scene includes motion prompt and Vietnamese sales script. Use for real video shooting.
                                          </p>
                                       </div>
                                    )}
                                    {activeTab === 'refined' && directorOutput?.sections.refinedScenes && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <div className="flex items-center justify-between mb-4">
                                             <h4 className="text-pink-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Refined Video Scenes (Phase 2)
                                             </h4>
                                             <span className="text-[10px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 px-2 py-1 rounded-full border border-pink-500/30">
                                                AI-Enhanced Continuity
                                             </span>
                                          </div>
                                          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-4 mb-4">
                                             <p className="text-xs text-purple-200 leading-relaxed">
                                                <strong>✨ Phase 2 Refinement:</strong> These scene prompts have been analyzed by AI to ensure:
                                             </p>
                                             <ul className="text-[10px] text-purple-300 mt-2 space-y-1 ml-4">
                                                <li>✓ <strong>Character Consistency:</strong> Same face, body, outfit in all scenes</li>
                                                <li>✓ <strong>Seamless Transitions:</strong> END_POSE → START_POSE matches perfectly</li>
                                                <li>✓ <strong>Living Environment:</strong> Ambient motion (wind, light, background)</li>
                                                <li>✓ <strong>Beat-Sync:</strong> Poses aligned with remix drops and beats</li>
                                                <li>✓ <strong>Fabric Physics:</strong> Consistent outfit behavior during motion</li>
                                             </ul>
                                          </div>
                                          <div className="bg-zinc-950/40 rounded-xl border border-pink-800/30 overflow-hidden relative group">
                                             <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-4 py-3 border-b border-pink-800/30 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Full Refined Scene Prompts</span>
                                             </div>
                                             <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto">
                                                {directorOutput?.sections.refinedScenes}
                                             </div>
                                             <CopyButton text={directorOutput?.sections.refinedScenes || ''} />
                                          </div>
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             🎬 Use these REFINED prompts for Veo 3.1 to get smoother, more consistent video results with better beat sync.
                                          </p>
                                       </div>
                                    )}
                                    {activeTab === 'production' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <h4 className="text-orange-400 mb-2 text-xs font-bold uppercase tracking-widest">Production Notes</h4>
                                          <div className="bg-zinc-950/40 rounded-xl border border-zinc-800/30 overflow-hidden relative">
                                             <div className="bg-orange-900/20 px-4 py-2 border-b border-orange-800/30 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">Shooting Guide</span>
                                             </div>
                                             <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed">
                                                {directorOutput?.sections.production}
                                             </div>
                                             <CopyButton text={directorOutput?.sections.production || ''} />
                                          </div>
                                          {directorOutput?.sections.metadata && (
                                             <div className="bg-zinc-950/40 rounded-xl border border-zinc-800/30 overflow-hidden relative mt-4">
                                                <div className="bg-purple-900/20 px-4 py-2 border-b border-purple-800/30">
                                                   <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Metadata & Batch Info</span>
                                                </div>
                                                <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300">
                                                   {directorOutput?.sections.metadata}
                                                </div>
                                                <CopyButton text={directorOutput?.sections.metadata || ''} />
                                             </div>
                                          )}
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             Use these notes to guide your production team. Includes camera setup, framing, and retake flexibility for each scene.
                                          </p>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              {/* Footer Actions */}
                              <div className="p-4 border-t border-zinc-800/40 bg-zinc-900/60 backdrop-blur-sm flex justify-between items-center">
                                 <button onClick={reset} className="text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-zinc-800/50">CLEAR</button>
                                 <button
                                    onClick={runDirector}
                                    className="bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700/60 hover:text-white transition-all flex items-center gap-2"
                                 >
                                    <RotateCcw className="w-4 h-4" /> Regenerate Prompts
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  )}

                  {/* 3. Placeholder */}
                  {step === 'input' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-800/30 flex items-center justify-center">
                           <Film className="w-8 h-8 opacity-20" />
                        </div>
                        <div className="text-center">
                           <p className="text-xs uppercase tracking-widest opacity-40 font-semibold">Studio Ready</p>
                           <p className="text-[9px] opacity-30 mt-1">Upload outfit & generate to begin</p>
                        </div>
                     </div>
                  )}

               </div>
            </div>
         </div>
      </div>
      </div>
      </div>
      </div>
   );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);