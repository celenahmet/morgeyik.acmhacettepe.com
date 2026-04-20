
import React, { useState } from 'react';
import { 
  X, CheckCircle2, ChevronRight, Loader2, GraduationCap, Calendar, Music, Users, AlertCircle, Instagram
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Language } from './types';
import { translations } from './translations';
import { addDoc, collection, getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';

// --- Same firebase config as App.tsx ---
const firebaseConfig = {
  apiKey: "AIzaSyDowu5g6kK6V2ZH1qdyH7M9BqoBAo-IP7c",
  authDomain: "morgeyik-ec048.firebaseapp.com",
  projectId: "morgeyik-ec048",
  storageBucket: "morgeyik-ec048.firebasestorage.app",
  messagingSenderId: "1082488241528",
  appId: "1:1082488241528:web:2ae50a60c1e8e1fd319c8d",
  measurementId: "G-16CB4BW8MK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const UPCOMING_EVENTS_MINI = [
  { guests: "Hayko Cepkin & Pelin Akil", date: "27 NİSAN", icon: <Users size={18} /> },
  { guests: "Madrigal", date: "28 NİSAN", icon: <Music size={18} /> }
];

const FormsPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-[#0B0614] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6A1BB1]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-[#3A0E6A]/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <button onClick={() => navigate('/')} className="mb-12 flex items-center space-x-3 text-gray-400 hover:text-white transition-all group">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#6A1BB1] group-hover:border-[#6A1BB1] transition-all">
            <X size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{lang === 'TR' ? 'Geri Dön' : 'Go Back'}</span>
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-[#6A1BB1]/20 border border-[#6A1BB1]/30 px-5 py-2 rounded-full mb-8">
            <GraduationCap size={16} className="text-[#A855F7]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D8B4FE]">{lang === 'TR' ? 'KATILIM FORMU' : 'APPLICATION FORM'}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter uppercase glow-text">
            {lang === 'TR' ? 'Dışarıdan Katılım Başvurusu' : 'External Participation Form'}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium italic">
            "{t.upcoming.studentNotice}"
          </p>
        </div>

        <div className="bg-[#1A0E2E]/60 border border-white/10 rounded-[3rem] p-12 lg:p-20 backdrop-blur-xl shadow-2xl text-center space-y-10">
          <div className="w-20 h-20 bg-[#6A1BB1]/20 border border-[#6A1BB1]/30 rounded-3xl flex items-center justify-center text-[#A855F7] mx-auto mb-8 animate-pulse">
            <AlertCircle size={40} />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tight">
              {lang === 'TR' ? 'Katılım formu henüz açılmamıştır.' : 'Participation form is not yet open.'}
            </h2>
            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              {lang === 'TR' 
                ? 'Form açıldığında buradan ve Instagram sayfamızdan duyuracağız. Takipte kalın!' 
                : 'When the form opens, we will announce it here and on our Instagram page. Stay tuned!'}
            </p>
          </div>

          <div className="pt-10 border-t border-white/5">
            <a 
              href="https://instagram.com/acmhacettepe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-[#A855F7] to-[#6A1BB1] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
            >
              <Instagram size={20} />
              <span>{lang === 'TR' ? 'INSTAGRAM\'DAN TAKİP ET' : 'FOLLOW ON INSTAGRAM'}</span>
            </a>
          </div>

          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
            ACM HACETTEPE - MOR GEYİK 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
