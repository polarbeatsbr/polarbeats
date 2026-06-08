// POLAR BEATS — PREMIUM SCRIPTS & INTERACTION SYSTEM

// Enable reveal animations (progressive enhancement — content visible by default if JS fails)
document.documentElement.classList.add('js-ready');

// 1. Navigation & Mobile Drawer
window.addEventListener('scroll', () => {
  const navFix = document.querySelector('.nav-fix');
  if (navFix) {
    navFix.classList.toggle('scrolled', window.scrollY > 30);
  }
});

const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-btn');

if (burgerBtn && mobileMenu && closeBtn) {
  burgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeBtn.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// 2. Intersection Observer (Reveal on scroll)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 3. Form Radios Option Selecion
document.querySelectorAll('.radio').forEach(r => {
  r.addEventListener('click', () => {
    document.querySelectorAll('.radio').forEach(x => x.classList.remove('active'));
    r.classList.add('active');
  });
});

// 4. Interactive Customizer (Chassis Finish and Aura Light Colors)
const customizerImg = document.getElementById('customizer-img');
const colorTags = document.querySelectorAll('.color-opt-btn');
const auraBtns = document.querySelectorAll('.aura-btn');

const colorTagText = document.getElementById('cust-color-tag');
const ledTagText = document.getElementById('cust-led-tag');

const auraGlow = document.getElementById('aura-glow');
const auraStatusText = document.getElementById('aura-status-text');
const statusDot = document.querySelector('.status-dot');

const colorAssets = {
  black: 'produto-black.jpg',
  white: 'produto-white.jpg'
};

const auraGlowPresets = {
  'cold-blue': { color: '#5dd1ff', intensity: 'rgba(93, 209, 255, 0.25)', text: 'Aura: Cold Blue', rgb: '93, 209, 255', glow1: '93, 209, 255', glow2: '31, 167, 227', glow3: '255, 176, 58' },
  'warm-amber': { color: '#ffb03a', intensity: 'rgba(255, 176, 58, 0.25)', text: 'Aura: Warm Amber', rgb: '255, 176, 58', glow1: '255, 176, 58', glow2: '255, 176, 58', glow3: '93, 209, 255' },
  'neon-green': { color: '#4dff7e', intensity: 'rgba(77, 255, 126, 0.25)', text: 'Aura: Neon Green', rgb: '77, 255, 126', glow1: '77, 255, 126', glow2: '77, 255, 126', glow3: '255, 176, 58' },
  'aurora-purple': { color: '#d25dff', intensity: 'rgba(210, 93, 255, 0.25)', text: 'Aura: Aurora', rgb: '210, 93, 255', glow1: '210, 93, 255', glow2: '210, 93, 255', glow3: '93, 209, 255' }
};

colorTags.forEach(btn => {
  btn.addEventListener('click', () => {
    colorTags.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    
    const color = btn.dataset.color;
    if (customizerImg && colorAssets[color]) {
      customizerImg.src = colorAssets[color];
      // Sync hero product image as well
      const heroProductImg = document.getElementById('hero-product-img');
      if (heroProductImg) heroProductImg.src = colorAssets[color];
      
      if (colorTagText) {
        colorTagText.textContent = color === 'black' ? 'Black Edition' : 'White Edition';
      }
    }
  });
});

auraBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    auraBtns.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    
    const aura = btn.dataset.aura;
    const preset = auraGlowPresets[aura];
    
    if (preset) {
      // Update CSS variables on :root
      const root = document.documentElement;
      root.style.setProperty('--aura-color', preset.color);
      root.style.setProperty('--aura-glow-intensity', preset.intensity);
      root.style.setProperty('--accent-dynamic', preset.color);
      root.style.setProperty('--accent-dynamic-rgb', preset.rgb);
      root.style.setProperty('--glow-1-rgb', preset.glow1);
      root.style.setProperty('--glow-2-rgb', preset.glow2);
      root.style.setProperty('--glow-3-rgb', preset.glow3);
      
      // Force repaint of background glow orbs (some browsers cache radial-gradient)
      const glow1 = document.querySelector('.glow-1');
      const glow2 = document.querySelector('.glow-2');
      const glow3 = document.querySelector('.glow-3');
      if (glow1) glow1.style.background = `radial-gradient(circle, rgba(${preset.glow1}, 0.15), transparent 70%)`;
      if (glow2) glow2.style.background = `radial-gradient(circle, rgba(${preset.glow2}, 0.1), transparent 70%)`;
      if (glow3) glow3.style.background = `radial-gradient(circle, rgba(${preset.glow3}, 0.05), transparent 70%)`;

      // Update the LED aura glow under the customizer product
      const ledAura = document.getElementById('led-aura');
      if (ledAura) {
        ledAura.style.backgroundColor = preset.color;
        ledAura.style.boxShadow = `0 0 40px 10px ${preset.intensity}`;
      }

      // Update the hero showcase glow
      const heroGlow = document.getElementById('aura-glow');
      if (heroGlow) {
        heroGlow.style.background = preset.color;
      }

      // Reset filter to keep only drop shadow (chassis color remains clean)
      const heroProductImg = document.getElementById('hero-product-img');
      if (heroProductImg) {
        heroProductImg.style.filter = `drop-shadow(0 15px 30px rgba(0,0,0,0.8))`;
      }
      if (customizerImg) {
        customizerImg.style.filter = `drop-shadow(0 15px 30px rgba(0,0,0,0.9))`;
      }
      
      // Update texts
      if (ledTagText) ledTagText.textContent = preset.text;
      if (auraStatusText) auraStatusText.textContent = preset.text;
      
      // Update status dot color
      if (statusDot) statusDot.style.backgroundColor = preset.color;
    }
  });
});

// 5. Interactive Web Audio API Simulator
let audioCtx = null;
let soundNodes = [];
let isPlaying = false;
let currentMode = 'tempestade'; // Initial preset: Tempestade

let autoStopTimeout = null;
let countdownInterval = null;
let timeLeft = 30;

const equalizer = document.getElementById('equalizer');
const playSimBtn = document.getElementById('play-sim-btn');
const trackStatus = document.querySelector('.track-status');
const trackTitle = document.querySelector('.track-title');
const simTabs = document.querySelectorAll('.sim-tab');
const simContent = document.getElementById('sim-content');

// Content for tabs
const tabData = {
  pt: {
    tempestade: {
      title: "Tempestade Relaxante",
      desc: "Chuva intensa com trovões e raios sutis para um sono profundo. Foco em relaxamento absoluto.",
      track: "Chuva, Raio e Trovão.mp3"
    },
    ninar: {
      title: "Canção de Ninar Premium",
      desc: "Sinfonia clássica infantil tocada em caixas acústicas de alta fidelidade para embalar o sono das crianças.",
      track: "Canção de Ninar — Brilha Brilha Estrela.mp3"
    },
    brisa: {
      title: "Brisa Polar & Ruído Branco",
      desc: "Frequências puras de ruído branco combinadas com a simulação acústica do vento polar, ideal para concentração.",
      track: "Ruído Branco & Brisa Polar.mp3"
    },
    fogueira: {
      title: "Fogueira & Estalar de Lenha",
      desc: "O som reconfortante do fogo estalando ao ar livre, combinando o calor do ambiente com o estalar natural das chamas.",
      track: "Fogueira Acústica & Lenha Estalando.mp3"
    }
  },
  en: {
    tempestade: {
      title: "Relaxing Storm",
      desc: "Heavy rain with subtle thunder and lightning for deep sleep. Focused on absolute relaxation.",
      track: "Rain, Lightning & Thunder.mp3"
    },
    ninar: {
      title: "Premium Lullaby",
      desc: "Classical children's symphony played on hi-fi speakers to lull kids to sleep.",
      track: "Lullaby — Twinkle Twinkle Little Star.mp3"
    },
    brisa: {
      title: "Polar Breeze & White Noise",
      desc: "Pure white noise frequencies combined with acoustic simulation of polar wind, ideal for focus.",
      track: "White Noise & Polar Breeze.mp3"
    },
    fogueira: {
      title: "Campfire & Crackling Wood",
      desc: "The comforting sound of an outdoor campfire, combining ambient warmth with the natural crackle of flames.",
      track: "Acoustic Campfire & Crackling Wood.mp3"
    }
  },
  es: {
    tempestade: {
      title: "Tormenta Relajante",
      desc: "Lluvia intensa con truenos y relámpagos sutiles para un sueño profundo. Enfocado en la relajación absoluta.",
      track: "Lluvia, Trueno y Relámpago.mp3"
    },
    ninar: {
      title: "Canción de Cuna Premium",
      desc: "Sinfonía clásica infantil reproducida en altavoces de alta fidelidad para acunar el sueño de los niños.",
      track: "Canción de Cuna — Estrellita Dónde Estás.mp3"
    },
    brisa: {
      title: "Brisa Polar y Ruido Blanco",
      desc: "Frecuencias puras de ruido blanco combinadas con simulación acústica de viento polar, ideal para concentración.",
      track: "Ruido Blanco y Brisa Polar.mp3"
    },
    fogueira: {
      title: "Fogata y Leña Crujiente",
      desc: "El reconfortante sonido de una fogata al aire libre, combinando la calidez del ambiente con el sonido crujiente de las llamas.",
      track: "Fogata Acústica y Leña Crujiente.mp3"
    }
  }
};

simTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    simTabs.forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    
    currentMode = tab.dataset.mode;
    stopAudioSimulation();
    updateTabContent();
  });
});

function updateTabContent() {
  const currentLang = document.documentElement.lang || 'pt';
  const data = tabData[currentLang][currentMode];
  
  if (data && simContent) {
    simContent.innerHTML = `
      <div class="sim-pane-active">
        <h4>${data.title}</h4>
        <p>${data.desc}</p>
        <div class="audio-controls-row">
          <button class="btn btn-primary" id="play-sim-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span data-i18n="sim_play">${translations[currentLang].sim_play}</span>
          </button>
          <div class="sound-track-info">
            <span class="track-status">${isPlaying ? translations[currentLang].sim_status_playing + ' (' + timeLeft + 's)' : translations[currentLang].sim_status_stopped}</span>
            <span class="track-title">${data.track}</span>
          </div>
          <div class="wave-visualizer-container">
            <canvas id="wave-canvas"></canvas>
          </div>
        </div>
      </div>
    `;
    
    // Rebind button
    document.getElementById('play-sim-btn').addEventListener('click', toggleAudioSimulation);
    
    // Initialize canvas reference
    initCanvasVisualizer();
  }
}

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSleepModeSound() {
  initAudioContext();
  
  // 1. Rain noise (white noise low-pass filtered)
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(700, audioCtx.currentTime);
  
  const rainGain = audioCtx.createGain();
  rainGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  
  whiteNoise.connect(filter).connect(rainGain).connect(audioCtx.destination);
  whiteNoise.start();
  soundNodes.push(whiteNoise);
  
  // 2. AC Unit Hum (80Hz sine wave)
  const humOsc = audioCtx.createOscillator();
  const humGain = audioCtx.createGain();
  humOsc.type = 'sine';
  humOsc.frequency.setValueAtTime(80, audioCtx.currentTime);
  humGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  
  humOsc.connect(humGain).connect(audioCtx.destination);
  humOsc.start();
  soundNodes.push(humOsc);
  
  // 3. Lightning and Thunder cracks scheduler
  function triggerThunder(timeDelay) {
    const time = audioCtx.currentTime + timeDelay;
    
    // Thunder rumble (low-frequency saw wave, filtered)
    const rumbleOsc = audioCtx.createOscillator();
    const rumbleGain = audioCtx.createGain();
    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.setValueAtTime(45, time);
    
    const rumbleFilter = audioCtx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(70, time);
    
    rumbleGain.gain.setValueAtTime(0, time);
    rumbleGain.gain.linearRampToValueAtTime(0.2, time + 0.1); // Crack
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, time + 4.5); // Rumble fade
    
    rumbleOsc.connect(rumbleFilter).connect(rumbleGain).connect(audioCtx.destination);
    rumbleOsc.start(time);
    rumbleOsc.stop(time + 5);
    
    // Pinkish crackle
    const thunderNoise = audioCtx.createBufferSource();
    thunderNoise.buffer = noiseBuffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(140, time);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, time);
    noiseGain.gain.linearRampToValueAtTime(0.1, time + 0.12);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 3.0);
    
    thunderNoise.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
    thunderNoise.start(time);
    thunderNoise.stop(time + 4);
    
    soundNodes.push(rumbleOsc, thunderNoise);
  }
  
  // Trigger lightning-thunder cracks at 4s and 17s
  triggerThunder(4);
  triggerThunder(17);
}

function playLullaby() {
  initAudioContext();
  
  const melody = [
    261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
    349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63,
    392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
    392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
    261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
    349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
  ];
  
  let startTime = audioCtx.currentTime;
  melody.forEach((freq, index) => {
    // Stop playing notes if time exceeds 30s
    if (index * 0.7 > 30) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime + index * 0.7);
    
    gain.gain.setValueAtTime(0, startTime + index * 0.7);
    gain.gain.linearRampToValueAtTime(0.08, startTime + index * 0.7 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.7 + 0.65);
    
    // Overtone
    const overtoneOsc = audioCtx.createOscillator();
    const overtoneGain = audioCtx.createGain();
    overtoneOsc.type = 'sine';
    overtoneOsc.frequency.setValueAtTime(freq * 2, startTime + index * 0.7);
    
    overtoneGain.gain.setValueAtTime(0, startTime + index * 0.7);
    overtoneGain.gain.linearRampToValueAtTime(0.03, startTime + index * 0.7 + 0.03);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.7 + 0.35);
    
    osc.connect(gain).connect(audioCtx.destination);
    overtoneOsc.connect(overtoneGain).connect(audioCtx.destination);
    
    osc.start(startTime + index * 0.7);
    osc.stop(startTime + index * 0.7 + 0.7);
    overtoneOsc.start(startTime + index * 0.7);
    overtoneOsc.stop(startTime + index * 0.7 + 0.4);
    
    soundNodes.push(osc, overtoneOsc);
  });
}

function playPolarBreeze() {
  initAudioContext();
  
  const noiseSource = audioCtx.createBufferSource();
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(500, audioCtx.currentTime);
  filter.Q.setValueAtTime(1.8, audioCtx.currentTime);
  
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.07, audioCtx.currentTime);
  
  noiseSource.connect(filter).connect(gainNode).connect(audioCtx.destination);
  noiseSource.start();
  
  // Sweep frequency cutoff to simulate polar wind
  let time = audioCtx.currentTime;
  filter.frequency.linearRampToValueAtTime(650, time + 4);
  filter.frequency.linearRampToValueAtTime(380, time + 8);
  filter.frequency.linearRampToValueAtTime(580, time + 12);
  filter.frequency.linearRampToValueAtTime(320, time + 16);
  filter.frequency.linearRampToValueAtTime(480, time + 20);
  filter.frequency.linearRampToValueAtTime(750, time + 24);
  filter.frequency.linearRampToValueAtTime(420, time + 28);
  
  soundNodes.push(noiseSource);
}

