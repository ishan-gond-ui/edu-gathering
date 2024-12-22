import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false,
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false,
            });
        }

        req.id = decode.userId; // Attach user ID to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            message: 'Authentication failed',
            success: false,
            error: error.message, // Optional: expose error details
        });
    }
};

export default isAuthenticated;
