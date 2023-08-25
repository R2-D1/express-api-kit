const jwt = require('jsonwebtoken');
const isLoggedInMiddleware = (request, response, next) => {
  const authToken = request.headers.authorization?.split(' ')[1];

  if (!authToken) {
    return response.status(401).json({
      success: false,
      message: 'Access token is undefined',
    });
  }

  try {
    jwt.verify(authToken, process.env.JWT_SECRET);
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: error.message,
    });
  }

  next();
};

module.exports = isLoggedInMiddleware;