function playCampfire() {
  initAudioContext();
  
  // Low brown noise rumble
  const noiseSource = audioCtx.createBufferSource();
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  
  const lowFilter = audioCtx.createBiquadFilter();
  lowFilter.type = 'lowpass';
  lowFilter.frequency.setValueAtTime(130, audioCtx.currentTime);
  
  const lowGain = audioCtx.createGain();
  lowGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  
  noiseSource.connect(lowFilter).connect(lowGain).connect(audioCtx.destination);
  noiseSource.start();
  soundNodes.push(noiseSource);
  
  // Clicks generator
  const clickInterval = setInterval(() => {
    if (!isPlaying || currentMode !== 'fogueira') {
      clearInterval(clickInterval);
      return;
    }
    
    if (Math.random() > 0.45) {
      const clickOsc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(2500 + Math.random() * 4500, audioCtx.currentTime);
      
      clickGain.gain.setValueAtTime(0.01 + Math.random() * 0.02, audioCtx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
      
      clickOsc.connect(clickGain).connect(audioCtx.destination);
      clickOsc.start();
      clickOsc.stop(audioCtx.currentTime + 0.04);
      
      soundNodes.push(clickOsc);
    }
  }, 80);
  
  soundNodes.push({
    stop: () => clearInterval(clickInterval)
  });
}

function startAudioSimulation() {
  isPlaying = true;
  if (equalizer) equalizer.classList.add('playing');
  
  if (currentMode === 'tempestade') {
    playSleepModeSound();
  } else if (currentMode === 'ninar') {
    playLullaby();
  } else if (currentMode === 'brisa') {
    playPolarBreeze();
  } else if (currentMode === 'fogueira') {
    playCampfire();
  }
  
  const currentLang = document.documentElement.lang || 'pt';
  const statusLabel = document.querySelector('.track-status');
  const playBtnText = document.querySelector('#play-sim-btn span');
  
  if (playBtnText) playBtnText.textContent = translations[currentLang].sim_stop;
  
  // 30s Countdown timer
  timeLeft = 30;
  if (statusLabel) {
    statusLabel.textContent = `${translations[currentLang].sim_status_playing} (${timeLeft}s)`;
  }
  
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    timeLeft--;
    if (statusLabel) {
      statusLabel.textContent = `${translations[currentLang].sim_status_playing} (${timeLeft}s)`;
    }
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
  
  clearTimeout(autoStopTimeout);
  autoStopTimeout = setTimeout(() => {
    stopAudioSimulation();
  }, 30000);
}

function stopAudioSimulation() {
  isPlaying = false;
  if (equalizer) equalizer.classList.remove('playing');
  
  clearTimeout(autoStopTimeout);
  clearInterval(countdownInterval);
  
  soundNodes.forEach(node => {
    try {
      if (typeof node.stop === 'function') {
        node.stop();
      }
    } catch(e) {}
  });
  soundNodes = [];
  
  const currentLang = document.documentElement.lang || 'pt';
  const statusLabel = document.querySelector('.track-status');
  const playBtnText = document.querySelector('#play-sim-btn span');
  
  if (statusLabel) statusLabel.textContent = translations[currentLang].sim_status_stopped;
  if (playBtnText) playBtnText.textContent = translations[currentLang].sim_play;
}

function toggleAudioSimulation() {
  if (isPlaying) {
    stopAudioSimulation();
  } else {
    startAudioSimulation();
  }
}

// Bind event on load
const initialPlayBtn = document.getElementById('play-sim-btn');
if (initialPlayBtn) {
  initialPlayBtn.addEventListener('click', toggleAudioSimulation);
}

// 6. Contact Form Submission (Web3forms Integration)
async function enviarForm() {
  const nome = document.getElementById('f-nome').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const empresa = document.getElementById('f-emp').value.trim();
  const msg = document.getElementById('f-msg').value.trim();
  const inter = document.querySelector('.radio.active')?.dataset?.val || '';
  const submitBtn = document.getElementById('submit-btn');
  const currentLang = document.documentElement.lang || 'pt';
  
  if (!nome || !email) {
    alert(translations[currentLang].alert_fill);
    return;
  }
  
  if (submitBtn) submitBtn.disabled = true;
  
  const WEB3FORMS_KEY = '25f463ee-6eb4-4bc9-a33e-719d7e378507';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: 'Novo contato Polar Beats — ' + inter,
        autoresponse: true,
        autoresponse_message: 'Olá, ' + nome + '! Recebemos seu contato e em breve nossa equipe vai te chamar. Enquanto isso, conheça mais sobre a Polar Beats em polarbeats.com.br. — Equipe Polar Beats',
        name: nome, 
        email: email, 
        empresa: empresa, 
        interesse: inter, 
        message: msg || '(sem mensagem)'
      })
    });
    
    const data = await res.json();
    if (data.success) {
      document.getElementById('form-fields').classList.add('hide');
      const formOk = document.getElementById('form-ok');
      formOk.classList.add('show');
      const okMsg = document.getElementById('ok-msg');
      okMsg.textContent = translations[currentLang].f_ok_desc.replace('{name}', nome.split(' ')[0]);
    } else {
      alert(translations[currentLang].alert_err);
      if (submitBtn) submitBtn.disabled = false;
    }
  } catch(e) {
    alert(translations[currentLang].alert_conn);
    if (submitBtn) submitBtn.disabled = false;
  }
}


