// middlewares/logger.interceptor.js
const loggerInterceptor = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`);
    });
    next();
  };
  
  module.exports = loggerInterceptor;
  