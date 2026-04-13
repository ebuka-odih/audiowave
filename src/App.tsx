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
  ImagePlus,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { cn } from './lib/utils';

type Product = {
  id: string;
  name: string;
  weight: string;
  description: string;
  price: string;
  image: string;
};

type ProductFormState = {
  name: string;
  weight: string;
  description: string;
  price: string;
  image: string;
};

type ConsultationRequest = {
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  createdAt: string;
};

type ConsultationFormState = {
  name: string;
  email: string;
  interest: string;
  message: string;
};

type SelectedProductPayload = {
  name: string;
  token: number;
};

const DEFAULT_INTEREST = 'The Monolith';
const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1200';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'sample-reference-piece',
    name: 'Reference Listening Piece',
    weight: '',
    description: 'A single placeholder product for testing the catalog before real inventory is added.',
    price: '$0',
    image: FALLBACK_PRODUCT_IMAGE,
  },
];

const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: '',
  weight: '',
  description: '',
  price: '',
  image: '',
};

const EMPTY_CONSULTATION_FORM: ConsultationFormState = {
  name: '',
  email: '',
  interest: DEFAULT_INTEREST,
  message: '',
};

const resolveProductImage = (image: string) => image || FALLBACK_PRODUCT_IMAGE;

const getErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error || 'Request failed.';
  } catch {
    return 'Request failed.';
  }
};

const fetchProducts = async () => {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error(await getErrorMessage(response));
  const payload = (await response.json()) as { products: Product[] };
  return payload.products;
};

const createProduct = async (product: ProductFormState) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
  const payload = (await response.json()) as { product: Product };
  return payload.product;
};

const updateProduct = async (id: string, product: ProductFormState) => {
  const response = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
  const payload = (await response.json()) as { product: Product };
  return payload.product;
};

const deleteProduct = async (id: string) => {
  const response = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
};

const fetchConsultationRequests = async () => {
  const response = await fetch('/api/consultation-requests');
  if (!response.ok) throw new Error(await getErrorMessage(response));
  const payload = (await response.json()) as { requests: ConsultationRequest[] };
  return payload.requests;
};