// 7. Translation Engine & Translation Keys (PT, EN, ES)
const translations = {
  pt: {
    nav_product: "Produto",
    nav_origin: "A Origem",
    nav_market: "Mercado",
    nav_opportunity: "Oportunidade",
    nav_contact: "Contato",
    nav_cta: "Quero ser distribuidor",
    hero_badge: "Patente Global Registrada · INPI BR 202023011705-3",
    hero_h1a: "CLIMA QUE",
    hero_h1b: "VOCÊ OUVE.",
    hero_sub: "O primeiro ar-condicionado do mundo com <strong>sistema de áudio premium integrado</strong> — uma categoria inteiramente nova no mercado de climatização.",
    hero_cta1: "Quero ser distribuidor",
    hero_cta2: "Conhecer o produto",
    stat1: "Taxa de aceitação nacional",
    stat2: "Validade da patente global",
    stat3: "Categoria no segmento",
    stat4: "Foco em alto tráfego",
    kicker_product: "O Produto",
    h2_product: "AR-CONDICIONADO. SISTEMA DE SOM. UMA SÓ PEÇA.",
    lead_product: "A Polar Beats integra tecnologia de áudio de alta fidelidade diretamente no chassi lateral de um split inverter — sem ocupar espaço extra, sem cabos adicionais.",
    cust_title: "Personalize sua Experiência",
    cust_desc: "Escolha o acabamento do chassi e defina a atmosfera da iluminação integrada Aura Light.",
    cust_finish: "Acabamento do Chassis",
    cust_aura: "Modo de Iluminação Aura Light",
    sim_badge: "Simulador de Áudio Polar Beats",
    sim_play: "Ouvir Simulação",
    sim_stop: "Parar Som",
    sim_status_stopped: "Parado",
    sim_status_playing: "Tocando...",
    tab_tempestade: "Tempestade",
    tab_ninar: "Canção de Ninar",
    tab_brisa: "Brisa Polar",
    tab_fogueira: "Fogueira",
    feat1_title: "Áudio Premium de Alta Fidelidade",
    feat1_desc: "Drivers de alta fidelidade no chassi lateral garantem dispersão sonora em 180° — cobertura total do ambiente sem caixas externas.",
    feat2_title: "Integração Spotify & Bluetooth",
    feat2_desc: "Controle de playlist, temperatura e iluminação Aura num único painel pelo app Polar Beats, sem trocar de tela.",
    feat3_title: "Modo Sleep Masking",
    feat3_desc: "Algoritmo detecta o ruído externo e ajusta automaticamente sons ambiente — chuva, white noise, natureza — para um sono de qualidade.",
    feat4_title: "Climatização inverter de alta eficiência",
    feat4_desc: "Tecnologia inverter reduz consumo em até 60% comparado a modelos convencionais, mantendo temperatura constante.",
    feat5_title: "Aura Light — iluminação ambiente",
    feat5_desc: "LED RGB integrado que sincroniza com a música e cria atmosferas personalizadas para trabalho, relaxamento ou entretenimento.",
    kicker_origin: "A Origem",
    h2_origin: "ALGUNS INVENTORES ABANDONAM SUAS IDEIAS. OUTROS ESPERAM O MOMENTO CERTO.",
    orig1_title: "12 Anos de Convicção",
    orig1_desc: "A ideia nasceu há 12 anos. Parecia cedo demais — e era. O mercado, a tecnologia e o consumidor precisavam amadurecer. A ideia ficou guardada. A convicção, nunca.",
    orig2_title: "O Espaço que Ninguém Ocupou",
    orig2_desc: "Gree, Midea, LG e Samsung competiram décadas em preço, BTU e eficiência. Ninguém perguntou: e se o ar-condicionado pudesse fazer mais? Esse espaço sempre existiu — faltava enxergá-lo.",
    orig3_title: "Agora Saindo do Papel",
    orig3_desc: "A Polar Beats não compete com os grandes — cria uma categoria que eles não ocupam. Quem quer clima e som hoje compra dois produtos. A Polar Beats resolve com um equipamento patenteado.",
    kicker_market: "Por que a Polar Beats",
    h2_market: "UMA CATEGORIA. ZERO CONCORRENTES.",
    lead_market: "Não existe no mercado brasileiro — nem global — nenhum produto que une climatização e áudio premium num equipamento fixo patenteado.",
    why1_title: "Inovação patenteada",
    why1_desc: "Patente INPI válida até 2038, com proteção sobre o design de integração do áudio no chassi lateral.",
    why2_title: "Mercado B2B imediato",
    why2_desc: "Clínicas, academias, hotéis, salões e restaurantes — ambientes que já precisam de ar e som separados.",
    why3_title: "Substitui dois produtos",
    why3_desc: "Um investimento que elimina comprar e instalar ar-condicionado e sistema de som separadamente.",
    why4_title: "Ecossistema inteligente",
    why4_desc: "App proprietário que centraliza climatização, áudio e iluminação num só painel.",
    why5_title: "Mercado inexplorado",
    why5_desc: "Setor de bilhões por ano no Brasil. A Polar Beats entra como premium disruptor, sem competição direta.",
    why6_title: "Pronto para distribuição",
    why6_desc: "Produto em fase final de manufatura, com parceiro industrial ativo e produção estabelecida.",
    h2_val: "OS NÚMEROS FALAM.",
    lead_val: "Pesquisa de aceitação realizada em âmbito nacional confirma o potencial do produto antes mesmo do lançamento.",
    val_stat1: "Taxa de intenção de compra, realizada apenas com a descrição do conceito — sem imagens ou protótipo.",
    val_stat2: "Tamanho estimado do mercado brasileiro de ar-condicionado por ano.",
    val_stat3: "Patente global ativa até 2038 — exclusividade legal antes de qualquer concorrente.",
    val_meta: "Pesquisa de intenção de compra · Instituto RT Soluções · âmbito nacional",
    vb1_title: "Proposta de Valor Dual",
    vb1_desc: "O cliente que precisaria comprar ar-condicionado E sistema de som resolve as duas necessidades com um único produto premium.",
    vb2_title: "Demanda Antes do Lançamento",
    vb2_desc: "Pedidos registrados ainda na fase de conceito — validação de demanda real antes do produto existir fisicamente.",
    vb3_title: "Foco B2B Estratégico",
    vb3_desc: "Clínicas, academias, hotéis boutique, salões e restaurantes são os canais prioritários de entrada.",
    vb4_title: "Demanda Internacional",
    vb4_desc: "Conversas em andamento com gestores de portfólio imobiliário nos EUA, ainda na fase de conceito.",
    kicker_opp: "Para Distribuidores & Investidores",
    h2_opp: "ENTRE NA VANGUARDA.",
    lead_opp: "A Polar Beats está abrindo conversas com distribuidores e parceiros estratégicos para o lançamento nacional.",
    opp1_title: "Distribuidor Exclusivo",
    opp1_desc: "Territórios exclusivos disponíveis por estado ou região. Seja o primeiro no seu mercado.",
    opp2_title: "Canal B2B",
    opp2_desc: "Revenda para clínicas, hotéis, academias e estabelecimentos comerciais com margens premium.",
    opp3_title: "Parceiro Investidor",
    opp3_desc: "Participe de uma empresa com patente registrada e produto em fase de manufatura.",
    opp4_title: "Exportação",
    opp4_desc: "Demanda internacional já identificada. Potencial de expansão para América Latina e EUA.",
    patent_title: "PATENTE GLOBAL REGISTRADA",
    patent_desc: "O sistema de integração de áudio no chassi lateral do split é protegido por patente internacional (tratado PCT) com registro ativo no INPI sob número BR 202023011705-3, garantindo exclusividade global e proteção em múltiplos países até 2038.",
    app_kicker: "Controle Inteligente",
    app_title: "TUDO EM SUAS MÃOS",
    app_desc: "Com o app oficial Polar Beats, você gerencia todos os aspectos do seu ambiente. Ajuste a temperatura do ar-condicionado, configure os presets de áudio e alterne a atmosfera de luz Aura de qualquer lugar.",
    app_feat1_title: "Sincronização com Clima",
    app_feat1_desc: "Ajustes dinâmicos automáticos com base no clima externo e na temperatura interna preferida.",
    app_feat2_title: "Aura Sync & Audio Visualizer",
    app_feat2_desc: "Veja as cores da iluminação Aura fluírem de acordo com as frequências sonoras da música.",
    kicker_contact: "Entre em Contato",
    h2_contact: "VAMOS CONVERSAR SOBRE NEGÓCIOS.",
    lead_contact: "Se você é distribuidor, varejista, investidor ou gestor de uma rede comercial, queremos te apresentar a Polar Beats em detalhes.",
    cta_whats: "Falar pelo WhatsApp",
    cta_email: "Enviar e-mail",
    contact_or: "Ou escreva para",
    f_nome: "Nome",
    f_nome_ph: "Seu nome",
    f_emp: "Empresa",
    f_emp_ph: "Nome da empresa",
    f_interest: "Tipo de interesse",
    r_dist: "Distribuidor",
    r_b2b: "Canal B2B",
    r_inv: "Investidor",
    r_exp: "Exportação",
    r_other: "Outros assuntos",
    f_email: "E-mail",
    f_email_ph: "voce@empresa.com",
    f_msg: "Mensagem",
    f_msg_ph: "Conte um pouco sobre seu interesse...",
    f_send: "Enviar mensagem",
    f_ok_title: "Mensagem registrada!",
    f_ok_desc: "Obrigado, {name}. Em breve a equipe Polar Beats entra em contato.",
    footer_meta: "Polar Beats © 2026 · Brasil · Paraguai · Patente BR 202023011705-3 · INPI",
    footer_disclaimer: "Protótipo conceitual. O design, as funcionalidades e os acabamentos apresentados poderão ser refinados durante o processo de industrialização e produção.",
    alert_conn: "Erro de conexão. Tente pelo WhatsApp ou e-mail.",
    calc_kicker: "Viabilidade Financeira B2B",
    calc_title: "VEJA A ECONOMIA EM SEU EMPREENDIMENTO",
    calc_lead: "Calcule os custos que você reduz ao integrar ar-condicionado e sonorização premium em uma única infraestrutura simplificada.",
    calc_slider_label: "Número de Salas / Ambientes",
    calc_rooms_unit: "Ambientes",
    calc_res1_title: "Economia em Equipamentos",
    calc_res1_desc: "Sem compra de caixas acústicas, fiação paralela e amplificadores.",
    calc_res2_title: "Economia em Instalação",
    calc_res2_desc: "Elimina custos de fixação de som, infraestrutura física e mão de obra extra.",
    calc_res3_title: "Eficiência Energética (Anual)",
    calc_res3_desc: "Economia em consumo gerada por split inverter e corte inteligente de caixas de som.",
    calc_total_title: "Economia Total Projetada",
    calc_total_desc: "Retorno financeiro logo no primeiro ano de operação.",
    faq_kicker: "Dúvidas Frequentes",
    faq_title: "PERGUNTAS FREQUENTES",
    faq_lead: "Esclareça suas dúvidas técnicas e comerciais sobre o ecossistema integrado Polar Beats.",
    faq_q1: "Como o sistema de áudio lida com a umidade e gotejamento do ar-condicionado?",
    faq_a1: "Desenvolvemos e patenteamos uma blindagem hidrofóbica e isolamento acústico no chassi lateral do ar-condicionado. A condensação de água do split é drenada por uma calha isolada totalmente separada do compartimento dos drivers de áudio, garantindo segurança elétrica e durabilidade de mais de 15 anos sem desgaste.",
    faq_q2: "O sistema é compatível com Alexa, Google Home e Bluetooth?",
    faq_a2: "Sim! A placa de áudio interna do Polar Beats possui conectividade Bluetooth 5.2 de latência ultra-baixa e Wi-Fi integrado. Ela se conecta perfeitamente a dispositivos de voz (como Alexa e Google Assistant), além de aceitar streaming direto via Spotify Connect e Apple AirPlay.",
    faq_q3: "Como funciona a garantia do equipamento integrado split + áudio?",
    faq_a3: "Oferecemos garantia de 3 anos para o sistema completo e 10 anos para o compressor inverter. A assistência técnica é unificada: nossos parceiros de distribuição e climatizadores credenciados são plenamente treinados para manutenções preventivas ou corretivas do sistema de áudio e ar simultaneamente.",
    faq_q4: "A patente de integração da Polar Beats é válida internacionalmente?",
    faq_a4: "Nossa patente principal está devidamente registrada no INPI (Instituto Nacional da Propriedade Industrial) no Brasil com validade até 2038. Também possuímos proteção internacional sob o tratado PCT, assegurando prioridade de direitos de design de áudio integrado em split nos mercados da América do Norte (EUA) e América Latina.",
    app_feat3_title: "Interface Multi-Dispositivo",
    app_feat3_desc: "Controle o sistema tanto no celular quanto em tablets ou painéis de automação comercial, em telas horizontais ou verticais.",
    places_kicker: "Flexibilidade de Instalação",
    places_title: "UM PRODUTO, INFINITOS AMBIENTES",
    places_lead: "Por ser um sistema integrado que dispensa fiação exposta e caixas acústicas adicionais, a Polar Beats é a escolha perfeita para qualquer projeto arquitetônico residencial ou comercial.",
    place1_title: "Hotéis & Motéis de Luxo",
    place1_desc: "Sonorização premium e controle de clima integrados para a melhor experiência dos hóspedes, sem poluição visual no quarto.",
    place2_title: "Salões de Festa & Eventos",
    place2_desc: "Áudio de preenchimento distribuído e climatização potente que mantêm o clima e a música em perfeita harmonia.",
    place3_title: "Espaços Gourmet & Varandas",
    place3_desc: "O som ideal para churrascos, jantares e recepções de amigos em um único aparelho elegante, discreto e potente.",
    place4_title: "Clínicas & Consultórios",
    place4_desc: "Ruído branco para mascaramento acústico (privacidade de consultas) e música ambiente relaxante para pacientes.",
    place5_title: "Academias & Estúdios",
    place5_desc: "Climatização ideal com som de alta energia e cobertura uniforme em 180° para motivar os treinos.",
    place6_title: "Casas & Home Theaters",
    place6_desc: "Clima aconchegante e som espacial para quartos e salas, substituindo caixas acústicas convencionais."
  },
  en: {
    nav_product: "Product",
    nav_origin: "Origin",
    nav_market: "Market",
    nav_opportunity: "Opportunity",
    nav_contact: "Contact",
    nav_cta: "Become a distributor",
    hero_badge: "Global Patent Registered · INPI BR 202023011705-3",
    hero_h1a: "CLIMATE YOU",
    hero_h1b: "CAN HEAR.",
    hero_sub: "The world's first air conditioner with an <strong>integrated premium audio system</strong> — an entirely new category in the HVAC market.",
    hero_cta1: "Become a distributor",
    hero_cta2: "Discover the product",
    stat1: "National acceptance rate",
    stat2: "Global patent validity",
    stat3: "First-in-class category",
    stat4: "High traffic B2B focus",
    kicker_product: "The Product",
    h2_product: "AIR CONDITIONING. SOUND SYSTEM. ALL-IN-ONE.",
    lead_product: "Polar Beats integrates high-fidelity audio technology directly into the side panel of an inverter split unit — without taking up extra space or requiring additional cables.",
    cust_title: "Personalize Your Experience",
    cust_desc: "Choose the chassis finish and define the ambiance of the integrated Aura Light system.",
    cust_finish: "Chassis Finish",
    cust_aura: "Aura Light Mode",
    sim_badge: "Polar Beats Audio Simulator",
    sim_play: "Listen to Demo",
    sim_stop: "Stop Sound",
    sim_status_stopped: "Stopped",
    sim_status_playing: "Playing...",
    tab_tempestade: "Storm",
    tab_ninar: "Lullaby",
    tab_brisa: "Polar Breeze",
    tab_fogueira: "Campfire",
    feat1_title: "Premium High-Fidelity Audio",
    feat1_desc: "High-fidelity drivers on the side chassis guarantee 180° sound dispersion — full room coverage without external speakers.",
    feat2_title: "Spotify & Bluetooth Integration",
    feat2_desc: "Control your playlist, temperature, and Aura lighting from a single dashboard in the Polar Beats app.",
    feat3_title: "Sleep Masking Mode",
    feat3_desc: "The algorithm detects ambient noise and automatically adjusts soft sounds — rain, white noise, nature — for quality sleep.",
    feat4_title: "High-Efficiency Inverter AC",
    feat4_desc: "Inverter technology reduces power consumption by up to 60% compared to conventional models while keeping temperature stable.",
    feat5_title: "Aura Light — Ambient Lighting",
    feat5_desc: "Integrated RGB LED that syncs with music and creates custom atmospheres for work, relaxation, or entertainment.",
    kicker_origin: "The Origin",
    h2_origin: "SOME INVENTORS ABANDON THEIR IDEAS. OTHERS WAIT FOR THE RIGHT MOMENT.",
    orig1_title: "12 Years of Conviction",
    orig1_desc: "The idea was born 12 years ago. It seemed too early — and it was. The market, technology, and consumers needed to mature. The idea stayed stored. The conviction, never.",
    orig2_title: "The Space Nobody Claimed",
    orig2_desc: "Gree, Midea, LG, and Samsung competed for decades on price, BTU, and efficiency. Nobody asked: what if the air conditioner could do more? That space always existed — it just needed to be seen.",
    orig3_title: "Coming to Life Now",
    orig3_desc: "Polar Beats doesn't compete with the giants — it creates a category they do not occupy. Those wanting climate and sound today buy two devices. Polar Beats solves it with one patented unit.",
    kicker_market: "Why Polar Beats",
    h2_market: "ONE CATEGORY. ZERO COMPETITORS.",
    lead_market: "There is no product — in Brazil or globally — that combines air conditioning and premium audio in a single patented fixed unit.",
    why1_title: "Patented Innovation",
    why1_desc: "INPI patent valid until 2038, protecting the design of audio integration in the side panels.",
    why2_title: "Immediate B2B Market",
    why2_desc: "Clinics, gyms, hotels, salons, and restaurants — spaces that already need separate sound and air.",
    why3_title: "Replaces Two Products",
    why3_desc: "A single investment that eliminates buying and installing air conditioning and sound systems separately.",
    why4_title: "Smart Ecosystem",
    why4_desc: "Proprietary app that centralizes cooling, audio playback, and lighting in one panel.",
    why5_title: "Untapped Market",
    why5_desc: "Billion-dollar industry in Brazil. Polar Beats enters as a premium disruptor, with zero direct competition.",
    why6_title: "Ready for Distribution",
    why6_desc: "Product in the final manufacturing stage, with an active industrial partner and established production.",
    h2_val: "THE NUMBERS SPEAK.",
    lead_val: "Acceptance survey conducted nationwide confirms the product's potential even before launch.",
    val_stat1: "Purchase intent rate, conducted solely with the description of the concept — without images or prototype.",
    val_stat2: "Estimated size of the Brazilian air conditioning market per year.",
    val_stat3: "Active global patent until 2038 — legal exclusivity before any competitor.",
    val_meta: "Purchase intent survey · Instituto RT Soluções · nationwide scope",
    vb1_title: "Dual Value Proposition",
    vb1_desc: "Customers who would need to buy air conditioning AND a sound system can fulfill both needs with a single premium product.",
    vb2_title: "Demand Before Launch",
    vb2_desc: "Orders recorded at the concept phase — validation of real demand before the physical product exists.",
    vb3_title: "Strategic B2B Focus",
    vb3_desc: "Clinics, gyms, boutique hotels, salons, and restaurants are the priority entry channels.",
    vb4_title: "International Demand",
    vb4_desc: "Conversations underway with real estate portfolio managers in the US, still in the concept phase.",
    kicker_opp: "For Distributors & Investors",
    h2_opp: "BE AT THE FOREFRONT.",
    lead_opp: "Polar Beats is opening talks with distributors and strategic partners for the national launch.",
    opp1_title: "Exclusive Distributor",
    opp1_desc: "Exclusive territories available by state or region. Be the first in your market.",
    opp2_title: "B2B Channel",
    opp2_desc: "Resell to clinics, hotels, gyms, and commercial establishments with premium margins.",
    opp3_title: "Investment Partner",
    opp3_desc: "Join a company with a registered patent and a product in the manufacturing stage.",
    opp4_title: "Export",
    opp4_desc: "International demand already identified. Expansion potential for Latin America and the US.",
    patent_title: "GLOBAL PATENT REGISTERED",
    patent_desc: "The audio integration system in the split side chassis is protected by an international patent (PCT treaty) with active registration at INPI under number BR 202023011705-3, securing global exclusivity and protection in multiple countries until 2038.",
    app_kicker: "Smart Control",
    app_title: "EVERYTHING IN YOUR HANDS",
    app_desc: "With the official Polar Beats app, you manage all aspects of your environment. Adjust air conditioner temperature, set audio presets, and toggle the Aura light atmosphere from anywhere.",
    app_feat1_title: "Climate Sync",
    app_feat1_desc: "Automatic dynamic adjustments based on outdoor weather and your preferred indoor temperature.",
    app_feat2_title: "Aura Sync & Audio Visualizer",
    app_feat2_desc: "Watch the Aura lighting colors flow according to the audio frequencies of the music.",
    app_feat3_title: "Multi-Device Interface",
    app_feat3_desc: "Control the system on mobile, tablets, or commercial automation panels, in landscape or portrait modes.",
    kicker_contact: "Contact Us",
    h2_contact: "LET'S TALK BUSINESS.",
    lead_contact: "If you are a distributor, retailer, investor, or commercial manager, we want to present Polar Beats to you in detail.",
    cta_whats: "Chat on WhatsApp",
    cta_email: "Send Email",
    contact_or: "Or write to",
    f_nome: "Name",
    f_nome_ph: "Your name",
    f_emp: "Company",
    f_emp_ph: "Company name",
    f_interest: "Type of Interest",
    r_dist: "Distributor",
    r_b2b: "B2B Channel",
    r_inv: "Investor",
    r_exp: "Export",
    r_other: "Other matters",
    f_email: "Email",
    f_email_ph: "you@company.com",
    f_msg: "Message",
    f_msg_ph: "Tell us a bit about your interest...",
    f_send: "Send Message",
    f_ok_title: "Message Registered!",
    f_ok_desc: "Thank you, {name}. The Polar Beats team will get in touch soon.",
    footer_meta: "Polar Beats © 2026 · Brazil · Paraguay · Patent BR 202023011705-3 · INPI",
    footer_disclaimer: "Conceptual prototype. The design, features, and finishes shown may be refined during the industrialization and production process.",
    alert_conn: "Connection error. Please try via WhatsApp or email.",
    calc_kicker: "B2B Financial Viability",
    calc_title: "SEE THE SAVINGS IN YOUR ENTERPRISE",
    calc_lead: "Calculate the costs you reduce by integrating air conditioning and premium sound into a single, simplified infrastructure.",
    calc_slider_label: "Number of Rooms / Areas",
    calc_rooms_unit: "Rooms",
    calc_res1_title: "Equipment Savings",
    calc_res1_desc: "No purchase of separate speakers, parallel wiring, and amplifiers.",
    calc_res2_title: "Installation Savings",
    calc_res2_desc: "Eliminates speaker mounting costs, physical cabling infrastructure, and extra labor.",
    calc_res3_title: "Energy Efficiency (Annual)",
    calc_res3_desc: "Power savings generated by smart split inverter and sound standby cutoff.",
    calc_total_title: "Projected Total Savings",
    calc_total_desc: "Financial payback in the very first year of operation.",
    faq_kicker: "Frequently Asked Questions",
    faq_title: "FREQUENTLY ASKED QUESTIONS",
    faq_lead: "Clarify your technical and commercial doubts about the Polar Beats integrated ecosystem.",
    faq_q1: "How does the audio system handle humidity and dripping from the air conditioner?",
    faq_a1: "We developed and patented a hydrophobic shielding and acoustic insulation inside the side chassis of the air conditioner. Water condensation from the split is drained through a fully isolated gutter separate from the audio driver compartment, ensuring electrical safety and over 15 years of wear-free durability.",
    faq_q2: "Is the system compatible with Alexa, Google Home, and Bluetooth?",
    faq_a2: "Yes! The internal audio board of Polar Beats features ultra-low latency Bluetooth 5.2 connectivity and integrated Wi-Fi. It connects seamlessly to voice devices (like Alexa and Google Assistant), as well as direct streaming via Spotify Connect and Apple AirPlay.",
    faq_q3: "How does the warranty work for the integrated split + audio equipment?",
    faq_a3: "We offer a 3-year warranty for the complete system and a 10-year warranty for the inverter compressor. Technical assistance is unified: our distribution partners and licensed AC installers are fully trained for preventive or corrective maintenance of both audio and air systems simultaneously.",
    faq_q4: "Is the Polar Beats integration patent valid internationally?",
    faq_a4: "Our main patent is registered with the INPI (National Institute of Industrial Property) in Brazil, valid until 2038. We also hold international protection under the PCT treaty, securing design priority rights for integrated split audio in North American (US) and Latin American markets.",
    places_kicker: "Installation Flexibility",
    places_title: "ONE PRODUCT, INFINITE SPACES",
    places_lead: "As an integrated system that eliminates exposed wiring and additional speakers, Polar Beats is the perfect choice for any residential or commercial architectural project.",
    place1_title: "Luxury Hotels & Motels",
    place1_desc: "Integrated premium sound and climate control for the best guest experience, with zero visual clutter in the room.",
    place2_title: "Party Halls & Events",
    place2_desc: "Distributed ambient audio and powerful cooling that keep both atmosphere and music in perfect harmony.",
    place3_title: "Gourmet Areas & Patios",
    place3_desc: "The ideal sound for barbecues, dinners, and gatherings in a single elegant, discreet, and powerful device.",
    place4_title: "Clinics & Offices",
    place4_desc: "White noise for sound masking (patient privacy) and relaxing ambient music for waiting rooms.",
    place5_title: "Gyms & Studios",
    place5_desc: "Ideal cooling with high-energy sound and even 180° coverage to keep workouts motivated.",
    place6_title: "Homes & Home Theaters",
    place6_desc: "Cozy climate and spatial sound for bedrooms and living rooms, replacing conventional speakers."
  },
  es: {
    nav_product: "Producto",
    nav_origin: "El Origen",
    nav_market: "Mercado",
    nav_opportunity: "Oportunidad",
    nav_contact: "Contacto",
    nav_cta: "Quiero ser distribuidor",
    hero_badge: "Patente Global Registrada · INPI BR 202023011705-3",
    hero_h1a: "CLIMA QUE",
    hero_h1b: "USTED ESCUCHA.",
    hero_sub: "El primer aire acondicionado del mundo con **sistema de audio premium integrado**, una categoría completamente nueva en el mercado de la climatización.",
    hero_cta1: "Quiero ser distribuidor",
    hero_cta2: "Conocer el producto",
    stat1: "Tasa de aceptación nacional",
    stat2: "Validez de la patente global",
    stat3: "Primera categoría en el segmento",
    stat4: "Enfoque B2B de alto tráfico",
    kicker_product: "El Producto",
    h2_product: "AIRE ACONDICIONADO. SISTEMA DE SONIDO. UNA SOLA PIEZA.",
    lead_product: "Polar Beats integra tecnología de audio de alta fidelidad directamente en el chasis lateral de una unidad split inverter, sin ocupar espacio adicional y sin cables extras.",
    cust_title: "Personalice su Experiencia",
    cust_desc: "Elija el acabado del chasis y defina la atmósfera del sistema de iluminación integrado Aura Light.",
    cust_finish: "Acabado del Chasis",
    cust_aura: "Modo Aura Light",
    sim_badge: "Simulador de Audio Polar Beats",
    sim_play: "Escuchar Simulación",
    sim_stop: "Detener Sonido",
    sim_status_stopped: "Detenido",
    sim_status_playing: "Reproduciendo...",
    tab_tempestade: "Tormenta",
    tab_ninar: "Canción de Cuna",
    tab_brisa: "Brisa Polar",
    tab_fogueira: "Fogata",
    feat1_title: "Audio Premium de Alta Fidelidad",
    feat1_desc: "Los controladores de alta fidelidad en los paneles laterales garantizan dispersión sonora de 180°, cubriendo todo el espacio sin altavoces externos.",
    feat2_title: "Integración com Spotify e Bluetooth",
    feat2_desc: "Controle su lista de reproducción, la temperatura y la iluminación Aura desde un panel central en la aplicación Polar Beats.",
    feat3_title: "Modo Sleep Masking",
    feat3_desc: "El algoritmo detecta el ruido externo y ajusta automáticamente sonidos suaves (lluvia, ruido blanco, naturaleza) para dormir mejor.",
    feat4_title: "Climatización Inverter de Alta Eficiencia",
    feat4_desc: "La tecnología Inverter reduce el consumo de energía hasta un 60% en comparación con modelos convencionales manteniendo la temperatura estable.",
    feat5_title: "Aura Light — Iluminación Ambiental",
    feat5_desc: "LED RGB integrado que se sincroniza con la música y crea atmósferas personalizadas para trabajar, relajarse o divertirse.",
    kicker_origin: "El Origen",
    h2_origin: "ALGUNOS INVENTORES ABANDONAN SUS IDEAS. OTROS ESPERAN EL MOMENTO ADECUADO.",
    orig1_title: "12 Años de Convicción",
    orig1_desc: "La idea nació hace 12 años. Parecía demasiado pronto, y lo era. El mercado, la tecnología y los consumidores tenían que madurar. La idea se guardó. La convicción, jamás.",
    orig2_title: "El Espacio que Nadie Ocupó",
    orig2_desc: "Gree, Midea, LG y Samsung compitieron durante décadas en precio, BTU y eficiencia. Nadie preguntó: ¿y si el aire acondicionado pudiera hacer más? Ese espacio siempre existió.",
    orig3_title: "Saliendo a la Luz Ahora",
    orig3_desc: "Polar Beats no compite con los gigantes: crea una categoría que ellos no ocupan. Quienes quieren clima y sonido hoy compran dos dispositivos. Polar Beats lo resuelve en una unidad patentada.",
    kicker_market: "Por qué Polar Beats",
    h2_market: "UNA CATEGORÍA. CERO COMPETIDORES.",
    lead_market: "No existe producto alguno —en Brasil ni a nivel global— que combine aire acondicionado y audio premium en una única unidad fija patentada.",
    why1_title: "Innovación Patentada",
    why1_desc: "Patente INPI válida hasta 2038, protegiendo el diseño de integración de audio en los laterales del chasis.",
    why2_title: "Mercado B2B Inmediato",
    why2_desc: "Clínicas, gimnasios, hoteles, salones y restaurantes: espacios que ya requieren sistemas de sonido y aire independientes.",
    why3_title: "Reemplaza Dos Productos",
    why3_desc: "Una inversión única que elimina la compra e instalación por separado de sistemas de aire y de sonido.",
    why4_title: "Ecosistema Inteligente",
    why4_desc: "Aplicación propia que unifica la climatización, el audio y la iluminación en un solo panel.",
    why5_title: "Mercado Inexplorado",
    why5_desc: "Industria multimillonaria en Brasil. Polar Beats entra como un disruptor premium con cero competencia directa.",
    why6_title: "Listo para Distribución",
    why6_desc: "Producto en fase final de fabricación, con un socio industrial activo y producción establecida.",
    h2_val: "LOS NÚMEROS HABLAN.",
    lead_val: "Encuesta de aceptación a nivel nacional confirma el potencial del producto incluso antes de su lanzamiento.",
    val_stat1: "Tasa de intención de compra, realizada únicamente con la descripción del concepto, sin imágenes ni prototipo.",
    val_stat2: "Tamaño estimado del mercado brasileño de aire acondicionado por año.",
    val_stat3: "Patente global activa hasta 2038: exclusividad legal antes que cualquier competidor.",
    val_meta: "Encuesta de intención de compra · Instituto RT Soluções · alcance nacional",
    vb1_title: "Propuesta de Valor Dual",
    vb1_desc: "Los clientes que necesitarían comprar aire acondicionado Y un sistema de sonido resuelven ambas necesidades con un solo producto premium.",
    vb2_title: "Demanda Antes del Lanzamiento",
    vb2_desc: "Pedidos registrados en la fase de concepto: validación de la demanda real antes de que exista el producto físico.",
    vb3_title: "Enfoque B2B Estratégico",
    vb3_desc: "Clínicas, gimnasios, hoteles boutique, salones y restaurantes son los canales prioritarios de entrada.",
    vb4_title: "Demanda Internacional",
    vb4_desc: "Conversaciones en curso con administradores de carteras inmobiliarias en EE. UU., aún en fase de concepto.",
    kicker_opp: "Para Distribuidores e Inversores",
    h2_opp: "ENTRE EN LA VANGUARDIA.",
    lead_opp: "Polar Beats está abriendo conversaciones con distribuidores y socios estratégicos para el lanzamiento nacional.",
    opp1_title: "Distribuidor Exclusivo",
    opp1_desc: "Territorios exclusivos disponibles por estado o región. Sea el primero en su mercado.",
    opp2_title: "Canal B2B",
    opp2_desc: "Reventa a clínicas, hoteles, gimnasios y establecimientos comerciales con márgenes premium.",
    opp3_title: "Socio Inversor",
    opp3_desc: "Únase a una empresa con patente registrada y un producto en fase de fabricación.",
    opp4_title: "Exportación",
    opp4_desc: "Demanda internacional ya identificada. Potencial de expansión para América Latina y EE. UU.",
    patent_title: "PATENTE GLOBAL REGISTRADA",
    patent_desc: "El sistema de integración de audio en el chasis lateral del split está protegido por una patente internacional (tratado PCT) con registro activo en el INPI bajo el número BR 202023011705-3, asegurando exclusividad global y protección en múltiples países hasta 2038.",
    app_kicker: "Control Inteligente",
    app_title: "TODO EN SUS MANOS",
    app_desc: "Con la aplicación oficial de Polar Beats, gestiona todos los aspectos de tu entorno. Ajusta la temperatura del aire acondicionado, configura los ajustes preestablecidos de audio y cambia la atmósfera de luz Aura desde cualquier lugar.",
    app_feat1_title: "Sincronización Clima",
    app_feat1_desc: "Ajustes dinámicos automáticos basados en el clima exterior y su temperatura interior preferida.",
    app_feat2_title: "Aura Sync & Audio Visualizer",
    app_feat2_desc: "Mira cómo fluyen los colores de la iluminación Aura según las frecuencias de la música.",
    app_feat3_title: "Interfaz Multidispositivo",
    app_feat3_desc: "Controle el sistema tanto en el celular como en tabletas o paneles de automatización comercial, en pantallas horizontales o verticales.",
    kicker_contact: "Contacto",
    h2_contact: "HABLEMOS DE NEGOCIOS.",
    lead_contact: "Si es distribuidor, minorista, inversor o administrador comercial, queremos presentarle Polar Beats en detalle.",
    cta_whats: "Hablar por WhatsApp",
    cta_email: "Enviar correo",
    contact_or: "O escriba a",
    f_nome: "Nombre",
    f_nome_ph: "Su nombre",
    f_emp: "Empresa",
    f_emp_ph: "Nombre de la empresa",
    f_interest: "Tipo de Interés",
    r_dist: "Distribuidor",
    r_b2b: "Canal B2B",
    r_inv: "Inversor",
    r_exp: "Exportar",
    r_other: "Otros asuntos",
    f_email: "Correo electrónico",
    f_email_ph: "usted@empresa.com",
    f_msg: "Mensaje",
    f_msg_ph: "Cuéntenos un poco sobre su interés...",
    f_send: "Enviar Mensaje",
    f_ok_title: "¡Mensaje Registrado!",
    f_ok_desc: "Gracias, {name}. El equipo de Polar Beats se pondrá en contacto pronto.",
    footer_meta: "Polar Beats © 2026 · Brasil · Paraguay · Patente BR 202023011705-3 · INPI",
    footer_disclaimer: "Prototipo conceptual. El diseño, las características y los acabamentos presentados podrán ser refinados durante el proceso de industrialización y producción.",
    alert_fill: "Por favor complete al menos el nombre y el correo electrónico.",
    alert_err: "Error al enviar. Por favor intente por WhatsApp o correo electrónico.",
    alert_conn: "Error de conexión. Por favor intente por WhatsApp o correo electrónico.",
    calc_kicker: "Viabilidad Financiera B2B",
    calc_title: "VEA EL AHORRO EN SU EMPRESA",
    calc_lead: "Calcule los costos que reduce al integrar aire acondicionado y sonido premium en una única infraestructura simplificada.",
    calc_slider_label: "Número de Salas / Áreas",
    calc_rooms_unit: "Salas",
    calc_res1_title: "Ahorro en Equipos",
    calc_res1_desc: "Sin compra de altavoces separados, cableado paralelo ni amplificadores.",
    calc_res2_title: "Ahorro en Instalación",
    calc_res2_desc: "Elimina costos de montaje de audio, infraestructura física y mano de obra adicional.",
    calc_res3_title: "Eficiencia Energética (Anual)",
    calc_res3_desc: "Ahorro en consumo generado por split inverter inteligente y corte de standby de audio.",
    calc_total_title: "Ahorro Total Proyectado",
    calc_total_desc: "Retorno financiero desde el primer año de operación.",
    faq_kicker: "Preguntas Frecuentes",
    faq_title: "PREGUNTAS FRECUENTES",
    faq_lead: "Aclare sus dudas técnicas y comerciales sobre el ecosistema integrado Polar Beats.",
    faq_q1: "¿Cómo maneja el sistema de audio la humedad y el goteo del aire acondicionado?",
    faq_a1: "Desarrollamos y patentamos un blindaje hidrofóbico y aislamiento acústico en el chasis lateral del aire acondicionado. La condensación de agua del split se drena a través de una canaleta aislada totalmente separada del compartimento de los controladores de audio, garantizando seguridad eléctrica y más de 15 años de durabilidad sin desgaste.",
    faq_q2: "¿El sistema es compatible con Alexa, Google Home y Bluetooth?",
    faq_a2: "¡Sí! La placa de audio interna de Polar Beats cuenta con conectividad Bluetooth 5.2 de latencia ultra baja y Wi-Fi integrado. Se conecta perfectamente a dispositivos de voz (como Alexa y Google Assistant), además de aceptar transmisión directa a través de Spotify Connect y Apple AirPlay.",
    faq_q3: "¿Cómo funciona la garantía del equipo integrado split + audio?",
    faq_a3: "Ofrecemos una garantía de 3 años para el sistema completo y 10 años para el compresor inverter. La asistencia técnica está unificada: nuestros socios de distribución e instaladores de aire acreditados están plenamente capacitados para el mantenimiento preventivo o correctivo del sistema de audio y aire de forma simultánea.",
    faq_q4: "¿La patente de integración de Polar Beats es válida a nivel internacional?",
    faq_a4: "Nuestra patente principal está debidamente registrada en el INPI (Instituto Nacional de la Propiedad Industrial) en Brasil con validez hasta 2038. También contamos con protección internacional bajo el tratado PCT, asegurando derechos de prioridad de diseño para audio integrado en splits en los mercados de América del Norte (EE.UU.) y América Latina.",
    places_kicker: "Flexibilidad de Instalación",
    places_title: "UN PRODUCTO, INFINITOS ESPACIOS",
    places_lead: "Al ser un sistema integrado que no requiere cableado expuesto ni altavoces adicionales, Polar Beats es la elección perfecta para qualquer proyecto arquitectónico residencial o comercial.",
    place1_title: "Hoteles y Moteles de Lujo",
    place1_desc: "Sonido premium y control de clima integrados para la mejor experiencia del huésped, sin contaminación visual en la habitación.",
    place2_title: "Salones de Fiesta y Eventos",
    place2_desc: "Audio ambiental distribuido y climatización potente que mantienen el ambiente y la música en perfecta armonía.",
    place3_title: "Espacios Gourmet y Terrazas",
    place3_desc: "El sonido ideal para barbacoas, cenas y reuniones en un único dispositivo elegante, discreto y potente.",
    place4_title: "Clínicas y Consultorios",
    place4_desc: "Ruido blanco para enmascaramiento acústico (privacidad de consultas) y música ambiental relajante para pacientes.",
    place5_title: "Gimnasios y Estudios",
    place5_desc: "Climatización ideal con sonido de alta energía y cobertura uniforme de 180° para motivar los entrenamientos.",
    place6_title: "Casas y Home Theaters",
    place6_desc: "Clima acogedor y sonido espacial para dormitorios y salas, reemplazando los altavoces convencionales."
  }
};

