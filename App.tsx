
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { Language, EventData, OrganizerData, VlogData } from './types';
import { translations } from './translations';
import { 
  Menu, X, Globe, Instagram, Linkedin, Youtube, 
  User, ExternalLink, Send, MapPin, ChevronRight, CheckCircle2, Sparkles,
  Gamepad2, Trophy, Code, Zap, MessageSquare, Loader2, Calendar, Music, Brain, Smile, Flame, Mic, Target, Star, Play, Clapperboard, Award, ShieldCheck, Users, Clock, AlertCircle,
  Box, Activity, Radio, Lock, Download, Eye, Trash2, Search, Filter, Mail, Phone, Medal, Maximize2
} from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
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

// --- GOOGLE SHEETS SCRIPT URL ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsw-3ihj0JJb9IG0olWnjXUUCqryN9gwy8Zv5LW-1n1g7uVdo0yHwDY1WMRm8NTq_V/exec";

const LOGO_MOR_GEYIK = "https://acsdays.com/web/morgeyik/morgeyik.png";
const LOGO_ACM_HACETTEPE = "https://acsdays.com/web/morgeyik/acm-white.png";

const PAST_EVENTS: EventData[] = [
  {
    year: "Mor Geyik'25",
    guest: "Nova Norda",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/novanorda.png",
    description: { 
      TR: "Bağımsız müzik dünyasının kurallarını yıkan, dijital çağın ozanı Nova Norda ile ilham dolu bir yolculuk.", 
      EN: "An inspiring journey with Nova Norda, the poet of the digital age who breaks the rules of independent music." 
    },
    industry: { TR: "MÜZİK & DİJİTAL SANAT", EN: "MUSIC & DIGITAL ART" },
    highlights: [
      { label: { TR: "BAĞIMSIZ ÜRETİM", EN: "INDIE PRODUCTION" }, iconType: 'music' },
      { label: { TR: "DİJİTAL STRATEJİ", EN: "DIGITAL STRATEGY" }, iconType: 'zap' }
    ],
    bio: {
      TR: "Nova Norda, Türk elektropop sahnesinin en yaratıcı ve cesur isimlerinden biri olarak Mor Geyik sahnesinde büyüleyici bir atmosfer yarattı. Bağımsız bir sanatçı olarak dijital mecraların sunduğu özgürlüğü nasıl bir avantaja çevirdiğini, yaratıcı blokları nasıl aştığını ve müziğini kitlelere ulaştırırken koruduğu samimiyetini paylaştı. Katılımcılara sadece bir söyleşi değil, modern sanatın ve dijital üretimin geleceğine dair vizyoner bir perspektif sundu.",
      EN: "Nova Norda, one of the most creative and courageous names in the Turkish electropop scene, created a fascinating atmosphere on the Mor Geyik stage. As an independent artist, she shared how she turned the digital freedom into an advantage, how she overcame creative blocks, and maintained sincerity while reaching masses. She offered a visionary perspective on the future of modern art and digital production."
    }
  },
  {
    year: "Mor Geyik'24",
    guest: "Sinan Canan",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/sinancanan.png", 
    imagePosition: "object-right",
    description: { 
      TR: "İnsanın evrimsel mirasını ve beyin fonksiyonlarını modern yaşamın hızıyla çarpıştıran derin bir entelektüel seans.", 
      EN: "A deep intellectual session colliding human evolutionary heritage and brain functions with the pace of modern life." 
    },
    industry: { TR: "SİNİRBİLİM & YAŞAM TASARIMI", EN: "NEUROSCIENCE & LIFE DESIGN" },
    highlights: [
      { label: { TR: "FABRİKA AYARLARI", EN: "FACTORY SETTINGS" }, iconType: 'target' },
      { label: { TR: "SİNİRBİLİM", EN: "NEUROSCIENCE" }, iconType: 'brain' }
    ],
    bio: {
      TR: "Prof. Dr. Sinan Canan, Mor Geyik sahnesinde 'İnsanın Fabrika Ayarları'nı temel alarak modern dünyamızda nasıl hayatta kalabileceğimizi sinirbilim penceresinden anlattı. Beynimizin çalışma prensiplerini, kaotik sistemlerin düzenini ve insanın biyolojik potansiyelini keşfetmeye dair sunduğu çarpıcı verilerle izleyicileri derin bir içsel yolculuğa çıkardı. Bilimsel gerçekliği mizahi ve akıcı bir dille harmanlayarak Hacettepe'de unutulmaz bir farkındalık yarattı.",
      EN: "Prof. Dr. Sinan Canan explained how we can survive in the modern world through the lens of neuroscience, based on 'Human Factory Settings'. He took the audience on a deep inner journey with striking data on brain functions, chaos theory, and human biological potential. He created an unforgettable awareness at Hacettepe by blending scientific reality with fluent and humorous language."
    }
  },
  {
    year: "Mor Geyik'24",
    guest: "Çağrı Ergün",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/cagriergun.png",
    description: { 
      TR: "Oyun dünyasından içerik üretimine, 'Hype' kültürünün mimarlarından teknoloji ve girişimcilik hikayeleri.", 
      EN: "Technology and entrepreneurship stories from the architects of 'Hype' culture, from gaming to content creation." 
    },
    industry: { TR: "TEKNOLOJİ & GİRİŞİMCİLİK", EN: "TECH & ENTREPRENEURSHIP" },
    highlights: [
      { label: { TR: "GLOBAL GİRİŞİM", EN: "GLOBAL STARTUP" }, iconType: 'zap' },
      { label: { TR: "ÜRÜN BÜYÜTME", EN: "PRODUCT GROWTH" }, iconType: 'target' }
    ],
    bio: {
      TR: "Dijital ekosistemin enerjisi en yüksek isimlerinden Çağrı 'Hype' Ergün, Mor Geyik sahnesinde bir yayının ötesine geçerek gerçek bir girişimcilik hikayesi anlattı. Global pazarda ürün büyütmenin zorluklarını, Türkiye'deki oyun sektörünün gelişimini ve topluluk yönetiminin inceliklerini paylaşan Ergün, gençlere tutkularını nasıl sürdürülebilir bir iş modeline dönüştürebileceklerine dair paha biçilemez tavsiyeler verdi.",
      EN: "One of the most energetic figures in the digital ecosystem, Cagri 'Hype' Ergun, went beyond a typical broadcast to share a true entrepreneurship story. Sharing the challenges of global product scaling, the evolution of the gaming industry in Turkey, and the intricacies of community management, Ergun provided invaluable advice to youth on turning passions into sustainable business models."
    }
  },
  {
    year: "Mor Geyik'24",
    guest: "Sergen Deveci",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/sergen.png",
    description: { 
      TR: "Gözlem yeteneğini mizahla harmanlayan, modern hayatın absürt detaylarını sahneye taşıyan bir performans sanatı söyleşisi.", 
      EN: "A talk on performance art that blends observation skills with humor, bringing the absurd details of modern life to the stage." 
    },
    industry: { TR: "MEDYA & PERFORMANS", EN: "MEDIA & PERFORMANCE" },
    highlights: [
      { label: { TR: "MODERN MİZAH", EN: "MODERN HUMOR" }, iconType: 'smile' },
      { label: { TR: "SAHNE SANATLARI", EN: "STAGE ARTS" }, iconType: 'mic' }
    ],
    bio: {
      TR: "Sergen Deveci, Mor Geyik sahnesine sadece kahkaha değil, aynı zamanda hayatın içinden keskin gözlemler ve sanatsal bir derinlik getirdi. Oyunculuk kariyerindeki dönüm noktalarını, dijital içerik üretimindeki yaratıcı süreci ve stand-up sahnesinin adrenalinini anlattığı bu oturumda, mizahın bir iletişim aracı olarak gücünü vurguladı.",
      EN: "Sergen Deveci brought not only laughter but also sharp observations and artistic depth to the Mor Geyik stage. In this session where he talked about milestones in his acting career, the creative process in digital content production, and the adrenaline of the stand-up stage, he emphasized the power of humor as a communication tool."
    }
  },
  {
    year: "Mor Geyik'23",
    guest: "Hayko Cepkin",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/hayko.png",
    description: { 
      TR: "Rock müziğinin efsanevi ismiyle, sınırları zorlayan sahne performansları ve ekstrem sporların disiplini üzerine.", 
      EN: "On boundary-pushing stage performances and the discipline of extreme sports with the legendary name." 
    },
    industry: { TR: "ROCK MÜZİK & SAHNE", EN: "ROCK MUSIC & STAGE" },
    highlights: [
      { label: { TR: "SAHNE DİSİPLİNİ", EN: "STAGE DISCIPLINE" }, iconType: 'flame' },
      { label: { TR: "EKSTREM SPORLAR", EN: "EXTREME SPORTS" }, iconType: 'target' }
    ],
    bio: {
      TR: "Türk Rock müziğinin en özgün karakterlerinden Hayko Cepkin, Mor Geyik'in 2023 ayağında sahneye devasa bir energy bıraktı. Müzikal yolculuğundaki evrimi, ekstrem performansların hazırlık sürecini ve gökyüzünden sahneye uzanan tutkularını anlattığı söyleşide, disiplinin bir sanatçı için önemini vurguladı. Mor Geyik ile kurduğu özel bağ ile öğrencilere ilham verdi.",
      EN: "One of the most unique characters of Turkish Rock music, Hayko Cepkin, left massive energy at the 2023 edition of Mor Geyik. In the talk where he described his musical evolution, the preparation process for extreme performances, and passions stretching from sky to stage, he emphasized the importance of discipline for an artist. He inspired students with his special bond with Mor Geyik."
    }
  },
  {
    year: "Mor Geyik'23",
    guest: "Can Ozan",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/canozan.png",
    description: { TR: "Yeni nesil müziğin melankolik ve huzurlu sesiyle şarkıların hikayelerine yolculuk.", EN: "A journey into song stories with the peaceful voice of the new generation." },
    industry: { TR: "ALTERNATİF MÜZİK", EN: "ALTERNATIVE MUSIC" },
    highlights: [
      { label: { TR: "MELANKOLİK TINILAR", EN: "MELANCHOLIC TUNES" }, iconType: 'music' },
      { label: { TR: "YENİ NESİL OZAN", EN: "NEW GEN POET" }, iconType: 'mic' }
    ],
    bio: {
      TR: "Can Ozan, samimi hikayeleri ve huzurlu ezgileriyle Mor Geyik sahnesini büyüledi. Şarkı yazarlığı sürecinden, bağımsız müziğin Türkiye'deki dönüşümüne kadar pek çok konuda öğrencilerin merak ettiklerini yanıtladı.",
      EN: "Can Ozan enchanted the Mor Geyik stage with his sincere stories and peaceful melodies. He answered student questions on everything from the songwriting process to the transformation of independent music in Turkey."
    }
  },
  {
    year: "Mor Geyik'23",
    guest: "Yaşlı Amca",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/yasliamca.png",
    description: { TR: "Alternatif rock tınılarını sahne enerjisiyle birleştiren grup dinamiği oturumu.", EN: "A session on band dynamics combining rock with stage energy." },
    industry: { TR: "ROCK & GRUP DİNAMİĞİ", EN: "ROCK & BAND DYNAMICS" },
    highlights: [
      { label: { TR: "GRUP SİNERJİSİ", EN: "BAND SYNERGY" }, iconType: 'users' },
      { label: { TR: "SAHNE ENERJİSİ", EN: "STAGE ENERGY" }, iconType: 'zap' }
    ],
    bio: {
      TR: "Yaşlı Amca grubu, bir arada üretmenin, müziği paylaşmanın ve sahne tozunu yutmanın getirdiği o eşsiz bağı Mor Geyik izleyicileriyle paylaştı. Alternatif rock dünyasındaki yerlerini ve gelecek planlarını samimi bir dille aktardılar.",
      EN: "The band Yasli Amca shared the unique bond that comes from producing together, sharing music on stage. They shared their place in the alternative rock world and future plans in a sincere manner."
    }
  },
  {
    year: "Mor Geyik'21",
    guest: "Noluyo Ya?",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/noluyoya.png",
    description: { TR: "Dijital dünyanın samimi çifti ile içerik üretiminin mutfağına bakış.", EN: "A look at the kitchen of content production with the digital couple." },
    industry: { TR: "DİJİTAL İÇERİK", EN: "DIGITAL CONTENT" },
    highlights: [
      { label: { TR: "İÇERİK ÜRETİMİ", EN: "CONTENT CREATION" }, iconType: 'target' },
      { label: { TR: "DİJİTAL SAMİMİYET", EN: "DIGITAL SINCERITY" }, iconType: 'smile' }
    ],
    bio: {
      TR: "Dijital içerik dünyasının en sevilen ve samimi çiftlerinden Noluyo Ya?, Mor Geyik sahnesinde içerik üretiminin sadece görünen kısmını değil, mutfaktaki gerçek disiplini ve samimiyetin dijital çağdaki önemini anlattı. Bir topluluk inşa etmenin, izleyiciyle kurulan o sarsılmaz bağın ve sürekli değişen algoritmalara karşı özgün kalabilmenin yollarını paylaştıkları oturumda, dijital dünyada var olmanın dinamiklerini keyifli bir dille aktardılar.",
      EN: "One of the digital world's most loved and sincere couples, Noluyo Ya?, shared the kitchen of content creation, emphasizing real discipline and the importance of sincerity in the digital age. They talked about building a community, the unshakable bond with the audience, and staying original against changing algorithms."
    }
  },
  {
    year: "Mor Geyik'19",
    guest: "Halil Sezai",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/halilsezai.png",
    description: { TR: "Müziğin ve sinemanın derinliklerinde sanatsal bir keşif.", EN: "An artistic exploration in the depths of music and cinema." },
    industry: { TR: "SANAT & MÜZİK", EN: "ART & MUSIC" },
    highlights: [
      { label: { TR: "SİNEMA & OYUNCULUK", EN: "CINEMA & ACTING" }, iconType: 'clapperboard' },
      { label: { TR: "MELANKOLİ", EN: "MELANKOLİ" }, iconType: 'music' }
    ],
    bio: {
      TR: "Kendine has tarzı ve derin duygulara hitap eden sesiyle Halil Sezai, Mor Geyik 2019'da sanatın çok yönlülüğünü sahneye taşıdı. Sinema dünyasındaki oyunculuk kariyerinden müziğindeki melankolik derinliğe uzanan yolculuğunu paylaşan sanatçı, yaratım sürecinin sancılarını ve bir hikaye anlatıcısı olarak her iki disiplinde de nasıl var olduğunu anlattı. Katılımcılara melankolinin sanatsal bir güce nasıl dönüşebileceğine dair unutulmaz bir perspektif sundu.",
      EN: "With his unique style and deep voice, Halil Sezai brought the versatility of art to Mor Geyik 2019. Sharing his journey from acting to melancholic musical depth, the artist explained the pains of creation and existing in both disciplines as a storyteller."
    }
  },
  {
    year: "Mor Geyik'18",
    guest: "Azra Kohen",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/azrakohen.png",
    description: { TR: "Edebiyatın gücüyle insan doğasını sorgulayan vizyon seansı.", EN: "A vision session questioning human nature through literature." },
    industry: { TR: "EDEBİYAT & PSİKOLOJİ", EN: "LITERATURE & PSYCHOLOGY" },
    highlights: [
      { label: { TR: "İNSAN DOĞASI", EN: "HUMAN NATURE" }, iconType: 'brain' },
      { label: { TR: "EDEBİ VİZYON", EN: "LITERARY VISION" }, iconType: 'star' }
    ],
    bio: {
      TR: "Edebiyat dünyasının en etkileyici kalemlerinden biri olan Azra Kohen, Mor Geyik sahnesinde 'İnsanın Farkındalığı' üzerine derin bir söyleşi gerçekleştirdi. Eserlerinde işlediği psikolojik temaları ve insan doğasının karmaşıklığını bilimsel verilerle harmanlayarak anlatan Kohen, öğrencilere hayata dair farklı bir vizyon kazandırdı. Bilginin gücü, bireyin kendini keşfetme süreci ve toplumsal dönüşüm konularında paylaştığı çarpıcı fikirlerle Beytepe'de entelektüel bir rüzgar estirdi.",
      EN: "One of literature's most influential writers, Azra Kohen, held a profound talk on 'Human Awareness'. Blending psychological themes from her works with scientific data, she provided students with a different vision of life. She stirred an intellectual breeze with striking ideas on the power of knowledge, self-discovery, and social transformation."
    }
  },
  {
    year: "Mor Geyik'17",
    guest: "Hayko Cepkin",
    imageUrl: "https://acsdays.com/web/morgeyik/recent/hayko-2017.png",
    description: { TR: "Mor Geyik serüveninin ilk adımı, efsanevi sanatçıyla atılan temel.", EN: "The first step of Mor Geyik, the foundation with the legend." },
    industry: { TR: "ROCK MÜZİK", EN: "ROCK MUSIC" },
    highlights: [
      { label: { TR: "GELENEĞİN BAŞLANGICI", EN: "START OF TRADITION" }, iconType: 'flame' },
      { label: { TR: "EFSANEVİ SAHNE", EN: "LEGENDARY STAGE" }, iconType: 'zap' }
    ],
    bio: {
      TR: "Mor Geyik serüveninin ilk ve en cesur adımı olan 2017 yılında, Hayko Cepkin sahneye dev bir vizyon bıraktı. Bugün bir gelenek haline gelen bu etkinliğin temelini atan sanatçı, sıfırdan bir kariyer inşa etmenin zorluklarını ve rock müzik sahnesindeki benzersiz duruşunu paylaştı. Mor Geyik’in prestij ve kalite standartlarını belirleyen bu ilk oturumda, Hayko’nun enerjisi ve profesyonelliği projenin gelecekte ne kadar büyüyeceğinin en büyük işareti oldu.",
      EN: "In the first and boldest step of the Mor Geyik journey in 2017, Hayko Cepkin left a giant vision on the stage. Setting the foundation for what is now a tradition, the artist shared the difficulties of building a career from scratch and his unique stance in rock music. His energy was the greatest sign of how much this project would grow."
    }
  }
];

