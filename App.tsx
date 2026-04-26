/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Video, X, ChevronRight, Menu, Instagram, Twitter, Mail, ExternalLink } from 'lucide-react';
import MetallicPaint from './components/MetallicPaint';
// @ts-ignore
import logo from './logo.svg';

// Apple Standard Spring Curve
// ... rest of imports
const appleSpring = {
  stiffness: 100,
  damping: 20,
  mass: 1
};

// --- TEXT CONFIGURATION ---
// You can edit all site text here centrally
const TEXT_CONTENT = {
  navbar: {
    cta: "CONTACT ME",
    items: [
      { name: 'Mobile video', id: 'showcase' },
      { name: 'Brand Proposal Updates', id: 'bento' },
      { name: 'MORE+', id: 'archive' }
    ]
  },
  hero: {
    titleTop: " HEY~",
    titleBottom: "Welcome",
    tagline: "欢迎来到会动的这一面",
    videoLabel: "Featured Film",
    videoTitle: "Stellaris"
  },
  showcase: {
    label: "Dynamic Vision",
    title: "Mobile video",
    description: "New Year's red envelopes / brand videos / elevator advertisements   -Swipe left and right",
    itemPrefix: "Movement"
  },
  bento: {
    title: "Brand Proposal\nUpdates",
    label: "Dynamic Vision",
    items: [
      { id: 1, title: 'Global Vision' },
      { id: 2, title: 'Interactive Flow' },
      { id: 3, title: 'Dynamic Pulse' }
    ]
  },
  archive: {
    label: "Dynamic Vision",
    title: "MORE+",
    cta: "View All",
    itemCategory: "Commercial",
    itemPrefix: "Project"
  },
  footer: {
    copyright: "© 2026 SANGEEELI©",
    location: "PRODUCTION STUDIO  — SHEN ZHEN",
    socials: [
      { name: "Instagram", url: "#" },
      { name: "Vimeo", url: "#" },
      { name: "Twitter", url: "#" }
    ]
  }
};

// --- VIDEO DATABASE ---
// 使用你提供的腾讯云 COS 真实链接
const VIDEO_DATABASE = {
  // 首页大视频
  hero: "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%A2%86%E5%AF%BC%E5%8A%9B%E5%A4%A7%E4%BC%9A%20d-11920_1080.mp4", 
  
  // 中间滑动区域的 11 个视频
  showcase: [
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%A9%AC%E5%B9%B4%E9%A2%86%E5%8F%96%E5%89%8D-TenPay%20Global_1.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%A9%AC%E5%B9%B4%E9%A2%86%E5%8F%96%E5%90%8E-TenPay%20Global.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%A9%AC%E5%B9%B41%E6%89%93%E5%BC%80%E5%89%8D-%E8%B7%A8%E5%A2%83%E6%B1%87%E6%AC%BE.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%A9%AC%E5%B9%B41%E9%A2%86%E5%8F%96%E5%90%8E-%E8%B7%A8%E5%A2%83%E6%B1%87%E6%AC%BE.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E8%9B%87%E5%B9%B4%E7%BA%A2%E5%8C%85%E9%A2%86%E5%8F%96%E5%B0%81%E9%9D%A2.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E8%9B%87%E5%B9%B4%E6%89%93%E9%96%8B%E5%BE%8C.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E5%85%94%E5%B9%B4.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%A6%99%E6%B0%B4_220513%20.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/32%E5%AF%B8.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/54%E7%81%AB%E7%82%AC%E6%B5%B7%E6%8A%A5.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%BE%99%E6%8A%AC%E5%A4%B4%20.mp4",
  ],

  // 底部网格的展示视频
  archive: [
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E6%8A%A4%E8%82%A4%E7%BA%BF%E8%A7%86%E9%A2%91.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/lianxi1005.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E6%89%8B%E6%8C%81%E8%81%94%E5%90%881005.mp4",
    "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/lianxi2_1005.mp4",
  ],

  // 备选
  bento: [
    "https://assets.mixkit.co/videos/preview/mixkit-man-under-a-waterfall-in-a-forest-42247-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-white-clouds-and-blue-sky-with-the-sun-in-the-center-43196-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-on-the-shore-42938-large.mp4"
  ]
};

