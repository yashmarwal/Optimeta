const crypto = require('crypto');
const supabase = require('../config/supabase');

const buildCompositeHash = ({ ip, userAgent, screenResolution, timezone }) => {
  const raw = `${ip}|${userAgent}|${screenResolution}|${timezone}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
};

const checkFingerprintAbuse = async ({ ip, userAgent, screenResolution, timezone, email }) => {
  const fingerprintHash = buildCompositeHash({ ip, userAgent, screenResolution, timezone });

  // Check hash match
  const { data: hashMatches, error: hashErr } = await supabase
    .from('free_trial_fingerprints')
    .select('id, email')
    .eq('fingerprint_hash', fingerprintHash)
    .limit(1);

  if (hashErr) throw hashErr;
  if (hashMatches && hashMatches.length > 0) {
    return { abused: true, reason: 'Device fingerprint already used for a free trial.' };
  }

  // Check IP abuse (more than 2 entries from same IP)
  const { count, error: ipErr } = await supabase
    .from('free_trial_fingerprints')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip);

  if (ipErr) throw ipErr;
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
  });
};

module.exports = { checkFingerprintAbuse, storeFingerprint, buildCompositeHash };
