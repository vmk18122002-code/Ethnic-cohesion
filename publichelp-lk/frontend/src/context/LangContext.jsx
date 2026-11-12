import { createContext, useContext, useEffect, useState } from 'react';

// Core interface strings in Sinhala, Tamil and English.
// NOTE: Sinhala/Tamil strings should be reviewed by native speakers before launch
// (proposal risk: "keep the same verified meaning across supported languages").
const STRINGS = {
  en: {
    tagline: 'Government services, made clear',
    heroTitle: 'Your passport, step by step.',
    heroSub: 'Ask in Sinhala, Tamil or English. Get the official steps, documents and fees — each with a source link and last-checked date.',
    newPassport: 'New passport', child: 'Child passport', lost: 'Lost passport', abroad: 'I am abroad',
    signIn: 'Sign in', signUp: 'Create account', getStarted: 'Get started', notClear: 'Not clear? Call 1962',
    askPlaceholder: 'e.g. I lost my passport while working in Dubai',
  },
  si: {
    tagline: 'රජයේ සේවා, පැහැදිලිව',
    heroTitle: 'ඔබේ ගමන් බලපත්‍රය, පියවරෙන් පියවර.',
    heroSub: 'සිංහලෙන්, දෙමළෙන් හෝ ඉංග්‍රීසියෙන් අසන්න. නිල පියවර, ලේඛන සහ ගාස්තු — නිල මූලාශ්‍ර සබැඳිය සමඟ.',
    newPassport: 'නව ගමන් බලපත්‍රය', child: 'ළමා ගමන් බලපත්‍රය', lost: 'නැතිවූ ගමන් බලපත්‍රය', abroad: 'මම විදේශයක සිටිමි',
    signIn: 'පිවිසෙන්න', signUp: 'ගිණුමක් සාදන්න', getStarted: 'ආරම්භ කරන්න', notClear: 'පැහැදිලි නැද්ද? 1962 අමතන්න',
    askPlaceholder: 'උදා: මගේ ගමන් බලපත්‍රය නැති වුණා',
  },
  ta: {
    tagline: 'அரச சேவைகள், தெளிவாக',
    heroTitle: 'உங்கள் கடவுச்சீட்டு, படிப்படியாக.',
    heroSub: 'சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் கேளுங்கள். அதிகாரபூர்வ படிகள், ஆவணங்கள், கட்டணங்கள் — மூல இணைப்புடன்.',
    newPassport: 'புதிய கடவுச்சீட்டு', child: 'குழந்தை கடவுச்சீட்டு', lost: 'தொலைந்த கடவுச்சீட்டு', abroad: 'நான் வெளிநாட்டில் இருக்கிறேன்',
    signIn: 'உள்நுழைக', signUp: 'கணக்கை உருவாக்கு', getStarted: 'தொடங்குங்கள்', notClear: 'தெளிவில்லையா? 1962 ஐ அழைக்கவும்',
    askPlaceholder: 'உ.தா: எனது கடவுச்சீட்டு தொலைந்துவிட்டது',
  },
};

export const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'si', label: 'සිංහල', short: 'සිං' },
  { code: 'ta', label: 'தமிழ்', short: 'த' },
];

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('phlk_lang') || 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    try { localStorage.setItem('phlk_lang', lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
