const jwt = require('jsonwebtoken');
const TOKEN_KEY = process.env.TOKEN_KEY;
const logger = require('../utils/logger');
const User = require('../models/user');

exports.checkJWT = (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!!token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, TOKEN_KEY, async (err, decoded) => {
        if (err) {
          logger.warn('Invalid token');
          return res.status(401).json('Token not valid');
        } else {
          req.decoded = decoded;
          const userConnected = await User.findOne({
            _id: decoded.user.toString()
          });

          if (req.url === '/users') {
            if (decoded.role !== 'ADMIN') {
              logger.warn('Unauthorized, only Admin can access !');
              return res
                .status(401)
                .json('Unauthorized, only Admin can access !');
            }
          }

          const expiresIn = 24 * 60 * 60;
          const newToken = jwt.sign(
            {
              user: decoded.user
            },
            TOKEN_KEY,
            {
              expiresIn: expiresIn
            }
          );

          res.header('Authorization', 'Bearer ' + newToken);
          next();
        }
      });
    } else {
      logger.warn('Unauthorized: Token is required');
      return res.status(401).json('Token required');
    }
  } catch (error) {
    logger.warn('ERROR Server');
    return res.status(404).json('Bad requset');
  }
};
