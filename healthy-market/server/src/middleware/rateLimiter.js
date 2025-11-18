const ipMap = new Map();

// Simple in-memory rate limiter: maxRequests per windowMs per IP
export const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60_000; // 1 minute
  const maxRequests = options.maxRequests || 60; // default 60 requests per minute

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    const entry = ipMap.get(ip) || { count: 0, start: now };

    if (now - entry.start > windowMs) {
      // reset window
      entry.count = 1;
      entry.start = now;
    } else {
      entry.count += 1;
    }

    ipMap.set(ip, entry);

    if (entry.count > maxRequests) {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
      return;
    }

    next();
  };
};
