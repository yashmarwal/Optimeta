const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { checkFingerprintAbuse, storeFingerprint } = require('../services/fingerprintService');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const isProd = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  // cross-origin (Vercel ↔ Render) requires sameSite:'none' + secure:true
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, screenResolution, timezone, canvasHash } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // Real IP: use x-forwarded-for first (Render proxy), fall back to socket
    const ip = (req.headers['x-forwarded-for']?.split(',')[0]?.trim()) ||
               req.ip || req.socket?.remoteAddress || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';

    let fingerprintHash;
    try {
      const fpResult = await checkFingerprintAbuse({
        ip,
        userAgent,
        screenResolution: screenResolution || 'unknown',
        timezone: timezone || 'unknown',
        email,
      });
      if (fpResult.abused) {
        return res.status(403).json({ success: false, message: fpResult.reason || 'Free trial already used on this device. Please upgrade to continue.' });
      }
      fingerprintHash = fpResult.fingerprintHash;
    } catch {
      // Don't block registration if fingerprint service is unavailable
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: true,
    });

    if (authError) {
      if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }
      return res.status(400).json({ success: false, message: authError.message });
    }

    // Explicitly create profile (in case trigger didn't fire due to RLS)
    await supabase.from('profiles').upsert({
      id: authData.user.id,
      email,
      full_name: fullName,
      plan: 'free',
      campaigns_used: 0,
    }, { onConflict: 'id', ignoreDuplicates: true });

    const token = generateToken(authData.user.id);

    // Store fingerprint so subsequent registrations from same device are blocked
    storeFingerprint({
      userId: authData.user.id,
      email,
      ip,
      userAgent,
      screenResolution: screenResolution || 'unknown',
      timezone: timezone || 'unknown',
      fingerprintHash,
    }).catch(() => {});

    res.cookie('optimeta_token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName,
          plan: 'free',
          campaignsUsed: 0,
        },
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const token = generateToken(authData.user.id);

    console.log(`[Auth] Login: ${profile.email} | JWT_SECRET length: ${process.env.JWT_SECRET?.length ?? 'MISSING'}`);

    res.cookie('optimeta_token', token, COOKIE_OPTIONS);

    return res.json({
      success: true,
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          plan: profile.plan,
          campaignsUsed: profile.campaigns_used,
        },
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('optimeta_token');
  return res.json({ success: true, data: { message: 'Logged out successfully.' } });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.optimeta_token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.warn(`[Auth] /me verify failed: ${err.message} | JWT_SECRET length: ${process.env.JWT_SECRET?.length ?? 'MISSING'} | token prefix: ${token.slice(0, 20)}`);
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          plan: profile.plan,
          campaignsUsed: profile.campaigns_used,
          billingCycleStart: profile.billing_cycle_start,
          createdAt: profile.created_at,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
});

// PATCH /api/auth/profile
router.patch('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.optimeta_token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    const { fullName } = req.body;
    if (!fullName) return res.status(400).json({ success: false, message: 'Full name is required.' });

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', decoded.userId);

    if (error) throw error;

    return res.json({ success: true, data: { message: 'Profile updated.' } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const frontendUrl = process.env.FRONTEND_URL || 'https://optimeta.tech';
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${frontendUrl}/reset-password`,
    });

    return res.json({
      success: true,
      message: 'If this email exists, a reset link has been sent.',
    });
  } catch {
    // Always return success — never reveal whether email exists
    return res.json({
      success: true,
      message: 'If this email exists, a reset link has been sent.',
    });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { access_token, new_password } = req.body;
    if (!access_token || !new_password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // Verify the token and get the user
    const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link. Please request a new one.' });
    }

    // Update password via admin API
    const { error } = await supabase.auth.admin.updateUserById(userData.user.id, {
      password: new_password,
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch {
    return res.status(500).json({ success: false, message: 'Password reset failed. Please try again.' });
  }
});

// DELETE /api/auth/account
router.delete('/account', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.optimeta_token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    const { error } = await supabase.auth.admin.deleteUser(decoded.userId);
    if (error) throw error;

    res.clearCookie('optimeta_token');
    return res.json({ success: true, data: { message: 'Account deleted.' } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Account deletion failed.' });
  }
});

module.exports = router;
