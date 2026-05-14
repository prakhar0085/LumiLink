import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, BarChart2, Zap, Shield, Link as LinkIcon, ArrowRightLeft, CheckCircle2, Globe, MousePointer2, Activity } from 'lucide-react';

const UrlAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-3 rounded-[2rem] shadow-2xl border border-white/50 dark:border-gray-800 flex items-center justify-between overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-slate-500/5 pointer-events-none" />
      <div className="flex items-center gap-3 px-3 w-full overflow-hidden relative z-10">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center text-slate-600">
          <LinkIcon size={16} />
        </div>
        <div className="flex-1 overflow-hidden relative h-6 flex items-center">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.span
                key="long"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-400 font-mono text-sm truncate absolute w-full"
              >
                https://example.com/very/long/article/url/path...
              </motion.span>
            )}
            {step === 1 && (
              <motion.span
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-900 dark:text-white font-mono text-sm flex items-center gap-2 absolute"
              >
                <ArrowRightLeft size={14} className="animate-spin" /> Shortening...
              </motion.span>
            )}
            {step >= 2 && (
              <motion.span
                key="short"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-900 dark:text-white font-mono text-sm font-bold absolute"
              >
                lumi.link/v3GTR
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div 
        animate={{ 
          backgroundColor: step >= 2 ? '#10b981' : '#0f172a',
          scale: step === 1 ? 0.95 : 1
        }}
        className="shrink-0 px-5 py-2.5 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-1 min-w-[100px] shadow-lg shadow-black/10 relative z-10"
      >
        {step >= 2 ? <CheckCircle2 size={16} /> : 'Shorten'}
      </motion.div>
    </div>
  );
};

const ParallaxWidget = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-2xl mx-auto py-12 cursor-none relative"
      style={{ perspective: 1000 }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
};

const FloatingCard = ({ delay, icon, label, value, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`absolute p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 dark:border-gray-800 z-20 pointer-events-auto ${className}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] dark:bg-black relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [-40, 40, -40], 
            y: [-40, 40, -40],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [40, -40, 40], 
            y: [40, -40, 40],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[0%] left-[-5%] w-[300px] h-[300px] rounded-full bg-purple-100/30 dark:bg-purple-900/10 blur-[80px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      </div>

      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          
          {/* Hero Content - Left Side */}
          <div className="flex-1 text-center lg:text-left space-y-4 max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-800/20 backdrop-blur-sm"
            >
              <Zap size={9} fill="currentColor" /> v2.0 is live
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight"
            >
              Build your brand <br /> with every <span className="text-slate-900 dark:text-white underline decoration-slate-300 dark:decoration-slate-700">click.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              LumiLink is the industry-standard URL shortening platform. Track clicks, analyze performance, and grow your audience.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 relative justify-center lg:justify-start pt-4"
            >
              <div className="absolute inset-0 bg-slate-900 blur-2xl opacity-5 rounded-full scale-110" />
              <Link to="/register" className="relative bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold hover:bg-black dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 text-xs">
                Get started <ArrowRight size={14} />
              </Link>
              <Link to="/login" className="bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-gray-800 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-gray-900 transition-all flex items-center justify-center shadow-sm text-xs">
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Hero Illustration - Right Side */}
          <div className="flex-1 w-full max-w-lg relative lg:translate-x-6">
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full scale-125" />
            
            <FloatingCard 
              delay={0.4} 
              icon={<Activity size={10} />} 
              label="Total Clicks" 
              value="12.4k" 
              className="-top-6 left-0 hidden md:flex scale-75" 
            />
            <FloatingCard 
              delay={0.5} 
              icon={<Globe size={10} />} 
              label="Top Region" 
              value="India" 
              className="bottom-0 right-4 hidden md:flex scale-75" 
            />
            <FloatingCard 
              delay={0.6} 
              icon={<MousePointer2 size={10} />} 
              label="Daily CTR" 
              value="4.2%" 
              className="top-2 -right-4 hidden lg:flex scale-75" 
            />

            <ParallaxWidget>
              <div className="relative group/stage">
                 <div className="relative z-10 scale-[0.85]"><UrlAnimation /></div>
                 
                 {/* Dashboard Mockup Preview */}
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.8, duration: 1 }}
                   className="mt-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl border border-white/50 dark:border-gray-800 p-1.5 shadow-2xl overflow-hidden relative scale-[0.75] origin-top"
                 >
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none" />
                   <div className="bg-white dark:bg-black rounded-lg overflow-hidden aspect-[16/9] border border-gray-100 dark:border-gray-800 relative z-10">
                      <div className="p-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                         <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-red-400" />
                            <div className="w-1 h-1 rounded-full bg-yellow-400" />
                            <div className="w-1 h-1 rounded-full bg-green-400" />
                         </div>
                         <div className="h-1 w-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                      </div>
                      <div className="p-3 grid grid-cols-3 gap-2 h-full">
                         <div className="space-y-1.5">
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                            <div className="h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30" />
                         </div>
                         <div className="col-span-2 space-y-2">
                            <div className="h-20 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 flex items-end justify-between p-2 gap-1 shadow-inner">
                               {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                 <motion.div 
                                   key={i}
                                   initial={{ height: 0 }}
                                   animate={{ height: `${h}%` }}
                                   transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                                   className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-[2px]"
                                 />
                               ))}
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                               <div className="h-8 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800" />
                               <div className="h-8 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800" />
                            </div>
                         </div>
                      </div>
                   </div>
                 </motion.div>
              </div>
            </ParallaxWidget>
          </div>
        </div>
      </section>

      {/* Features - Unified Box */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl shadow-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap size={16} className="text-blue-600" />} 
              title="Fast Redirects" 
              description="Optimized edge network for millisecond redirects." 
            />
            <FeatureCard 
              icon={<BarChart2 size={16} className="text-purple-600" />} 
              title="Advanced Analytics" 
              description="Deep insights into your link performance." 
            />
            <FeatureCard 
              icon={<Shield size={16} className="text-emerald-600" />} 
              title="Secure Links" 
              description="Malware and phishing protection for every link." 
            />
            <FeatureCard 
              icon={<Globe size={16} className="text-indigo-600" />} 
              title="Custom Domains" 
              description="Build trust with your own branded links." 
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ x: 3 }}
    className="flex items-start gap-3 group"
  >
    <div className="w-8 h-8 shrink-0 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white border border-slate-200/50 dark:border-gray-700">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{title}</h3>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{description}</p>
    </div>
  </motion.div>
);

export default LandingPage;
