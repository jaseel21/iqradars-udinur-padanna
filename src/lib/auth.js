import jwt from 'jsonwebtoken';

const extractToken = (cookieString) => {
  if (!cookieString || typeof cookieString !== 'string') return null;
  const row = cookieString.split('; ').find((r) => r.startsWith('token='));
  return row ? row.split('=')[1] : null;
};

export const getAuth = (req = null) => {
  let token;

  if (req) {
    // Server-side: Use cookies or headers
    token = req.cookies?.token || extractToken(req.headers?.get('cookie'));
  } else {
    // Client-side
    if (typeof document === 'undefined') return { user: null, token: null };
    token = extractToken(document.cookie);
  }

  if (!token) return { user: null, token: null };

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { user, token };
  } catch (err) {
    // Invalid/expired token: Clear on client-side
    if (!req && typeof document !== 'undefined') {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }
    return { user: null, token: null };
  }
};