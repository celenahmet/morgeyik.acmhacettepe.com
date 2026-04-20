import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { Lock, Loader2, Download, Eye, Trash2, Mail, Phone, Calendar, User, Search, RefreshCw, AlertCircle, Maximize2, ShieldCheck, Database, FileSpreadsheet, Globe, Box } from 'lucide-react';
import * as XLSX from 'xlsx';

// Accept db as a prop to use the existing firebase instance
export const AdminPage: React.FC<{ db: any }> = ({ db }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [error, setError] = useState('');
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setError('');
    
    try {
      // Get the admin_config document from users collection
      const adminConfigRef = doc(db, 'users', 'admin_config');
      const adminConfigSnap = await getDoc(adminConfigRef);
      
      if (adminConfigSnap.exists()) {
        const data = adminConfigSnap.data();
        if (data.password === password) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          setError('Hatalı parola.');
        }
      } else {
        setError('Admin yapılandırması bulunamadı.');
      }
    } catch (err: any) {
      setError('Bağlantı hatası: ' + err.message);
    }
    setIsLoadingAuth(false);
  };
  
  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const querySnapshot = await getDocs(collection(db, "MORGEYIK_Web"));
      const items: any[] = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ databaseId: docSnap.id, ...docSnap.data() });
      });
      // sort by id descending (latest first, id is generated using Date.now())
      items.sort((a, b) => (b.id || 0) - (a.id || 0));
      setSubmissions(items);
    } catch (err) {
      console.error(err);
      setError('Veri çekilirken hata oluştu.');
    }
    setIsLoadingData(false);
  };
  
  const downloadExcel = () => {
     if (submissions.length === 0) return alert('İndirilecek veri yok.');
     
     const ws = XLSX.utils.json_to_sheet(submissions.map(sub => ({
        "ID": sub.id,
        "Tarih": sub.timestamp,
        "Kategori": sub.category,
        "İsim": sub.name,
        "E-Posta": sub.email,
        "Telefon": sub.phone,
        "Mesaj": sub.message,
        "IP Adresi": sub.ip || 'Bilinmiyor',
        "Platform": sub.platform || 'Bilinmiyor',
        "Anonim Mi?": sub.isAnonymous ? "Evet" : "Hayır"
     })));
     
     const wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "Gelen Yanıtlar");
     XLSX.writeFile(wb, "morgeyik_iletisim_form.xlsx");
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0614] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <img src="/assets/logo/morgeyiklogo.png" className="h-20 md:h-24 object-contain" alt="Mor Geyik Logo" />
          <span className="text-white font-black uppercase tracking-widest text-xl">Admin Panel</span>
        </div>
        
        <div className="w-full max-w-md bg-[#1A0E2E]/80 border border-white/10 rounded-[2rem] p-10 flex flex-col items-center backdrop-blur-xl shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-[#6A1BB1]/20 rounded-full flex items-center justify-center mb-8 border border-[#6A1BB1]/40 shadow-[0_0_40px_rgba(106,27,177,0.3)]">
            <Lock className="text-[#A855F7]" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight text-center">Yönetim Paneli</h2>
          <p className="text-gray-400 mb-8 text-center text-sm font-medium">Lütfen yetkili parolasını giriniz.</p>
          
          <form onSubmit={handleLogin} className="w-full relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parola..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#A855F7] text-center mb-4 tracking-[0.5em]"
              required 
            />
            {error && <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1"><AlertCircle size={12}/>{error}</div>}
            
            <button 
              type="submit" 
              disabled={isLoadingAuth}
              className="w-full bg-[#6A1BB1] hover:bg-[#A855F7] text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {isLoadingAuth ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              <span>GİRİŞ YAP</span>
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0B0614] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <img src="/assets/logo/morgeyiklogo.png" className="h-20 md:h-32 object-contain" alt="Mor Geyik Logo" />
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">İletişim Formları</h1>
              <span className="text-[#A855F7] text-xs font-black uppercase tracking-widest">Mor Geyik Merkezi Yönetim</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <button onClick={fetchData} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-3 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">
               <RefreshCw size={14} className={isLoadingData ? "animate-spin" : ""} />
               <span>YENİLE</span>
             </button>
             <button onClick={downloadExcel} className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/30 px-5 py-3 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">
               <FileSpreadsheet size={14} />
               <span>XLSX İLE İNDİR</span>
             </button>
          </div>
        </header>

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <Loader2 size={40} className="animate-spin text-[#A855F7]" />
             <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">VERİLER YÜKLENİYOR...</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 border border-dashed border-white/10 rounded-[2rem] bg-white/5">
             <Database size={40} className="text-gray-600" />
             <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">HENÜZ HİÇBİR KAYIT YOK</span>
          </div>
        ) : (
          <div className="grid gap-6">
            {submissions.map((sub, i) => (
              <div key={i} className="bg-[#1A0E2E]/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-xl transition-all hover:-translate-y-1 hover:border-[#6A1BB1]/30">
                 <div className="flex flex-wrap md:flex-col gap-4 min-w-[200px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 shrink-0">
                    <div>
                      <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">KATEGORİ</div>
                      <div className="inline-block px-3 py-1 bg-[#6A1BB1]/20 text-[#A855F7] rounded uppercase font-black text-[10px] tracking-widest border border-[#6A1BB1]/30">{sub.category}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">GÖNDERİM TARİHİ</div>
                      <div className="flex items-center gap-1.5 text-white text-xs font-bold bg-white/5 px-2 py-1.5 rounded"><Calendar size={12} className="text-gray-400" />{sub.timestamp}</div>
                    </div>
                    {sub.isAnonymous && <div className="inline-block px-2 py-1 bg-white/10 text-white rounded uppercase font-bold text-[9px] tracking-widest border border-white/20 self-start"><ShieldCheck size={10} className="inline mr-1" /> ANONİM</div>}
                 </div>
                 
                 <div className="flex-grow">
                   <div className="flex items-center gap-2 mb-2"><User size={16} className="text-[#A855F7]" /><h3 className="text-lg font-black text-white uppercase">{sub.name}</h3></div>
                   <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 mb-6">
                      <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5"><Mail size={12} className="text-gray-500"/> {sub.email}</div>
                      <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5"><Phone size={12} className="text-gray-500"/> {sub.phone || '-'}</div>
                   </div>
                   <div className="bg-black/20 border border-white/5 rounded-xl p-5 mb-4">
                     <p className="text-gray-300 whitespace-pre-wrap font-medium">{sub.message}</p>
                   </div>
                   
                   <div className="flex flex-wrap gap-4 text-[10px] font-medium text-gray-600 mt-4 border-t border-white/5 pt-4">
                     <div className="flex items-center gap-1 uppercase font-bold tracking-widest"><Globe size={10}/> IP: <span className="text-white ml-0.5">{sub.ip || 'Bilinmiyor'}</span></div>
                     <div className="flex items-center gap-1 uppercase font-bold tracking-widest max-w-sm truncate"><Box size={10}/> Cihaz: <span className="text-white ml-0.5 truncate">{sub.platform || 'Bilinmiyor'}</span></div>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