const flagAssets = {
  pt: '<rect width="22" height="15" fill="#009C3B"/><polygon points="11,1.5 20.5,7.5 11,13.5 1.5,7.5" fill="#FEDF00"/><circle cx="11" cy="7.5" r="3.2" fill="#002776"/><path d="M8,6.5 Q11,5.5 14,6.8" stroke="white" stroke-width="0.7" fill="none"/>',
  en: '<rect width="22" height="15" fill="#B22234"/><rect y="1.15" width="22" height="1.15" fill="white"/><rect y="2.31" width="22" height="1.15" fill="#B22234"/><rect y="3.46" width="22" height="1.15" fill="white"/><rect y="4.62" width="22" height="1.15" fill="#B22234"/><rect y="5.77" width="22" height="1.15" fill="white"/><rect y="6.92" width="22" height="1.15" fill="#B22234"/><rect y="8.08" width="22" height="1.15" fill="white"/><rect y="9.23" width="22" height="1.15" fill="#B22234"/><rect y="10.38" width="22" height="1.15" fill="white"/><rect y="11.54" width="22" height="1.15" fill="#B22234"/><rect y="12.69" width="22" height="1.15" fill="white"/><rect width="9" height="8" fill="#3C3B6E"/>',
  es: '<rect width="22" height="15" fill="#c60b1e"/><rect y="3.5" width="22" height="8" fill="#ffc400"/>'
};