const VLOGS: VlogData[] = [
  { id: "ToR0aDh1fQM", title: { TR: "Mor Geyik'24 Çağrı 'HYPE' Ergün VLOG", EN: "Mor Geyik'24 Cagri 'HYPE' Ergun VLOG" } },
  { id: "Cqih3h119Q0", title: { TR: "Mor Geyik'24 Sergen Deveci VLOG", EN: "Mor Geyik'24 Sergen Deveci VLOG" } },
  { id: "R4TnPs0KO44", title: { TR: "Mor Geyik'24 Sinan Canan VLOG", EN: "Mor Geyik'24 Sinan Canan VLOG" } },
  { id: "H7dvDwjmS6Y", title: { TR: "Mor Geyik'23 Hayko Cepkin VLOG", EN: "Mor Geyik'23 Hayko Cepkin VLOG" } },
  { id: "x10--d2hSz0", title: { TR: "Mor Geyik'23 Yaşlı Amca VLOG", EN: "Mor Geyik'23 Yasli Amca VLOG" } },
  { id: "FZXHkfwrS5Q", title: { TR: "Mor Geyik'23 Ala Tokel VLOG", EN: "Mor Geyik'23 Ala Tokel VLOG" } },
];

const ORGANIZERS: OrganizerData[] = [
  { period: "MOR GEYİK'25", names: ["YAMAN HAS", "ZEYNEP ECE ÖZTEMEL"] },
  { period: "MOR GEYİK'24", names: ["KIVILCIM NEHİR BOZBURUN", "OZAN EFE AKPINAR"] },
  { period: "MOR GEYİK'23", names: ["ALEYNA GÜNALAY", "CAN YAVUZTEKİN", "TÜLAY TURHAN"] },
];

