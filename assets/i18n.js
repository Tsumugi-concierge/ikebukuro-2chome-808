/* Lightweight i18n helper that:
 * - Persists selected language in localStorage (key: felizStayLang)
 * - Sets a language CSS class on <html> to toggle .lang-xx blocks
 * - Injects a language switcher if the page does not already have one
 * - Bridges to page-specific translators if present (applyTranslations / setLang variants)
 * - Initializes from saved lang or browser preference; default = en
 */
(function(){
  const SUPPORTED = ['en','ja','zh','ko','fr','es'];
  const STORAGE_KEY = 'felizStayLang';

  function getSaved(){ try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } }
  function save(lang){ try { localStorage.setItem(STORAGE_KEY, lang); } catch {} }

  function detect(){
    const saved = getSaved();
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const base = nav.split('-')[0];
    if (SUPPORTED.includes(base)) return base;
    return 'en';
  }

  function setHtmlLangClass(lang){
    const html = document.documentElement;
    SUPPORTED.forEach(l => html.classList.remove('show-'+l));
    html.classList.add('show-'+lang);
    html.setAttribute('lang', lang);
  }

  function findExistingLangBar(){
    // Prefer a page-provided .lang-bar, else our injected .i18n-lang-bar
    return document.querySelector('.lang-bar') || document.querySelector('.i18n-lang-bar');
  }

  function labelFor(lang){
    switch(lang){
      case 'en': return 'EN';
      case 'ja': return '日本語';
      case 'zh': return '中文';
      case 'ko': return '한국어';
      case 'fr': return 'Français';
      case 'es': return 'Español';
      default: return lang.toUpperCase();
    }
  }

  function ensureSwitcher(initial){
    let bar = findExistingLangBar();
    if (!bar){
      // Inject near the very top of the main content (or body as fallback)
      bar = document.createElement('div');
      bar.className = 'i18n-lang-bar';
      const parent = document.querySelector('main') || document.body;
      parent.insertBefore(bar, parent.firstChild);
      SUPPORTED.forEach(l => {
        const b = document.createElement('button');
        b.className = 'i18n-lang-btn';
        b.setAttribute('data-lang', l);
        b.textContent = labelFor(l);
        b.addEventListener('click', () => setLanguage(l));
        bar.appendChild(b);
      });
    } else {
      // Wire existing buttons to our setLanguage
      const btns = bar.querySelectorAll('button');
      btns.forEach(b => {
        const l = (b.getAttribute('data-lang') || (b.textContent||'').trim().toLowerCase().slice(0,2));
        if (SUPPORTED.includes(l)) b.addEventListener('click', () => setLanguage(l));
      });
    }
    highlightActive(initial);
  }

  function highlightActive(lang){
    const bar = findExistingLangBar(); if (!bar) return;
    bar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    const match = Array.from(bar.querySelectorAll('button')).find(b => {
      const l = b.getAttribute('data-lang') || (b.textContent||'').toLowerCase();
      return l.includes(lang);
    });
    if (match) match.classList.add('active');
  }

  function bridgePageTranslators(lang){
    // If a page exposes applyTranslations(lang), prefer that
    if (typeof window.applyTranslations === 'function') {
      try { window.applyTranslations(lang); } catch {}
    }
    // Else if it exposes a setLang(lang, btn), call it with a matching button if found
    else if (typeof window.setLang === 'function') {
      const bar = findExistingLangBar();
      const btn = bar ? Array.from(bar.querySelectorAll('button')).find(b => (b.getAttribute('data-lang')||'').includes(lang) || (b.textContent||'').toLowerCase().includes(lang)) : null;
      try { window.setLang(lang, btn || document.createElement('button')); } catch {}
    }

    // Special: homepage chat assistant (LANG_DATA + currentLang)
    if (window.LANG_DATA) {
      const t = window.LANG_DATA[lang];
      if (t) {
        const st = document.getElementById('statusText');
        if (st) st.textContent = t.status;
        const inp = document.getElementById('chatInput');
        if (inp && t.placeholder) inp.placeholder = t.placeholder;
        // Quick chips
        const chips = document.querySelectorAll('#quickChips .chip');
        chips.forEach(c => {
          const key = c.getAttribute('data-chip');
          if (key && t[key]) c.textContent = (c.textContent.match(/^.\s/)||'') + t[key].replace(/^.\s*/, '');
        });
        // Toast copy message handled when triggered; nothing to pre-update
      }
      try { window.currentLang = lang; } catch {}
    }
  }

  function setLanguage(lang){
    if (!SUPPORTED.includes(lang)) lang = 'en';
    save(lang);
    setHtmlLangClass(lang);
    highlightActive(lang);
    bridgePageTranslators(lang);
    // Fire a custom event for any page-specific listeners
    try { window.dispatchEvent(new CustomEvent('felizLangChanged', { detail: { lang } })); } catch {}
  }

  // Boot
  document.addEventListener('DOMContentLoaded', function(){
    const initial = detect();
    ensureSwitcher(initial);
    setLanguage(initial);
  });

  // Expose for inline handlers if needed
  window.__felizSetLanguage = setLanguage;
})();