function setLang(lang) {
  try {
    // Save selected language to HTML document element
    document.documentElement.lang = lang;
    
    // Update translation text for all nodes matching data-i18n
    const t = translations[lang];
    if (!t) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      try {
        const key = el.getAttribute('data-i18n');
        if (!t[key]) return;
        
        // Some keys might need HTML injection (like bold elements)
        if (key === 'hero_sub' || key === 'patent_desc') {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      } catch (e) {
        console.error("Error translating element:", el, e);
      }
    });

    // Update input placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      try {
        const key = el.getAttribute('data-i18n-ph');
        if (t[key]) {
          el.placeholder = t[key];
        }
      } catch(e) {
        console.error("Error translating placeholder:", el, e);
      }
    });
    
    // Update Navbar Active Flag & Name Indicator
    const currentFlag = document.getElementById('current-flag');
    const currentLangName = document.getElementById('current-lang-name');
    if (currentFlag && flagAssets[lang]) {
      currentFlag.innerHTML = flagAssets[lang];
    }
    if (currentLangName) {
      currentLangName.textContent = lang.toUpperCase();
    }
    
    // Update mobile active flags indicator
    document.querySelectorAll('.lang-mobile-btn').forEach(btn => {
      try {
        const onclickVal = btn.getAttribute('onclick') || '';
        const onclickStr = typeof onclickVal === 'function' ? onclickVal.toString() : String(onclickVal);
        btn.classList.toggle('active', onclickStr.includes(`'${lang}'`));
      } catch(e) {
        console.error("Error setting mobile flag active state:", btn, e);
      }
    });
  } catch (globalError) {
    console.error("Error in setLang:", globalError);
  }
  
  
  // Update audio simulator content to reflect the new language translation
  try {
    updateTabContent();
  } catch (e) {
    console.error("Error updating tab content:", e);
  }

  // Update B2B Calculator values
  try {
    updateCalculator();
  } catch (e) {
    console.error("Error updating calculator:", e);
  }
}

