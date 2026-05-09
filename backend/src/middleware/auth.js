const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.optimeta_token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.warn(`[Auth] Token verify failed: ${err.message} | JWT_SECRET length: ${process.env.JWT_SECRET?.length ?? 'MISSING'} | token prefix: ${token.slice(0, 20)}`);
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    // Normalize userId — JWT payload may use userId, id, or sub
    const userId = decoded.userId || decoded.id || decoded.sub;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload.' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.user = { ...profile, id: profile.id, userId: profile.id };
    req.userId = profile.id;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

module.exports = authMiddleware;