const SLIDE_IMAGES = [
  { url: "https://acsdays.com/web/morgeyik/recent/hayko.png", label: "Hayko Cepkin (2023)" },
  { url: "https://acsdays.com/web/morgeyik/recent/noluyoya.png", label: "Noluyo Ya? (2021)" },
  { url: "https://acsdays.com/web/morgeyik/recent/canozan.png", label: "Can Ozan (2023)" },
];

const HighlightIcon: React.FC<{ type: string; className?: string; size?: number }> = ({ type, className, size }) => {
  switch (type) {
    case 'music': return <Music className={className} size={size} />;
    case 'brain': return <Brain className={className} size={size} />;
    case 'zap': return <Zap className={className} size={size} />;
    case 'smile': return <Smile className={className} size={size} />;
    case 'flame': return <Flame className={className} size={size} />;
    case 'mic': return <Mic className={className} size={size} />;
    case 'target': return <Target className={className} size={size} />;
    case 'star': return <Star className={className} size={size} />;
    case 'users': return <Users className={className} size={size} />;
    case 'clapperboard': return <Clapperboard className={className} size={size} />;
    default: return <Box className={className} size={size} />;
  }
};

const XLogo: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/>
  </svg>
);

const GuestModal: React.FC<{ guest: EventData, onClose: () => void, lang: Language }> = ({ guest, onClose, lang }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 md:p-6 lg:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#0B0614]/98 backdrop-blur-3xl" onClick={onClose}></div>
      <div className="relative w-full max-w-7xl max-h-[92vh] bg-[#1A0E2E] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-glow group">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 z-[600] w-10 h-10 md:w-14 md:h-14 bg-black/40 hover:bg-[#6A1BB1] border border-white/10 rounded-full text-white flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-90"><X size={20} className="md:w-[28px] md:h-[28px]" /></button>
        <div className="relative w-full md:w-[38%] h-[32vh] md:h-auto overflow-hidden shrink-0">
          <img src={guest.imageUrl} className={`w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105 ${guest.imagePosition || 'object-center'}`} alt={guest.guest} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E2E] via-[#1A0E2E]/10 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 z-10">
            <div className="flex flex-col space-y-2 md:space-y-4">
              <div className="flex items-center space-x-3 md:space-x-4"><div className="w-8 md:w-12 h-[2px] bg-[#6A1BB1]"></div><span className="text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase text-white/60">{guest.year}</span></div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-1 md:mb-2 uppercase glow-text">{guest.guest}</h2>
              <div className="inline-flex items-center space-x-2 md:space-x-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 md:px-6 md:py-2.5 rounded-full self-start"><Sparkles size={12} className="text-[#A855F7] md:w-[16px] md:h-[16px]" /><span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#D8B4FE]">{guest.industry?.[lang]}</span></div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[62%] p-6 md:p-12 lg:p-20 flex flex-col relative bg-noise overflow-y-auto md:overflow-hidden">
          <div className="relative z-10 flex flex-col h-full">
            <div className="inline-flex items-center space-x-3 md:space-x-4 bg-[#6A1BB1]/10 border border-[#6A1BB1]/20 px-6 py-2 md:px-8 md:py-3 rounded-full self-start mb-8 md:mb-12 shadow-lg">
              <Calendar size={14} className="text-[#A855F7] md:w-[18px] md:h-[18px]" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#D8B4FE]">MOR GEYİK HATIRASI</span>
            </div>
            <div className="mb-8 md:mb-12 flex-grow overflow-y-auto lg:overflow-visible pr-2 custom-scrollbar">
               <div className="relative">
                  <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-[3px] md:w-[4px] bg-gradient-to-b from-[#6A1BB1] via-[#A855F7] to-transparent rounded-full shadow-lg"></div>
                  <p className="text-gray-200 text-sm md:text-lg lg:text-2xl leading-relaxed font-medium italic relative pl-4 md:pl-0">
                    "{guest.bio?.[lang] || guest.description[lang]}"
                  </p>
               </div>
            </div>
            {guest.highlights && guest.highlights.length > 0 && (
              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex gap-4">
                  {guest.highlights.map((h, i) => (
                    <div key={i} className="flex-1 bg-white/[0.04] p-4 rounded-2xl flex items-center space-x-4 border border-white/5">
                      <div className="w-10 h-10 bg-[#6A1BB1]/20 rounded-lg flex items-center justify-center text-[#A855F7]">
                        <HighlightIcon type={h.iconType} size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h.label[lang]}</h4>
                        <div className="w-6 h-[2px] bg-[#6A1BB1]/40"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const exportToExcel = () => {
    if (messages.length === 0) return;
    const headers = ["Tarih", "İsim", "Email", "Telefon", "Kategori", "Mesaj", "Anonim"];
    const csvContent = [
      headers.join(","),
      ...messages.map(m => [
        `"${m.timestamp}"`,
        `"${m.isAnonymous ? 'ANONİM' : m.name}"`,
        `"${m.isAnonymous ? '-' : m.email}"`,
        `"${m.isAnonymous ? '-' : (m.phone || '-')}"`,
        `"${m.category}"`,
        `"${(m.message || '').replace(/"/g, '""')}"`,
        `"${m.isAnonymous ? 'EVET' : 'HAYIR'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `morgeyik_mesajlar_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMessages = messages.filter(m => 
    (m.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.message?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.category?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-[1400px] h-[85vh] bg-[#120B20] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-black/20 gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#A855F7] to-[#6A1BB1] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20"><Mail size={28} /></div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-tight">İLETİŞİM PANELİ</h2>
              <div className="flex items-center space-x-3 mt-1">
                 <span className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20"><Activity size={10} className="mr-1.5" /> LIVE SYSTEM</span>
                 <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{messages.length} TOPLAM MESAJ</span>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full md:w-auto space-x-4">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="text" placeholder="ARAMA YAPIN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase outline-none focus:border-[#A855F7] transition-all w-full md:w-80 text-white" />
            </div>
            <button onClick={exportToExcel} className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-xl text-xs font-black transition-all uppercase shadow-lg transform hover:scale-105 active:scale-95"><Download size={16} /> <span className="hidden sm:inline">DIŞA AKTAR</span></button>
            <button onClick={onClose} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-red-500 transition-all transform hover:rotate-90"><X size={24} /></button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4 md:p-8 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Loader2 className="animate-spin text-[#A855F7]" size={56} />
              <span className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">VERİ TABANI BAĞLANTISI...</span>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-40 space-y-4"><AlertCircle size={80} /><span className="text-sm font-black uppercase tracking-widest text-center">GÖSTERİLECEK VERİ BULUNAMADI</span></div>
          ) : (
            <div className="grid gap-6">
               {filteredMessages.map((m) => (
                 <div key={m.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all hover:border-[#6A1BB1]/30 group relative">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                       <div className="space-y-4 flex-grow">
                          <div className="flex items-center space-x-3">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${m.isAnonymous ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-[#6A1BB1]/20 text-[#A855F7] border border-[#6A1BB1]/20'}`}>
                                {m.isAnonymous ? <ShieldCheck size={20} /> : <User size={20} />}
                             </div>
                             <div>
                                <h3 className={`text-sm font-black uppercase tracking-tight ${m.isAnonymous ? 'text-green-500' : 'text-white'}`}>{m.isAnonymous ? 'ANONİM KULLANICI' : m.name}</h3>
                                <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-500 uppercase mt-0.5"><span className="flex items-center"><Clock size={12} className="mr-1" /> {m.timestamp}</span><span className="w-1 h-1 rounded-full bg-gray-700"></span><span className="text-[#A855F7]">{m.category}</span></div>
                             </div>
                          </div>
                          <div className="relative pl-4 border-l-2 border-white/5"><p className="text-gray-300 text-sm leading-relaxed font-medium italic">"{m.message}"</p></div>
                       </div>
                       {!m.isAnonymous && (
                         <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
                            <div className="bg-black/30 border border-white/5 p-3 rounded-xl flex items-center space-x-3"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400"><Mail size={14} /></div><span className="text-[11px] font-mono text-gray-400 truncate">{m.email}</span></div>
                            <div className="bg-black/30 border border-white/5 p-3 rounded-xl flex items-center space-x-3"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400"><Phone size={14} /></div><span className="text-[11px] font-mono text-gray-400">{m.phone || 'GİRİLMEMİŞ'}</span></div>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TR');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<EventData | null>(null);
  const [isAwardLightboxOpen, setIsAwardLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAwardSlide, setCurrentAwardSlide] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: '', message: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  const t = translations[lang];
  const awardImages = ["https://acsdays.com/web/morgeyik/recent/awards-1.jpg", "https://acsdays.com/web/morgeyik/recent/awards-2.jpg"];

  // Re-derived to ensure it updates when language changes
  const ecosystemSubItems = [
    { id: 'morgeyik', title: 'MOR GEYİK', desc: lang === 'TR' ? 'BURADASINIZ' : 'YOU ARE HERE', isCurrent: true, icon: <Medal size={14}/> },
    { id: 'gelisim', title: 'GELİŞİM', desc: t.contact.events.gelisim, link: 'https://gelisim.acmhacettepe.com', icon: <Trophy size={14}/> },
    { id: 'sms', title: 'SMS', desc: t.contact.events.sms, link: 'https://sms.acmhacettepe.com', icon: <MessageSquare size={14}/> },
    { id: 'huprog', title: 'HUPROG', desc: t.contact.events.huprog, link: 'https://huprog.acmhacettepe.com', icon: <Code size={14}/> },
    { id: 'acsdays', title: 'ACSDAYS', desc: t.contact.events.acsdays, link: 'https://acsdays.com', icon: <Zap size={14}/> },
    { id: 'hujam', title: 'HUJAM', desc: t.contact.events.hujam, link: 'https://hujam.org', icon: <Gamepad2 size={14}/> }
  ];

  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    const slideTimer = setInterval(() => setCurrentSlide(s => (s + 1) % SLIDE_IMAGES.length), 4000);
    const awardTimer = setInterval(() => setCurrentAwardSlide(s => (s + 1) % awardImages.length), 5000);
    return () => { clearInterval(timer); clearInterval(slideTimer); clearInterval(awardTimer); };
  }, []);

  const formatSessionTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'acm3169') {
      setIsAdminAuthModalOpen(false); setIsAdminPanelOpen(true); setAdminPassword(''); setAuthError(false);
    } else {
      setAuthError(true); setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnonymous) {
      if (formData.name.trim().length < 3) return alert(lang === 'TR' ? "Lütfen geçerli bir isim giriniz." : "Please enter a valid name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return alert(lang === 'TR' ? "Geçerli bir e-posta adresi giriniz." : "Enter a valid email address.");
    }
    if (formData.message.length < 5) return alert(lang === 'TR' ? "Mesaj çok kısa." : "Message too short.");
    if (!formData.category) return alert(lang === 'TR' ? "Lütfen bir kategori seçiniz." : "Please select a category.");

    const payload = { ...formData, name: isAnonymous ? (lang === 'TR' ? "ANONİM" : "ANONYMOUS") : formData.name, isAnonymous, timestamp: new Date().toLocaleString('tr-TR'), id: Date.now() };
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "submissions"), payload);
      try { await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); } catch (scriptErr) { console.error("Sheets error:", scriptErr); }
      setIsSent(true); setFormData({ name: '', email: '', phone: '', category: '', message: '' }); setTimeout(() => setIsSent(false), 5000);
    } catch (err) { alert(lang === 'TR' ? "Bir hata oluştu." : "An error occurred."); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B0614] text-[#F5F3FA] relative overflow-x-hidden selection:bg-[#A855F7] selection:text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6A1BB1]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-[#3A0E6A]/30 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
      </div>

      {selectedGuest && <GuestModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} lang={lang} />}
      
      {/* Award Image Lightbox */}
      {isAwardLightboxOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#0B0614]/95 backdrop-blur-2xl" onClick={() => setIsAwardLightboxOpen(false)}></div>
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center group">
            <button 
              onClick={() => setIsAwardLightboxOpen(false)} 
              className="absolute -top-6 -right-6 md:-top-12 md:-right-12 z-[1100] w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-[#6A1BB1] border border-white/20 rounded-full text-white flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-90"
            >
              <X size={24} className="md:w-[32px] md:h-[32px]" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.3)]">
              <img 
                src={awardImages[currentAwardSlide]} 
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain select-none" 
                alt="Award Enlarged" 
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                MOR GEYİK - KAMPÜSÜN ENLERİ
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />}
      {isAdminAuthModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAdminAuthModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#1A0E2E] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-glow">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#6A1BB1]/20 border border-[#6A1BB1]/30 rounded-2xl flex items-center justify-center text-[#A855F7] mx-auto mb-6 shadow-xl"><Lock size={32} /></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">GÜVENLİ GİRİŞ</h2>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <input autoFocus type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••" className={`w-full bg-black/40 border p-4 rounded-xl text-center font-black tracking-[1em] focus:border-[#A855F7] outline-none transition-all ${authError ? 'border-red-500 animate-shake' : 'border-white/10'}`} />
              <button className="w-full bg-gradient-to-r from-[#A855F7] to-[#6A1BB1] text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl">PANELİ AÇ</button>
            </form>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full z-[100] h-24 lg:h-36 glass-nav flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between h-full">
          <img src={LOGO_MOR_GEYIK} alt="Logo" className="h-28 lg:h-40 w-auto object-contain hover:opacity-80 transition-all" />
          <div className="flex items-center space-x-12 h-full">
            <div className="hidden lg:flex items-center space-x-10">
              {["program", "about", "awards", "events", "vlogs", "contact"].map((id) => (
                <a key={id} href={`#${id}`} onClick={(e) => scrollToSection(e, id)} className="text-[14px] font-semibold text-gray-300 hover:text-[#A855F7] transition-all uppercase">
                  {translations[lang].nav[id as keyof typeof translations.TR.nav] || id}
                </a>
              ))}
            </div>
            <button onClick={() => setLang(lang === 'TR' ? 'EN' : 'TR')} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all"><Globe className="w-4 h-4 text-[#6A1BB1]" /><span className="text-xs font-bold uppercase">{lang}</span></button>
            <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={32} /> : <Menu size={32} />}</button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden bg-[#0B0614] pt-40 px-6 animate-in fade-in slide-in-from-top duration-300 flex flex-col space-y-6">
           {["program", "about", "awards", "events", "vlogs", "contact"].map((id) => (
              <a key={id} href={`#${id}`} className="text-2xl font-bold text-gray-200 uppercase tracking-tight border-b border-white/5 pb-4" onClick={(e) => scrollToSection(e, id)}>{translations[lang].nav[id as keyof typeof translations.TR.nav] || id}</a>
           ))}
        </div>
      )}

      <header id="program" className="relative pt-48 lg:pt-64 pb-24 px-6 min-h-[90vh] flex items-center justify-center text-center">
        <div className="container mx-auto relative z-10">
          <div className="inline-block px-5 py-2 bg-[#6A1BB1]/20 border border-[#6A1BB1]/30 rounded-full text-sm font-bold text-[#A855F7] mb-6 tracking-[0.2em] uppercase">ACM Hacettepe Presents</div>
          <h1 className="text-5xl lg:text-[7rem] font-black text-white mb-6 tracking-tighter glow-text leading-none uppercase">{t.hero.title}</h1>
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-400 mb-10 max-w-3xl mx-auto uppercase tracking-[0.3em]">{t.hero.subtitle}</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">{t.hero.description}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#events" onClick={(e) => scrollToSection(e, 'events')} className="px-10 py-5 bg-[#6A1BB1] hover:bg-[#3A0E6A] text-white rounded-2xl font-black transition-all uppercase tracking-widest text-sm shadow-xl">{lang === 'TR' ? 'ETKİNLİKLER' : 'EVENTS'}</a>
            <a href="#vlogs" onClick={(e) => scrollToSection(e, 'vlogs')} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black transition-all uppercase tracking-widest text-sm hover:border-[#6A1BB1]">{lang === 'TR' ? 'VLOGLAR' : 'VLOGS'}</a>
          </div>
        </div>
      </header>

      <section id="about" className="py-40 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div><h2 className="text-3xl lg:text-5xl font-black text-white mb-12 uppercase">{t.about.title}</h2><p className="text-gray-400 text-xl leading-relaxed font-medium">{t.about.content}</p></div>
          <div className="relative aspect-video bg-[#3A0E6A]/20 rounded-[3rem] border border-[#6A1BB1]/20 overflow-hidden shadow-2xl">
            {SLIDE_IMAGES.map((slide, idx) => (
              <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
                <img src={slide.url} alt={slide.label} className="w-full h-full object-cover opacity-60" /><div className="absolute bottom-10 left-10 text-white"><div className="text-3xl font-black mb-3 glow-text uppercase">STAGE MOMENTS</div><div className="text-xs font-bold tracking-[0.5em] opacity-60 uppercase">{slide.label}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="relative py-24 lg:py-48 overflow-hidden flex justify-center">
        <div className="container max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-10 lg:gap-24">
            
            {/* Content Column */}
            <div className="flex flex-col justify-between order-1 py-2 lg:py-4 space-y-10">
              <div className="space-y-6 lg:space-y-10">
                 <div id="award-badge" className="inline-flex items-center space-x-3 bg-[#EAB308]/10 border border-[#EAB308]/20 px-4 py-2 rounded-full backdrop-blur-sm self-start">
                    <Trophy size={16} className="text-[#EAB308]" />
                    <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.6em] text-[#EAB308]">KAMPÜSÜN ENLERİ</span>
                 </div>
                 
                 <h2 id="award-title" className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] glow-text block">
                    {t.awards.title}
                 </h2>
              </div>

              {/* Description Block */}
              <div className="relative group flex-grow">
                 <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#EAB308] shadow-[0_0_25px_rgba(234,179,8,0.4)] rounded-full"></div>
                 
                 <div className="pl-8 lg:pl-12">
                    <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 font-bold italic leading-relaxed tracking-tight transition-all group-hover:text-white duration-500 no-italic">
                      <span className="italic">{t.awards.description}</span>
                    </p>
                    
                    <div className="mt-10 flex items-center space-x-4 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                       <div className="h-[1px] w-12 bg-[#EAB308]"></div>
                       <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#EAB308]">OFFICIAL PRESS RELEASE 2025</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative group order-2 flex flex-col lg:pt-[54px] min-h-[450px] lg:min-h-0">
               <div 
                 onClick={() => setIsAwardLightboxOpen(true)}
                 className="relative w-full max-w-[400px] lg:max-w-[420px] flex-grow bg-[#120B20] border-[2px] border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,1)] border-glow transform hover:scale-[1.02] transition-all duration-1000 ease-out self-center lg:self-end cursor-pointer group/image"
               >
                  {awardImages.map((img, idx) => (
                     <img 
                       key={idx} 
                       src={img} 
                       className={`absolute inset-0 w-full h-full object-cover transition-all duration-1500 ease-in-out ${currentAwardSlide === idx ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`} 
                       alt="Award Cinematic Production" 
                     />
                  ))}
                  
                  {/* Visual Shadow Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0614] via-transparent to-black/20 opacity-50"></div>

                  {/* Interaction Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500 bg-[#6A1BB1]/10">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transform scale-90 group-hover/image:scale-100 transition-transform">
                        <Maximize2 size={24} />
                     </div>
                  </div>
                  
                  {/* Decorative Branding Accent */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-full pointer-events-none opacity-5">
                     <div className="rotate-90 whitespace-nowrap text-[8px] lg:text-[11px] font-black uppercase tracking-[1.5em] text-white">MOR GEYİK EXCELLENCE</div>
                  </div>

                  {/* Surface Polish Pulse */}
                  <div className="absolute top-0 left-[-200%] w-full h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[35deg] group-hover:left-[200%] transition-all duration-2000 pointer-events-none"></div>
               </div>

               {/* Depth Floor Shadow */}
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-16 bg-purple-900/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
            </div>

          </div>
        </div>
      </section>

      <section id="events" className="py-40 px-6 bg-black/10">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase opacity-90">{t.pastEvents.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PAST_EVENTS.map((event, idx) => (
              <div key={idx} onClick={() => setSelectedGuest(event)} className="group bg-[#120B20] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl cursor-pointer relative">
                <div className="aspect-[4/3] overflow-hidden"><img src={event.imageUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt={event.guest} /></div>
                <div className="p-10 relative">
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#6A1BB1] text-white text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest">{event.year}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#6A1BB1] transition-colors">{event.guest}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{event.description[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vlogs" className="py-40 px-6 bg-[#0B0614]">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-24 glow-text">{t.vlogs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {VLOGS.map((vlog) => (
              <a key={vlog.id} href={`https://www.youtube.com/watch?v=${vlog.id}`} target="_blank" rel="noopener noreferrer" className="group block transition-all hover:-translate-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 group-hover:border-[#6A1BB1] transition-all relative shadow-2xl">
                  <img src={`https://img.youtube.com/vi/${vlog.id}/maxresdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={vlog.title[lang]} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><div className="w-14 h-14 bg-[#6A1BB1] rounded-full flex items-center justify-center shadow-2xl"><Play size={20} className="text-white fill-white" /></div></div>
                </div>
                <div className="mt-8 text-left px-2">
                   <h3 className="text-xl lg:text-2xl font-black text-white group-hover:text-[#A855F7] transition-all uppercase tracking-tighter mb-4">{vlog.title[lang]}</h3>
                   <div className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-widest border-t border-white/5 pt-4">
                      <Clapperboard size={12} className="text-[#6A1BB1]" />
                      <span>MOR GEYİK PRODUCTION</span>
                   </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="organizers" className="py-32 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-24">{t.organizers.title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ORGANIZERS.map((group, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-12 rounded-[3.5rem] flex flex-col items-center hover:border-[#6A1BB1]/30 transition-all group shadow-xl">
                <div className="w-20 h-20 bg-[#6A1BB1]/10 rounded-[2rem] flex items-center justify-center text-[#A855F7] mb-8 group-hover:bg-[#6A1BB1] group-hover:text-white transition-all shadow-xl group-hover:rotate-12 group-hover:scale-110"><Award size={40} /></div>
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-6">{group.period}</h4>
                <div className="space-y-3">{group.names.map((name, j) => (<p key={j} className="text-xl font-black text-white uppercase group-hover:text-[#A855F7] transition-colors">{name}</p>))}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-40 px-6 bg-[#0B0614]">
        <div className="container mx-auto flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          <div className="flex-[6.5] flex flex-col">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase border-l-[6px] border-[#6A1BB1] pl-6">{t.contact.title}</h2>
              {isAnonymous && (<div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full"><ShieldCheck size={14} className="text-green-500" /><span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{lang === 'TR' ? 'ANONİM MOD' : 'ANONYMOUS MODE'}</span></div>)}
            </div>
            <div className="bg-[#1A0E2E]/80 border border-white/5 rounded-[2rem] p-8 flex-grow shadow-2xl">
              {isSent ? (<div className="flex-grow flex flex-col items-center justify-center text-center py-16"><div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-5 shadow-lg"><CheckCircle2 size={32} /></div><h4 className="text-xl font-black text-white uppercase">{lang === 'TR' ? 'MESAJINIZ İLETİLDİ!' : 'MESSAGE SENT!'}</h4></div>) : (
                <form className="space-y-5 flex-grow flex flex-col" onSubmit={handleFormSubmit}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <input value={isAnonymous ? (lang === 'TR' ? "ANONİM" : "ANONYMOUS") : formData.name} disabled={isAnonymous} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 border bg-black/40 border-white/10 rounded-xl outline-none transition-all placeholder:text-gray-600 uppercase text-white focus:border-[#A855F7]" placeholder={t.contact.formName + " *"} />
                    <input value={isAnonymous ? (lang === 'TR' ? "GİZLENDİ" : "HIDDEN") : formData.email} disabled={isAnonymous} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" className="w-full p-4 border bg-black/40 border-white/10 rounded-xl outline-none transition-all placeholder:text-gray-600 text-white focus:border-[#A855F7]" placeholder={t.contact.formEmail + " *"} />
                  </div>
                  <input value={isAnonymous ? (lang === 'TR' ? "GİZLENDİ" : "HIDDEN") : formData.phone} disabled={isAnonymous} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 border bg-black/40 border-white/10 rounded-xl outline-none transition-all placeholder:text-gray-600 text-white focus:border-[#A855F7]" placeholder={t.contact.formSubject} />
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-4 border bg-black/40 border-white/10 text-white rounded-xl focus:border-[#A855F7] outline-none transition-all uppercase appearance-none">
                    <option value="">{lang === 'TR' ? 'BİR KONU SEÇİN... *' : 'CHOOSE A SUBJECT... *'}</option>
                    {["Guest", "Sponsor", "Feedback", "General"].map(c => <option key={c} value={c}>{translations[lang].contact.subjects[c.toLowerCase() as keyof typeof translations.TR.contact.subjects] || c}</option>)}
                  </select>
                  <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} className="w-full h-full min-h-[120px] bg-black/40 border border-white/10 p-4 text-white rounded-xl outline-none focus:border-[#A855F7] uppercase resize-none" placeholder={t.contact.formMessage + " *"}></textarea>
                  
                  <div className="pt-6 border-t border-white/5 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex flex-col space-y-4 flex-grow max-w-xl">
                      <div onClick={() => setIsAnonymous(!isAnonymous)} className={`flex items-center space-x-3 cursor-pointer self-start px-4 py-2.5 rounded-xl border transition-all ${isAnonymous ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${isAnonymous ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                          {isAnonymous && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase ${isAnonymous ? 'text-green-500' : 'text-gray-500'}`}>{lang === 'TR' ? 'KİMLİĞİ GİZLE' : 'HIDE IDENTITY'}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[12px] text-gray-400 font-medium italic leading-relaxed tracking-tight">* : {lang === 'TR' ? 'Mesajda zorunlu olarak doldurulması gereken kısımları ifade etmektedir.' : 'Indicates fields that must be filled out.'}</p>
                        <p className="text-[12px] text-gray-400 font-medium italic leading-relaxed tracking-tight">
                          {lang === 'TR' 
                            ? 'Dilerseniz anonim olarak da iletişim formunu doldurabilirsiniz fakat iletişim bırakmayacağınız için tarafınıza dönüş sağlanamayacaktır.' 
                            : 'You may fill out the contact form anonymously if you wish, but as you will not leave contact information, we will not be able to get back to you.'}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <button disabled={isSubmitting} className="w-full lg:w-auto px-12 py-4 bg-gradient-to-r from-[#A855F7] to-[#6A1BB1] text-white rounded-xl font-black text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (lang === 'TR' ? "GÖNDER" : "SEND")}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="flex-[3.5] flex flex-col">
            <div className="bg-[#1A0E2E]/80 border border-white/5 rounded-[2rem] p-8 flex-grow shadow-2xl">
              <h2 className="text-[11px] font-black text-white tracking-[0.2em] uppercase border-b border-[#6A1BB1]/40 pb-1.5 inline-block mb-8">{t.contact.ecosystemTitle}</h2>
              <div className="space-y-4">
                {ecosystemSubItems.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`relative block p-4 border border-white/5 rounded-xl transition-all ${item.isCurrent ? 'bg-[#A855F7]/10 border-[#A855F7]/30' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2"><span className={item.isCurrent ? 'text-[#A855F7]' : 'text-gray-600'}>{item.icon}</span><h4 className="font-black text-[10px] uppercase text-white">{item.title}</h4></div>
                      {!item.isCurrent && <ExternalLink size={10} className="text-gray-700" />}
                    </div>
                    <p className="text-[9px] text-gray-500 font-medium line-clamp-1">{item.desc}</p>
                  </a>
                ))}
                <div className="pt-8 mt-auto border-t border-white/5">
                  <div className="flex items-center space-x-3 mb-4"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-[9px] font-black text-green-500 uppercase">{lang === 'TR' ? 'CANLI SİSTEM' : 'LIVE SYSTEM'}</span></div>
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-4"><Clock size={20} className="text-green-500" /><div className="flex flex-col"><span className="text-xl font-mono font-black text-white tabular-nums">{formatSessionTime(sessionSeconds)}</span><span className="text-[7px] font-black text-gray-700 uppercase">{lang === 'TR' ? 'OTURUM SÜRESİ' : 'SESSION TIME'}</span></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-[#0B0614]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="space-y-8"><img src={LOGO_ACM_HACETTEPE} alt="ACM Logo" className="h-20 w-auto opacity-90" /><div><h3 className="text-white text-2xl font-black mb-4 uppercase tracking-tighter">Mor Geyik</h3><p className="text-gray-400 max-w-sm text-sm font-medium">{t.footer.description}</p></div></div>
            <div className="flex flex-col"><h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest relative">{t.footer.explore}<span className="absolute -bottom-2 left-0 w-8 h-1 bg-[#6A1BB1]"></span></h4><ul className="space-y-5 text-gray-400 font-bold text-sm"><li><a href="#program" onClick={(e) => scrollToSection(e, 'program')} className="hover:text-[#6A1BB1] uppercase tracking-widest">Program</a></li><li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[#6A1BB1] uppercase tracking-widest">{t.nav.about}</a></li><li><a href="#awards" onClick={(e) => scrollToSection(e, 'awards')} className="hover:text-[#6A1BB1] uppercase tracking-widest">{t.nav.awards}</a></li><li><a href="#events" onClick={(e) => scrollToSection(e, 'events')} className="hover:text-[#6A1BB1] uppercase tracking-widest">{t.nav.events}</a></li><li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#6A1BB1] uppercase tracking-widest">{t.nav.contact}</a></li></ul></div>
            <div className="flex flex-col"><h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest relative">STAY TUNED<span className="absolute -bottom-2 left-0 w-8 h-1 bg-[#6A1BB1]"></span></h4><div className="max-w-xs mb-8 font-medium text-xs text-gray-400 italic border-l-2 border-[#6A1BB1]/30 pl-4">{t.footer.arrangedBy}</div><div className="flex items-center space-x-6"><a href="https://instagram.com/acmhacettepe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#6A1BB1] transition-all"><Instagram size={28} /></a><a href="https://x.com/acmhacettepe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#6A1BB1] transition-all"><XLogo size={28} /></a><a href="https://linkedin.com/company/acmhacettepe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#6A1BB1] transition-all"><Linkedin size={28} /></a><a href="https://youtube.com/@acmhacettepe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#6A1BB1] transition-all"><Youtube size={28} /></a></div></div>
          </div>
          <div className="text-center pt-10 border-t border-white/5 text-gray-500 text-[11px] font-black tracking-widest uppercase flex items-center justify-center"><span className="cursor-pointer hover:text-[#A855F7] transition-all mr-1" onClick={() => setIsAdminAuthModalOpen(true)}>©</span><span> {new Date().getFullYear()} {t.footer.rights}</span></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
