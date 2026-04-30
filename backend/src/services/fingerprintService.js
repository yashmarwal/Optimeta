const crypto = require('crypto');
const supabase = require('../config/supabase');

const buildCompositeHash = ({ ip, userAgent, screenResolution, timezone, canvasFingerprint, language }) => {
  const signals = [
    ip,
    userAgent || '',
    screenResolution || '',
    timezone || '',
    canvasFingerprint || '',
    language || '',
  ].join('::');
  return crypto.createHash('sha256').update(signals).digest('hex');
};

const checkAndStoreFingerprint = async (userId, email, ip, deviceData) => {
  try {
    const fingerprintHash = buildCompositeHash({
      ip,
      userAgent: deviceData?.userAgent || '',
      screenResolution: deviceData?.screenResolution || '',
      timezone: deviceData?.timezone || '',
      canvasFingerprint: deviceData?.canvasFingerprint || '',
      language: deviceData?.language || '',
    });

    // Check 1: session flag set by frontend (same browser tab already registered)
    if (deviceData?.sessionFlag === 'true') {
      return { allowed: false, reason: 'Free trial already used on this device. Please upgrade to continue.' };
    }

    // Check 2: exact composite fingerprint match
    const { data: exactMatch } = await supabase
      .from('free_trial_fingerprints')
      .select('id')
      .eq('fingerprint_hash', fingerprintHash)
      .limit(1)
      .single();

    if (exactMatch) {
      return { allowed: false, reason: 'Free trial already used on this device. Please upgrade to continue.' };
    }

    // Check 3: same IP with 2+ prior registrations
    const { count } = await supabase
      .from('free_trial_fingerprints')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ip);

    if (count >= 2) {
      return { allowed: false, reason: 'Too many free trial accounts from this network. Please upgrade to continue.' };
    }

    // All checks passed — store fingerprint
    await supabase.from('free_trial_fingerprints').insert({
      fingerprint_hash: fingerprintHash,
      ip_address: ip,
      email,
      user_id: userId,
      user_agent: deviceData?.userAgent || null,
      screen_resolution: deviceData?.screenResolution || null,
      timezone: deviceData?.timezone || null,
    });

    return { allowed: true };
  } catch (error) {
    console.error('[Fingerprint] Error:', error);
    // Never block registration on service error
    return { allowed: true };
  }
};

// Legacy compat — kept for any existing call sites
const checkFingerprintAbuse = async ({ ip, userAgent, screenResolution, timezone, email }) => {
  const fingerprintHash = buildCompositeHash({ ip, userAgent, screenResolution, timezone });

  const { data: hashMatches } = await supabase
    .from('free_trial_fingerprints')
    .select('id')
    .eq('fingerprint_hash', fingerprintHash)
    .limit(1);

  if (hashMatches && hashMatches.length > 0) {
    return { abused: true, reason: 'Device fingerprint already used for a free trial.' };
  }

  const { count } = await supabase
    .from('free_trial_fingerprints')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip);

  if (count >= 2) {
    return { abused: true, reason: 'Too many free trial accounts from this network.' };
  }

  return { abused: false, fingerprintHash };
};

const storeFingerprint = async ({ userId, email, ip, userAgent, screenResolution, timezone, fingerprintHash }) => {
  const hash = fingerprintHash || buildCompositeHash({ ip, userAgent, screenResolution, timezone });
  await supabase.from('free_trial_fingerprints').insert({
    fingerprint_hash: hash,
    ip_address: ip,
    email,
    user_id: userId,
    user_agent: userAgent || null,
    screen_resolution: screenResolution || null,
    timezone: timezone || null,
  });
};

module.exports = { checkAndStoreFingerprint, checkFingerprintAbuse, storeFingerprint, buildCompositeHash };
