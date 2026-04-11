import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  ChevronRight, 
  Volume2, 
  Zap, 
  Shield, 
  Cpu, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Play,
  Pause,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';

// --- Data ---

const HEAVY_INSTRUMENTS = [
  {
    id: 'grand-piano',
    name: 'Imperial Concert Grand',
    weight: '480kg',
    description: 'Hand-crafted spruce soundboard with custom carbon-fiber action.',
    price: '$120,000',
    image: 'https://images.unsplash.com/photo-1520529611124-d4c909a22840?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pipe-organ',
    name: 'Cathedral Series V',
    weight: '1,200kg',
    description: 'Modular pipe organ system with digital-analog hybrid console.',
    price: '$250,000',
    image: 'https://images.unsplash.com/photo-1518911710364-17ec553bde5d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'industrial-drums',
    name: 'Titanium Shell Kit',
    weight: '85kg',
    description: 'Solid titanium shells for unparalleled projection and durability.',
    price: '$15,000',
    image: 'https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'double-bass',
    name: 'The Goliath Bass',
    weight: '12kg',
    description: 'Oversized acoustic double bass with built-in sub-harmonic resonance.',
    price: '$28,000',
    image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'concert-harp',
    name: 'Aura Gold Harp',
    weight: '38kg',
    description: '47-string concert grand harp with 24k gold leaf finish and carbon soundboard.',
    price: '$45,000',
    image: 'https://images.unsplash.com/photo-1573511111556-9d3298863678?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'marimba',
    name: 'Rosewood Marimba',
    weight: '95kg',
    description: '5-octave professional marimba with selected Honduras Rosewood bars.',
    price: '$22,000',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cello',
    name: 'Master Cello 1712',
    weight: '3kg',
    description: 'A replica of the 1712 Stradivarius, crafted from 100-year-old maple.',
    price: '$65,000',
    image: 'https://images.unsplash.com/photo-1588534510807-86dfb5ed5d59?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'tuba',
    name: 'Silver Contrabass Tuba',
    weight: '15kg',
    description: 'Professional 5-valve contrabass tuba with silver plating and custom bore.',
    price: '$18,500',
    image: 'https://images.unsplash.com/photo-1573871666457-7c7329118cf9?auto=format&fit=crop&q=80&w=800'
  }
];

// --- Components ---

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'The Monolith', href: '#instrument' },
    { name: 'Sound Profile', href: '#sound' },
    { name: 'Heavy Catalog', href: '#catalog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-2 relative z-[110]">
        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
          <Music className="text-black w-5 h-5" />
        </div>
        <span className="font-sans font-bold tracking-tighter text-lg md:text-xl uppercase">AudioWerkhaus</span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-[10px] font-medium uppercase tracking-widest text-white/60">
        {navLinks.map(link => (
          <a key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</a>
        ))}
        <a href="#contact" className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">Contact</a>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden relative z-[110] p-2 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-[105] md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-full bg-zinc-950 border-l border-white/5 flex flex-col p-8 pt-32"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-bold uppercase tracking-tighter hover:text-white/60 transition-colors border-b border-white/5 pb-4"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-8 text-xl font-bold uppercase tracking-widest text-white flex items-center gap-4"
                >
                  Contact <ArrowRight className="w-6 h-6" />
                </motion.a>
              </div>

              <div className="mt-auto pt-12 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/20 block mb-4">Social</span>
                <div className="flex gap-6 text-xs font-medium uppercase tracking-widest text-white/40">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">Vimeo</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section id="instrument" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
      <img 
        src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=2000" 
        alt="Dark Studio" 
        className="w-full h-full object-cover opacity-40"
        referrerPolicy="no-referrer"
      />
    </div>

    <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-white/40 mb-4 block text-center">New Era of Resonance</span>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-sans font-bold tracking-tighter leading-[0.9] mb-8 text-center">
          THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/20">OBSIDIAN</span> <br />
          MONOLITH
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-white/60 font-light leading-relaxed mb-12 text-center px-4">
          A gravitational-carbon resonator designed for the avant-garde. 
          Experience sub-harmonics that defy physical boundaries.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2">
            Inquire Now <ArrowRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2">
            Watch Performance <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </motion.div>
    </div>

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
    >
      <div className="w-px h-8 md:h-12 bg-gradient-to-b from-white/0 to-white/40" />
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Scroll</span>
    </motion.div>
  </section>
);

