const jwt = require("jsonwebtoken");
const isAdminMiddleware = (request, response, next) => {
    const authToken = request.headers.authorization?.split(' ')[1];

    if (!authToken) {
        return response.status(401).json({
                success: false,
                message: 'Access token is undefined'
            });
    }

    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRET);

        if (decode.role !== 'admin') {
            return response.status(403).json({
                success: false,
                message: 'Not enough access rights',
            });
        }
    } catch (error) {
        return response.status(401).json({
            success: false,
            message: error.message
        });
    }

    next();
}

module.exports = isAdminMiddleware;