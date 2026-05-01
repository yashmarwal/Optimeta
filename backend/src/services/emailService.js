const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (toEmail, fullName) => {
  try {
    const firstName = fullName?.split(' ')[0] || 'there';

    await resend.emails.send({
      from: 'Optimeta <hello@optimeta.tech>',
      to: toEmail,
      subject: 'Welcome to Optimeta — Your First Campaign Awaits 🚀',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Optimeta</title>
</head>
<body style="margin:0; padding:0; background-color:#0A0A0F; font-family: Arial, sans-serif;">

  <div style="max-width:600px; margin:0 auto; padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:32px;">
      <h1 style="margin:0; font-size:32px; font-weight:900; background: linear-gradient(135deg, #7B2FBE, #C026D3); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
        OPTIMETA
      </h1>
      <p style="color:#606080; font-size:14px; margin:4px 0 0;">
        AI Meta Ad Campaign Architect
      </p>
    </div>

    <!-- Main Card -->
    <div style="background:#0F0F1A; border:1px solid #1E1E3A; border-radius:16px; padding:32px;">

      <!-- Greeting -->
      <h2 style="color:#ffffff; font-size:24px; margin:0 0 8px;">
        Welcome, ${firstName}! 👋
      </h2>
      <p style="color:#A0A0C0; font-size:16px; line-height:1.6; margin:0 0 24px;">
        You're now part of India's most advanced Meta ad campaign platform. Your first campaign blueprint is just minutes away.
      </p>

      <!-- What you get -->
      <div style="background:#141428; border-radius:12px; padding:20px; margin-bottom:24px;">
        <p style="color:#7B2FBE; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin:0 0 12px;">
          What's inside every blueprint
        </p>
        <div style="color:#A0A0C0; font-size:14px; line-height:2;">
          🎯 Campaign objective &amp; funnel strategy<br>
          👥 Audience targeting (interests + behaviors + demographics)<br>
          💰 Budget split &amp; scaling logic<br>
          ✍️ 3 ready-to-use ad copies (Feed, Reel, Story)<br>
          🎨 Creative direction &amp; UGC brief<br>
          📋 8-step launch checklist<br>
          📊 Performance benchmarks &amp; ROAS targets<br>
          🗓️ First 7 days action plan
        </div>
      </div>

      <!-- Free plan note -->
      <div style="background:rgba(123,47,190,0.1); border:1px solid rgba(123,47,190,0.3); border-radius:12px; padding:16px; margin-bottom:24px;">
        <p style="color:#ffffff; font-size:14px; margin:0 0 4px; font-weight:bold;">
          🎁 You're on the Free Plan
        </p>
        <p style="color:#A0A0C0; font-size:13px; margin:0;">
          Generate 1 campaign blueprint for free. Upgrade to Pro (&#x20B9;499/month) for 5 campaigns per month.
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="https://optimeta.tech/dashboard/new"
           style="display:inline-block; background:linear-gradient(135deg, #7B2FBE, #C026D3); color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:16px;">
          Generate Your First Campaign &#x2192;
        </a>
      </div>
    </div>

    <!-- Tips section -->
    <div style="margin-top:24px; padding:24px; background:#0F0F1A; border:1px solid #1E1E3A; border-radius:16px;">
      <p style="color:#7B2FBE; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin:0 0 12px;">
        Pro tip for best results
      </p>
      <p style="color:#A0A0C0; font-size:14px; line-height:1.6; margin:0;">
        Fill in as much detail as possible about your business — especially your ideal customer, competitors, and available assets. The more context you give, the more precise your blueprint will be.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; margin-top:32px;">
      <p style="color:#606080; font-size:12px; line-height:1.8; margin:0;">
        Questions? Reply to this email or contact us at
        <a href="mailto:optimeta@outlook.com" style="color:#7B2FBE;">optimeta@outlook.com</a><br>
        <a href="https://optimeta.tech" style="color:#7B2FBE; text-decoration:none;">optimeta.tech</a>
        &nbsp;•&nbsp;
        <a href="https://optimeta.tech/terms" style="color:#606080; text-decoration:none;">Terms</a>
        &nbsp;•&nbsp;
        <a href="https://optimeta.tech/privacy" style="color:#606080; text-decoration:none;">Privacy</a>
      </p>
    </div>

  </div>
</body>
</html>
      `,
    });

    console.log('Welcome email sent to:', toEmail);
    return true;
  } catch (error) {
    // Never block registration if email fails
    console.error('Welcome email failed:', error.message);
    return false;
  }
};

module.exports = { sendWelcomeEmail };
