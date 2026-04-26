const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.optimeta_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !profile) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.user = profile;
    req.userId = profile.id;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

module.exports = authMiddleware;
