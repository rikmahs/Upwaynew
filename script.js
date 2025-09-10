// Main script: translations applied from translations.js, intl-tel-input init, tariff wiring, WA widget
(function(){
  function applyTranslations(lang){
    if(!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(window.TRANSLATIONS[lang][key]) el.textContent = window.TRANSLATIONS[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) el.placeholder = window.TRANSLATIONS[lang][key];
    });
    document.querySelectorAll('option[data-i18n-option]').forEach(opt=>{
      const k = opt.getAttribute('data-i18n-option');
      if(window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][k]) opt.textContent = window.TRANSLATIONS[lang][k];
    });
    document.documentElement.lang = lang;
    localStorage.setItem('upway_lang', lang);
  }

  function initLang(){
    const saved = localStorage.getItem('upway_lang') || (navigator.language.startsWith('ru')? 'ru' : (navigator.language.startsWith('az')? 'az' : 'en'));
    applyTranslations(saved);
    document.querySelectorAll('.lang .lang-btn').forEach(btn=> btn.addEventListener('click', ()=> applyTranslations(btn.getAttribute('data-lang'))));
  }

  function initTariffs(){
    document.querySelectorAll('.select-tariff').forEach(btn=> btn.addEventListener('click', ()=>{
      const code = btn.getAttribute('data-tariff');
      const select = document.getElementById('tariffSelect');
      if(select){
        for(let i=0;i<select.options.length;i++){ if(select.options[i].value === code){ select.selectedIndex = i; break; } }
        select.classList.add('highlight'); setTimeout(()=> select.classList.remove('highlight'),1200);
        const contact = document.getElementById('contact'); if(contact) contact.scrollIntoView({behavior:'smooth'});
      }
    }));
  }

  function initIntl(){
    const phone = document.getElementById('phone');
    if(phone && window.intlTelInput){ window.itiMain = window.intlTelInput(phone, {initialCountry:'auto', utilsScript:'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js'}); }
    const waPhone = document.getElementById('waPhone');
    if(waPhone && window.intlTelInput){ window.itiWA = window.intlTelInput(waPhone, {initialCountry:'auto', utilsScript:'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js'}); }
    const leadForm = document.getElementById('leadForm');
    if(leadForm){
      leadForm.addEventListener('submit', function(e){
        if(window.itiMain){ const num = window.itiMain.getNumber(); leadForm.querySelector('input[name="phone"]').value = num; }
      });
    }
    const waSend = document.getElementById('waSend');
    if(waSend){ waSend.addEventListener('click', ()=>{ const num = window.itiWA? window.itiWA.getNumber(): document.getElementById('waPhone').value; if(window.itiWA && !window.itiWA.isValidNumber()){ alert('Введите корректный номер'); return; } window.open('https://wa.me/'+num.replace('+',''),'_blank'); }); }
  }

  function initWA(){
    const open = document.getElementById('waOpen'), panel = document.getElementById('waPanel'), close = document.getElementById('waClose');
    if(open) open.addEventListener('click', ()=> panel.style.display = (panel.style.display === 'block' ? 'none' : 'block'));
    if(close) close.addEventListener('click', ()=> panel.style.display = 'none');
  }

  document.addEventListener('DOMContentLoaded', function(){
    initLang(); initTariffs(); initIntl(); initWA();
  });

  window.applyTranslations = applyTranslations;
})();