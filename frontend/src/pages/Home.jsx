import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '34653062465';
const EMAIL = 'adrians4.2983@gmail.com';

const content = {
  it: {
    heroTitle1: 'Trasforma il Tuo',
    heroTitle2: 'Corpo e la Vita',
    heroDesc: 'Programmi di allenamento e nutrizione personalizzati, monitoraggio avanzato dei progressi e supporto continuo dal tuo coach personale.',
    heroBtn1: 'Inizia il Tuo Percorso →',
    heroBtn2: 'Scopri di Più',
    stat1: 'Clienti Seguiti', stat2: 'Anni di Esperienza', stat3: 'Clienti Soddisfatti',
    navAbout: 'Chi Siamo', navServices: 'Servizi', navContact: 'Contatti', navLogin: 'Accedi',
    aboutBadge: 'Chi Siamo', aboutTitle: 'Il Metodo',
    aboutDesc: "Un approccio scientifico e personalizzato all'allenamento e alla nutrizione. Ogni programma è costruito sulla tua unicità biologica.",
    cards: [
      { title: 'Forza e Potenza', desc: 'Programmi di strength training basati su principi di periodizzazione avanzata.' },
      { title: 'Nutrizione Precisa', desc: 'Piani alimentari calcolati al grammo in base al tuo metabolismo e obiettivi.' },
      { title: 'Monitoraggio Totale', desc: 'Tracciamento quotidiano di peso, misure, foto progresso e parametri fisici.' },
    ],
    sciTitle: 'Approccio', sciWord: 'Scientifico',
    sciDesc: 'Il nostro metodo si basa su evidenze scientifiche aggiornate. Analizziamo la tua composizione corporea con metodi professionali come le Pliche secondo la formula Jackson-Pollock a 7 punti.',
    sciPoints: [
      'Analisi composizione corporea avanzata',
      "Periodizzazione dell'allenamento personalizzata",
      'Protocolli nutrizionali basati sulla scienza',
      'Monitoraggio ormonale e ciclo femminile',
      'Piano integratori personalizzato',
    ],
    servicesBadge: 'Cosa Offriamo', servicesTitle: 'I Nostri Servizi',
    services: [
      { img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80', title: 'Schede Allenamento', desc: 'Programmi settimanali personalizzati con esercizi, serie, ripetizioni e tecniche di intensità avanzate.' },
      { img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80', title: 'Piani Nutrizionali', desc: 'Diete bilanciate con database di 8000+ alimenti italiani, macro calcolati al grammo.' },
      { img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&q=80', title: 'Tracking Avanzato', desc: 'Monitoraggio quotidiano di peso, parametri fisici, umore, energia, stress e qualità del sonno.' },
      { img: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=500&q=80', title: 'Foto Progresso', desc: 'Confronta la tua evoluzione nel tempo con foto settimanali delle trasformazioni.' },
      { img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80', title: 'Integratori', desc: 'Protocollo integratori personalizzato con timing preciso, dosaggi e video posturali.' },
      { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80', title: 'Analytics', desc: 'Grafici e statistiche dettagliate per visualizzare ogni aspetto della tua trasformazione.' },
    ],
    ctaTitle: 'Pronto a Iniziare?', ctaDesc: 'Registrati ora e inizia la tua trasformazione oggi stesso.', ctaBtn: 'Crea il Tuo Account Gratuito →',
    footerDesc: 'Coaching personalizzato per trasformare il tuo corpo e raggiungere i tuoi obiettivi fitness.',
    footerNav: 'Navigazione', footerContact: 'Contatti', footerMap: 'Dove Siamo',
    footerLinks: [['Chi Siamo', '#about'], ['Servizi', '#services'], ['Accedi', '/login'], ['Registrati', '/register']],
    footerCopy: '© 2025 AM Culturismo. Tutti i diritti riservati.',
  },
  en: {
    heroTitle1: 'Transform Your', heroTitle2: 'Body and Life',
    heroDesc: 'Personalised training and nutrition programs, advanced progress tracking and continuous support from your personal coach.',
    heroBtn1: 'Start Your Journey →', heroBtn2: 'Learn More',
    stat1: 'Clients Coached', stat2: 'Years of Experience', stat3: 'Satisfied Clients',
    navAbout: 'About', navServices: 'Services', navContact: 'Contact', navLogin: 'Login',
    aboutBadge: 'About Us', aboutTitle: 'The',
    aboutDesc: 'A scientific and personalised approach to training and nutrition. Every program is built around your biological uniqueness.',
    cards: [
      { title: 'Strength & Power', desc: 'Strength training programs based on advanced periodisation principles.' },
      { title: 'Precise Nutrition', desc: 'Meal plans calculated to the gram based on your metabolism and goals.' },
      { title: 'Total Monitoring', desc: 'Daily tracking of weight, measurements, progress photos and physical parameters.' },
    ],
    sciTitle: 'Scientific', sciWord: 'Approach',
    sciDesc: 'Our method is based on up-to-date scientific evidence. We analyse your body composition using professional methods such as Skinfold calipers with the Jackson-Pollock 7-site formula.',
    sciPoints: [
      'Advanced body composition analysis',
      'Personalised training periodisation',
      'Science-based nutritional protocols',
      'Hormonal and female cycle monitoring',
      'Personalised supplement plan',
    ],
    servicesBadge: 'What We Offer', servicesTitle: 'Our Services',
    services: [
      { img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80', title: 'Workout Plans', desc: 'Personalised weekly programs with exercises, sets, reps and advanced intensity techniques.' },
      { img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80', title: 'Nutrition Plans', desc: 'Balanced diets with a database of 8000+ foods, macros calculated to the gram.' },
      { img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&q=80', title: 'Advanced Tracking', desc: 'Daily monitoring of weight, physical parameters, mood, energy, stress and sleep quality.' },
      { img: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=500&q=80', title: 'Progress Photos', desc: 'Compare your evolution over time with weekly transformation photos.' },
      { img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80', title: 'Supplements', desc: 'Personalised supplement protocol with precise timing, dosages and posture videos.' },
      { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80', title: 'Analytics', desc: 'Detailed charts and statistics to visualise every aspect of your transformation.' },
    ],
    ctaTitle: 'Ready to Start?', ctaDesc: 'Register now and begin your transformation today.', ctaBtn: 'Create Your Free Account →',
    footerDesc: 'Personalised coaching to transform your body and achieve your fitness goals.',
    footerNav: 'Navigation', footerContact: 'Contact', footerMap: 'Find Us',
    footerLinks: [['About', '#about'], ['Services', '#services'], ['Login', '/login'], ['Register', '/register']],
    footerCopy: '© 2025 AM Culturismo. All rights reserved.',
  },
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'it');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    const next = lang === 'it' ? 'en' : 'it';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const t = content[lang];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>

      {/* FLOATING WHATSAPP */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999, background: '#25D366', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.5)', textDecoration: 'none' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
          <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.65 4.73 1.79 6.71L2 30l7.53-1.75A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm7.18 19.64c-.3.84-1.75 1.61-2.4 1.71-.65.1-1.44.14-2.32-.15-.53-.17-1.22-.4-2.09-.78-3.68-1.59-6.08-5.3-6.27-5.55-.18-.25-1.5-2-.1-3.77.29-.36.66-.56 1-.56.12 0 .23.01.33.01.32.01.49.03.7.54.24.57.82 2 .89 2.14.07.14.12.31.02.5-.09.2-.14.32-.28.49-.14.17-.27.3-.39.43-.12.13-.25.27-.11.52.14.25.63 1.04 1.35 1.68.93.83 1.71 1.09 1.96 1.21.25.12.4.1.55-.06.15-.16.63-.73.8-.98.17-.25.33-.21.55-.13.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.24 1.42z" />
        </svg>
      </a>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 5%',
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(139,69,19,0.3)' : 'none',
        transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#8B4513,#D2691E)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff' }}>AM</div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>AM <span style={{ color: '#D2691E' }}>CULTURISMO</span></span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[[t.navAbout, '#about'], [t.navServices, '#services'], [t.navContact, '#contact']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#ddd', textDecoration: 'none', fontSize: 14 }}
              onMouseOver={e => e.target.style.color = '#D2691E'}
              onMouseOut={e => e.target.style.color = '#ddd'}>{label}</a>
          ))}
          <button onClick={toggleLang} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            {lang === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
          </button>
          <Link to="/login" style={{ padding: '9px 24px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            {t.navLogin}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 5%', paddingTop: 70, position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>

        {/* ── SINGLE GROUP BODYBUILDERS BACKGROUND IMAGE ── */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1567598508481-65985588e295?w=1920&q=90"
            alt="bodybuilders"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              filter: 'grayscale(30%)',
            }}
          />
        </div>

        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)' }} />

        {/* Bottom fade to black */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top,#0a0a0a,transparent)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
            {t.heroTitle1}<br />
            <span style={{ background: 'linear-gradient(135deg,#D2691E,#FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t.heroTitle2}
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#bbb', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px' }}>
            {t.heroDesc}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
            <Link to="/register" style={{ padding: '16px 44px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 16, fontWeight: 700, boxShadow: '0 8px 30px rgba(210,105,30,0.4)' }}>
              {t.heroBtn1}
            </Link>
            <a href="#about" style={{ padding: '16px 44px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 16, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(4px)' }}>
              {t.heroBtn2}
            </a>
          </div>
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['500+', t.stat1], ['8+', t.stat2], ['98%', t.stat3]].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#D2691E' }}>{n}</div>
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 5%', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ color: '#D2691E', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>{t.aboutBadge}</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: 20 }}>
              {t.aboutTitle} <span style={{ color: '#D2691E' }}>AM Culturismo</span>
            </h2>
            <p style={{ color: '#888', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>{t.aboutDesc}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 64 }}>
            {[
              { img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', ...t.cards[0] },
              { img: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80', ...t.cards[1] },
              { img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', ...t.cards[2] },
            ].map(({ img, title, desc }) => (
              <div key={title} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(210,105,30,0.15)', background: '#1a1a1a', transition: 'transform .3s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                  <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', background: 'rgba(139,69,19,0.05)', border: '1px solid rgba(139,69,19,0.15)', borderRadius: 24, padding: 48 }}>
            <div>
              <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
                {t.sciTitle} <span style={{ color: '#D2691E' }}>{t.sciWord}</span>
              </h3>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 24 }}>{t.sciDesc}</p>
              {t.sciPoints.map(item => (
                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(210,105,30,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D2691E' }} />
                  </div>
                  <span style={{ color: '#ccc', fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80'].map((img, i) => (
                <img key={i} src={img} alt="fitness" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 12 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 5%', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ color: '#D2691E', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>{t.servicesBadge}</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800 }}>{t.servicesTitle}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            {t.services.map(({ img, title, desc }) => (
              <div key={title} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', transition: 'all .3s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(210,105,30,0.5)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top,#141414,transparent)' }} />
                </div>
                <div style={{ padding: '20px 24px 28px' }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                  <p style={{ color: '#777', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 5%', textAlign: 'center', background: 'linear-gradient(135deg,rgba(139,69,19,0.2),rgba(210,105,30,0.1))', borderTop: '1px solid rgba(210,105,30,0.2)', borderBottom: '1px solid rgba(210,105,30,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, marginBottom: 20 }}>{t.ctaTitle}</h2>
        <p style={{ color: '#888', marginBottom: 36, fontSize: 18 }}>{t.ctaDesc}</p>
        <Link to="/register" style={{ display: 'inline-block', padding: '18px 50px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 17, fontWeight: 700, boxShadow: '0 8px 30px rgba(210,105,30,0.4)' }}>
          {t.ctaBtn}
        </Link>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ background: '#050505', padding: '64px 5% 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#8B4513,#D2691E)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>AM</div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>AM CULTURISMO</span>
              </div>
              <p style={{ color: '#555', fontSize: 13, lineHeight: 1.8 }}>{t.footerDesc}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1, color: '#D2691E' }}>{t.footerNav}</h4>
              {t.footerLinks.map(([label, href]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  {href.startsWith('#')
                    ? <a href={href} style={{ color: '#666', textDecoration: 'none', fontSize: 14 }}>{label}</a>
                    : <Link to={href} style={{ color: '#666', textDecoration: 'none', fontSize: 14 }}>{label}</Link>}
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1, color: '#D2691E' }}>{t.footerContact}</h4>
              <a href={`mailto:${EMAIL}`} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none', color: '#666' }}>
                <div style={{ width: 36, height: 36, background: 'rgba(210,105,30,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
                <span style={{ fontSize: 13 }}>{EMAIL}</span>
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#666' }}>
                <div style={{ width: 36, height: 36, background: 'rgba(37,211,102,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="#25D366">
                    <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.65 4.73 1.79 6.71L2 30l7.53-1.75A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm7.18 19.64c-.3.84-1.75 1.61-2.4 1.71-.65.1-1.44.14-2.32-.15-.53-.17-1.22-.4-2.09-.78-3.68-1.59-6.08-5.3-6.27-5.55-.18-.25-1.5-2-.1-3.77.29-.36.66-.56 1-.56.12 0 .23.01.33.01.32.01.49.03.7.54.24.57.82 2 .89 2.14.07.14.12.31.02.5-.09.2-.14.32-.28.49-.14.17-.27.3-.39.43-.12.13-.25.27-.11.52.14.25.63 1.04 1.35 1.68.93.83 1.71 1.09 1.96 1.21.25.12.4.1.55-.06.15-.16.63-.73.8-.98.17-.25.33-.21.55-.13.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.24 1.42z" />
                  </svg>
                </div>
                <span style={{ fontSize: 13 }}>+{WHATSAPP_NUMBER}</span>
              </a>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1, color: '#D2691E' }}>{t.footerMap}</h4>
              <div style={{ borderRadius: 12, overflow: 'hidden', height: 160, border: '1px solid rgba(255,255,255,0.08)' }}>
                <iframe title="location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1617955248084!5m2!1sen!2s"
                  width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy" />
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ color: '#333', fontSize: 13 }}>{t.footerCopy}</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <button onClick={toggleLang} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#555', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                {lang === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
              </button>
              <a href={`mailto:${EMAIL}`} style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>Email</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}