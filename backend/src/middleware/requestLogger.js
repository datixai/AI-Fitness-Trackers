// src/middleware/requestLogger.js - Request Logging Middleware

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(`
🔹 ${req.method} ${req.path}
   IP: ${req.ip}
   Headers: ${JSON.stringify(req.headers['authorization'] ? 'Bearer ***' : 'none')}
  `);

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    
    // Log response
    console.log(`
   Status: ${res.statusCode}
   Duration: ${duration}ms
  `);

    res.send = originalSend;
    return res.send(data);
  };

  next();
};