const Navbar = ({ onContactClick }: { onContactClick: () => void }) => {
  const logoParams = {
    seed: 42,
    scale: 4,
    patternSharpness: 1,
    noiseScale: 0.5,
    speed: 0.3,
    liquid: 0.75,
    mouseAnimation: false,
    brightness: 2,
    contrast: 0.5,
    refraction: 0.01,
    blur: 0.015,
    chromaticSpread: 2,
    fresnel: 1,
    angle: 0,
    waveAmplitude: 1,
    distortion: 1,
    contour: 0.2,
    lightColor: "#ffffff",
    darkColor: "#000000",
    tintColor: "#feb3ff"
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ ...appleSpring, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-24 flex items-center justify-between px-10 saturate-180 backdrop-blur-[20px] bg-black/70 border-b border-white/5"
    >
      <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        <div className="h-24 w-72">
          <MetallicPaint
            imageSrc={logo}
            {...logoParams}
          />
        </div>
      </a>
      <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">
        {TEXT_CONTENT.navbar.items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="hover:text-white transition-colors">
            {item.name}
          </a>
        ))}
      </div>
      <button 
        onClick={onContactClick}
        className="px-5 py-2 bg-white text-black text-[10px] font-bold rounded-full tracking-wide uppercase hover:scale-105 active:scale-95 transition-transform"
      >
        {TEXT_CONTENT.navbar.cta}
      </button>
    </motion.nav>
  );
};

const appleBezier = [0.16, 1, 0.3, 1] as any;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { 
    y: 80, 
    opacity: 0,
    filter: 'blur(20px)',
    letterSpacing: '0.05em'
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 0 45px rgba(255,255,255,0.22))',
    letterSpacing: '-0.08em',
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 20,
      mass: 0.8,
      letterSpacing: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    },
  },
};

const smallTextVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5,
      delay: 1.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const HeroSection = ({ onPlay }: { onPlay: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 滚动变化参数
  const videoScale = useTransform(scrollYProgress, [0.1, 0.6], [0.2, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.2]);
  const textBlurValue = useTransform(scrollYProgress, [0, 0.2], [0, 20]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-black">
      {/* 噪点全屏叠加 */}
      <div className="noise-overlay" />

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* 背景漫反射发光 */}
        <motion.div 
          animate={{ 
            x: mousePos.x * 2, 
            y: mousePos.y * 2 
          }}
          className="absolute w-[800px] h-[800px] bg-purple-500/3 blur-[120px] rounded-full pointer-events-none"
        />

        {/* 顶部极简圆圈图标 */}
        <div className="absolute top-10 left-10 z-20">
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </motion.div>
        </div>

        {/* 1. HEY~ Welcome 进场文字容器 (随滚动变化) */}
        <motion.div
          style={{ 
            opacity: textOpacity, 
            scale: textScale,
            filter: useTransform(textBlurValue, (v) => `blur(${v}px)`)
          }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center px-6"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotateX: mousePos.y * 0.15,
                rotateY: mousePos.x * 0.15
              }}
              transition={{ 
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }
              }}
              className="flex flex-col items-center"
            >
              <div className="flex flex-col items-center gap-1">
                <motion.h1 
                  variants={itemVariants as any}
                  className="text-[15vw] md:text-[12vw] font-bold tracking-[-0.06em] text-shimmer leading-[0.85] select-none"
                >
                  HEY~
                </motion.h1>
              </div>
              <div className="flex flex-col items-center">
                <motion.h1 
                  variants={itemVariants as any}
                  className="text-[15vw] md:text-[12vw] font-bold tracking-[-0.06em] text-shimmer leading-[0.85] select-none"
                >
                  Welcome
                </motion.h1>
              </div>
              
              <motion.p 
                variants={smallTextVariants as any}
                className="text-[10px] md:text-[13px] font-medium tracking-[0.6em] text-[#6E6E73] mt-20 uppercase ml-[0.6em]"
              >
                欢迎来到会动的这一面
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 2. 视频传送门 (Portal) - 随滚动缩放 */}
        <motion.div 
          style={{ 
            scale: videoScale, 
            opacity: videoOpacity
          }}
          onClick={onPlay}
          className="relative z-10 w-full aspect-video md:w-[85%] max-w-[1400px] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl shadow-white/5 bg-white/5 cursor-pointer group"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          >
            <source src={VIDEO_DATABASE.hero} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </motion.div>

        {/* 底部装饰线 */}
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 0.15, height: 100 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute bottom-12 z-20"
        >
          <div className="w-[1px] h-full bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {children}
    </motion.div>
  );
};

