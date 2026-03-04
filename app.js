// ============================================================
// AI MASTERY — app.js
// Handles: cursor, particles, form, Supabase save, email via API
// ============================================================

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function ac() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(ac);
})();
document.querySelectorAll('a, button, .path-tab, .faq-btn, .pain-card, .module-row, .card-path, .file-label, .chat-chip, .community-card, .contact-method').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
});

// ── PARTICLES ──
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function rc() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
rc(); window.addEventListener('resize', rc);
const pts = Array.from({ length: 55 }, () => ({
  x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
  r: Math.random() * 1.4 + 0.4, o: Math.random() * 0.4 + 0.1
}));
(function dp() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,77,0,${p.o})`; ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 110) {
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
      ctx.strokeStyle = `rgba(255,77,0,${0.06 * (1 - d / 110)})`; ctx.lineWidth = 0.6; ctx.stroke();
    }
  }
  requestAnimationFrame(dp);
})();

// ── 3D TILT ──
document.querySelectorAll('.pain-card, .hero-card-main, .enroll-card, .cert-visual, .community-card').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) scale(1.02)`;
    el.style.transition = 'transform .08s ease';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(700px) rotateY(0) rotateX(0) scale(1)';
    el.style.transition = 'transform .45s ease';
  });
});

// ── NAV SCROLL ──
window.addEventListener('scroll', () => document.getElementById('main-nav').classList.toggle('nav-scrolled', window.scrollY > 30));

// ── CURRICULUM TABS ──
function switchTab(id, el) {
  document.querySelectorAll('.path-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.path-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

// ── FAQ ──
function toggleFaq(btn) {
  const item = btn.closest('.faq-item'), open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

// ── PAYMENT SLIP ──
let slipFile = null;
function handleSlip(input) {
  if (input.files[0]) {
    slipFile = input.files[0];
    document.getElementById('slip-name').textContent = ' ✓ ' + slipFile.name;
  }
}

// ── VIDEO ──
// Replace YOUR_YOUTUBE_VIDEO_ID with your actual YouTube video ID
function loadVideo() {
  const videoId = 'YOUR_YOUTUBE_VIDEO_ID';
  const iframe = document.getElementById('video-iframe');
  iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  iframe.style.display = 'block';
  document.getElementById('video-placeholder').style.display = 'none';
}

// ── SUPABASE CLIENT ──
let supabase = null;
try {
  if (typeof SUPABASE_URL !== "undefined" && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch(e) { console.warn("Supabase not configured"); }

// ── SHOW STATUS MESSAGE ──
function showStatus(msg, type) {
  const el = document.getElementById('form-status');
  el.textContent = msg;
  el.className = 'form-status ' + type;
  el.style.display = 'block';
}
function hideStatus() {
  document.getElementById('form-status').style.display = 'none';
}

// ── MAIN ENROLLMENT HANDLER ──
async function handleEnroll() {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const city  = document.getElementById('f-city').value.trim();

  // Basic validation
  if (!name || !email || !phone) {
    const card = document.getElementById('enroll-card');
    card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 500);
    showStatus('⚠️ Please fill in your name, email, and WhatsApp number.', 'error');
    return;
  }

  const btn = document.getElementById('enroll-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';
  showStatus('⏳ Saving your enrollment...', 'loading');

  try {
    // 1. Save to Supabase
    if (!supabase) throw new Error("Database not configured — contact us on WhatsApp");
    const { error: dbError } = await supabase
      .from('enrollments')
      .insert([{
        full_name: name,
        email: email,
        phone: phone,
        city: city || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }]);

    if (dbError) throw new Error('Database error: ' + dbError.message);

    showStatus('⏳ Sending confirmation emails...', 'loading');

    // 2. Send emails via our Vercel API route
    const emailRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, city })
    });

    if (!emailRes.ok) {
      // Email failed but enrollment saved — still show success
      console.warn('Email send failed, but enrollment saved');
    }

    // 3. Show success
    hideStatus();
    document.getElementById('form-state').style.display = 'none';
    document.getElementById('success-state').style.display = 'block';

  } catch (err) {
    console.error(err);
    showStatus('❌ Something went wrong. Please WhatsApp us at +94 75 386 3070', 'error');
    btn.disabled = false;
    btn.textContent = 'Complete Enrollment →';
  }
}

// ── CHATBOT ──
const replies = {
  'what is ai mastery': "AI Mastery is Sri Lanka's #1 AI course 🇱🇰 It has 3 paths — Foundation, Builder, and Master — with 21 modules total. You'll go from zero to earning with AI!",
  'how much': "The course is $100 (≈ Rs. 30,000 LKR) — one-time payment. You get 1-year access, a completion certificate, and Discord community. 🎓",
  'cost': "The course is $100 (≈ Rs. 30,000 LKR) — one-time. 1-year access + certificate + Discord all included!",
  'enroll': "Scroll to the Enrollment section ↓ Transfer Rs.30,000 to our bank account, upload your slip, fill your details and submit. We confirm via email within 24hrs! ✅",
  'certificate': "Yes! 🏆 Complete all 21 modules and we issue your official AI Mastery certificate — great for CVs, LinkedIn, and freelance profiles.",
  'discord': "A private community for all students! Ask questions, share wins, get help, and network with Sri Lankan AI learners. You get access when you enroll. 💬",
  'access': "1 full year from enrollment date. Plenty of time to complete all 3 paths and start earning! 📅",
  'earn': "Yes! The Master path is built around earning — freelancing, content, automation services, and building AI income systems. 💸",
  'whatsapp': "Message us at +94 75 386 3070 — we reply fast! 💬",
  'contact': "WhatsApp: +94 75 386 3070 · Facebook/Instagram/TikTok: @aimastery.lk 📱",
  'default': "Great question! For the best answer, message us on WhatsApp at +94 75 386 3070 and we'll help you right away. 💬"
};
function getReply(msg) {
  const l = msg.toLowerCase();
  for (const k of Object.keys(replies)) { if (k !== 'default' && l.includes(k)) return replies[k]; }
  return replies['default'];
}
function addMsg(text, cls) {
  const el = document.createElement('div'); el.className = 'chat-msg ' + cls; el.textContent = text;
  const msgs = document.getElementById('chat-messages'); msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
}
function sendChat() {
  const input = document.getElementById('chat-input'), text = input.value.trim(); if (!text) return;
  addMsg(text, 'user'); input.value = '';
  document.getElementById('chat-chips').style.display = 'none';
  const typing = document.createElement('div'); typing.className = 'chat-msg typing'; typing.textContent = 'Typing...';
  document.getElementById('chat-messages').appendChild(typing); document.getElementById('chat-messages').scrollTop = 9999;
  setTimeout(() => { typing.remove(); addMsg(getReply(text), 'bot'); }, 900);
}
function askChip(t) { document.getElementById('chat-input').value = t; sendChat(); }
function toggleChat() {
  const w = document.getElementById('chat-window'), b = document.getElementById('chat-btn'), open = w.classList.contains('open');
  w.classList.toggle('open'); b.textContent = open ? '🤖' : '✕';
}

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08 });
document.querySelectorAll('.sr').forEach(el => obs.observe(el));
