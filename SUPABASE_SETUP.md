# Supabase Password Reset Setup

## 1. Email Template

Go to: **Supabase Dashboard → Authentication → Email Templates → Reset Password**

**Subject:**
```
Reset your Optimeta password
```

**Body:**
```
Hi,

You requested to reset your Optimeta password. Click the link below to set a new password:

{{ .ConfirmationURL }}

This link expires in 1 hour.

If you didn't request this, you can safely ignore this email.

— The Optimeta Team
optimeta.tech
```

---

## 2. Redirect URLs

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Add these to **Redirect URLs**:
```
https://optimeta.tech/reset-password
http://localhost:3000/reset-password
```

---

## 3. Site URL

Set **Site URL** to:
```
https://optimeta.tech
```
