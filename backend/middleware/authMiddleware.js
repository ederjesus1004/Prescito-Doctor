import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No autorizado - Token no proporcionado",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                message: "No autorizado - Se requieren permisos de administrador",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "No autorizado - Token inválido",
        });
    }
}; 