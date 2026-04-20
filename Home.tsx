
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Globe, Instagram, Linkedin, Youtube, 
  User, ExternalLink, Send, MapPin, ChevronRight, CheckCircle2, Sparkles,
  Gamepad2, Trophy, Code, Zap, MessageSquare, Loader2, Calendar, Music, Brain, Smile, Flame, Mic, Target, Star, Play, Clapperboard, Award, ShieldCheck, Users, Clock, AlertCircle,
  Box, Activity, Radio, Lock, Download, Eye, Trash2, Search, Filter, Mail, Phone, Medal, Maximize2, Navigation, CalendarPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Language, EventData, OrganizerData, VlogData } from './types';
import { translations } from './translations';
import { 
  addDoc, 
  collection 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// --- DATA ---
const UPCOMING_EVENTS = [
  {
    date: "27 NİSAN 2026",
    time: "18.00",
    location: { TR: "Tunçalp Özgen KM", EN: "Tunçalp Özgen KM" },
    title: { TR: "Söyleşi & Etkinlik", EN: "Talk & Event" },
    guests: "Hayko Cepkin & Pelin Akil",
    imageUrl: "/assets/come/hayko-pelin.jpg",
    imagePosition: "object-top",
    description: {
      TR: "Efsanevi sanatçı Hayko Cepkin ve başarılı oyuncu Pelin Akil’in katılımıyla gerçekleşecek bu özel söyleşide sanat, kariyer ve ilham dolu bir akşam sizi bekliyor.",
      EN: "An evening full of art, career, and inspiration awaits you in this special talk featuring legendary artist Hayko Cepkin and successful actress Pelin Akil."
    },
    mapLink: "https://www.google.com/maps/search/Hacettepe+Üniversitesi+Tunçalp+Özgen+Kültür+ve+Kongre+Merkezi",
    calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mor+Geyik+-+Hayko+Cepkin+&+Pelin+Akil+(ACM+Hacettepe)&dates=20260427T150000Z/20260427T170000Z&details=Sanat,+kariyer+ve+ilham+dolu+söyleşi.+-+ACM+Hacettepe&location=Tunçalp+Özgen+Kültür+ve+Kongre+Merkezi,+Hacettepe+Üniversitesi",
    icon: <Users size={24} />
  },
  {
    date: "28 NİSAN 2026",
    time: "14.00",
    location: { TR: "Mehmet Akif Ersoy Salonu", EN: "Mehmet Akif Ersoy Hall" },
    title: { TR: "Müzik & Söyleşi", EN: "Music & Talk" },
    guests: "Madrigal",
    imageUrl: "/assets/come/madrigal.jpg",
    imagePosition: "object-top",
    description: {
      TR: "Madrigal grubunun katılımıyla müzik dünyasına ve grup dinamiğine dair samimi bir sohbet programı düzenlenecektir.",
      EN: "A sincere talk program on the music world and band dynamics will be held with the participation of the Madrigal group."
    },
    mapLink: "https://www.google.com/maps/search/Hacettepe+Üniversitesi+Mehmet+Akif+Ersoy+Salonu",
    calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mor+Geyik+-+Madrigal+Söyleşisi+(ACM+Hacettepe)&dates=20260428T110000Z/20260428T130000Z&details=Müzik+dünyasına+ve+grup+dinamiğine+dair+samimi+bir+sohbet.+-+ACM+Hacettepe&location=Mehmet+Akif+Ersoy+Salonu,+Hacettepe+Üniversitesi",
    icon: <Music size={24} />
  }
];

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
    imagePosition: "object-center",
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
      TR: "Gözlem yeteneğini mizahla harmanlayan, modern hayatın absürt detaylarını sahneye taşıyan bir performance sanatı söyleşisi.", 
      EN: "A talk on performance art that blends observation skills with humor, bringing the absurd details of modern life to the stage." 
    },
    industry: { TR: "MEDYA & PERFORMANS", EN: "MEDIA & PERFORMANCE" },
    highlights: [
      { label: { TR: "MODERN MİZAH", EN: "MODERN HUMOR" }, iconType: 'smile' },
      { label: { TR: "SAHNE SANATLARI", EN: "STAGE ARTS" }, iconType: 'mic' }
    ],
    bio: {
      TR: "Sergen Deveci, Mor Geyik sahnesine sadece kahkaha değil, aynı zamanda hayatın içinden keskin gözlemler ve sanatsal bir derinlik getirdi. Oyunculuk careerindeki dönüm noktalarını, dijital içerik üretimindeki yaratıcı süreci ve stand-up sahnesinin adrenalinini anlattığı bu oturumda, mizahın bir iletişim aracı olarak gücünü vurguladı.",
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
    imagePosition: "object-center",
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

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsw-3ihj0JJb9IG0olWnjXUUCqryN9gwy8Zv5LW-1n1g7uVdo0yHwDY1WMRm8NTq_V/exec";
const LOGO_MOR_GEYIK = "/assets/logo/morgeyiklogo.png";
const LOGO_ACM_HACETTEPE = "/assets/logo/acmhacettepelogo.png";

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

// --- COMPONENT ---
const Home: React.FC<{ 
  lang: Language; 
  setLang: (l: Language) => void;
  selectedGuest: EventData | null;
  setSelectedGuest: (g: EventData | null) => void;
  isAwardLightboxOpen: boolean;
  setIsAwardLightboxOpen: (o: boolean) => void;
  setIsAdminAuthModalOpen: (o: boolean) => void;
  db: any;
}> = ({ lang, setLang, setSelectedGuest, setIsAwardLightboxOpen, setIsAdminAuthModalOpen, db }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAwardSlide, setCurrentAwardSlide] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: '', message: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const t = translations[lang];
  const awardImages = ["https://acsdays.com/web/morgeyik/recent/awards-1.jpg", "https://acsdays.com/web/morgeyik/recent/awards-2.jpg"];
  const navigate = useNavigate();

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnonymous) {
      if (formData.name.trim().length < 3) return alert(lang === 'TR' ? "Lütfen geçerli bir isim giriniz." : "Please enter a valid name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return alert(lang === 'TR' ? "Geçerli bir e-posta adresi giriniz." : "Enter a valid email address.");
    }
    if (formData.message.length < 5) return alert(lang === 'TR' ? "Mesaj çok kısa." : "Message too short.");
    if (!formData.category) return alert(lang === 'TR' ? "Lütfen bir kategori seçiniz." : "Please select a category.");

    const payload = { 
      ...formData, 
      name: isAnonymous ? (lang === 'TR' ? "Anonim" : "Anonymous") : formData.name, 
      email: isAnonymous ? (lang === 'TR' ? "Anonim" : "Anonymous") : formData.email,
      phone: isAnonymous ? (lang === 'TR' ? "Anonim" : "Anonymous") : formData.phone,
      isAnonymous, 
      timestamp: new Date().toLocaleString('tr-TR'), 
      id: Date.now() 
    };
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "MORGEYIK_Web"), payload);
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

      <nav className="fixed top-0 left-0 w-full z-[100] h-24 lg:h-36 backdrop-blur-xl bg-black/20 border-b border-white/5 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between h-full">
          <img src={LOGO_MOR_GEYIK} alt="Logo" className="h-28 lg:h-40 w-auto object-contain hover:opacity-80 transition-all cursor-pointer" onClick={() => navigate('/')} />
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
          <h1 className="text-5xl lg:text-[7rem] font-black text-white mb-6 tracking-tighter uppercase leading-none">{t.hero.title}</h1>
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-400 mb-10 max-w-3xl mx-auto uppercase tracking-[0.3em]">{t.hero.subtitle}</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">{t.hero.description}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#events" onClick={(e) => scrollToSection(e, 'events')} className="px-10 py-5 bg-[#6A1BB1] hover:bg-[#3A0E6A] text-white rounded-2xl font-black transition-all uppercase tracking-widest text-sm shadow-xl">{lang === 'TR' ? 'ETKİNLİKLER' : 'EVENTS'}</a>
            <a href="#vlogs" onClick={(e) => scrollToSection(e, 'vlogs')} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black transition-all uppercase tracking-widest text-sm hover:border-[#6A1BB1]">{lang === 'TR' ? 'VLOGLAR' : 'VLOGS'}</a>
          </div>
        </div>
      </header>

      <section className="py-24 lg:py-40 px-6 relative z-10 overflow-hidden bg-[#0F081D]/30">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#A855F7]"></span></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D8B4FE]">{t.upcoming.badge}</span>
            </div>
            <h2 className="text-5xl lg:text-[5rem] font-black text-white tracking-tighter uppercase mb-6">{t.upcoming.title}</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
            {UPCOMING_EVENTS.map((event, idx) => (
              <div key={idx} className="group relative">
                <div className="relative bg-[#1A0E2E]/80 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 flex flex-col h-full shadow-2xl">
                  <div className="relative aspect-[4/5] sm:aspect-video lg:h-[320px] overflow-hidden">
                    <img src={event.imageUrl} className={`w-full h-full object-cover ${event.imagePosition || 'object-center'} group-hover:scale-110 transition-all duration-1000`} alt={event.guests} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E2E] via-transparent to-black/30"></div>
                  </div>
                    <div className="p-6 lg:p-10 flex flex-col flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Calendar size={12} className="text-[#A855F7]" />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Clock size={12} className="text-[#A855F7]" />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{event.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                          <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#6A1BB1]/50 hover:bg-[#6A1BB1]/20 transition-all hover:scale-110" title={lang === 'TR' ? "Yol Tarifi Al" : "Get Directions"}>
                            <Navigation size={14} />
                          </a>
                          <a href={event.calendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#6A1BB1]/50 hover:bg-[#6A1BB1]/20 transition-all hover:scale-110" title={lang === 'TR' ? "Takvime Ekle" : "Add to Calendar"}>
                            <CalendarPlus size={14} />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-5">
                        <div className="w-8 h-8 bg-[#6A1BB1]/20 rounded-lg flex items-center justify-center text-[#A855F7]">
                           {React.cloneElement(event.icon as React.ReactElement, { size: 18 })}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-[9px] font-black text-[#A855F7] uppercase tracking-[0.3em]">{event.title[lang]}</div>
                          <div className="flex items-center space-x-1 text-gray-400 mt-0.5">
                            <MapPin size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{event.location[lang]}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-2xl lg:text-4xl font-black text-white mb-5 uppercase tracking-tighter leading-none">{event.guests}</h3>
                      <p className="text-gray-400 text-base leading-relaxed mb-8 flex-grow font-medium">{event.description[lang]}</p>
                      
                      <button onClick={() => navigate('/forms')} className="w-full bg-[#6A1BB1]/20 hover:bg-[#6A1BB1] border border-[#6A1BB1]/30 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 group/btn">
                        <ExternalLink size={12} className="group-hover/btn:scale-110 transition-transform" />
                        <span>{t.upcoming.externalApply}</span>
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <div className="inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-8 py-5 rounded-3xl max-w-3xl text-center backdrop-blur-md shadow-2xl">
              <Activity size={18} className="text-[#A855F7] animate-pulse" />
              <p className="text-gray-200 text-sm md:text-base font-bold tracking-tight">{t.upcoming.studentNotice}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-40 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div><h2 className="text-3xl lg:text-5xl font-black text-white mb-12 uppercase">{t.about.title}</h2><p className="text-gray-400 text-xl leading-relaxed font-medium">{t.about.content}</p></div>
          <div className="relative aspect-video bg-[#3A0E6A]/20 rounded-[3rem] border border-[#6A1BB1]/20 overflow-hidden shadow-2xl">
            {SLIDE_IMAGES.map((slide, idx) => (
              <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
                <img src={slide.url} alt={slide.label} className="w-full h-full object-cover opacity-60" /><div className="absolute bottom-10 left-10 text-white"><div className="text-xs font-bold tracking-[0.5em] opacity-60 uppercase">{slide.label}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="awards" className="relative py-24 lg:py-48 overflow-hidden flex justify-center">
        <div className="container max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-10 lg:gap-24">
            <div className="flex flex-col justify-between order-1 py-2 lg:py-4 space-y-10">
              <div className="space-y-6 lg:space-y-10"><h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] block">{t.awards.title}</h2></div>
              <div className="relative pl-8 lg:pl-12 border-l-[4px] border-[#EAB308]"><p className="text-base md:text-xl text-gray-100 italic leading-relaxed tracking-tight transition-all">{t.awards.description}</p></div>
            </div>
            <div onClick={() => setIsAwardLightboxOpen(true)} className="relative group order-2 w-full max-w-[420px] aspect-[3/4] bg-[#120B20] border-2 border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl cursor-pointer self-center lg:self-end">
               {awardImages.map((img, idx) => (<img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentAwardSlide === idx ? 'opacity-100' : 'opacity-0'}`} />))}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-[#6A1BB1]/10"><Maximize2 size={32} className="text-white" /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="py-40 px-6 bg-black/10">
        <div className="container mx-auto">
          <h2 className="text-center text-4xl lg:text-6xl font-black text-white uppercase mb-24">{t.pastEvents.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PAST_EVENTS.map((event, idx) => (
              <div key={idx} onClick={() => setSelectedGuest(event)} className="group bg-[#120B20] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:-translate-y-4 cursor-pointer relative">
                <div className="aspect-[4/3] overflow-hidden"><img src={event.imageUrl} className={`w-full h-full object-cover ${event.imagePosition || 'object-top'} opacity-70 group-hover:opacity-100 transition-all duration-700`} alt={event.guest} /></div>
                <div className="p-10 relative">
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#6A1BB1] text-white text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest">{event.year}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#6A1BB1] transition-colors">{event.guest}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{event.description[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vlogs" className="py-40 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl lg:text-7xl font-black text-white uppercase mb-24">{t.vlogs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {VLOGS.map((vlog) => (
              <a key={vlog.id} href={`https://www.youtube.com/watch?v=${vlog.id}`} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 group-hover:border-[#6A1BB1] transition-all relative">
                  <img src={`https://img.youtube.com/vi/${vlog.id}/maxresdefault.jpg`} className="w-full h-full object-cover group-hover:scale-105 transition-all" alt={vlog.title[lang]} />
                  <div className="absolute inset-0 flex items-center justify-center"><Play size={40} className="text-white opacity-0 group-hover:opacity-100 transition-all" /></div>
                </div>
                <h3 className="mt-8 text-xl font-black text-white group-hover:text-[#A855F7] transition-all text-left uppercase">{vlog.title[lang]}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-40 px-6 bg-[#0B0614]">
        <div className="container mx-auto flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          <div className="flex-[6.5] flex flex-col">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase border-l-[6px] border-[#6A1BB1] pl-6 mb-8">{t.contact.title}</h2>
            <div className="bg-[#1A0E2E]/80 border border-white/5 rounded-[2rem] p-8 flex-grow">
              {isSent ? (<div className="flex-grow flex flex-col items-center justify-center p-16 text-green-500 font-black"><CheckCircle2 size={48} className="mb-4" />{lang === 'TR' ? 'MESAJINIZ İLETİLDİ!' : 'MESSAGE SENT!'}</div>) : (
                <form className="space-y-5" onSubmit={handleFormSubmit}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <input required={!isAnonymous} value={isAnonymous ? (lang === 'TR' ? "Anonim" : "Anonymous") : formData.name} disabled={isAnonymous} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#A855F7]" placeholder={t.contact.formName} />
                    <input required={!isAnonymous} value={isAnonymous ? (lang === 'TR' ? "Anonim" : "Anonymous") : formData.email} disabled={isAnonymous} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#A855F7]" placeholder={t.contact.formEmail} />
                    <input value={isAnonymous ? (lang === 'TR' ? "Anonim" : "Anonymous") : formData.phone} disabled={isAnonymous} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full md:col-span-2 p-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#A855F7]" placeholder={lang === 'TR' ? 'Telefon Numaranız (İsteğe Bağlı)' : 'Phone Number (Optional)'} />
                  </div>
                  <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#A855F7]">
                    <option value="">{lang === 'TR' ? 'BİR KONU SEÇİN...' : 'SELECT CATEGORY...'}</option>
                    {["Genel", "Konuk", "Sponsor", "Katılımcı", "Geri Bildirim", "İstek / Şikayet", "Diğer"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#A855F7] resize-none" placeholder={t.contact.formMessage}></textarea>
                  <div className="flex items-center justify-between pt-4">
                     <button type="button" onClick={() => setIsAnonymous(!isAnonymous)} className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all border ${isAnonymous ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#D8B4FE]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                       <div className={`w-5 h-5 rounded flex items-center justify-center border ${isAnonymous ? 'border-[#A855F7] bg-[#A855F7]' : 'border-gray-500'}`}>{isAnonymous && <CheckCircle2 size={12} className="text-white" />}</div>
                       <span className="text-[10px] font-black uppercase tracking-widest">{isAnonymous ? (lang === 'TR' ? 'ANONİM MOD AKTİF' : 'ANONYMOUS ACTIVE') : (lang === 'TR' ? 'ANONİM GÖNDER' : 'SEND ANONYMOUSLY')}</span>
                     </button>
                     <button disabled={isSubmitting} type="submit" className="px-12 py-4 bg-[#6A1BB1] text-white rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50 flex items-center space-x-2">
                       {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                       <span>{lang === 'TR' ? 'GÖNDER' : 'SEND'}</span>
                     </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="flex-[3.5] flex flex-col pt-24 lg:pt-0">
             <div className="bg-[#1A0E2E]/80 border border-white/5 rounded-[2rem] p-8 flex-grow">
               <h2 className="text-xl font-black text-white mb-8 border-b border-[#6A1BB1]/40 pb-2 uppercase tracking-tighter">{t.contact.ecosystemTitle}</h2>
               <div className="space-y-4">
                  {ecosystemSubItems.map((item, i) => (
                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`block p-4 rounded-xl border border-white/5 transition-all ${item.isCurrent ? 'bg-[#A855F7]/10 border-[#A855F7]/30' : 'hover:bg-white/5'}`}>
                      <div className="flex items-center justify-between"><h4 className="font-black text-xs text-white">{item.title}</h4>{!item.isCurrent && <ExternalLink size={12} className="text-gray-500" />}</div>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">{item.desc}</p>
                    </a>
                  ))}
               </div>
               <div className="mt-12 bg-black/30 p-6 rounded-2xl border border-white/5">
                  <span className="text-[8px] font-black text-gray-600 block mb-2 uppercase tracking-widest">{lang === 'TR' ? 'OTURUM SÜRESİ' : 'SESSION TIME'}</span>
                  <span className="text-2xl font-mono text-white tracking-widest">{formatSessionTime(sessionSeconds)}</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="pt-24 pb-12 px-6 border-t border-white/5 mt-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="space-y-8"><img src={LOGO_ACM_HACETTEPE} alt="ACM Logo" className="h-20" /><div><h3 className="text-white text-2xl font-black mb-4 uppercase">Mor Geyik</h3><p className="text-gray-400 text-sm">{t.footer.description}</p></div></div>
            <div className="flex flex-col"><h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">{t.footer.explore}</h4><ul className="space-y-4 text-gray-400 text-sm font-bold uppercase tracking-widest"><li><a href="#program" className="hover:text-[#6A1BB1]">Program</a></li><li><a href="#events" className="hover:text-[#6A1BB1]">{t.nav.events}</a></li></ul></div>
            <div className="flex flex-col"><h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">STAY TUNED</h4><div className="flex space-x-6"><a href="https://instagram.com/acmhacettepe" className="text-gray-400 hover:text-white"><Instagram size={28} /></a><a href="https://linkedin.com/company/acmhacettepe" className="text-gray-400 hover:text-white"><Linkedin size={28} /></a></div></div>
          </div>
          <div className="text-center pt-10 border-t border-white/5 text-gray-600 text-[10px] font-black uppercase tracking-widest">
            <span className="cursor-pointer" onClick={() => setIsAdminAuthModalOpen(true)}>©</span> {new Date().getFullYear()} {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
