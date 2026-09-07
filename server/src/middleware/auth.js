const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

const authenticateToken = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No authorization token provided.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User account no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ success: false, message: 'Authentication internal server error.' });
  }
};

module.exports = { authenticateToken };