const VerticalCarousel = ({ onPlay }: { onPlay: (url: string, title: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateConstraints = () => {
      if (scrollRef.current && containerRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        setConstraints({ 
          left: -(scrollWidth - containerWidth + 200), 
          right: 100 
        });
      }
    };
    updateConstraints();
    
    const observer = new ResizeObserver(updateConstraints);
    if (scrollRef.current) observer.observe(scrollRef.current);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener('resize', updateConstraints);
    return () => {
      window.removeEventListener('resize', updateConstraints);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-black overflow-hidden" id="showcase">
      <div className="px-10 mb-20">
        <Reveal>
          <h2 className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-3">{TEXT_CONTENT.showcase.label}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-5xl text-white font-bold tracking-tighter whitespace-pre-line">{TEXT_CONTENT.showcase.title}</h3>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm text-white/40 mt-6 max-w-sm leading-relaxed">
            {TEXT_CONTENT.showcase.description}
          </p>
        </Reveal>
      </div>

      <div className="relative w-full h-[600px] md:h-[750px] flex items-center overflow-visible" style={{ perspective: '2000px' }}>
        <motion.div 
          ref={scrollRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.2}
          whileTap={{ cursor: 'grabbing' }}
          className="flex gap-16 px-[10vw] cursor-grab select-none"
        >
          {VIDEO_DATABASE.showcase.map((url, i) => (
            // @ts-ignore
            <CarouselItem key={url} i={i + 1} url={url} onPlay={onPlay} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CarouselItem = ({ i, url, onPlay }: { i: number; url: string; onPlay: (url: string, title: string) => void }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Track this item's x progress for 3D effect
  const { scrollXProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollXProgress, [0, 0.2, 0.5, 0.8, 1], [0.6, 1, 1, 1, 0.6]);

  return (
    <motion.div
      ref={itemRef}
      style={{ 
        scale,
        opacity,
        perspective: '1200px'
      }}
      whileHover={{ 
        y: -30, 
        scale: 1.05,
        transition: { duration: 0.4, ...appleSpring }
      }}
      onTap={() => onPlay(url, `${TEXT_CONTENT.showcase.itemPrefix} 0${i}`)}
      className="relative flex-none w-[300px] md:w-[400px] aspect-[9/16] rounded-[40px] group cursor-pointer"
    >
      {/* 3D Content Container */}
      <div className="absolute inset-0 rounded-[40px] overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group-hover:border-white/40 transition-colors duration-500">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-all duration-700 brightness-90 group-hover:brightness-125 pointer-events-none"
        >
          <source src={url} type="video/mp4" />
        </video>
        
        {/* Subtle Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
        
        {/* Content Info */}
        <div className="absolute bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 px-6">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Floating Ambient Glow */}
      <div className="absolute -inset-10 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-1000 blur-[100px] -z-20 opacity-0 group-hover:opacity-100" />
    </motion.div>
  );
};

const BentoSection = ({ onPlay }: { onPlay: (url: string, title: string) => void }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const bentoItems = [
    { 
      id: 1, 
      size: 'large', 
      title: TEXT_CONTENT.bento.items[0].title, 
      video: "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B6%202026-03-03%20211505_1.mp4" 
    },
    { 
      id: 2, 
      size: 'small', 
      title: TEXT_CONTENT.bento.items[1].title, 
      video: "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B6%202026-03-03%20211217_1.mp4" 
    },
    { 
      id: 3, 
      size: 'small', 
      title: TEXT_CONTENT.bento.items[2].title, 
      video: "https://videosangeli-1409851001.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B6%202026-03-03%20211733_2.mp4" 
    },
  ];

  return (
    <section className="py-32 px-10 bg-black" id="bento">
      <div className="mb-16">
        <Reveal>
          {TEXT_CONTENT.bento.label && (
            <h2 className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-3">{TEXT_CONTENT.bento.label}</h2>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-5xl text-white font-bold tracking-tighter whitespace-pre-line">{TEXT_CONTENT.bento.title}</h3>
        </Reveal>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
        {bentoItems.map((item, idx) => (
          <motion.div
            key={item.id}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onPlay(item.video, item.title)}
            className={`relative rounded-[40px] overflow-hidden group border border-white/10 bg-neutral-900 cursor-pointer shadow-2xl ${
              item.size === 'large' ? 'md:col-span-8 md:row-span-2' : 'md:col-span-4'
            }`}
          >
            <motion.div
              animate={{
                filter: hovered === idx ? 'brightness(1.1)' : 'brightness(0.85)',
                scale: hovered === idx ? 1.05 : 1
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={item.video} type="video/mp4" />
              </video>
            </motion.div>
            
            {/* Corner Accent */}
            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ArchiveGrid = ({ onPlay }: { onPlay: (url: string, title: string) => void }) => {
  const containerRef = useRef(null);
  
  const archiveItems = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    title: `${TEXT_CONTENT.archive.itemPrefix} ${String.fromCharCode(65 + i)}`,
    category: TEXT_CONTENT.archive.itemCategory,
    video: VIDEO_DATABASE.archive[i % VIDEO_DATABASE.archive.length]
  }));

  return (
    <section ref={containerRef} className="py-24 px-10 bg-black" id="archive">
      <div className="flex justify-between items-end mb-16">
        <div>
          <Reveal>
            <h2 className="text-white/30 text-[10px] uppercase tracking-widest mb-4">{TEXT_CONTENT.archive.label}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-5xl text-white font-bold tracking-tighter">{TEXT_CONTENT.archive.title}</h3>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group text-[11px] uppercase tracking-widest font-bold">
            {TEXT_CONTENT.archive.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {archiveItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              delay: idx * 0.1,
              duration: 0.8,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            onClick={() => onPlay(item.video, item.title)}
            className="group cursor-pointer"
          >
            <div className="aspect-video w-full rounded-[40px] overflow-hidden bg-white/[0.04] border border-white/10 transition-colors group-hover:border-white/20">
              <video
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              >
                <source src={item.video} type="video/mp4" />
              </video>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.group') || target.tagName === 'BUTTON' || target.tagName === 'A') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)'
      }}
      transition={{ type: 'spring', ...appleSpring, stiffness: 250, damping: 25 }}
    >
      {isHovering && <ArrowRight className="w-2 h-2 text-black" />}
    </motion.div>
  );
};

const VideoModal = ({ video, onClose }: { video: { url: string, title: string } | null, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl overflow-hidden p-6 md:p-12"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={appleSpring}
            className="relative w-full max-w-[1920px] aspect-video rounded-[40px] overflow-hidden bg-white/5 shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            >
              <source src={video.url} type="video/mp4" />
            </video>
            
            <button
              onClick={onClose}
              className="absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer group"
            >
              <Pause className="w-5 h-5 hidden group-hover:block" />
              <Play className="w-5 h-5 block group-hover:hidden" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ContactItem = ({ label, value, index }: { label: string, value: string, index: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.8, ease: appleBezier }}
      onClick={handleCopy}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col gap-1.5 py-6 cursor-pointer border-b border-white/5 last:border-0"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        whileTap={{ opacity: 1 }}
        className="absolute inset-x-0 -inset-y-1 bg-white/[0.04] -mx-4 rounded-2xl pointer-events-none transition-opacity"
      />
      
      <div className="flex items-center justify-between">
        <span className="text-white/30 text-[10px] tracking-[0.2em] font-bold uppercase shrink-0">
          {label}
        </span>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[#007AFF] text-[10px] font-bold uppercase tracking-widest italic"
            >
              Copied!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative flex items-center">
        <motion.span
          animate={{ 
            color: copied ? '#007AFF' : '#FFFFFF',
            x: copied ? 5 : 0
          }}
          className="font-sans text-lg font-medium tracking-tight"
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  );
};

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xl p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-neutral-900/80 border border-white/10 rounded-[40px] p-10 relative shadow-2xl backdrop-saturate-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-10 text-center">
              <h3 className="text-xl font-bold tracking-tight mb-2">Get in Touch</h3>
              <p className="text-white/40 text-[11px] tracking-widest uppercase font-medium">Available for new opportunities</p>
            </div>

            <div className="flex flex-col">
              <ContactItem label="TEL" value="18691049462" index={0} />
              <ContactItem label="WECHAT" value="sangeeeli0" index={1} />
              <ContactItem label="Email" value="1006913176@qq.com" index={2} />
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/20 font-medium tracking-[0.2em] leading-relaxed italic">
                “ Every pixel tells a story, <br/> and every frame creates a soul. ”
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [activeVideo, setActiveVideo] = useState<{ url: string, title: string } | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
        setIsContactOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="bg-black text-white font-sans selection:bg-white selection:text-black">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <Cursor />
      <Navbar onContactClick={() => setIsContactOpen(true)} />
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      
      {/* Scroll sections */}
      <HeroSection onPlay={() => setActiveVideo({ url: VIDEO_DATABASE.hero, title: TEXT_CONTENT.hero.videoTitle })} />
      
      <div className="relative z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
        <VerticalCarousel onPlay={(url, title) => setActiveVideo({ url, title })} />
        <BentoSection onPlay={(url, title) => setActiveVideo({ url, title })} />
        <ArchiveGrid onPlay={(url, title) => setActiveVideo({ url, title })} />
        
        {/* Footer */}
        <footer className="py-24 border-t border-white/5 px-10 flex flex-col md:flex-row justify-between items-center gap-12 text-white/20 text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold tracking-tighter text-lg">{TEXT_CONTENT.footer.copyright}</span>
          </div>
          <div className="flex gap-8 font-mono">
            {TEXT_CONTENT.footer.socials.map((social) => (
              <a key={social.name} href={social.url} className="hover:text-white transition-colors">
                {social.name}
              </a>
            ))}
          </div>
          <p className="font-mono">{TEXT_CONTENT.footer.location}</p>
        </footer>
      </div>
    </main>
  );
}
