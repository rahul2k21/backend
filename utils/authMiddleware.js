const jwt = require("jsonwebtoken");
const secretKey = require("../configuration/jwtConfig.js");

function isAuthorized(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token format" });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = user;
        next();
    });
}

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: Missing token" });
        }
        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid token format" });
        }
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }
            if (user?.role !== "admin") {
                return res.status(403).json({ message: "Access denied" });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(401).json({
            message: error?.message || "Authentication failed. Please log in again.",
        });
    }
};

module.exports = { isAuthorized, isAdmin };
