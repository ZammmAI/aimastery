// ============================================================
// netlify/functions/send-email.js
// Netlify serverless function — sends emails via Resend
// ============================================================

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, phone, city } = body;

  if (!name || !email) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const OWNER_EMAIL = process.env.OWNER_EMAIL;

  try {
    // EMAIL 1: Welcome email to the student
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AI Mastery <onboarding@resend.dev>',
        to: [email],
        subject: '🎉 Enrollment Received — AI Mastery',
        html: studentEmailTemplate(name)
      })
    });

    // EMAIL 2: Notification to you
    await fetch('https://api.resend.com/emails', {
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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Email error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

function studentEmailTemplate(name) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0c0c0f;padding:32px 40px;text-align:center;">
      <div style="font-size:1.4rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:white;">
        AI<span style="color:#ff4d00;">Mastery</span>
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);letter-spacing:0.15em;margin-top:4px;">SRI LANKA'S AI COURSE</div>
    </div>
    <div style="padding:40px;">
      <div style="font-size:2rem;margin-bottom:12px;">🎉</div>
      <h1 style="font-size:1.5rem;color:#0c0c0f;margin:0 0 12px;font-weight:700;">Enrollment Received, ${name}!</h1>
      <p style="color:#7a7468;line-height:1.7;margin:0 0 24px;font-size:0.95rem;">
        We've received your enrollment for <strong style="color:#0c0c0f;">AI Mastery</strong>. 
        Once we verify your bank transfer (within 24 hours), we'll send your course access link and Discord invite.
      </p>
      <div style="background:#f7f3ee;border-radius:12px;padding:24px;margin-bottom:24px;">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#ff4d00;margin-bottom:16px;">What Happens Next</div>
        <div style="margin-bottom:12px;font-size:0.88rem;color:#0c0c0f;"><span style="background:#ff4d00;color:white;border-radius:50%;padding:2px 7px;margin-right:10px;font-weight:700;">1</span><strong>We verify your payment</strong> — within 24 hours</div>
        <div style="margin-bottom:12px;font-size:0.88rem;color:#0c0c0f;"><span style="background:#ff4d00;color:white;border-radius:50%;padding:2px 7px;margin-right:10px;font-weight:700;">2</span><strong>Course access sent</strong> — to this email</div>
        <div style="font-size:0.88rem;color:#0c0c0f;"><span style="background:#ff4d00;color:white;border-radius:50%;padding:2px 7px;margin-right:10px;font-weight:700;">3</span><strong>Discord invite</strong> — join your community</div>
      </div>
      <p style="font-size:0.85rem;color:#7a7468;margin:0 0 20px;">
        Questions? WhatsApp us at <a href="https://wa.me/94753863070" style="color:#ff4d00;text-decoration:none;font-weight:600;">+94 75 386 3070</a>
      </p>
      <a href="https://wa.me/94753863070" style="display:inline-block;background:#ff4d00;color:white;padding:14px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.88rem;">
        Message Us on WhatsApp →
      </a>
    </div>
    <div style="background:#f7f3ee;padding:24px 40px;text-align:center;border-top:1px solid #ede8e1;">
      <div style="font-size:0.78rem;color:#7a7468;">© 2026 AI Mastery · Made for Sri Lanka 🇱🇰</div>
    </div>
  </div>
</body>
</html>`;
}

function ownerEmailTemplate(name, email, phone, city) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#ff4d00;padding:24px 32px;">
      <div style="font-size:1.1rem;font-weight:700;color:white;">🔔 New Enrollment!</div>
      <div style="font-size:0.8rem;color:rgba(255,255,255,0.8);margin-top:4px;">AI Mastery · ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' })} SL time</div>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;color:#7a7468;font-size:0.82rem;width:100px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;color:#7a7468;font-size:0.82rem;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;">${email}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;color:#7a7468;font-size:0.82rem;">WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe4;">${phone}</td></tr>
        <tr><td style="padding:10px 0;color:#7a7468;font-size:0.82rem;">City</td><td style="padding:10px 0;">${city || '—'}</td></tr>
      </table>
      <div style="margin-top:24px;background:#fff8e1;border:1px solid #ffe082;border-radius:10px;padding:16px;font-size:0.85rem;color:#7a6000;">
        ⚠️ <strong>Action needed:</strong> Verify Rs. 30,000 transfer from ${name}. Then send course access + Discord invite to <strong>${email}</strong>
      </div>
      <div style="margin-top:20px;">
        <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(name)}%2C%20your%20payment%20is%20verified!%20Here%20is%20your%20course%20access%3A%20%5BLINK%5D"
           style="display:inline-block;background:#25D366;color:white;padding:12px 20px;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.82rem;">
          WhatsApp ${name} →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
