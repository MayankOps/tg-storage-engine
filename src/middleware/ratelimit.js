const rateLimit = require("express-rate-limit");

// Strict rate limit for uploads (prevent spam)
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: "Too many uploads from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});

// Very lenient rate limit for downloads (allow multiple simultaneous downloads)
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 downloads per minute (very permissive for large file downloads)
  message: "Too many downloads from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for small requests or specific conditions
    return req.method === "GET";
  }
});

module.exports = {
  uploadLimiter,
  downloadLimiter
};