// Global scope unifier for the floating/older click handlers
window.setLangFloat = function(lang) {
  setLang(lang);
};

// Bind language dropdown toggle
const langBtnCurrent = document.getElementById('lang-btn-current');
const langDropdown = document.getElementById('lang-dropdown');

if (langBtnCurrent && langDropdown) {
  langBtnCurrent.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });
  
  document.addEventListener('click', () => {
    langDropdown.classList.remove('open');
  });
}

// 8. B2B Economy Calculator Logic
const roomsSlider = document.getElementById('calc-rooms-slider');
const roomsVal = document.getElementById('calc-rooms-val');
const resEquip = document.getElementById('calc-res-equip');
const resInstall = document.getElementById('calc-res-install');
const resEnergy = document.getElementById('calc-res-energy');
const resTotal = document.getElementById('calc-res-total');

function updateCalculator() {
  if (!roomsSlider) return;
  const rooms = parseInt(roomsSlider.value);
  if (roomsVal) roomsVal.textContent = rooms;
  
  const currentLang = document.documentElement.lang || 'pt';
  
  // Base values in BRL
  let priceEquip = rooms * 1500;
  let priceInstall = rooms * 1000;
  let priceEnergy = rooms * 850;
  let priceTotal = priceEquip + priceInstall + priceEnergy;
  
  let formattedEquip = '';
  let formattedInstall = '';
  let formattedEnergy = '';
  let formattedTotal = '';
  
  if (currentLang === 'en') {
    // Convert to USD (approx. R$ 5 = $1)
    formattedEquip = `$ ${(priceEquip / 5).toLocaleString('en-US', {maximumFractionDigits:0})}`;
    formattedInstall = `$ ${(priceInstall / 5).toLocaleString('en-US', {maximumFractionDigits:0})}`;
    formattedEnergy = `$ ${(priceEnergy / 5).toLocaleString('en-US', {maximumFractionDigits:0})}`;
    formattedTotal = `$ ${(priceTotal / 5).toLocaleString('en-US', {maximumFractionDigits:0})}`;
  } else if (currentLang === 'es') {
    // Convert to USD
    formattedEquip = `$ ${(priceEquip / 5).toLocaleString('es-ES', {maximumFractionDigits:0})}`;
    formattedInstall = `$ ${(priceInstall / 5).toLocaleString('es-ES', {maximumFractionDigits:0})}`;
    formattedEnergy = `$ ${(priceEnergy / 5).toLocaleString('es-ES', {maximumFractionDigits:0})}`;
    formattedTotal = `$ ${(priceTotal / 5).toLocaleString('es-ES', {maximumFractionDigits:0})}`;
  } else {
    // BRL (pt)
    formattedEquip = `R$ ${priceEquip.toLocaleString('pt-BR')}`;
    formattedInstall = `R$ ${priceInstall.toLocaleString('pt-BR')}`;
    formattedEnergy = `R$ ${priceEnergy.toLocaleString('pt-BR')}`;
    formattedTotal = `R$ ${priceTotal.toLocaleString('pt-BR')}`;
  }
  
  if (resEquip) resEquip.textContent = formattedEquip;
  if (resInstall) resInstall.textContent = formattedInstall;
  if (resEnergy) resEnergy.textContent = formattedEnergy;
  if (resTotal) resTotal.textContent = formattedTotal;
}

