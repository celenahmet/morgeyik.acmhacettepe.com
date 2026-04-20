
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Language, EventData } from './types';
import { X, Lock, CheckCircle2, Music, Brain, Zap, Smile, Flame, Mic, Target, Star, Users, Clapperboard } from 'lucide-react';

// Import our new pages
import Home from './Home';
import FormsPage from './FormsPage';
import AdminPage from './AdminPage';

// --- Shared Modals (kept in App for global availability) ---
import { translations } from './translations';

const firebaseConfig = {
  apiKey: "AIzaSyCLfFKSVDlFSOwqXZKK4GNQ64wXoPcFATo",
  authDomain: "contactforms-2f87a.firebaseapp.com",
  projectId: "contactforms-2f87a",
  storageBucket: "contactforms-2f87a.firebasestorage.app",
  messagingSenderId: "257411095702",
  appId: "1:257411095702:web:9d6aa447d457e62d68b6b7",
  measurementId: "G-H9M272ER6F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const highlightIcons = { music: Music, brain: Brain, zap: Zap, smile: Smile, flame: Flame, mic: Mic, target: Target, star: Star, users: Users, clapperboard: Clapperboard };

const GuestModal: React.FC<{ guest: EventData, onClose: () => void, lang: Language }> = ({ guest, onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1A0E2E] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-[600] bg-black/50 p-2 rounded-full text-white hover:bg-[#6A1BB1] transition-all backdrop-blur-md"><X size={20} /></button>
        <div className="w-full md:w-2/5 h-64 md:h-auto md:min-h-[450px] shrink-0 relative">
          <img src={guest.imageUrl} className={`absolute inset-0 w-full h-full object-cover ${guest.imagePosition || 'object-top'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E2E] via-transparent to-transparent md:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E2E]/0 via-transparent to-[#1A0E2E] hidden md:block"></div>
        </div>
        <div className="p-6 md:p-12 flex-grow overflow-y-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="inline-block px-4 py-1.5 bg-[#6A1BB1]/20 border border-[#6A1BB1]/30 rounded-full text-[10px] font-black text-[#A855F7] tracking-[0.2em] uppercase">{guest.year}</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-none">{guest.guest}</h2>
          
          {guest.highlights && (
            <div className="flex flex-wrap gap-3 mb-8">
              {guest.highlights.map((h, i) => {
                const Icon = highlightIcons[h.iconType];
                return (
                  <div key={i} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <Icon size={14} className="text-[#A855F7]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{h.label[lang]}</span>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed">"{guest.bio?.[lang] || guest.description[lang]}"</p>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TR');
  const [selectedGuest, setSelectedGuest] = useState<EventData | null>(null);
  const [isAwardLightboxOpen, setIsAwardLightboxOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'acm3169') {
      setIsAdminAuthModalOpen(false); alert('Admin Panel Access Restricted in this view.'); setAdminPassword('');
    } else {
      setAuthError(true); setTimeout(() => setAuthError(false), 2000);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Home 
            lang={lang} 
            setLang={setLang} 
            selectedGuest={selectedGuest}
            setSelectedGuest={setSelectedGuest}
            isAwardLightboxOpen={isAwardLightboxOpen}
            setIsAwardLightboxOpen={setIsAwardLightboxOpen}
            setIsAdminAuthModalOpen={setIsAdminAuthModalOpen}
            db={db}
          />
        } />
        <Route path="/forms" element={<FormsPage lang={lang} />} />
        <Route path="/admin" element={<AdminPage db={db} />} />
      </Routes>

      {selectedGuest && <GuestModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} lang={lang} />}
      
      {isAdminAuthModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAdminAuthModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#1A0E2E] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="text-center mb-8"><h2 className="text-2xl font-black text-white uppercase tracking-tight">GÜVENLİ GİRİŞ</h2></div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <input autoFocus type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••" className={`w-full bg-black/40 border p-4 rounded-xl text-center font-black ${authError ? 'border-red-500' : 'border-white/10'} outline-none text-white`} />
              <button className="w-full bg-[#6A1BB1] text-white py-4 rounded-xl font-black uppercase shadow-xl transition-all hover:bg-[#A855F7]">GİRİŞ</button>
            </form>
          </div>
        </div>
      )}

      {isAwardLightboxOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" onClick={() => setIsAwardLightboxOpen(false)}>
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl"></div>
          <div className="relative max-w-5xl group">
             <img src="/assets/images/awards-1.jpg" className="rounded-3xl border border-white/10 shadow-2xl" />
          </div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
