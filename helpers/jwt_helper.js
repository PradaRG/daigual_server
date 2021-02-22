const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const cliente = require("../helpers/init_redis");


module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "5m",
        issuer: "rtdevelopment.com.ar",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return next(createError.Unauthorized());
      req.payload(payload);  
      next();  
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "30 days",
        issuer: "rtdevelopment.com.ar",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err);
        // Almacena el token en Redis
        cliente.SET(userId, token, 'EX', 30 * 24 * 60 * 60, (err, respuesta) => {
          if (err) return (createError.InternalServerError());
          return resolve(token);
        }
        );
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.aud;

        cliente.GET(userId, (err, result) => {
          if (err) reject(createError.InternalServerError());
          if (refreshToken === result) return resolve(userId);
          reject(createError.Unauthorized());
        });
      }
      );
    });
  }
};
