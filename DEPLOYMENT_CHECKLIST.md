# Optimeta — Production Deployment Checklist

## 1. Render — Backend Environment Variables

Go to: Render Dashboard → Your Service → Environment → Add Variable

```
ANTHROPIC_API_KEY=sk-ant-...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=<live secret>
RAZORPAY_PLAN_PRO=<live plan_id for ₹499/mo>
RAZORPAY_PLAN_ULTRA=<live plan_id for ₹999/mo>
RAZORPAY_WEBHOOK_SECRET=<webhook secret from Razorpay dashboard>
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key>
JWT_SECRET=<strong random secret, min 64 chars>
FRONTEND_URL=https://optimeta-pink.vercel.app
NODE_ENV=production
PORT=4000
```

After adding variables → trigger a manual redeploy.

---

## 2. Vercel — Frontend Environment Variables

Go to: Vercel Dashboard → optimeta → Settings → Environment Variables

```
NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```

After adding → run: `vercel --prod` from the frontend/ folder.

---

## 3. Razorpay — Live Webhook Setup

Go to: Razorpay Dashboard → Settings → Webhooks → Add New Webhook

```
Webhook URL:
https://<your-render-service>.onrender.com/api/payments/webhook

Secret: <same value as RAZORPAY_WEBHOOK_SECRET above>

Active Events (check all):
  ✓ subscription.activated
  ✓ subscription.charged
  ✓ subscription.cancelled
  ✓ subscription.expired
  ✓ subscription.completed
  ✓ payment.failed
```

---

## 4. Razorpay — Create Live Plans

Go to: Razorpay Dashboard → Subscriptions → Plans → Create Plan

**Pro Plan (₹499/month)**
- Plan Name: Optimeta Pro
- Billing Amount: 49900 (paise)
- Billing Period: monthly
- Interval: 1
→ Copy Plan ID → set as RAZORPAY_PLAN_PRO

**Ultra Plan (₹999/month)**
- Plan Name: Optimeta Ultra
- Billing Amount: 99900 (paise)
- Billing Period: monthly
- Interval: 1
→ Copy Plan ID → set as RAZORPAY_PLAN_ULTRA

---

## 5. Supabase — Add cancelled_at Column

Run this in Supabase SQL Editor:

```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
```

---

## 6. Verify Deployment

1. Visit https://optimeta-pink.vercel.app
2. Register a new account → should land on /dashboard
3. Generate a campaign → blueprint should render with all new sections
4. Check Render logs → should show:
   - SUPABASE_URL: loaded
   - ANTHROPIC_API_KEY: loaded
   - RAZORPAY_KEY_ID: loaded
