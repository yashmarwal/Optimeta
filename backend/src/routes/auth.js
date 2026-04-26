const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { checkFingerprintAbuse } = require('../services/fingerprintService');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
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

    // Fingerprint abuse check for free users
    const ip = req.ip || req.connection.remoteAddress || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';

    const { abused, reason } = await checkFingerprintAbuse({
      ip,
      userAgent,
      screenResolution: screenResolution || 'unknown',
      timezone: timezone || 'unknown',
      email,
    });

    if (abused) {
      return res.status(403).json({ success: false, message: reason || 'Free trial already used. Please upgrade to continue.' });
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

    res.cookie('optimeta_token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName,
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
    const token = req.cookies?.optimeta_token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
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
    const token = req.cookies?.optimeta_token || req.headers.authorization?.split(' ')[1];
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

// DELETE /api/auth/account
router.delete('/account', async (req, res) => {
  try {
    const token = req.cookies?.optimeta_token || req.headers.authorization?.split(' ')[1];
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
