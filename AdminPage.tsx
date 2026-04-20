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
        "İsim": sub.name || '',
        "Soyisim": sub.surname || '',
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
  
  const getOS = (ua: string) => {
    if (!ua) return "Bilinmiyor";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS X")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Linux")) return "Linux";
    return "Diğer";
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
          <div className="bg-[#1A0E2E]/80 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white/5 border-b border-white/10">
                     <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Gönderen</th>
                     <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Kategori</th>
                     <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Tarih</th>
                     <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">OS / IP</th>
                     <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Mesaj</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {submissions.map((sub, i) => (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-6">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#6A1BB1]/20 flex items-center justify-center text-[#A855F7] border border-[#6A1BB1]/30">
                             <User size={18} />
                           </div>
                           <div>
                             <div className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                               {sub.name} {sub.surname || ''}
                               {sub.isAnonymous && <ShieldCheck size={12} className="text-gray-500" title="Anonim" />}
                             </div>
                             <div className="text-[10px] text-gray-500 font-medium lowercase tracking-wide">{sub.email}</div>
                             <div className="text-[10px] text-gray-500 font-medium tracking-wide">{sub.phone}</div>
                           </div>
                         </div>
                       </td>
                       <td className="p-6">
                         <span className="inline-block px-3 py-1 bg-[#6A1BB1]/20 text-[#A855F7] rounded-lg uppercase font-black text-[9px] tracking-widest border border-[#6A1BB1]/20">
                           {sub.category}
                         </span>
                       </td>
                       <td className="p-6 text-center">
                         <div className="text-[11px] font-bold text-gray-300">{sub.timestamp?.split(' ')[0]}</div>
                         <div className="text-[9px] font-medium text-gray-500 uppercase">{sub.timestamp?.split(' ')[1]}</div>
                       </td>
                       <td className="p-6 text-center">
                         <div className="flex flex-col items-center gap-1.5">
                           <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                             {getOS(sub.platform)}
                           </span>
                           <span className="text-[9px] font-mono text-gray-500">{sub.ip || '0.0.0.0'}</span>
                         </div>
                       </td>
                       <td className="p-6 min-w-[300px]">
                         <div className="bg-black/20 border border-white/5 rounded-xl p-4 text-xs text-gray-300 font-medium leading-relaxed group-hover:border-[#6A1BB1]/30 transition-colors max-h-[100px] overflow-y-auto custom-scrollbar">
                           {sub.message}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
