import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Nav
    login: 'Login', register: 'Register', logout: 'Logout',
    // Dashboard tabs
    profile: 'Profile', dailyLog: 'Daily Log', measurements: 'Measurements',
    bodyFat: 'Body Fat', photos: 'Progress Photos', plan: 'My Plan',
    nutrition: 'Nutrition', workout: 'Workout', supplements: 'Supplements',
    // Forms
    save: 'Save', cancel: 'Cancel', submit: 'Submit', loading: 'Loading...',
    // Daily log
    weight: 'Weight (kg)', heartRate: 'Resting Heart Rate', mood: 'Mood',
    stress: 'Stress', energy: 'Energy', sleepQuality: 'Sleep Quality', hunger: 'Hunger',
    notes: 'Notes', date: 'Date',
    // Profile
    firstName: 'First Name', lastName: 'Last Name', email: 'Email',
    phone: 'Phone', address: 'Address', city: 'City', gender: 'Gender',
    birthDate: 'Date of Birth', height: 'Height (cm)',
    // Measurements
    chest: 'Chest', leftArm: 'Left Arm', rightArm: 'Right Arm',
    waist: 'Waist', leftThigh: 'Left Thigh', rightThigh: 'Right Thigh', total: 'Total',
    weekNumber: 'Week Number',
    // Pliche
    male: 'Male', female: 'Female', age: 'Age', bodyFatPct: 'Body Fat %',
    // Success/Error
    saved: 'Saved successfully!', error: 'Something went wrong.',
  },
  it: {
    // Nav
    login: 'Accedi', register: 'Registrati', logout: 'Esci',
    // Dashboard tabs
    profile: 'Profilo', dailyLog: 'Diario', measurements: 'Misure',
    bodyFat: 'Pliche', photos: 'Foto Progresso', plan: 'Il Mio Piano',
    nutrition: 'Nutrizione', workout: 'Allenamento', supplements: 'Integratori',
    // Forms
    save: 'Salva', cancel: 'Annulla', submit: 'Invia', loading: 'Caricamento...',
    // Daily log
    weight: 'Peso (kg)', heartRate: 'FC a Riposo', mood: 'Umore',
    stress: 'Stress', energy: 'Energia', sleepQuality: 'Qualità Sonno', hunger: 'Fame',
    notes: 'Note', date: 'Data',
    // Profile
    firstName: 'Nome', lastName: 'Cognome', email: 'Email',
    phone: 'Telefono', address: 'Indirizzo', city: 'Città', gender: 'Sesso',
    birthDate: 'Data di Nascita', height: 'Altezza (cm)',
    // Measurements
    chest: 'Petto', leftArm: 'Braccio Sinistro', rightArm: 'Braccio Destro',
    waist: 'Vita', leftThigh: 'Coscia Sinistra', rightThigh: 'Coscia Destra', total: 'Totale',
    weekNumber: 'Numero Settimana',
    // Pliche
    male: 'Maschio', female: 'Femmina', age: 'Età', bodyFatPct: '% Grasso Corporeo',
    // Success/Error
    saved: 'Salvato con successo!', error: 'Qualcosa è andato storto.',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'it');

  const toggleLang = () => {
    const next = lang === 'it' ? 'en' : 'it';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