if (roomsSlider) {
  roomsSlider.addEventListener('input', updateCalculator);
}

// 9. Canvas Soundwave Visualizer Logic
let canvas = null;
let ctx = null;
let waveAnimationId = null;
let waveOffset = 0;

function initCanvasVisualizer() {
  canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Set canvas display resolution based on actual display size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * (window.devicePixelRatio || 1);
  canvas.height = rect.height * (window.devicePixelRatio || 1);
  
  if (!waveAnimationId) {
    animateWave();
  }
}

function animateWave() {
  if (!canvas || !ctx) {
    waveAnimationId = requestAnimationFrame(animateWave);
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Retrieve color dynamically from CSS variable (--accent-dynamic)
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-dynamic').trim() || '#5dd1ff';
  
  const width = canvas.width;
  const height = canvas.height;
  const centerY = height / 2;
  
  // Modify speed and amplitude depending on active playing state
  const targetAmplitude = isPlaying ? height * 0.35 : height * 0.05;
  const speed = isPlaying ? 0.12 : 0.02;
  
  waveOffset += speed;
  
  // We will draw 3 overlapping waves
  const waves = [
    { amplitude: targetAmplitude, frequency: 0.015, phase: waveOffset, opacity: 0.8, lineWidth: 2 },
    { amplitude: targetAmplitude * 0.6, frequency: 0.025, phase: -waveOffset * 0.8 + 2, opacity: 0.4, lineWidth: 1.5 },
    { amplitude: targetAmplitude * 0.3, frequency: 0.04, phase: waveOffset * 0.5 + 4, opacity: 0.2, lineWidth: 1 }
  ];
  
  waves.forEach(w => {
    ctx.beginPath();
    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = w.opacity;
    ctx.lineWidth = w.lineWidth * (window.devicePixelRatio || 1);
    
    for (let x = 0; x < width; x++) {
      // Create a nice envelope to taper the wave at both left and right edges
      const envelope = Math.sin((x / width) * Math.PI);
      const y = centerY + Math.sin(x * w.frequency + w.phase) * w.amplitude * envelope;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  });
  
  waveAnimationId = requestAnimationFrame(animateWave);
}

// 10. FAQ Accordion Logic
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentNode;
    const isActive = item.classList.contains('active');
    const answer = item.querySelector('.faq-answer');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('active');
      other.querySelector('.faq-answer').style.maxHeight = '0';
      other.querySelector('.faq-answer').style.opacity = '0';
    });
    
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
    }
  });
});

// Set default language on load
document.addEventListener('DOMContentLoaded', () => {
  setLang('pt');
  updateCalculator();
  initCanvasVisualizer();
});