const createConsultationRequest = async (request: ConsultationFormState) => {
  const response = await fetch('/api/consultation-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
  const payload = (await response.json()) as { request: ConsultationRequest };
  return payload.request;
};

const updateConsultationRequest = async (id: string, request: ConsultationFormState) => {
  const response = await fetch(`/api/consultation-requests?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
  const payload = (await response.json()) as { request: ConsultationRequest };
  return payload.request;
};

const deleteConsultationRequest = async (id: string) => {
  const response = await fetch(`/api/consultation-requests?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
};

const isNotFoundRoute = (path: string) => {
  if (path === '/' || path === '/admin') return false;
  if (path.startsWith('/api/')) return false;
  return true;
};

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const formatActionError = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const readUrlPath = () => {
  const path = window.location.pathname || '/';
  return isNotFoundRoute(path) ? '/' : path;
};

const goToAnchor = (anchor: string) => {
  const element = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.location.hash = anchor;
};

const Navbar = (_: { isAdmin: boolean }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-2 relative z-[110]">
        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
          <Music className="text-black w-5 h-5" />
        </div>
        <span className="font-sans font-bold tracking-tighter text-lg md:text-xl uppercase">AudioWerkhaus</span>
      </div>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-white/40 mb-4 block text-center">
          Precision Sound, Built With Intent
        </span>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-sans font-bold tracking-tighter leading-[0.9] mb-8 text-center">
          THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/20">OBSIDIAN</span> <br />
          MONOLITH
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-white/60 font-light leading-relaxed mb-12 text-center px-4">
          A flagship listening system shaped for studios, private rooms, and performance spaces that demand clarity, depth, and presence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            Inquire Now <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/shorts/a3aDBQvahB4?si=3Coio0bBOLSRJPrx"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            Watch Performance <Play className="w-4 h-4 fill-current" />
          </a>
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
                    Tuned for weight and control in the low end, The Monolith delivers bass that feels immersive without overwhelming the room.
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
                    Layered tonal detail reveals subtle harmonics, spatial movement, and the kind of texture that keeps complex mixes fully intact.
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
                    Responsive system tuning and room-aware calibration make it easy to adapt the experience to the way you listen and work.
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
            <a
              href="https://youtube.com/shorts/UJ-IIrzFzJI?si=sO4VMyhEdIcVYCcF"
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 border border-white/5 rounded-3xl overflow-hidden group cursor-pointer block"
            >
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000"
                alt="Sound Wave"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:border-white/50 transition-colors">
                  <Play className="w-6 h-6 md:w-8 md:h-8 fill-white ml-1 md:ml-2" />
                </div>
              </div>
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-white/60">Performance Video</span>
                  <span className="text-[8px] md:text-[10px] font-mono text-white/40">Watch on YouTube</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-full" />
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Catalog = ({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (productName: string) => void;
}) => {
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
              A curated selection of statement instruments and reference pieces chosen for their craftsmanship, visual presence, and sonic character.
            </p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/20 hidden md:block">Scroll horizontally to explore →</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory px-2">
          {products.map((item, idx) => (
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
                  src={resolveProductImage(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <button
                    type="button"
                    className="font-bold text-base md:text-lg leading-tight text-left hover:text-white/80 transition-colors"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectProduct(item.name);
                    }}
                  >
                    {item.name}
                  </button>
                  <span className="text-[10px] font-mono text-white/40 shrink-0">{item.weight || 'Custom Spec'}</span>
                </div>
                <p className="text-white/40 text-[10px] md:text-xs mb-6 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs md:text-sm">{item.price}</span>
                  <button type="button" className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 md:top-8 md:right-8 text-white/40 hover:text-white text-[10px] font-mono"
                onClick={() => setSelectedInstrument(null)}
              >
                CLOSE [ESC]
              </button>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 uppercase tracking-tighter pr-12">
                Inquire: {products.find((instrument) => instrument.id === selectedInstrument)?.name}
              </h2>
              <p className="text-white/40 text-sm mb-8">Share a few details and our team will follow up with availability, specifications, and next steps.</p>

              <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
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
                  <textarea className="w-full bg-black border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors h-24 md:h-32 resize-none" placeholder="Tell us about your project, room, or performance space..." />
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

const Contact = ({
  selectedProduct,
  requests,
  onCreate,
  onUpdate,
  onDelete,
}: {
  selectedProduct: SelectedProductPayload | null;
  requests: ConsultationRequest[];
  onCreate: (request: ConsultationFormState) => Promise<void>;
  onUpdate: (id: string, request: ConsultationFormState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [formState, setFormState] = useState<ConsultationFormState>(EMPTY_CONSULTATION_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!selectedProduct?.name) return;

    setFormState((current) => {
      const nextMessage = current.message.includes(selectedProduct.name)
        ? current.message
        : `I'm interested in ${selectedProduct.name}.${current.message ? ` ${current.message}` : ''}`;

      return {
        ...current,
        interest: selectedProduct.name,
        message: nextMessage,
      };
    });

    setStatusMessage(`Prepared consultation request for ${selectedProduct.name}.`);

    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedProduct]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (editingId) {
        await onUpdate(editingId, formState);
        setStatusMessage('Consultation request updated.');
      } else {
        await onCreate(formState);
        setStatusMessage('Consultation request sent.');
      }

      setFormState({
        ...EMPTY_CONSULTATION_FORM,
        interest: selectedProduct?.name || DEFAULT_INTEREST,
      });
      setEditingId(null);
    } catch (error) {
      setStatusMessage(formatActionError(error, 'Unable to save consultation request.'));
    }
  };

  const handleEdit = (request: ConsultationRequest) => {
    setEditingId(request.id);
    setFormState({
      name: request.name,
      email: request.email,
      interest: request.interest,
      message: request.message,
    });
    setStatusMessage(`Editing request for ${request.interest}.`);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);

      if (editingId === id) {
        setEditingId(null);
        setFormState({
          ...EMPTY_CONSULTATION_FORM,
          interest: selectedProduct?.name || DEFAULT_INTEREST,
        });
      }

      setStatusMessage('Consultation request deleted.');
    } catch (error) {
      setStatusMessage(formatActionError(error, 'Unable to delete consultation request.'));
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter mb-8 uppercase">
              Let's Discuss <br /> Your Sound
            </h2>
            <p className="text-white/40 mb-12 max-w-md text-sm md:text-base leading-relaxed">
              Whether you are sourcing a flagship system, refining a listening room, or planning a custom installation, we can help shape the right solution.
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
                <span className="text-sm">Berlin / California / Tokyo</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-8 md:p-12 rounded-sm border border-white/5">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="w-5 h-5 text-white/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Secure Consultation Request</span>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors"
                placeholder="Your Name"
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                required
              />
              <input
                type="email"
                className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors"
                placeholder="Email Address"
                value={formState.email}
                onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                required
              />
              <select
                className={cn(
                  'w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors',
                  formState.interest ? 'text-white' : 'text-white/40',
                )}
                value={formState.interest}
                onChange={(event) => setFormState({ ...formState, interest: event.target.value })}
              >
                <option value="The Monolith">Interested in: The Monolith</option>
                <option value="Heavy Collection">Interested in: Heavy Collection</option>
                <option value="Custom Build">Interested in: Custom Build</option>
                {selectedProduct?.name && !['The Monolith', 'Heavy Collection', 'Custom Build'].includes(selectedProduct.name) ? (
                  <option value={selectedProduct.name}>Interested in: {selectedProduct.name}</option>
                ) : null}
              </select>
              <textarea
                className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors h-32 resize-none"
                placeholder="Share your room, project, timeline, or instrument interest..."
                value={formState.message}
                onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                required
              />

              {statusMessage ? <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{statusMessage}</p> : null}

              <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all">
                {editingId ? 'Update Request' : 'Save Request'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Saved Requests</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/20">{requests.length} stored locally</span>
              </div>

              {requests.length === 0 ? (
                <p className="text-sm text-white/40 leading-relaxed">
                  No consultation requests saved yet. Submit the form above to create the first one.
                </p>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <div key={request.id} className="border border-white/5 bg-black/30 p-4 rounded-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{request.interest}</p>
                          <p className="text-xs text-white/50">
                            {request.name} · {request.email}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/20">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-white/40 leading-relaxed">{request.message}</p>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          className="text-[10px] uppercase font-bold tracking-widest text-white/70 hover:text-white transition-colors"
                          onClick={() => handleEdit(request)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white/70 transition-colors"
                          onClick={() => handleDelete(request.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminPage = ({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: {
  products: Product[];
  onCreateProduct: (product: ProductFormState) => Promise<void>;
  onUpdateProduct: (id: string, product: ProductFormState) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}) => {
  const [formState, setFormState] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Uploaded products here appear immediately in the live catalog slider.');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;

      setFormState((current) => ({
        ...current,
        image: reader.result as string,
      }));
      setStatusMessage(`Image ready for ${file.name}. Save the product to publish it.`);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (editingId) {
        await onUpdateProduct(editingId, formState);
        setStatusMessage('Product updated in the live catalog.');
      } else {
        await onCreateProduct(formState);
        setStatusMessage('Product added to the live catalog.');
      }

      setEditingId(null);
      setFormState(EMPTY_PRODUCT_FORM);
    } catch (error) {
      setStatusMessage(formatActionError(error, 'Unable to save product.'));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      weight: product.weight,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setStatusMessage(`Editing ${product.name}.`);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteProduct(id);
      if (editingId === id) {
        setEditingId(null);
        setFormState(EMPTY_PRODUCT_FORM);
      }
      setStatusMessage('Product removed from the live catalog.');
    } catch (error) {
      setStatusMessage(formatActionError(error, 'Unable to delete product.'));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar isAdmin />
      <section className="pt-32 pb-20 md:pb-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-16 max-w-3xl">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-white/40 mb-4 block">Catalog Control</span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-bold tracking-tighter leading-[0.9] mb-8">
              PRODUCT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/20">ADMIN</span>
            </h1>
            <p className="max-w-2xl text-sm md:text-lg text-white/60 font-light leading-relaxed">
              Upload product imagery, create new entries, and manage the catalog that powers the live site slider. Everything stays serverless and persists in the browser.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10">
            <section id="admin-products" className="bg-white/5 border border-white/5 p-8 md:p-10 rounded-sm">
              <div className="flex items-center gap-2 mb-8">
                <ImagePlus className="w-5 h-5 text-white/40" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Create Or Update Product</span>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors"
                    placeholder="Product Name"
                    value={formState.name}
                    onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors"
                    placeholder="Weight (optional)"
                    value={formState.weight}
                    onChange={(event) => setFormState({ ...formState, weight: event.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors"
                    placeholder="Price"
                    value={formState.price}
                    onChange={(event) => setFormState({ ...formState, price: event.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors"
                    placeholder="Image URL (optional)"
                    value={formState.image.startsWith('data:') ? '' : formState.image}
                    onChange={(event) => setFormState({ ...formState, image: event.target.value })}
                  />
                </div>

                <textarea
                  className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white/40 outline-none transition-colors h-28 resize-none"
                  placeholder="Product description"
                  value={formState.description}
                  onChange={(event) => setFormState({ ...formState, description: event.target.value })}
                  required
                />

                <div id="admin-upload" className="border border-dashed border-white/10 bg-black/30 rounded-sm p-5">
                  <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-white">Upload Product Image</p>
                      <p className="text-xs text-white/40">Select a local file to store directly in the catalog entry, or leave it blank to use the default image.</p>
                    </div>
                    <span className="px-4 py-3 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-white/70">
                      Choose File
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>

                  {formState.image ? (
                    <div className="mt-5 overflow-hidden rounded-sm border border-white/10">
                      <img src={resolveProductImage(formState.image)} alt="Product preview" className="w-full h-56 object-cover" />
                    </div>
                  ) : (
                    <div className="mt-5 overflow-hidden rounded-sm border border-white/10">
                      <img src={FALLBACK_PRODUCT_IMAGE} alt="Default product preview" className="w-full h-56 object-cover opacity-70" />
                    </div>
                  )}
                </div>

                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{statusMessage}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                    {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingId ? (
                    <button
                      type="button"
                      className="w-full py-4 border border-white/10 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all"
                      onClick={() => {
                        setEditingId(null);
                        setFormState(EMPTY_PRODUCT_FORM);
                        setStatusMessage('Create a fresh product entry.');
                      }}
                    >
                      Cancel Edit
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className="bg-white/5 border border-white/5 p-8 md:p-10 rounded-sm">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Live Product List</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">{products.length} Products</h2>
                </div>
                <a href="/" className="text-[10px] uppercase font-bold tracking-widest text-white/60 hover:text-white transition-colors">
                  Open Live Site
                </a>
              </div>

              <div className="space-y-4 max-h-[780px] overflow-y-auto pr-1">
                {products.map((product) => (
                  <div key={product.id} className="border border-white/5 bg-black/30 rounded-sm overflow-hidden">
                    <div className="h-40 bg-black/40">
                      <img src={resolveProductImage(product.image)} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <p className="text-xs text-white/40">
                            {product.weight || 'Custom Spec'} · {product.price}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed">{product.description}</p>
                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          className="text-[10px] uppercase font-bold tracking-widest text-white/70 hover:text-white transition-colors flex items-center gap-2"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white/70 transition-colors flex items-center gap-2"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

const Footer = () => (
  <footer className="py-12 bg-black border-t border-white/5 px-6 md:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 flex items-center justify-center rounded-sm">
            <Music className="text-white w-4 h-4" />
          </div>
          <span className="font-sans font-bold tracking-tighter text-sm uppercase">AudioWerkhaus</span>
        </div>
        <div className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
          <div>Germany: +49 178 3640921</div>
          <div>Korea: +82 10 5557 0582</div>
          <div>USA: +1 669 362 1974</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-[10px] font-mono uppercase tracking-widest text-white/20">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Shipping</a>
        <span>© 2026 AudioWerkhaus</span>
      </div>
    </div>
  </footer>
);

const PublicSite = ({
  products,
  requests,
  onCreateRequest,
  onUpdateRequest,
  onDeleteRequest,
}: {
  products: Product[];
  requests: ConsultationRequest[];
  onCreateRequest: (request: ConsultationFormState) => Promise<void>;
  onUpdateRequest: (id: string, request: ConsultationFormState) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
}) => {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProductPayload | null>(null);

  const handleSelectProduct = (productName: string) => {
    setSelectedProduct({
      name: productName,
      token: Date.now(),
    });
    goToAnchor('contact');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar isAdmin={false} />
      <Hero />
      <SoundProfile />
      <Catalog products={products} onSelectProduct={handleSelectProduct} />
      <Contact
        selectedProduct={selectedProduct}
        requests={requests}
        onCreate={onCreateRequest}
        onUpdate={onUpdateRequest}
        onDelete={onDeleteRequest}
      />
      <Footer />
    </div>
  );
};

export default function App() {
  const [pathname, setPathname] = useState(readUrlPath());
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);

  const reloadProducts = async () => {
    const nextProducts = await fetchProducts();
    setProducts(nextProducts);
  };

  const reloadRequests = async () => {
    const nextRequests = await fetchConsultationRequests();
    setRequests(nextRequests);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [nextProducts, nextRequests] = await Promise.all([fetchProducts(), fetchConsultationRequests()]);

        if (!isMounted) return;

        if (nextProducts.length > 0) {
          setProducts(nextProducts);
        }
        setRequests(nextRequests);
      } catch (error) {
        console.error(error);
      }
    };

    void loadData();

    const handlePopState = () => setPathname(readUrlPath());
    window.addEventListener('popstate', handlePopState);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleCreateProduct = async (product: ProductFormState) => {
    await createProduct(product);
    await reloadProducts();
  };

  const handleUpdateProduct = async (id: string, product: ProductFormState) => {
    await updateProduct(id, product);
    await reloadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    await reloadProducts();
  };

  const handleCreateRequest = async (request: ConsultationFormState) => {
    await createConsultationRequest(request);
    await reloadRequests();
  };

  const handleUpdateRequest = async (id: string, request: ConsultationFormState) => {
    await updateConsultationRequest(id, request);
    await reloadRequests();
  };

  const handleDeleteRequest = async (id: string) => {
    await deleteConsultationRequest(id);
    await reloadRequests();
  };

  if (pathname === '/admin') {
    return (
      <AdminPage
        products={products}
        onCreateProduct={handleCreateProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    );
  }

  return (
    <PublicSite
      products={products}
      requests={requests}
      onCreateRequest={handleCreateRequest}
      onUpdateRequest={handleUpdateRequest}
      onDeleteRequest={handleDeleteRequest}
    />
  );
}