const SoundProfile = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="sound" className="py-20 md:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4 block">Acoustic Engineering</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter mb-8">UNIQUE SOUND PROFILE</h2>
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Sub-Harmonic Depth</h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed">
                    The Monolith utilizes a carbon-fiber shell tuned to 16Hz, producing physical vibrations that resonate through the performer's body.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Granular Textures</h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed">
                    Integrated gravitational sensors modulate real-time granular synthesis, creating ethereal, shifting soundscapes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Neural Interface</h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed">
                    Optional haptic feedback and neural-link compatibility for direct expressive control of timbre and spatialization.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square max-w-lg mx-auto w-full"
          >
            <div className="absolute inset-0 border border-white/5 rounded-3xl overflow-hidden group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000" 
                alt="Sound Wave" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:border-white/50 transition-colors">
                  {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-white" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-white ml-1 md:ml-2" />}
                </div>
              </div>
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-white/60">Audio Sample 01</span>
                  <span className="text-[8px] md:text-[10px] font-mono text-white/40">02:45 / 04:20</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white" 
                    animate={{ width: isPlaying ? '65%' : '0%' }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Catalog = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);

  return (
    <section id="catalog" className="py-20 md:py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4 block">The Heavy Collection</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter">PREMIUM INSTRUMENTS</h2>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <p className="max-w-md text-white/40 text-sm leading-relaxed mx-auto md:mx-0">
              A curated selection of the world's most substantial musical engineering. 
              Built for permanence, weight, and unmatched acoustic presence.
            </p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/20 hidden md:block">
              Scroll horizontally to explore →
            </span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory px-2">
          {HEAVY_INSTRUMENTS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white/5 border border-white/5 rounded-sm overflow-hidden hover:border-white/20 transition-all cursor-pointer min-w-[260px] md:min-w-[320px] snap-start"
              onClick={() => setSelectedInstrument(item.id)}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-base md:text-lg leading-tight">{item.name}</h3>
                  <span className="text-[10px] font-mono text-white/40">{item.weight}</span>
                </div>
                <p className="text-white/40 text-[10px] md:text-xs mb-6 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs md:text-sm">{item.price}</span>
                  <button className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Modal Placeholder */}
      <AnimatePresence>
        {selectedInstrument && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedInstrument(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 md:p-12 max-w-2xl w-full rounded-sm relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 md:top-8 md:right-8 text-white/40 hover:text-white text-[10px] font-mono"
                onClick={() => setSelectedInstrument(null)}
              >
                CLOSE [ESC]
              </button>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 uppercase tracking-tighter pr-12">Inquire: {HEAVY_INSTRUMENTS.find(i => i.id === selectedInstrument)?.name}</h2>
              <p className="text-white/40 text-sm mb-8">Please provide your details and our specialist will contact you within 24 hours.</p>
              
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-white/40">Full Name</label>
                    <input type="text" className="w-full bg-black border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-white/40">Email Address</label>
                    <input type="email" className="w-full bg-black border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-white/40">Message / Requirements</label>
                  <textarea className="w-full bg-black border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors h-24 md:h-32 resize-none" placeholder="Tell us about your space and acoustic needs..." />
                </div>
                <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all">
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-20 md:py-32 bg-black border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter mb-8 uppercase">Let's Discuss <br /> Your Sound</h2>
          <p className="text-white/40 mb-12 max-w-md text-sm md:text-base leading-relaxed">
            Whether you're looking for a custom Monolith build or a piece from our heavy collection, our team is ready to assist.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white/60">
              <Mail className="w-5 h-5 shrink-0" />
              <span className="text-sm">concierge@audiowerkhaus.audio</span>
            </div>
            <div className="flex items-center gap-4 text-white/60">
              <Phone className="w-5 h-5 shrink-0" />
              <span className="text-sm">+1 (888) WERKHAUS</span>
            </div>
            <div className="flex items-center gap-4 text-white/60">
              <MapPin className="w-5 h-5 shrink-0" />
              <span className="text-sm">Berlin / New York / Tokyo</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 p-8 md:p-12 rounded-sm border border-white/5">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-5 h-5 text-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Secure Consultation Request</span>
          </div>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <input type="text" className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors" placeholder="Your Name" />
            <input type="email" className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors" placeholder="Email Address" />
            <select className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors text-white/40">
              <option>Interested in: The Monolith</option>
              <option>Interested in: Heavy Collection</option>
              <option>Interested in: Custom Build</option>
            </select>
            <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all">
              Request Callback
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-black border-t border-white/5 px-6 md:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-white/20 flex items-center justify-center rounded-sm">
          <Music className="text-white w-4 h-4" />
        </div>
        <span className="font-sans font-bold tracking-tighter text-sm uppercase">AudioWerkhaus</span>
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] font-mono uppercase tracking-widest text-white/20">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Shipping</a>
        <span>© 2026 AudioWerkhaus</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />
      <Hero />
      <SoundProfile />
      <Catalog />
      <Contact />
      <Footer />
    </div>
  );
}
