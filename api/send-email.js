// ============================================================
// /api/send-email.js
// Vercel serverless function — sends emails via Resend
// Student gets a welcome email, you get a notification
// ============================================================

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, city } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const OWNER_EMAIL = process.env.OWNER_EMAIL; // zmohomad78@gmail.com

  try {
    // ── EMAIL 1: Welcome email to the student ──
    const studentEmail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AI Mastery <onboarding@resend.dev>', // Change to your domain email later
        to: [email],
        subject: '🎉 Enrollment Received — AI Mastery',
        html: studentEmailTemplate(name)
      })
    });

    // ── EMAIL 2: Notification to you (the owner) ──
    const ownerEmail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AI Mastery <onboarding@resend.dev>',
        to: [OWNER_EMAIL],
        subject: `🔔 New Enrollment: ${name}`,
        html: ownerEmailTemplate(name, email, phone, city)
      })
    });

    if (!studentEmail.ok && !ownerEmail.ok) {
      throw new Error('Both emails failed to send');
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ── STUDENT WELCOME EMAIL TEMPLATE ──
function studentEmailTemplate(name) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AI Mastery</title>
</head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#0c0c0f;padding:32px 40px;text-align:center;">
      <div style="font-size:1.4rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:white;">
        AI<span style="color:#ff4d00;">Mastery</span>
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);letter-spacing:0.15em;margin-top:4px;">SRI LANKA'S AI COURSE</div>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <div style="font-size:2rem;margin-bottom:12px;">🎉</div>
      <h1 style="font-size:1.5rem;color:#0c0c0f;margin:0 0 12px;font-weight:700;">
        Enrollment Received, ${name}!
      </h1>
      <p style="color:#7a7468;line-height:1.7;margin:0 0 24px;font-size:0.95rem;">
        We've received your enrollment for <strong style="color:#0c0c0f;">AI Mastery</strong>. 
        Once we verify your bank transfer (usually within 24 hours), we'll send you your course access link and Discord invite.
      </p>

      <!-- What happens next -->
      <div style="background:#f7f3ee;border-radius:12px;padding:24px;margin-bottom:24px;">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#ff4d00;margin-bottom:16px;">What Happens Next</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <div style="width:24px;height:24px;background:#ff4d00;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem;font-weight:700;flex-shrink:0;text-align:center;line-height:24px;">1</div>
            <div style="font-size:0.88rem;color:#0c0c0f;line-height:1.5;"><strong>We verify your payment</strong><br><span style="color:#7a7468;">Usually within 24 hours of your transfer</span></div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <div style="width:24px;height:24px;background:#ff4d00;border-radius:50%;color:white;font-size:0.7rem;font-weight:700;flex-shrink:0;text-align:center;line-height:24px;">2</div>
            <div style="font-size:0.88rem;color:#0c0c0f;line-height:1.5;"><strong>You receive course access</strong><br><span style="color:#7a7468;">Course link sent to this email address</span></div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <div style="width:24px;height:24px;background:#ff4d00;border-radius:50%;color:white;font-size:0.7rem;font-weight:700;flex-shrink:0;text-align:center;line-height:24px;">3</div>
            <div style="font-size:0.88rem;color:#0c0c0f;line-height:1.5;"><strong>Discord community invite</strong><br><span style="color:#7a7468;">Join your fellow Sri Lankan AI learners</span></div>
          </div>
        </div>
      </div>

      <!-- What you get -->
      <div style="margin-bottom:28px;">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#7a7468;margin-bottom:14px;">Your Enrollment Includes</div>
        ${['21 Modules across 3 Learning Paths', '1-Year Full Access', 'Certificate on Completion 🎓', 'Private Discord Community', 'AI Income System Blueprint'].map(item => `
        <div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #f0ebe4;">
          <span style="color:#ff4d00;font-size:0.8rem;">✓</span>
          <span style="font-size:0.88rem;color:#0c0c0f;">${item}</span>
        </div>`).join('')}
      </div>

      <!-- Questions -->
      <p style="font-size:0.85rem;color:#7a7468;line-height:1.7;margin:0 0 20px;">
        Have questions? WhatsApp us directly at 
        <a href="https://wa.me/94753863070" style="color:#ff4d00;text-decoration:none;font-weight:600;">+94 75 386 3070</a>
        — we reply fast.
      </p>

      <a href="https://wa.me/94753863070?text=Hi%2C%20I%20just%20enrolled%20in%20AI%20Mastery%21" 
         style="display:inline-block;background:#ff4d00;color:white;padding:14px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.88rem;letter-spacing:0.04em;">
        Message Us on WhatsApp →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f7f3ee;padding:24px 40px;text-align:center;border-top:1px solid #ede8e1;">
      <div style="font-size:0.78rem;color:#7a7468;">
        © 2026 AI Mastery · Made for Sri Lanka 🇱🇰<br>
        <a href="https://aimastery.lk" style="color:#ff4d00;text-decoration:none;">aimastery.lk</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── OWNER NOTIFICATION EMAIL TEMPLATE ──
function ownerEmailTemplate(name, email, phone, city) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <div style="background:#ff4d00;padding:24px 32px;">
      <div style="font-size:1.1rem;font-weight:700;color:white;">🔔 New Enrollment!</div>
      <div style="font-size:0.8rem;color:rgba(255,255,255,0.8);margin-top:4px;">AI Mastery · ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' })} (SL time)</div>
    </div>

    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;color:#7a7468;font-size:0.82rem;width:110px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-weight:600;font-size:0.9rem;">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;color:#7a7468;font-size:0.82rem;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:0.9rem;">${email}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;color:#7a7468;font-size:0.82rem;">WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:0.9rem;">${phone}</td></tr>
        <tr><td style="padding:10px 0;color:#7a7468;font-size:0.82rem;">City</td><td style="padding:10px 0;font-size:0.9rem;">${city || '—'}</td></tr>
      </table>

      <div style="margin-top:24px;background:#fff8e1;border:1px solid #ffe082;border-radius:10px;padding:16px;font-size:0.85rem;color:#7a6000;">
        ⚠️ <strong>Action needed:</strong> Check your bank account for a Rs. 30,000 transfer from ${name}. Once confirmed, send the course access link and Discord invite to <strong>${email}</strong>.
      </div>

      <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(name)}%2C%20we%20have%20verified%20your%20payment%21%20Here%20is%20your%20course%20access%3A%20%5BLINK%5D" 
           style="display:inline-block;background:#25D366;color:white;padding:12px 20px;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.82rem;">
          WhatsApp ${name} →
        </a>
        <a href="https://supabase.com" 
           style="display:inline-block;background:#0c0c0f;color:white;padding:12px 20px;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.82rem;">
          View in Supabase →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
